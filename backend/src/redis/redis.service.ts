import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public constructor(@InjectRedis() private readonly redis: Redis) {}

  public async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async addToBlacklist(token: string, ttl: number): Promise<void> {
    await this.set(token, 'blacklisted', ttl);
  }

  public async isBlacklisted(token: string): Promise<boolean> {
    return (await this.redis.get(token)) !== null;
  }
}
