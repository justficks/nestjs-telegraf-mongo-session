import { Logger } from '@nestjs/common';
import { Ctx, Hears, Help, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { TelegrafMessage } from './interfaces/message.interface';
import { UserSessionContext } from './interfaces/scene-session.interface';

@Update()
export class TelegramUpdate {
  private readonly logger: Logger = new Logger('telegram.update');

  @Start()
  async start(@Ctx() ctx: Context & UserSessionContext) {
    ctx.reply(
      'Выберите действие',
      Markup.keyboard([['КУПИТЬ', 'ПРОДАТЬ']]).resize(),
    );
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    ctx.reply('Some help msg');
  }

  @Hears(/КУПИТЬ?/)
  async startBuyScene(@Ctx() ctx: SceneContext) {
    try {
      await ctx.scene.enter('CHOOSE_FIAT_CURRENCY');
    } catch (e) {
      this.logger.error(e);
    }
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context, @Message() message: TelegrafMessage) {
    ctx.reply(
      'Команда не расспознана. Просто продублирую ваш текст: \n\n' +
        message.text,
    );
  }
}
