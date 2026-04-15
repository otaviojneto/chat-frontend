import { useState } from 'react';
import { ChatArea } from './components/chat-area';
import { Sidebar } from './components/sidebar';
import type { Channel } from './types';
import { useInitializeChat } from '@/application/queries';
import { useCreateRooms } from '@/application/queries/rooms/use-rooms/use-create-rooms';
import { useDeleteRoom } from '@/application/queries/rooms/use-rooms/use-delete-room';
import { ThemeProvider } from 'next-themes';
import { useConfigUser } from '@/application/queries/config-user/use-config-user';

export type { Channel, Message } from './types';

export default function App() {
  const [activeChannelName, setActiveChannelName] = useState('');
  const { data: initializeChat } = useInitializeChat();
  const { mutateAsync: createRoom } = useCreateRooms();
  const { mutateAsync: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();




  const channels: Channel[] = initializeChat?.channels ?? [];
  const currentUserId = initializeChat?.currentUserId ?? null;
  const activeChannel =
    channels.find((c) => c.name === activeChannelName) ?? channels[0];
  const { data: configUser } = useConfigUser(currentUserId ?? '');
  const handleDeleteChannel = async (channelId: string) => {
    const wasActive = activeChannel?.id === channelId;
    const remaining = channels.filter((c) => c.id !== channelId);
    await deleteRoom(channelId);
    if (wasActive) {
      setActiveChannelName(remaining[0]?.name ?? '');
    }
  };

  const resolvedTheme = configUser?.themeDarkMode === true ? 'dark' : 'light';

  return (
    <ThemeProvider
      key={resolvedTheme}
      attribute="class"
      defaultTheme={resolvedTheme}
      enableSystem={false}
      forcedTheme={resolvedTheme}
    >
      <div className="flex h-screen bg-background">
        <Sidebar
          channels={channels}
          activeChannelId={activeChannel?.id ?? ''}
          onSelectChannel={setActiveChannelName}
          onAddChannel={createRoom}
          onDeleteChannel={handleDeleteChannel}
          isDeletingRoom={isDeletingRoom}
          currentUserId={currentUserId}
          configUser={configUser}
        />
        {activeChannel && (
          <ChatArea
            channel={activeChannel}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
