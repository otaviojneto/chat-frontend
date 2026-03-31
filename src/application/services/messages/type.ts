export type BackendMessage = {
  id: string;
  content: string;
  roomId: string;
  createdAt: string;
  user: { name: string };
};

export type SendMessagePayload = {
  content: string;
  userId: string;
  roomId: string;
};
