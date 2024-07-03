import { usuario, moderador } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ModeratorLoginAuthDto } from './dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from './dto/ModeratorRegisterAuthDto';

let users =[];
@Injectable()
export class AuthUserService {
    
    constructor (private prisma: PrismaService){}

    async registerUser(user:UserRegisterAuthDto){
        const {password} = user;
        const hashedPassword = await hash(password, 10);
        user = {...user, password: hashedPassword};
        console.log(hashedPassword);
        try {       
        return await this.prisma.usuario.create({
            data: {
                nombre: user.nombre,
                apellidos: user.apellidos, // Make sure 'apellidos' property exists in 'user' object
                correo: user.correo, // Make sure 'correo' property exists in 'user' object
                dni: user.dni, // Make sure 'dni' property exists in 'user' object
                password: user.password, // Make sure 'password' property exists in 'user' object
                estado: user.estado as string, // Make sure 'estado' property exists in 'user' object
                insignia: user.insignias || '1' // Make sure 'insignias' property exists in 'user' object
            }
        });
        } catch (error) {
            return {message: new BadRequestException('Error al registrar al usuario'), status: 400};
        }
    }

    async registerModerator(moderator: ModeratorRegisterAuthDto){
        const {password} = moderator;
        
        let hashedPassword;
        // Para evitar que se vuelva a hashear la contraseña al promover un usuario a moderador
        if (password.startsWith('$2b$')) {
            hashedPassword = password;
        } else {
            hashedPassword = await hash(password, 10);
        }

        moderator = {...moderator, password: hashedPassword};
        try {       
            return await this.prisma.moderador.create({
                data: {
                    nombre: moderator.nombre,
                    apellidos: moderator.apellidos,
                    correo: moderator.correo,
                    password: moderator.password,
                }
            });
        } catch (error) {
            return {message: new BadRequestException('Error al registrar al moderador'), status: 400};
        }
    }


    async getUser(user: UserLoginAuthDto): Promise<usuario> {
        return await this.prisma.usuario.findUnique({
            where: {
                correo: user.email
            }
        });
    }

    async getModerator(moderator: ModeratorLoginAuthDto): Promise<moderador> {
        return await this.prisma.moderador.findUnique({
            where: {
                correo: moderator.email
            }
        });
    }

    async upgradeUserToModerator(userId: number){
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: Number(userId) }
        });

        if(!usuario) throw new BadRequestException('Usuario no encontrado');

        const newModerator = {
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            password: usuario.password
        }

        return newModerator;
    }
}
