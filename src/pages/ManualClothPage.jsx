import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Camera, Check, ChevronDown, ChevronUp, CircleHelp, ImagePlus, Minus,
  PackagePlus, Plus, RotateCcw, Shirt, Sparkles, Upload, Wind,
} from 'lucide-react';
import { PARTNERS } from '../data/partners';
import {
  CLOTH_TYPES, COLOURS, MATERIALS, SIZE_OPTIONS, estimateWeight, getType,
  materialToPartnerFabric, suggestMaterial,
} from '../data/manualClothes';
import { resizeImageFile } from '../utils/image';
import { useThreadTrail } from '../hooks/useThreadTrail';

const DRAFT_KEY = 'threadtrail_manual_cloth_draft';
const EMPTY_DRAFT = {
  step: 1, photo: '', type: '', otherType: '', quantity: 1, materials: [], condition: '',
  brand: '', size: '', colour: '', note: '', weightKg: '', partnerId: '',
};

const COPY = {
  en: {
    title: 'Add cloth without a tag', draft: 'Your progress is saved on this device', back: 'Back',
    next: 'Continue', skip: 'Skip photo', steps: ['Photo', 'Cloth type', 'Material', 'Condition', 'Details', 'Review'],
    photoTitle: 'Take a photo of your cloth', photoSub: 'A clear photo helps the pickup partner identify it.',
    camera: 'Open camera', gallery: 'Upload from gallery', retake: 'Retake', use: 'Use photo', processing: 'Preparing photo…',
    typeTitle: 'What type of cloth is it?', quantity: 'How many?', otherPlaceholder: 'Name the cloth',
    materialTitle: 'What is it made of?', materialSub: 'Choose all that apply for a blend.', guideTitle: 'Not sure? Check three things',
    feel: 'How does it feel?', feelOpts: [['soft', 'Soft / natural'], ['smooth', 'Smooth'], ['fuzzy', 'Warm / fuzzy'], ['shiny', 'Shiny']],
    wrinkle: 'Does it wrinkle easily?', stretch: 'Does it stretch?', yes: 'Yes', no: 'No', probably: 'Probably', accept: 'Use suggestion', change: 'Choose myself',
    conditionTitle: 'What condition is it in?',
    detailsTitle: 'Anything else to add?', detailsSub: 'These details are optional. The weight is estimated for you.',
    more: 'Add more details', brand: 'Brand', note: 'Note for partner', size: 'Size', colour: 'Colour', weight: 'Estimated weight (kg)',
    reviewTitle: 'Review your cloth', edit: 'Edit', recommended: 'Recommended pickup partners', partnerHint: 'Matched by material and condition.',
    addBag: 'Add to pickup bag', selectPartner: 'Select a partner to continue', noMatch: 'No exact match found. These flexible partners can review your cloth.',
    savedError: 'The photo is ready, but your browser storage is full. You can continue without keeping the photo after refresh.',
    photoOptional: 'No photo added', manual: 'Manual entry', materials: 'Material', condition: 'Condition',
  },
  hi: {
    title: 'बिना टैग का कपड़ा जोड़ें', draft: 'आपकी जानकारी इस डिवाइस पर सुरक्षित है', back: 'वापस',
    next: 'आगे बढ़ें', skip: 'फोटो छोड़ें', steps: ['फोटो', 'कपड़े का प्रकार', 'मटेरियल', 'स्थिति', 'जानकारी', 'समीक्षा'],
    photoTitle: 'अपने कपड़े की फोटो लें', photoSub: 'साफ फोटो से पिकअप साझेदार कपड़ा पहचान पाएगा।',
    camera: 'कैमरा खोलें', gallery: 'गैलरी से चुनें', retake: 'दोबारा लें', use: 'फोटो इस्तेमाल करें', processing: 'फोटो तैयार हो रही है…',
    typeTitle: 'यह किस प्रकार का कपड़ा है?', quantity: 'कितने कपड़े?', otherPlaceholder: 'कपड़े का नाम',
    materialTitle: 'यह किस मटेरियल का है?', materialSub: 'मिश्रित कपड़े के लिए सभी सही विकल्प चुनें।', guideTitle: 'पता नहीं? तीन चीज़ें देखें',
    feel: 'छूने में कैसा है?', feelOpts: [['soft', 'मुलायम / प्राकृतिक'], ['smooth', 'चिकना'], ['fuzzy', 'गर्म / रोएंदार'], ['shiny', 'चमकदार']],
    wrinkle: 'क्या इसमें जल्दी सिलवट पड़ती है?', stretch: 'क्या यह खिंचता है?', yes: 'हाँ', no: 'नहीं', probably: 'शायद', accept: 'सुझाव चुनें', change: 'खुद चुनें',
    conditionTitle: 'कपड़े की स्थिति कैसी है?',
    detailsTitle: 'कुछ और जोड़ना है?', detailsSub: 'यह जानकारी वैकल्पिक है। वजन का अनुमान हमने लगाया है।',
    more: 'और जानकारी जोड़ें', brand: 'ब्रांड', note: 'साझेदार के लिए नोट', size: 'साइज़', colour: 'रंग', weight: 'अनुमानित वजन (किग्रा)',
    reviewTitle: 'कपड़े की समीक्षा', edit: 'बदलें', recommended: 'सुझाए गए पिकअप साझेदार', partnerHint: 'मटेरियल और स्थिति के आधार पर।',
    addBag: 'पिकअप बैग में जोड़ें', selectPartner: 'आगे बढ़ने के लिए साझेदार चुनें', noMatch: 'सटीक मेल नहीं मिला। ये साझेदार कपड़े की जाँच कर सकते हैं।',
    savedError: 'फोटो तैयार है, लेकिन ब्राउज़र स्टोरेज भर गया है। रीफ्रेश के बाद फोटो सुरक्षित नहीं रह सकती।',
    photoOptional: 'फोटो नहीं जोड़ी', manual: 'मैन्युअल एंट्री', materials: 'मटेरियल', condition: 'स्थिति',
  },
};

