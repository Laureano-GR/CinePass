import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CityEntity } from './city.entity';

@Entity('addresses')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  street: string;
  @Column()
  number: number;
  @ManyToOne(() => CityEntity, (city) => city.addresses)
  city: CityEntity;
}