'use client';

import { useEffect, useRef, useState } from "react";

const svgPath = "M1102.62 39.1387H1143.3L1132.55 76.8376H1091.87L1083.55 105.665C1079.68 119.302 1086.77 125.18 1100.74 125.18C1108.05 125.18 1113.93 123.849 1120.24 121.965L1110.49 155.89C1098.52 160.769 1078.9 165.094 1059.39 165.094C1012.39 165.094 990.78 143.583 1000.53 109.434L1009.84 76.8376L1010.44 74.8401H981.814H921.587C921.586 67.6343 916.929 61.65 904.294 60.7629C894.318 60.0976 887.336 63.3128 886.338 67.9696C884.898 73.9557 891.66 75.95 899.862 77.5021L943.865 85.8203C983.658 93.3598 995.186 108.881 989.422 129.504C982.772 152.455 949.407 167.2 883.898 165.98C834.864 165.14 800.312 155.797 790.782 136.56C771.876 153.822 739.871 166.202 693.997 166.202C647.687 166.202 607.057 151.52 593.724 124.745L583.126 161.768H502.21L519.613 101.009C523.714 86.5953 517.837 79.4996 507.528 79.4996C496.999 79.5004 488.908 87.0389 484.585 101.895L467.404 161.768H386.487L403.89 101.009C407.991 86.5956 402.118 79.4998 392.031 79.4996C381.169 79.4996 373.075 86.5944 368.642 101.895L351.46 161.768H122.404C121.849 157.111 121.628 150.236 122.182 144.803C111.209 156.445 93.141 166.202 61.8831 166.202C19.3203 166.202 -6.61701 147.244 1.4733 118.085C8.01309 96.353 30.2953 88.9234 66.5412 87.0386L137.034 83.2691L137.481 81.9361C140.14 74.0648 136.037 66.0831 120.632 66.0829C108.55 66.0829 102.01 72.4035 99.7929 79.6103H14.6648C22.2022 51.1156 58.5585 34.7048 118.414 34.7047C177.328 34.7047 212.667 48.051 217.718 73.5269L238.043 2.77274H320.067L309.62 39.1387H383.719L376.847 63.0886C391.811 44.6843 414.311 34.7048 438.917 34.7047C465.852 34.7047 482.037 45.3484 487.357 64.0854C500.326 46.9006 524.27 34.7047 550.871 34.7047C584.787 34.705 601.184 48.63 604.63 67.847C623.977 47.3989 659.964 34.7047 704.859 34.7047C757.433 34.7048 790.847 48.7886 804.472 69.8524C813.885 43.4996 855.446 33.9361 904.294 34.7047C935.835 35.2653 969.799 40.4581 987.615 54.4896L991.997 39.1387H1020.59L1028.02 13.306L1113.82 0L1102.62 39.1387ZM811.254 98.2877C810.983 101.106 810.475 103.977 809.716 106.887C808.045 112.997 805.224 119.014 801.234 124.737H867.16C866.828 135.602 875.807 139.483 887.556 140.037C900.413 140.591 905.4 137.154 906.62 132.609C907.617 128.617 905.846 124.958 893.211 122.629L846.099 114.094C830.528 111.251 818.598 105.682 811.254 98.2877ZM706.852 67.9696C691.003 67.9704 680.807 79.6098 675.93 95.3528C669.39 116.973 675.263 132.941 695.104 132.941C709.846 132.941 720.71 122.296 726.142 101.674C730.908 83.4902 726.028 67.9696 706.852 67.9696ZM103.008 107.551C92.5893 109.103 87.8221 111.984 86.2692 117.195C83.9415 125.732 91.2577 131.386 103.672 131.387C117.971 131.387 125.287 124.071 127.837 115.312L131.273 103.45L103.008 107.551Z";

const NOTE_DURATIONS_MS = [23.4, 2.1, 15.7].map(h => h * 3600 * 1000);

