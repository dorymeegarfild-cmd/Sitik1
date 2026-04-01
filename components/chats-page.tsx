"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, ArrowLeft, Send, Paperclip, Smile,
  Phone, MoreVertical, Star, Shield, CheckCheck,
  MessageCircle, Package, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/app/page";

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  initial: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  lastSeen: string;
  tab: "buying" | "selling";
  listingTitle: string;
  listingPrice: string;
  listingImage?: string;
  messages: Message[];
}

const chats: Chat[] = [
  {
    id: "1",
    name: "Олексій Ковальчук",
    avatar: "",
    initial: "О",
    lastMessage: "Добре, завтра можемо зустрітись о 12:00",
    time: "12:41",
    unread: 2,
    isOnline: true,
    lastSeen: "Онлайн",
    tab: "buying",
    listingTitle: "iPhone 14 Pro 256GB",
    listingPrice: "28 500 ₴",
    listingImage: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=80&h=80&fit=crop&auto=format",
    messages: [
      { id: "m1", text: "Привіт! Цікавить ваш iPhone. Торг є?", time: "12:30", isOwn: true, status: "read" },
      { id: "m2", text: "Привіт! Так, трохи можна поторгуватися. Яка ваша пропозиція?", time: "12:32", isOwn: false, status: "read" },
      { id: "m3", text: "Готовий взяти за 27 000 ₴", time: "12:35", isOwn: true, status: "read" },
      { id: "m4", text: "Давайте 27 500 ₴ і домовились", time: "12:38", isOwn: false, status: "read" },
      { id: "m5", text: "Добре, завтра можемо зустрітись о 12:00", time: "12:41", isOwn: false, status: "read" },
    ],
  },
  {
    id: "2",
    name: "Магазин TechHub",
    avatar: "",
    initial: "T",
    lastMessage: "Дякуємо за покупку! Відправили сьогодні",
    time: "10:15",
    unread: 0,
    isOnline: false,
    lastSeen: "Був нещодавно",
    tab: "buying",
    listingTitle: "MacBook Air M2",
    listingPrice: "52 000 ₴",
    listingImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=80&h=80&fit=crop&auto=format",
    messages: [
      { id: "m1", text: "Хочу замовити MacBook Air M2", time: "09:00", isOwn: true, status: "read" },
      { id: "m2", text: "Звичайно! Уточніть конфігурацію, будь ласка.", time: "09:10", isOwn: false, status: "read" },
      { id: "m3", text: "8GB / 256GB, колір Space Gray", time: "09:15", isOwn: true, status: "read" },
      { id: "m4", text: "Дякуємо за покупку! Відправили сьогодні", time: "10:15", isOwn: false, status: "read" },
    ],
  },
  {
    id: "3",
    name: "Марина Дем'яненко",
    avatar: "",
    initial: "М",
    lastMessage: "Ще продається?",
    time: "Вч",
    unread: 1,
    isOnline: false,
    lastSeen: "Був 3 дні тому",
    tab: "selling",
    listingTitle: "Диван кутовий",
    listingPrice: "8 900 ₴",
    listingImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop&auto=format",
    messages: [
      { id: "m1", text: "Ще продається?", time: "Вч", isOwn: false, status: "delivered" },
    ],
  },
  {
    id: "4",
    name: "Іван Петренко",
    avatar: "",
    initial: "І",
    lastMessage: "Добре, тоді завтра передзвоню",
    time: "Пн",
    unread: 0,
    isOnline: false,
    lastSeen: "Онлайн",
    tab: "selling",
    listingTitle: 'Телевізор Samsung 55"',
    listingPrice: "14 200 ₴",
    listingImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop&auto=format",
    messages: [
      { id: "m1", text: "Здрастуйте, чи можна забрати сьогодні?", time: "Пн 10:00", isOwn: false, status: "read" },
      { id: "m2", text: "Сьогодні не виходить, але завтра — залюбки", time: "Пн 10:30", isOwn: true, status: "read" },
      { id: "m3", text: "Добре, тоді завтра передзвоню", time: "Пн 10:32", isOwn: false, status: "read" },
    ],
  },
];

const uiText: Record<string, Record<Language, string>> = {
  search: { uk: "Пошук чатів…", ru: "Поиск чатов…" },
  buying: { uk: "Купую", ru: "Покупаю" },
  selling: { uk: "Продаю", ru: "Продаю" },
  noChats: { uk: "Чатів ще немає", ru: "Чатов пока нет" },
  noChatsSub: { uk: "Напишіть продавцю — і він з'явиться тут", ru: "Напишите продавцу — и он появится здесь" },
  selectChat: { uk: "Виберіть, кому хочете написати", ru: "Выберите, кому хотите написать" },
  inputPlaceholder: { uk: "Повідомлення…", ru: "Сообщение…" },
  online: { uk: "Онлайн", ru: "Онлайн" },
  wasRecently: { uk: "Був нещодавно", ru: "Был недавно" },
  was3days: { uk: "Був 3 дні тому", ru: "Был 3 дня назад" },
};

interface ChatsPageProps {
  language: Language;
}

