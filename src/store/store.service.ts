import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { StoreDTO } from './store.dto';
import { Store } from './store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<StoreDTO[]> {
    return await this.storeRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<StoreDTO> {
    const store = await this.storeRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return store;
  }

  async create(storeDTO: StoreDTO): Promise<StoreDTO> {
    const store = new Store();
    if (storeDTO.location.length < 3 || storeDTO.location.length > 3)
      throw new BusinessLogicException(
        'The location store is invalid',
        BusinessError.BAD_REQUEST,
      );
    store.name = storeDTO.name;
    store.location = storeDTO.location;
    store.address = storeDTO.address;
    return await this.storeRepository.save(store);
  }

  async update(id: string, storeDTO: StoreDTO): Promise<StoreDTO> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (storeDTO.location.length < 3 || storeDTO.location.length > 3)
      throw new BusinessLogicException(
        'The location store is invalid',
        BusinessError.BAD_REQUEST,
      );

    store.name = storeDTO.name;
    store.location = storeDTO.location;
    store.address = storeDTO.address;
    await this.storeRepository.save(store);
    return store;
  }

  async delete(id: string) {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.storeRepository.remove(store);
  }
}
