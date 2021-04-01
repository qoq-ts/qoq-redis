import { expect } from 'chai';
import { testMiddleware } from 'qoq';
import { Redis, RedisSlot } from '../src';
import { redisOptions } from './redisOptions';

describe('redis slot', () => {
  it ('will inject ctx.redis', async () => {
    const redis = new RedisSlot(redisOptions);
    const ctx = await testMiddleware(redis)({});

    expect(ctx).has.property('redis');
    expect(ctx.redis).to.instanceOf(Redis);
    expect(redis.redis).to.instanceOf(Redis);
  });
});
