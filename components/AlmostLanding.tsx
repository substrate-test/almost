'use client';

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const MAPS_LIBRARIES: ["places"] = ["places"];

const svgPath = "M1102.62 39.1387H1143.3L1132.55 76.8376H1091.87L1083.55 105.665C1079.68 119.302 1086.77 125.18 1100.74 125.18C1108.05 125.18 1113.93 123.849 1120.24 121.965L1110.49 155.89C1098.52 160.769 1078.9 165.094 1059.39 165.094C1012.39 165.094 990.78 143.583 1000.53 109.434L1009.84 76.8376L1010.44 74.8401H981.814H921.587C921.586 67.6343 916.929 61.65 904.294 60.7629C894.318 60.0976 887.336 63.3128 886.338 67.9696C884.898 73.9557 891.66 75.95 899.862 77.5021L943.865 85.8203C983.658 93.3598 995.186 108.881 989.422 129.504C982.772 152.455 949.407 167.2 883.898 165.98C834.864 165.14 800.312 155.797 790.782 136.56C771.876 153.822 739.871 166.202 693.997 166.202C647.687 166.202 607.057 151.52 593.724 124.745L583.126 161.768H502.21L519.613 101.009C523.714 86.5953 517.837 79.4996 507.528 79.4996C496.999 79.5004 488.908 87.0389 484.585 101.895L467.404 161.768H386.487L403.89 101.009C407.991 86.5956 402.118 79.4998 392.031 79.4996C381.169 79.4996 373.075 86.5944 368.642 101.895L351.46 161.768H122.404C121.849 157.111 121.628 150.236 122.182 144.803C111.209 156.445 93.141 166.202 61.8831 166.202C19.3203 166.202 -6.61701 147.244 1.4733 118.085C8.01309 96.353 30.2953 88.9234 66.5412 87.0386L137.034 83.2691L137.481 81.9361C140.14 74.0648 136.037 66.0831 120.632 66.0829C108.55 66.0829 102.01 72.4035 99.7929 79.6103H14.6648C22.2022 51.1156 58.5585 34.7048 118.414 34.7047C177.328 34.7047 212.667 48.051 217.718 73.5269L238.043 2.77274H320.067L309.62 39.1387H383.719L376.847 63.0886C391.811 44.6843 414.311 34.7048 438.917 34.7047C465.852 34.7047 482.037 45.3484 487.357 64.0854C500.326 46.9006 524.27 34.7047 550.871 34.7047C584.787 34.705 601.184 48.63 604.63 67.847C623.977 47.3989 659.964 34.7047 704.859 34.7047C757.433 34.7048 790.847 48.7886 804.472 69.8524C813.885 43.4996 855.446 33.9361 904.294 34.7047C935.835 35.2653 969.799 40.4581 987.615 54.4896L991.997 39.1387H1020.59L1028.02 13.306L1113.82 0L1102.62 39.1387ZM811.254 98.2877C810.983 101.106 810.475 103.977 809.716 106.887C808.045 112.997 805.224 119.014 801.234 124.737H867.16C866.828 135.602 875.807 139.483 887.556 140.037C900.413 140.591 905.4 137.154 906.62 132.609C907.617 128.617 905.846 124.958 893.211 122.629L846.099 114.094C830.528 111.251 818.598 105.682 811.254 98.2877ZM706.852 67.9696C691.003 67.9704 680.807 79.6098 675.93 95.3528C669.39 116.973 675.263 132.941 695.104 132.941C709.846 132.941 720.71 122.296 726.142 101.674C730.908 83.4902 726.028 67.9696 706.852 67.9696ZM103.008 107.551C92.5893 109.103 87.8221 111.984 86.2692 117.195C83.9415 125.732 91.2577 131.386 103.672 131.387C117.971 131.387 125.287 124.071 127.837 115.312L131.273 103.45L103.008 107.551Z";

const NOTE_DURATIONS_MS = [72, 68, 51].map(h => h * 3600 * 1000);

