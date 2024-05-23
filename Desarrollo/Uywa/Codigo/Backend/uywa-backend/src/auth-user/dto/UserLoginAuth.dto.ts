import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @MinLength(5)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    password: string;
}