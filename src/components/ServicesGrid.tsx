import React, { useEffect, useMemo, useState } from 'react';
import type { CatalogItem, Region } from '../types';
import { seedCatalogItems } from '../data/catalogSeed';
import {
  BookOpen,
  ArrowRight,
  Tag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesGridProps {
  onOpenBookingWithService: (serviceTitle: string) => void;
  selectedRegion: Region;
  onNavigateCatalog?: () => void;
}

const FEATURED_COUNT = 3;
const AUTO_ROTATE_MS = 7000;

/**
 * Flagship engagements from distinct practice areas. Preferred first so the
 * homepage spotlights meaningful work instead of three near-identical sibling
 * rows from the top of the catalog.
 */
const FLAGSHIP_IDS = ['cat-13', 'cat-1', 'cat-35'];

const categoryKey = (item: CatalogItem) => (item.category || 'other').trim().toLowerCase();

const pickFeatured = (list: CatalogItem[]): CatalogItem[] => {
  if (list.length <= FEATURED_COUNT) return list.slice(0, FEATURED_COUNT);

  const picked: CatalogItem[] = [];
  const seen = new Set<string>();

  for (const id of FLAGSHIP_IDS) {
    const match = list.find((i) => i.id === id);
    if (match && !seen.has(categoryKey(match))) {
      seen.add(categoryKey(match));
      picked.push(match);
    }
    if (picked.length === FEATURED_COUNT) return picked;
  }

  // Top up using one entry per distinct category so the trio always looks varied.
  for (const item of list) {
    if (picked.length >= FEATURED_COUNT) break;
    const key = categoryKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      picked.push(item);
    }
  }

  // Last resort when the catalog has very few distinct categories.
  for (const item of list) {
    if (picked.length >= FEATURED_COUNT) break;
    if (!picked.includes(item)) picked.push(item);
  }

  return picked;
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onOpenBookingWithService,
  onNavigateCatalog
}) => {
  const [items, setItems] = useState<CatalogItem[]>(seedCatalogItems);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/catalogs');
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.catalogs) && data.catalogs.length > 0) {
          setItems(data.catalogs);
        }
      } catch {
        // Keep the bundled seed so the section still renders without a backend.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const featured = useMemo(() => pickFeatured(items), [items]);
  const active = featured[activeIndex];

  const goTo = (next: number) => {
    const wrapped = (next + featured.length) % featured.length;
    setDirection(wrapped >= activeIndex ? 1 : -1);
    setActiveIndex(wrapped);
  };

  // Auto-rotation only runs while the section is actually on screen.
  useEffect(() => {
    if (featured.length < 2 || paused) return;

    let inView = true;
    const node = document.getElementById('services');
    const observer = node
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.25 })
      : null;
    if (node && observer) observer.observe(node);

    const timer = setInterval(() => {
      if (!inView) return;
      setDirection(1);
      setActiveIndex((i) => (i + 1) % featured.length);
    }, AUTO_ROTATE_MS);

    return () => {
      clearInterval(timer);
      observer?.disconnect();
    };
  }, [featured.length, paused]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, filter: 'blur(6px)' })
  };

  if (loading) {
    return (
      <section id="services" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[460px] rounded-[2rem] bg-slate-100 dark:bg-slate-900/60 animate-pulse" />
        </div>
      </section>
    );
  }
return (
    <section
      id="services"
      className="py-20 relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors overflow-hidden"
    >
      {/* Ambient depth */}
      <div className="absolute -top-24 left-1/4 w-[420px] h-[420px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Flagship Engagements
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              A snapshot of our most-recited services - the complete rate catalog lives one click away.
            </p>
          </motion.div>
        </div>

        {/* Spotlight */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* MAIN STAGE */}
          <div className="lg:col-span-7 relative">
            <div className="relative h-full min-h-[340px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-2xl shadow-blue-950/25 border border-blue-900/40">
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:22px_22px]" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active.id || activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 h-full flex flex-col justify-center gap-5 p-8 sm:p-10"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {active.category || 'Taxation'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-white bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Tag className="w-3.5 h-3.5 text-blue-300" />
                      {active.price}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    {active.title}
                  </h3>

                  <p className="text-sm text-blue-100/70 leading-relaxed max-w-lg">
                    {active.subtext || 'Comprehensive statutory filing and advisory compliance.'}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-blue-200/80">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Partner-reviewed engagement
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Fixed published rate
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenBookingWithService(active.title)}
                    className="self-start mt-1 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-600/30 active:scale-95 group"
                  >
                    Request This Service
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Stage index */}
              <div className="absolute top-5 right-6 z-20 font-heading text-6xl sm:text-7xl font-black text-white/[0.07] leading-none select-none pointer-events-none">
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* SIDE SELECTOR */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {featured.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id || index}
                  onClick={() => goTo(index)}
                  aria-pressed={isActive}
                  className={`group relative flex-1 text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/25 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-400/60 hover:bg-blue-50/50 dark:hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading text-sm font-extrabold leading-snug">
                          {item.title}
                        </h4>
                        <span
                          className={`shrink-0 text-[11px] font-extrabold ${
                            isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {item.price}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${
                          isActive ? 'text-blue-50/80' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Arrows */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                {featured.map((item, index) => (
                  <button
                    key={`dot-${item.id || index}`}
                    onClick={() => goTo(index)}
                    aria-label={`Show ${item.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-7 bg-blue-600 dark:bg-blue-400' : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous service"
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next service"
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
{/* Full catalog CTA */}
        <div className="pt-2 text-center space-y-2">
          <button
            onClick={onNavigateCatalog}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all hover:scale-105 active:scale-95 group"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explore Full Catalog ({items.length} Services)</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {featured.length} featured of {items.length} published services
          </p>
        </div>

      </div>
    </section>
  );
};
