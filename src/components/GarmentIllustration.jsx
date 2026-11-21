// Local garment photography; source and license details live in /image-credits.html.
export function GarmentIllustration({ garment, size = 'md' }) {
  const dims =
    size === 'lg'
      ? 'w-20 h-20 rounded-2xl'
      : size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : 'w-14 h-14 rounded-xl';

  return (
    <div
      className={`garment-swatch ${dims} shrink-0 flex items-center justify-center relative overflow-hidden border border-[#2B3A67]/15`}
      aria-hidden="true"
    >
      <img
        src={garment.image}
        alt=""
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#2B3A67]/28 via-transparent to-transparent" />
      <span
        className="absolute z-10 bottom-1 right-1.5 text-[8px] font-bold tracking-wider text-[#FFFDF8] drop-shadow-sm"
      >
        {garment.id}
      </span>
    </div>
  );
}
