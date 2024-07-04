import { BadRequestException, Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ModeratorLoginAuthDto } from './dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from './dto/ModeratorRegisterAuthDto';

@Controller('/auth')
export class AuthUserController {

    constructor (private authUserService: AuthUserService,
        private jwtService: JwtService){}

    @UsePipes(new ValidationPipe)
    @Post('/login')
    async login(@Body() body: UserLoginAuthDto){
        const UserFound = await this.authUserService.getUser(body);
        if(!UserFound){
            throw new BadRequestException('User not found');
        }
        const {password} = body;
        const checkPassword = await compare(password, UserFound.password);
        if(!checkPassword){
            throw new BadRequestException('Password incorrect');
        }
        //creando el token
        const payload = {id: UserFound.id, name: UserFound.correo}
        const token = this.jwtService.sign(payload);
        const data = {token, user: UserFound, status: 200};
        return data;
    }

    @UsePipes(new ValidationPipe)
    @Post('/register')
    async register(@Body() body: UserRegisterAuthDto){
        return this.authUserService.registerUser(body);
    }

    @UsePipes(new ValidationPipe)
    @Post('/login-moderator')
    async loginModerator(@Body() body: ModeratorLoginAuthDto){
        const moderatorFound = await this.authUserService.getModerator(body);
        if(!moderatorFound){
            throw new BadRequestException('Moderator not found');
        }
        const {password} = body;
        const checkPassword = await compare(password, moderatorFound.password);
        if(!checkPassword){
            throw new BadRequestException('Password incorrect');
        }

        const payload = {id: moderatorFound.id, name: moderatorFound.correo}
        const token = this.jwtService.sign(payload);
        const data = {token, user: moderatorFound, status: 200};
        return data;
    }
    
    @UsePipes(new ValidationPipe)
    @Post('/register-moderator')
    async registerModerator(@Body() body: ModeratorRegisterAuthDto){
        const moderator = this.authUserService.registerModerator(body);
        return this.authUserService.registerModerator(body);
    } 

    @Post('/promoverUser/:userId')
    async upgradeUserToModerator( @Param('userId') userId: number ){
        const newMod = await this.authUserService.upgradeUserToModerator(userId);
        return this.authUserService.registerModerator(newMod);
    }
    
}
//logout es por parte del front
//elimina la cookie y ya no tiene acceso