export function ChatsPage({ language }: ChatsPageProps) {
  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [localChats, setLocalChats] = useState<Chat[]>(chats);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => uiText[key]?.[language] ?? key;

  const filteredChats = localChats.filter(
    (c) =>
      c.tab === activeTab &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedChat = localChats.find((c) => c.id === selectedChatId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, localChats]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: inputText.trim(),
      time: timeStr,
      isOwn: true,
      status: "sent",
    };
    setLocalChats((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, time: timeStr, unread: 0 }
          : c
      )
    );
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Chat list panel ────────────────────────────────────────────
  const ChatListPanel = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-3 pt-3 pb-1 gap-2 shrink-0">
        {(["buying", "selling"] as const).map((tab) => {
          const count = localChats.filter((c) => c.tab === tab && c.unread > 0).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "buying" ? (
                <ShoppingBag className="w-3.5 h-3.5" />
              ) : (
                <Package className="w-3.5 h-3.5" />
              )}
              {t(tab)}
              {count > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/30 text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chat rows */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <MessageCircle className="w-12 h-12 text-muted" />
            <p className="font-semibold text-foreground text-sm">{t("noChats")}</p>
            <p className="text-xs text-muted-foreground">{t("noChatsSub")}</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChatId(chat.id);
                setLocalChats((prev) =>
                  prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
                );
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary/60 transition-colors text-left border-b border-border/40",
                selectedChatId === chat.id && "bg-primary/8 border-l-2 border-l-primary"
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {chat.initial}
                </div>
                {chat.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-foreground truncate">{chat.name}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{chat.time}</span>
                </div>
                {/* Listing chip with thumbnail */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {chat.listingImage && (
                    <img
                      src={chat.listingImage}
                      alt={chat.listingTitle}
                      className="w-7 h-7 rounded-md object-cover shrink-0 border border-border/50"
                    />
                  )}
                  <span className="text-[10px] text-primary font-medium truncate">
                    {chat.listingTitle} · {chat.listingPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate pr-2">{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // ── Conversation panel ─────────────────────────────────────────
  const ConversationPanel = selectedChat ? (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        {/* Back (mobile) */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          onClick={() => setSelectedChatId(null)}
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold">
            {selectedChat.initial}
          </div>
          {selectedChat.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground truncate">{selectedChat.name}</p>
            <Shield className="w-3 h-3 text-primary shrink-0" />
          </div>
          <p className={cn(
            "text-xs",
            selectedChat.isOnline ? "text-emerald-500 font-medium" : "text-muted-foreground"
          )}>
            {selectedChat.lastSeen}
          </p>
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Зателефонувати">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Переглянути оголошення">
            <Package className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Більше">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Listing preview bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border-b border-border shrink-0">
        <Package className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-medium text-foreground truncate">{selectedChat.listingTitle}</span>
        <span className="text-xs text-primary font-semibold shrink-0">{selectedChat.listingPrice}</span>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {selectedChat.messages.map((msg, idx) => {
          const showDate = idx === 0;
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-secondary text-xs text-muted-foreground rounded-full">
                    {language === "uk" ? "Сьогодні" : "Сегодня"}
                  </span>
                </div>
              )}
              <div className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground rounded-bl-md border border-border"
                  )}
                >
                  <p>{msg.text}</p>
                  <div className={cn("flex items-center gap-1 mt-1 text-[10px]", msg.isOwn ? "justify-end text-primary-foreground/70" : "text-muted-foreground")}>
                    <span>{msg.time}</span>
                    {msg.isOwn && (
                      <CheckCheck className={cn("w-3 h-3", msg.status === "read" ? "text-primary-foreground" : "text-primary-foreground/50")} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border bg-card shrink-0">
        <button
          className="w-9 h-9 shrink-0 flex items-center justify-center text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
          aria-label={language === "uk" ? "Emoji" : "Эмодзи"}
        >
          <Smile className="w-5 h-5" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          className="flex-1 py-2.5 px-4 rounded-full bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
        <button
          className="w-9 h-9 shrink-0 flex items-center justify-center text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
          aria-label={language === "uk" ? "Прикріпити файл" : "Прикрепить файл"}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-95 transition-all shadow"
          aria-label={language === "uk" ? "Надіслати" : "Отправить"}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    /* Empty state — desktop */
    <div className="hidden md:flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageCircle className="w-10 h-10 text-primary/40" />
      </div>
      <p className="text-base font-semibold text-foreground">{t("selectChat")}</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        {t("noChatsSub")}
      </p>
    </div>
  );

  // ── Layout ─────────────────────────────────────────────────────
  return (
    <div
      className="flex h-[calc(100vh-64px)] overflow-hidden bg-background"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      {/* Desktop: side-by-side */}
      <div className="hidden md:flex w-full">
        {/* Left panel */}
        <div className="w-80 lg:w-96 shrink-0 border-r border-border bg-card flex flex-col">
          {ChatListPanel}
        </div>
        {/* Right panel */}
        <div className="flex-1 flex flex-col bg-background">
          {ConversationPanel}
        </div>
      </div>

      {/* Mobile: single panel */}
      <div className="md:hidden w-full flex flex-col bg-card">
        {selectedChatId ? ConversationPanel : ChatListPanel}
      </div>
    </div>
  );
}
