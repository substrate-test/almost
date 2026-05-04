'use client';

import { useEffect, useRef, useState } from "react";

const svgPath = "M1102.62 39.1387H1143.3L1132.55 76.8376H1091.87L1083.55 105.665C1079.68 119.302 1086.77 125.18 1100.74 125.18C1108.05 125.18 1113.93 123.849 1120.24 121.965L1110.49 155.89C1098.52 160.769 1078.9 165.094 1059.39 165.094C1012.39 165.094 990.78 143.583 1000.53 109.434L1009.84 76.8376L1010.44 74.8401H981.814H921.587C921.586 67.6343 916.929 61.65 904.294 60.7629C894.318 60.0976 887.336 63.3128 886.338 67.9696C884.898 73.9557 891.66 75.95 899.862 77.5021L943.865 85.8203C983.658 93.3598 995.186 108.881 989.422 129.504C982.772 152.455 949.407 167.2 883.898 165.98C834.864 165.14 800.312 155.797 790.782 136.56C771.876 153.822 739.871 166.202 693.997 166.202C647.687 166.202 607.057 151.52 593.724 124.745L583.126 161.768H502.21L519.613 101.009C523.714 86.5953 517.837 79.4996 507.528 79.4996C496.999 79.5004 488.908 87.0389 484.585 101.895L467.404 161.768H386.487L403.89 101.009C407.991 86.5956 402.118 79.4998 392.031 79.4996C381.169 79.4996 373.075 86.5944 368.642 101.895L351.46 161.768H122.404C121.849 157.111 121.628 150.236 122.182 144.803C111.209 156.445 93.141 166.202 61.8831 166.202C19.3203 166.202 -6.61701 147.244 1.4733 118.085C8.01309 96.353 30.2953 88.9234 66.5412 87.0386L137.034 83.2691L137.481 81.9361C140.14 74.0648 136.037 66.0831 120.632 66.0829C108.55 66.0829 102.01 72.4035 99.7929 79.6103H14.6648C22.2022 51.1156 58.5585 34.7048 118.414 34.7047C177.328 34.7047 212.667 48.051 217.718 73.5269L238.043 2.77274H320.067L309.62 39.1387H383.719L376.847 63.0886C391.811 44.6843 414.311 34.7048 438.917 34.7047C465.852 34.7047 482.037 45.3484 487.357 64.0854C500.326 46.9006 524.27 34.7047 550.871 34.7047C584.787 34.705 601.184 48.63 604.63 67.847C623.977 47.3989 659.964 34.7047 704.859 34.7047C757.433 34.7048 790.847 48.7886 804.472 69.8524C813.885 43.4996 855.446 33.9361 904.294 34.7047C935.835 35.2653 969.799 40.4581 987.615 54.4896L991.997 39.1387H1020.59L1028.02 13.306L1113.82 0L1102.62 39.1387ZM811.254 98.2877C810.983 101.106 810.475 103.977 809.716 106.887C808.045 112.997 805.224 119.014 801.234 124.737H867.16C866.828 135.602 875.807 139.483 887.556 140.037C900.413 140.591 905.4 137.154 906.62 132.609C907.617 128.617 905.846 124.958 893.211 122.629L846.099 114.094C830.528 111.251 818.598 105.682 811.254 98.2877ZM706.852 67.9696C691.003 67.9704 680.807 79.6098 675.93 95.3528C669.39 116.973 675.263 132.941 695.104 132.941C709.846 132.941 720.71 122.296 726.142 101.674C730.908 83.4902 726.028 67.9696 706.852 67.9696ZM103.008 107.551C92.5893 109.103 87.8221 111.984 86.2692 117.195C83.9415 125.732 91.2577 131.386 103.672 131.387C117.971 131.387 125.287 124.071 127.837 115.312L131.273 103.45L103.008 107.551Z";

