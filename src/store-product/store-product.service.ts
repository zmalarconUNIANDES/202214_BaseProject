import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

import { Store } from '../store/store.entity';
import { Product } from '../product/product.entity';

import { StoreDTO } from '../store/store.dto';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addStoreToProduct(
    productId: string,
    storeId: string,
  ): Promise<Product> {
    const store: Store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    product.stores = [...product.stores, store];
    return await this.productRepository.save(product);
  }

  async findStoresFromProduct(productId: string): Promise<StoreDTO[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return product.stores;
  }

  async findStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<StoreDTO> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      loadRelationIds: true,
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const storeProduct = product.stores.find((e) => e.id === store.id);

    if (!storeProduct)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    return storeProduct;
  }

  async updateStoresFromProduct(
    productId: string,
    stores: Store[],
  ): Promise<Product> {
    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });

    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < stores.length; i++) {
      const store: Store = await this.storeRepository.findOne({
        where: { id: stores[i].id },
      });
      if (!store)
        throw new BusinessLogicException(
          'The store with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    product.stores = stores;
    return await this.productRepository.save(product);
  }

  async deleteStoreFromProduct(productId: string, storeId: string) {
    const store: Store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const storeProduct: Store = product.stores.find((e) => e.id === store.id);

    if (!storeProduct)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    product.stores = product.stores.filter((e) => e.id !== storeId);
    await this.productRepository.save(product);
  }
}
