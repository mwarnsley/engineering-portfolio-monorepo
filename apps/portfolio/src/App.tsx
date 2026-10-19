import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from '@/Portfolio';
import { Navigation } from '@/components/shared/Navigation';
import { TestMatrixModal } from '@/components/shared/TestMatrixModal';
import { Footer } from '@/components/shared/Footer';

const DemoPage = lazy(() =>
  import('@/pages/DemoPage').then((module) => ({ default: module.DemoPage }))
);
const TerritoryTrapPrivacyPage = lazy(() =>
  import('@/pages/TerritoryTrapPrivacyPage').then((module) => ({
    default: module.TerritoryTrapPrivacyPage,
  }))
);
const TerritoryTrapSupportPage = lazy(() =>
  import('@/pages/TerritoryTrapSupportPage').then((module) => ({
    default: module.TerritoryTrapSupportPage,
  }))
);

export default function App() {
  const [isTestMatrixOpen, setIsTestMatrixOpen] = useState(false);
  const openTestMatrix = useCallback(() => setIsTestMatrixOpen(true), []);
  const closeTestMatrix = useCallback(() => setIsTestMatrixOpen(false), []);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-brand-foreground font-sans">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>

          <Navigation theme={theme} toggleTheme={toggleTheme} onOpenTestMatrix={openTestMatrix} />

          <main id="main-content" className="relative pt-16">
            <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/demo/:slug" element={<DemoPage />} />
                <Route path="/territory-trap/privacy" element={<TerritoryTrapPrivacyPage />} />
                <Route path="/territory-trap/support" element={<TerritoryTrapSupportPage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
          <TestMatrixModal isOpen={isTestMatrixOpen} onClose={closeTestMatrix} />
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
}
