import { Controller, Post, Body, Get, Put, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permission.entity';

@Controller('permissions')
export class PermissionsController {
    constructor(private service: PermissionsService) {}

    @Post()
    async create(@Body() permission: DeepPartial<PermissionEntity>,): Promise<PermissionEntity> {
      return await this.service.create(permission);
    }

    @Get()
    async findAll() {
      return await this.service.findAll();
    }

    @Put('update/:id')
    async updatePermission(@Param('id') id: number,@Body() permission: DeepPartial<PermissionEntity>): Promise<PermissionEntity> {
    const updatedPermission = await this.service.updatePermission(id, permission);
    return updatedPermission;
    }

    @Delete('delete/:id')
    async deletePermission(@Param('id') id: number): Promise<void> {
      return this.service.deletePermission(id);
    }
  
}
