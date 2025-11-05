
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ClassImage from "./ClassImage";
import EnrollButton from "./EnrollButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ClassCardProps {
  id: string;
  title: string;
  style: string;
  location: string;
  price: string;
  imageUrl: string;
}

const ClassCard = ({ id, title, style, location, price, imageUrl }: ClassCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-martial-white">
      <ClassImage imageUrl={imageUrl} style={style} title={title} />
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-green-600 font-semibold">{style}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{location}</p>
        <p className="font-bold mt-2">{price}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild className="w-1/2 mr-2">
          <Link to={`/class/${id}`}>View Details</Link>
        </Button>
        <EnrollButton 
          classId={id}
          style={style}
          title={title}
          price={price}
          className="w-1/2"
        />
      </CardFooter>
    </Card>
  );
};

export default ClassCard;
