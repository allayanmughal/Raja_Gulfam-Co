import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

// Raja Gulfam & Co. direct WhatsApp desk (international format, no "+" or spaces).
const WHATSAPP_NUMBER = '923348972072';

/** Turn the <input type="date"> value (YYYY-MM-DD) into something readable. */
const formatPreferredDate = (value: string) => {
  if (!value) return 'Earliest Available';
  // Anchor to local midnight so the day never slips backwards on UTC offsets.
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedService, setSelectedService] = useState(initialService || 'FBR & Global Taxation Advisory');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Pakistan (FBR)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Open WhatsApp synchronously inside the click gesture — doing this after an
    // await would trip browser popup blockers and silently do nothing.
    openWhatsApp();

    setSubmitted(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  /** Every field the customer filled in, laid out for WhatsApp (which renders *bold*). */
  const buildWhatsAppMessage = () => {
    const lines = [
      '*New Consultation Request*',
      '_Raja Gulfam & Co. — Website Booking Form_',
      '',
      '*Client Details*',
      `Name: ${fullName || 'N/A'}`,
      `Email: ${email || 'N/A'}`,
      `Phone: ${phone || 'N/A'}`,
    ];

    // Only list optional fields the customer actually filled in.
    if (businessName.trim()) lines.push(`Company: ${businessName.trim()}`);

    lines.push(
      '',
      '*Consultation Details*',
      `Service: ${selectedService}`,
      `Jurisdiction: ${jurisdiction}`,
      `Preferred Date: ${formatPreferredDate(preferredDate)}`,
      `Preferred Time: ${preferredTime}`,
      '',
      '*Requirements / Questions*',
      notes.trim() || 'No additional details provided.',
      '',
      '_Sent from the Raja Gulfam & Co. website_'
    );

    return lines.join('\n');
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>100% Confidential Consultation</span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Book Consultation with <span className="text-blue-600 dark:text-blue-400">Raja Gulfam Kayani</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Chartered Management Accountant & Advocate High Court
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center space-x-2 text-xs font-bold border-b border-slate-200 dark:border-white/10 pb-4">
              <span className={`px-3 py-1 rounded-lg ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                1. Service & Date
              </span>
              <span className="text-slate-400">/</span>
              <span className={`px-3 py-1 rounded-lg ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                2. Contact Details
              </span>
            </div>

            {/* Step 1 Fields */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Practice Area / Service:</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  >
                    <option value="FBR & Global Taxation Advisory">FBR & Global Taxation Advisory</option>
                    <option value="Statutory Audit & Assurance">Statutory Audit & Assurance</option>
                    <option value="SECP Legal & Corporate Advisory">SECP Legal & Corporate Advisory</option>
                    <option value="Virtual CFO & Financial Strategy">Virtual CFO & Financial Strategy</option>
                    <option value="Forensic Accounting & Fraud Investigation">Forensic Accounting & Fraud Investigation</option>
                    <option value="Cloud Bookkeeping & ERP Systems">Cloud Bookkeeping & ERP Systems</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Region / Jurisdiction:</label>
                    <select
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    >
                      <option value="Pakistan (FBR & SECP)">Pakistan (FBR & SECP)</option>
                      <option value="United Kingdom (HMRC)">United Kingdom (HMRC)</option>
                      <option value="United States (IRS)">United States (IRS)</option>
                      <option value="Gulf / UAE (Corporate Tax & VAT)">Gulf / UAE (Corporate Tax & VAT)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Consultation Date:</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Time Slot:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['11:00 AM', '03:00 PM', '06:00 PM'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setPreferredTime(t)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          preferredTime === t
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Continue to Contact Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 Fields */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ali@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company / Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Enterprises Pvt Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brief Overview of Requirements / Questions:</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your tax, audit, or SECP legal requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Consultation Request</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
                Your Details Are Ready to Send
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                WhatsApp should have opened in a new tab with your booking details filled in, addressed to <strong className="text-slate-900 dark:text-white">Raja Gulfam Kayani</strong>'s desk. Just press <strong className="text-slate-900 dark:text-white">Send</strong> to deliver it.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-3 shadow-xs">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Didn't open, or the message looked wrong?</p>
              <button
                onClick={openWhatsApp}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Message Again</span>
              </button>
            </div>

            <button
              onClick={resetAndClose}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
