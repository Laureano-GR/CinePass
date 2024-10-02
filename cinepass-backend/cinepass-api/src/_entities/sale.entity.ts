import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PaymentDataEntity } from './paymentData.entity';
import { TicketEntity } from './ticket.entity';
import { ShowEntity } from './show.entity';

@Entity('sales')
export class SaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  ticketsAmount: number;
  @ManyToOne(() => PaymentDataEntity, (paymentData) => paymentData.sales)
  paymentData: PaymentDataEntity;
  @OneToMany(() => TicketEntity, (ticket) => ticket.sale)
  tickets: TicketEntity[];
  @ManyToOne(() => ShowEntity, (show) => show.sales)
  show: ShowEntity;
}