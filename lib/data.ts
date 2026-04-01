export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  condition: "Нове" | "Відмінний" | "Хороший" | "Задовільний";
  timeAgo: string;
  date: string;
  seller: string;
  sellerInitial: string;
  sellerRating: number;
  category: string;
  image: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  views?: number;
  favorites?: number;
}

export const listings: Listing[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 45990,
    currency: "₴",
    city: "Київ",
    condition: "Відмінний",
    timeAgo: "10 хв тому",
    date: "29 березня",
    seller: "Олексій К.",
    sellerInitial: "О",
    sellerRating: 4.9,
    category: "Електроніка",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    isFeatured: true,
    views: 342,
    favorites: 18,
  },
  {
    id: "2",
    title: "Диван кутовий IKEA EKTORP",
    price: 12500,
    currency: "₴",
    city: "Одеса",
    condition: "Хороший",
    timeAgo: "45 хв тому",
    date: "29 березня",
    seller: "Марія В.",
    sellerInitial: "М",
    sellerRating: 4.7,
    category: "Дім і сад",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    views: 127,
    favorites: 5,
  },
  {
    id: "3",
    title: "BMW 3 серія 2020, 2.0 AT",
    price: 1250000,
    currency: "₴",
    city: "Харків",
    condition: "Відмінний",
    timeAgo: "2 год тому",
    date: "28 березня",
    seller: "Дмитро П.",
    sellerInitial: "Д",
    sellerRating: 5.0,
    category: "Авто",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    isFeatured: true,
    views: 891,
    favorites: 44,
  },
  {
    id: "4",
    title: "PlayStation 5 Digital Edition",
    price: 18500,
    currency: "₴",
    city: "Львів",
    condition: "Нове",
    timeAgo: "30 хв тому",
    date: "29 березня",
    seller: "ТехноShop",
    sellerInitial: "Т",
    sellerRating: 4.8,
    category: "Електроніка",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&q=80",
    isPremium: true,
    views: 563,
    favorites: 31,
  },
  {
    id: "5",
    title: "Nike Air Max 90 (42)",
    price: 4200,
    currency: "₴",
    city: "Дніпро",
    condition: "Нове",
    timeAgo: "15 хв тому",
    date: "29 березня",
    seller: "Sneaker UA",
    sellerInitial: "S",
    sellerRating: 4.6,
    category: "Мода і стиль",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    views: 234,
    favorites: 12,
  },
  {
    id: "6",
    title: "MacBook Air M2 256GB",
    price: 42000,
    currency: "₴",
    city: "Київ",
    condition: "Відмінний",
    timeAgo: "5 хв тому",
    date: "29 березня",
    seller: "Apple Store UA",
    sellerInitial: "A",
    sellerRating: 4.9,
    category: "Електроніка",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    isPremium: true,
    views: 1205,
    favorites: 67,
  },
  {
    id: "7",
    title: "Квартира 2-кімн, 65м²",
    price: 2800000,
    currency: "₴",
    city: "Київ",
    condition: "Відмінний",
    timeAgo: "1 год тому",
    date: "27 березня",
    seller: "РіелторПро",
    sellerInitial: "Р",
    sellerRating: 4.5,
    category: "Нерухомість",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
    isFeatured: true,
    views: 445,
    favorites: 22,
  },
  {
    id: "8",
    title: "Велосипед Giant Talon 29",
    price: 22000,
    currency: "₴",
    city: "Вінниця",
    condition: "Відмінний",
    timeAgo: "1 год тому",
    date: "26 березня",
    seller: "ВелоМаг",
    sellerInitial: "В",
    sellerRating: 4.8,
    category: "Хобі",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80",
    views: 178,
    favorites: 9,
  },
  {
    id: "9",
    title: "Samsung Galaxy S24 Ultra",
    price: 52000,
    currency: "₴",
    city: "Запоріжжя",
    condition: "Нове",
    timeAgo: "20 хв тому",
    date: "29 березня",
    seller: "Мобільний Світ",
    sellerInitial: "М",
    sellerRating: 4.7,
    category: "Електроніка",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    views: 388,
    favorites: 19,
  },
];

export const categories = [
  // --- Побутова зона ---
  { id: "moda-i-stil",         label: "Мода і стиль",      icon: "👗", count: 7650,  zone: "household", slug: "/category/moda-i-stil" },
  { id: "elektronika",         label: "Електроніка",        icon: "📱", count: 18920, zone: "household", slug: "/category/elektronika" },
  { id: "transport",           label: "Транспорт",          icon: "🚗", count: 9870,  zone: "household", slug: "/category/transport" },
  { id: "nerukhomist",         label: "Нерухомість",        icon: "🏠", count: 12430, zone: "household", slug: "/category/nerukhomist" },
  { id: "dim-i-sad",           label: "Дім і сад",          icon: "🌿", count: 5670,  zone: "household", slug: "/category/dim-i-sad" },
  { id: "robota",              label: "Робота",             icon: "💼", count: 3210,  zone: "household", slug: "/category/robota" },
  { id: "posluhy",             label: "Послуги",            icon: "🛠️", count: 4320,  zone: "household", slug: "/category/posluhy" },
  { id: "khobi-i-vidpochynok", label: "Хобі і відпочинок", icon: "⚽", count: 3421,  zone: "household", slug: "/category/khobi-i-vidpochynok" },
  // --- Цифрова зона ---
  { id: "ihrovi-akaunty",      label: "Ігрові акаунти",     icon: "🎮", count: 4120,  zone: "digital",   slug: "/category/ihrovi-akaunty" },
  { id: "klyuchi-ta-po",       label: "Ключі та ПО",        icon: "🔑", count: 2891,  zone: "digital",   slug: "/category/klyuchi-ta-po" },
  { id: "haydy-ta-kursy",      label: "Гайди і Курси",      icon: "📚", count: 1540,  zone: "digital",   slug: "/category/haydy-ta-kursy" },
  { id: "rozrobka-botiv",      label: "Розробка ботів",     icon: "🤖", count: 890,   zone: "digital",   slug: "/category/rozrobka-botiv" },
  { id: "dyzayn",              label: "Дизайн",             icon: "🎨", count: 1230,  zone: "digital",   slug: "/category/dyzayn" },
  { id: "prohramuvannya",      label: "Програмування",      icon: "💻", count: 1680,  zone: "digital",   slug: "/category/prohramuvannya" },
];

export function formatPrice(price: number): string {
  // Use a locale-neutral formatter to avoid SSR hydration mismatches
  return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}
