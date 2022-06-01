import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.URL_DB),
    SessionModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
