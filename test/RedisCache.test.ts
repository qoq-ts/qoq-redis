import { expect } from 'chai';
import IORedis from 'ioredis';
import sleep from 'sleep-promise';
import { RedisCache } from '../src';
import { redisOptions } from './redisOptions';

describe('Redis Cache', () => {
  let cache: RedisCache;
  let db = 0;

  beforeEach(() => {
    cache = new RedisCache({
      engine: 'qoq-redis/RedisCache',
      redisOptions: {
        ...redisOptions,
        db: ++db,
      },
    });
  });

  it ('can set anything (string, number, object)', async () => {
    await cache.set('hello', 'world');
    expect(await cache.get('hello')).to.equal('world');

    await cache.set('hello', { name: 'bob' });
    expect(await cache.get('hello')).to.contain({ name: 'bob' });

    await cache.set('test', 1001);
    expect(await cache.get('test')).to.equal(1001);
  });

  it ('can use ttl', async () => {
    await cache.set('hello', 'world', 500);
    expect(await cache.get('hello')).to.equal('world');

    await sleep(300);
    expect(await cache.get('hello')).to.equal('world');

    await sleep(202);
    expect(await cache.get('hello')).to.null;
  });

  it ('can use exists', async () => {
    expect(await cache.exists('hello')).to.be.false;
    await cache.set('hello', 'world');
    expect(await cache.exists('hello')).to.be.true;
  });

  it ('can add value only once', async () => {
    expect(await cache.add('hello', 'world')).to.be.true;
    expect(await cache.get('hello')).to.equal('world');

    expect(await cache.add('hello', 'next data')).to.be.false;
    expect(await cache.get('hello')).to.equal('world');
  });

  it ('can add value many times with ttl', async () => {
    expect(await cache.add('hello', 'world', 500)).to.be.true;
    expect(await cache.add('hello', 'next data', 500)).to.be.false;
    expect(await cache.get('hello')).to.equal('world');
    await sleep(502);
    expect(await cache.add('hello', 'next data', 500)).to.be.true;
    expect(await cache.get('hello')).to.equal('next data');
  });

  it ('can delete value', async () => {
    await cache.add('hello', 'world');
    expect(await cache.get('hello')).to.equal('world');

    expect(await cache.delete('hello')).to.be.true;
    expect(await cache.get('hello')).to.be.null;
  });

  it ('can delete all caches', async () => {
    await cache.set('hello', 'world');
    await cache.set('test', 'data');
    expect(await cache.get('hello')).to.equal('world');
    expect(await cache.get('test')).to.equal('data');

    expect(await cache.deleteAll()).to.be.true;
    expect(await cache.get('hello')).to.be.null;
    expect(await cache.get('test')).to.be.null;
  });

  it ('can set value when value doesn\'t exist', async () => {
    expect(await cache.get('hello')).to.be.null;
    expect(await cache.getOrSet('hello', () => 'world')).to.equal('world');
    expect(await cache.get('hello')).to.equal('world');
    expect(await cache.getOrSet('hello', () => 'test data')).to.equal('world');

    expect(await cache.getOrSet('test1', () => 'test data', 500)).to.equal('test data');
    expect(await cache.getOrSet('test1', () => 'new test data', 500)).to.equal('test data');
    await sleep(502);
    expect(await cache.getOrSet('test1', () => 'new test data', 500)).to.equal('new test data');
  });

  it ('can use default value', async () => {
    expect(await cache.get('hello')).to.be.null;
    expect(await cache.get('hello', 'world')).to.equal('world');

    await cache.set('hello', 'test data');
    expect(await cache.get('hello', 'world')).to.equal('test data');
  });

  it ('can input redis instance instead of options', async () => {
    const redis = new IORedis(redisOptions);

    cache = new RedisCache({
      engine: 'qoq-redis/RedisCache',
      redisOptions: redis,
    });

    expect(await cache.get('hello')).to.be.null;
  });
});
