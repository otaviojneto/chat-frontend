import { Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Channel } from '../App';

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

export function Sidebar({ channels, activeChannelId, onSelectChannel }: SidebarProps) {
  return (
    <div className="w-64 bg-purple-900 text-white flex flex-col">
      <div className="p-4">
        <h1 className="font-bold text-lg">Meu Workspace</h1>
      </div>

      <Separator className="bg-purple-800" />

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="text-sm text-purple-300 mb-2 px-2">Canais</div>
          <div className="space-y-1">
            {channels.map(channel => (
              <Button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                variant="ghost"
                className={`w-full justify-start gap-2 ${activeChannelId === channel.id
                  ? 'bg-purple-700 text-white hover:bg-purple-700'
                  : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                  }`}
              >
                <Hash size={16} />
                <span>{channel.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}