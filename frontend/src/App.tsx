import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.tsx'; // Import Navbar
import LandingPage from './pages/LandingPage.tsx';
import LeaderboardPage from './pages/LeaderboardPage.tsx';
import FavoritesPage from './pages/FavoritesPage.tsx';
import AccountPage from './pages/AccountPage.tsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar /> {/* Add Navbar here */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* About/Landing Page */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* You can add a 404 Not Found route here later */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      {/* Optional: Footer component can go here */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
