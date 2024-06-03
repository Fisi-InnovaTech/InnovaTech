import { usuario } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

let users =[];
@Injectable()
export class AuthUserService {
    
    constructor (private prisma: PrismaService){}

    async registerUser(user:UserRegisterAuthDto){
        const {password} = user;
        const hashedPassword = await hash(password, 10);
        console.log(hashedPassword);
        user = {...user, password: hashedPassword}; // Add semicolon at the end
        try {       
        return await this.prisma.usuario.create({
            data: {
                nombre: user.nombre,
                apellidos: user.apellidos, // Make sure 'apellidos' property exists in 'user' object
                correo: user.correo, // Make sure 'correo' property exists in 'user' object
                dni: user.dni, // Make sure 'dni' property exists in 'user' object
                password: user.password, // Make sure 'password' property exists in 'user' object
                estado: user.estado as string, // Make sure 'estado' property exists in 'user' object
                insignia: user.insignias // Make sure 'insignias' property exists in 'user' object
            }
        });
        } catch (error) {
            return new BadRequestException('Error al registrar al usuario');
        }
    }

    async getUser(user: UserLoginAuthDto): Promise<usuario> {
        return await this.prisma.usuario.findUnique({
            where: {
                correo: user.email
            }
        });
    }


}
