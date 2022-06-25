import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  SCENE_CHOOSE_CRYPTO_CURRENCY,
  SCENE_CHOOSE_FIAT_CURRENCY,
} from '../telegram.constants';
import { MySceneActionContext, MySceneContext } from '../telegram.interfaces';

@Scene(SCENE_CHOOSE_FIAT_CURRENCY)
export class ChooseFiatCurrencyScene {
  @SceneEnter()
  async enter(@Ctx() ctx: MySceneContext) {
    ctx.editMessageText('Какой валютой будете покупать?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Доллары', callback_data: 'USD' }],
          [{ text: 'Рубли', callback_data: 'RUB' }],
        ],
      },
    });
  }

  @Action(/USD|RUB/)
  async onAnswer(@Ctx() ctx: MySceneActionContext) {
    const userAnswer = ctx.update.callback_query.data;

    // Это и была наша цель. После выполнения кода ниже, данные
    // сохраняться в базе и мы в любой момент времени сможем определить
    // что, как и где делал пользователь
    ctx.session.choosen_fiat_currency = userAnswer;

    await ctx.scene.enter(SCENE_CHOOSE_CRYPTO_CURRENCY);
  }
}
