import { IsString } from 'class-validator';

export class StoreDTO {
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly location: string;

  @IsString()
  readonly address: string;
}
