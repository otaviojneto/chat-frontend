export const queryKeys = {
  users: ['users'] as const,
  rooms: ['rooms'] as const,
  messages: (roomId: string) => ['messages', roomId] as const,
  chatBootstrap: ['chat', 'bootstrap'] as const,
};
