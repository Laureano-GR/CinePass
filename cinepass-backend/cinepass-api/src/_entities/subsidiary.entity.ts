import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AddressEntity } from './address.entity';
import { RoomEntity } from './room.entity';
import { ShowEntity } from './show.entity';

@Entity('subsidiaries')
export class SubsidiaryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column() //codigo de linkeo con sucursal
  subsidiaryCode: string;
  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity
  @OneToMany(() => RoomEntity, (rooms) => rooms.subsidiary)
  rooms: RoomEntity[];
  @OneToMany(() => ShowEntity, (show) => show.subsidiary)
  shows: ShowEntity[];
  
}