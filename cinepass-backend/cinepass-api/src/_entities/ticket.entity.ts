import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SaleEntity } from './sale.entity';
import { ShowEntity } from './show.entity';

@Entity('tickets')
export class TicketEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SaleEntity, (sale) => sale.tickets)
  sale: SaleEntity;
  @ManyToOne(() => ShowEntity, (show) => show.tickets)
  show: ShowEntity;
}
