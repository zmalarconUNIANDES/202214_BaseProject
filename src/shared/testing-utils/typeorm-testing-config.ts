import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../store/store.entity';
import { Product } from '../../product/product.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Store, Product],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([Store, Product]),
];
