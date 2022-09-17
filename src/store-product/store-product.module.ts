import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/store.entity';
import { Product } from '../product/product.entity';
import { StoreProductService } from './store-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  providers: [StoreProductService],
})
export class StoreProductModule {}
