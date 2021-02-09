import { expect } from 'chai';
import IORedis from 'ioredis';
import { compose } from 'qoq';
import { Redis, RedisInstance } from '../src';
import { redisOptions } from './redisOptions';

describe('redis slot', () => {
  it ('will inject ctx.redis', async () => {
    const ctx: { redis?: RedisInstance } = {};
    const redis = new Redis(redisOptions);

    await compose([redis])(ctx);

    expect(ctx).has.property('redis');
    expect(ctx.redis).to.instanceOf(IORedis);
    expect(redis.getInstance()).to.instanceOf(IORedis);
  });
});
