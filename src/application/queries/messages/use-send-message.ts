import { useMutation } from '@tanstack/react-query';
import { messageService } from '~/application/services/messages/messages';
import type { SendMessagePayload } from '~/application/services/messages/type';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      messageService.sendMessage(payload),
  });
};
