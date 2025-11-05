
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ShoppingBag, Tag, Filter, ChevronDown, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import { addItemToCart } from "@/utils/cart";
import { toast } from "@/hooks/use-toast";

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { id, image, title, price, originalPrice, discount, category } = product;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    addItemToCart(product);
    toast({
      title: "Added to Cart",
      description: `${title} has been added to your cart`,
      variant: "default",
    });
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

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  
  // Filter products by category if a category is selected
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;
    
  // Sort products based on the selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "discount":
        return (b.discount || 0) - (a.discount || 0);
      default:
        return 0;
    }
  });
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="hidden sm:inline-flex border-green-600 text-green-600">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Shop Header Section */}
      <div className="bg-martial-green py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-green-700 hover:text-green-800 flex items-center">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Martial Arts <span className="text-green-600">Shop</span>
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Premium martial arts equipment and apparel for practitioners of all levels
          </p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-2 py-1 rounded ${!selectedCategory ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-2 py-1 rounded ${selectedCategory === category ? 'bg-green-50 text-green-600' : ''}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-gray-500">Showing {sortedProducts.length} products</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Sort by:</span>
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none border rounded py-1 px-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      <option value="default">Featured</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="discount">Discount</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductItem 
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="text-white" />
            <p className="mt-4 text-gray-300">
              Connecting martial arts enthusiasts with quality training centers since 2023.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-white">Shop</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-white">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map(category => (
                <li key={category}>
                  <button 
                    onClick={() => setSelectedCategory(category)}
                    className="text-gray-300 hover:text-white"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: shop@martially.com</li>
              <li className="text-gray-300">Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Martially. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
