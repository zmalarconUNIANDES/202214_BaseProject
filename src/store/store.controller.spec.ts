import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { StoreService } from './store.service';
import { StoreController } from './store.controller';

jest.mock('./store.service');
describe('StoreController', () => {
  let controller: StoreController;
  let spyService: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [StoreController],
      providers: [StoreService],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    spyService = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllStores method', () => {
    controller.findAllStores();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOneStore method', () => {
    controller.findOneStore('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling createStore method', () => {
    const mockStore = {
      id: faker.random.alphaNumeric(),
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
      products: [],
    };
    controller.createStore(mockStore);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling updateStore method', () => {
    const storeId = faker.random.alphaNumeric();
    const mockStore = {
      id: faker.random.alphaNumeric(),
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
      products: [],
    };
    controller.updateStore(storeId, mockStore);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling deleteStore method', () => {
    controller.deleteStore('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
