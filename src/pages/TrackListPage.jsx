import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, QrCode, ChevronRight } from 'lucide-react';
import { useThreadTrail } from '../hooks/useThreadTrail';

export function TrackListPage() {
  const { state, t } = useThreadTrail();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.track.listTitle}</h1>
        <p className="text-xs text-[#2A2A2A]/75 mt-1">{t.track.listSubtitle}</p>
      </div>

      {state.pickups.length === 0 ? (
        <div className="garment-tag-card p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2B3A67]/8 text-[#2B3A67] flex items-center justify-center">
            <PackageCheck className="w-8 h-8 text-[#1F8A87]" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-[#2B3A67]">
              {t.track.emptyTitle}
            </h2>
            <p className="text-xs text-[#2A2A2A]/75 leading-relaxed">
              {t.track.emptyDesc}
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-semibold"
          >
            <QrCode className="w-4 h-4 text-[#E9A820]" />
            <span>{t.track.startScan}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {state.pickups.map((pickup) => {
            const stepIdx = Math.min(5, Math.floor((now - pickup.createdAt) / 5000));
            const isComplete = stepIdx === 5;
            return (
              <Link
                key={pickup.id}
                to={`/track/${pickup.id}`}
                className="garment-tag-card block p-4 pr-7 hover:border-[#2B3A67]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#1F8A87] tabular-nums">
                      {pickup.id} · {t.track.steps[stepIdx]}
                    </div>
                    <div className="font-display text-base font-bold text-[#2B3A67]">
                      {pickup.partnerName}
                    </div>
                    <div className="text-xs text-[#2A2A2A]/70 tabular-nums">
                      {pickup.items.length}{' '}
                      {pickup.items.length === 1 ? t.common.item : t.common.items} ·{' '}
                      {pickup.totalWeightKg} {t.common.kg} ·{' '}
                      {t.bag.dates[pickup.dateKey]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isComplete ? 'bg-[#1F8A87]' : 'bg-[#E9A820] animate-pulse'
                      }`}
                      aria-hidden="true"
                    />
                    <ChevronRight className="w-4 h-4 text-[#2B3A67]/60" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
