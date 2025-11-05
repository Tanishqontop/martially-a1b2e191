
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/3b63e07a-d093-4892-b629-f16edd347f58.png" 
        alt="Martially Logo" 
        className="h-12 w-12"
      />
      <span className="font-bold text-xl">Martially</span>
    </div>
  );
};

export default Logo;