const NOTES = [
  {
    venue: "Fabric, London",
    time: "Saturday, 2am",
    text: "You were at the bar on your own for a moment. Burgundy jacket. We caught eyes twice. I was going to come over and then my friends pulled me away. I thought about it the whole night.",
  },
  {
    venue: "Soho House, Greek Street",
    time: "Thursday, late",
    text: "You were reading something on your phone and laughing to yourself. Dark eyes. White shirt. You looked up once and I looked away like an idiot. If this is you — what were you reading?",
  },
  {
    venue: "Victoria line, northbound",
    time: "Friday, 11pm",
    text: "You got on at Brixton. We stood next to each other the whole way to King's Cross. You smiled when the doors nearly closed on someone's bag. I got off one stop too early.",
  },
];

export default function AlmostLanding() {
  const [face1, setFace1] = useState({ x: 80, y: 80, vx: 0.7, vy: 0.5 });
  const [face2, setFace2] = useState({ x: 520, y: 180, vx: -0.55, vy: 0.75 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const requestRef = useRef<number | null>(null);

  const W = 1440, H = 810;
  const f1w = 180, f1h = 216;
  const f2w = 240, f2h = 288;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const animate = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Courier New', Courier, monospace", background: "#0a0a0a", minHeight: "100vh", color: "#f5f0e8", overflowX: "hidden" }}>

      {/* HERO — animation */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", overflow: "hidden", background: "#0a0a0a" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Background */}
          <img src="/Landing_Background.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />

          {/* Bouncing faces */}
          <div style={{ position: "absolute", inset: 0, width: W, height: H, transform: "scale(var(--hero-scale, 1))", transformOrigin: "top left" }}>
            <img src="/imgGuy.png" alt="" style={{ position: "absolute", left: face1.x, top: face1.y, width: f1w, height: f1h, objectFit: "cover", filter: "grayscale(20%)" }} />
            <img src="/imgGirl.png" alt="" style={{ position: "absolute", left: face2.x, top: face2.y, width: f2w, height: f2h, objectFit: "cover", filter: "grayscale(20%)" }} />
          </div>

          {/* Logo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", maxWidth: 700, zIndex: 10 }}>
            <svg viewBox="0 0 1143.3 166.202" fill="none" style={{ width: "100%", display: "block" }}>
              <path clipRule="evenodd" d={svgPath} fill="#FE0155" fillRule="evenodd" />
            </svg>
          </div>

          {/* Headline */}
          <div style={{
            position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)",
            textAlign: "center", zIndex: 10, whiteSpace: "nowrap",
            fontSize: "clamp(14px, 2vw, 22px)", letterSpacing: "0.05em",
            color: "#f5f0e8", textTransform: "uppercase", opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 0.4s"
          }}>
            For the one that almost got away
          </div>
        </div>

        {/* Hero scale fix */}
        <style>{`
          @media (max-width: 1440px) {
            :root { --hero-scale: calc(100vw / 1440) }
          }
        `}</style>
      </div>

      {/* NOTES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {NOTES.map((note, i) => (
            <div key={i} style={{
              border: "1px solid rgba(245,240,232,0.12)",
              padding: "28px 28px 24px",
              background: "rgba(245,240,232,0.03)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.8s ease ${0.6 + i * 0.15}s, transform 0.8s ease ${0.6 + i * 0.15}s`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>
                <span>{note.venue}</span>
                <span>{note.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#f5f0e8", opacity: 0.85 }}>{note.text}</p>
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(245,240,232,0.08)", paddingTop: 16 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#FE0155", cursor: "pointer" }}>Make your move →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WAITLIST */}
      <div style={{
        maxWidth: 560, margin: "0 auto", padding: "20px 40px 100px",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 1.1s"
      }}>
        {!submitted ? (
          <>
            <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
              London launch — coming soon
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, border: "1px solid rgba(245,240,232,0.2)" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1, padding: "14px 20px", background: "transparent",
                  border: "none", outline: "none", color: "#f5f0e8",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 14, letterSpacing: "0.05em"
                }}
              />
              <button type="submit" style={{
                padding: "14px 24px", background: "#FE0155", border: "none",
                color: "#fff", fontFamily: "'Courier New', Courier, monospace",
                fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", whiteSpace: "nowrap"
              }}>
                Get early access
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: "32px 0" }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.9 }}>You're on the list.</p>
            <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.4, marginTop: 8 }}>We'll be in touch before launch.</p>
          </div>
        )}
      </div>

    </div>
  );
}
