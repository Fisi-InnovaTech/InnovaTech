import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }
  async validate (payload:any){
    return {userId: payload.id, username: payload.name}
  }
}

