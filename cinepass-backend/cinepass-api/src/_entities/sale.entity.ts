import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PaymentDataEntity } from './paymentData.entity';
import { TicketEntity } from './ticket.entity';
import { ShowEntity } from './show.entity';

@Entity('sales')
export class SaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'datetime' })
  dateAndTime: Date;
  @Column()
  ticketsAmount: number;
  @Column()
  totalPrice: number;
  @ManyToOne(() => PaymentDataEntity, (paymentData) => paymentData.sales)
  paymentData: PaymentDataEntity;
  @OneToMany(() => TicketEntity, (ticket) => ticket.sale)
  tickets: TicketEntity[];
}