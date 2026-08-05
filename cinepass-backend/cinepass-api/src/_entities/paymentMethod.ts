import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PaymentDataEntity } from './paymentData.entity';

@Entity('paymentMethods')
export class PaymentMethodEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => PaymentDataEntity, (paymentData) => paymentData.paymentMethod)
  paymentDatas: PaymentDataEntity[];
}