function loadDraft() {
  try { return { ...EMPTY_DRAFT, ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') }; }
  catch { return EMPTY_DRAFT; }
}

export function ManualClothPage() {
  const navigate = useNavigate();
  const { t, lang, addManualToBag, selectPartner } = useThreadTrail();
  const c = COPY[lang];
  const [draft, setDraft] = useState(loadDraft);
  const [photoCandidate, setPhotoCandidate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [guide, setGuide] = useState({ feel: '', wrinkle: '', stretch: '' });
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [draft]);

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const goStep = (step) => setDraft((prev) => ({ ...prev, step }));
  const type = getType(draft.type);
  const weight = draft.weightKg || estimateWeight(draft.type, draft.quantity);

  const suggestedMaterial = guide.feel && guide.wrinkle && guide.stretch ? suggestMaterial(guide) : '';
  const suggestedMeta = MATERIALS.find((item) => item.id === suggestedMaterial);

  const matchedPartners = useMemo(() => {
    const fabrics = draft.materials.map(materialToPartnerFabric).filter(Boolean);
    const exact = PARTNERS.filter((partner) =>
      partner.acceptedConditions.includes(draft.condition) &&
      (!fabrics.length || fabrics.some((fabric) => partner.acceptedFabrics.includes(fabric)))
    );
    const fallback = PARTNERS.filter((partner) => partner.acceptedConditions.includes(draft.condition));
    return (exact.length ? exact : fallback).slice(0, 4);
  }, [draft.materials, draft.condition]);

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try { setPhotoCandidate(await resizeImageFile(file)); }
    catch { setStorageError(true); }
    finally { setProcessing(false); event.target.value = ''; }
  };

  const toggleMaterial = (id) => {
    if (id === 'unknown') { setDraft((prev) => ({ ...prev, materials: ['unknown'] })); return; }
    setDraft((prev) => {
      const current = prev.materials.filter((item) => item !== 'unknown');
      return { ...prev, materials: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] };
    });
  };

  const chooseCondition = (condition) => {
    setDraft((prev) => ({ ...prev, condition, step: 5 }));
  };

  const finish = () => {
    if (!draft.partnerId) return;
    const manual = {
      ...draft, id: `M-${Date.now().toString(36).toUpperCase()}`,
      photo: storageError ? '' : draft.photo,
      weightKg: Number(weight), createdAt: Date.now(), step: undefined, partnerId: undefined,
    };
    addManualToBag(manual);
    selectPartner(draft.partnerId);
    localStorage.removeItem(DRAFT_KEY);
    navigate('/bag');
  };

  const canContinue = draft.step === 2 ? Boolean(draft.type && (draft.type !== 'other' || draft.otherType.trim()))
    : draft.step === 3 ? draft.materials.length > 0 && !draft.materials.includes('unknown')
    : true;

  return (
    <div className="manual-cloth-page space-y-4">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => draft.step > 1 ? goStep(draft.step - 1) : navigate(-1)} className="min-h-[40px] px-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#2B3A67]">
            <ArrowLeft className="w-4 h-4" /> {c.back}
          </button>
          <span className="text-[11px] text-[#1F8A87] font-semibold">{c.draft}</span>
        </div>
        <div>
          <div className="flex justify-between text-[10px] font-bold text-[#2B3A67]/55 mb-1.5"><span>{c.steps[draft.step - 1]}</span><span>{draft.step}/6</span></div>
          <div className="h-2 rounded-full bg-[#2B3A67]/10 overflow-hidden" role="progressbar" aria-valuemin="1" aria-valuemax="6" aria-valuenow={draft.step} aria-label={c.steps[draft.step - 1]}><div className="h-full rounded-full bg-[#E9A820] transition-all" style={{ width: `${draft.step / 6 * 100}%` }} /></div>
        </div>
      </header>

      {storageError && <div role="alert" className="rounded-xl bg-[#C65D3B]/10 border border-[#C65D3B]/25 p-3 text-xs text-[#8C3418]">{c.savedError}</div>}

      {draft.step === 1 && <section className="manual-step garment-tag-card p-5 space-y-4">
        <div><h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.photoTitle}</h1><p className="text-sm text-[#2A2A2A]/70 mt-1">{c.photoSub}</p></div>
        {(photoCandidate || draft.photo) ? <>
          <img src={photoCandidate || draft.photo} alt="Cloth preview" className="w-full max-h-[360px] object-cover rounded-2xl border border-[#2B3A67]/15" />
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={() => { setPhotoCandidate(''); setField('photo', ''); cameraRef.current?.click(); }} className="min-h-[46px] rounded-xl border border-[#2B3A67]/20 text-sm font-bold text-[#2B3A67] inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" />{c.retake}</button>
            <button type="button" onClick={() => { if (photoCandidate) setField('photo', photoCandidate); goStep(2); }} className="min-h-[46px] rounded-xl bg-[#2B3A67] text-[#FBF6EA] text-sm font-bold inline-flex items-center justify-center gap-2"><Check className="w-4 h-4 text-[#E9A820]" />{c.use}</button>
          </div>
        </> : <>
          <div className="rounded-2xl min-h-[190px] border-2 border-dashed border-[#2B3A67]/20 bg-[#FBF6EA] flex items-center justify-center"><ImagePlus className="w-14 h-14 text-[#2B3A67]/28" /></div>
          <button type="button" onClick={() => cameraRef.current?.click()} className="w-full min-h-[50px] rounded-xl bg-[#2B3A67] text-[#FBF6EA] font-bold inline-flex items-center justify-center gap-2"><Camera className="w-5 h-5 text-[#E9A820]" />{processing ? c.processing : c.camera}</button>
          <button type="button" onClick={() => galleryRef.current?.click()} className="w-full min-h-[46px] rounded-xl border border-[#2B3A67]/20 text-[#2B3A67] font-semibold inline-flex items-center justify-center gap-2"><Upload className="w-4 h-4" />{c.gallery}</button>
          <button type="button" onClick={() => goStep(2)} className="w-full min-h-[40px] text-xs font-bold text-[#1F8A87]">{c.skip}</button>
        </>}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="sr-only" />
        <input ref={galleryRef} type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
      </section>}

      {draft.step === 2 && <section className="manual-step space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.typeTitle}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">{CLOTH_TYPES.map((item) => <button key={item.id} type="button" onClick={() => setField('type', item.id)} className={`manual-choice min-h-[86px] rounded-2xl border p-3 text-left ${draft.type === item.id ? 'is-selected' : ''}`}><Shirt className="w-5 h-5 text-[#1F8A87]" /><span className="block mt-2 text-sm font-bold text-[#2B3A67]">{item.label[lang]}</span></button>)}</div>
        {draft.type === 'other' && <input autoFocus value={draft.otherType} onChange={(e) => setField('otherType', e.target.value)} placeholder={c.otherPlaceholder} className="w-full min-h-[46px] rounded-xl border border-[#2B3A67]/25 bg-[#FBF6EA] px-3" />}
        <div className="garment-tag-card p-3 flex items-center justify-between"><span className="font-bold text-sm text-[#2B3A67]">{c.quantity}</span><div className="flex items-center gap-3"><button type="button" onClick={() => setField('quantity', Math.max(1, draft.quantity - 1))} className="w-11 h-11 rounded-xl border border-[#2B3A67]/20 flex items-center justify-center"><Minus className="w-4 h-4" /></button><strong className="w-6 text-center tabular-nums">{draft.quantity}</strong><button type="button" onClick={() => setField('quantity', Math.min(20, draft.quantity + 1))} className="w-11 h-11 rounded-xl bg-[#2B3A67] text-[#FBF6EA] flex items-center justify-center"><Plus className="w-4 h-4" /></button></div></div>
        <button disabled={!canContinue} type="button" onClick={() => { setField('weightKg', estimateWeight(draft.type, draft.quantity)); goStep(3); }} className="manual-next">{c.next}</button>
      </section>}

      {draft.step === 3 && <section className="manual-step space-y-4">
        <div><h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.materialTitle}</h1><p className="text-sm text-[#2A2A2A]/70 mt-1">{c.materialSub}</p></div>
        <div className="grid grid-cols-2 gap-2.5">{MATERIALS.map((item) => <button key={item.id} type="button" onClick={() => toggleMaterial(item.id)} className={`manual-choice min-h-[92px] rounded-2xl border p-3 text-left ${draft.materials.includes(item.id) ? 'is-selected' : ''}`}><span className="text-sm font-bold text-[#2B3A67]">{item.label[lang]}</span><span className="block text-[11px] text-[#2A2A2A]/65 mt-1">{item.hint[lang]}</span></button>)}</div>
        {draft.materials.includes('unknown') && <div className="garment-tag-card p-4 space-y-3"><h2 className="font-display font-bold text-[#2B3A67] flex items-center gap-2"><CircleHelp className="w-5 h-5 text-[#E9A820]" />{c.guideTitle}</h2>
          {[["feel", c.feel, c.feelOpts], ["wrinkle", c.wrinkle, [['yes', c.yes], ['no', c.no]]], ["stretch", c.stretch, [['yes', c.yes], ['no', c.no]]]].map(([key, label, options]) => <div key={key}><div className="text-xs font-bold text-[#2B3A67] mb-1.5">{label}</div><div className="flex flex-wrap gap-2">{options.map(([value, text]) => <button key={value} type="button" onClick={() => setGuide((prev) => ({ ...prev, [key]: value }))} className={`min-h-[36px] px-3 rounded-lg border text-xs font-semibold ${guide[key] === value ? 'bg-[#2B3A67] text-[#FBF6EA]' : 'bg-[#FBF6EA] text-[#2B3A67]'}`}>{text}</button>)}</div></div>)}
          {suggestedMeta && <div className="rounded-xl bg-[#E9A820]/14 border border-[#E9A820]/30 p-3 flex items-center justify-between gap-3"><span className="text-sm font-bold text-[#2B3A67]">{c.probably} {suggestedMeta.label[lang]}</span><button type="button" onClick={() => setField('materials', [suggestedMaterial])} className="min-h-[38px] px-3 rounded-lg bg-[#2B3A67] text-[#FBF6EA] text-xs font-bold">{c.accept}</button></div>}
        </div>}
        <button disabled={!canContinue} type="button" onClick={() => goStep(4)} className="manual-next">{c.next}</button>
      </section>}

      {draft.step === 4 && <section className="manual-step space-y-4"><h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.conditionTitle}</h1><div className="space-y-3">{['good', 'fix', 'worn'].map((key, index) => <button key={key} type="button" onClick={() => chooseCondition(key)} className="manual-choice w-full min-h-[96px] rounded-2xl border p-4 text-left flex items-center gap-4"><span className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-[#1F8A87]/15 text-[#1F8A87]' : index === 1 ? 'bg-[#E9A820]/18 text-[#946200]' : 'bg-[#C65D3B]/12 text-[#C65D3B]'}`}>{index === 0 ? <Sparkles /> : index === 1 ? <Wind /> : <RotateCcw />}</span><span><strong className="block text-base text-[#2B3A67]">{t.passport.conditions[key].label}</strong><small className="text-sm text-[#2A2A2A]/65">{t.passport.conditions[key].action}</small></span></button>)}</div></section>}

      {draft.step === 5 && <section className="manual-step garment-tag-card p-5 space-y-4"><div><h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.detailsTitle}</h1><p className="text-sm text-[#2A2A2A]/70 mt-1">{c.detailsSub}</p></div>
        <button type="button" onClick={() => setShowDetails((value) => !value)} className="w-full min-h-[46px] rounded-xl border border-[#2B3A67]/20 px-3 flex items-center justify-between font-bold text-sm text-[#2B3A67]"><span>{c.more}</span>{showDetails ? <ChevronUp /> : <ChevronDown />}</button>
        {showDetails && <div className="space-y-3"><input value={draft.brand} onChange={(e) => setField('brand', e.target.value)} placeholder={c.brand} className="manual-input" /><div><div className="manual-label">{c.size}</div><div className="flex flex-wrap gap-2">{SIZE_OPTIONS.map((size) => <button key={size} type="button" onClick={() => setField('size', size)} className={`manual-chip ${draft.size === size ? 'is-selected' : ''}`}>{size}</button>)}</div></div><div><div className="manual-label">{c.colour}</div><div className="flex flex-wrap gap-2">{COLOURS.map(([name, hex]) => <button key={name} type="button" onClick={() => setField('colour', name)} aria-label={name} className={`w-10 h-10 rounded-full border-2 ${draft.colour === name ? 'border-[#E9A820] ring-2 ring-[#2B3A67]' : 'border-[#2B3A67]/20'}`} style={{ backgroundColor: hex }} />)}</div></div><textarea value={draft.note} onChange={(e) => setField('note', e.target.value)} placeholder={c.note} className="manual-input min-h-[80px] py-3" /></div>}
        <label className="block"><span className="manual-label">{c.weight}</span><input type="number" min="0.05" max="20" step="0.05" value={weight} onChange={(e) => setField('weightKg', e.target.value)} className="manual-input" /></label>
        <button type="button" onClick={() => goStep(6)} className="manual-next">{c.next}</button>
      </section>}

      {draft.step === 6 && <section className="manual-step space-y-4"><h1 className="font-display text-2xl font-bold text-[#2B3A67]">{c.reviewTitle}</h1>
        <div className="garment-tag-card overflow-hidden"><div className="h-2 ajrakh-border" /><div className="p-4 flex gap-3">{draft.photo ? <img src={draft.photo} alt="" className="w-20 h-20 rounded-2xl object-cover border border-[#2B3A67]/15" /> : <div className="w-20 h-20 rounded-2xl bg-[#2B3A67]/8 flex items-center justify-center"><Shirt className="w-9 h-9 text-[#2B3A67]/45" /></div>}<div className="min-w-0"><div className="text-[10px] uppercase tracking-wide font-bold text-[#1F8A87]">{c.manual}</div><h2 className="font-display text-lg font-bold text-[#2B3A67]">{draft.type === 'other' ? draft.otherType : type.label[lang]} × {draft.quantity}</h2><p className="text-xs text-[#2A2A2A]/70 mt-1">{draft.materials.map((id) => MATERIALS.find((m) => m.id === id)?.label[lang]).join(', ')} · {t.passport.conditions[draft.condition]?.label}</p><p className="text-xs font-bold text-[#2B3A67] mt-1">{weight} {t.common.kg}</p></div></div>{(draft.brand || draft.size || draft.colour || draft.note) && <div className="mx-4 mb-4 rounded-xl bg-[#FBF6EA] border border-[#2B3A67]/10 p-3 grid grid-cols-2 gap-2 text-xs">{draft.brand && <span><strong>{c.brand}:</strong> {draft.brand}</span>}{draft.size && <span><strong>{c.size}:</strong> {draft.size}</span>}{draft.colour && <span><strong>{c.colour}:</strong> {draft.colour}</span>}{draft.note && <span className="col-span-2"><strong>{c.note}:</strong> {draft.note}</span>}</div>}<div className="grid grid-cols-2 sm:grid-cols-5 border-t border-[#2B3A67]/10">{[[1, c.steps[0]], [2, c.steps[1]], [3, c.steps[2]], [4, c.steps[3]], [5, c.steps[4]]].map(([step, label]) => <button key={step} type="button" onClick={() => goStep(step)} className="min-h-[42px] px-1 text-[11px] font-bold text-[#1F8A87] border-r border-b sm:border-b-0 last:border-r-0 border-[#2B3A67]/10">{c.edit} {label}</button>)}</div></div>
        <div><h2 className="font-display text-lg font-bold text-[#2B3A67]">{c.recommended}</h2><p className="text-xs text-[#2A2A2A]/65">{c.partnerHint}</p></div>
        <div className="space-y-2.5">{matchedPartners.map((partner) => <button key={partner.id} type="button" onClick={() => setField('partnerId', partner.id)} className={`manual-choice w-full rounded-2xl border p-4 text-left flex justify-between gap-3 ${draft.partnerId === partner.id ? 'is-selected' : ''}`}><span><strong className="block text-sm text-[#2B3A67]">{partner.name}</strong><small className="text-xs text-[#2A2A2A]/65">{partner.area} · {partner.acceptedFabrics.join(', ')}</small></span>{draft.partnerId === partner.id && <Check className="w-5 h-5 text-[#1F8A87] shrink-0" />}</button>)}</div>
        <button disabled={!draft.partnerId} type="button" onClick={finish} className="manual-next"><PackagePlus className="w-5 h-5" />{draft.partnerId ? c.addBag : c.selectPartner}</button>
      </section>}
    </div>
  );
}
