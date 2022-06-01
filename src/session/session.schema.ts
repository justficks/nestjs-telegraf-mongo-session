import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SceneContext } from 'telegraf/typings/scenes';

export type TelegramSessionDocument = TelegramSession & Document;

@Schema()
export class TelegramSession {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: number;

  @Prop({ type: Object })
  session: SceneContext['session'];

  createdAt: Date;
}

export const TelegramSessionSchema =
  SchemaFactory.createForClass(TelegramSession);
