export const queryKeys = {
  users: ['users'] as const,
  rooms: ['rooms'] as const,
  messages: (roomId: string) => ['messages', roomId] as const,
  initializeChat: ['chat', 'initialize'] as const,
};
