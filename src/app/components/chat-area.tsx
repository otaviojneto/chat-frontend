import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { queryKeys, useGetMessages, useSendMessage } from '@/application/queries';
import type { BackendMessage } from '~/application/services/messages/type';
import { socket } from '@/application/socket';
import type { Channel } from '../types';

type Message = {
  id: string;
  text: string;
  user: string;
  avatar: string;
  timestamp: Date;
};

type ChatAreaProps = {
  channel: Channel;
  currentUserId: string | null;
};

const mapToUiMessages = (raw: BackendMessage[]): Message[] => {
  return raw.map((msg) => ({
    id: msg.id,
    text: msg.content,
    user: msg.user.name,
    avatar: msg.user.name[0],
    timestamp: new Date(msg.createdAt),
  }));
}

export const ChatArea = ({ channel, currentUserId }: ChatAreaProps) => {
  const [draft, setDraft] = useState('');
  const queryClient = useQueryClient();
  const { data: rawMessages = [] } = useGetMessages(channel.id);
  const sendMessage = useSendMessage();

  const messages = useMemo(() => mapToUiMessages(rawMessages), [rawMessages]);

  // ⚡ realtime socket
  useEffect(() => {
    socket.emit('joinRoom', channel.id);

    socket.on('message', (msg: BackendMessage) => {
      if (msg.roomId === channel.id) {
        queryClient.setQueryData<BackendMessage[]>(
          queryKeys.messages(channel.id),
          (prev = []) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          },
        );
      }
    });

    return () => {
      socket.off('message');
    };
  }, [channel.id, queryClient]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft || !currentUserId) return;

    await sendMessage.mutateAsync({
      content: draft,
      userId: currentUserId,
      roomId: channel.id,
    });

    setDraft('');
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-border p-4">
        <h1 className="text-lg font-semibold">#{channel.name}</h1>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col gap-4 p-4">
          {messages.map((m) => (
            <li key={m.id} className="flex gap-3">
              <Avatar className="shrink-0">
                <AvatarFallback className="text-base">
                  {m.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium">{m.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm wrap-break-word">{m.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <Separator />

      <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 p-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1"
        />
        <Button type="submit">Enviar</Button>
      </form>
    </main>
  );
}