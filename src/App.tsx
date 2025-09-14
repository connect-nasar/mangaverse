import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllMangaPage from './pages/AllMangaPage';
import MangaDetailsPage from './pages/MangaDetailsPage';
import ChapterReaderPage from './pages/ChapterReaderPage';
import AdminPanel from './pages/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function AppLayout() {
  const location = useLocation();
  // Hide header on chapter reader page
  const hideHeader = /^\/manga\/[^/]+\/chapter\/[^/]+$/.test(location.pathname);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!hideHeader && <Header />}
      <main className={!hideHeader ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-manga" element={<AllMangaPage />} />
          <Route path="/manga/:id" element={<MangaDetailsPage />} />
          <Route path="/manga/:id/chapter/:chapterId" element={<ChapterReaderPage />} />
          <Route path="/nbhwgbfug" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <AppLayout />
          </Router>
        </DataProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;