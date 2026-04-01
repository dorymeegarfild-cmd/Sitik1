"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImagePlus, X, Bold, Italic, Hash, List,
  Link, Eye, EyeOff, ChevronDown, AlertCircle,
  Package, Monitor, Youtube, ArrowLeft, DollarSign,
  Phone, MapPin, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface PostAdPageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

type AdType = "household" | "digital";

const MAX_PHOTOS = 10;
const MAX_VIDEOS = 3;
const MAX_TITLE = 100;
const MAX_DESC = 5000;
const MAX_HASHTAGS = 3;

const ui: Record<string, Record<Language, string>> = {
  pageTitle:    { uk: "Нове оголошення",                     ru: "Новое объявление" },
  pageSubtitle: { uk: "Заповніть усі поля нижче та опублікуйте одним кліком", ru: "Заполните все поля ниже и опубликуйте одним кликом" },
  sectionZone:  { uk: "1. Зона та категорія",                ru: "1. Зона и категория" },
  sectionMedia: { uk: "2. Фото та відео",                    ru: "2. Фото и видео" },
  sectionInfo:  { uk: "3. Опис оголошення",                  ru: "3. Описание объявления" },
  sectionExtra: { uk: "4. Деталі та контакт",                ru: "4. Детали и контакт" },
  household:    { uk: "Побутова зона",                       ru: "Бытовая зона" },
  householdSub: { uk: "Фізично продавані товари та послуги", ru: "Физически продаваемые товары и услуги" },
  digital:      { uk: "Цифрова зона",                        ru: "Цифровая зона" },
  digitalSub:   { uk: "Акаунти, ключі, боти, курси та інше", ru: "Аккаунты, ключи, боты, курсы и прочее" },
  photos:       { uk: "Фотографії",                          ru: "Фотографии" },
  photosHint:   { uk: "до 10 шт, перше — головне",           ru: "до 10 шт, первое — главное" },
  videos:       { uk: "Відео з YouTube",                     ru: "Видео с YouTube" },
  videosHint:   { uk: "до 3 посилань",                       ru: "до 3 ссылок" },
  addPhoto:     { uk: "Додати фото",                         ru: "Добавить фото" },
  addVideo:     { uk: "Додати",                              ru: "Добавить" },
  ytPlaceholder:{ uk: "https://youtube.com/watch?v=...",     ru: "https://youtube.com/watch?v=..." },
  titleLabel:   { uk: "Заголовок",                           ru: "Заголовок" },
  titleHint:    { uk: "Введіть заголовок (підтримує емодзі)…", ru: "Введите заголовок (поддерживает эмодзи)…" },
  descLabel:    { uk: "Опис",                                ru: "Описание" },
  descHint:     { uk: "Опишіть товар детально (Markdown)…",  ru: "Опишите товар подробно (Markdown)…" },
  preview:      { uk: "Попередній перегляд",                 ru: "Предпросмотр" },
  edit:         { uk: "Редагування",                         ru: "Редактирование" },
  hashLabel:    { uk: "Хештеги",                             ru: "Хэштеги" },
  hashHint:     { uk: "до 3, обов'язково мінімум 1",         ru: "до 3, обязательно минимум 1" },
  hashPlh:      { uk: "хештег",                              ru: "хэштег" },
  hashAdd:      { uk: "Додати",                              ru: "Добавить" },
  hashWarn:     { uk: "Додайте мінімум 1 хештег",            ru: "Добавьте минимум 1 хэштег" },
  price:        { uk: "Ціна (₴)",                            ru: "Цена (₴)" },
  priceFree:    { uk: "Безкоштовно / Договірна",             ru: "Бесплатно / Договорная" },
  city:         { uk: "Місто",                               ru: "Город" },
  cityHint:     { uk: "Наприклад: Київ",                     ru: "Например: Киев" },
  condition:    { uk: "Стан",                                ru: "Состояние" },
  new:          { uk: "Нове",                                ru: "Новое" },
  excellent:    { uk: "Відмінний",                           ru: "Отличный" },
  good:         { uk: "Хороший",                             ru: "Хороший" },
  satisf:       { uk: "Задовільний",                         ru: "Удовлетворительный" },
  phone:        { uk: "Номер телефону",                      ru: "Номер телефона" },
  phonePlh:     { uk: "+38 (0XX) XXX-XX-XX",                 ru: "+38 (0XX) XXX-XX-XX" },
  publish:      { uk: "Опублікувати оголошення",             ru: "Опубликовать объявление" },
  back:         { uk: "Назад",                               ru: "Назад" },
  category:     { uk: "Категорія",                           ru: "Категория" },
  photoFirst:   { uk: "Головне",                             ru: "Главное" },
  chars:        { uk: "символів",                            ru: "символов" },
  required:     { uk: "Заповніть усі обов'язкові поля",      ru: "Заполните все обязательные поля" },
};

