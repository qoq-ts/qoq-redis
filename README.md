# qoq-redis
redis for qoq based on [ioredis](https://github.com/luin/ioredis).

[![License](https://img.shields.io/github/license/qoq-ts/qoq-redis)](https://github.com/qoq-ts/qoq-redis/blob/master/LICENSE)

# Installation
```bash
yarn add qoq-redis
```

# Create redis middleware
```typescript
import { WebSlotManager, ConsoleSlotManager, createConfig } from 'qoq';
import { Redis, RedisOptions } from 'qoq-redis';

// config.[env].ts
const redisOptions = createConfig<RedisOptions>({
  ...
});

// bootstrap/redis.ts
const redis = new Redis(redisOptions);

// bootstrap/web.ts
const webSlots = WebSlotManager.use(redis);

// bootstrap/console.ts
const consoleSlots = ConsoleSlotManager.use(redis);
```
The feel free to use in request or commands
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

# Create cache middleware from redis
```diff
import { WebSlotManager, ConsoleSlotManager, createConfig } from 'qoq';
+ import { Cache } from 'qoq';
import { Redis, RedisOptions } from 'qoq-redis';
+ import { RedisCacheOptions } from 'qoq-redis';

// config.[env].ts
const redisOptions = createConfig<RedisOptions>({
  ...
});
+ const cacheOptions = createConfig<RedisCacheOptions>({
+  slot: 'qoq-redis/RedisCache',
+  redisOptions: redisOptions,
+ });

// bootstrap/redis.ts
const redis = new Redis(redisOptions);
+ const cache = new Cache(cacheOptions);

// bootstrap/web.ts
const webSlots = WebSlotManager
  .use(redis);
+ .use(cache);

// bootstrap/console.ts
const consoleSlots = ConsoleSlotManager
  .use(redis)
+ .use(cache);
```

# Options
@see [ioredis](https://github.com/luin/ioredis/blob/master/README.md)
