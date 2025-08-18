import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";
import { LoginCredentialDto } from "../dto/login-credential.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService : AuthService){
        super({ usernameField: 'email' });
    }
    
    async validate(email: string, password: string): Promise<any> {
        const loginCredentialDto: LoginCredentialDto = {email, password};
        const user = await this.authService.validateUser(loginCredentialDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}