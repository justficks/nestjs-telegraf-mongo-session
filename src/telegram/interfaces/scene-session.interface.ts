import { Context } from 'telegraf';

interface SessionData {
  choosen_fiat_currency?: string;
  last_message_id: number;
}

export interface UserSessionContext extends Context {
  session?: SessionData;
}
