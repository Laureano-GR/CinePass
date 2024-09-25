import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { AddressEntity } from './address.entity';
import { MovieEntity } from './movie.entity';
import { ShowTypeEntity } from './showType.entity';
import { LanguageEntity } from './language.entity';
import { RoomEntity } from './room.entity';
import { SubsidiaryEntity } from './subsidiary.entity';
import { TicketEntity } from './ticket.entity';
import { SaleEntity } from './sale.entity';

@Entity('shows')
export class ShowEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamptz' }) //FIXME tal vez no  funcione, probar
  date_time_with_timezone: Date;
  @ManyToMany(() => MovieEntity, (movies) => movies.shows)
  @JoinTable()
  movies: MovieEntity[];
  @ManyToOne(() => ShowTypeEntity, (showType) => showType.shows)
  showType: ShowTypeEntity;
  @ManyToOne(() => LanguageEntity, (language) => language.shows)
  selectedLanguage: LanguageEntity;
  @ManyToOne(() => RoomEntity, (room) => room.shows)
  room: RoomEntity;
  @ManyToOne(() => SubsidiaryEntity, (subsidiary) => subsidiary.shows)
  subsidiary: SubsidiaryEntity;
  @OneToMany(() => TicketEntity, (ticket) => ticket.show)
  tickets: TicketEntity[];
  @OneToMany(() => SaleEntity, (sale) => sale.show)
  sales: SaleEntity[];
}