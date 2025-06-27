import { usuario, moderador } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ModeratorLoginAuthDto } from './dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from './dto/ModeratorRegisterAuthDto';

@Injectable()
export class AuthUserService {
    constructor(private prisma: PrismaService) {}

    async registerUser(user: UserRegisterAuthDto) {
        const hashedPassword = await hash(user.password, 10);
        
        try {
            return await this.prisma.usuario.create({
                data: {
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    correo: user.correo,
                    dni: user.dni,
                    password: hashedPassword,
                    estado: 'activo',
                    insignia: '1'
                }
            });
        } catch (error) {
            throw new BadRequestException('Error al registrar usuario');
        }
    }

    async registerModerator(moderator: ModeratorRegisterAuthDto) {
        const hashedPassword = moderator.password.startsWith('$2b$') 
            ? moderator.password 
            : await hash(moderator.password, 10);

        try {
            return await this.prisma.moderador.create({
                data: {
                    nombre: moderator.nombre,
                    apellidos: moderator.apellidos,
                    correo: moderator.correo,
                    password: hashedPassword,
                }
            });
        } catch (error) {
            throw new BadRequestException('Error al registrar moderador');
        }
    }

    async getUser(user: UserLoginAuthDto): Promise<usuario> {
        return this.prisma.usuario.findUnique({
            where: { correo: user.email }
        });
    }

    async getModerator(moderator: ModeratorLoginAuthDto): Promise<moderador> {
        return this.prisma.moderador.findUnique({
            where: { correo: moderator.email }
        });
    }

    async getModeratorById(id: number): Promise<moderador> {
        return this.prisma.moderador.findUnique({
            where: { id }
        });
    }

    async upgradeUserToModerator(userId: number) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        return {
            nombre: user.nombre,
            apellidos: user.apellidos,
            correo: user.correo,
            password: user.password
        };
    }

    async upgradeUser(userId: number) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const newInsignia = String(parseInt(user.insignia, 10) + 1);

        return this.prisma.usuario.update({
            where: { id: Number(userId) },
            data: { insignia: newInsignia }
        });
    }

    async getAllUsers() {
        return this.prisma.usuario.findMany();
    }
}