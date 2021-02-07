import { Slot } from 'qoq';
import IORedis, { RedisOptions, Redis as TRedis } from 'ioredis';

interface RedisProps {
  redis: TRedis;
}

export class Redis extends Slot<Slot.Mix, RedisProps> {
  protected readonly instance: TRedis;

  constructor(options: RedisOptions = {}) {
    super();
    const instance = this.instance = new IORedis(options);

    this.use((ctx, next) => {
      ctx.redis = instance;
      return next();
    });
  }

  getInstance() {
    return this.instance;
  }
}
