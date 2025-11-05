
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PersonalChatList from "./PersonalChatList";
import PersonalChatView from "./PersonalChatView";

const PersonalChatContainer = () => {
  const [session, setSession] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<{id: string, recipientName: string} | null>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectChat = (chatId: string, recipientName: string) => {
    setSelectedChat({ id: chatId, recipientName });
  };

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 bg-gray-50 rounded-xl max-w-md">
          <h3 className="text-xl font-semibold mb-2">Sign in to chat</h3>
          <p className="text-gray-600">You need to be signed in to use the personal chat feature</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] grid grid-cols-1 md:grid-cols-3 border rounded-xl overflow-hidden">
      <div className="border-r">
        <PersonalChatList 
          currentUserId={session?.user?.id} 
          onSelectChat={handleSelectChat} 
        />
      </div>
      <div className="md:col-span-2">
        <PersonalChatView 
          chatId={selectedChat?.id || ''} 
          recipientName={selectedChat?.recipientName || ''} 
          currentUserId={session?.user?.id} 
        />
      </div>
    </div>
  );
};

export default PersonalChatContainer;
