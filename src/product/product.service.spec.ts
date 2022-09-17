import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Product } from './product.entity';
import { ProductDTO } from './product.dto';
import { ProductService } from './product.service';
import { TypeProduct } from './product.enum';

describe('ProductService', () => {
  let service: ProductService;
  let repositoryProduct: Repository<Product>;
  let productsList: Product[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repositoryProduct = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repositoryProduct.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: Product = await repositoryProduct.save({
        name: faker.company.name(),
        price: faker.datatype.number(),
        type: TypeProduct.NO_PERECEDERO,
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductDTO[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const mockProduct: ProductDTO = productsList[0];
    const product: ProductDTO = await service.findOne(mockProduct.id);
    expect(product).not.toBeNull();

    expect(product.name).toEqual(mockProduct.name);
    expect(product.price).toEqual(mockProduct.price);
    expect(product.type).toEqual(mockProduct.type);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const product: Product = {
      id: '',
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: TypeProduct.PERECEDERO,
      stores: [],
    };

    const newProduct: ProductDTO = await service.create(product);
    expect(newProduct).not.toBeNull();

    const mockProduct: ProductDTO = await repositoryProduct.findOne({
      where: { id: newProduct.id },
    });
    expect(mockProduct).not.toBeNull();
    expect(mockProduct.name).toEqual(newProduct.name);
    expect(mockProduct.price).toEqual(newProduct.price);
    expect(mockProduct.type).toEqual(newProduct.type);
  });

  it('update should modify a product', async () => {
    const product: Product = productsList[0];
    product.name = 'New product';
    product.price = 150;
    product.type = TypeProduct.NO_PERECEDERO;
    const updatedProduct: ProductDTO = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const mockProduct: Product = await repositoryProduct.findOne({
      where: { id: product.id },
    });
    expect(mockProduct).not.toBeNull();
    expect(mockProduct.name).toEqual(product.name);
    expect(mockProduct.price).toEqual(product.price);
    expect(mockProduct.type).toEqual(product.type);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: Product = productsList[0];
    product = {
      ...product,
      name: 'New product',
      price: 500,
      type: TypeProduct.PERECEDERO,
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const product: Product = productsList[0];
    await service.delete(product.id);
    const deletedProduct: Product = await repositoryProduct.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: Product = productsList[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
