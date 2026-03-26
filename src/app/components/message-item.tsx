import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '../App';

interface MessageItemProps {
    message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex gap-3 hover:bg-accent -mx-2 px-2 py-1 rounded">
            <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                    {message.avatar}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold">{message.user}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-foreground">{message.text}</p>
            </div>
        </div>
    );
}