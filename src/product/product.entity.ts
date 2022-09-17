import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Store } from '../store/store.entity';
import { TypeProduct } from './product.enum';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  type: TypeProduct;

  @ManyToMany(() => Store, (store) => store.products)
  stores: Store[];
}
