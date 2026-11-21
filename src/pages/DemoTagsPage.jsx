import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, ExternalLink } from 'lucide-react';
import { GARMENTS } from '../data/garments';
import { useThreadTrail } from '../hooks/useThreadTrail';

export function DemoTagsPage() {
  const { t, lang } = useThreadTrail();

  const getTagUrl = (id) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}#/garment/${id}`;
  };

  return (
    <div className="demo-tags-page space-y-4">
      <div className="flex items-center justify-between gap-2 no-print">
        <Link
          to="/scan"
          className="inline-flex items-center gap-1.5 min-h-[40px] px-2 text-sm font-semibold text-[#2B3A67] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#233056]"
        >
          <Printer className="w-4 h-4 text-[#E9A820]" />
          <span>{t.demoTags.printNow}</span>
        </button>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.demoTags.title}</h1>
        <p className="text-sm text-[#2A2A2A]/75 mt-1">{t.demoTags.subtitle}</p>
      </div>

      <div className="demo-tags-grid grid grid-cols-2 gap-3 print-grid">
        {GARMENTS.map((g) => {
          const url = getTagUrl(g.id);
          return (
            <div
              key={g.id}
              className="garment-tag-card p-3.5 pt-5 flex flex-col items-center text-center gap-2.5"
            >
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#2B3A67]/60 tabular-nums">
                {g.brand} · {g.id}
              </div>

              <div className="p-2 bg-white rounded-xl border border-[#2B3A67]/15">
                <QRCodeSVG
                  value={url}
                  size={108}
                  bgColor="#FFFFFF"
                  fgColor="#2B3A67"
                  level="M"
                />
              </div>

              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-[#2B3A67] leading-snug">
                  {g.name[lang]}
                </div>
                <div className="text-[11px] text-[#2A2A2A]/65">{g.size}</div>
              </div>

              <Link
                to={`/garment/${g.id}`}
                className="no-print w-full min-h-[36px] mt-auto py-1.5 px-2 rounded-lg bg-[#FBF6EA] border border-[#2B3A67]/20 text-[11px] font-semibold text-[#2B3A67] inline-flex items-center justify-center gap-1 hover:bg-[#2B3A67]/5"
              >
                <span>{t.demoTags.scanThis}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
