import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => AdminEntity, (admins) => admins.permissions)
  admins: AdminEntity[];
}
