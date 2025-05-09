import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar.tsx';
import Footer from '@/components/layout/Footer.tsx';
import ScrollToTop from '@/components/layout/ScrollToTop.tsx';
import LandingPage from '@/pages/LandingPage.tsx';
import LeaderboardPage from '@/pages/LeaderboardPage.tsx';
import FavoritesPage from '@/pages/FavoritesPage.tsx';
import AccountPage from '@/pages/AccountPage.tsx';
import TokenDetailsPage from '@/pages/TokenDetailsPage.tsx';
import NotFoundPage from '@/pages/NotFoundPage.tsx'; // Importer la nouvelle page
import { Toaster } from '@/components/ui/sonner.tsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/token/:tokenId" element={<TokenDetailsPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Route 404 - doit être la dernière */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
