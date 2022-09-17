import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/store.entity';
import { Product } from '../product/product.entity';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  providers: [StoreProductService],
  controllers: [StoreProductController],
})
export class StoreProductModule {}
