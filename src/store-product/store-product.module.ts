import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/store.entity';
import { Product } from '../product/product.entity';
import { StoreService } from 'src/store/store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  providers: [StoreService],
})
export class StoreProductModule {}
