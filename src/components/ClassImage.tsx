import { useState } from "react";

interface ClassImageProps {
  imageUrl: string;
  style: string;
  title: string;
}

const ClassImage = ({ imageUrl, style, title }: ClassImageProps) => {
  const [imageError, setImageError] = useState(false);

  const getDefaultImage = (style: string) => {
    const styleImages: { [key: string]: string } = {
      'MMA': '/mma.jpg',
      'Boxing': '/boxing.jpg',
      'Muay Thai': '/muaythai.jpg',
      'Brazilian Jiu-Jitsu': '/bjj.jpg',
      'Karate': '/karate.jpg',
      'Kung Fu': '/kungfu.jpg',
      'Taekwondo': '/tkd.jpg'
    };
    
    return styleImages[style] || '/placeholder.svg';
  };

  return (
    <div className="h-48 overflow-hidden">
      <img 
        src={imageError ? getDefaultImage(style) : (imageUrl || getDefaultImage(style))}
        alt={title} 
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ClassImage;