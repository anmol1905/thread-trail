import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, CameraOff, Search, Printer, ArrowRight, QrCode } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { GARMENTS, getGarmentById } from '../data/garments';
import { useThreadTrail } from '../hooks/useThreadTrail';
import { GarmentIllustration } from '../components/GarmentIllustration';
import { StitchDivider } from '../components/StitchDivider';

function extractGarmentId(rawText) {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  // Support full URLs like https://.../garment/G001 or #/garment/G001 or plain G001
  const match = trimmed.match(/(?:garment\/|^)(G00[1-6]|G\d{3})/i);
  if (match && match[1]) {
    return match[1].toUpperCase();
  }
  const direct = getGarmentById(trimmed);
  return direct ? direct.id : null;
}

export function ScanPage() {
  const navigate = useNavigate();
  const { t, lang } = useThreadTrail();

  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const scannerRef = useRef(null);
  const readerId = 'tt-qr-reader';

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // Ignore cleanup error
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch {
          // Ignore unmount error
        }
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(false);
    setCameraActive(true);

    // Wait a tick for #tt-qr-reader container to mount cleanly
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode(readerId);
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 210, height: 210 } },
          (decodedText) => {
            const foundId = extractGarmentId(decodedText);
            if (foundId && getGarmentById(foundId)) {
              stopCamera();
              navigate(`/garment/${foundId}`);
            }
          },
          () => {
            // Ignore per-frame decode misses
          }
        );
      } catch {
        setCameraError(true);
        setCameraActive(false);
      }
    }, 80);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const id = extractGarmentId(manualInput);
    if (id && getGarmentById(id)) {
      setManualError('');
      navigate(`/garment/${id}`);
    } else {
      setManualError(t.scan.invalidCode);
    }
  };

  return (
    <div className="scan-page space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{t.scan.title}</h1>
        <p className="text-sm text-[#2A2A2A]/75 mt-1">{t.scan.subtitle}</p>
      </div>

      {/* Real Camera QR Scanner Card with Graceful Fallback */}
      <section className="garment-tag-card p-4 space-y-3">
        <div className="flex items-center justify-between pr-5">
          <div className="flex items-center gap-2 font-semibold text-sm text-[#2B3A67]">
            <Camera className="w-4 h-4 text-[#1F8A87]" />
            <span>{t.scan.cameraTitle}</span>
          </div>
        </div>

        {cameraActive && (
          <div className="space-y-2">
            <div
              id={readerId}
              className="w-full min-h-[240px] rounded-xl overflow-hidden bg-[#2B3A67]/10 border border-[#2B3A67]/20"
            />
            <p className="text-xs text-center text-[#2A2A2A]/70">{t.scan.cameraHint}</p>
          </div>
        )}

        {cameraError && (
          <div className="rounded-xl bg-[#C65D3B]/10 border border-[#C65D3B]/30 p-3 flex items-start gap-2.5 text-xs text-[#8C3418]">
            <CameraOff className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t.scan.cameraUnavailable}</span>
          </div>
        )}

        <button
          type="button"
          onClick={cameraActive ? stopCamera : startCamera}
          className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            cameraActive
              ? 'bg-[#C65D3B] text-[#FBF6EA]'
              : 'bg-[#2B3A67] text-[#FBF6EA] hover:bg-[#233056]'
          }`}
        >
          {cameraActive ? <CameraOff className="w-4 h-4" /> : <QrCode className="w-4 h-4 text-[#E9A820]" />}
          <span>{cameraActive ? t.scan.stopCamera : t.scan.startCamera}</span>
        </button>

        {/* Manual Code Input */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[#2B3A67]/10 space-y-2">
          <label htmlFor="manual-qr-input" className="block text-xs font-semibold text-[#2B3A67]">
            {t.scan.manualLabel}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#2B3A67]/45 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="manual-qr-input"
                type="text"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  if (manualError) setManualError('');
                }}
                placeholder={t.scan.manualPlaceholder}
                className="w-full min-h-[44px] pl-9 pr-3 rounded-xl border border-[#2B3A67]/25 bg-[#FBF6EA] text-sm text-[#2A2A2A] focus:outline-2 focus:outline-[#2B3A67]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-xl bg-[#E9A820] text-[#2B3A67] text-sm font-bold hover:bg-[#f0b438] active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              {t.scan.openPassport}
            </button>
          </div>
          {manualError && (
            <p className="text-xs font-medium text-[#C65D3B]" role="alert">
              {manualError}
            </p>
          )}
        </form>
      </section>

      <StitchDivider />

      {/* 6 Sample Demo Garment Care Tags */}
      <section aria-labelledby="demo-tags-heading" className="space-y-3">
        <h2 id="demo-tags-heading" className="font-display text-lg font-bold text-[#2B3A67]">
          {t.scan.demoGridTitle}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {GARMENTS.map((garment) => (
            <button
              key={garment.id}
              type="button"
              onClick={() => navigate(`/garment/${garment.id}`)}
              className="garment-tag-card p-3.5 text-left flex flex-col gap-2.5 hover:border-[#2B3A67]/45 active:scale-[0.98] transition-all"
            >
              <GarmentIllustration garment={garment} size="md" />
              <div>
                <div className="text-[11px] font-medium text-[#2A2A2A]/60 tabular-nums">
                  {garment.id} · {garment.brand}
                </div>
                <div className="font-semibold text-sm text-[#2B3A67] leading-snug line-clamp-2 mt-0.5">
                  {garment.name[lang]}
                </div>
                <div className="text-[11px] text-[#1F8A87] font-semibold mt-1 inline-flex items-center gap-1">
                  <span>{garment.category[lang]}</span>
                  <span>· Eco {garment.ecoScore}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Link to Printable Demo QR Codes Page */}
      <Link
        to="/demo-tags"
        className="garment-tag-card p-4 pr-8 flex items-center justify-between gap-3 hover:border-[#2B3A67]/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#2B3A67]/8 text-[#2B3A67] flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </span>
          <div>
            <div className="font-semibold text-sm text-[#2B3A67]">{t.scan.printTagsBtn}</div>
            <div className="text-xs text-[#2A2A2A]/70">{t.scan.printTagsDesc}</div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#2B3A67] shrink-0" />
      </Link>
    </div>
  );
}
