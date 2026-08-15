// Demo testimonials for development/preview. Replace with real, verified
// customer reviews before this brand goes live.
export type Testimonial = {
  id: string;
  quote: string;
  rating: number;
  name: string;
  country: string;
  avatar: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The leather is even richer in person and the stitching is immaculate. This is the kind of bag you buy once and keep for a decade.",
    rating: 5,
    name: "Sophie B.",
    country: "France",
    avatar: "/images/avatars/s-b.webp",
  },
  {
    id: "t2",
    quote: "Structured but not stiff, and the size is perfect for daily use without ever feeling bulky.",
    rating: 5,
    name: "Laura M.",
    country: "Germany",
    avatar: "/images/avatars/l-m.webp",
  },
  {
    id: "t3",
    quote: "You can feel that it's handmade — small, honest details you just don't get from mass-produced bags.",
    rating: 5,
    name: "Amel K.",
    country: "Belgium",
    avatar: "/images/avatars/a-k.webp",
  },
  {
    id: "t4",
    quote: "Fits my laptop and still looks elegant for dinner afterwards. My most-used bag by far.",
    rating: 4,
    name: "Nora H.",
    country: "Netherlands",
    avatar: "/images/avatars/n-h.webp",
  },
  {
    id: "t5",
    quote: "Ordered a made-to-order piece and the wait was completely worth it. Beautifully packaged too.",
    rating: 5,
    name: "Elise R.",
    country: "France",
    avatar: "/images/avatars/e-r.webp",
  },
];
