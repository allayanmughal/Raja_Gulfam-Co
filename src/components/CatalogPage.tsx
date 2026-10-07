import React, { useState, useEffect } from 'react';
import type { CatalogItem } from '../types';
import { seedCatalogItems } from '../data/catalogSeed';
import {
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CatalogPageProps {
  onNavigateHome: () => void;
  onOpenBookingWithService: (serviceTitle: string) => void;
}

const CATEGORIES = ['All', 'Taxation', 'Audit', 'Legal', 'Advisory', 'Accounting'];

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onNavigateHome,
  onOpenBookingWithService
}) => {
  const [catalogs, setCatalogs] = useState<CatalogItem[]>(seedCatalogItems);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const res = await fetch('/api/catalogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.catalogs) && data.catalogs.length > 0) {
          setCatalogs(data.catalogs);
        }
      } catch (err) {
        console.warn('Falling back to local catalog seed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  const filteredCatalogs = catalogs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Site</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Services & Fee Catalog
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Browse our full range of 80+ professional accounting, statutory audit, taxation, FBR, SECP compliance, and corporate legal services.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name, FBR form, section, or price..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-center text-xs text-slate-600 dark:text-slate-500 font-medium">
            Showing <span className="text-blue-400 font-bold">{filteredCatalogs.length}</span> of {catalogs.length} verified services
          </div>
        </div>

        {/* Catalog Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-600 dark:text-slate-400">Loading catalog directory...</p>
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching services found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Try adjusting your search keywords or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogs.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/50 dark:border-blue-900/40 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 dark:shadow-xl dark:shadow-blue-950/25 dark:hover:shadow-2xl dark:hover:shadow-blue-950/40"
              >
                {/* Dark reveal on hover (light mode). In dark mode the card is already navy. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Grid texture — mirrors the homepage spotlight card */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:22px_22px] opacity-0 transition-opacity duration-300 group-hover:opacity-[0.07] dark:opacity-[0.07]" />

                <div className="relative z-10 p-4 flex flex-col gap-2.5">
                  {/* Category Pill & Price Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-[0.15em] bg-blue-50 text-blue-700 border border-blue-200 truncate transition-colors duration-300 group-hover:bg-blue-500/20 group-hover:text-blue-300 group-hover:border-blue-400/30 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30">
                      {item.category || 'Taxation'}
                    </span>

                    <span className="inline-flex items-center gap-1 shrink-0 text-[11px] font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full transition-colors duration-300 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/15 dark:text-white dark:bg-white/10 dark:border-white/15">
                      <Tag className="w-3 h-3 text-slate-500 transition-colors duration-300 group-hover:text-blue-300 dark:text-blue-300" />
                      {item.price}
                    </span>
                  </div>

                  {/* Title & Subtext */}
                  <div className="space-y-1 text-left">
                    <h3 className="font-heading text-[15px] font-black text-slate-900 leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-white dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-blue-100/70 dark:text-blue-100/70">
                      {item.subtext || 'Comprehensive statutory regulatory filing and expert advisory compliance.'}
                    </p>
                  </div>

                  {/* Feature chips — wrap onto one or two tight lines instead of a stacked block */}
                  <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[10px] text-slate-600 transition-colors duration-300 group-hover:text-blue-200/80 dark:text-blue-200/80">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 transition-colors duration-300 group-hover:text-blue-400 dark:text-blue-400" />
                      Standard Government &amp; FBR Filing
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 transition-colors duration-300 group-hover:text-blue-400 dark:text-blue-400" />
                      Expert Managing Partner Review
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => onOpenBookingWithService(item.title)}
                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold transition-all shadow-lg shadow-blue-600/25 active:scale-95"
                  >
                    Request This Service
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
