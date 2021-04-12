import IORedis from 'ioredis';

export class Redis extends IORedis {
  static Cluster = IORedis.Cluster;
}
