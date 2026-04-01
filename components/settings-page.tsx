"use client";

import { useState } from "react";
import {
  Shield, Package, Crown, Mail, Phone,
  Lock, HelpCircle, LogOut, Moon, Sun,
  ChevronRight, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onToggleDark: () => void;
  darkMode: boolean;
  language: Language;
  paginationMode: "auto" | "manual";
  onTogglePagination: () => void;
}

type SettingItem = {
  id: string;
  icon: React.ElementType;
  labelUk: string;
  labelRu: string;
  toggle?: boolean;
  badge?: string;
};

const accountItems: SettingItem[] = [
  { id: "inventory", icon: Package,    labelUk: "Інвентар",               labelRu: "Инвентарь" },
  { id: "premium",   icon: Crown,      labelUk: "Amara Premium",           labelRu: "Amara Premium", badge: "PRO" },
  { id: "email",     icon: Mail,       labelUk: "Змінити пошту",           labelRu: "Изменить почту" },
  { id: "phone",     icon: Phone,      labelUk: "Номер телефону",          labelRu: "Номер телефона" },
  { id: "privacy",   icon: Shield,     labelUk: "Конфіденційність",        labelRu: "Конфиденциальность" },
  { id: "password",  icon: Lock,       labelUk: "Пароль / Змінити пароль", labelRu: "Пароль / Изменить пароль" },
  { id: "support",   icon: HelpCircle, labelUk: "Підтримка",               labelRu: "Поддержка" },
];

const notifItems: SettingItem[] = [
  { id: "notif_new",   icon: Bell, labelUk: "Нові повідомлення",  labelRu: "Новые сообщения",    toggle: true },
  { id: "notif_deals", icon: Bell, labelUk: "Пропозиції угод",    labelRu: "Предложения сделок", toggle: true },
];

function Toggle({ on, onFlip }: { on: boolean; onFlip: () => void }) {
  return (
    <div
      role="switch"
      aria-checked={on}
      onClick={(e) => { e.stopPropagation(); onFlip(); }}
      className={cn(
        "relative w-10 rounded-full cursor-pointer transition-colors shrink-0 select-none",
        on ? "bg-primary" : "bg-muted"
      )}
      style={{ height: "1.375rem" }}
    >
      <span className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
        on ? "translate-x-5" : "translate-x-0.5"
      )} />
    </div>
  );
}

export function SettingsPage({ onNavigate, onToggleDark, darkMode, language, paginationMode, onTogglePagination }: SettingsPageProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notif_new: true,
    notif_deals: false,
  });

  const flip = (id: string) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  const label = (item: SettingItem) => language === "uk" ? item.labelUk : item.labelRu;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2 mt-6 first:mt-0">
      {children}
    </p>
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {language === "uk" ? "Налаштування" : "Настройки"}
          </h1>
          <p className="text-xs text-muted-foreground">dansbravl · Amara Market</p>
        </div>
      </div>

      {/* Appearance */}
      <SectionTitle>{language === "uk" ? "Зовнішній вигляд" : "Внешний вид"}</SectionTitle>
      {/* Use a div (not button) to avoid nested button inside button */}
      <div
        onClick={onToggleDark}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors cursor-pointer mb-1"
      >
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          {darkMode
            ? <Moon className="w-4 h-4 text-muted-foreground" />
            : <Sun className="w-4 h-4 text-muted-foreground" />}
        </div>
        <span className="flex-1 text-sm font-medium text-foreground">
          {darkMode
            ? (language === "uk" ? "Темна тема" : "Тёмная тема")
            : (language === "uk" ? "Світла тема" : "Светлая тема")}
        </span>
        <Toggle on={darkMode} onFlip={onToggleDark} />
      </div>

      {/* Pagination mode toggle */}
      <div
        onClick={onTogglePagination}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors cursor-pointer mb-1"
      >
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-muted-foreground">{paginationMode === "auto" ? "∞" : "1…"}</span>
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-foreground block">
            {language === "uk" ? "Прокрутка стрічки" : "Прокрутка ленты"}
          </span>
          <span className="text-xs text-muted-foreground">
            {paginationMode === "auto"
              ? (language === "uk" ? "Автоматично — підвантажується при прокрутці" : "Автоматически — подгружается при скролле")
              : (language === "uk" ? "Ручна — нумерація сторінок 1, 2, 3…" : "Ручная — нумерация страниц 1, 2, 3…")}
          </span>
        </div>
        <Toggle on={paginationMode === "auto"} onFlip={onTogglePagination} />
      </div>

      {/* Account */}
      <SectionTitle>{language === "uk" ? "Акаунт" : "Аккаунт"}</SectionTitle>      <div className="flex flex-col gap-2">
        {accountItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">{label(item)}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {item.badge}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      {/* Notifications */}
      <SectionTitle>{language === "uk" ? "Сповіщення" : "Уведомления"}</SectionTitle>
      <div className="flex flex-col gap-2">
        {notifItems.map((item) => (
          <div
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => flip(item.id)}
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">{label(item)}</span>
            <Toggle on={toggles[item.id]} onFlip={() => flip(item.id)} />
          </div>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full mt-8 rounded-2xl h-12 font-semibold gap-2"
        onClick={() => onNavigate("home")}
      >
        <LogOut className="w-4 h-4" />
        {language === "uk" ? "Вийти" : "Выйти"}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Amara Market v2.0.0 · {language === "uk" ? "Версія для веб" : "Веб версия"}
      </p>
    </main>
  );
}
