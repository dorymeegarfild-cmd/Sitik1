"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImagePlus, X, Bold, Italic, Hash, List,
  Link, Eye, EyeOff, ChevronDown, AlertCircle,
  Check, Package, Monitor, Youtube, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Page, Language } from "@/app/page";

interface PostAdPageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

type AdType = "household" | "digital";
type Step = 1 | 2 | 3;

const MAX_PHOTOS = 10;
const MAX_VIDEOS = 3;
const MAX_TITLE = 100;
const MAX_DESC = 5000;
const MAX_HASHTAGS = 3;

const ui: Record<string, Record<Language, string>> = {
  pageTitle:    { uk: "Нове оголошення",           ru: "Новое объявление" },
  step1:        { uk: "Тип і категорія",            ru: "Тип и категория" },
  step2:        { uk: "Фото / Відео",               ru: "Фото / Видео" },
  step3:        { uk: "Деталі",                     ru: "Детали" },
  household:    { uk: "Побутові товари",            ru: "Бытовые товары" },
  householdSub: { uk: "Фізично продавані товари",   ru: "Физически продаваемые товары" },
  digital:      { uk: "Цифрова зона",               ru: "Цифровая зона" },
  digitalSub:   { uk: "Акаунти, ігрова валюта, скіни, боти та інше", ru: "Аккаунты, игровая валюта, скины, боты и прочее" },
  photos:       { uk: "Фотографії (до 10 шт)",      ru: "Фотографии (до 10 шт)" },
  videos:       { uk: "Відео з YouTube (до 3 шт)",  ru: "Видео с YouTube (до 3 шт)" },
  addPhoto:     { uk: "Додати фото",                ru: "Добавить фото" },
  addVideo:     { uk: "Вставити посилання",         ru: "Вставить ссылку" },
  ytPlaceholder:{ uk: "https://youtube.com/watch?v=...", ru: "https://youtube.com/watch?v=..." },
  titleLabel:   { uk: "Заголовок (підтримує емодзі)", ru: "Заголовок (поддерживает эмодзи)" },
  titleHint:    { uk: "Введіть заголовок оголошення...", ru: "Введите заголовок объявления..." },
  descLabel:    { uk: "Опис (Markdown, до 5000 символів)", ru: "Описание (Markdown, до 5000 символов)" },
  descHint:     { uk: "Опишіть товар детально...", ru: "Опишите товар подробно..." },
  preview:      { uk: "Попередній перегляд",        ru: "Предпросмотр" },
  edit:         { uk: "Редагування",                ru: "Редактирование" },
  hashLabel:    { uk: "Хештеги (обов'язково, до 3)", ru: "Хэштеги (обязательно, до 3)" },
  hashHint:     { uk: "#хештег",                    ru: "#хэштег" },
  hashAdd:      { uk: "Додати",                     ru: "Добавить" },
  hashWarn:     { uk: "Додайте мінімум 1 хештег",   ru: "Добавьте минимум 1 хэштег" },
  price:        { uk: "Ціна (₴)",                   ru: "Цена (₴)" },
  priceFree:    { uk: "Безкоштовно / Договірна",    ru: "Бесплатно / Договорная" },
  city:         { uk: "Місто",                      ru: "Город" },
  cityHint:     { uk: "Наприклад: Київ",            ru: "Например: Киев" },
  condition:    { uk: "Стан",                       ru: "Состояние" },
  new:          { uk: "Нове",                       ru: "Новое" },
  excellent:    { uk: "Відмінний",                  ru: "Отличный" },
  good:         { uk: "Хороший",                    ru: "Хороший" },
  satisf:       { uk: "Задовільний",                ru: "Удовлетворительный" },
  phone:        { uk: "Номер телефону",             ru: "Номер телефона" },
  phonePlh:     { uk: "+38 (0XX) XXX-XX-XX",        ru: "+38 (0XX) XXX-XX-XX" },
  publish:      { uk: "Опублікувати оголошення",    ru: "Опубликовать объявление" },
  back:         { uk: "Назад",                      ru: "Назад" },
  next:         { uk: "Далі",                       ru: "Далее" },
  category:     { uk: "Категорія",                  ru: "Категория" },
  photoFirst:   { uk: "Перше фото — головне",       ru: "Первое фото — главное" },
  chars:        { uk: "символів",                   ru: "символов" },
};

