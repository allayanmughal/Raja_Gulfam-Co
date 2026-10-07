import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactSection: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-3 max-w-xl mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Get in Touch
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Contact Raja Gulfam & Co.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Visit our head office in Abbottabad or reach out via email and phone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Abbottabad Head Office</h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Physical Location</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                      Office # 108, 1st Floor, Iqbal Shopping Complex, The Mall, Abbottabad, KPK, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Phone & Helpline</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-1">+92 334 8972072</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Direct WhatsApp & Call</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Verified Email Address</h4>
                    <a href="mailto:Rajagulfamandco@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                      Rajagulfamandco@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/923348972072"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+92 334 8972072)</span>
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Send a Direct Message</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Directly routed to Raja Gulfam Kayani desk.</p>
              </div>

              {!formSent ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Tariq"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="tariq@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 312 0000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Inquiry Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your tax, audit, or SECP legal requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto" />
                  <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Inquiry Received!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Thank you {formData.name}. Raja Gulfam & Co. will respond shortly.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
