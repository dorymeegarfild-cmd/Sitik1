"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HomePage } from "@/components/home-page";
import { ProfilePage } from "@/components/profile-page";
import { SettingsPage } from "@/components/settings-page";
import { ChatsPage } from "@/components/chats-page";
import { PostAdPage } from "@/components/post-ad-page";
import { ShopPage } from "@/components/shop-page";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Heart } from "lucide-react";

export type Page = "home" | "profile" | "favorites" | "chats" | "settings" | "category" | "post" | "shop";
export type Language = "uk" | "ru";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("uk");

  // Sync dark mode with document
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  // Hash-based routing
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "") || "home";
      const parts = hash.split("/");
      const page = parts[0] as Page;
      const validPages: Page[] = ["home", "profile", "favorites", "chats", "settings", "category", "shop"];
      if (validPages.includes(page)) {
        setCurrentPage(page);
        if (page === "category" && parts[1]) setActiveCategory(parts[1]);
      } else {
        setCurrentPage("home");
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const navigate = (page: Page, sub?: string) => {
    setCurrentPage(page);
    if (page === "category" && sub) {
      setActiveCategory(sub);
      window.location.hash = `#category/${sub}`;
    } else {
      window.location.hash = `#${page}`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        currentPage={currentPage}
        onNavigate={navigate}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === "uk" ? "ru" : "uk"))}
      />

      <div className="pb-16 md:pb-0">
        {currentPage === "home" && (
          <HomePage onNavigate={navigate} initialCategory={activeCategory} language={language} />
        )}
        {currentPage === "category" && (
          <HomePage onNavigate={navigate} initialCategory={activeCategory} language={language} />
        )}
        {currentPage === "profile" && (
          <ProfilePage onNavigate={navigate} language={language} />
        )}
        {currentPage === "settings" && (
          <SettingsPage onNavigate={navigate} onToggleDark={() => setDarkMode(!darkMode)} darkMode={darkMode} language={language} />
        )}
        {currentPage === "favorites" && (
          <div className="max-w-screen-xl mx-auto px-4 py-10 text-center text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted" />
            <p className="text-xl font-semibold text-foreground mb-2">
              {language === "uk" ? "Обране порожнє" : "Избранное пусто"}
            </p>
            <p className="text-sm">
              {language === "uk"
                ? "Натисніть серце на оголошенні, щоб зберегти"
                : "Нажмите сердечко на объявлении, чтобы сохранить"}
            </p>
          </div>
        )}
        {currentPage === "chats" && (
          <ChatsPage language={language} />
        )}
        {currentPage === "post" && (
          <PostAdPage onNavigate={navigate} language={language} />
        )}
        {currentPage === "shop" && (
          <ShopPage onNavigate={navigate} language={language} />
        )}
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={navigate}
        language={language}
      />
    </div>
  );
}
