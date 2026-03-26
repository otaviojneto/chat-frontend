import { type FormEvent, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Channel } from '../types';

type ChatAreaProps = {
  channel: Channel;
  onSendMessage: (text: string) => void;
};

export function ChatArea({ channel, onSendMessage }: ChatAreaProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage(draft);
    setDraft('');
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-border p-4">
        <h1 className="text-lg font-semibold">#{channel.name}</h1>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col gap-4 p-4">
          {channel.messages.map((m) => (
            <li key={m.id} className="flex gap-3">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback className="text-base">{m.avatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium">{m.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm break-words">{m.text}</p>
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
