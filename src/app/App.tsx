import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/chat-area';
import type { Channel, Message } from './types';

export type { Channel, Message } from './types';

const initialChannels: Channel[] = [
  {
    id: '1',
    name: 'geral',
    messages: [
      {
        id: '1',
        user: 'João Silva',
        text: 'Olá pessoal! Como estão?',
        timestamp: new Date('2026-03-26T09:00:00'),
        avatar: '👨‍💼'
      },
      {
        id: '2',
        user: 'Maria Santos',
        text: 'Tudo bem! Trabalhando no novo projeto.',
        timestamp: new Date('2026-03-26T09:05:00'),
        avatar: '👩‍💻'
      }
    ]
  },
  {
    id: '2',
    name: 'projetos',
    messages: [
      {
        id: '3',
        user: 'Pedro Costa',
        text: 'Precisamos revisar o cronograma.',
        timestamp: new Date('2026-03-26T10:00:00'),
        avatar: '👨‍🎨'
      }
    ]
  },
  {
    id: '3',
    name: 'random',
    messages: []
  }
];

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState('1');

  const activeChannel = channels.find(c => c.id === activeChannelId);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !activeChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'Você',
      text,
      timestamp: new Date(),
      avatar: '😊'
    };

    setChannels(channels.map(channel =>
      channel.id === activeChannelId
        ? { ...channel, messages: [...channel.messages, newMessage] }
        : channel
    ));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
      />
      {activeChannel && (
        <ChatArea
          channel={activeChannel}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}