'use client';

import type { Room } from '@/application/services/rooms/type';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import { EllipsisVertical, Hash, Loader2, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Channel } from '../App';
import MyWorkspace from './my-workspace-dialog';
import type { GetUserSettings } from '@/application/services/config-user/type';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@/application/services/users/type';

/** Tom ~blue-800 quando não há cor salva; usada em `--sidebar-color` + misturas. */
const SIDEBAR_COLOR_DEFAULT = '#1e40af';

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelName: string) => void;
  activeUserId: string;
  onSelectUser: (userId: string) => void | Promise<void>;
  openingDirectForUserId?: string | null;
  onAddChannel: UseMutateAsyncFunction<Room, Error, string, unknown>;
  onDeleteChannel: (channelId: string) => void | Promise<void>;
  isDeletingRoom: boolean;
  currentUserId: string | null;
  configUser?: GetUserSettings | null;
  onlineUsers: User[];
}

export function Sidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  activeUserId,
  onSelectUser,
  openingDirectForUserId = null,
  onAddChannel,
  onDeleteChannel,
  isDeletingRoom,
  currentUserId,
  configUser,
  onlineUsers
}: SidebarProps) {
  const [isAddChannelDialogOpen, setIsAddChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [openDeleteChannelDialog, setOpenDeleteChannelDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const handleCreateRoom = async (name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    await onAddChannel(normalizedName, {
      onSuccess: () => {
        setIsAddChannelDialogOpen(false);
        setNewChannelName('');
      },
    });
  };

  const handleDeleteChannel = async (channelId: string) => {
    await onDeleteChannel(channelId);
    setOpenDeleteChannelDialog(false);
    setSelectedChannelId(null);
  };

  const handleOpenDeleteChannelDialog = (channelId: string, e: React.MouseEvent<HTMLElement>) => {
    setSelectedChannelId(channelId);
    setOpenDeleteChannelDialog(true);
    e.stopPropagation();
  };

  const sidebarAccent =
    configUser?.colorTheme?.trim() || SIDEBAR_COLOR_DEFAULT;

  return (
    <div
      className="flex w-64 flex-col bg-(--sidebar-color) text-white"
      style={
        { '--sidebar-color': sidebarAccent } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold">Meu Workspace</h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenSettingsDialog(true)}
          className="cursor-pointer text-white hover:bg-[color-mix(in_srgb,var(--sidebar-color)_82%,white)]"
        >
          <Settings />
        </Button>
      </div>

      <Separator className="bg-[color-mix(in_srgb,var(--sidebar-color)_58%,white)]" />

      <ScrollArea>
        <div className="p-3">
          <div className="mb-2 flex justify-between rounded-md px-2 py-1 text-sm text-white/85 hover:bg-[color-mix(in_srgb,var(--sidebar-color)_78%,black)]">
            Canais{' '}
            <button
              type="button"
              onClick={() => setIsAddChannelDialogOpen(true)}
              className="cursor-pointer text-white/0 transition-colors hover:text-white"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <div key={channel.id} className="relative">
                <Button
                  onClick={() => onSelectChannel(channel.name)}
                  variant="ghost"
                  className={cn(
                    'w-full justify-between gap-2',
                    activeChannelId === channel.id
                      ? 'bg-[color-mix(in_srgb,var(--sidebar-color)_68%,black)] text-white hover:bg-[color-mix(in_srgb,var(--sidebar-color)_68%,black)]! hover:text-white!'
                      : 'text-white/90 hover:bg-[color-mix(in_srgb,var(--sidebar-color)_88%,white)] hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Hash size={16} />
                    {channel.name}
                  </span>

                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    type="button"
                    className="absolute top-0 right-0 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full text-transparent outline-none transition-colors hover:text-white/90 focus-visible:ring-2 focus-visible:ring-white/40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={4} className="min-w-36">
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer text-error-200!"
                      onClick={(e) => handleOpenDeleteChannelDialog(channel.id, e)}
                    >
                      <Trash2 />
                      Deletar canal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="mb-2 flex justify-between rounded-md px-2 py-1 text-sm text-white/85">
            Amigos
          </div>

          <div className="flex flex-col gap-2">
            {onlineUsers.map((user) => (
              <Button
                key={user.id}
                onClick={() => void onSelectUser(user.id)}
                variant="ghost"
                disabled={Boolean(openingDirectForUserId)}
                className={cn(
                  'w-full items-center justify-start gap-2 text-left',
                  activeUserId === user.id
                    ? 'bg-[color-mix(in_srgb,var(--sidebar-color)_68%,black)] text-white hover:bg-[color-mix(in_srgb,var(--sidebar-color)_68%,black)]! hover:text-white!'
                    : 'text-white/90 hover:bg-[color-mix(in_srgb,var(--sidebar-color)_88%,white)] hover:text-white',
                )}
              >
                <Avatar className="rounded-md!" size="sm">
                  <AvatarFallback className="rounded-md!">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{user.name}</span>
                {openingDirectForUserId === user.id ? (
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                ) : null}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={isAddChannelDialogOpen} onOpenChange={setIsAddChannelDialogOpen}>
        <DialogContent className="max-w-s">
          <DialogHeader>
            <DialogTitle>Adicionar Canal</DialogTitle>
            <DialogDescription >
              Adicione um novo canal para sua equipe.
            </DialogDescription>
            <Input type="text" placeholder="Nome do canal" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
            <Button variant="outline" onClick={() => setIsAddChannelDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleCreateRoom(newChannelName)} disabled={!newChannelName.trim()}>Criar canal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteChannelDialog} onOpenChange={setOpenDeleteChannelDialog}>
        <DialogContent className="max-w-s">
          <DialogHeader>
            <DialogTitle>Deletar canal</DialogTitle>
            <DialogDescription>Tem certeza que deseja deletar este canal?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
            <Button variant="outline" onClick={() => setOpenDeleteChannelDialog(false)}>Cancelar</Button>
            <Button className={cn(isDeletingRoom && 'px-11')} variant="destructive" onClick={() => handleDeleteChannel(selectedChannelId ?? '')} disabled={isDeletingRoom}>{isDeletingRoom ? <Loader2 className="animate-spin" /> : 'Deletar canal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MyWorkspace userId={currentUserId ?? ''} openSettingsDialog={openSettingsDialog} setOpenSettingsDialog={setOpenSettingsDialog} />
    </div >
  );
}