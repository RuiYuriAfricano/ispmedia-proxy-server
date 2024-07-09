import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ForwardMiddleware } from './forward.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ForwardMiddleware).forRoutes('*');
  }
}