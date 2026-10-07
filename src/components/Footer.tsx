import React from 'react';
import {
  ArrowUp, Calendar, CircleCheck, FileText, Landmark,
  MapPin, MessageCircle, Phone,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AccreditationMark, type AccreditationId } from './FooterAccreditations';
import type { PageView } from '../types';

interface FooterProps {
  onOpenBooking: () => void;
  onNavigate: (page: PageView) => void;
}

/* ------------------------------------------------------------------ */
/*  Decorative "jurisdictions network" band (top of the footer)        */
/* ------------------------------------------------------------------ */

/** Node anchors, expressed in % of the band box. They sit exactly on
 *  the sampled points of the Bezier wave below, so the dots stay glued
 *  to the line at every viewport width. */
const WAVE_NODES = [
  { left: 15.0, top: 52.7 },
  { left: 29.0, top: 78.2 },
  { left: 43.0, top: 47.3 },
  { left: 57.0, top: 20.0 },
  { left: 71.5, top: 56.4 },
  { left: 87.0, top: 47.3 },
];

const WAVE_LABELS = [
  { text: 'Financial Services', left: 57.0, top: 1 },
  { text: 'Jurisdictions', left: 43.0, top: 62 },
  { text: 'Network', left: 71.5, top: 70 },
];

const NetworkBand: React.FC = () => (
  <div className="relative h-24 overflow-hidden sm:h-28 lg:h-32" aria-hidden="true">
    {/* ambient light pools */}
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-sky-500/[0.07] to-transparent dark:from-sky-400/[0.06]" />
    <div className="absolute left-1/2 top-[-60%] h-64 w-[48rem] -translate-x-1/2 rounded-full bg-sky-400/[0.12] blur-3xl" />

    {/* the wave itself, stretched so it always bleeds edge to edge */}
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 110" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="rgcFooterWave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12" />
          <stop offset="20%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="52%" stopColor="#60a5fa" stopOpacity="0.95" />
          <stop offset="78%" stopColor="#38bdf8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rgcFooterWaveGhost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0" />
          <stop offset="45%" stopColor="#94a3b8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0,84 C50,84 100,58 150,58 C200,58 240,86 290,86 C340,86 380,60 430,52 C480,44 520,22 570,22 C620,22 660,48 715,62 C770,76 820,58 870,52 C920,46 960,42 1000,42"
        stroke="url(#rgcFooterWave)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M0,100 C60,100 110,78 170,74 C230,70 270,94 330,96 C390,98 440,74 500,66 C560,58 610,40 670,44 C730,48 780,80 840,82 C900,84 950,66 1000,64"
        stroke="url(#rgcFooterWaveGhost)"
        strokeWidth="1"
        strokeDasharray="4 9"
        strokeLinecap="round"
      />
    </svg>

    {/* glowing junctions */}
    {WAVE_NODES.map((node, i) => (
      <span
        key={i}
        className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center"
        style={{ left: `${node.left}%`, top: `${node.top}%` }}
      >
        <span
          className="absolute inset-0 animate-pulse rounded-full bg-sky-400/25 blur-md motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.45}s` }}
        />
        <span className="relative block h-[7px] w-[7px] rounded-full bg-white ring-[3px] ring-sky-400/60 dark:bg-sky-100" />
      </span>
    ))}

    {/* annotations */}
    {WAVE_LABELS.map((label) => (
      <span
        key={label.text}
        className="absolute hidden -translate-x-1/2 whitespace-nowrap text-[9px] font-medium tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:block"
        style={{ left: `${label.left}%`, top: `${label.top}%` }}
      >
        {label.text}
      </span>
    ))}
  </div>
);


const JURISDICTIONS = ['Pakistan', 'UK', 'USA', 'Gulf'] as const;

const EXPLORE_LINKS = [
  { label: 'Statutory Audit', icon: CircleCheck },
  { label: 'Tax Planning', icon: FileText },
  { label: 'Corporate Services', icon: Landmark },
] as const;

