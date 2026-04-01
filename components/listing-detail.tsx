"use client";

import { useState } from "react";
import {
  X, Heart, Share2, Eye, Star, MapPin, Shield,
  MessageCircle, Phone, Crown, Zap, Calendar, Flag,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Listing, formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Language } from "@/app/page";

interface ListingDetailProps {
  listing: Listing;
  onClose: () => void;
  language?: Language;
}

const uiText: Record<string, Record<string, string>> = {
  description: { uk: "Опис", ru: "Описание" },
  seller: { uk: "Продавець", ru: "Продавец" },
  allAds: { uk: "Всі оголошення", ru: "Все объявления" },
  safetyTitle: { uk: "Порада безпеки:", ru: "Совет по безопасности:" },
  safetyText: {
    uk: "Не переводьте гроші наперед. Перевіряйте товар при отриманні. Використовуйте «Безпечну угоду» Amara.",
    ru: "Не переводите деньги заранее. Проверяйте товар при получении. Используйте «Безопасную сделку» Amara.",
  },
  report: { uk: "Поскаржитися на оголошення", ru: "Пожаловаться на объявление" },
  chat: { uk: "Написати в чат", ru: "Написать в чат" },
  showPhone: { uk: "Показати телефон", ru: "Показать телефон" },
  views: { uk: "переглядів", ru: "просмотров" },
  sellText: {
    uk: "Продаю у стані «{cond}». Всі деталі можна уточнити в чаті або по телефону. Можлива доставка Новою Поштою по всій Україні. Торг доречний.",
    ru: "Продаю в состоянии «{cond}». Все детали можно уточнить в чате или по телефону. Возможна доставка Новой Почтой по всей Украине. Торг уместен.",
  },
};

export function ListingDetail({ listing, onClose, language = "uk" }: ListingDetailProps) {
  const [liked, setLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const t = (key: string) => uiText[key]?.[language] ?? key;

  const conditionColor: Record<string, string> = {
    "Нове": "bg-emerald-100 text-emerald-700",
    "Відмінний": "bg-blue-100 text-blue-700",
    "Хороший": "bg-amber-100 text-amber-700",
    "Задовільний": "bg-red-100 text-red-700",
  };

  // Simulate multiple images using the single image
  const images = [listing.image, listing.image, listing.image];

  const descText = t("sellText")
    .replace("{cond}", listing.condition);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 bg-foreground/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal — full screen on mobile, constrained on desktop */}
      <div
        className="relative bg-card w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-3xl sm:max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Закрити"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLiked(!liked)}
              className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label={liked ? "Прибрати з обраного" : "До обраного"}
            >
              <Heart className={cn("w-4 h-4", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </button>
            <button
              className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="Поділитись"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Image carousel */}
          <div className="relative aspect-[16/9] bg-muted shrink-0">
            <img
              src={images[imgIdx]}
              alt={listing.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/640x360/e2e8f0/94a3b8?text=${encodeURIComponent(listing.category)}`;
              }}
            />

            {/* Prev/Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Попередня"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Наступна"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        i === imgIdx ? "bg-white w-3" : "bg-white/60"
                      )}
                      aria-label={`Фото ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {listing.isPremium && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              )}
              {listing.isFeatured && !listing.isPremium && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-[11px] font-bold rounded-full">
                  <Zap className="w-3 h-3" /> ТОП
                </span>
              )}
            </div>
            <div className="absolute top-3 right-3">
              <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full", conditionColor[listing.condition])}>
                {listing.condition}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              <Eye className="w-3 h-3" />
              <span>{listing.views}</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Price & title */}
            <div>
              <p className="text-3xl font-extrabold text-foreground">
                {formatPrice(listing.price)} <span className="text-xl">{listing.currency}</span>
              </p>
              <h2 className="text-lg font-semibold text-foreground mt-1 leading-snug">{listing.title}</h2>

              {/* Meta row — wraps on mobile */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {listing.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {listing.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  {listing.views} {t("views")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-secondary rounded-2xl">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("description")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{descText}</p>
            </div>

            {/* Seller card */}
            <div className="p-4 bg-secondary rounded-2xl">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t("seller")}</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-base shrink-0">
                  {listing.sellerInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">{listing.seller}</p>
                    <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < Math.floor(listing.sellerRating) ? "fill-amber-400 text-amber-400" : "text-muted")} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{listing.sellerRating.toFixed(1)}</span>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline shrink-0">
                  {t("allAds")}
                </button>
              </div>
            </div>

            {/* Safety tip */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl">
              <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{t("safetyTitle")}</span>{" "}
                {t("safetyText")}
              </p>
            </div>

            {/* Report */}
            <div className="flex justify-center pb-2">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <Flag className="w-3 h-3" />
                {t("report")}
              </button>
            </div>
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 px-4 py-4 border-t border-border bg-card">
          <Button className="flex-1 rounded-full bg-primary text-primary-foreground font-semibold gap-2 h-11">
            <MessageCircle className="w-4 h-4" />
            {t("chat")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full font-semibold gap-2 h-11"
            onClick={() => setShowPhone(true)}
          >
            <Phone className="w-4 h-4" />
            {showPhone ? "+38 (099) 123-45-67" : t("showPhone")}
          </Button>
        </div>
      </div>
    </div>
  );
}
