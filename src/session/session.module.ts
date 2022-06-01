import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramSession, TelegramSessionSchema } from './session.schema';
import { SessionService } from './session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TelegramSession.name, schema: TelegramSessionSchema },
    ]),
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
