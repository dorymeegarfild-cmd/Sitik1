"use client";

import { useState } from "react";
import {
  Search, Moon, Sun, Heart, MessageCircle, ShoppingBag,
  Plus, User, Bell, Home, Monitor, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  currentPage: string;
  onNavigate: (page: Page) => void;
  language: Language;
  onToggleLanguage: () => void;
}

const uiText: Record<string, Record<Language, string>> = {
  searchPlaceholder: { uk: "Пошук: авто, квартира, телефон…", ru: "Поиск: авто, квартира, телефон…" },
  shop: { uk: "SHOP", ru: "SHOP" },
  favorites: { uk: "Обране", ru: "Избранное" },
  chats: { uk: "Чати", ru: "Чаты" },
  post: { uk: "Подати", ru: "Подать" },
  household: { uk: "Побутові товари", ru: "Бытовые товары" },
  digital: { uk: "Цифрова зона", ru: "Цифровая зона" },
};

const categories = [
  { label: "household" as keyof typeof uiText, icon: Home },
  { label: "digital" as keyof typeof uiText, icon: Monitor },
];

export function Header({ darkMode, onToggleDark, currentPage, onNavigate, language, onToggleLanguage }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 max-w-screen-xl mx-auto">

        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 shrink-0 mr-1"
          aria-label="Amara Market — головна"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm select-none">
            A
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:block">
            Amara <span className="text-primary">Market</span>
          </span>
        </button>

        {/* Category nav — desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Категорії">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onNavigate("home")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <cat.icon className="w-4 h-4" />
              <span>{uiText[cat.label][language]}</span>
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={uiText.searchPlaceholder[language]}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            aria-label={uiText.searchPlaceholder[language]}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label={darkMode ? "Світла тема" : "Темна тема"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language toggle — shows only current language, click to switch */}
          <button
            onClick={onToggleLanguage}
            className="hidden sm:flex items-center justify-center h-7 px-2.5 rounded-full border border-border text-xs font-bold select-none transition-colors hover:border-primary/50 hover:bg-secondary"
            style={
              language === "uk"
                ? { background: "linear-gradient(to bottom, #005BBB 50%, #FFD500 50%)", color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)", borderColor: "transparent" }
                : { background: "var(--secondary)", color: "var(--foreground)" }
            }
            aria-label={language === "uk" ? "Переключити на російську" : "Переключити на українську"}
          >
            {language === "uk" ? "UA" : "RU"}
          </button>

          {/* SHOP */}
          <button
            onClick={() => onNavigate("home")}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground"
            aria-label="SHOP"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden lg:block text-xs font-medium">{uiText.shop[language]}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => onNavigate("favorites")}
            className={cn(
              "hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm hover:text-foreground",
              currentPage === "favorites" ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={uiText.favorites[language]}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden lg:block text-xs font-medium">{uiText.favorites[language]}</span>
          </button>

          {/* Chats */}
          <button
            onClick={() => onNavigate("chats")}
            className={cn(
              "hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm hover:text-foreground relative",
              currentPage === "chats" ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={uiText.chats[language]}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden lg:block text-xs font-medium">{uiText.chats[language]}</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </button>

          {/* Post ad */}
          <Button
            size="sm"
            className="hidden sm:flex items-center gap-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onNavigate("post")}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{uiText.post[language]}</span>
          </Button>

          {/* Settings */}
          <button
            onClick={() => onNavigate("settings")}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors",
              currentPage === "settings" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Налаштування"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User — goes directly to profile (hidden on mobile, visible sm+) */}
          <button
            onClick={() => onNavigate("profile")}
            className={cn(
              "hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-secondary transition-colors",
              currentPage === "profile" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Мій профіль"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
