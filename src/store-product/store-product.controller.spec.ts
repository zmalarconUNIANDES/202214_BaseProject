import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { StoreProductController } from './store-product.controller';

import { StoreProductService } from './store-product.service';

jest.mock('./store-product.service');

describe('StoreProductController', () => {
  let controller: StoreProductController;
  let spyService: StoreProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [StoreProductController],
      providers: [StoreProductService],
    }).compile();

    controller = module.get<StoreProductController>(StoreProductController);
    spyService = module.get<StoreProductService>(StoreProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling addStoreToProduct method', () => {
    controller.addStoreToProduct('1', '1');
    expect(spyService.addStoreToProduct).toHaveBeenCalled();
  });

  it('calling findAllStoresByProduct method', () => {
    controller.findAllStoresByProduct('1');
    expect(spyService.findStoresFromProduct).toHaveBeenCalled();
  });

  it('calling findOneStoreByProduct method', () => {
    controller.findOneStoreByProduct('1', '1');
    expect(spyService.findStoreFromProduct).toHaveBeenCalled();
  });

  it('calling updateStoresByProduct method', () => {
    const mockStore = {
      id: faker.random.alphaNumeric(),
      name: faker.company.name(),
      location: faker.datatype.string(3),
      address: faker.address.direction(),
    };
    controller.updateStoresByProduct('1', [mockStore]);
    expect(spyService.updateStoresFromProduct).toHaveBeenCalled();
  });

  it('calling deleteStoreByProduct method', () => {
    controller.deleteStoreByProduct('1', '1');
    expect(spyService.deleteStoreFromProduct).toHaveBeenCalled();
  });
});
