import { useState } from 'react';
import { ChatArea } from './components/chat-area';
import { Sidebar } from './components/sidebar';
import type { Channel } from './types';
import { useInitializeChat } from '@/application/queries';
import { useCreateRooms } from '@/application/queries/rooms/use-rooms/use-create-rooms';

export type { Channel, Message } from './types';

export default function App() {
  const [activeChannelName, setActiveChannelName] = useState('');
  const { data: initializeChat } = useInitializeChat();
  const { mutateAsync: createRoom } = useCreateRooms();




  const channels: Channel[] = initializeChat?.channels ?? [];
  const currentUserId = initializeChat?.currentUserId ?? null;

  const activeChannel =
    channels.find((c) => c.name === activeChannelName) ?? channels[0];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        channels={channels}
        activeChannelId={activeChannel?.id ?? ''}
        onSelectChannel={setActiveChannelName}
        onAddChannel={createRoom}
      />
      {activeChannel && (
        <ChatArea
          channel={activeChannel}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
