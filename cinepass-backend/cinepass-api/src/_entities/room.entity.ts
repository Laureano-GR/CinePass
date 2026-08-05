import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { SubsidiaryEntity } from './subsidiary.entity';
import { ShowTypeEntity } from './showType.entity';
import { ShowEntity } from './show.entity';

@Entity('rooms')
export class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  roomNumber: number;
  @Column()
  capacity: number;
  @ManyToOne(() => SubsidiaryEntity, (subsidiary) => subsidiary.rooms)
  subsidiary: SubsidiaryEntity;
  @ManyToMany(() => ShowTypeEntity, (showtypes) => showtypes.rooms)
  @JoinTable()
  showTypes: ShowTypeEntity[];
  @OneToMany(() => ShowEntity, (show) => show.room)
  shows: ShowEntity[];
}