import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThreadTrailProvider } from './context/ThreadTrailContext';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { DemoTagsPage } from './pages/DemoTagsPage';
import { PassportPage } from './pages/PassportPage';
import { PartnersPage } from './pages/PartnersPage';
import { BagPage } from './pages/BagPage';
import { TrackListPage } from './pages/TrackListPage';
import { TrackerPage } from './pages/TrackerPage';
import { RewardsPage } from './pages/RewardsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThreadTrailProvider>
      <HashRouter>
        <ScrollToTop />
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/demo-tags" element={<DemoTagsPage />} />
            <Route path="/garment/:id" element={<PassportPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/track" element={<TrackListPage />} />
            <Route path="/track/:id" element={<TrackerPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ThreadTrailProvider>
  );
}
