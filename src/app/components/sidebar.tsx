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
import MyWorkspace from './my-workspace';

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelName: string) => void;
  onAddChannel: UseMutateAsyncFunction<Room, Error, string, unknown>;
  onDeleteChannel: (channelId: string) => void | Promise<void>;
  isDeletingRoom: boolean;
}

export function Sidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onAddChannel,
  onDeleteChannel,
  isDeletingRoom,
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
    onSelectChannel(channelId);
    setOpenDeleteChannelDialog(false);
    setSelectedChannelId(null);
  };

  const handleOpenDeleteChannelDialog = (channelId: string, e: React.MouseEvent<HTMLElement>) => {
    setSelectedChannelId(channelId);
    setOpenDeleteChannelDialog(true);
    e.stopPropagation();
  };


  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Meu Workspace</h1>


        <Button variant="ghost" size="icon" onClick={() => setOpenSettingsDialog(true)} className='cursor-pointer'><Settings /></Button>
      </div>

      <Separator className="bg-blue-600" />

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="text-sm text-blue-300 mb-2 px-2 py-1 flex justify-between hover:bg-blue-700 rounded-md">Canais  <button onClick={() => setIsAddChannelDialogOpen(true)} className="text-transparent cursor-pointer hover:text-white"><Plus size={18} /></button></div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <div key={channel.id} className="relative">
                <Button
                  onClick={() => onSelectChannel(channel.name)}
                  variant="ghost"
                  className={cn("w-full justify-between gap-2 hover:text-white", activeChannelId === channel.id
                    ? 'bg-blue-700 text-white hover:bg-blue-700 '
                    : 'text-blue-200 hover:bg-blue-600'
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
                    className="absolute right-0 top-0 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full hover:text-blue-200/80 outline-none transition-colors text-transparent focus-visible:ring-2 focus-visible:ring-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={4} className="min-w-36">
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
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

      <Dialog open={isAddChannelDialogOpen} onOpenChange={setIsAddChannelDialogOpen}>
        <DialogContent className="max-w-s">
          <DialogHeader>
            <DialogTitle>Adicionar Canal</DialogTitle>
            <DialogDescription >
              Adicione um novo canal para sua equipe.
            </DialogDescription>
            <Input type="text" className="border-gray-400" placeholder="Nome do canal" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
            <Button className="text-gray-400 bg-transparent border-gray-400" variant="outline" onClick={() => setIsAddChannelDialogOpen(false)}>Cancelar</Button>
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
            <Button className="text-gray-400 bg-transparent border-gray-400" variant="outline" onClick={() => setOpenDeleteChannelDialog(false)}>Cancelar</Button>
            <Button className={cn(isDeletingRoom && 'px-11')} variant="destructive" onClick={() => handleDeleteChannel(selectedChannelId ?? '')} disabled={isDeletingRoom}>{isDeletingRoom ? <Loader2 className="animate-spin" /> : 'Deletar canal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MyWorkspace openSettingsDialog={openSettingsDialog} setOpenSettingsDialog={setOpenSettingsDialog} />
    </div >
  );
}