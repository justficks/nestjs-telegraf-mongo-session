import { Injectable } from '@nestjs/common';
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
    const user = await this.telegramSessionModel.findOne({ userId });
    if (user) {
      return user.session;
    } else {
      return EMPTY_SESSION;
    }
  }

  async saveSession(session: SceneContext['session'], userId: number) {
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
