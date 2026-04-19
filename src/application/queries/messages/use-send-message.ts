import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '~/application/services/messages/messages';
import type {
  BackendMessage,
  SendMessagePayload,
} from '~/application/services/messages/type';
import { queryKeys } from '../keys';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      messageService.sendMessage(payload),
    onSuccess: (message, variables) => {
      if (!message?.id) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages(variables.roomId),
        });
        return;
      }
      queryClient.setQueryData<BackendMessage[]>(
        queryKeys.messages(variables.roomId),
        (prev = []) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        },
      );
    },
  });
};
