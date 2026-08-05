import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PaymentDataEntity } from './paymentData.entity';

@Entity('IDTypes')
export class IDTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => PaymentDataEntity, (paymentData) => paymentData.IDType)
  paymentDatas: PaymentDataEntity[];
}