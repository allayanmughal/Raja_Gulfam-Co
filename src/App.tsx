import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutFounder } from './components/AboutFounder';
import { ServicesGrid } from './components/ServicesGrid';
import { TaxCalculator } from './components/TaxCalculator';
import { TaxCalendar } from './components/TaxCalendar';
import { CaseStudies } from './components/CaseStudies';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FAQPage } from './components/FAQPage';
import { TeamMembersPage } from './components/TeamMembersPage';
import type { Region } from './types';

type PageView = 'home' | 'faqs' | 'team';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<Region>('PK');

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
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

  const scrollToServices = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNews = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('news');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('news');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
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

      {/* Floating Header Navbar */}
      <Header
        onOpenBooking={handleOpenBooking}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onScrollToServices={scrollToServices}
        onScrollToNews={scrollToNews}
      />

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
            />

            {/* Statutory Compliance News & Calendar Radar */}
            <div id="news">
              <TaxCalendar />
            </div>

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
      </main>

      {/* Clean Minimal Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onNavigate={handleNavigate}
      />

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

