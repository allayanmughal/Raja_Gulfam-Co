import React, { useEffect, useState } from 'react';
import type { EventItem, CreateEventInput } from '../../types/event';
import { TemplateSelector } from './TemplateSelector';
import {
  LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Search,
  CheckCircle, FileText, Layout, Upload, X, AlertCircle, RefreshCw,
  Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  adminEmail: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ adminEmail, onLogout, onNavigateHome }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'drafts'>('all');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    priorityDetail: '',
    description: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
    template: 'template1',
    published: true
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/events', { credentials: 'include' });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Failed to fetch admin events');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Open Form for Adding New Event
  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      priorityDetail: '',
      description: '',
      images: [
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200'
      ],
      date: new Date().toISOString().split('T')[0],
      template: 'template1',
      published: true
    });
    setImageUrlInput('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Event
  const handleOpenEditModal = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setFormData({
      title: evt.title,
      priorityDetail: evt.priorityDetail,
      description: evt.description,
      images: [...evt.images],
      date: evt.date,
      template: evt.template,
      published: evt.published
    });
    setImageUrlInput('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Handle Image File Upload via /api/admin/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFormError(null);

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
      } else {
        setFormError(data.error || 'Failed to upload image(s)');
      }
    } catch (err: any) {
      setFormError('Image upload failed. Ensure backend server is running.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Save Event (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.priorityDetail.trim() || !formData.description.trim()) {
      setFormError('Title, High-Priority Short Detail, and Description are required.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const endpoint = editingEventId ? `/api/admin/events/${editingEventId}` : '/api/admin/events';
      const method = editingEventId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsFormOpen(false);
        fetchEvents();
      } else {
        setFormError(data.error || 'Failed to save event.');
      }
    } catch (err: any) {
      setFormError('Save operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Publish Status Quick Action
  const handleTogglePublish = async (evt: EventItem) => {
    try {
      const res = await fetch(`/api/admin/events/${evt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ published: !evt.published })
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Event Action
  const handleDeleteConfirm = async () => {
    if (!deletingEventId) return;
    try {
      const res = await fetch(`/api/admin/events/${deletingEventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setDeletingEventId(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Secure Logout
  const handleLogoutClick = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error(err);
    } finally {
      onLogout();
    }
  };

  // Filtering Events List
  const filteredEvents = events.filter(evt => {
    const matchesTab = filterTab === 'all' || (filterTab === 'published' && evt.published) || (filterTab === 'drafts' && !evt.published);
    const q = searchQuery.toLowerCase();
    const matchesSearch = evt.title.toLowerCase().includes(q) || evt.priorityDetail.toLowerCase().includes(q) || evt.description.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const totalEvents = events.length;
  const publishedCount = events.filter(e => e.published).length;
  const draftCount = events.filter(e => !e.published).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-20 pb-16 px-4 sm:px-8">

      {/* Top Navbar Bar */}
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-heading font-extrabold text-xl shadow-inner">
              RGC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-extrabold text-white">
                  Events & News Admin Control Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure Auth
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as: <strong className="text-slate-200">{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Public Website
            </button>

            <button
              onClick={fetchEvents}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Total Events</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-heading text-3xl font-black text-white">{totalEvents}</p>
            <p className="text-[11px] text-slate-500">All managed items in database</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Published Live</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-heading text-3xl font-black text-emerald-400">{publishedCount}</p>
            <p className="text-[11px] text-slate-500">Visible on public frontend gallery</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Draft / Unpublished</span>
              <EyeOff className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-heading text-3xl font-black text-amber-400">{draftCount}</p>
            <p className="text-[11px] text-slate-500">Hidden from public website</p>
          </div>
        </div>

        {/* Action Bar & Filtering Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All ({totalEvents})
            </button>
            <button
              onClick={() => setFilterTab('published')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterTab === 'published' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setFilterTab('drafts')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterTab === 'drafts' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search & Add button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event / News</span>
            </button>
          </div>

        </div>

        {/* Events Data Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-semibold">Loading admin data...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No events found</p>
              <p className="text-xs text-slate-500">Click "Create Event / News" above to add your first item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Event & High-Priority Detail</th>
                    <th className="py-4 px-4">Template</th>
                    <th className="py-4 px-4">Event Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">

                      {/* Event Title & Red Priority Detail */}
                      <td className="py-4 px-6 space-y-1">
                        <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/80 text-rose-400 text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{evt.priorityDetail}</span>
                        </div>
                      </td>

                      {/* Template Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 font-extrabold text-[11px]">
                          {evt.template.toUpperCase()}
                        </span>
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-300">
                        {evt.date}
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(evt)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border transition-all ${evt.published
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                              : 'bg-amber-950/80 text-amber-400 border-amber-800 hover:bg-amber-900'
                            }`}
                        >
                          {evt.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{evt.published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(evt)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingEventId(evt.id)}
                          className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-900/50 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* --- ADD / EDIT EVENT MODAL --- */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {editingEventId ? 'Edit Event / News Item' : 'Create New Event / News Item'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEvent} className="space-y-6">

                {/* Title & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase">
                      Event Heading / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual Statutory Tax & Regulatory Summit 2026"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* HIGH-PRIORITY SHORT DETAIL (RED PREVIEW) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-rose-400 uppercase flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>High-Priority Short Detail (Displayed in RED) *</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Displayed prominently in red banner/text</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. URGENT: FBR & SECP Q3 Corporate Filing Deadline — September 15"
                    value={formData.priorityDetail}
                    onChange={(e) => setFormData({ ...formData, priorityDetail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-rose-900/60 text-sm text-rose-300 focus:border-rose-500 focus:outline-none"
                  />
                  {/* Real-time RED preview */}
                  {formData.priorityDetail && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs font-bold flex items-center gap-2">
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-rose-900 text-rose-200">Red Preview</span>
                      <span>{formData.priorityDetail}</span>
                    </div>
                  )}
                </div>

                {/* Full Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Full Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed information regarding the event, agenda, speakers, regulatory notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Image Upload & Management */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
                    <span>Event Images (One or Multiple)</span>
                    <span className="text-[10px] text-slate-400">Upload files or paste URLs</span>
                  </label>

                  {/* Upload Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* File Upload Dropzone Button */}
                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500 cursor-pointer transition-colors text-xs text-slate-300 font-bold">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File(s)'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>

                    {/* Image URL Input */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail List */}
                  {formData.images.length > 0 && (
                    <div className="flex items-center gap-3 overflow-x-auto pt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-700 group shrink-0">
                          <img src={img} alt={`uploaded ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* TEMPLATE SELECTION WITH VISUAL PREVIEWS */}
                <TemplateSelector
                  selectedTemplate={formData.template}
                  onChange={(t) => setFormData({ ...formData, template: t })}
                />

                {/* Publish Toggle */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white">Publish Status</span>
                    <p className="text-[11px] text-slate-400">
                      When published, this event will instantly appear in the live website gallery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, published: !formData.published })}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${formData.published
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                  >
                    {formData.published ? 'Published (Live)' : 'Draft (Hidden)'}
                  </button>
                </div>

                {/* Submit Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-extrabold text-white shadow-lg shadow-blue-600/20"
                  >
                    {submitting ? 'Saving Event...' : editingEventId ? 'Update Event' : 'Publish New Event'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingEventId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-white">Permanently Delete Event?</h3>
                <p className="text-xs text-slate-400">
                  This action cannot be undone. The item will be permanently removed from the database.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingEventId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
