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
    if (storeDTO.name.length < 3 || storeDTO.name.length > 3)
      throw new BusinessLogicException(
        'The name store is invalid',
        BusinessError.PRECONDITION_FAILED,
      );
    store.name = storeDTO.name;
    store.location = storeDTO.location;
    return await this.storeRepository.save(store);
  }

  async update(id: string, storeDTO: StoreDTO): Promise<StoreDTO> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    store.name = storeDTO.name;
    store.location = storeDTO.location;
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
