export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  avatar: string;
}

export interface Channel {
  id: string;
  name: string;
  messages: Message[];
}
