import { Body, Controller, Get, Param, Post, Req, UseGuards, Put, Delete } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { RequestWithAdmin } from 'src/interfaces/request-admin';
import { Request } from 'express';
import { AdminEntity } from 'src/entities/admin.entity';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { DeepPartial } from 'typeorm';
import { CreatePermissionDto } from 'src/interfaces/create-permission.dto';

@Controller('admins')
export class AdminsController {
  constructor(private service: AdminsService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request & {admin:AdminEntity}){
    return {firstName : req.admin.firstName};
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
    @Req() request: RequestWithAdmin,
    @Param('permission') permission: string,
  ) {
    return this.service.canDo(request.admin, permission);
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
    async updateAdmin(@Param('id') id: number,@Body() admin: DeepPartial<AdminEntity>): Promise<AdminEntity> {
      const updatedAdmin = await this.service.updateAdmin(id, admin);
      return updatedAdmin;
    }
    
  @Delete('delete/:id')
    async deleteAdmin(@Param('id') id: number): Promise<void> {
      return this.service.deleteAdmin(id);
    }
    
  @Post(':id/permissions')
  async assignPermissionToAdmin(
    @Param('id') id: number,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.service.assignPermissionToAdmin(id, createPermissionDto);
  }

}