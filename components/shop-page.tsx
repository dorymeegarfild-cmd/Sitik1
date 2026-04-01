"use client";

import { useState } from "react";
import { ShoppingCart, Sparkles, Star, Tag, Layers, Type, Cpu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface ShopPageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

interface ShopItem {
  id: string;
  name: string;
  nameRu: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: string;
  preview: string;
  stars: number;
  reviews: number;
}

const shopItems: ShopItem[] = [
  {
    id: "s1",
    category: "skins",
    name: "Скін «Neon Pulse»",
    nameRu: "Скин «Neon Pulse»",
    price: 285,
    badge: "Хіт",
    badgeColor: "bg-rose-500",
    preview: "from-violet-500 via-fuchsia-500 to-pink-500",
    stars: 4.9,
    reviews: 214,
  },
  {
    id: "s2",
    category: "skins",
    name: "Скін «Золотий профіль»",
    nameRu: "Скин «Золотой профиль»",
    price: 285,
    originalPrice: 380,
    preview: "from-yellow-400 via-amber-500 to-orange-500",
    stars: 4.7,
    reviews: 98,
  },
  {
    id: "s3",
    category: "skins",
    name: "Скін «Кіберпанк»",
    nameRu: "Скин «Киберпанк»",
    price: 285,
    badge: "Новинка",
    badgeColor: "bg-cyan-500",
    preview: "from-cyan-500 via-blue-600 to-indigo-700",
    stars: 5.0,
    reviews: 41,
  },
  {
    id: "b1",
    category: "borders",
    name: "Обводка «Мінімал»",
    nameRu: "Обводка «Минимал»",
    price: 60,
    preview: "from-slate-400 to-slate-600",
    stars: 4.5,
    reviews: 320,
  },
  {
    id: "b2",
    category: "borders",
    name: "Обводка «Вогонь»",
    nameRu: "Обводка «Огонь»",
    price: 60,
    badge: "Хіт",
    badgeColor: "bg-orange-500",
    preview: "from-orange-400 via-red-500 to-rose-600",
    stars: 4.8,
    reviews: 187,
  },
  {
    id: "b3",
    category: "borders",
    name: "Обводка «Льодяна»",
    nameRu: "Обводка «Ледяная»",
    price: 60,
    preview: "from-sky-300 via-blue-400 to-indigo-500",
    stars: 4.6,
    reviews: 94,
  },
  {
    id: "f1",
    category: "fonts",
    name: "Шрифт «Urban Bold»",
    nameRu: "Шрифт «Urban Bold»",
    price: 5,
    preview: "from-zinc-700 to-zinc-900",
    stars: 4.4,
    reviews: 502,
  },
  {
    id: "f2",
    category: "fonts",
    name: "Шрифт «Italic Glow»",
    nameRu: "Шрифт «Italic Glow»",
    price: 5,
    badge: "Бюджет",
    badgeColor: "bg-green-500",
    preview: "from-emerald-500 to-teal-600",
    stars: 4.3,
    reviews: 671,
  },
  {
    id: "f3",
    category: "fonts",
    name: "Шрифт «Retro Wave»",
    nameRu: "Шрифт «Retro Wave»",
    price: 5,
    preview: "from-pink-500 to-fuchsia-600",
    stars: 4.5,
    reviews: 239,
  },
  {
    id: "ai1",
    category: "ai",
    name: "AI-персонаж «Sensei»",
    nameRu: "AI-персонаж «Сенсей»",
    price: 1500,
    badge: "Преміум",
    badgeColor: "bg-primary",
    preview: "from-blue-600 via-indigo-600 to-violet-700",
    stars: 5.0,
    reviews: 28,
  },
  {
    id: "ai2",
    category: "ai",
    name: "AI-персонаж «Ranger»",
    nameRu: "AI-персонаж «Рейнджер»",
    price: 1500,
    preview: "from-green-500 via-emerald-600 to-teal-700",
    stars: 4.9,
    reviews: 19,
  },
];

const categoryTabs = [
  { id: "all",     labelUk: "Всі",           labelRu: "Все",              icon: Layers },
  { id: "skins",   labelUk: "Скіни",         labelRu: "Скины",            icon: Sparkles },
  { id: "borders", labelUk: "Обводки",       labelRu: "Обводки",          icon: Star },
  { id: "fonts",   labelUk: "Шрифти",        labelRu: "Шрифты",           icon: Type },
  { id: "ai",      labelUk: "AI-персонажі",  labelRu: "AI-персонажи",     icon: Cpu },
];

export function ShopPage({ onNavigate, language }: ShopPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  const filtered =
    activeCategory === "all"
      ? shopItems
      : shopItems.filter((i) => i.category === activeCategory);

  const addToCart = () => setCartCount((c) => c + 1);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-700 py-10 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Amara Market
              </button>
              <span className="text-white/40 text-sm">/</span>
              <span className="text-white text-sm font-semibold">SHOP</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight text-balance">
              Amara <span className="text-yellow-300">SHOP</span>
            </h1>
            <p className="text-white/70 mt-1 text-sm max-w-md">
              {language === "uk"
                ? "Скіни, обводки, шрифти та AI-персонажі для виділення серед тисяч."
                : "Скины, обводки, шрифты и AI-персонажи для выделения среди тысяч."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-white text-sm">
              <Tag className="w-4 h-4 text-yellow-300" />
              <span className="font-medium">
                {language === "uk" ? "Шрифти від 5 ₴" : "Шрифты от 5 ₴"}
              </span>
            </div>
            <button
              className="relative flex items-center gap-2 bg-white text-primary font-semibold rounded-full px-4 py-2 text-sm hover:bg-white/90 transition-colors shadow"
              aria-label={language === "uk" ? "Кошик" : "Корзина"}
            >
              <ShoppingCart className="w-4 h-4" />
              {language === "uk" ? "Кошик" : "Корзина"}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categoryTabs.map((cat) => {
            const label = language === "uk" ? cat.labelUk : cat.labelRu;
            const count =
              cat.id === "all"
                ? shopItems.length
                : shopItems.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {label}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    activeCategory === cat.id ? "bg-white/20" : "bg-secondary"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all"
            >
              {/* Preview */}
              <div
                className={cn(
                  "relative h-36 bg-gradient-to-br flex items-center justify-center",
                  item.preview
                )}
              >
                {item.badge && (
                  <span
                    className={cn(
                      "absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full",
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {item.category === "skins" && (
                  <div className="w-16 h-16 rounded-full border-4 border-white/40 bg-white/20 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    A
                  </div>
                )}
                {item.category === "borders" && (
                  <div className="w-14 h-14 rounded-full border-[5px] border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-white/10" />
                )}
                {item.category === "fonts" && (
                  <span
                    className="text-white font-bold text-3xl drop-shadow-lg tracking-wide"
                    style={{ fontStyle: item.id === "f2" ? "italic" : "normal" }}
                  >
                    Aa
                  </span>
                )}
                {item.category === "ai" && (
                  <div className="flex flex-col items-center gap-1 text-white">
                    <Cpu className="w-8 h-8 drop-shadow-lg" />
                    <span className="text-[10px] font-semibold opacity-80">AI</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 mb-1">
                  {language === "uk" ? item.name : item.nameRu}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-semibold text-foreground">
                    {item.stars.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-primary">{item.price} ₴</span>
                    {item.originalPrice && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        {item.originalPrice} ₴
                      </span>
                    )}
                  </div>
                  <button
                    onClick={addToCart}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
                    aria-label={language === "uk" ? "Додати до кошика" : "Добавить в корзину"}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-violet-500/10 border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-foreground mb-1">
              {language === "uk" ? "Отримай скіни безкоштовно!" : "Получи скины бесплатно!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "uk"
                ? "Підпишись на Elite або Amara ГУР — отримай бонусний набір скінів у подарунок."
                : "Подпишись на Elite или Amara ГУР — получи бонусный набор скинов в подарок."}
            </p>
          </div>
          <Button
            className="rounded-full bg-primary text-primary-foreground px-6 shrink-0"
            onClick={() => onNavigate("profile")}
          >
            {language === "uk" ? "Переглянути Premium" : "Посмотреть Premium"}
          </Button>
        </div>
      </div>
    </main>
  );
}
