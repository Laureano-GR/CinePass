import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserI } from 'src/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { DeepPartial } from 'typeorm';
import { CreatePermissionDto } from 'src/interfaces/create-permission.dto';
import { PermissionEntity } from 'src/entities/permission.entity';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  repository = UserEntity;
  constructor(private jwtService: JwtService) {}

  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }

  async canDo(user: UserI, permission: string) {
    const result = user.permissionCodes.includes(permission);
    if (!result){
      throw new UnauthorizedException()
    }
    return true
  }
  async register(body: RegisterDTO) {
    try{
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);
      return await this.repository.save(user);
      return {status: 'Created'};
    } catch (error){
      throw new HttpException('Error de creacion',500)
    }
  }

  async login(body: LoginDTO) {
    const user = await this.findByEmail(body.email);
    if (user == null) {
      throw new UnauthorizedException();
    }
    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
      refreshToken: this.jwtService.generateToken(
        { email: user.email },
        'refresh',
      ),
      expirationTime: moment().add(10, 'minutes').toDate(),
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOne({where:{email},relations:{permissions:true}  });
  }
  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find users error', 500);
    }
  }

  async updateUser(
    userId: number,
    user: DeepPartial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      const existingUser = await this.repository.findOne({where:{id:userId}});
      if (!existingUser) {
        throw new HttpException('User not found', 404);
      }
      Object.assign(existingUser, user);

      const updatedUser = await this.repository.save(existingUser);
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update user error', 500);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const deletedUser = await this.repository.delete(id);
      if (deletedUser.affected === 0) {
        throw new HttpException('Delete user error',500);
      } 
  }

  async assignPermissionToUser(userId: number, createPermissionDto: CreatePermissionDto): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id: userId }, relations: {permissions:true} });
    if (!user) {
      throw new HttpException('Assign permission to user error: user not found', 500);
    }
  
    const permission = await PermissionEntity.findOne({ where: { id: createPermissionDto.permissionId } });
    if (!permission) {
      throw new HttpException('Assign permission to user error: permission not found', 500);
    }
    console.log(user)
  
    user.permissions.push(permission);
    return this.repository.save(user);
  }

}



