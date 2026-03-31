import { useState } from 'react';
import { ChatArea } from './components/chat-area';
import { Sidebar } from './components/sidebar';
import type { Channel } from './types';
import { useChatBootstrap } from '@/application/queries';

export type { Channel, Message } from './types';

export default function App() {
  const [activeChannelName, setActiveChannelName] = useState('');
  const { data: bootstrap } = useChatBootstrap();

  const channels: Channel[] = bootstrap?.channels ?? [];
  const currentUserId = bootstrap?.currentUserId ?? null;

  const activeChannel =
    channels.find((c) => c.name === activeChannelName) ?? channels[0];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        channels={channels}
        activeChannelId={activeChannel?.id ?? ''}
        onSelectChannel={setActiveChannelName}
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
