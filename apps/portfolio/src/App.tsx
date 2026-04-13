import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from './Portfolio';
import { Navigation } from './components/shared/Navigation';
import { Footer } from './components/shared/Footer';
import { DemoPage } from './pages/DemoPage';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
        <Navigation
          theme={theme}
          toggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        />

        <main className="relative z-10 pt-20">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/demo/:slug" element={<DemoPage />} />
          </Routes>
        </main>

        <Footer />
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>
    </BrowserRouter>
  );
}
