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
