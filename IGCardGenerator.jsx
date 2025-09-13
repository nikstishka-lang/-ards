import React, { useRef, useState } from "react";

export default function IGCardGenerator() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [cards, setCards] = useState([]);
  const [promoText, setPromoText] = useState("");
  const [showPromo, setShowPromo] = useState(true);
  const [lastLayout, setLastLayout] = useState("promo");
  const [bgColor, setBgColor] = useState("#FDB852");
  const [fontSizeMain, setFontSizeMain] = useState(34);
  const [fontSizeTitle, setFontSizeTitle] = useState(52);
  const [titlePosition, setTitlePosition] = useState("bottom");
  const [exportFormat, setExportFormat] = useState("png");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPos, setLogoPos] = useState("br");
  const cardRefs = useRef([]);

  function parseCardsFromRaw() {
    const parts = rawText.split(/\n-{3,}\n/).map(p => p.trim()).filter(Boolean);
    setCards(parts.length ? parts : rawText.split("\n").filter(Boolean));
  }

  function onImageChange(e) { const f = e.target.files[0]; if (f) setImageFile(URL.createObjectURL(f)); }
  function onLogoChange(e) { const f = e.target.files[0]; if (f) setLogoFile(URL.createObjectURL(f)); }
  function addCard(text = "") { setCards(prev => [...prev, text]); }
  function updateCard(idx, value) { setCards(prev => prev.map((c, i) => (i === idx ? value : c))); }
  function removeCard(idx) { setCards(prev => prev.filter((_, i) => i !== idx)); }

  async function downloadAll() {
    const html2canvas = (await import("html2canvas")).default;
    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");

    const zip = new JSZip();
    const mime = exportFormat === "png" ? "image/png" : "image/jpeg";

    for (let i = 0; i < cards.length + 2; i++) {
      const element = cardRefs.current[i];
      if (!element) continue;
      const canvas = await html2canvas(element, {useCORS: true, scale: 2});
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const blob = await (await fetch(dataUrl)).blob();
      zip.file(`${String(i+1).padStart(2,'0')}.${exportFormat}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `cards_${Date.now()}.zip`);
  }

  const cover = (
    <div className="w-[1080px] h-[1080px] rounded-2xl overflow-hidden relative" style={{ background: "#fff" }}>
      {imageFile ? <img src={imageFile} alt="cover" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">Upload an image</div>}
      <div className={`absolute inset-0 flex p-12 ${titlePosition === "bottom" ? "items-end" : titlePosition === "top" ? "items-start" : "items-center"}`}>
        <h1 style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 800, textTransform: 'uppercase', fontSize: fontSizeTitle }} className="leading-tight drop-shadow-lg">{title}</h1>
      </div>
      {logoFile && <img src={logoFile} alt="logo" className={`absolute w-40 opacity-90 ${logoPos === "br" ? "bottom-4 right-4" : logoPos === "bl" ? "bottom-4 left-4" : logoPos === "tr" ? "top-4 right-4" : "top-4 left-4"}`} />}
    </div>
  );

  function TextCard({ text, idx }) {
    return (
      <div className="w-[1080px] h-[1080px] rounded-2xl overflow-hidden relative flex items-center justify-center" style={{ background: bgColor }}>
        <div className="max-w-[920px] p-12" style={{ fontFamily: '"Open Sans", sans-serif' }}>
          <p style={{ fontSize: fontSizeMain, fontWeight: 600, whiteSpace: 'pre-wrap' }} className="leading-snug">{text}</p>
        </div>
        {logoFile && <img src={logoFile} alt="logo" className={`absolute w-40 opacity-90 ${logoPos === "br" ? "bottom-4 right-4" : logoPos === "bl" ? "bottom-4 left-4" : logoPos === "tr" ? "top-4 right-4" : "top-4 left-4"}`} />}
      </div>
    );
  }

  function LastCard() {
    return (
      <div className="w-[1080px] h-[1080px] rounded-2xl overflow-hidden relative flex items-center justify-center" style={{ background: bgColor }}>
        <div className="max-w-[920px] p-12 text-center" style={{ fontFamily: '"Open Sans", sans-serif' }}>
          {lastLayout === "promo" && <><h2 style={{ fontWeight: 800, fontSize: 40, textTransform: 'uppercase' }}>Промокод</h2><p style={{ fontSize: 30, marginTop: 12 }}>{promoText || "Введите промокод"}</p><p style={{ marginTop: 24, fontSize: 24 }}>Сохрани эту подборку себе</p></>}
          {lastLayout === "saveonly" && <p style={{ fontSize: 34, fontWeight: 600 }}>Сохрани эту подборку себе 📌</p>}
          {lastLayout === "text" && <textarea className="w-full p-2 rounded" rows={6} placeholder="Введите произвольный текст" />}
        </div>
        {logoFile && <img src={logoFile} alt="logo" className={`absolute w-40 opacity-90 ${logoPos === "br" ? "bottom-4 right-4" : logoPos === "bl" ? "bottom-4 left-4" : logoPos === "tr" ? "top-4 right-4" : "top-4 left-4"}`} />}
      </div>
    );
  }

  function setCardRef(el, i) { cardRefs.current[i] = el; }

  return <div className="p-6 space-y-6">Ваш интерфейс с карточками здесь (тот же код, что присылала ранее)</div>;
}
