import { usuario, moderador } from '.prisma/client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModeratorLoginAuthDto } from './dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from './dto/ModeratorRegisterAuthDto';

@Injectable()
export class AuthUserService {
    private readonly logger = new Logger(AuthUserService.name);
    
    constructor(private readonly prisma: PrismaService) {}

    async registerUser(user: UserRegisterAuthDto) {
        const existingUser = await this.prisma.usuario.findUnique({
            where: { correo: user.correo }
        });
    
        if (existingUser) {
            throw new BadRequestException('El correo electrónico ya está registrado');
        }
    
        try {
            const hashedPassword = await hash(user.password, 10);
            return await this.prisma.usuario.create({
                data: {
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    correo: user.correo,
                    dni: user.dni,
                    password: hashedPassword,
                    estado: user.estado,
                    insignia: user.insignias || '1'
                }
            });
        } catch (error) {
            this.logger.error(`User registration failed: ${error.message}`);
            throw new BadRequestException('Error al registrar al usuario');
        }
    }

    async registerModerator(moderator: ModeratorRegisterAuthDto) {
        try {
            const hashedPassword = moderator.password.startsWith('$2b$') 
                ? moderator.password 
                : await hash(moderator.password, 10);

            return await this.prisma.moderador.create({
                data: {
                    nombre: moderator.nombre,
                    apellidos: moderator.apellidos,
                    correo: moderator.correo,
                    password: hashedPassword,
                }
            });
        } catch (error) {
            this.logger.error(`Moderator registration failed: ${error.message}`);
            if (error.code === 'P2002') {
                throw new BadRequestException('El correo electrónico ya está registrado');
            }
            throw new BadRequestException('Error al registrar al moderador');
        }
    }

    async getUser(user: UserLoginAuthDto): Promise<usuario | null> {
        return this.prisma.usuario.findUnique({
            where: { correo: user.email }
        });
    }

    async getModerator(moderator: ModeratorLoginAuthDto): Promise<moderador | null> {
        return this.prisma.moderador.findUnique({
            where: { correo: moderator.email }
        });
    }

    async upgradeUserToModerator(userId: number) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        try {
            return await this.prisma.$transaction([
                this.prisma.moderador.create({
                    data: {
                        nombre: user.nombre,
                        apellidos: user.apellidos,
                        correo: user.correo,
                        password: user.password
                    }
                }),
                this.prisma.usuario.delete({
                    where: { id: Number(userId) }
                })
            ]).then(([moderator]) => moderator);
        } catch (error) {
            this.logger.error(`User upgrade failed: ${error.message}`);
            if (error.code === 'P2002') {
                throw new BadRequestException('El moderador ya existe');
            }
            throw new BadRequestException('Error al promover al usuario');
        }
    }

    async upgradeUser(userId: number) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const insigniaNumber = parseInt(user.insignia, 10);
        if (isNaN(insigniaNumber)) {
            throw new BadRequestException('Insignia no válida');
        }

        try {
            return await this.prisma.usuario.update({
                where: { id: Number(userId) },
                data: { insignia: String(insigniaNumber + 1) }
            });
        } catch (error) {
            this.logger.error(`User promotion failed: ${error.message}`);
            throw new BadRequestException('No se pudo promover al usuario');
        }
    }

    async getAllUsers() {
        return this.prisma.usuario.findMany();
    }
}