import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) {}

    getUseridFromToken(token: string): any {
        const id = this.jwtService.decode(token);
        return id['userid'];
    }
}
