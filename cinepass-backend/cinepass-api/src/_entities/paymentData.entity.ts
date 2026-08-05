import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IDTypeEntity } from './IDType.entity';
import { SaleEntity } from './sale.entity';
import { PaymentMethodEntity } from './paymentMethod';

@Entity('paymentData')
export class PaymentDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  IDNumber: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @ManyToOne(() => IDTypeEntity, (IDType) => IDType.paymentDatas)
  IDType: IDTypeEntity;
  @ManyToOne(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.paymentDatas)
  paymentMethod: PaymentMethodEntity;
  @OneToMany(() => SaleEntity, (sale) => sale.paymentData)
  sales: SaleEntity[];
}