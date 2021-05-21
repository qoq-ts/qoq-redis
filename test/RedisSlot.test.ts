import { testMiddleware } from 'qoq';
import { Redis, RedisSlot } from '../src';
import { redisOptions } from './redisOptions';

it('will inject ctx.redis', async () => {
  const redis = new RedisSlot(redisOptions);

  const ctx = await testMiddleware(redis)({});

  expect(ctx).toHaveProperty('redis');
  expect(ctx.redis).toBeInstanceOf(Redis);
  expect(redis.redis).toBeInstanceOf(Redis);

  redis.redis.disconnect();
});