function formatCountdown(ms: number): string {
  const total = Math.max(0, ms);
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const NOTES = [
  {
    venue: "The Plimsoll",
    date: "Sat 22 Aug",
    text: "i said they never serve that end of the bar and you went \"is that your way of telling me to come stand next to you\" and i went SO red 😅 you were nice about it which honestly made it worse. we talked for a bit then you touched my arm when you left and i felt it the whole way home",
  },
  {
    venue: "Lost",
    date: "Fri 8 Aug",
    text: "Went outside for air and you sat next to me and we talked about how glad we are it's not cold anymore. It felt warm between us. We could have kissed but I think we both thought we had more time. You were hot in a way that made my friend wink at me when she saw us talking.",
  },
  {
    venue: "The Cause",
    date: "Sun 14 Sep",
    text: "You asked to use my power bank (and called me a nerd for having one) and we stood there while your phone charged talking about nothing. I should've got your number while you were literally plugged into me, like the logistics could not have been more in my favour and i still didn't do it.",
  },
];

const CARD_TILTS = [-1.5, 1.2, -0.7];
const CARD_OFFSETS = [-8, 10, -4];

export default function AlmostLanding() {
  const [face1, setFace1] = useState({ x: 120, y: 60, vx: 0.7, vy: 0.5 });
  const [face2, setFace2] = useState({ x: 980, y: 340, vx: -0.55, vy: 0.75 });
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; secondary: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cityError, setCityError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [endsAt] = useState(() => NOTE_DURATIONS_MS.map(d => Date.now() + d));
  const [countdowns, setCountdowns] = useState(() => NOTE_DURATIONS_MS.map(formatCountdown));
  const requestRef = useRef<number | null>(null);
  const vwRef = useRef(1440);
  const vhRef = useRef(810);
  const svhRef = useRef(810);
  const isMobileRef = useRef(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const f1w = isMobile ? 135 : 159, f1h = isMobile ? 203 : 239;
  const f2w = isMobile ? 173 : 204, f2h = isMobile ? 204 : 240;

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const update = () => { vwRef.current = window.innerWidth; vhRef.current = window.innerHeight; };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:0;left:0;height:100svh;width:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(el);
    const update = () => { svhRef.current = el.offsetHeight; };
    update();
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('resize', update); el.remove(); };
  }, []);

  useEffect(() => {
    setCardsVisible([false, false, false]);
    const timer = setTimeout(() => {
      const observers = cardRefs.current.map((ref, i) => {
        if (!ref) return null;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setCardsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 130);
            obs.disconnect();
          }
        }, { threshold: 0.15 });
        obs.observe(ref);
        return obs;
      });
      return () => observers.forEach(obs => obs?.disconnect());
    }, 50);
    return () => clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdowns(endsAt.map(end => formatCountdown(end - Date.now())));
    }, 1000);
    return () => clearInterval(tick);
  }, [endsAt]);

  useEffect(() => {
    const animate = () => {
      const W = vwRef.current;
      const H = svhRef.current;
      setFace1((p) => {
        let x = p.x + p.vx, y = p.y + p.vy, vx = p.vx, vy = p.vy;
        if (x <= 0 || x + f1w >= W) { vx = -vx; x = x <= 0 ? 0 : W - f1w; }
        if (y <= 0 || y + f1h >= H) { vy = -vy; y = y <= 0 ? 0 : H - f1h; }
        return { x, y, vx, vy };
      });
      setFace2((p) => {
        let x = p.x + p.vx, y = p.y + p.vy, vx = p.vx, vy = p.vy;
        if (x <= 0 || x + f2w >= W) { vx = -vx; x = x <= 0 ? 0 : W - f2w; }
        if (y <= 0 || y + f2h >= H) { vy = -vy; y = y <= 0 ? 0 : H - f2h; }
        return { x, y, vx, vy };
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCity(val);
    setShowSuggestions(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val.trim())}&featuretype=city&format=json&addressdetails=1&limit=8`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const seen = new Set<string>();
        const mapped = (data as { display_name: string; address: { city?: string; town?: string; village?: string; municipality?: string; county?: string; state?: string; country?: string } }[])
          .map(r => {
            const name = r.address.city || r.address.town || r.address.municipality || r.address.village || r.display_name.split(",")[0];
            const secondary = [r.address.state, r.address.country].filter(Boolean).join(", ");
            return { name, secondary };
          })
          .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true; });
        setSuggestions(mapped);
        setShowSuggestions(mapped.length > 0);
      } catch { /* ignore */ }
    }, 300);
  };

  const handleCitySelect = (name: string) => {
    setCity(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cErr = !city.trim();
    const eErr = !email.trim() || !emailRegex.test(email.trim());
    setCityError(cErr);
    setEmailError(eErr);
    if (cErr || eErr) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), city: city.trim() }),
      });
    } catch { /* fail silently — show success regardless */ }
    setSubmitted(true);
  };

  return (
    <div style={{
      backgroundImage: "url('/Landing_Background.png')",
      backgroundSize: "cover",
      backgroundPosition: "bottom center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#b9b9b9",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>

      {/* HERO */}
      <div ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>

          {/* Logo */}
          <div style={{
            position: "absolute",
            top: isMobile ? "50svh" : "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "84%" : "60%",
            maxWidth: isMobile ? 380 : 700,
            zIndex: 5,
          }}>
            <svg viewBox="0 0 1144 167" fill="none" style={{ width: "100%", display: "block" }}>
              <path fillRule="evenodd" clipRule="evenodd" d={svgPath} fill="white" />
            </svg>
          </div>

          {/* Subheader */}
          <div style={{
            position: "absolute",
            top: isMobile ? "calc(50svh + 38px)" : "calc(58% + 30px)",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center", zIndex: 5,
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: isMobile ? "clamp(17px, 4.75vw, 23px)" : "clamp(9px, 1.4vw, 22px)",
            color: "#2c2c2c",
            lineHeight: 1.4,
            width: isMobile ? "70vw" : "15vw",
            minWidth: 140,
            whiteSpace: "normal",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 0.4s",
          }}>
            No profiles.<br />No pictures.<br />Just real world chemistry.
          </div>

          {/* Bouncing faces */}
          <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
            <img src="/imgGuy.png" alt="" style={{ position: "absolute", left: face1.x, top: face1.y, width: f1w, height: f1h, objectFit: "cover" }} />
            <img src="/imgGirl.png" alt="" style={{ position: "absolute", left: face2.x, top: face2.y, width: f2w, height: f2h, objectFit: "cover" }} />
          </div>

        </div>
      </div>

      {/* NOTES */}
      {isMobile ? (
        <div style={{ padding: "40px 24px 32px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          {NOTES.map((note, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                width: "100%", maxWidth: 300,
                background: "white",
                borderRadius: 10,
                padding: 13,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 320,
                transform: cardsVisible[i]
                  ? `rotate(${CARD_TILTS[i]}deg) translateX(${CARD_OFFSETS[i]}px)`
                  : `rotate(${CARD_TILTS[i]}deg) translateY(48px)`,
                opacity: cardsVisible[i] ? 1 : 0,
                transition: "opacity 0.55s ease, transform 0.55s ease",
              }}
            >
              <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 15.4, color: "#2c2c2c", margin: 0, lineHeight: 1.725, flex: 1 }}>
                &ldquo;{note.text}&rdquo;
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 13 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  <span style={{ background: "#efefef", borderRadius: 3, padding: "3px 6px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#2c2c2c" }}>{note.venue}</span>
                  <span style={{ background: "#efefef", borderRadius: 3, padding: "3px 6px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#2c2c2c" }}>{note.date}</span>
                </div>
                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#ff0163", fontVariantNumeric: "tabular-nums" }}>{countdowns[i]}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: 880, margin: "-70px auto 0", padding: "0 32px 32px", boxSizing: "border-box", position: "relative", zIndex: 20 }}>
          <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
            {NOTES.map((note, i) => {
              const desktopTilts = [-1.2, 0.8, -0.5];
              const desktopVertical = [24, 58, 20];
              return (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  flex: 1,
                  background: "white",
                  borderRadius: 10,
                  padding: 13,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 322,
                  marginTop: desktopVertical[i],
                  transform: cardsVisible[i]
                    ? `rotate(${desktopTilts[i]}deg)`
                    : `rotate(${desktopTilts[i]}deg) translateY(32px)`,
                  opacity: cardsVisible[i] ? 1 : 0,
                  transition: `opacity 0.55s ease ${i * 0.12}s, transform 0.55s ease ${i * 0.12}s`,
                }}
              >
                <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 15.4, color: "#2c2c2c", margin: 0, lineHeight: 1.725, flex: 1 }}>
                  &ldquo;{note.text}&rdquo;
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 13 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    <span style={{ background: "#efefef", borderRadius: 3, padding: "3px 6px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#2c2c2c" }}>{note.venue}</span>
                    <span style={{ background: "#efefef", borderRadius: 3, padding: "3px 6px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#2c2c2c" }}>{note.date}</span>
                  </div>
                  <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#ff0163", fontVariantNumeric: "tabular-nums" }}>{countdowns[i]}</span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SIGN UP */}
      <div style={{ maxWidth: 441, margin: "0 auto", padding: "60px 40px 80px", boxSizing: "border-box" }}>
        <h2 style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 32,
          fontWeight: "normal",
          color: "#2c2c2c",
          textAlign: "center",
          margin: "0 0 40px",
        }}>
          {submitted ? "You\u2019re on the list." : "Almost is coming."}
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* City — Nominatim autocomplete */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
              <label style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#2c2c2c" }}>
                Where are you based?
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => { setCityError(false); handleCityChange(e); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Your city"
                autoComplete="off"
                style={{
                  background: "white",
                  border: cityError ? "2px solid #ff0163" : "2px solid transparent",
                  borderRadius: 12,
                  padding: "0 16px", height: 50,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 16, color: "#2c2c2c", width: "100%",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "white", borderRadius: "0 0 12px 12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  zIndex: 100, overflow: "hidden",
                }}>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => handleCitySelect(s.name)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "11px 16px", border: "none", background: "none",
                        borderTop: i > 0 ? "1px solid #f0f0f0" : "none",
                        cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      <span style={{ fontSize: 15, color: "#2c2c2c" }}>{s.name}</span>
                      {s.secondary && (
                        <span style={{ fontSize: 12, color: "#9d9d9d", marginLeft: 6 }}>{s.secondary}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {cityError && (
                <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#ff0163", margin: 0 }}>
                  Please complete this field to continue
                </p>
              )}
            </div>

            {/* Email field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#2c2c2c" }}>
                You&apos;ll be the first to know.
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmailError(false); setEmail(e.target.value); }}
                style={{
                  background: "white",
                  border: emailError ? "2px solid #ff0163" : "2px solid transparent",
                  borderRadius: 12,
                  padding: "0 16px", height: 50,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 16, color: "#2c2c2c", width: "100%",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {emailError && (
                <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#ff0163", margin: 0 }}>
                  Please complete this field to continue
                </p>
              )}
            </div>

            <button type="submit" style={{
              background: "#ff0163", border: "none", borderRadius: 50,
              padding: "15px 25px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 16, color: "white", cursor: "pointer",
              width: "fit-content",
              display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1,
            }}>
              Get early access
            </button>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -18 }}>
            <style>{`@keyframes heart-pulse { 0%,100%{transform:scale(1);opacity:0.85} 50%{transform:scale(1.18);opacity:1} }`}</style>
            <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#2c2c2c", margin: "0 0 14px" }}>
              We&apos;ll be in touch before launch.
            </p>
            <img src="/Orb_Small.svg" alt="" style={{ width: 40, height: 40, animation: "heart-pulse 2s ease-in-out infinite" }} />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#2c2c2c",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 20 : 0,
        padding: isMobile ? "50px 20px" : "40px",
      }}>
        {isMobile ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <svg viewBox="0 0 1144 167" fill="none" style={{ width: 148, height: 22, flexShrink: 0 }}>
                <path fillRule="evenodd" clipRule="evenodd" d={svgPath} fill="white" />
              </svg>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <a href="https://www.tiktok.com/@almostdating" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" fill="white" />
                  </svg>
                </a>
                <a href="https://instagram.com/almostdating" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" />
                  </svg>
                </a>
              </div>
            </div>
            <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 12, color: "#f7f5f6", lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>Substrate Studio Ltd.</p>
              <p style={{ margin: 0 }}>©️ 2026 All rights reserved</p>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <svg viewBox="0 0 1144 167" fill="none" style={{ width: 148, height: 22, flexShrink: 0 }}>
                <path fillRule="evenodd" clipRule="evenodd" d={svgPath} fill="white" />
              </svg>
              <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 12, color: "#f7f5f6", lineHeight: 1.5 }}>
                <p style={{ margin: 0 }}>Substrate Studio Ltd.</p>
                <p style={{ margin: 0 }}>©️ 2026 All rights reserved</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <a href="https://www.tiktok.com/@almostdating" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" fill="white" />
                </svg>
              </a>
              <a href="https://instagram.com/almostdating" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" />
                </svg>
              </a>
            </div>
          </>
        )}
      </footer>

    </div>
  );
}
