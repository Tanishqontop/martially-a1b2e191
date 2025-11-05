
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";

const ChatRoom = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // Get user's profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (!user) return;

    // Create or get the general chat room
    const initializeRoom = async () => {
      const { data: room } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("name", "General")
        .maybeSingle();

      if (room) {
        setRoomId(room.id);
      } else {
        const { data: newRoom, error } = await supabase
          .from("chat_rooms")
          .insert({
            name: "General",
            created_by: user.id
          })
          .select()
          .single();

        if (error) {
          toast({
            title: "Error creating chat room",
            description: error.message,
            variant: "destructive",
          });
        } else if (newRoom) {
          setRoomId(newRoom.id);
        }
      }
    };

    initializeRoom();
  }, [user, toast]);

  useEffect(() => {
    if (!roomId) return;

    // Subscribe to new messages
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // Load existing messages with profile information
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          *,
          profiles:profiles (
            user_type,
            username,
            id
          )
        `)
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error loading messages",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setMessages(data);
      }
    };

    loadMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !user?.id) return;

    const { error } = await supabase.from("chat_messages").insert({
      room_id: roomId,
      content: newMessage.trim(),
      user_id: user.id
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg">
      <ChatHeader />
      <MessageList messages={messages} currentUserId={user?.id} />
      <MessageInput 
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={sendMessage}
      />
    </div>
  );
};

export default ChatRoom;
