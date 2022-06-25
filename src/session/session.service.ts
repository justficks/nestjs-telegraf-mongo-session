import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Middleware } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { TelegramSession } from './session.schema';

const EMPTY_SESSION = { __scenes: {} };

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(TelegramSession.name)
    private readonly telegramSessionModel: Model<TelegramSession>,
  ) {}

  async getSession(userId: number): Promise<SceneContext['session']> {
    try {
      const user = await this.telegramSessionModel.findOne({ userId });
      if (user) {
        return user.session;
      } else {
        return EMPTY_SESSION;
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  async saveSession(session: SceneContext['session'], userId: number) {
    try {
      const user = await this.telegramSessionModel.findOne({ userId });
      if (user) {
        user.session = session;
        await user.save();
      } else {
        const newUser = new this.telegramSessionModel({
          userId,
          session,
        });
        await newUser.save();
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  createMongoDBSession(): Middleware<SceneContext> {
    return async (ctx, next) => {
      const id = ctx.chat.id;

      let session: SceneContext['session'] = EMPTY_SESSION;

      Object.defineProperty(ctx, 'session', {
        get: function () {
          return session;
        },
        set: function (newValue) {
          session = Object.assign({}, newValue);
        },
      });

      session = (await this.getSession(id)) || EMPTY_SESSION;

      await next(); // wait all other middlewares
      await this.saveSession(session, id);
    };
  }
}
