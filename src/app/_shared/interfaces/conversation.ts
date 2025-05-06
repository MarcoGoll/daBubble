import { MessageBlock } from './message-block';

export interface Conversation {
  id?: string; // ? optional
  messageBlock: MessageBlock;
  type: 'user' | 'channel' | null;
  channelId?: string;
  userIds?: string[];
}
