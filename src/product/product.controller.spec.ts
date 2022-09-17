import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeProduct } from './product.enum';

jest.mock('./product.service');

describe('ProductController', () => {
  let controller: ProductController;
  let spyService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    spyService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllProducts method', () => {
    controller.findAllProducts();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOneProduct method', () => {
    controller.findOneProduct('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling createProduct method', () => {
    const mockProduct = {
      id: faker.random.alphaNumeric(),
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: TypeProduct.NO_PERECEDERO,
      stores: [],
    };
    controller.createProduct(mockProduct);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling updateProduct method', () => {
    const productId = faker.random.alphaNumeric();
    const mockProduct = {
      id: productId,
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: TypeProduct.NO_PERECEDERO,
      stores: [],
    };
    controller.updateProduct(productId, mockProduct);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling deleteProduct method', () => {
    controller.deleteProduct('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
