import React, { useEffect, useState } from 'react';
import type { EventItem, CreateEventInput } from '../../types/event';
import type { CatalogItem } from '../../types';
import { seedCatalogItems } from '../../data/catalogSeed';
import {
  LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Search,
  CheckCircle, X, AlertCircle, RefreshCw,
  ShieldCheck, Tag, BookOpen, Layers, Sun, Moon, FileText, ImageIcon, UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { AdminUsersPanel } from './AdminUsersPanel';

interface Props {
  adminEmail: string;
  adminId: string;
  isSuperAdmin: boolean;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ adminEmail, adminId, isSuperAdmin, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'catalog' | 'admins'>('events');
  const { theme, toggleTheme } = useTheme();

  // A non-super admin must never be able to view the Admin Users section, even
  // if a stale tab state or a manual click tries to select it.
  const canManageAdmins = isSuperAdmin;
  const selectTab = (tab: 'events' | 'catalog' | 'admins') => {
    if (tab === 'admins' && !canManageAdmins) return;
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!canManageAdmins && activeTab === 'admins') setActiveTab('events');
  }, [canManageAdmins, activeTab]);

  // --- EVENTS STATE ---
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventFilterTab, setEventFilterTab] = useState<'all' | 'published' | 'drafts'>('all');

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [eventFormData, setEventFormData] = useState<CreateEventInput>({
    title: '',
    priorityDetail: '',
    description: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
    template: 'template1',
    published: true
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [eventFormError, setEventFormError] = useState<string | null>(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // --- CATALOG STATE ---
  const [catalogs, setCatalogs] = useState<CatalogItem[]>(seedCatalogItems);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('All');

  const [isCatalogFormOpen, setIsCatalogFormOpen] = useState(false);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [deletingCatalogId, setDeletingCatalogId] = useState<string | null>(null);

  const [catalogFormData, setCatalogFormData] = useState({
    title: '',
    subtext: '',
    price: '',
    category: 'Taxation'
  });
  const [catalogFormError, setCatalogFormError] = useState<string | null>(null);
  const [submittingCatalog, setSubmittingCatalog] = useState(false);

  // Fetch Events
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('/api/admin/events', { credentials: 'include' });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.warn('Failed to fetch admin events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch Catalogs
  const fetchCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const res = await fetch('/api/catalogs');
      const data = await res.json();
      if (data.success && Array.isArray(data.catalogs) && data.catalogs.length > 0) {
        setCatalogs(data.catalogs);
      }
    } catch (err) {
      console.warn('Using local seed catalog fallback:', err);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCatalogs();
  }, []);

  // --- EVENT HANDLERS ---
  const handleOpenAddEventModal = () => {
    setEditingEventId(null);
    setEventFormData({
      title: '',
      priorityDetail: '',
      description: '',
      images: [],
      date: new Date().toISOString().split('T')[0],
      template: 'template1',
      published: true
    });
    setImageUrlInput('');
    setEventFormError(null);
    setIsEventFormOpen(true);
  };

  const handleOpenEditEventModal = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEventFormData({
      title: evt.title,
      priorityDetail: evt.priorityDetail,
      description: evt.description,
      images: Array.isArray(evt.images) ? [...evt.images] : [],
      date: evt.date,
      template: evt.template,
      published: evt.published
    });
    setImageUrlInput('');
    setEventFormError(null);
    setIsEventFormOpen(true);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setEventFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setEventFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title.trim() || !eventFormData.priorityDetail.trim() || !eventFormData.description.trim()) {
      setEventFormError('Title, High-Priority Detail, and Description are required.');
      return;
    }

    setSubmittingEvent(true);
    setEventFormError(null);

    try {
      const endpoint = editingEventId ? `/api/admin/events/${editingEventId}` : '/api/admin/events';
      const method = editingEventId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(eventFormData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsEventFormOpen(false);
        fetchEvents();
      } else {
        setEventFormError(data.error || 'Failed to save event.');
      }
    } catch (err) {
      setEventFormError('Save operation failed.');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleTogglePublishEvent = async (evt: EventItem) => {
    try {
      const res = await fetch(`/api/admin/events/${evt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ published: !evt.published })
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setDeletingEventId(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CATALOG HANDLERS ---
  const handleOpenAddCatalogModal = () => {
    setEditingCatalogId(null);
    setCatalogFormData({
      title: '',
      subtext: '',
      price: 'PKR ',
      category: 'Taxation'
    });
    setCatalogFormError(null);
    setIsCatalogFormOpen(true);
  };

  const handleOpenEditCatalogModal = (cat: CatalogItem) => {
    setEditingCatalogId(cat.id);
    setCatalogFormData({
      title: cat.title,
      subtext: cat.subtext,
      price: cat.price,
      category: cat.category || 'Taxation'
    });
    setCatalogFormError(null);
    setIsCatalogFormOpen(true);
  };

  const handleSaveCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogFormData.title.trim() || !catalogFormData.price.trim()) {
      setCatalogFormError('Service Title and Price are required.');
      return;
    }

    setSubmittingCatalog(true);
    setCatalogFormError(null);

    try {
      const endpoint = editingCatalogId ? `/api/admin/catalogs/${editingCatalogId}` : '/api/admin/catalogs';
      const method = editingCatalogId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(catalogFormData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCatalogFormOpen(false);
        fetchCatalogs();
      } else {
        setCatalogFormError(data.error || 'Failed to save catalog service.');
      }
    } catch (err) {
      setCatalogFormError('Save operation failed.');
    } finally {
      setSubmittingCatalog(false);
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/catalogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setDeletingCatalogId(null);
        fetchCatalogs();
      } else {
        setCatalogs(prev => prev.filter(c => c.id !== id));
        setDeletingCatalogId(null);
      }
    } catch (err) {
      setCatalogs(prev => prev.filter(c => c.id !== id));
      setDeletingCatalogId(null);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(eventSearchQuery.toLowerCase());

    if (eventFilterTab === 'published') return matchesSearch && evt.published;
    if (eventFilterTab === 'drafts') return matchesSearch && !evt.published;
    return matchesSearch;
  });

  // Filtered Catalogs
  const filteredCatalogs = catalogs.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
      cat.subtext.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
      cat.price.toLowerCase().includes(catalogSearchQuery.toLowerCase());

    const matchesCategory =
      catalogCategoryFilter === 'All' || cat.category?.toLowerCase() === catalogCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // --- SIDEBAR NAVIGATION STYLING ---
  const sidebarNavClass = (isActive: boolean) =>
    `w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
    }`;

  const sidebarCountClass =
    'shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  const sidebarCountActiveClass =
    'shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-white/25 text-white';

  return (
    <div className="min-h-screen pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">Management Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold uppercase">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Logged in as <span className="text-slate-700 dark:text-slate-200 font-semibold">{adminEmail}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle colour theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
            </button>

            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-colors"
            >
              ← Visit Site
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-extrabold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Sidebar Navigation + Active Section Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)] gap-6 items-start">

          {/* --- SIDEBAR --- */}
          <aside className="space-y-3 lg:sticky lg:top-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2 shadow-xl">
              <p className="px-2.5 pt-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-500">
                Management Sections
              </p>

              <button
                onClick={() => selectTab('events')}
                className={sidebarNavClass(activeTab === 'events')}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">Events &amp; Announcements</span>
                <span className={activeTab === 'events' ? sidebarCountActiveClass : sidebarCountClass}>
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => selectTab('catalog')}
                className={sidebarNavClass(activeTab === 'catalog')}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">Services &amp; Catalog</span>
                <span className={activeTab === 'catalog' ? sidebarCountActiveClass : sidebarCountClass}>
                  {catalogs.length}
                </span>
              </button>

              {/* Admin Users — super admin only */}
              {canManageAdmins && (
                <button
                  onClick={() => selectTab('admins')}
                  className={sidebarNavClass(activeTab === 'admins')}
                >
                  <UserCog className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">Admin Users</span>
                  <span className={activeTab === 'admins' ? sidebarCountActiveClass : sidebarCountClass}>
                    —
                  </span>
                </button>
              )}
            </div>

            {/* Filtered result counter */}
            <p className="px-1 text-[11px] text-slate-600 dark:text-slate-500">
              {activeTab === 'events'
                ? `Showing ${filteredEvents.length} of ${events.length} events`
                : activeTab === 'catalog'
                  ? `Showing ${filteredCatalogs.length} of ${catalogs.length} services`
                  : 'Manage who can sign in to this portal'}
            </p>
          </aside>

          {/* --- ACTIVE SECTION CONTENT --- */}
          <div className="space-y-6 min-w-0">

        {/* --- SECTION 1: EVENTS MANAGEMENT --- */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {(['all', 'published', 'drafts'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEventFilterTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      eventFilterTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}

                <button
                  onClick={handleOpenAddEventModal}
                  className="sm:ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>

            {/* Events List */}
            {loadingEvents ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-bold">No events found</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Create a new event using the button above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-xl"
                  >
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {evt.images && evt.images.length > 0 && (
                        <div className="h-36 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
                          <img
                            src={evt.images[0]}
                            alt={evt.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              evt.published ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {evt.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      )}

                      <h3 className="font-heading text-base font-extrabold text-slate-900 dark:text-white line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {evt.priorityDetail}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePublishEvent(evt)}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                          evt.published ? 'text-blue-400 bg-blue-950/60' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                        }`}
                        title={evt.published ? 'Unpublish' : 'Publish'}
                      >
                        {evt.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditEventModal(evt)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingEventId(evt.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: CATALOG MANAGEMENT --- */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder="Search catalog by title, details, or price..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {['All', 'Taxation', 'Audit', 'Legal', 'Advisory', 'Accounting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                      catalogCategoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <button
                  onClick={handleOpenAddCatalogModal}
                  className="sm:ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Catalog Service</span>
                </button>
              </div>
            </div>

            {/* Catalog List — compact single-line rows */}
            {loadingCatalogs ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400">Loading catalog items...</p>
              </div>
            ) : filteredCatalogs.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No catalog items found</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Use the "Add Catalog Service" button above to create one.</p>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800/70 overflow-hidden shadow-xl">
                {filteredCatalogs.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors"
                  >
                    {/* Record ID */}
                    <span className="hidden lg:block w-14 shrink-0 font-mono text-[10px] text-slate-600 dark:text-slate-500">
                      {item.id}
                    </span>

                    {/* Title + Specification */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {item.subtext || 'No additional details provided.'}
                      </p>
                    </div>

                    {/* Category */}
                    <span className="hidden md:inline-flex shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-950 text-blue-400 border border-blue-800/80">
                      {item.category || 'Taxation'}
                    </span>

                    {/* Price */}
                    <div className="shrink-0 w-fit flex items-center gap-1 text-blue-400 font-extrabold text-xs bg-blue-950/60 px-2.5 py-1 rounded-xl border border-blue-800/60">
                      <Tag className="w-3 h-3" />
                      <span>{item.price}</span>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCatalogModal(item)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 text-slate-700 dark:text-slate-200 hover:text-white transition-colors"
                        title="Edit service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit {item.title}</span>
                      </button>
                      <button
                        onClick={() => setDeletingCatalogId(item.id)}
                        className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-rose-200 transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Delete {item.title}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- SECTION 3: ADMIN USER MANAGEMENT (super admin only) --- */}
        {canManageAdmins && activeTab === 'admins' && (
          <AdminUsersPanel currentAdminId={adminId} onSessionEnded={onLogout} />
        )}

          </div>
        </div>

      </div>

      {/* --- EVENT MODAL --- */}
      <AnimatePresence>
        {isEventFormOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl my-4 max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 relative"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white">
                    {editingEventId ? 'Edit Event Announcement' : 'Create New Event Announcement'}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Write your announcement content in Step 1, then add images in Step 2.
                  </p>
                </div>
                <button
                  onClick={() => setIsEventFormOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {eventFormError && (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{eventFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEvent} className="space-y-5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Step 1 — Announcement Content</span>
                </p>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    placeholder="e.g. Annual Tax Compliance Summit 2026"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">High-Priority Short Detail (Banner Subtext) *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.priorityDetail}
                    onChange={(e) => setEventFormData({ ...eventFormData, priorityDetail: e.target.value })}
                    placeholder="e.g. URGENT NOTICE: FBR Q3 Corporate Filing Deadline"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Event Description *
                    </label>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      {eventFormData.description.trim().length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={7}
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    placeholder="Describe the event in full — topics covered, speakers, key dates, eligibility, and what attendees should bring or prepare..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    This is the main body text shown on the published event card.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Publish Immediately?</label>
                    <button
                      type="button"
                      onClick={() => setEventFormData({ ...eventFormData, published: !eventFormData.published })}
                      className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border transition-all ${
                        eventFormData.published
                          ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{eventFormData.published ? 'Published (Visible)' : 'Draft (Hidden)'}</span>
                    </button>
                  </div>
                </div>

                {/* Image URL (Drive / external link) */}
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Step 2 — Images</span>
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Event Images <span className="font-normal text-slate-500 dark:text-slate-500">(optional)</span>
                    </label>
                    {eventFormData.images.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                        {eventFormData.images.length} added
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste Image URL (Unsplash, Drive, Imgur...)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      Add URL
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Images are not stored on this server. Paste a public image link (Google Drive, Imgur, Unsplash...).
                  </p>

                  {/* Linked Images List */}
                  {eventFormData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {eventFormData.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden relative group border border-slate-200 dark:border-slate-800">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-md text-[10px]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEventFormOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEvent}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30"
                  >
                    {submittingEvent ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CATALOG MODAL --- */}
      <AnimatePresence>
        {isCatalogFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white">
                  {editingCatalogId ? 'Edit Catalog Service' : 'Add New Catalog Service'}
                </h3>
                <button
                  onClick={() => setIsCatalogFormOpen(false)}
                  className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {catalogFormError && (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{catalogFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCatalog} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={catalogFormData.title}
                    onChange={(e) => setCatalogFormData({ ...catalogFormData, title: e.target.value })}
                    placeholder="e.g. Audited Financials"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Subtext / Specification Details</label>
                  <input
                    type="text"
                    value={catalogFormData.subtext}
                    onChange={(e) => setCatalogFormData({ ...catalogFormData, subtext: e.target.value })}
                    placeholder="e.g. Annual with UDIN from QCR Rated Firm for Company"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Price (PKR) *</label>
                    <input
                      type="text"
                      required
                      value={catalogFormData.price}
                      onChange={(e) => setCatalogFormData({ ...catalogFormData, price: e.target.value })}
                      placeholder="e.g. PKR 150,000"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={catalogFormData.category}
                      onChange={(e) => setCatalogFormData({ ...catalogFormData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Taxation">Taxation</option>
                      <option value="Audit">Audit</option>
                      <option value="Legal">Legal</option>
                      <option value="Advisory">Advisory</option>
                      <option value="Accounting">Accounting</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCatalogFormOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCatalog}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30"
                  >
                    {submittingCatalog ? 'Saving...' : editingCatalogId ? 'Update Service' : 'Add Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODALS --- */}
      {deletingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Delete Event Announcement?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(deletingEventId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingCatalogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Delete Catalog Service?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">This service will be removed from your catalog.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCatalogId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCatalog(deletingCatalogId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
