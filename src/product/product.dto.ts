import { IsNumber, IsString } from 'class-validator';
import { TypeProduct } from './product.enum';

export class ProductDTO {
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  readonly type: TypeProduct;
}
