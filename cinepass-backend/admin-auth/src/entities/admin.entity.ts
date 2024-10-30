import { AdminI } from 'src/interfaces/admin.interface';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity('admins')
export class AdminEntity extends BaseEntity implements AdminI {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  subsidiaryCode: string; //codigo de linkeo con sucursal
  @ManyToMany(() => PermissionEntity, (permissions) => permissions.admins)
  @JoinTable()
  permissions: PermissionEntity[];

  get permissionCodes() {
    return this.permissions.map(p=>p.name)
  }
}