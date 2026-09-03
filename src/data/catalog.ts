import catMakeup from "@/assets/cat-makeup.jpg";
import catSkincare from "@/assets/cat-skincare.jpg";
import catHaircare from "@/assets/cat-haircare.jpg";
import catFragrance from "@/assets/cat-fragrance.jpg";
import catBath from "@/assets/cat-bath.jpg";
import catTools from "@/assets/cat-tools.jpg";
import catGifts from "@/assets/cat-gifts.jpg";

export type CategorySlug =
  | "makeup"
  | "skincare"
  | "haircare"
  | "fragrance"
  | "bath-body"
  | "beauty-tools"
  | "gift-sets";

export interface Category {
  slug: CategorySlug;
  name: string;
  emoji: string;
  image: string;
  blurb: string;
}

export const categories: Category[] = [
  { slug: "makeup", name: "Makeup", emoji: "💄", image: catMakeup, blurb: "Lips, eyes & flawless base" },
  { slug: "skincare", name: "Skincare", emoji: "🧴", image: catSkincare, blurb: "Serums, cleansers & SPF" },
  { slug: "haircare", name: "Haircare", emoji: "💇", image: catHaircare, blurb: "Shampoo, oils & masks" },
  { slug: "fragrance", name: "Fragrance", emoji: "🌸", image: catFragrance, blurb: "Perfumes & eau de parfum" },
  { slug: "bath-body", name: "Bath & Body", emoji: "🛁", image: catBath, blurb: "Scrubs, lotions & washes" },
  { slug: "beauty-tools", name: "Beauty Tools", emoji: "💅", image: catTools, blurb: "Brushes, rollers & blenders" },
  { slug: "gift-sets", name: "Gift Sets", emoji: "🎁", image: catGifts, blurb: "Curated self-care boxes" },
];

export const categoryImage: Record<CategorySlug, string> = {
  makeup: catMakeup,
  skincare: catSkincare,
  haircare: catHaircare,
  fragrance: catFragrance,
  "bath-body": catBath,
  "beauty-tools": catTools,
  "gift-sets": catGifts,
};

const productImageModules = import.meta.glob("../assets/products/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const productImages: Record<string, string> = Object.fromEntries(
  Object.entries(productImageModules).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.jpg$/, ""),
    url,
  ]),
);


export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  short: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  suitableFor: string;
  keywords: string[];
  bestSeller?: boolean;
  newArrival?: boolean;
  image: string;
}

