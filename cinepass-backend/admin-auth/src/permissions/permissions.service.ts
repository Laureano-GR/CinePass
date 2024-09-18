import { HttpException, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permission.entity';

@Injectable()
export class PermissionsService {
    repository = PermissionEntity;
    
    async create(permission: DeepPartial<PermissionEntity>): Promise<PermissionEntity> {
        try {
        return await this.repository.save(permission);
        } catch (error) {
        throw new HttpException('Create permission error', 500);
        }
    }
    
    async findAll() {
        try {
          return await this.repository.find();
        } catch (error) {
          throw new HttpException('Find permissions error', 500);
        }
    }
    
    async updatePermission(
        permissionId: number,
        permission: DeepPartial<PermissionEntity>,
      ): Promise<PermissionEntity> {
        try {
          const existingPermission = await this.repository.findOne({where:{id:permissionId}});
          if (!existingPermission) {
            throw new HttpException('Permission not found', 404);
          }
          Object.assign(existingPermission, permission);
    
          const updatedPermission = await this.repository.save(existingPermission);
          return updatedPermission;
        } catch (error) {
          if (error instanceof HttpException) {
            throw error; 
          }
          throw new HttpException('Update permission error', 500);
        }
    }
      
    async deletePermission(id: number): Promise<void> {
      const deletedPermission = await this.repository.delete(id);
        if (deletedPermission.affected === 0) {
          throw new HttpException('Delete permission error',500);
        } 
    } 
}