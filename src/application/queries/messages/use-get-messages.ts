import { useQuery } from '@tanstack/react-query';
import { messageService } from '~/application/services/messages/messages';
import type { BackendMessage } from '~/application/services/messages/type';
import { queryKeys } from '../keys';

export const useGetMessages = (roomId: string) => {
  return useQuery<BackendMessage[], Error>({
    queryKey: queryKeys.messages(roomId),
    queryFn: async () => await messageService.getMessages(roomId),
    enabled: Boolean(roomId),
  });
};
