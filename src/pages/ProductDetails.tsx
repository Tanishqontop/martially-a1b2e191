
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Tag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Minus, 
  Plus, 
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { getProductById, getRelatedProducts } from "@/data/products";
import { toast } from "sonner";
import { addItemToCart } from "@/utils/cart";
import { loadRazorpayScript, initializeRazorpayPayment } from "@/utils/razorpay";
import { supabase } from "@/integrations/supabase/client";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const product = getProductById(productId || "");
  
  const relatedProducts = product 
    ? getRelatedProducts(product.id, product.category) 
    : [];
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/shop")}>
          Return to Shop
        </Button>
      </div>
    );
  }
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };
  
  const addToCart = () => {
    addItemToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.title} to cart`);
  };

  const handleBuyNow = async () => {
    try {
      setIsProcessing(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to complete your purchase");
        navigate("/auth");
        return;
      }
      
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Could not load payment system. Please try again.");
        return;
      }
      
      // The supabase client doesn't know about the purchases table in TypeScript yet
      // but it exists in the database, so we use a workaround with "as any"
      const { data: purchase, error: purchaseError } = await (supabase
        .from('purchases' as any)
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_title: product.title,
          quantity: quantity,
          amount: product.price * quantity,
          status: 'pending'
        })
        .select()
        .single() as any);
      
      if (purchaseError) {
        console.error('Purchase creation error:', purchaseError);
        toast.error("Failed to create purchase. Please try again.");
        return;
      }
      
      // Initialize Razorpay payment
      const response = await initializeRazorpayPayment(
        product.price * quantity,
        {
          productTitle: product.title,
          productId: product.id,
          quantity: quantity
        }
      );
      
      if (response.razorpay_payment_id) {
        // Update purchase record with payment ID and status
        const { error: updateError } = await (supabase
          .from('purchases' as any)
          .update({ 
            status: 'completed',
            payment_id: response.razorpay_payment_id
          })
          .eq('id', purchase.id) as any);
        
        if (updateError) {
          console.error('Purchase update error:', updateError);
          toast.error("Payment successful, but purchase status update failed.");
          return;
        }
        
        toast.success("Payment successful! Your order has been placed.");
        // Consider redirecting to an order confirmation or orders page
        // navigate("/orders");
      }
    } catch (error: any) {
      console.error('Buy now error:', error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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

      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-green-600">Shop</Link>
            <span className="mx-2">/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-green-600">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center text-green-600 mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center mb-4">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              {product.discount && (
                <div className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4" 
                      fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="ml-2 text-green-600 text-sm font-medium">
                    Save ₹{product.originalPrice! - product.price}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">
                {product.description}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center p-3 border rounded-lg">
                    <Truck className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-xs text-center">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-xs text-center">1 Year Warranty</span>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-lg">
                    <RefreshCw className="h-6 w-6 text-green-600 mb-1" />
                    <span className="text-xs text-center">30-Day Returns</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="quantity" className="block font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    className="border border-gray-300 rounded-l-md px-3 py-2 hover:bg-gray-100"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-16 py-2 border-t border-b text-center">
                    {quantity}
                  </div>
                  <button 
                    className="border border-gray-300 rounded-r-md px-3 py-2 hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={addToCart}
                  disabled={isProcessing}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-600 text-green-600 hover:bg-green-50 flex-1"
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Buy Now"}
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="divide-y divide-gray-200">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="py-2 flex justify-between">
                        <dt className="text-gray-600">{key}</dt>
                        <dd className="font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="block">
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="h-48 overflow-hidden bg-gray-50">
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.title} 
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">{relatedProduct.category}</div>
                        <h3 className="font-medium text-base mb-2 line-clamp-1">{relatedProduct.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{relatedProduct.price}</span>
                          {relatedProduct.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">₹{relatedProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-12 px-4">
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
              <li><Link to="/shop?category=Apparel" className="text-gray-300 hover:text-white">Apparel</Link></li>
              <li><Link to="/shop?category=Equipment" className="text-gray-300 hover:text-white">Equipment</Link></li>
              <li><Link to="/shop?category=Uniform" className="text-gray-300 hover:text-white">Uniform</Link></li>
              <li><Link to="/shop?category=Footwear" className="text-gray-300 hover:text-white">Footwear</Link></li>
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

export default ProductDetails;
