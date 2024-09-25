import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity('cities')
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  zipCode: string;
  @OneToMany(() => AddressEntity, (address) => address.city)
  addresses: AddressEntity[];
}