import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';
import { UserSessionContext } from '../interfaces/scene-session.interface';
import {
  CHOOSE_CRYPTO_CURRENCY,
  CHOOSE_FIAT_CURRENCY,
} from '../telegram.constants';

type ActionAnswerContext = UserSessionContext &
  SceneContext & {
    update: Update.CallbackQueryUpdate;
  };

@Scene(CHOOSE_FIAT_CURRENCY)
export class ChooseFiatCurrencyScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & UserSessionContext) {
    ctx.reply('Какой валютой будете покупать?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Доллары', callback_data: 'USD' }],
          [{ text: 'Рубли', callback_data: 'RUB' }],
        ],
      },
    });
  }

  @Action(/USD|RUB/)
  async onAnswer(@Ctx() ctx: ActionAnswerContext) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    if (userAnswer) {
      ctx.session.choosen_fiat_currency = userAnswer;
      await ctx.scene.enter(CHOOSE_CRYPTO_CURRENCY);
    } else {
      ctx.reply('Что-то пошло не так...');
    }
  }
}

@Scene(CHOOSE_CRYPTO_CURRENCY)
export class ChooseCryptoCurrencyScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & UserSessionContext) {
    if (ctx.session.choosen_fiat_currency == 'RUB') {
      await ctx.reply('Доступные валюты и курс покупки:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'BTC  - 340231 ₽', callback_data: 'BTC' }],
            [{ text: 'ETH  - 40244 ₽', callback_data: 'ETH' }],
            [{ text: 'USDT - 67 ₽', callback_data: 'USDT' }],
          ],
        },
      });
    } else {
      await ctx.reply('Доступные валюты и курс покупки:', {
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
  async onAnswer(@Ctx() ctx: ActionAnswerContext) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    switch (userAnswer) {
      case 'BTC':
        ctx.reply('BTC кошелек для пополнения');
        break;
      case 'ETH':
        ctx.reply('ETH кошелек для пополнения');
        break;
      case 'USDT':
        ctx.reply('USDT кошелек для пополнения');
        break;
    }

    await ctx.scene.leave();
  }
}