const householdCategories = [
  "Мода і стиль", "Електроніка", "Транспорт", "Нерухомість",
  "Дім і сад", "Робота", "Послуги", "Хобі і відпочинок",
];
const digitalCategories = [
  "Ігрові акаунти (Steam, Epic)", "Ключі та ПО", "Гайди і Курси",
  "Розробка ботів", "Дизайн", "Програмування",
];

function simpleMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^#{1,3}\s(.+)$/gm, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "• $1")
    .replace(/\n/g, "<br/>");
}

export function PostAdPage({ onNavigate, language }: PostAdPageProps) {
  const t = (key: string) => ui[key]?.[language] ?? key;

  const [adType, setAdType] = useState<AdType | null>(null);
  const [category, setCategory] = useState("");

  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashInput, setHashInput] = useState("");

  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [cityVal, setCityVal] = useState("");
  const [condition, setCondition] = useState("Нове");
  const [phone, setPhone] = useState("");

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - photos.length;
    files.slice(0, remaining).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    });
    e.target.value = "";
  }, [photos]);

  const removePhoto = (idx: number) => setPhotos((p) => p.filter((_, i) => i !== idx));

  const addVideo = () => {
    const url = videoInput.trim();
    if (!url || videoUrls.length >= MAX_VIDEOS) return;
    setVideoUrls((v) => [...v, url]);
    setVideoInput("");
  };

  const addHashtag = () => {
    const tag = hashInput.trim().replace(/^#/, "");
    if (!tag || hashtags.length >= MAX_HASHTAGS || hashtags.includes(`#${tag}`)) return;
    setHashtags((h) => [...h, `#${tag}`]);
    setHashInput("");
  };

  const insertMd = (wrap: string) => {
    const ta = descRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = description.slice(s, e);
    const newText = description.slice(0, s) + wrap + selected + wrap + description.slice(e);
    setDescription(newText);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + wrap.length + selected.length + wrap.length; }, 0);
  };

  const canPublish =
    adType && category && photos.length > 0 && title.trim().length >= 3 &&
    description.trim().length >= 10 && hashtags.length >= 1 && cityVal.trim() && phone.trim();

  const conditions = [
    { value: "Нове", label: t("new") },
    { value: "Відмінний", label: t("excellent") },
    { value: "Хороший", label: t("good") },
    { value: "Задовільний", label: t("satisf") },
  ];

  const SectionLabel = ({ icon: Icon, title, hint }: { icon: React.ElementType; title: string; hint?: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-bold text-foreground text-sm">{title}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-10">
      {/* Page header — full width */}
      <div className="border-b border-border bg-card">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground shrink-0"
            aria-label={t("back")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">{t("pageTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column: main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* ===== Section 1: Zone & Category ===== */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <SectionLabel icon={Tag} title={t("sectionZone")} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {(["household", "digital"] as AdType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setAdType(type); setCategory(""); }}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                      adType === type
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      adType === type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      {type === "household" ? <Package className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t(type)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{t(`${type}Sub`)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {adType && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {t("category")}
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer pr-10"
                    >
                      <option value="">-- {t("category")} --</option>
                      {(adType === "household" ? householdCategories : digitalCategories).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}
            </section>

            {/* ===== Section 2: Media ===== */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <SectionLabel icon={ImagePlus} title={t("sectionMedia")} />

              {/* Photos */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("photos")} <span className="font-normal normal-case">— {t("photosHint")}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{photos.length}/{MAX_PHOTOS}</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-secondary border-2 border-transparent">
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 z-10 text-[9px] font-bold px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full">
                          {t("photoFirst")}
                        </span>
                      )}
                      <img src={url} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        aria-label="Видалити фото"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-primary"
                    >
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-[9px] font-medium text-center leading-tight px-1">{t("addPhoto")}</span>
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </div>

              {/* YouTube videos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("videos")} <span className="font-normal normal-case">— {t("videosHint")}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{videoUrls.length}/{MAX_VIDEOS}</span>
                </div>

                <div className="space-y-2">
                  {videoUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
                      <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{url}</span>
                      <button onClick={() => setVideoUrls((v) => v.filter((_, i) => i !== idx))} aria-label="Видалити">
                        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                  {videoUrls.length < MAX_VIDEOS && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoInput}
                        onChange={(e) => setVideoInput(e.target.value)}
                        placeholder={t("ytPlaceholder")}
                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                      <Button size="sm" variant="outline" onClick={addVideo} className="rounded-xl px-4 shrink-0">
                        {t("addVideo")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ===== Section 3: Info ===== */}
            <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <SectionLabel icon={List} title={t("sectionInfo")} />

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("titleLabel")}</label>
                  <span className={cn("text-[11px]", title.length > MAX_TITLE * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                    {title.length}/{MAX_TITLE}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  maxLength={MAX_TITLE}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titleHint")}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("descLabel")}</label>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[11px]", description.length > MAX_DESC * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                      {description.length}/{MAX_DESC}
                    </span>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPreview ? t("edit") : t("preview")}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-2 bg-secondary rounded-t-2xl border border-border border-b-0">
                  {[
                    { icon: Bold, action: () => insertMd("**"), label: "Жирний" },
                    { icon: Italic, action: () => insertMd("*"), label: "Курсив" },
                    { icon: List, action: () => setDescription((d) => d + "\n- "), label: "Список" },
                    { icon: Link, action: () => insertMd("[текст](url)"), label: "Посилання" },
                  ].map(({ icon: Icon, action, label }) => (
                    <button
                      key={label}
                      onClick={action}
                      title={label}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>

                {showPreview ? (
                  <div
                    className="min-h-[160px] p-4 bg-background border border-border rounded-b-2xl text-sm text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: simpleMarkdown(description) || `<span class="text-muted-foreground">${t("descHint")}</span>` }}
                  />
                ) : (
                  <textarea
                    ref={descRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                    placeholder={t("descHint")}
                    rows={7}
                    className="w-full bg-background border border-border rounded-b-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                  />
                )}
              </div>

              {/* Hashtags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("hashLabel")}</label>
                  <span className="text-xs text-muted-foreground">{t("hashHint")}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hashtags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      <Hash className="w-3 h-3" />
                      {tag.replace("#", "")}
                      <button
                        onClick={() => setHashtags((h) => h.filter((t) => t !== tag))}
                        className="ml-0.5 hover:text-destructive transition-colors"
                        aria-label="Видалити тег"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {hashtags.length < MAX_HASHTAGS && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value.replace(/[^a-zA-Zа-яА-ЯіІєЄюЮяЯёЁ0-9_]/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && addHashtag()}
                        placeholder={t("hashPlh")}
                        className="w-full pl-8 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                    <Button size="sm" variant="outline" onClick={addHashtag} className="rounded-xl px-4 shrink-0">
                      {t("hashAdd")}
                    </Button>
                  </div>
                )}
                {hashtags.length === 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {t("hashWarn")}
                  </div>
                )}
              </div>
            </section>

            {/* ===== Section 4: Details & Contact ===== */}
            <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <SectionLabel icon={DollarSign} title={t("sectionExtra")} />

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("price")}</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={isFree ? "" : price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isFree}
                    placeholder="0"
                    className="flex-1 bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
                  />
                  <button
                    onClick={() => setIsFree(!isFree)}
                    className={cn(
                      "shrink-0 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-colors",
                      isFree ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {t("priceFree")}
                  </button>
                </div>
              </div>

              {/* City + Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("city")}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={cityVal}
                      onChange={(e) => setCityVal(e.target.value)}
                      placeholder={t("cityHint")}
                      className="w-full pl-8 bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("condition")}</label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full appearance-none bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer pr-8"
                    >
                      {conditions.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("phone")}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("phonePlh")}
                    className="w-full pl-9 bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right column: sticky publish panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-foreground text-base">
                {language === "uk" ? "Готовність оголошення" : "Готовность объявления"}
              </h2>

              {/* Checklist */}
              <div className="space-y-2">
                {[
                  { label: language === "uk" ? "Зона і категорія" : "Зона и категория", done: !!(adType && category) },
                  { label: language === "uk" ? "Хоч одне фото" : "Хоть одно фото", done: photos.length > 0 },
                  { label: language === "uk" ? "Заголовок" : "Заголовок", done: title.trim().length >= 3 },
                  { label: language === "uk" ? "Опис" : "Описание", done: description.trim().length >= 10 },
                  { label: language === "uk" ? "Хештег" : "Хэштег", done: hashtags.length >= 1 },
                  { label: language === "uk" ? "Місто" : "Город", done: !!cityVal.trim() },
                  { label: language === "uk" ? "Телефон" : "Телефон", done: !!phone.trim() },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-primary border-primary" : "border-border"
                    )}>
                      {done && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-primary-foreground" aria-hidden>
                          <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      ([
                        !!(adType && category),
                        photos.length > 0,
                        title.trim().length >= 3,
                        description.trim().length >= 10,
                        hashtags.length >= 1,
                        !!cityVal.trim(),
                        !!phone.trim(),
                      ].filter(Boolean).length / 7) * 100
                    )}%`
                  }}
                />
              </div>

              {!canPublish && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {t("required")}
                </p>
              )}

              <Button
                className="w-full rounded-full h-11 font-semibold"
                disabled={!canPublish}
                onClick={() => onNavigate("home")}
              >
                {t("publish")}
              </Button>

              <button
                onClick={() => onNavigate("home")}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
