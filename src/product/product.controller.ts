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
import { ProductDTO } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllProducts() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  async findOneProduct(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Post()
  @HttpCode(201)
  async createProduct(@Body() productDTO: ProductDTO) {
    const product: Product = plainToInstance(Product, productDTO);
    return await this.productService.create(product);
  }

  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() productDTO: ProductDTO,
  ) {
    const product: Product = plainToInstance(Product, productDTO);
    return await this.productService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(204)
  async deleteProduct(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
