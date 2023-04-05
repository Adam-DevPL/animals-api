import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async clearAllCache() {
    this.cacheManager.del('findAll');
  }

  async clearSingleCache(id: string) {
    this.cacheManager.del(`/animals/animal/${id}`);
  }
}
