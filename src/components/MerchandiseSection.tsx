
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import { addItemToCart } from "@/utils/cart";
import { toast } from "@/hooks/use-toast";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ProductItemProps {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
}

const ProductItem = ({ id, image, title, price, originalPrice, discount, category }: ProductItemProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    
    const product = products.find(p => p.id === id);
    if (product) {
      addItemToCart(product);
      toast({
        title: "Added to Cart",
        description: `${title} has been added to your cart`,
        variant: "default",
      });
    }
  };

  return (
    <Link to={`/product/${id}`} className="block">
      <Card className="product-card overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div className="absolute top-3 left-3 z-10">
            {discount && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" /> {discount}% OFF
              </span>
            )}
          </div>
          <div className="h-64 overflow-hidden bg-gray-50">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">{category}</div>
          <h3 className="font-medium text-base mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">₹{price}</span>
            {originalPrice && (
              <span className="text-gray-500 line-through text-sm">₹{originalPrice}</span>
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-3 border-green-600 text-green-600 hover:bg-green-600 hover:text-white group"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-1 h-4 w-4 group-hover:animate-pulse" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
};

const MerchandiseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current.children, { y: 30, opacity: 0 });
      
      gsap.to(headerRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top bottom-=100",
          end: "bottom top+=100",
          toggleActions: "play none none reverse"
        }
      });
    }
    
    if (productsRef.current) {
      const productCards = productsRef.current.querySelectorAll('.product-card');
      
      gsap.set(productCards, { opacity: 0, y: 40 });
      
      productCards.forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            end: "bottom top+=100",
            toggleActions: "play none none reverse"
          },
          delay: index * 0.1
        });
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Get the first 4 products for the featured section
  const featuredProducts = products.slice(0, 4);

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 md:py-24 bg-gradient-to-r from-martial-green to-martial-gray"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Martial <span className="text-green-600">Merchandise</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6 text-center">
            Elevate your training with premium martial arts gear and apparel
          </p>
          <div className="inline-block">
            <div className="relative overflow-hidden inline-block">
              <div className="absolute inset-0 bg-green-100 -skew-x-12 transform-gpu z-0"></div>
              <Link to="/shop">
                <Button
                  className="relative z-10 bg-green-600 hover:bg-green-700 text-white px-6 py-6 text-base"
                >
                  Shop All Gear
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="relative overflow-hidden rounded-xl backdrop-blur-sm p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-blue-500/30 mix-blend-multiply"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-md">
                SPECIAL OFFER
              </h3>
              <p className="text-xl md:text-2xl font-semibold mb-2 text-white drop-shadow-sm">
                Save 30% on Training Equipment
              </p>
              <p className="text-white/90 mb-6 max-w-md">
                Limited time offer on professional-grade martial arts equipment. 
                Upgrade your training gear today!
              </p>
              <Link to="/shop">
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  Shop Now <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold">Bestselling Products</h3>
          <Link to="/shop" className="text-green-600 hover:text-green-700 font-medium flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductItem 
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              category={product.category}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 mix-blend-multiply"></div>
              <div className="relative p-6 md:p-8 z-10">
                <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">New Arrivals</h3>
                <p className="text-white/90 mb-4 max-w-xs">
                  Discover the latest additions to our martial arts collection
                </p>
                <Link to="/shop">
                  <Button variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white hover:text-indigo-600">
                    Shop New
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 to-orange-500/40 mix-blend-multiply"></div>
              <div className="relative p-6 md:p-8 z-10">
                <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">Clearance Sale</h3>
                <p className="text-white/90 mb-4 max-w-xs">
                  Up to 60% off on selected items while supplies last
                </p>
                <Link to="/shop">
                  <Button variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white hover:text-orange-600">
                    Shop Sale
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MerchandiseSection;
