import { Body, Controller, Get, Param, Post, Req, UseGuards, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { RequestWithUser } from 'src/interfaces/request-user';
import { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { DeepPartial } from 'typeorm';
import { CreatePermissionDto } from 'src/interfaces/create-permission.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request & {user:UserEntity}){
    return {firstName : req.user.firstName};
  }
  
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.service.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.service.register(body);
  }

  @UseGuards(AuthGuard)
  @Get('can-do/:permission')
  canDo(
    @Req() request: RequestWithUser,
    @Param('permission') permission: string,
  ) {
    return this.service.canDo(request.user, permission);
  }

  @Get('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers['refresh-token'] as string,
    );
  }

  @Get('')
    async findAll() {
      return await this.service.findAll();
    }

  @Put('update/:id')
    async updateUser(@Param('id') id: number,@Body() user: DeepPartial<UserEntity>): Promise<UserEntity> {
      const updatedUser = await this.service.updateUser(id, user);
      return updatedUser;
    }
    
  @Delete('delete/:id')
    async deleteUser(@Param('id') id: number): Promise<void> {
      return this.service.deleteUser(id);
    }
    
  @Post(':id/permissions')
  async assignPermissionToUser(
    @Param('id') id: number,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.service.assignPermissionToUser(id, createPermissionDto);
  }

}