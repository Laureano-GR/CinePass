import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => UserEntity, (users) => users.permissions)
  users: UserEntity[];
}
