import {
  Get,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { StoreDTO } from '../store/store.dto';
import { Store } from '../store/store.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { StoreProductService } from './store-product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreProductController {
  constructor(private readonly storeProductService: StoreProductService) {}

  @Post(':productId/stores/storeId')
  @HttpCode(201)
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.addStoreToProduct(productId, storeId);
  }

  @Get(':productId/stores')
  async findAllStoresByProduct(@Param('productId') productId: string) {
    return await this.storeProductService.findStoresFromProduct(productId);
  }

  @Get(':productId/recipes/:recipeId')
  async findOneStoreByProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.findStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Put(':productId/stores')
  async updateStoresByProduct(
    @Param('productId') productId: string,
    @Body() storeDTO: StoreDTO[],
  ) {
    const stores = plainToInstance(Store, storeDTO);
    return await this.storeProductService.updateStoresFromProduct(
      productId,
      stores,
    );
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  async deleteStoreByProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.deleteStoreFromProduct(
      productId,
      storeId,
    );
  }
}
