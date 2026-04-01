"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImagePlus, X, Bold, Italic, Hash, List,
  Link, Eye, EyeOff, ChevronDown, AlertCircle,
  Package, Monitor, Youtube, ArrowLeft, DollarSign,
  Phone, MapPin, Tag, ArrowLeftRight, Upload,
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
const PLATFORM_FEE = 0.2;

const ui: Record<string, Record<Language, string>> = {
  pageTitle:     { uk: "Нове оголошення",                          ru: "Новое объявление" },
  back:          { uk: "Назад",                                    ru: "Назад" },
  sectionZone:   { uk: "Зона та категорія",                        ru: "Зона и категория" },
  sectionMedia:  { uk: "Фото та відео",                            ru: "Фото и видео" },
  sectionInfo:   { uk: "Опис оголошення",                          ru: "Описание объявления" },
  sectionExtra:  { uk: "Деталі та контакт",                        ru: "Детали и контакт" },
  household:     { uk: "Побутова зона",                            ru: "Бытовая зона" },
  householdSub:  { uk: "Фізичні товари та послуги",                ru: "Физические товары и услуги" },
  digital:       { uk: "Цифрова зона",                             ru: "Цифровая зона" },
  digitalSub:    { uk: "Акаунти, ключі, боти, курси",              ru: "Аккаунты, ключи, боты, курсы" },
  photos:        { uk: "Фотографії",                               ru: "Фотографии" },
  photosHint:    { uk: "до 10 шт, перше — головне",                ru: "до 10 шт, первое — главное" },
  videos:        { uk: "Відео YouTube",                            ru: "Видео YouTube" },
  videosHint:    { uk: "до 3 посилань",                            ru: "до 3 ссылок" },
  addPhoto:      { uk: "Завантажити",                              ru: "Загрузить" },
  addVideo:      { uk: "Додати",                                   ru: "Добавить" },
  ytPlaceholder: { uk: "https://youtube.com/watch?v=...",          ru: "https://youtube.com/watch?v=..." },
  titleLabel:    { uk: "Назва товару",                             ru: "Название товара" },
  titleHint:     { uk: "Введіть назву товару…",                    ru: "Введите название товара…" },
  descLabel:     { uk: "Опис",                                     ru: "Описание" },
  descHint:      { uk: "Опишіть детально…",                       ru: "Опишите подробно…" },
  preview:       { uk: "Попередній перегляд",                      ru: "Предпросмотр" },
  edit:          { uk: "Редагування",                              ru: "Редактирование" },
  hashLabel:     { uk: "Хештеги",                                  ru: "Хэштеги" },
  hashHint:      { uk: "до 3, мінімум 1",                          ru: "до 3, минимум 1" },
  hashPlh:       { uk: "хештег",                                   ru: "хэштег" },
  hashAdd:       { uk: "Додати",                                   ru: "Добавить" },
  hashWarn:      { uk: "Додайте мінімум 1 хештег",                 ru: "Добавьте минимум 1 хэштег" },
  price:         { uk: "Ціна товару (₴)",                          ru: "Цена товара (₴)" },
  income:        { uk: "Дохід",                                    ru: "Доход" },
  feeNote:       { uk: "Комісія платформи 20%",                    ru: "Комиссия платформы 20%" },
  priceFree:     { uk: "Безкоштовно",                              ru: "Бесплатно" },
  city:          { uk: "Місто",                                    ru: "Город" },
  cityHint:      { uk: "Наприклад: Київ",                          ru: "Например: Киев" },
  condition:     { uk: "Стан",                                     ru: "Состояние" },
  new:           { uk: "Нове",                                     ru: "Новое" },
  excellent:     { uk: "Відмінний",                                ru: "Отличный" },
  good:          { uk: "Хороший",                                  ru: "Хороший" },
  satisf:        { uk: "Задовільний",                              ru: "Удовлетворительный" },
  phone:         { uk: "Номер телефону",                           ru: "Номер телефона" },
  phonePlh:      { uk: "+38 (0XX) XXX-XX-XX",                      ru: "+38 (0XX) XXX-XX-XX" },
  publish:       { uk: "Опублікувати оголошення",                  ru: "Опубликовать объявление" },
  category:      { uk: "Категорія",                                ru: "Категория" },
  photoFirst:    { uk: "Головне",                                  ru: "Главное" },
  required:      { uk: "Заповніть обов'язкові поля",               ru: "Заполните обязательные поля" },
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
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

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

  const income = price && !isFree
    ? Math.round(Number(price) * (1 - PLATFORM_FEE))
    : null;

  const handlePhotoUpload = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const remaining = MAX_PHOTOS - photos.length;
    arr.slice(0, remaining).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    });
  }, [photos]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handlePhotoUpload(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handlePhotoUpload(e.dataTransfer.files);
  };

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
    { value: "Нове",       label: t("new") },
    { value: "Відмінний",  label: t("excellent") },
    { value: "Хороший",    label: t("good") },
    { value: "Задовільний",label: t("satisf") },
  ];

  const inputCls = "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar with progress */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground shrink-0"
            aria-label={t("back")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-foreground">{t("pageTitle")}</span>
          {/* Category breadcrumb */}
          {(adType || category) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-border">/</span>
              {adType && <span>{t(adType)}</span>}
              {category && <><span className="text-border">/</span><span className="text-primary">{category}</span></>}
            </div>
          )}
          {/* Progress bar */}
          <div className="ml-auto w-32 h-1 bg-secondary rounded-full overflow-hidden hidden sm:block">
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
        </div>
      </div>

      {/* Full-width two-column layout */}
      <div className="max-w-screen-2xl mx-auto flex gap-0 min-h-[calc(100vh-57px)]">

        {/* ── LEFT: Image upload area (big) ─────────────────────── */}
        <div className="flex-1 bg-secondary/40 border-r border-border flex flex-col">
          {/* Upload zone */}
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex-1 flex flex-col items-center justify-center transition-colors relative",
              dragging && "bg-primary/5"
            )}
            style={{ minHeight: "420px" }}
          >
            {photos.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 text-center px-8">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-9 h-9 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground mb-1">
                    {language === "uk" ? "Перетягніть фото сюди" : "Перетащите фото сюда"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "uk" ? "або натисніть кнопку нижче" : "или нажмите кнопку ниже"}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow"
                >
                  <ImagePlus className="w-4 h-4" />
                  {t("addPhoto")}
                </button>
                <p className="text-xs text-muted-foreground">{t("photosHint")}</p>
              </div>
            ) : (
              /* Photo grid */
              <div className="w-full h-full p-4 flex flex-col gap-3">
                {/* Main photo */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-secondary border-2 border-primary/30" style={{ minHeight: "280px" }}>
                  <img src={photos[0]} alt="Головне фото" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                    {t("photoFirst")}
                  </span>
                  <button
                    onClick={() => removePhoto(0)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label="Видалити"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Thumbnails row */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.slice(1).map((url, idx) => (
                    <div key={idx + 1} className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                      <img src={url} alt={`Фото ${idx + 2}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(idx + 1)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                        aria-label="Видалити"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card flex flex-col items-center justify-center gap-1 shrink-0 transition-colors text-muted-foreground hover:text-primary"
                    >
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-[9px]">+</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground text-right">{photos.length}/{MAX_PHOTOS}</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileInput} />

          {/* YouTube section below image area */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("videos")} — {t("videosHint")}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{videoUrls.length}/{MAX_VIDEOS}</span>
            </div>
            <div className="space-y-2">
              {videoUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-secondary rounded-xl">
                  <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
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
                    className={cn(inputCls, "flex-1")}
                  />
                  <Button size="sm" variant="outline" onClick={addVideo} className="rounded-xl shrink-0">
                    {t("addVideo")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Details panel ──────────────────────────────── */}
        <div className="w-full md:w-[380px] lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col bg-card overflow-y-auto">
          <div className="flex-1 p-5 space-y-5">

            {/* Zone + Category */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {t("sectionZone")}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(["household", "digital"] as AdType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setAdType(type); setCategory(""); }}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all",
                      adType === type
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary hover:border-primary/40"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      adType === type ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                    )}>
                      {type === "household" ? <Package className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs">{t(type)}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{t(`${type}Sub`)}</p>
                    </div>
                  </button>
                ))}
              </div>
              {adType && (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={cn(inputCls, "appearance-none cursor-pointer pr-9")}
                  >
                    <option value="">-- {t("category")} --</option>
                    {(adType === "household" ? householdCategories : digitalCategories).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>

            {/* Price + Income calculator */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                {t("price")}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={isFree ? "" : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  placeholder="0"
                  className={cn(inputCls, "flex-1 disabled:opacity-50")}
                />
                <div className="flex items-center justify-center w-8 shrink-0">
                  <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className={cn(inputCls, "flex-1 opacity-70 cursor-default select-none")}>
                  {income !== null ? income.toLocaleString() : "—"}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{t("feeNote")}</p>
              <button
                onClick={() => setIsFree(!isFree)}
                className={cn(
                  "mt-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors",
                  isFree ? "bg-primary text-primary-foreground border-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                )}
              >
                {t("priceFree")}
              </button>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("titleLabel")}</p>
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
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("descLabel")}</p>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[11px]", description.length > MAX_DESC * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                    {description.length}/{MAX_DESC}
                  </span>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
                  >
                    {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPreview ? t("edit") : t("preview")}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1 p-1.5 bg-secondary rounded-t-xl border border-border border-b-0">
                {[
                  { icon: Bold,   action: () => insertMd("**"), label: "Bold" },
                  { icon: Italic, action: () => insertMd("*"),  label: "Italic" },
                  { icon: List,   action: () => setDescription((d) => d + "\n- "), label: "List" },
                  { icon: Link,   action: () => insertMd("[текст](url)"), label: "Link" },
                ].map(({ icon: Icon, action, label }) => (
                  <button
                    key={label}
                    onClick={action}
                    title={label}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                  >
                    <Icon className="w-3 h-3" />
                  </button>
                ))}
              </div>
              {showPreview ? (
                <div
                  className="min-h-[120px] p-3 bg-background border border-border rounded-b-xl text-sm text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdown(description) || `<span class="text-muted-foreground">${t("descHint")}</span>` }}
                />
              ) : (
                <textarea
                  ref={descRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                  placeholder={t("descHint")}
                  rows={5}
                  className="w-full bg-background border border-border rounded-b-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                />
              )}
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("hashLabel")}</p>
                <span className="text-[11px] text-muted-foreground">{t("hashHint")}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    <Hash className="w-3 h-3" />
                    {tag.replace("#", "")}
                    <button
                      onClick={() => setHashtags((h) => h.filter((t) => t !== tag))}
                      className="ml-0.5 hover:text-destructive transition-colors"
                      aria-label="Видалити тег"
                    >
                      <X className="w-2.5 h-2.5" />
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
                      className="w-full pl-8 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={addHashtag} className="rounded-xl px-3 shrink-0">
                    {t("hashAdd")}
                  </Button>
                </div>
              )}
              {hashtags.length === 0 && (
                <p className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {t("hashWarn")}
                </p>
              )}
            </div>

            {/* City + Condition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("city")}</p>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={cityVal}
                    onChange={(e) => setCityVal(e.target.value)}
                    placeholder={t("cityHint")}
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("condition")}</p>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className={cn(inputCls, "appearance-none cursor-pointer pr-8")}
                  >
                    {conditions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("phone")}</p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlh")}
                  className={cn(inputCls, "pl-9")}
                />
              </div>
            </div>
          </div>

          {/* Sticky publish footer */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4 space-y-2">
            {!canPublish && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {t("required")}
              </p>
            )}
            <Button
              className="w-full rounded-2xl h-11 font-bold"
              disabled={!canPublish}
              onClick={() => onNavigate("home")}
            >
              {t("publish")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
