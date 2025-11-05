
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, User, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ChatRoom {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  recipient_id: string;
  recipient_username?: string;
}

interface PersonalChatListProps {
  currentUserId?: string;
  onSelectChat: (chatId: string, recipientName: string) => void;
}

const PersonalChatList = ({ currentUserId, onSelectChat }: PersonalChatListProps) => {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUserId) return;

    const fetchChats = async () => {
      try {
        // First, get chats where the user is the creator
        const { data: creatorChats, error: creatorError } = await supabase
          .from("personal_chats")
          .select("*")
          .eq("created_by", currentUserId);

        if (creatorError) throw creatorError;

        // Then, get chats where the user is the recipient
        const { data: recipientChats, error: recipientError } = await supabase
          .from("personal_chats")
          .select("*")
          .eq("recipient_id", currentUserId);

        if (recipientError) throw recipientError;

        // Combine both sets of chats
        const allChats = [...(creatorChats || []), ...(recipientChats || [])];
        
        // Get usernames for chat partners
        const chatPartnerIds = allChats.map(chat => 
          chat.created_by === currentUserId ? chat.recipient_id : chat.created_by
        );
        
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", chatPartnerIds);
          
        if (profilesError) throw profilesError;
        
        // Map usernames to chats
        const chatsWithUsernames = allChats.map(chat => {
          const partnerId = chat.created_by === currentUserId ? chat.recipient_id : chat.created_by;
          const partnerProfile = profiles?.find(profile => profile.id === partnerId);
          return {
            ...chat,
            recipient_username: partnerProfile?.username || "Unknown User"
          };
        });
        
        setChats(chatsWithUsernames);
      } catch (error) {
        console.error("Error fetching personal chats:", error);
        toast({
          title: "Error",
          description: "Failed to load your personal chats",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_chats'
        },
        () => fetchChats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, toast]);

  const createNewChat = async () => {
    if (!currentUserId || !recipientUsername.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Find recipient user by username
      const { data: recipientData, error: recipientError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", recipientUsername.trim())
        .single();

      if (recipientError || !recipientData) {
        throw new Error("User not found");
      }

      if (recipientData.id === currentUserId) {
        throw new Error("You cannot start a chat with yourself");
      }

      // Check if chat already exists
      const { data: existingChatsAsCreator, error: checkErrorCreator } = await supabase
        .from("personal_chats")
        .select("id")
        .eq("created_by", currentUserId)
        .eq("recipient_id", recipientData.id);

      if (checkErrorCreator) throw checkErrorCreator;

      const { data: existingChatsAsRecipient, error: checkErrorRecipient } = await supabase
        .from("personal_chats")
        .select("id")
        .eq("created_by", recipientData.id)
        .eq("recipient_id", currentUserId);

      if (checkErrorRecipient) throw checkErrorRecipient;

      const existingChat = [
        ...(existingChatsAsCreator || []), 
        ...(existingChatsAsRecipient || [])
      ];

      if (existingChat.length > 0) {
        // Chat already exists, select it
        setIsNewChatDialogOpen(false);
        onSelectChat(existingChat[0].id, recipientData.username);
        return;
      }

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from("personal_chats")
        .insert({
          created_by: currentUserId,
          recipient_id: recipientData.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      setIsNewChatDialogOpen(false);
      toast({
        title: "Success",
        description: `Chat with ${recipientData.username} created successfully`,
      });
      
      // Select the new chat
      if (newChat) {
        onSelectChat(newChat.id, recipientData.username);
      }
    } catch (error: any) {
      console.error("Error creating chat:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create new chat",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setRecipientUsername("");
    }
  };

  const getChatPartnerName = (chat: ChatRoom) => {
    if (chat.recipient_username) {
      return chat.recipient_username;
    }
    return "Unknown User";
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading your conversations...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Personal Chats
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsNewChatDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {chats.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to message other users</p>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => onSelectChat(chat.id, getChatPartnerName(chat))}
              >
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{getChatPartnerName(chat)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(chat.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Conversation</DialogTitle>
            <DialogDescription>
              Enter the username of the person you want to chat with
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Username"
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewChat} disabled={isSubmitting || !recipientUsername.trim()}>
              {isSubmitting ? "Creating..." : "Start Chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalChatList;
