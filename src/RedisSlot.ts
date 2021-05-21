import { Slot } from 'qoq';
import { RedisOptions } from 'ioredis';
import { Redis } from './';

export interface RedisContextProps {
  redis: Redis;
}

export class RedisSlot extends Slot<Slot.Mix, RedisContextProps> {
  public readonly redis: Redis;

  constructor(options: RedisOptions | Redis = {}) {
    super();
    const instance = (this.redis = options instanceof Redis ? options : new Redis(options));

    this.use((ctx, next) => {
      ctx.redis = instance;
      return next();
    });
  }
}
