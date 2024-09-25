import { UserI } from '../interfaces/user.interface';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements UserI {
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
  @ManyToMany(() => PermissionEntity, (permissions) => permissions.users)
  @JoinTable()
  permissions: PermissionEntity[];

  get permissionCodes() {
    return this.permissions.map(p=>p.name)
  }
}