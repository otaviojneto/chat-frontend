import { queryKeys, useInitializeChat } from '@/application/queries';
import { useGetUsers } from '@/application/queries/all-users/all-users';
import { useConfigUser } from '@/application/queries/config-user/use-config-user';
import { useAllRooms } from '@/application/queries/rooms/use-rooms/use-all-rooms';
import { useCreateDirectRoom } from '@/application/queries/rooms/use-rooms/use-create-direct-room';
import { useCreateRooms } from '@/application/queries/rooms/use-rooms/use-create-rooms';
import { useDeleteRoom } from '@/application/queries/rooms/use-rooms/use-delete-room';
import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ChatArea } from './components/chat-area';
import { Sidebar } from './components/sidebar';
import Login from './login';
import type { Channel } from './types';

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
  const [openingDirectForUserId, setOpeningDirectForUserId] = useState<
    string | null
  >(null);
  const queryClient = useQueryClient();
  const { data: initializeChat } = useInitializeChat();
  const { data: allRooms } = useAllRooms();
  const { mutateAsync: createRoom } = useCreateRooms();
  const { mutateAsync: createDirectRoom } = useCreateDirectRoom();
  const { mutateAsync: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();

  const { data: allUsers } = useGetUsers();
  const publicRooms = allRooms?.filter((room) => room.type === 'PUBLIC');

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


  const handleSelectChannel = (channelName: string) => {
    setActiveUserId('');
    setActiveChannelName(channelName);
  };

  const handleSelectUser = async (userId: string) => {
    if (!currentUserId) return;

    setActiveUserId(userId);
    setOpeningDirectForUserId(userId);
    try {
      const room = await createDirectRoom({ targetUserId: userId });
      await queryClient.refetchQueries({ queryKey: queryKeys.initializeChat });
      setActiveChannelName(room.name);
    } catch {
      setActiveUserId('');
    } finally {
      setOpeningDirectForUserId(null);
    }
  };


  const resolvedTheme = configUser?.themeDarkMode === true ? 'dark' : 'light';
  // ==============================================================================================================================
  // TODO  =============================================== TODO: Implementar falta implementar a sala de grupo ========================== hoje so tem sala public e privada
  // ==============================================================================================================================
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
          channels={publicRooms ?? []}
          activeChannelId={activeChannel?.id ?? ''}
          onSelectChannel={handleSelectChannel}
          activeUserId={activeUserId}
          onSelectUser={handleSelectUser}
          openingDirectForUserId={openingDirectForUserId}
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
