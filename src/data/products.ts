
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    image: "/lovable-uploads/8cfc88f8-609f-42ff-8091-1633eada1955.png", // Updated to compression shirt image
    title: "Men's Pro Performance Training Shirt",
    price: 649,
    originalPrice: 1299,
    discount: 50,
    category: "Apparel",
    description: "Designed for martial arts practitioners, this premium training shirt offers superior moisture-wicking and breathability for intense workouts. The ergonomic fit allows full range of motion for kicks, punches, and grappling techniques.",
    features: [
      "4-way stretch fabric for unrestricted movement",
      "Anti-odor technology keeps you fresh during long training sessions",
      "Flatlock seams prevent chafing",
      "Quick-dry technology",
      "UV protection (UPF 30+)"
    ],
    specifications: {
      "Material": "88% Polyester, 12% Elastane",
      "Care": "Machine wash cold, tumble dry low",
      "Weight": "160g",
      "Fit": "Athletic fit"
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 42
  },
  {
    id: "2",
    image: "/lovable-uploads/c01c603e-1738-4fea-83c3-2e9c6411855b.png", // Updated to yoga pose image
    title: "Women's Essential Yoga Pants",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "Apparel",
    description: "Perfect for yoga, martial arts, or any movement practice, these premium yoga pants provide the perfect balance of stretch and support. High-waisted design offers core stability during complex movements.",
    features: [
      "High-waisted design for maximum coverage and support",
      "Hidden pocket in waistband for small essentials",
      "Moisture-wicking fabric keeps you dry",
      "Four-way stretch material moves with your body",
      "Flatlock seams minimize chafing"
    ],
    specifications: {
      "Material": "75% Polyester, 25% Spandex",
      "Care": "Machine wash cold, hang to dry",
      "Rise": "High-rise",
      "Length": "Full length",
      "Fit": "Compression fit"
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 76
  },
  {
    id: "3",
    image: "/lovable-uploads/92b0b3df-ea68-4898-a9c1-e108608a9510.png",
    title: "Professional Muay Thai Training Gloves",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: "Equipment",
    description: "These professional-grade Muay Thai gloves are crafted with genuine leather and premium padding for maximum protection and performance. Designed for both training and competition, they provide excellent wrist support and knuckle protection.",
    features: [
      "Genuine leather construction for durability",
      "Multi-layered foam padding for impact absorption",
      "Reinforced stitching at stress points",
      "Extended wrist strap for added support",
      "Breathable mesh palm for cooling"
    ],
    specifications: {
      "Material": "Premium genuine leather",
      "Weight": "12oz, 14oz, 16oz options",
      "Closure": "Hook and loop strap",
      "Padding": "Multi-density foam",
      "Hand Compartment": "Ergonomic natural hand position"
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 108
  },
  {
    id: "4",
    image: "/lovable-uploads/a70e09ba-043b-4358-91f9-5ae59f798d36.png",
    title: "Karate Uniform Premium Set",
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    category: "Uniform",
    description: "This premium Karate uniform (Gi) is crafted from heavyweight cotton canvas for durability and a traditional appearance. The set includes a jacket, pants, and belt, providing everything needed for training or competition.",
    features: [
      "100% heavyweight cotton canvas for traditional feel and durability",
      "Reinforced stitching at all stress points",
      "Traditional drawstring pants",
      "Pre-shrunk fabric",
      "Complete set including white belt"
    ],
    specifications: {
      "Material": "100% Cotton, 12oz weight",
      "Style": "Traditional cut",
      "Includes": "Jacket, pants, and white belt",
      "Care": "Machine washable, air dry recommended",
      "Sizes": "000-7 (children to adult)"
    },
    inStock: true,
    rating: 4.6,
    reviewCount: 53
  },
  {
    id: "5",
    image: "/lovable-uploads/d4b832ee-8119-4e34-b07d-07ce99ebad20.png",
    title: "Advanced Taekwondo Training Pads",
    price: 2499,
    originalPrice: 3499,
    discount: 30,
    category: "Equipment",
    description: "These advanced training pads are designed specifically for Taekwondo practitioners. The curved design allows coaches to catch and absorb powerful kicks while providing accurate feedback to students.",
    features: [
      "Curved design optimized for catching kicks",
      "High-density foam core for impact absorption",
      "Reinforced handle grips for secure hold",
      "Water-resistant cover for easy cleaning",
      "Lightweight design reduces coach fatigue"
    ],
    specifications: {
      "Material": "Synthetic leather with PU coating",
      "Padding": "Multi-layered high-density foam",
      "Weight": "850g per pad",
      "Dimensions": "40cm x 20cm x 10cm",
      "Care": "Wipe clean with damp cloth"
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 37
  },
  {
    id: "6",
    image: "/lovable-uploads/3c0a55c7-728e-40da-9344-df27e6615bb6.png",
    title: "Brazilian Jiu-Jitsu Gi - Pro Edition",
    price: 3599,
    originalPrice: 4999,
    discount: 28,
    category: "Uniform",
    description: "This professional-grade BJJ Gi is designed for serious practitioners. The pearl weave fabric provides durability while remaining lightweight, and the reinforced stitching ensures it can withstand the rigors of intense rolling sessions.",
    features: [
      "Premium pearl weave fabric - durable yet lightweight",
      "Triple stitching at all stress points",
      "Reinforced collar with rubber insert for durability",
      "Competition legal cut and design",
      "Pre-shrunk fabric treatment"
    ],
    specifications: {
      "Material": "Pearl weave 100% cotton",
      "Weight": "450gsm jacket, 10oz ripstop pants",
      "Collar": "EVA foam core with cotton covering",
      "Care": "Cold wash, hang dry",
      "Includes": "Jacket and pants (belt sold separately)"
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: "7",
    image: "/lovable-uploads/9ade8d3d-57e5-4263-ad49-a9270bc941cc.png",
    title: "Kung Fu Practice Shoes",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: "Footwear",
    description: "Traditional Kung Fu shoes with modern performance features. These lightweight shoes provide excellent ground feel and flexibility while protecting your feet during practice on various surfaces.",
    features: [
      "Traditional design with modern materials",
      "Ultra-thin rubber sole for excellent ground feel",
      "Breathable cotton upper",
      "Elastic closure for secure fit",
      "Non-marking sole suitable for indoor training"
    ],
    specifications: {
      "Upper Material": "Cotton canvas",
      "Sole": "Thin rubber, non-marking",
      "Closure": "Elastic band",
      "Weight": "About 180g per pair",
      "Care": "Hand wash, air dry"
    },
    inStock: true,
    rating: 4.5,
    reviewCount: 62
  },
  {
    id: "8",
    image: "/lovable-uploads/b0e874cf-d98c-482c-b1ac-9df1fe560ad3.png", // Updated to MMA jersey image
    title: "MMA Competition Shorts",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "Apparel",
    description: "Designed for MMA fighters, these competition shorts feature a 4-way stretch fabric and split side seams for unrestricted movement during striking and grappling exchanges.",
    features: [
      "4-way stretch fabric moves in every direction",
      "Split side seams for full range of motion",
      "Secure waistband with drawstring closure",
      "Antimicrobial treatment reduces odor",
      "Approved for professional competition"
    ],
    specifications: {
      "Material": "92% Polyester, 8% Spandex",
      "Closure": "Hook and loop with drawstring backup",
      "Length": "Mid-thigh",
      "Care": "Machine wash cold, line dry",
      "Features": "Inner grip waistband prevents slipping"
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 43
  },
  {
    id: "9",
    image: "/lovable-uploads/54225c9e-b592-4d73-af9d-80bca592c88d.png", // Updated to shorts image
    title: "Compression Training Shirt",
    price: 799,
    originalPrice: 1299,
    discount: 38,
    category: "Apparel",
    description: "This compression training shirt provides muscle support and temperature regulation during intense martial arts training. The tight fit enhances performance while the moisture-wicking fabric keeps you dry.",
    features: [
      "Compression fit supports muscles and improves circulation",
      "Moisture-wicking fabric keeps skin dry",
      "Flatlock seams prevent chafing",
      "UPF 50+ sun protection",
      "Anti-odor technology for freshness"
    ],
    specifications: {
      "Material": "84% Polyester, 16% Elastane",
      "Fit": "Compression (tight)",
      "Weight": "180g",
      "Care": "Machine wash cold, tumble dry low",
      "Sleeve": "Long sleeve"
    },
    inStock: true,
    rating: 4.6,
    reviewCount: 55
  },
  {
    id: "10",
    image: "/lovable-uploads/a70e09ba-043b-4358-91f9-5ae59f798d36.png",
    title: "Junior Karate Gi Set",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    category: "Uniform",
    description: "Designed specifically for young martial artists, this junior Karate Gi provides the perfect balance of durability and comfort. The lightweight fabric allows full mobility while still maintaining the traditional look and feel.",
    features: [
      "Lightweight fabric ideal for children",
      "Reinforced stitching at stress points",
      "Elastic waistband pants for secure fit",
      "Traditional drawstring included",
      "Complete set ready for training"
    ],
    specifications: {
      "Material": "100% Cotton, 8oz weight",
      "Includes": "Jacket, pants, and white belt",
      "Sizes": "000-5 (age 4-12)",
      "Care": "Machine washable, tumble dry low",
      "Color": "White"
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 29
  },
  {
    id: "11",
    image: "/lovable-uploads/92b0b3df-ea68-4898-a9c1-e108608a9510.png",
    title: "Boxing Gloves - Beginner Series",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    category: "Equipment",
    description: "Perfect for beginners, these boxing gloves offer excellent protection and comfort at an affordable price. The synthetic leather construction provides durability while the multi-layered foam protects hands during training.",
    features: [
      "Synthetic leather construction",
      "Multi-layered foam padding",
      "Secure hook and loop closure",
      "Ventilated mesh palm for cooling",
      "Thumb lock feature for safety"
    ],
    specifications: {
      "Material": "PU synthetic leather",
      "Weight Options": "8oz, 10oz, 12oz",
      "Closure": "Hook and loop strap",
      "Padding": "Multi-density foam",
      "Care": "Wipe clean, air dry"
    },
    inStock: true,
    rating: 4.4,
    reviewCount: 38
  },
  {
    id: "12",
    image: "/lovable-uploads/4b09a9dc-3f38-47e2-89b1-6db8f7bb64ed.png",
    title: "Women's Training Shorts",
    price: 699,
    originalPrice: 1099,
    discount: 36,
    category: "Apparel",
    description: "These women's training shorts are designed specifically for martial arts practice. The lightweight, stretchy fabric allows for high kicks and complex movements, while the longer inseam provides adequate coverage.",
    features: [
      "4-way stretch fabric for freedom of movement",
      "Wide waistband for comfort and coverage",
      "Built-in brief liner for added protection",
      "Quick-dry fabric for intense training sessions",
      "Side slits for maximum mobility"
    ],
    specifications: {
      "Material": "86% Polyester, 14% Spandex",
      "Length": "Mid-thigh with side slits",
      "Waistband": "Wide, yoga-style waistband",
      "Care": "Machine wash cold, tumble dry low",
      "Features": "Hidden pocket in waistband"
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 47
  }
];

// Helper function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get related products
export const getRelatedProducts = (productId: string, category: string, limit: number = 4): Product[] => {
  return products
    .filter(product => product.id !== productId && product.category === category)
    .slice(0, limit);
};
