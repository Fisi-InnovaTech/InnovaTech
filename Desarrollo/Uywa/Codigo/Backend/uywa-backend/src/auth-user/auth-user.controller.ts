import { BadRequestException, Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ModeratorLoginAuthDto } from './dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from './dto/ModeratorRegisterAuthDto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('/auth')
export class AuthUserController {
    constructor(
        private authUserService: AuthUserService,
        private jwtService: JwtService
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('/login')
    async login(@Body() body: UserLoginAuthDto) {
        const userFound = await this.authUserService.getUser(body);
        if (!userFound) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const isPasswordValid = await compare(body.password, userFound.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Contraseña incorrecta');
        }

        const payload = { 
            id: userFound.id,
            email: userFound.correo,
            isModerator: false
        };

        const token = this.jwtService.sign(payload);
        
        return {
            token,
            user: {
                id: userFound.id,
                nombre: userFound.nombre,
                email: userFound.correo,
                isModerator: false
            },
            status: 200
        };
    }

    @UsePipes(new ValidationPipe())
    @Post('/login-moderator')
    async loginModerator(@Body() body: ModeratorLoginAuthDto) {
        const moderatorFound = await this.authUserService.getModerator(body);
        if (!moderatorFound) {
            throw new BadRequestException('Moderador no encontrado');
        }

        const isPasswordValid = await compare(body.password, moderatorFound.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Contraseña incorrecta');
        }

        const payload = { 
            id: moderatorFound.id,
            email: moderatorFound.correo,
            isModerator: true
        };

        const token = this.jwtService.sign(payload);
        
        return {
            token,
            user: {
                id: moderatorFound.id,
                nombre: moderatorFound.nombre,
                email: moderatorFound.correo,
                isModerator: true
            },
            status: 200
        };
    }

    @UsePipes(new ValidationPipe())
    @Post('/register')
    async register(@Body() body: UserRegisterAuthDto) {
        return this.authUserService.registerUser(body);
    }

    @UsePipes(new ValidationPipe())
    @Post('/register-moderator')
    async registerModerator(@Body() body: ModeratorRegisterAuthDto) {
        return this.authUserService.registerModerator(body);
    }

    @Post('/promoverUser/:userId')
    async upgradeUserToModerator(@Param('userId') userId: number) {
        const userToPromote = await this.authUserService.upgradeUserToModerator(userId);
        return this.authUserService.registerModerator(userToPromote);
    }

    @Post('/promover/:userId')
    async upgradeUser(@Param('userId') userId: number) {
        return this.authUserService.upgradeUser(userId);
    }

    @Get('/allUsers')
    async getAllUsers() {
        return this.authUserService.getAllUsers();
    }

    @Get('/verify-moderator')
    @UseGuards(JwtAuthGuard)
    async verifyModerator(@Request() req) {
        // Verificación en dos pasos: token y base de datos
        if (!req.user?.isModerator) {
            throw new UnauthorizedException('Acceso restringido a moderadores');
        }

        const moderator = await this.authUserService.getModeratorById(req.user.id);
        if (!moderator) {
            throw new UnauthorizedException('Moderador no encontrado');
        }

        return {
            isValid: true,
            moderator: {
                id: moderator.id,
                nombre: moderator.nombre,
                email: moderator.correo,
                isModerator: true
            }
        };
    }
}