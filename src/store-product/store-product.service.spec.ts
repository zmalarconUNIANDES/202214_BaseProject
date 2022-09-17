import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Store } from '../store/store.entity';
import { Product } from '../product/product.entity';
import { StoreDTO } from '../store/store.dto';
import { StoreProductService } from './store-product.service';
import { TypeProduct } from '../product/product.enum';

describe('StoreProductService', () => {
  let service: StoreProductService;
  let storeRepository: Repository<Store>;
  let productRepository: Repository<Product>;
  let product: Product;
  let storeList: Store[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreProductService],
    }).compile();

    service = module.get<StoreProductService>(StoreProductService);
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    storeRepository.clear();
    productRepository.clear();
    storeList = [];

    for (let i = 0; i < 5; i++) {
      const store = new Store();
      store.name = faker.company.name();
      store.location = faker.datatype.string(3);
      store.address = faker.address.direction();
      await storeRepository.save(store);
      storeList.push(store);
    }

    product = await productRepository.save({
      name: faker.word.adjective(),
      price: faker.datatype.number(),
      type: TypeProduct.NO_PERECEDERO,
      stores: storeList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an store to a product', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    const newProduct: Product = await productRepository.save({
      name: faker.word.adjective(),
      price: faker.datatype.number(),
      type: TypeProduct.PERECEDERO,
    });

    const result: Product = await service.addStoreToProduct(
      newProduct.id,
      newStore.id,
    );

    expect(result.stores.length).toBe(1);
    expect(result.stores[0]).not.toBeNull();
    expect(result.stores[0].name).toBe(newStore.name);
    expect(result.stores[0].location).toBe(newStore.location);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    const newProduct: Product = await productRepository.save({
      name: faker.word.adjective(),
      price: faker.datatype.number(),
      type: TypeProduct.PERECEDERO,
    });

    await expect(() =>
      service.addStoreToProduct(newProduct.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid product', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoresFromProduct should return stores by product', async () => {
    const stores: StoreDTO[] = await service.findStoresFromProduct(product.id);
    expect(stores.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoreFromProduct should return store by product', async () => {
    const store: Store = storeList[0];
    const mockStore: StoreDTO = await service.findStoreFromProduct(
      product.id,
      store.id,
    );
    expect(mockStore).not.toBeNull();
    expect(mockStore.name).toBe(store.name);
    expect(mockStore.location).toBe(store.location);
    expect(mockStore.address).toBe(store.address);
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(() =>
      service.findStoreFromProduct(product.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    const store: Store = storeList[0];
    await expect(() =>
      service.findStoreFromProduct('0', store.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an store not associated to the product', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    await expect(() =>
      service.findStoreFromProduct(product.id, newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });

  it('updateStoresFromProduct should update stores list for a product', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    const updateProduct: Product = await service.updateStoresFromProduct(
      product.id,
      [newStore],
    );
    expect(updateProduct.stores.length).toBe(1);

    expect(updateProduct.stores[0].name).toBe(newStore.name);
    expect(updateProduct.stores[0].location).toBe(newStore.location);
  });

  it('updateStoresFromProduct should throw an exception for an invalid product', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [newStore]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid store', async () => {
    const newStore: Store = storeList[0];
    newStore.id = '0';

    await expect(() =>
      service.updateStoresFromProduct(product.id, [newStore]),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should remove an store from a product', async () => {
    const store: Store = storeList[0];

    await service.deleteStoreFromProduct(product.id, store.id);

    const mockProduct: Product = await productRepository.findOne({
      where: { id: product.id },
      relations: ['stores'],
    });
    const deletedStore: Store = mockProduct.stores.find(
      (a) => a.id === store.id,
    );

    expect(deletedStore).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(product.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid museum', async () => {
    const store: Store = storeList[0];
    await expect(() =>
      service.deleteStoreFromProduct('0', store.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated store', async () => {
    const newStore: Store = await storeRepository.save({
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(product.id, newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });
});
