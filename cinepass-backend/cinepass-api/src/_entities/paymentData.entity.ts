import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IDTypeEntity } from './IDType.entity';
import { SaleEntity } from './sale.entity';

@Entity('paymentData')
export class PaymentDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  IDNumber: string;
  @Column()
  email: string;
  @ManyToOne(() => IDTypeEntity, (IDType) => IDType.paymentDatas)
  IDType: IDTypeEntity;
  @OneToMany(() => SaleEntity, (sale) => sale.paymentData)
  sales: SaleEntity[];
}