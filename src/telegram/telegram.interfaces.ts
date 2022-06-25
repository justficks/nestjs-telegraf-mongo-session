import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';

interface SessionData {
  choosen_fiat_currency?: string;
  last_message_id: number;
}

export interface UserSessionContext extends Context {
  session?: SessionData;
}
export type MyContext = Context & UserSessionContext;

export type MySceneContext = UserSessionContext & SceneContext;

export type MySceneActionContext = MySceneContext & {
  update: Update.CallbackQueryUpdate;
};

export interface TelegrafMessage {
  text: string;
  message_id: number;
  date: number;
}

export interface TelegrafContactMessage extends TelegrafMessage {
  contact: {
    phone_number: string;
  };
}
