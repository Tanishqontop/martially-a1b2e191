
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MessageInput = ({ value, onChange, onSubmit }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button type="submit">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
