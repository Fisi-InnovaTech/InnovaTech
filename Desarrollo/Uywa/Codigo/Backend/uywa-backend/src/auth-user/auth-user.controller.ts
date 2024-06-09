import { BadRequestException, Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UserLoginAuthDto } from './dto/UserLoginAuth.dto';
import { UserRegisterAuthDto } from './dto/UserRegisterAuth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
        const user = this.authUserService.registerUser(body);
        return this.authUserService.registerUser(body);
    }
}
//logout es por parte del front
//elimina la cookie y ya no tiene acceso