import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Store } from './store.entity';
import { StoreDTO } from './store.dto';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let repositoryStore: Repository<Store>;
  let storeList: Store[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repositoryStore = module.get<Repository<Store>>(getRepositoryToken(Store));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repositoryStore.clear();
    storeList = [];
    for (let i = 0; i < 5; i++) {
      const store: Store = await repositoryStore.save({
        name: faker.company.name(),
        location: faker.address.city(3),
      });
      storeList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreDTO[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storeList.length);
  });

  it('findOne should return a store by id', async () => {
    const mockStore: StoreDTO = storeList[0];
    const store: StoreDTO = await service.findOne(mockStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(mockStore.name);
    expect(store.location).toEqual(mockStore.location);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const store: Store = {
      id: '',
      name: 'BOG',
      location: faker.address.city(),
      products: [],
    };

    const newStore: StoreDTO = await service.create(store);
    expect(newStore).not.toBeNull();

    const mockStore: StoreDTO = await repositoryStore.findOne({
      where: { id: newStore.id },
    });
    expect(mockStore).not.toBeNull();
    expect(mockStore.name).toEqual(newStore.name);
    expect(mockStore.location).toEqual(newStore.location);
  });

  it('create should return a name store is invalid', async () => {
    const store: Store = {
      id: '',
      name: faker.company.name(),
      location: faker.address.city(),
      products: [],
    };

    await expect(() => service.create(store)).rejects.toHaveProperty(
      'message',
      'The name store is invalid',
    );
  });

  it('update should modify a store', async () => {
    const store: Store = storeList[0];
    store.name = 'New product';
    store.location = 'BOG';
    const updatedStore: StoreDTO = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();
    const mockStore: Store = await repositoryStore.findOne({
      where: { id: store.id },
    });
    expect(mockStore).not.toBeNull();
    expect(mockStore.name).toEqual(store.name);
    expect(mockStore.location).toEqual(store.location);
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: Store = storeList[0];
    store = {
      ...store,
      name: 'New product',
      location: 'MED',
    };
    await expect(() => service.update('0', store)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const store: Store = storeList[0];
    await service.delete(store.id);
    const deletedStore: Store = await repositoryStore.findOne({
      where: { id: store.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    const store: Store = storeList[0];
    await service.delete(store.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});
