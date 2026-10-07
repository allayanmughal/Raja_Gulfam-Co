import React, { useCallback, useEffect, useState } from 'react';
import type { AdminRole, AdminUser } from '../../types';
import {
  Users, Plus, Edit2, Trash2, KeyRound, Search,
  AlertCircle, RefreshCw, UserCheck, UserX, X, Mail, Clock, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  currentAdminId: string;
  onSessionEnded: () => void;
}

const EMPTY_FORM = { username: '', password: '', role: 'admin' as AdminRole, isActive: true };

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500';
const labelCls = 'block text-xs font-bold text-slate-700 dark:text-slate-300';
const fieldCls = 'space-y-1.5';
const alertCls =
  'p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2';

const formatDate = (value: string | null) => {
  if (!value) return 'Never';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Never' : d.toLocaleString();
};

export const AdminUsersPanel: React.FC<Props> = ({ currentAdminId, onSessionEnded }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  // Plain-text passwords exist only here, in the super admin's browser, at the
  // moment they are set. The server never stores or returns them.
  const [issued, setIssued] = useState<{ username: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers/contexts where the async clipboard API is blocked.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handle401 = useCallback(() => {
    setError('Your session has expired. Please sign in again.');
    onSessionEnded();
  }, [onSessionEnded]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/admins', { credentials: 'include' });
      if (res.status === 401) return handle401();
      const data = await res.json();
      if (data.success) setAdmins(data.admins || []);
      else setError(data.error || 'Could not load admin users.');
    } catch {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [handle401]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filtered = admins.filter((a) =>
    a.username.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIssued(null);
    setFormOpen(true);
  };

  const openEdit = (admin: AdminUser) => {
    setEditingId(admin.id);
    setForm({ username: admin.username, password: '', role: admin.role, isActive: admin.isActive });
    setFormError(null);
    setFormOpen(true);
  };

  const saveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const isEdit = Boolean(editingId);
      const res = await fetch(isEdit ? `/api/admin/admins/${editingId}` : '/api/admin/admins', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.status === 401) return handle401();

      if (res.ok && data.success) {
        setFormOpen(false);
        // Surface the credentials once so the super admin can send them on.
        if (!isEdit && form.password) {
          setIssued({ username: form.username.trim(), password: form.password });
        }
        // Changing your own credentials ends the session by design.
        const self = admins.find((a) => a.id === currentAdminId);
        if (editingId === currentAdminId && (form.password || form.username !== self?.username)) {
          onSessionEnded();
          return;
        }
        fetchAdmins();
      } else {
        setFormError(data.error || 'Failed to save admin user.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.status === 401) return handle401();
      setDeletingId(null);
      if (!(res.ok && data.success)) setError(data.error || 'Failed to delete admin user.');
      else fetchAdmins();
    } catch {
      setError('Network error. Please try again.');
      setDeletingId(null);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    setPwError(null);
    try {
      const res = await fetch('/api/admin/admins/me/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword
        })
      });
      const data = await res.json();
      if (res.status === 401) return handle401();
      if (res.ok && data.success) {
        setPwOpen(false);
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onSessionEnded();
      } else {
        setPwError(data.error || 'Failed to change password.');
      }
    } catch {
      setPwError('Network error. Please try again.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admin users by email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setPwOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change My Password</span>
          </button>
          <button
            onClick={openAdd}
            className="sm:ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className={alertCls}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Newly issued credentials — shown once so the super admin can pass them on */}
      {issued && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-blue-900 dark:text-blue-300">
                Credentials for {issued.username}
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                Copy and send these now. The password is hashed and cannot be shown again.
              </p>
            </div>
            <button
              onClick={() => setIssued(null)}
              className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-800 break-all">
              {issued.username}
            </div>
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-800 break-all">
              {issued.password}
            </div>
          </div>

          <button
            onClick={() => copyText(`Email: ${issued.username}\nPassword: ${issued.password}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
          </button>
        </div>
      )}

      {/* Admin list */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-600 dark:text-slate-400">Loading admin users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-2">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No admin users found</p>
          <p className="text-xs text-slate-600 dark:text-slate-500">Use the "Add Admin" button above to create one.</p>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800/70 overflow-hidden shadow-xl">
          {filtered.map((admin) => {
            const isSelf = admin.id === currentAdminId;
            return (
              <div
                key={admin.id}
                className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    admin.isActive
                      ? 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}>
                    {admin.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {admin.username}
                      </p>
                      {isSelf && (
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Last login: {formatDate(admin.lastLoginAt)}
                    </p>
                  </div>
                </div>


                <span className={`shrink-0 w-fit px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  admin.role === 'viewer'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                }`}>
                  {admin.role}
                </span>

                <span className={`shrink-0 w-fit px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  admin.isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}>
                  {admin.isActive ? 'Active' : 'Disabled'}
                </span>

                <div className="shrink-0 flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(admin)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 text-slate-700 dark:text-slate-200 hover:text-white transition-colors"
                    title={`Edit ${admin.username}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="sr-only">Edit {admin.username}</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(admin.id)}
                    disabled={isSelf}
                    className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title={isSelf ? 'You cannot delete your own account' : `Delete ${admin.username}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sr-only">Delete {admin.username}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg my-4 max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 relative"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white">
                  {editingId ? 'Edit Admin User' : 'Add Admin User'}
                </h3>
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className={alertCls}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={saveAdmin} className="space-y-4">
                <div className={fieldCls}>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    required
                    // Never let the browser drop your own saved identity into
                    // the account you are creating/editing.
                    autoComplete="off"
                    name="rgc-admin-email"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="name@rajagulfam.com"
                    className={inputCls}
                  />
                </div>

                <div className={fieldCls}>
                  <label className={labelCls}>
                    {editingId ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    // `new-password` stops the browser replaying *your* login
                    // password into another account's credential field.
                    autoComplete="new-password"
                    name="rgc-admin-new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 chars, 1 letter + 1 number"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={fieldCls}>
                    <label className={labelCls}>Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                      className={inputCls}
                    >
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>

                  {editingId && (
                    <div className={fieldCls}>
                      <label className={labelCls}>Account Status</label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, isActive: !form.isActive })}
                        className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border transition-all ${
                          form.isActive
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {form.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        <span>{form.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change own password modal */}
      <AnimatePresence>
        {pwOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md my-4 max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 relative"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white">Change My Password</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    You will be signed out after changing it.
                  </p>
                </div>
                <button
                  onClick={() => setPwOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pwError && (
                <div className={alertCls}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}

              <form onSubmit={changePassword} className="space-y-4">
                {([
                  ['currentPassword', 'Current Password *', '', 'current-password'],
                  ['newPassword', 'New Password *', 'Min. 8 chars, 1 letter + 1 number', 'new-password'],
                  ['confirmPassword', 'Confirm New Password *', '', 'new-password'],
                ] as const).map(([key, label, placeholder, autoComplete]) => (
                  <div className={fieldCls} key={key}>
                    <label className={labelCls}>{label}</label>
                    <input
                      type="password"
                      required
                      autoComplete={autoComplete}
                      name={`rgc-${key}`}
                      value={pwForm[key]}
                      onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={inputCls}
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPwOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30"
                  >
                    {pwSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl"
            >
              <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
              <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Delete Admin User?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {admins.find((a) => a.id === deletingId)?.username} will lose access immediately. This cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeAdmin(deletingId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


