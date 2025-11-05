
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
    user_type: string;
    id: string;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col space-y-1 ${
              message.user_id === currentUserId ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {message.profiles?.username || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className={`text-gray-700 rounded-lg p-2 max-w-[80%] ${
              message.user_id === currentUserId
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}>
              {message.content}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
