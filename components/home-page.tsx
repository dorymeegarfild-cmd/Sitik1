"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight, TrendingUp, Shield, Zap, ArrowRight, MapPin,
  Instagram, Facebook, Youtube, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { ListingDetail } from "@/components/listing-detail";
import { listings, categories } from "@/lib/data";
import { type Listing } from "@/lib/data";
import type { Page, Language } from "@/app/page";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  initialCategory?: string | null;
  language: Language;
}

const uiText: Record<string, Record<Language, string>> = {
  postAd: { uk: "Подати оголошення", ru: "Подать объявление" },
  viewAll: { uk: "Переглянути всі", ru: "Посмотреть все" },
  categories: { uk: "Категорії", ru: "Категории" },
  collapse: { uk: "Згорнути", ru: "Свернуть" },
  expand: { uk: "Переглянути все", ru: "Показать все" },
  topAds: { uk: "ТОП оголошення", ru: "ТОП объявления" },
  nearby: { uk: "Поруч з вами", ru: "Рядом с вами" },
  results: { uk: "Результати:", ru: "Результаты:" },
  ads: { uk: "оголошень", ru: "объявлений" },
  loadMore: { uk: "Завантажити більше", ru: "Загрузить больше" },
  safe: { uk: "Безпечна угода", ru: "Безопасная сделка" },
  fast: { uk: "Швидке розміщення", ru: "Быстрое размещение" },
  realPrices: { uk: "Реальні ціни", ru: "Реальные цены" },
  stats: { uk: "128 000+ оголошень", ru: "128 000+ объявлений" },
  slogan: { uk: "Купуй і продавай поруч з тобою", ru: "Покупай и продавай рядом с тобой" },
  subSlogan: { uk: "Реальні товари, живі люди. Без посередників.", ru: "Реальные товары, живые люди. Без посредников." },
  footerRules: { uk: "Правила", ru: "Правила" },
  footerPrivacy: { uk: "Політика конфіденційності", ru: "Политика конфиденциальности" },
  footerSocial: { uk: "Ми в соцмережах:", ru: "Мы в соцсетях:" },
  footerCopy: {
    uk: "2026 © Amara Market — маркетплейс товарів, послуг та цифрових активів. Усі права захищені.",
    ru: "2026 © Amara Market — маркетплейс товаров, услуг и цифровых активов. Все права защищены.",
  },
};

export function HomePage({ onNavigate, initialCategory, language }: HomePageProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  const visibleCategories = showAll ? categories : categories.slice(0, 8);

  const filteredListings =
    activeCategory === "all"
      ? listings
      : listings.filter((l) =>
          l.category.toLowerCase().includes(activeCategory.replace(/-/g, " "))
        );

  const t = (key: string) => uiText[key]?.[language] ?? key;

  return (
    <main className="min-h-screen">
      {/* Hero — compact */}
      <section className="relative overflow-hidden bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-screen-xl mx-auto px-4 py-5 md:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: text */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <MapPin className="w-3 h-3" aria-hidden />
                <span>{language === "uk" ? "Україна" : "Украина"}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>128K+ {language === "uk" ? "оголошень" : "объявлений"}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight text-balance">
                {t("slogan")}
              </h1>
              <p className="text-white/75 text-sm max-w-sm hidden sm:block">
                {t("subSlogan")}
              </p>
            </div>

            {/* Right: actions + mini stats */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden md:flex items-center gap-5 text-white/90 text-sm mr-2">
                <span><strong>45K+</strong> {language === "uk" ? "продавців" : "продавцов"}</span>
                <span><strong>9.8</strong> {language === "uk" ? "рейтинг" : "рейтинг"}</span>
              </div>
              <Button
                size="sm"
                className="bg-white text-primary font-semibold hover:bg-white/90 rounded-full px-5 shadow"
              >
                {t("postAd")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 rounded-full px-5"
              >
                {t("viewAll")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: Shield, key: "safe" },
            { icon: Zap, key: "fast" },
            { icon: TrendingUp, key: "realPrices" },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-primary" aria-hidden />
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="categories-heading" className="text-xl font-bold text-foreground">
              {t("categories")}
            </h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              {showAll ? t("collapse") : t("expand")}
              <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(cat.id === activeCategory ? "all" : cat.id)
                }
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center ${
                  activeCategory === cat.id
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-card border-border hover:border-primary/40 hover:bg-secondary text-foreground"
                }`}
              >
                <span className="text-2xl" aria-hidden>{cat.icon}</span>
                <span className="text-[11px] font-medium leading-tight line-clamp-2">
                  {cat.label}
                </span>
                <span
                  className={`text-[10px] ${
                    activeCategory === cat.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {cat.count >= 1000
                    ? `${Math.floor(cat.count / 1000)}K+`
                    : String(cat.count)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* TOP listings */}
        <section aria-labelledby="top-heading">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" aria-hidden />
            <h2 id="top-heading" className="text-xl font-bold text-foreground">
              {t("topAds")}
            </h2>
          </div>

          {/* 2 cols on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {listings
              .filter((l) => l.isFeatured || l.isPremium)
              .slice(0, 3)
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  language={language}
                  onClick={() => setSelectedListing(listing)}
                />
              ))}
          </div>
        </section>

        {/* All listings feed */}
        <section aria-labelledby="feed-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="feed-heading" className="text-xl font-bold text-foreground">
              {activeCategory === "all"
                ? t("nearby")
                : `${t("results")} ${
                    categories.find((c) => c.id === activeCategory)?.label ?? ""
                  }`}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredListings.length} {t("ads")}
            </span>
          </div>

          {/* 2 cols on mobile, 3 on lg */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                language={language}
                onClick={() => setSelectedListing(listing)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {t("loadMore")}
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left leading-relaxed">
              {t("footerCopy")}
            </p>

            {/* Links */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap justify-center">
              <a href="#rules" className="hover:text-primary transition-colors">
                {t("footerRules")}
              </a>
              <span className="text-border">|</span>
              <a href="#privacy" className="hover:text-primary transition-colors">
                {t("footerPrivacy")}
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4 mt-5 justify-center md:justify-start">
            <span className="text-sm text-muted-foreground">{t("footerSocial")}</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetail
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          language={language}
        />
      )}
    </main>
  );
}
