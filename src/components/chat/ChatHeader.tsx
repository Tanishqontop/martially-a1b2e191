
import { MessageSquare } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="p-4 border-b flex items-center gap-2">
      <MessageSquare className="w-5 h-5" />
      <h2 className="text-lg font-semibold">Chat Room</h2>
    </div>
  );
};

export default ChatHeader;
