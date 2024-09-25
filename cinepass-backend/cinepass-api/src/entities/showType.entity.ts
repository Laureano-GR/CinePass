import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { RoomEntity } from './room.entity';
import { ShowEntity } from './show.entity';

@Entity('showTypes')
export class ShowTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  ticketPrice: number;
  @ManyToMany(() => RoomEntity, (rooms) => rooms.showTypes)
  @JoinTable()
  rooms: RoomEntity[];
  @OneToMany(() => ShowEntity, (show) => show.showType)
  shows: ShowEntity[];
}