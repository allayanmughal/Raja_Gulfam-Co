import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutFounder } from './components/AboutFounder';
import { ServicesGrid } from './components/ServicesGrid';
import { TaxCalculator } from './components/TaxCalculator';
import { TaxCalendar } from './components/TaxCalendar';
import { EventsGallery } from './components/events/EventsGallery';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CaseStudies } from './components/CaseStudies';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FAQPage } from './components/FAQPage';
import { TeamMembersPage } from './components/TeamMembersPage';
import { CatalogPage } from './components/CatalogPage';
import { NewsPage } from './components/NewsPage';
import type { Region, PageView } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<Region>('PK');

  // Auth state for Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const checkAuthStatus = async () => {
    setAuthChecking(true);
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setAdminEmail(data.admin?.username || 'Admin');
        setAdminId(data.admin?.id || '');
        setIsSuperAdmin(Boolean(data.admin?.isSuper));
      } else {
        setIsAuthenticated(false);
        setAdminEmail('');
        setAdminId('');
        setIsSuperAdmin(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setAdminId('');
      setIsSuperAdmin(false);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleNavigate('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    if (page === 'admin') {
      checkAuthStatus();
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    setSelectedServiceForBooking(undefined);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithService = (serviceTitle: string) => {
    setSelectedServiceForBooking(serviceTitle);
    setIsBookingOpen(true);
  };

  const scrollToCalculator = () => {
    if (currentPage !== 'home') {
      handleNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('calculator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors">

      {/* Floating Header Navbar (Hidden on full admin view) */}
      {currentPage !== 'admin' && (
        <Header
          onOpenBooking={handleOpenBooking}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}

      <main>
        {currentPage === 'home' && (
          <>
            {/* Spacious Hero */}
            <Hero
              onOpenBooking={handleOpenBooking}
              onOpenCalculator={scrollToCalculator}
              selectedRegion={selectedRegion}
            />

            {/* Core Services */}
            <ServicesGrid
              onOpenBookingWithService={handleOpenBookingWithService}
              selectedRegion={selectedRegion}
              onNavigateCatalog={() => handleNavigate('catalog')}
            />

            {/* DYNAMIC EVENTS, NEWS & UPDATES PREVIEW (latest 2) */}
            <div id="news">
              <EventsGallery
                limit={2}
                onViewAll={() => handleNavigate('news')}
              />
            </div>

            {/* Tax Deadlines Radar */}
            <TaxCalendar />

            {/* Proven Case Studies */}
            <CaseStudies onOpenBooking={handleOpenBooking} />

            {/* Founder Spotlight */}
            <AboutFounder onOpenBooking={handleOpenBooking} />

            {/* Interactive Tax Estimator */}
            <TaxCalculator onOpenBooking={handleOpenBooking} />

            {/* Contact Section */}
            <ContactSection />
          </>
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenBookingWithService={handleOpenBookingWithService}
          />
        )}

        {currentPage === 'news' && (
          <NewsPage onNavigateHome={() => handleNavigate('home')} />
        )}

        {currentPage === 'faqs' && (
          <FAQPage
            onOpenBooking={handleOpenBooking}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'team' && (
          <TeamMembersPage
            onOpenBooking={handleOpenBooking}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {/* ADMIN SECTION (PROTECTED SERVER-SIDE AUTH) */}
        {currentPage === 'admin' && (
          <>
            {authChecking ? (
              <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <p className="text-xs text-slate-400 font-bold">Verifying secure admin authentication...</p>
              </div>
            ) : isAuthenticated ? (
              <AdminDashboard
                adminEmail={adminEmail}
                adminId={adminId}
                isSuperAdmin={isSuperAdmin}
                onLogout={() => {
                  setIsAuthenticated(false);
                  setAdminEmail('');
                  setAdminId('');
                  setIsSuperAdmin(false);
                }}
                onNavigateHome={() => handleNavigate('home')}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={() => {
                  checkAuthStatus();
                }}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (Hidden on full admin view) */}
      {currentPage !== 'admin' && (
        <Footer
          onOpenBooking={handleOpenBooking}
          onNavigate={handleNavigate}
        />
      )}

      {/* Booking Appointment Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedServiceForBooking}
      />

    </div>
  );
}

export default App;