interface Seed {
  n: string;
  b: string;
  c: CategorySlug;
  p: number;
  m: number;
  r: number;
  rv: number;
  s: number;
  d: string;
  k: string[];
  best?: boolean;
  fresh?: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const seeds: Seed[] = [
  // SKINCARE
  { n: "Vitamin C Glow Serum", b: "GlowAura", c: "skincare", p: 599, m: 799, r: 4.6, rv: 245, s: 34, d: "10% stabilised Vitamin C for visibly brighter, even-toned skin.", k: ["serum", "brightening", "vitamin c"], best: true },
  { n: "Hyaluronic Acid Serum", b: "LumiSkin", c: "skincare", p: 699, m: 999, r: 4.5, rv: 189, s: 26, d: "Multi-weight hyaluronic acid for deep, bouncy hydration.", k: ["serum", "hydration"], best: true },
  { n: "Gentle Face Cleanser", b: "PureBloom", c: "skincare", p: 399, m: 549, r: 4.4, rv: 312, s: 58, d: "Sulphate-free gel cleanser that never strips your skin barrier.", k: ["cleanser", "face wash"] },
  { n: "SPF 50 Sunscreen", b: "LumiSkin", c: "skincare", p: 549, m: 749, r: 4.7, rv: 421, s: 41, d: "Lightweight broad-spectrum SPF 50 PA++++ with zero white cast.", k: ["sunscreen", "spf"], best: true },
  { n: "Rose Face Mist", b: "PureBloom", c: "skincare", p: 299, m: 399, r: 4.3, rv: 158, s: 72, d: "Steam-distilled rose water mist for an instant refresh.", k: ["mist", "toner", "rose"] },
  { n: "Niacinamide Serum", b: "GlowAura", c: "skincare", p: 649, m: 899, r: 4.5, rv: 276, s: 19, d: "10% niacinamide with zinc to refine pores and control oil.", k: ["serum", "pores", "acne"], fresh: true },
  { n: "Aloe Vera Gel", b: "AuraCare", c: "skincare", p: 249, m: 349, r: 4.2, rv: 96, s: 88, d: "99% pure aloe gel that soothes irritation and sunburn.", k: ["aloe", "soothing"] },
  { n: "Hydrating Face Moisturizer", b: "LumiSkin", c: "skincare", p: 499, m: 699, r: 4.6, rv: 203, s: 7, d: "Featherlight ceramide moisturiser for 48-hour comfort.", k: ["moisturizer", "cream"] },
  // MAKEUP
  { n: "Matte Liquid Lipstick", b: "VelvetGlow", c: "makeup", p: 449, m: 599, r: 4.5, rv: 388, s: 64, d: "Transfer-proof matte colour that stays put for 12 hours.", k: ["lipstick", "lips", "matte"], best: true },
  { n: "Nude Eyeshadow Palette", b: "VelvetGlow", c: "makeup", p: 799, m: 1199, r: 4.6, rv: 214, s: 23, d: "12 blendable everyday-to-evening neutrals, matte and shimmer.", k: ["eyeshadow", "palette", "eyes"], best: true },
  { n: "Waterproof Mascara", b: "VelvetGlow", c: "makeup", p: 399, m: 549, r: 4.4, rv: 176, s: 45, d: "Smudge-proof volumising mascara with a tapered brush.", k: ["mascara", "eyes"] },
  { n: "Liquid Eyeliner", b: "VelvetGlow", c: "makeup", p: 299, m: 399, r: 4.3, rv: 142, s: 61, d: "Ultra-fine 0.4mm felt tip for a precise, inky wing.", k: ["eyeliner", "eyes"] },
  { n: "Cream Blush", b: "GlowAura", c: "makeup", p: 499, m: 699, r: 4.7, rv: 167, s: 30, d: "Melts into skin for a natural, lit-from-within flush.", k: ["blush", "cheeks"], fresh: true },
  { n: "Full Coverage Foundation", b: "VelvetGlow", c: "makeup", p: 699, m: 999, r: 4.4, rv: 258, s: 18, d: "Buildable full coverage in 20 shades made for Indian skin.", k: ["foundation", "base"] },
  { n: "Lip Gloss", b: "PureBloom", c: "makeup", p: 349, m: 499, r: 4.2, rv: 121, s: 77, d: "Non-sticky high-shine gloss with a hint of peppermint.", k: ["gloss", "lips"] },
  { n: "Makeup Setting Spray", b: "AuraCare", c: "makeup", p: 549, m: 749, r: 4.5, rv: 133, s: 36, d: "Locks makeup in place for 16 hours, even through humidity.", k: ["setting spray", "primer"] },
  // HAIRCARE
  { n: "Hydrating Shampoo", b: "AuraCare", c: "haircare", p: 499, m: 699, r: 4.4, rv: 231, s: 52, d: "Sulphate-free shampoo that cleanses without stripping moisture.", k: ["shampoo", "hair"] },
  { n: "Hair Repair Conditioner", b: "AuraCare", c: "haircare", p: 449, m: 649, r: 4.3, rv: 187, s: 48, d: "Protein-rich conditioner that rebuilds damaged strands.", k: ["conditioner", "hair"] },
  { n: "Hair Growth Oil", b: "PureBloom", c: "haircare", p: 399, m: 599, r: 4.6, rv: 344, s: 9, d: "Cold-pressed onion, bhringraj and rosemary blend for thicker hair.", k: ["hair oil", "growth"], best: true },
  { n: "Anti-Frizz Hair Serum", b: "LumiSkin", c: "haircare", p: 499, m: 699, r: 4.4, rv: 152, s: 43, d: "Weightless silicone-light serum for smooth, glossy hair.", k: ["hair serum", "frizz"] },
  { n: "Hair Mask", b: "AuraCare", c: "haircare", p: 549, m: 799, r: 4.5, rv: 118, s: 27, d: "5-minute deep conditioning mask with shea and keratin.", k: ["hair mask", "repair"], fresh: true },
  // BATH & BODY
  { n: "Body Scrub", b: "PureBloom", c: "bath-body", p: 349, m: 499, r: 4.3, rv: 104, s: 55, d: "Coffee and brown sugar scrub for silky, polished skin.", k: ["scrub", "body", "exfoliate"] },
  { n: "Body Lotion", b: "AuraCare", c: "bath-body", p: 399, m: 549, r: 4.5, rv: 198, s: 66, d: "24-hour shea butter moisture that never feels greasy.", k: ["lotion", "body"] },
  { n: "Body Wash", b: "PureBloom", c: "bath-body", p: 349, m: 449, r: 4.2, rv: 89, s: 71, d: "Soap-free foaming wash with jasmine and vanilla.", k: ["body wash", "shower"] },
  { n: "Hand & Body Cream", b: "GlowAura", c: "bath-body", p: 299, m: 399, r: 4.4, rv: 76, s: 83, d: "Fast-absorbing cream for constantly-washed hands.", k: ["hand cream", "body"] },
  // FRAGRANCE
  { n: "Eau de Parfum", b: "VelvetGlow", c: "fragrance", p: 999, m: 1499, r: 4.6, rv: 162, s: 22, d: "Amber, jasmine and sandalwood — a 10-hour signature.", k: ["perfume", "edp"], best: true },
  { n: "Floral Perfume", b: "PureBloom", c: "fragrance", p: 799, m: 1199, r: 4.4, rv: 128, s: 31, d: "Rose, peony and white musk for effortless everyday wear.", k: ["perfume", "floral"] },
  { n: "Fresh Citrus Perfume", b: "GlowAura", c: "fragrance", p: 899, m: 1299, r: 4.5, rv: 97, s: 25, d: "Bergamot, neroli and cedar — bright, clean and long-lasting.", k: ["perfume", "citrus"], fresh: true },
  // BEAUTY TOOLS
  { n: "Makeup Brush Set", b: "VelvetGlow", c: "beauty-tools", p: 599, m: 999, r: 4.5, rv: 211, s: 38, d: "12 ultra-soft vegan brushes with a travel pouch.", k: ["brushes", "tools"], best: true },
  { n: "Beauty Blender Set", b: "VelvetGlow", c: "beauty-tools", p: 299, m: 449, r: 4.3, rv: 143, s: 90, d: "Latex-free sponges for a seamless airbrushed base.", k: ["sponge", "blender"] },
  { n: "Facial Roller", b: "LumiSkin", c: "beauty-tools", p: 399, m: 599, r: 4.2, rv: 88, s: 44, d: "Natural jade roller to depuff and boost circulation.", k: ["roller", "jade", "massage"] },
  // GIFT SETS
  { n: "Everyday Beauty Gift Set", b: "GlowAura", c: "gift-sets", p: 999, m: 1599, r: 4.7, rv: 134, s: 16, d: "Serum, moisturiser, lip balm and mist in a keepsake box.", k: ["gift", "set", "combo"], best: true },
  { n: "Luxury Self-Care Gift Box", b: "GlowAura", c: "gift-sets", p: 1499, m: 2299, r: 4.8, rv: 78, s: 5, d: "Eight full-size favourites wrapped in silk ribbon.", k: ["gift", "luxury", "box"], fresh: true },
  { n: "Glow Duo Mini Kit", b: "LumiSkin", c: "gift-sets", p: 699, m: 999, r: 4.4, rv: 52, s: 29, d: "Travel-size Vitamin C serum and SPF 50 duo.", k: ["gift", "mini", "travel"], fresh: true },
];

export const products: Product[] = seeds.map((s, i) => ({
  id: `GA-${String(i + 1).padStart(3, "0")}`,
  slug: slugify(s.n),
  name: s.n,
  brand: s.b,
  category: s.c,
  price: s.p,
  mrp: s.m,
  rating: s.r,
  reviews: s.rv,
  stock: s.s,
  short: s.d,
  description: `${s.d} Formulated in India, dermatologically tested and free from parabens, mineral oil and animal testing. ${s.n} is part of the ${s.b} range curated by GlowAura Beauty for daily, real-life routines.`,
  benefits: [
    "Visible results within 4-6 weeks of regular use",
    "Lightweight, non-sticky and layers well under makeup",
    "Dermatologically tested and cruelty-free",
    "Suitable for Indian climate and humidity",
  ],
  ingredients:
    "Aqua, Glycerin, Butylene Glycol, Sodium Hyaluronate, Panthenol, Tocopheryl Acetate, Aloe Barbadensis Leaf Juice, Citric Acid, Phenoxyethanol.",
  howToUse:
    "Apply on clean, dry skin. Use 2-3 drops or a coin-sized amount, massage gently in upward strokes and follow with moisturiser and sunscreen in the day.",
  suitableFor: "All skin types, including sensitive skin. Suitable for ages 16+.",
  keywords: s.k,
  ...(s.best ? { bestSeller: true } : {}),
  ...(s.fresh ? { newArrival: true } : {}),
  image: productImages[slugify(s.n)] ?? categoryImage[s.c],
}));

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

export const discountPercent = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

export const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const categoryName = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export function searchProducts(query: string, list: Product[] = products) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((p) => {
    const haystack = [p.name, p.brand, categoryName(p.category), ...p.keywords, p.short]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  maxDiscount?: number;
  minOrder: number;
  label: string;
  expired?: boolean;
}

export const coupons: Coupon[] = [
  { code: "GLOW10", type: "percent", value: 10, maxDiscount: 200, minOrder: 499, label: "10% off on orders above ₹499" },
  { code: "BEAUTY20", type: "percent", value: 20, maxDiscount: 400, minOrder: 1499, label: "20% off on orders above ₹1,499" },
  { code: "WELCOME15", type: "percent", value: 15, maxDiscount: 300, minOrder: 999, label: "15% off on orders above ₹999" },
  { code: "FIRSTORDER", type: "flat", value: 100, minOrder: 599, label: "Flat ₹100 off on your first order" },
  { code: "SUMMER25", type: "percent", value: 25, minOrder: 499, label: "Expired seasonal offer", expired: true },
];

export const FREE_SHIPPING_THRESHOLD = 999;
export const DELIVERY_FEE = 40;
export const COD_FEE = 40;
