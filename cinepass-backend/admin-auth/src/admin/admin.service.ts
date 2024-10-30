import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { AdminI } from 'src/interfaces/admin.interface';
import { AdminEntity } from '../entities/admin.entity';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { DeepPartial } from 'typeorm';
import { CreatePermissionDto } from 'src/interfaces/create-permission.dto';
import { PermissionEntity } from 'src/entities/permission.entity';
import * as moment from 'moment';

@Injectable()
export class AdminsService {
  repository = AdminEntity;
  constructor(private jwtService: JwtService) {}

  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }

  async canDo(admin: AdminI, permission: string) {
    const result = admin.permissionCodes.includes(permission);
    if (!result){
      throw new UnauthorizedException()
    }
    return true
  }
  
  async register(body: RegisterDTO) { 
    try {
      const admin = new AdminEntity();
      Object.assign(admin, body);
      admin.password = hashSync(admin.password, 10);
      admin.subsidiaryCode = hashSync(admin.subsidiaryCode, 10);
      await this.repository.save(admin);
      return { status: 'Created' };
    } catch (error) {
      throw new HttpException('Error de creación', 500);
    }
  }

  async login(body: LoginDTO) {
    const admin = await this.findByEmail(body.email);
    if (admin == null) {
      throw new UnauthorizedException();
    }
    const compareResult = compareSync(body.password, admin.password);
    if (!compareResult) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.jwtService.generateToken({ email: admin.email }, 'auth'),
      refreshToken: this.jwtService.generateToken(
        { email: admin.email },
        'refresh',
      ),
      expirationTime: moment().add(10, 'minutes').toDate(),
    };
  }

  async findByEmail(email: string): Promise<AdminEntity> {
    return await this.repository.findOne({where:{email},relations:{permissions:true}  });
  }
  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find admins error', 500);
    }
  }

  async updateAdmin(
    adminId: number,
    admin: DeepPartial<AdminEntity>,
  ): Promise<AdminEntity> {
    try {
      const existingAdmin = await this.repository.findOne({where:{id:adminId}});
      if (!existingAdmin) {
        throw new HttpException('Admin not found', 404);
      }
      Object.assign(existingAdmin, admin);

      const updatedAdmin = await this.repository.save(existingAdmin);
      return updatedAdmin;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update admin error', 500);
    }
  }

  async deleteAdmin(id: number): Promise<void> {
    const deletedAdmin = await this.repository.delete(id);
      if (deletedAdmin.affected === 0) {
        throw new HttpException('Delete admin error',500);
      } 
  }

  async assignPermissionToAdmin(adminId: number, createPermissionDto: CreatePermissionDto): Promise<AdminEntity> {
    const admin = await this.repository.findOne({ where: { id: adminId }, relations: {permissions:true} });
    if (!admin) {
      throw new HttpException('Assign permission to admin error: admin not found', 500);
    }
  
    const permission = await PermissionEntity.findOne({ where: { id: createPermissionDto.permissionId } });
    if (!permission) {
      throw new HttpException('Assign permission to admin error: permission not found', 500);
    }
    console.log(admin)
  
    admin.permissions.push(permission);
    return this.repository.save(admin);
  }

}



