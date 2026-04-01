"use client";

import { useState } from "react";
import { Heart, MapPin, Eye, Star, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Listing, formatPrice } from "@/lib/data";

interface ListingCardProps {
  listing: Listing;
  language?: "uk" | "ru";
  onClick?: () => void;
}

// Short static description per category (shown truncated on card)
const categoryDesc: Record<string, { uk: string; ru: string }> = {
  "Електроніка": {
    uk: "Оригінальний товар, перевірений, є всі документи. Торг доречний, доставка по Україні.",
    ru: "Оригинальный товар, проверен, все документы в наличии. Торг уместен, доставка по Украине.",
  },
  "Авто": {
    uk: "Авто в чудовому стані, без ДТП, один власник. Можливий огляд на СТО.",
    ru: "Авто в отличном состоянии, без ДТП, один владелец. Возможен осмотр на СТО.",
  },
  "Дім і сад": {
    uk: "Стан хороший, без пошкоджень. Самовивіз або Нова Пошта по всій Україні.",
    ru: "Состояние хорошее, без повреждений. Самовывоз или Новая Почта по всей Украине.",
  },
  "Нерухомість": {
    uk: "Зручне розташування, поряд інфраструктура. Деталі уточнюйте в чаті.",
    ru: "Удобное расположение, рядом инфраструктура. Подробности уточняйте в чате.",
  },
  "Мода і стиль": {
    uk: "Новий товар в упаковці. Є всі розміри. Швидка відправка.",
    ru: "Новый товар в упаковке. Все размеры в наличии. Быстрая отправка.",
  },
};

const defaultDesc = {
  uk: "Відмінний стан, без прихованих дефектів. Готовий до угоди, доставка по всій Україні.",
  ru: "Отличное состояние, без скрытых дефектов. Готов к сделке, доставка по всей Украине.",
};

const conditionColor: Record<string, string> = {
  "Нове": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "Відмінний": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "Хороший": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "Задовільний": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export function ListingCard({ listing, language = "uk", onClick }: ListingCardProps) {
  const [liked, setLiked] = useState(false);

  const desc = (categoryDesc[listing.category] ?? defaultDesc)[language];

  return (
    <article
      onClick={onClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* 1. Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/400x300/e2e8f0/94a3b8?text=${encodeURIComponent(listing.category)}`;
          }}
        />

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.isPremium && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full shadow-sm">
              <Crown className="w-2.5 h-2.5" aria-hidden />
              Premium
            </span>
          )}
          {listing.isFeatured && !listing.isPremium && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-sm">
              <Zap className="w-2.5 h-2.5" aria-hidden />
              ТОП
            </span>
          )}
        </div>

        {/* Condition — top right */}
        <div className="absolute top-2 right-2">
          <span className={cn("px-1.5 py-0.5 text-[10px] font-semibold rounded-full", conditionColor[listing.condition])}>
            {listing.condition}
          </span>
        </div>

        {/* Favorite — bottom right */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label={liked ? "Прибрати з обраного" : "Додати в обране"}
        >
          <Heart
            className={cn("w-3 h-3 transition-colors", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")}
          />
        </button>
      </div>

      {/* 2. Content */}
      <div className="p-2.5 flex flex-col gap-1.5">
        {/* Price */}
        <p className="text-base font-extrabold text-foreground leading-none">
          {formatPrice(listing.price)}{" "}
          <span className="text-sm font-bold">{listing.currency}</span>
        </p>

        {/* Title — bold, 2 lines max */}
        <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">
          {listing.title}
        </p>

        {/* Short description — 2 lines, truncated with ellipsis */}
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {desc}
        </p>

        {/* City + time */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0" aria-hidden />
            {listing.city}
          </span>
          <span>{listing.timeAgo}</span>
        </div>

        <hr className="border-border" />

        {/* Seller row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold shrink-0"
              aria-hidden
            >
              {listing.sellerInitial}
            </div>
            <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">
              {listing.seller}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden />
            <span className="text-[11px] font-semibold text-foreground">
              {listing.sellerRating.toFixed(1)}
            </span>
            {listing.views !== undefined && (
              <>
                <span className="text-muted-foreground/50 mx-0.5">·</span>
                <Eye className="w-2.5 h-2.5 text-muted-foreground" aria-hidden />
                <span className="text-[10px] text-muted-foreground">{listing.views}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
