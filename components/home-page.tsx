"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, TrendingUp, Shield, Zap, ArrowRight, MapPin,
  Instagram, Facebook, Youtube, Mail, X, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { listings, categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface HomePageProps {
  onNavigate: (page: Page, sub?: string) => void;
  initialCategory?: string | null;
  language: Language;
  paginationMode?: "auto" | "manual";
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
  footerSupport: { uk: "Написати в підтримку", ru: "Написать в поддержку" },
  supportTitle: { uk: "Підтримка", ru: "Поддержка" },
  supportTg: { uk: "Підтримка Telegram:", ru: "Поддержка Telegram:" },
  supportEmail: { uk: "Електронна пошта:", ru: "Электронная почта:" },
  footerCopy: {
    uk: "2026 © Amara Market — маркетплейс товарів, послуг та цифрових активів. Усі права захищені.",
    ru: "2026 © Amara Market — маркетплейс товаров, услуг и цифровых активов. Все права защищены.",
  },
};

export function HomePage({ onNavigate, initialCategory, language, paginationMode = "auto" }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [showAll, setShowAll] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
    setPage(1);
  }, [initialCategory]);

  // Reset pagination when category changes
  useEffect(() => { setPage(1); }, [activeCategory]);

  // Infinite scroll observer (auto mode)
  useEffect(() => {
    if (paginationMode !== "auto") return;
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPage((p) => p + 1); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [paginationMode]);

  useEffect(() => {
    if (!supportOpen) return;
    const handler = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [supportOpen]);

  const t = (key: string) => uiText[key]?.[language] ?? key;

  const filteredListings =
    activeCategory === "all"
      ? listings
      : listings.filter((l) =>
          l.category.toLowerCase().includes(activeCategory.replace(/-/g, " "))
        );

  const pagedListings = filteredListings.slice(0, page * PAGE_SIZE);
  const hasMore = pagedListings.length < filteredListings.length;

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
                className="border-white text-white hover:bg-white/20 rounded-full px-5 bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.8)" }}
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

          {/* "All" quick pill */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {language === "uk" ? "Усі" : "Все"}
            </button>
          </div>

          {/* Household zone */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-[11px]">🏠</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {language === "uk" ? "Побутова зона" : "Бытовая зона"}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className={`grid gap-2 ${showAll ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8" : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8"}`}>
              {(showAll
                ? categories.filter((c) => c.zone === "household")
                : categories.filter((c) => c.zone === "household")
              ).map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <a
                    key={cat.id}
                    href={cat.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(cat.id === activeCategory ? "all" : cat.id);
                    }}
                    className={`group flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center cursor-pointer select-none ${
                      isActive
                        ? "bg-primary border-primary shadow-md scale-[0.97]"
                        : "bg-card border-border hover:border-primary/40 hover:bg-secondary hover:scale-[0.98]"
                    }`}
                  >
                    <span className="text-xl leading-none" aria-hidden>{cat.icon}</span>
                    <span className={`text-[11px] font-semibold leading-tight line-clamp-2 ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                      {cat.label}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {cat.count >= 1000 ? `${Math.floor(cat.count / 1000)}K` : cat.count}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Digital zone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-[11px]">💻</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {language === "uk" ? "Цифрова зона" : "Цифровая зона"}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {(showAll
                ? categories.filter((c) => c.zone === "digital")
                : categories.filter((c) => c.zone === "digital")
              ).map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <a
                    key={cat.id}
                    href={cat.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(cat.id === activeCategory ? "all" : cat.id);
                    }}
                    className={`group flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center cursor-pointer select-none ${
                      isActive
                        ? "bg-primary border-primary shadow-md scale-[0.97]"
                        : "bg-card border-border hover:border-primary/40 hover:bg-secondary hover:scale-[0.98]"
                    }`}
                  >
                    <span className="text-xl leading-none" aria-hidden>{cat.icon}</span>
                    <span className={`text-[11px] font-semibold leading-tight line-clamp-2 ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                      {cat.label}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {cat.count >= 1000 ? `${Math.floor(cat.count / 1000)}K` : cat.count}
                    </span>
                  </a>
                );
              })}
            </div>
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
                  onClick={() => onNavigate("listing", listing.id)}
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
            {pagedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                language={language}
                onClick={() => onNavigate("listing", listing.id)}
              />
            ))}
          </div>

          {/* Pagination / infinite scroll trigger */}
          {paginationMode === "auto" ? (
            <div ref={loadMoreRef} className="flex justify-center mt-8 h-10">
              {hasMore && (
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Завантаження" />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-9 h-9 rounded-full border text-sm font-semibold transition-colors",
                    page === p
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 h-9 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {language === "uk" ? "Більше" : "Больше"}
                  <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-5">

          {/* Row 1: copyright + policy links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left leading-relaxed">
              {t("footerCopy")}
            </p>
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

          {/* Row 2: social + support */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social */}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="text-sm text-muted-foreground font-medium">{t("footerSocial")}</span>
              <a
                href="https://t.me/amara_market"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#229ED9] hover:bg-[#1a8bbf] flex items-center justify-center text-white transition-colors shadow-sm"
                aria-label="Telegram Amara Market"
              >
                {/* Official Telegram paper-plane SVG */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Support button with popover */}
            <div className="relative" ref={supportRef}>
              <button
                onClick={() => setSupportOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/40 text-sm font-medium text-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                {t("footerSupport")}
              </button>

              {supportOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-72 bg-card border border-border rounded-2xl shadow-xl p-5 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-base">{t("supportTitle")}</h3>
                    <button
                      onClick={() => setSupportOpen(false)}
                      className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Закрити"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Telegram support */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        {t("supportTg")}
                      </p>
                      <a
                        href="https://t.me/Amara_market_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-[#1a8bbf] transition-colors">@Amara_market_bot</p>
                          <p className="text-xs text-muted-foreground">Telegram Bot</p>
                        </div>
                      </a>
                    </div>

                    {/* Email support */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        {t("supportEmail")}
                      </p>
                      <a
                        href="mailto:tp@amara.markets?subject=Звернення до підтримки Amara Market&body=Доброго дня!%0A%0AОпишіть вашу проблему:%0A"
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-primary/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">tp@amara.markets</p>
                          <p className="text-xs text-muted-foreground">Email</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
