
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "@/components/chat/MessageInput";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface PersonalChatViewProps {
  chatId: string;
  recipientName: string;
  currentUserId?: string;
}

const PersonalChatView = ({ chatId, recipientName, currentUserId }: PersonalChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("personal_chat_messages")
          .select("id, content, sender_id, created_at")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to realtime updates for new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'personal_chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, currentUserId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !currentUserId) return;

    try {
      const { error } = await supabase
        .from("personal_chat_messages")
        .insert({
          chat_id: chatId,
          sender_id: currentUserId,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (!chatId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat with {recipientName}</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col space-y-1 ${
                  message.sender_id === currentUserId ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                <p className={`rounded-lg p-3 max-w-[80%] ${
                  message.sender_id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.content}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
      />
    </div>
  );
};

export default PersonalChatView;
