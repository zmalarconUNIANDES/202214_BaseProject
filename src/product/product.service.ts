import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductDTO } from './product.dto';
import { Product } from './product.entity';
import { TypeProduct } from './product.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ProductDTO[]> {
    return await this.productRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<ProductDTO> {
    const product = await this.productRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return product;
  }

  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    if (!(productDTO.type in TypeProduct)) {
      console.log(productDTO.type);
      throw new BusinessLogicException(
        'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
        BusinessError.BAD_REQUEST,
      );
    }
    const product = new Product();
    product.name = productDTO.name;
    product.price = productDTO.price;
    product.type = productDTO.type;
    return await this.productRepository.save(product);
  }

  async update(id: string, productDTO: ProductDTO): Promise<ProductDTO> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!(productDTO.type in TypeProduct)) {
      throw new BusinessLogicException(
        'The type product is invalid. Please use PERECEDERO or NO_PERECEDERO value',
        BusinessError.BAD_REQUEST,
      );
    }
    product.name = productDTO.name;
    product.price = productDTO.price;
    product.type = productDTO.type;
    await this.productRepository.save(product);
    return product;
  }

  async delete(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.productRepository.remove(product);
  }
}
