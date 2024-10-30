import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AdminEntity } from "src/entities/admin.entity";
import { JwtService } from "src/jwt/jwt.service";
import { AdminsService } from "src/admin/admin.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtService: JwtService, 
        private adminsService: AdminsService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request : Request & {admin: AdminEntity} = context
            .switchToHttp()
            .getRequest();
            const token=request.headers.authorization;
            console.log(token)
            if(token==null){
                throw new UnauthorizedException('El token no existe')
            }
            const payload = this.jwtService.getPayload(token);
            const admin = await this.adminsService.findByEmail(payload.email);
            request.admin = admin;
            console.log(admin)
            return true;
        }catch(error){
            console.log(error)
            throw new UnauthorizedException(error?.message)
        }
    }   
}