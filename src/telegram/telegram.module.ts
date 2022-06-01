import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service';
import {
  ChooseCryptoCurrencyScene,
  ChooseFiatCurrencyScene,
} from './scenes/buy.scene';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [SessionModule],
      inject: [SessionService],
      useFactory: (sessionService: SessionService) => ({
        token: process.env.TG_TOKEN,
        middlewares: [sessionService.createMongoDBSession()],
      }),
    }),
  ],
  providers: [
    TelegramService,
    TelegramUpdate,
    ChooseFiatCurrencyScene,
    ChooseCryptoCurrencyScene,
  ],
})
export class TelegramModule {}

// TelegrafModule.forRoot({
//   token: process.env.TG_TOKEN,
// }),
