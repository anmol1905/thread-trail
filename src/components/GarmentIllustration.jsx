// Local illustrated garment swatch (zero external image requests).
export function GarmentIllustration({ garment, size = 'md' }) {
  const dims =
    size === 'lg'
      ? 'w-20 h-20 text-4xl rounded-2xl'
      : size === 'sm'
      ? 'w-11 h-11 text-xl rounded-xl'
      : 'w-14 h-14 text-2xl rounded-xl';

  return (
    <div
      className={`${dims} shrink-0 flex items-center justify-center relative overflow-hidden border border-[#2B3A67]/15`}
      style={{
        background: `linear-gradient(135deg, ${garment.colorHex}18 0%, ${garment.accentHex}24 100%)`,
      }}
      aria-hidden="true"
    >
      <span className="relative z-10 select-none leading-none">{garment.emoji}</span>
      <span
        className="absolute bottom-1 right-1.5 text-[9px] font-bold tracking-wider opacity-60"
        style={{ color: garment.colorHex }}
      >
        {garment.id}
      </span>
    </div>
  );
}