const ACCREDITATIONS: { id: AccreditationId; name: string }[] = [
  { id: 'icap', name: 'Institute of Chartered Accountants of Pakistan (ICAP)' },
  { id: 'secp', name: 'Securities and Exchange Commission of Pakistan (SECP)' },
  { id: 'fbr', name: 'Federal Board of Revenue (FBR) registered filer' },
  { id: 'hmrc', name: "His Majesty's Revenue and Customs (HMRC)" },
  { id: 'irs', name: 'Internal Revenue Service (IRS)' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCatalog = () => {
    onNavigate('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 overflow-hidden bg-white transition-colors dark:bg-[#081120]">
      <NetworkBand />

      {/* ---------------- Main columns ---------------- */}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">

          {/* Brand */}
          <motion.div
            className="space-y-6 lg:col-span-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 font-heading text-lg font-extrabold shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/10 transition-transform duration-300 group-hover:scale-105 dark:bg-white dark:shadow-black/40 dark:ring-white/10">
                <span className="text-white dark:text-slate-900">C</span>
                <span className="-ml-0.5 text-white dark:text-blue-600">G</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  RGC Accountants
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Raja Gulfam &amp; Co.</span>
              </div>
            </button>

            <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Chartered accounting, tax compliance and corporate legal advisory under the
              supervision of Raja Gulfam Kayani (FCMA, Advocate High Court) across Pakistan,
              the UK, the USA and the Gulf.
            </p>

            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Jurisdictions</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {JURISDICTIONS.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/60 dark:hover:text-sky-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>


          {/* Gradient divider */}
          <div className="hidden lg:col-span-1 lg:flex justify-center" aria-hidden="true">
            <div className="h-full w-px bg-gradient-to-b from-transparent via-slate-400/45 to-transparent" />
          </div>

          {/* Contact desk */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <ul className="space-y-3.5 text-xs">
              <li>
                <a
                  href="tel:+923348972072"
                  className="group flex items-start gap-3 rounded-md text-slate-600 transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:text-sky-300"
                >
                  <Phone className="mt-px h-4 w-4 shrink-0 text-blue-600 dark:text-sky-400" />
                  <span className="font-medium">+92 3121850063</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="mt-px h-4 w-4 shrink-0 text-blue-600 dark:text-sky-400" />
                  <span className="leading-relaxed">
                    Iqbal Complex,
                    <br />
                    Abbottabad, Pakistan
                  </span>
                </div>
              </li>
              <li>
                <a
                  href="https://wa.me/923348972072"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-md text-slate-600 transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:text-sky-300"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-blue-600 dark:text-sky-400" />
                  <span className="font-medium">WhatsApp Direct Desk</span>
                </a>
              </li>
            </ul>

            <div className="mt-7 flex justify-start lg:justify-center">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#081120]"
              >
                <Calendar className="h-4 w-4" />
                <span>Book a Consultation</span>
              </button>
            </div>
          </motion.div>


          {/* Explore */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            <h4 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Explore</h4>
            <ul className="mt-4 space-y-3.5">
              {EXPLORE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <button
                      onClick={openCatalog}
                      className="group flex items-center gap-2.5 rounded-md text-left text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:text-sky-300"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:text-sky-400" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>


          {/* ---------------- Accreditation shelf ---------------- */}
          <div className="relative border-t border-slate-200/80 dark:border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 lg:w-52 lg:shrink-0">
                &copy; {new Date().getFullYear()} Raja Gulfam &amp; Co. &middot; Accreditation Shelf
              </p>

              <ul className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6 sm:gap-x-12">
                {ACCREDITATIONS.map((item) => (
                  <li key={item.id} className="group" title={item.name}>
                    <span
                      className={`block transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-sky-300 text-slate-600 ${
                        item.id === 'fbr'
                          ? 'drop-shadow-[0_0_14px_rgba(45,190,120,0.45)]'
                          : ''
                      }`}
                    >
                      <AccreditationMark id={item.id} />
                    </span>
                    <span className="sr-only">{item.name}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 lg:w-52 lg:shrink-0 lg:justify-end">
                <span className="hidden text-[11px] text-slate-500 dark:text-slate-400 md:inline">
                  FBR &middot; SECP &middot; HMRC &middot; IRS
                </span>
                <button
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/50 dark:hover:text-sky-300"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      );
    };
