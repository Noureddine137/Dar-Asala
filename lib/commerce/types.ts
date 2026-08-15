export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string;
  position: number;
  kind: string;
};

export type ProductVariantDTO = {
  id: string;
  sku: string;
  color: string;
  size: string;
  hardware: string;
  strap: string;
  stock: number;
  isMadeToOrder: boolean;
  price: number;
  imageId: string | null;
};

export type ReviewDTO = {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  country: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export type ProductCardDTO = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  isMadeToOrder: boolean;
  primaryImage: ProductImageDTO | null;
  hoverImage: ProductImageDTO | null;
  colors: string[];
};

export type ProductDetailDTO = ProductCardDTO & {
  description: string;
  story: string | null;
  materials: string;
  careInstructions: string;
  productionTime: string;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  reviews: ReviewDTO[];
  averageRating: number;
  reviewCount: number;
};

export type CollectionDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
};
