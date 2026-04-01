"use client";

import { Home, Heart, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface MobileBottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  language: Language;
}

const labels: Record<string, Record<Language, string>> = {
  home: { uk: "Головна", ru: "Главная" },
  favorites: { uk: "Обране", ru: "Избранное" },
  post: { uk: "Подати", ru: "Подать" },
  chats: { uk: "Чати", ru: "Чаты" },
  profile: { uk: "Профіль", ru: "Профиль" },
};

export function MobileBottomNav({ currentPage, onNavigate, language }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border"
      aria-label="Мобільна навігація"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <button
          onClick={() => onNavigate("home")}
          className={cn(
            "flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors",
            currentPage === "home" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={labels.home[language]}
        >
          <Home className={cn("w-5 h-5", currentPage === "home" && "fill-primary")} />
          <span className="text-[11px] font-medium">{labels.home[language]}</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onNavigate("favorites")}
          className={cn(
            "flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors",
            currentPage === "favorites" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={labels.favorites[language]}
        >
          <Heart className={cn("w-5 h-5", currentPage === "favorites" && "fill-primary")} />
          <span className="text-[11px] font-medium">{labels.favorites[language]}</span>
        </button>

        {/* Post — center large button */}
        <button
          onClick={() => onNavigate("post")}
          className="flex flex-col items-center justify-center -mt-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all"
          aria-label={labels.post[language]}
        >
          <Plus className="w-7 h-7" />
        </button>

        {/* Chats */}
        <button
          onClick={() => onNavigate("chats")}
          className={cn(
            "flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors relative",
            currentPage === "chats" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={labels.chats[language]}
        >
          <MessageCircle className={cn("w-5 h-5", currentPage === "chats" && "fill-primary/20 text-primary")} />
          <span className="text-[11px] font-medium">{labels.chats[language]}</span>
          {/* Badge */}
          <span className="absolute top-0.5 right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            3
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate("profile")}
          className={cn(
            "flex flex-col items-center gap-0.5 min-w-[52px] py-1 px-2 rounded-xl transition-colors",
            currentPage === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={labels.profile[language]}
        >
          <User className={cn("w-5 h-5", currentPage === "profile" && "fill-primary/20 text-primary")} />
          <span className="text-[11px] font-medium">{labels.profile[language]}</span>
        </button>
      </div>
    </nav>
  );
}
