import { BaseCache, BaseCacheOptions } from 'qoq';
import IORedis, { RedisOptions, Redis } from 'ioredis';

export interface RedisCacheOptions extends BaseCacheOptions {
  slot: 'qoq-redis/RedisCache';
  redisOptions: RedisOptions | Redis;
}

export class RedisCache extends BaseCache {
  protected readonly redis: Redis;

  constructor(config: RedisCacheOptions) {
    super(config);
    this.redis = config.redisOptions instanceof IORedis
      ? config.redisOptions
      : new IORedis(config.redisOptions);
  }

  public async exists(key: string): Promise<boolean> {
    const hashKey = this.buildKey(key);
    const result = await this.redis.exists(hashKey);

    return result === 1;
  }

  protected async getValue(key: string): Promise<string | null> {
    const value = await this.redis.get(key);

    return value;
  }

  protected async setValue(key: string, value: string, ttl?: number): Promise<boolean> {
    const result = ttl === undefined
      ? await this.redis.set(key, value)
      : await this.redis.set(key, value, 'PX', ttl);

    return result === 'OK';
  }

  protected async addValue(key: string, value: string, ttl?: number): Promise<boolean> {
    const result = ttl === undefined
      ? await this.redis.set(key, value, 'NX')
      : await this.redis.set(key, value, 'PX', ttl, 'NX');

    return result === 'OK';
  }

  protected async deleteValue(key: string): Promise<boolean> {
    const result = await this.redis.del(key);

    return result === 1;
  }

  protected async deleteAllValues(): Promise<boolean> {
    const result = await this.redis.flushdb();

    return result === 'OK';
  }
}
