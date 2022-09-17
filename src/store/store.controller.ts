import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { StoreDTO } from './store.dto';
import { Store } from './store.entity';
import { StoreService } from './store.service';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAllStores() {
    return await this.storeService.findAll();
  }

  @Get(':storeId')
  async findOneStore(@Param('storeId') storeId: string) {
    return await this.storeService.findOne(storeId);
  }

  @Post()
  @HttpCode(201)
  async createStore(@Body() storeDTO: StoreDTO) {
    const store: Store = plainToInstance(Store, storeDTO);
    return await this.storeService.create(store);
  }

  @Put(':storeId')
  async updateStore(
    @Param('storeId') storeId: string,
    @Body() storeDTO: StoreDTO,
  ) {
    const store: Store = plainToInstance(Store, storeDTO);
    return await this.storeService.update(storeId, store);
  }

  @Delete(':storeId')
  @HttpCode(204)
  async deleteStore(@Param('storeId') storeId: string) {
    return await this.storeService.delete(storeId);
  }
}
