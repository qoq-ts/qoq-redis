# qoq-redis
redis for qoq based on [ioredis](https://github.com/luin/ioredis).

[![License](https://img.shields.io/github/license/qoq-ts/qoq-redis)](https://github.com/qoq-ts/qoq-redis/blob/master/LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/qoq-ts/qoq-redis/CI/master)](https://github.com/qoq-ts/qoq-redis/actions)
[![Codecov](https://img.shields.io/codecov/c/github/qoq-ts/qoq-redis)](https://codecov.io/gh/qoq-ts/qoq-redis)
[![npm](https://img.shields.io/npm/v/qoq-redis)](https://www.npmjs.com/package/qoq-redis)

# Installation
```bash
yarn add qoq-redis
```

# Create redis middleware
```typescript
import { WebSlotManager, ConsoleSlotManager, createConfig } from 'qoq';
import { Redis, RedisOptions } from 'qoq-redis';

const redisOptions = createConfig<RedisOptions>({
  ...
});

const webSlots = WebSlotManager.use(new Redis(redisOptions));
```

Then feel free to use in request or commands
```typescript
import { createWebRouter } from 'qoq';

export const router = createWebRouter(webSlots);

router
  .get('/')
  .action(async (ctx) => {
    await ctx.redis.set('hello', 'world');
    ctx.send('OK');
  });
```

# Create cache middleware
```diff
import { WebSlotManager, ConsoleSlotManager, createConfig } from 'qoq';
import { Redis, RedisOptions } from 'qoq-redis';
+ import { Cache } from 'qoq';
+ import { RedisCacheOptions } from 'qoq-redis';

const redisOptions = createConfig<RedisOptions>({
  ...
});
+ const cacheOptions = createConfig<RedisCacheOptions>({
+  slot: 'qoq-redis/RedisCache',
+  redisOptions: redisOptions,
+ });

const webSlots = WebSlotManager
  .use(new Redis(redisOptions));
+ .use(new Cache(cacheOptions));
```

# Options
@see [ioredis](https://github.com/luin/ioredis/blob/master/README.md)
