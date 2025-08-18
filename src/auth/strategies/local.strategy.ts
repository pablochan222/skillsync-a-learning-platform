import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";
import { LoginCredentialDto } from "../dto/login-credential.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService : AuthService){
        super({ 
            usernameField: 'email',
            passReqToCallback: true 
        });
    }
    
    async validate(req: Request, email: string, password: string): Promise<any> {
        const { role } = req.body;
        const loginCredentialDto: LoginCredentialDto = {email, password, role};
        const user = await this.authService.validateUser(loginCredentialDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}