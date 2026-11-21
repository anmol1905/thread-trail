import { Link, useLocation } from 'react-router-dom';
import { Home, QrCode, MapPin, ShoppingBag, Route as RouteIcon } from 'lucide-react';
import { Logo } from './Logo';
import { JourneyProgress } from './JourneyProgress';
import { useThreadTrail } from '../hooks/useThreadTrail';

export function AppShell({ children }) {
  const { pathname } = useLocation();
  const { state, t, lang, toggleLanguage } = useThreadTrail();
  const bagCount = state.bagItems.length;

  const tabs = [
    { to: '/', label: t.nav.home, icon: Home, match: (p) => p === '/' },
    {
      to: '/scan',
      label: t.nav.scan,
      icon: QrCode,
      match: (p) => p.startsWith('/scan') || p.startsWith('/demo-tags') || p.startsWith('/garment'),
    },
    { to: '/partners', label: t.nav.partners, icon: MapPin, match: (p) => p.startsWith('/partners') },
    { to: '/bag', label: t.nav.bag, icon: ShoppingBag, badge: bagCount, match: (p) => p.startsWith('/bag') },
    { to: '/track', label: t.nav.track, icon: RouteIcon, match: (p) => p.startsWith('/track') },
  ];

  return (
    <div className="textile-backdrop min-h-screen w-full flex justify-center bg-[#E7DEC9] sm:py-4">
      {/* Centered phone-width mobile-first container */}
      <div className="app-canvas w-full max-w-[1180px] min-h-screen lg:min-h-[calc(100vh-2rem)] lg:rounded-[28px] lg:border lg:border-[#2B3A67]/15 lg:shadow-xl bg-[#FBF6EA] ajrakh-subtle-bg flex flex-col relative overflow-x-clip">
        {/* Top Ajrakh hairline accent strip */}
        <div className="h-1.5 w-full ajrakh-border shrink-0 no-print" aria-hidden="true" />

        {/* Compact sticky mobile header (52px) */}
        <header className="app-header sticky top-0 z-30 h-[52px] px-4 bg-[#FBF6EA]/95 backdrop-blur-md border-b border-[#2B3A67]/12 flex items-center justify-between gap-4 no-print">
          <Link to="/" aria-label="ThreadTrail Home" className="focus-visible:outline-2 focus-visible:outline-[#2B3A67] rounded-lg">
            <Logo compact />
          </Link>

          <span className="demo-mode-badge hidden md:inline-flex">{t.common.demoMode}</span>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={lang === 'en' ? 'Switch language to Hindi' : 'भाषा अंग्रेजी में बदलें'}
            className="min-h-[38px] px-2.5 py-1 rounded-lg border border-[#2B3A67]/25 bg-[#FFFDF8] text-xs font-semibold text-[#2B3A67] flex items-center gap-1.5 hover:bg-[#2B3A67]/5 active:scale-95 transition-transform whitespace-nowrap shrink-0"
          >
            <span className={lang === 'en' ? 'text-[#2B3A67] underline decoration-[#E9A820] decoration-2 underline-offset-4' : 'text-[#2A2A2A]/50'}>
              EN
            </span>
            <span className="text-[#2B3A67]/30" aria-hidden="true">/</span>
            <span className={lang === 'hi' ? 'text-[#2B3A67] underline decoration-[#E9A820] decoration-2 underline-offset-4' : 'text-[#2A2A2A]/50'}>
              हिं
            </span>
          </button>
        </header>

        <div className="craft-ribbon sticky top-[52px] z-20 no-print" aria-hidden="true" />

        {/* Bottom tabs on mobile; sticky horizontal navigation on larger screens. */}
        <nav
          aria-label="Primary navigation"
          className="woven-nav primary-nav no-print"
        >
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={`relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
                  active ? 'text-[#2B3A67] font-semibold' : 'text-[#2A2A2A]/60 hover:text-[#2B3A67]'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-[21px] h-[21px] transition-transform ${
                      active ? 'scale-105 stroke-[2.3]' : 'stroke-[1.8]'
                    }`}
                  />
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span
                      aria-label={`${tab.badge} items in bag`}
                      className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C65D3B] text-[#FBF6EA] text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm"
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="nav-label text-[11px] leading-none tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
                {active && (
                  <span
                    className="nav-active-mark w-4 h-0.5 rounded-full bg-[#E9A820] mt-0.5"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Main scrollable content */}
        <main className="app-content flex-1 px-4 pt-4 pb-24">
          <JourneyProgress />
          {children}
        </main>
      </div>
    </div>
  );
}
