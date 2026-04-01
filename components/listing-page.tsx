"use client";

import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, MessageCircle, Shield,
  MapPin, Clock, Eye, Star, Phone, Flag, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface ListingPageProps {
  onNavigate: (page: Page, sub?: string) => void;
  language: Language;
  listingId: string | null;
}

const uiText: Record<string, Record<Language, string>> = {
  back:        { uk: "Назад",                  ru: "Назад" },
  condition:   { uk: "Стан:",                  ru: "Состояние:" },
  city:        { uk: "Місто:",                 ru: "Город:" },
  posted:      { uk: "Опубліковано:",          ru: "Опубликовано:" },
  views:       { uk: "переглядів",             ru: "просмотров" },
  favorites:   { uk: "в обраному",             ru: "в избранном" },
  contact:     { uk: "Написати продавцю",      ru: "Написать продавцу" },
  call:        { uk: "Зателефонувати",         ru: "Позвонить" },
  addFav:      { uk: "В обране",               ru: "В избранное" },
  share:       { uk: "Поділитись",             ru: "Поделиться" },
  report:      { uk: "Поскаржитись",           ru: "Пожаловаться" },
  safeNote:    { uk: "Безпечна угода Amara — захист покупця гарантовано", ru: "Безопасная сделка Amara — защита покупателя гарантирована" },
  seller:      { uk: "Продавець",              ru: "Продавец" },
  sellerRating:{ uk: "рейтинг",               ru: "рейтинг" },
  allListings: { uk: "Всі оголошення",         ru: "Все объявления" },
  recommend:   { uk: "Схожі оголошення",       ru: "Похожие объявления" },
  notFound:    { uk: "Оголошення не знайдено", ru: "Объявление не найдено" },
  description: { uk: "Опис",                   ru: "Описание" },
};

export function ListingPage({ onNavigate, language, listingId }: ListingPageProps) {
  const t = (key: string) => uiText[key]?.[language] ?? key;

  const listing = listings.find((l) => l.id === listingId) ?? listings[0];
  const [faved, setFaved] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  // Mock extra photos from same domain image
  const photos = [
    listing.image,
    listing.image.replace("w=400", "w=401"),
    listing.image.replace("w=400", "w=402"),
  ];

  // Recommendations: same category, different listing
  const recommendations = listings
    .filter((l) => l.id !== listing.id && l.category === listing.category)
    .slice(0, 3)
    .concat(listings.filter((l) => l.id !== listing.id && l.category !== listing.category).slice(0, Math.max(0, 3 - listings.filter((l) => l.id !== listing.id && l.category === listing.category).length)));

  if (!listing) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-semibold text-foreground">{t("notFound")}</p>
        <Button className="mt-4 rounded-full" onClick={() => onNavigate("home")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> {t("back")}
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-muted-foreground">{listing.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{listing.title}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Main grid: photo left, info right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Photos ── */}
          <div className="lg:col-span-3 space-y-3">
            {/* Main photo */}
            <div className="relative rounded-3xl overflow-hidden bg-secondary aspect-[4/3]">
              <img
                src={photos[activePhoto]}
                alt={listing.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              {listing.isPremium && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                  Premium
                </span>
              )}
              {listing.isFeatured && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow">
                  {language === "uk" ? "ТОП" : "ТОП"}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {photos.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                    activePhoto === idx ? "border-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <img src={src} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title + price */}
            <div>
              <h1 className="text-2xl font-extrabold text-foreground leading-tight text-balance">
                {listing.title}
              </h1>
              <p className="text-3xl font-extrabold text-primary mt-2">
                {listing.price.toLocaleString()} {listing.currency}
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary" />
                {listing.city}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                <Clock className="w-3 h-3 text-primary" />
                {listing.timeAgo}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                {listing.condition}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground">
                <Eye className="w-3 h-3" />
                {(listing.views ?? 0).toLocaleString()} {t("views")}
              </span>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("description")}</p>
              <p className="text-sm text-foreground leading-relaxed">
                {language === "uk"
                  ? `Продам ${listing.title} у стані "${listing.condition}". Місто ${listing.city}. Всі запитання в особисті повідомлення. Ціна: ${listing.price.toLocaleString()} ${listing.currency}.`
                  : `Продам ${listing.title} в состоянии "${listing.condition}". Город ${listing.city}. Все вопросы в личные сообщения. Цена: ${listing.price.toLocaleString()} ${listing.currency}.`}
              </p>
            </div>

            {/* Safe deal notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{t("safeNote")}</p>
            </div>

            {/* Seller card */}
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-primary">{listing.sellerInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{listing.seller}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-foreground">{listing.sellerRating}</span>
                  <span className="text-xs text-muted-foreground ml-1">{t("sellerRating")}</span>
                </div>
              </div>
              <button className="text-xs text-primary font-medium hover:underline shrink-0">{t("allListings")}</button>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <Button className="w-full h-12 rounded-2xl font-bold gap-2 text-base">
                <MessageCircle className="w-5 h-5" />
                {t("contact")}
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-2xl font-semibold gap-2">
                <Phone className="w-4 h-4" />
                {t("call")}
              </Button>
            </div>

            {/* Secondary actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setFaved(!faved)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border text-sm font-medium transition-all",
                  faved ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400" : "bg-card border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                <Heart className={cn("w-4 h-4", faved && "fill-current")} />
                {t("addFav")}
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/40 transition-colors">
                <Share2 className="w-4 h-4" />
                {t("share")}
              </button>
              <button className="flex items-center justify-center py-2.5 px-3 rounded-2xl border border-border bg-card text-muted-foreground hover:border-red-300 hover:text-red-500 transition-colors">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-14" aria-labelledby="recs-heading">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full" aria-hidden />
              <h2 id="recs-heading" className="text-xl font-bold text-foreground">{t("recommend")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {recommendations.map((rec) => (
                <ListingCard
                  key={rec.id}
                  listing={rec}
                  language={language}
                  onClick={() => onNavigate("listing", rec.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
