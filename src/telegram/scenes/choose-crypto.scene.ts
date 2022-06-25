import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENE_CHOOSE_CRYPTO_CURRENCY } from '../telegram.constants';
import { MySceneActionContext, MySceneContext } from '../telegram.interfaces';

@Scene(SCENE_CHOOSE_CRYPTO_CURRENCY)
export class ChooseCryptoCurrencyScene {
  @SceneEnter()
  async enter(@Ctx() ctx: MySceneContext) {
    if (ctx.session.choosen_fiat_currency == 'RUB') {
      await ctx.editMessageText('Доступные валюты и курс покупки:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'BTC  - 1340231 ₽', callback_data: 'BTC' }],
            [{ text: 'ETH  - 400244 ₽', callback_data: 'ETH' }],
            [{ text: 'USDT - 67 ₽', callback_data: 'USDT' }],
          ],
        },
      });
    } else {
      await ctx.editMessageText('Доступные валюты и курс покупки:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'BTC  - 33001 $', callback_data: 'BTC' }],
            [{ text: 'ETH  - 2100 $', callback_data: 'ETH' }],
            [{ text: 'USDT - 1 $', callback_data: 'USDT' }],
          ],
        },
      });
    }
  }

  @Action(/BTC|ETH|USDT/)
  async onAnswer(@Ctx() ctx: MySceneActionContext) {
    const userAnswer = ctx.update.callback_query.data;

    ctx.session.choosen_crypto_currency = userAnswer;

    const message =
      'Вот, держи данные сессии: ' + JSON.stringify(ctx.session, null, 3);

    await ctx.editMessageText(message);

    await ctx.scene.leave();
  }
}
