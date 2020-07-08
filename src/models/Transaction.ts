import {Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import Category from './Category';
@Entity('appointments')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('enum')
  type: 'income' | 'outcome';

  @Column('int')
  value: number;

  @Column('varchar')
  provider_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_id'})
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
