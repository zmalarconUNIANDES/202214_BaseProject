import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';

import { Store } from './store/store.entity';
import { Product } from './product/product.entity';
import { StoreProductModule } from './store-product/store-product.module';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'partial',
      entities: [Store, Product],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    StoreProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
