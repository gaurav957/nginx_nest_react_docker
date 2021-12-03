import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import envConfig from 'src/config/env.config';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: envConfig.redis.url,
      port: envConfig.redis.port,
      ttl: envConfig.redis.ttl,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