const householdCategories = [
  "Електроніка", "Авто", "Нерухомість", "Дім і сад", "Мода і стиль",
  "Дитячий світ", "Хобі і спорт", "Тварини", "Запчастини", "Шини та диски",
  "Робота", "Бізнес і послуги", "Оренда і прокат",
];
const digitalCategories = [
  "Акаунти соцмереж", "Ігрова валюта", "Ігрові скіни", "Стімові акаунти",
  "Розробка ботів", "Сайти та скрипти", "NFT та крипто",
  "Підписки та акаунти сервісів", "Інше (цифрове)",
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

  const [step, setStep] = useState<Step>(1);
  const [adType, setAdType] = useState<AdType | null>(null);
  const [category, setCategory] = useState("");

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Videos
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");

  // Title & description
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Hashtags
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashInput, setHashInput] = useState("");

  // Price & other
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [cityVal, setCityVal] = useState("");
  const [condition, setCondition] = useState("Нове");
  const [phone, setPhone] = useState("");

  // --- Handlers ---
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
    let tag = hashInput.trim().replace(/^#/, "");
    if (!tag || hashtags.length >= MAX_HASHTAGS || hashtags.includes(`#${tag}`)) return;
    setHashtags((h) => [...h, `#${tag}`]);
    setHashInput("");
  };

  const insertMd = (wrap: string) => {
    const ta = descRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = description.slice(s, e);
    const newText =
      description.slice(0, s) + wrap + selected + wrap + description.slice(e);
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

  // Step labels
  const steps: { n: Step; label: string }[] = [
    { n: 1, label: t("step1") },
    { n: 2, label: t("step2") },
    { n: 3, label: t("step3") },
  ];

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
            aria-label={t("back")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{t("pageTitle")}</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, idx) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  step > s.n ? "bg-primary text-primary-foreground" :
                  step === s.n ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", step === s.n ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={cn("flex-1 h-px transition-colors", step > s.n ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        {/* ==================== STEP 1 ==================== */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Ad type */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {ui.step1[language]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["household", "digital"] as AdType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setAdType(type); setCategory(""); }}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                      adType === type
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
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
            </section>

            {/* Category */}
            {adType && (
              <section>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-3">
                  {t("category")}
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer pr-10"
                  >
                    <option value="">-- {t("category")} --</option>
                    {(adType === "household" ? householdCategories : digitalCategories).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </section>
            )}

            <Button
              className="w-full rounded-full h-11"
              disabled={!adType || !category}
              onClick={() => setStep(2)}
            >
              {t("next")}
            </Button>
          </div>
        )}

        {/* ==================== STEP 2 ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Photos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("photos")}
                </h2>
                <span className="text-xs text-muted-foreground">{photos.length}/{MAX_PHOTOS}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-[10px] font-medium text-center leading-tight px-1">{t("addPhoto")}</span>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
            </section>

            {/* YouTube videos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("videos")}
                </h2>
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
                      className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                    <Button size="sm" variant="outline" onClick={addVideo} className="rounded-xl px-4 shrink-0">
                      {t("addVideo")}
                    </Button>
                  </div>
                )}
              </div>
            </section>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full h-11" onClick={() => setStep(1)}>
                {t("back")}
              </Button>
              <Button className="flex-1 rounded-full h-11" disabled={photos.length === 0} onClick={() => setStep(3)}>
                {t("next")}
              </Button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3 ==================== */}
        {step === 3 && (
          <div className="space-y-5">

            {/* Title */}
            <section>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("titleLabel")}
              </label>
              <input
                type="text"
                value={title}
                maxLength={MAX_TITLE}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titleHint")}
                className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <div className="flex justify-end mt-1">
                <span className={cn("text-[11px]", title.length > MAX_TITLE * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                  {title.length}/{MAX_TITLE} {t("chars")}
                </span>
              </div>
            </section>

            {/* Description with markdown toolbar */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("descLabel")}
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPreview ? t("edit") : t("preview")}
                </button>
              </div>

              {/* Markdown toolbar */}
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
                  className="min-h-[160px] p-4 bg-card border border-border rounded-b-2xl text-sm text-foreground leading-relaxed prose-sm"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdown(description) || `<span class="text-muted-foreground">${t("descHint")}</span>` }}
                />
              ) : (
                <textarea
                  ref={descRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                  placeholder={t("descHint")}
                  rows={8}
                  className="w-full bg-card border border-border rounded-b-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                />
              )}

              <div className="flex justify-end mt-1">
                <span className={cn("text-[11px]", description.length > MAX_DESC * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                  {description.length}/{MAX_DESC} {t("chars")}
                </span>
              </div>
            </section>

            {/* Hashtags */}
            <section>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("hashLabel")}
              </label>
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
                      placeholder={t("hashHint").replace("#", "")}
                      className="w-full pl-8 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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
            </section>

            {/* Price */}
            <section>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("price")}
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={isFree ? "" : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  placeholder="0"
                  className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
                />
                <button
                  onClick={() => setIsFree(!isFree)}
                  className={cn(
                    "shrink-0 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-colors",
                    isFree ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t("priceFree")}
                </button>
              </div>
            </section>

            {/* City + Condition in a row */}
            <div className="grid grid-cols-2 gap-3">
              <section>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  {t("city")}
                </label>
                <input
                  type="text"
                  value={cityVal}
                  onChange={(e) => setCityVal(e.target.value)}
                  placeholder={t("cityHint")}
                  className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </section>
              <section>
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  {t("condition")}
                </label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full appearance-none bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer pr-8"
                  >
                    {conditions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </section>
            </div>

            {/* Phone */}
            <section>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                {t("phone")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePlh")}
                className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </section>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="rounded-full h-11 px-6" onClick={() => setStep(2)}>
                {t("back")}
              </Button>
              <Button
                className="flex-1 rounded-full h-11 font-semibold"
                disabled={!canPublish}
                onClick={() => onNavigate("home")}
              >
                {t("publish")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
