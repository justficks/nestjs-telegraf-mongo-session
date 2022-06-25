import { Logger } from '@nestjs/common';
import { Action, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ACTION_BUY, SCENE_CHOOSE_FIAT_CURRENCY } from './telegram.constants';
import { MyContext } from './telegram.interfaces';

@Update()
export class TelegramUpdate {
  @Start()
  async start(@Ctx() ctx: MyContext) {
    try {
      ctx.reply(
        'Выберите действие',
        Markup.inlineKeyboard([
          [{ text: ACTION_BUY.text, callback_data: ACTION_BUY.callback }],
        ]),
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  @Action(ACTION_BUY.callback)
  async startBuyScene(@Ctx() ctx: SceneContext) {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter(SCENE_CHOOSE_FIAT_CURRENCY);
    } catch (e) {
      Logger.error(e);
    }
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context, @Message() message: { text: string }) {
    ctx.reply(
      'Команда не расспознана. Просто продублирую ваш текст: \n\n' +
        message.text,
    );
  }
}
