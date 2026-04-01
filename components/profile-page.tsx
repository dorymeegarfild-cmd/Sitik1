"use client";

import { useState } from "react";
import {
  Star, Camera, Bell, Store, BarChart3, Crown,
  Package, ShoppingCart, TrendingUp, Box, CheckCircle,
  Clock, Eye, Heart, MessageCircle, Plus, ArrowUpRight,
  Shield, MapPin, Calendar, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";
import { ListingDetail } from "@/components/listing-detail";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";
import type { Listing } from "@/lib/data";

type ProfileTab = "listings" | "purchases" | "sales" | "shops";
type ListingStatus = "active" | "completed";

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const user = {
  name: "dansbravl",
  initial: "D",
  rating: 4.8,
  reviewCount: 12,
  joinDate: "березень 2026",
  isOnline: true,
  isPremium: false,
  bio: "Продаю якісні речі за чесними цінами. Завжди на зв'язку.",
  city: "Київ",
  verified: true,
  stats: {
    activeListings: 7,
    totalSales: 23,
    totalViews: 8942,
    totalFavorites: 341,
  },
};

const uiText: Record<string, Record<Language, string>> = {
  editProfile: { uk: "Редагувати профіль", ru: "Редактировать профиль" },
  notifications: { uk: "Сповіщення", ru: "Уведомления" },
  createStore: { uk: "Створити магазин", ru: "Создать магазин" },
  analytics: { uk: "Аналітика", ru: "Аналитика" },
  inventory: { uk: "Інвентар", ru: "Инвентарь" },
  myListings: { uk: "Мої товари", ru: "Мои товары" },
  purchases: { uk: "Покупки", ru: "Покупки" },
  sales: { uk: "Продажі", ru: "Продажи" },
  shops: { uk: "Магазини", ru: "Магазины" },
  active: { uk: "Активні", ru: "Активные" },
  completed: { uk: "Завершені", ru: "Завершённые" },
  items: { uk: "Товарів", ru: "Товаров" },
  salesStat: { uk: "Продажів", ru: "Продаж" },
  views: { uk: "Переглядів", ru: "Просмотров" },
  inFav: { uk: "В обраному", ru: "В избранном" },
  todayViews: { uk: "Переглядів сьогодні", ru: "Просмотров сегодня" },
  newChats: { uk: "Нових чатів", ru: "Новых чатов" },
  addListing: { uk: "Додати оголошення", ru: "Добавить объявление" },
  noPurchases: { uk: "Покупок ще немає", ru: "Покупок пока нет" },
  noPurchasesSub: { uk: "Ознайомтесь з оголошеннями і здійсніть першу покупку", ru: "Ознакомьтесь с объявлениями и совершите первую покупку" },
  browseListing: { uk: "Переглянути оголошення", ru: "Посмотреть объявления" },
  noShops: { uk: "У вас поки немає магазинів", ru: "У вас пока нет магазинов" },
  noShopsSub: { uk: "Створіть магазин і продавайте більше", ru: "Создайте магазин и продавайте больше" },
  settings: { uk: "Налаштування", ru: "Настройки" },
  online: { uk: "Онлайн", ru: "Онлайн" },
};

export function ProfilePage({ onNavigate, language }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("listings");
  const [activeStatus, setActiveStatus] = useState<ListingStatus>("active");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const t = (key: string) => uiText[key]?.[language] ?? key;

  const tabs: { id: ProfileTab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "listings", label: t("myListings"), icon: Package, count: user.stats.activeListings },
    { id: "purchases", label: t("purchases"), icon: ShoppingCart, count: 4 },
    { id: "sales", label: t("sales"), icon: TrendingUp, count: user.stats.totalSales },
    { id: "shops", label: t("shops"), icon: Store, count: 0 },
  ];

  const myListings = listings.slice(0, 4);

  return (
    <main className="w-full">
      {/* Full-width cover */}
      <div className="h-36 md:h-52 bg-gradient-to-r from-primary/30 via-primary/15 to-blue-100 dark:from-primary/40 dark:to-primary/10 relative w-full overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.546 0.245 262.9 / 0.6) 0%, transparent 55%), radial-gradient(circle at 80% 20%, oklch(0.78 0.165 75 / 0.4) 0%, transparent 45%)",
          }}
          aria-hidden
        />
        {/* Settings button */}
        <button
          onClick={() => onNavigate("settings")}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors shadow"
          aria-label={t("settings")}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        {/* Avatar + basic info — pull up over cover */}
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 -mt-10 md:-mt-14 mb-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center shadow-lg">
              <span className="text-3xl md:text-4xl font-bold text-primary">{user.initial}</span>
            </div>
            <button
              className="absolute bottom-1 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
              aria-label="Змінити фото"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{user.name}</h1>
                  {user.verified && (
                    <Shield className="w-4 h-4 text-primary shrink-0" aria-label="Верифікований" />
                  )}
                  {user.isPremium && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full">
                      <Crown className="w-2.5 h-2.5" aria-hidden />
                      Premium
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.floor(user.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted"
                      )}
                    />
                  ))}
                  <span className="text-sm font-semibold text-foreground ml-1">{user.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({user.reviewCount}{" "}
                    {language === "uk" ? "відгуків" : "отзывов"})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden />
                    {language === "uk" ? "На Amara з" : "На Amara с"} {user.joinDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden />
                    {user.city}
                  </span>
                  {user.isOnline && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                      {t("online")}
                    </span>
                  )}
                </div>

                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons — full row below info, wraps on mobile */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={() => onNavigate("settings")}>
                <Settings className="w-3.5 h-3.5" aria-hidden />
                {t("editProfile")}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <Bell className="w-3.5 h-3.5" aria-hidden />
                {t("notifications")}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <Store className="w-3.5 h-3.5" aria-hidden />
                {t("createStore")}
              </Button>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <BarChart3 className="w-3.5 h-3.5" aria-hidden />
                {t("analytics")}
              </Button>
              {!user.isPremium && (
                <Button
                  size="sm"
                  className="rounded-full gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0"
                >
                  <Crown className="w-3.5 h-3.5" aria-hidden />
                  {language === "uk" ? "Купити Premium" : "Купить Premium"}
                </Button>
              )}
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <Box className="w-3.5 h-3.5" aria-hidden />
                {t("inventory")}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: t("items"), value: user.stats.activeListings, icon: Package, color: "text-primary" },
            { label: t("salesStat"), value: user.stats.totalSales, icon: TrendingUp, color: "text-emerald-500" },
            { label: t("views"), value: user.stats.totalViews.toLocaleString(), icon: Eye, color: "text-blue-500" },
            { label: t("inFav"), value: user.stats.totalFavorites, icon: Heart, color: "text-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-secondary", color)}>
                <Icon className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <p className={cn("text-xl font-bold", color)}>{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini analytics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: t("todayViews"), value: "+127", icon: Eye, color: "text-blue-500" },
            { label: t("newChats"), value: "+4", icon: MessageCircle, color: "text-emerald-500" },
            { label: t("inFav"), value: "+11", icon: Heart, color: "text-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-3 md:p-4 flex flex-col gap-1 shadow-sm"
            >
              <Icon className={cn("w-4 h-4", color)} aria-hidden />
              <p className={cn("text-base md:text-lg font-bold", color)}>{value}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs section */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mb-10">
          {/* Tab headers */}
          <div className="flex overflow-x-auto border-b border-border scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px shrink-0",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" aria-hidden />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Status sub-tabs */}
          {(activeTab === "listings" || activeTab === "sales") && (
            <div className="flex gap-2 px-4 pt-4">
              {(["active", "completed"] as ListingStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    activeStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status === "active" ? (
                    <>
                      <Clock className="w-3 h-3" aria-hidden />
                      {t("active")}{" "}
                      {activeTab === "listings" ? user.stats.activeListings : 12}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3" aria-hidden />
                      {t("completed")}{" "}
                      {activeTab === "listings" ? 16 : 11}
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div className="p-4">
            {activeTab === "listings" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {myListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => setSelectedListing(listing)}
                  />
                ))}
                <button className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 py-10 hover:border-primary/50 hover:bg-secondary/50 transition-colors text-muted-foreground min-h-[160px]">
                  <Plus className="w-7 h-7" aria-hidden />
                  <span className="text-xs font-medium text-center px-2">{t("addListing")}</span>
                </button>
              </div>
            )}

            {activeTab === "purchases" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingCart className="w-14 h-14 text-muted mx-auto mb-4" aria-hidden />
                <p className="text-base font-semibold text-foreground mb-1">{t("noPurchases")}</p>
                <p className="text-sm text-muted-foreground mb-4">{t("noPurchasesSub")}</p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => onNavigate("home")}
                >
                  {t("browseListing")}
                  <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden />
                </Button>
              </div>
            )}

            {activeTab === "sales" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {myListings.slice(0, 2).map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => setSelectedListing(listing)}
                  />
                ))}
              </div>
            )}

            {activeTab === "shops" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Store className="w-14 h-14 text-muted mx-auto mb-4" aria-hidden />
                <p className="text-base font-semibold text-foreground mb-1">{t("noShops")}</p>
                <p className="text-sm text-muted-foreground mb-4">{t("noShopsSub")}</p>
                <Button className="rounded-full bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" aria-hidden />
                  {t("createStore")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedListing && (
        <ListingDetail listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
    </main>
  );
}
