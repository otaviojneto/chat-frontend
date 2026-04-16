import { useState } from 'react';
import { ChatArea } from './components/chat-area';
import { Sidebar } from './components/sidebar';
import type { Channel } from './types';
import { useInitializeChat } from '@/application/queries';
import { useCreateRooms } from '@/application/queries/rooms/use-rooms/use-create-rooms';
import { useDeleteRoom } from '@/application/queries/rooms/use-rooms/use-delete-room';
import { ThemeProvider } from 'next-themes';
import { useConfigUser } from '@/application/queries/config-user/use-config-user';
import Login from './login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useGetUsers } from '@/application/queries/all-users/all-users';

export type { Channel, Message } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/chat" replace />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/chat"
        element={
          isAuthenticated ? (
            <ProtectedApp />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />}
      />
    </Routes>
  );
}

function ProtectedApp() {
  const [activeChannelName, setActiveChannelName] = useState('');
  const [activeUserId, setActiveUserId] = useState('');
  const { data: initializeChat } = useInitializeChat();
  const { mutateAsync: createRoom } = useCreateRooms();
  const { mutateAsync: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();


  const { data: allUsers } = useGetUsers();

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
          activeUserId={activeUserId}
          onSelectUser={setActiveUserId}
          onAddChannel={createRoom}
          onDeleteChannel={handleDeleteChannel}
          isDeletingRoom={isDeletingRoom}
          currentUserId={currentUserId}
          configUser={configUser}
          onlineUsers={allUsers ?? []}
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