function formatCountdown(ms: number): string {
  const total = Math.max(0, ms);
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const NOTES = [
  {
    venue: "Fabric, London",
    date: "Sat 4 Aug",
    text: "You were at the bar on your own for a moment. Burgundy jacket. We caught eyes twice. I was going to come over and then my friends pulled me away. I thought about it the whole night.",
  },
  {
    venue: "Soho House",
    date: "Sat 4 Aug",
    text: "You were reading something on your phone and laughing to yourself. Dark eyes. White shirt. You looked up once and I looked away like an idiot. If this is you — what were you reading?",
  },
  {
    venue: "Victoria line",
    date: "Sat 4 Aug",
    text: "You got on at Brixton. We stood next to each other the whole way to King's Cross. You smiled when the doors nearly closed on someone's bag. I got off one stop too early.",
  },
];

export default function AlmostLanding() {
  const [face1, setFace1] = useState({ x: 120, y: 60, vx: 0.7, vy: 0.5 });
  const [face2, setFace2] = useState({ x: 980, y: 340, vx: -0.55, vy: 0.75 });
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const autocompleteWidgetRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded: mapsLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: MAPS_LIBRARIES,
  });
  const [visible, setVisible] = useState(false);
  const [endsAt] = useState(() => NOTE_DURATIONS_MS.map(d => Date.now() + d));
  const [countdowns, setCountdowns] = useState(() => NOTE_DURATIONS_MS.map(formatCountdown));
  const requestRef = useRef<number | null>(null);
  const vwRef = useRef(1440);
  const vhRef = useRef(810);

  const f1w = 159, f1h = 239;
  const f2w = 204, f2h = 240;

  useEffect(() => {
    const update = () => { vwRef.current = window.innerWidth; vhRef.current = window.innerHeight; };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
      const W = vwRef.current, H = vhRef.current;
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

  useEffect(() => {
    if (!mapsLoaded || !cityInputRef.current) return;
    autocompleteWidgetRef.current = new google.maps.places.Autocomplete(cityInputRef.current, {
      types: ["(cities)"],
      fields: ["name"],
    });
    autocompleteWidgetRef.current.addListener("place_changed", () => {
      const place = autocompleteWidgetRef.current?.getPlace();
      if (place?.name) setCity(place.name);
    });
  }, [mapsLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div style={{
      backgroundImage: "url('/Landing_Background.png')",
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#b9b9b9",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>

      {/* HERO — full viewport height, faces bounce to edges */}
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>

          {/* Logo — part of background, behind faces */}
          <div style={{
            position: "absolute", top: "42%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%", maxWidth: 700, zIndex: 5,
          }}>
            <svg viewBox="0 0 1144 167" fill="none" style={{ width: "100%", display: "block" }}>
              <path fillRule="evenodd" clipRule="evenodd" d={svgPath} fill="white" />
            </svg>
          </div>

          {/* Subheader — part of background, behind faces, 30% smaller font, narrowed to wrap last line */}
          <div style={{
            position: "absolute", top: "58%", left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center", zIndex: 5,
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "clamp(9px, 1.4vw, 22px)",
            color: "#2c2c2c",
            lineHeight: 1.2,
            width: "15vw",
            minWidth: 140,
            whiteSpace: "normal",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 0.4s",
          }}>
            No profiles.<br />No pictures.<br />Just real world chemistry.
          </div>

          {/* Bouncing faces — in foreground, positions in real viewport px */}
          <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
            <img src="/imgGuy.png" alt="" style={{ position: "absolute", left: face1.x, top: face1.y, width: f1w, height: f1h, objectFit: "cover" }} />
            <img src="/imgGirl.png" alt="" style={{ position: "absolute", left: face2.x, top: face2.y, width: f2w, height: f2h, objectFit: "cover" }} />
          </div>

        </div>
      </div>

      {/* NOTES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 40px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {NOTES.map((note, i) => (
            <div key={i} style={{
              flex: 1,
              background: "white",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 402,
              marginTop: i === 1 ? 83 : 0,
            }}>
              <p style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 18,
                color: "#2c2c2c",
                margin: 0,
                lineHeight: 1.725,
                flex: 1,
              }}>
                &ldquo;{note.text}&rdquo;
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ background: "#efefef", borderRadius: 4, padding: "4px 8px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 12, color: "#2c2c2c" }}>
                    {note.venue}
                  </span>
                  <span style={{ background: "#efefef", borderRadius: 4, padding: "4px 8px", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 12, color: "#2c2c2c" }}>
                    {note.date}
                  </span>
                </div>
                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 12, color: "#ff0163", fontVariantNumeric: "tabular-nums" }}>
                  {countdowns[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          Almost is coming.
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* City — Google Places Autocomplete widget */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 16, color: "#2c2c2c" }}>
                Enter your city
              </label>
              <input
                ref={cityInputRef}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                autoComplete="off"
                style={{
                  background: "white", border: "none", borderRadius: 12,
                  padding: "0 16px", height: 50,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 16, color: "#2c2c2c", width: "100%",
                  outline: "none", boxSizing: "border-box",
                }}
              />
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
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: "white", border: "none", borderRadius: 12,
                  padding: "0 16px", height: 50,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 16, color: "#2c2c2c", width: "100%",
                  outline: "none", boxSizing: "border-box",
                }}
              />
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
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 20, color: "#2c2c2c", margin: 0 }}>
              You&apos;re on the list.
            </p>
            <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 14, color: "#a0a0a0", marginTop: 8 }}>
              We&apos;ll be in touch before launch.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#2c2c2c",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "45px 40px",
      }}>
        <svg viewBox="0 0 1144 167" fill="none" style={{ width: 148, height: 22, flexShrink: 0 }}>
          <path fillRule="evenodd" clipRule="evenodd" d={svgPath} fill="white" />
        </svg>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="white" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
          </svg>
        </div>

        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 10, color: "#BCBCBC", textAlign: "left" }}>
          <p style={{ margin: 0 }}>Substrate Studio Ltd.</p>
          <p style={{ margin: 0 }}>©️ 2026 All rights reserved</p>
        </div>
      </footer>

    </div>
  );
}
