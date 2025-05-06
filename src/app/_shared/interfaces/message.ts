export interface Message {
  timestamp: number;
  sender: string;
  text: string;
  emotes: {
    emoteId: string;
    emoteFrom: string;
  }[];
  responses: Message[];
}
