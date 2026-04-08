'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Hash, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Channel } from '../App';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { Room } from '@/application/services/rooms/type';

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelName: string) => void;
  onAddChannel: UseMutateAsyncFunction<Room, Error, string, unknown>
}

export function Sidebar({ channels, activeChannelId, onSelectChannel, onAddChannel }: SidebarProps) {
  const [isAddChannelDialogOpen, setIsAddChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');


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


  return (
    <div className="w-64 bg-purple-900 text-white flex flex-col">
      <div className="p-4">
        <h1 className="font-bold text-lg">Meu Workspace</h1>
      </div>

      <Separator className="bg-purple-800" />

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="text-sm text-purple-300 mb-2 px-2 py-1 flex justify-between hover:bg-purple-700 rounded-md">Canais  <button onClick={() => setIsAddChannelDialogOpen(true)} className="text-transparent cursor-pointer hover:text-white"><Plus size={18} /></button></div>
          <div className="space-y-1">
            {channels.map(channel => (
              <Button
                key={channel.id}
                onClick={() => onSelectChannel(channel.name)}
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

      <Dialog open={isAddChannelDialogOpen} onOpenChange={setIsAddChannelDialogOpen}>
        <DialogContent className="max-w-s">
          <DialogHeader>
            <DialogTitle>Adicionar Canal</DialogTitle>
            <DialogDescription >
              Adicione um novo canal para sua equipe.
            </DialogDescription>
            <Input type="text"  className="border-gray-400" placeholder="Nome do canal" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
            <Button variant="outline" onClick={() => setIsAddChannelDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleCreateRoom(newChannelName)} disabled={!newChannelName.trim()}>Criar canal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}