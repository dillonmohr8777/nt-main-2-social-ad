// Common.jsx — shared visual primitives for the Neat & Tidy ad
// Brand colors are mirrored here as JS constants so SVG `fill`/`stroke`
// attrs (which don't read CSS vars natively) can use them.

const C = {
  teal900: '#0F3531',
  teal800: '#164C46',
  teal700: '#235E58',
  teal500: '#3F8B82',
  teal300: '#A7D4C1', // fresh mint
  teal100: '#DCE6D8', // soft sage
  teal50:  '#ECF1EA',
  cream50: '#FBFAF6',
  cream100:'#F7F6F2', // warm white
  cream200:'#EDEBE3',
  ink800:  '#333333', // charcoal
  ink600:  '#5C5C5A',
  ink400:  '#8A8A86',
  ink200:  '#D9D7D0',
  white:   '#FFFFFF',
  // soft warm shadow
  shadow:  'rgba(22,76,70,0.18)',
};

// Brand wave line — used as section divider / transition device.
function BrandWave({ width = 320, color = C.teal800, opacity = 1, strokeWidth = 2.4, drawProgress = 1 }) {
  // SVG path-length animated draw. drawProgress ∈ [0,1].
  const len = 280;
  const dash = len;
  const offset = len * (1 - drawProgress);
  return (
    <svg width={width} height={width * (24/240)} viewBox="0 0 240 24" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M4 14 Q40 4 80 14 T160 14 T236 12"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
        strokeDasharray={dash} strokeDashoffset={offset}
        opacity={opacity}
      />
      <path d="M16 20 Q52 12 92 20 T172 20 T232 18"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
        strokeDasharray={dash} strokeDashoffset={offset * 1.1}
        opacity={opacity * 0.55}
      />
    </svg>
  );
}

// Brand sparkle (4-point star, brand-aligned) with a slow pulse.
function Sparkle({ size = 24, color = C.teal800, x = 0, y = 0, phase = 0, opacity = 1 }) {
  const t = (window.useTime ? useTime() : 0) + phase;
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ position: 'absolute', left: x, top: y, transform: `scale(${pulse})`, opacity, willChange: 'transform' }}>
      <path d="M12 2 L13.4 9 L20 10.4 L13.4 11.8 L12 19 L10.6 11.8 L4 10.4 L10.6 9 Z" fill={color}/>
    </svg>
  );
}

// Multiple sparkles in a cluster, each on its own phase.
function SparkleCluster({ children, items = [], opacity = 1 }) {
  return (
    <>
      {items.map((it, i) => (
        <Sparkle key={i} size={it.size} color={it.color || C.teal800} x={it.x} y={it.y}
                 phase={it.phase ?? i * 0.7} opacity={(it.opacity ?? 1) * opacity}/>
      ))}
    </>
  );
}

// Logo lockup — renders the full Neat and Tidy Tennessee logo
// (re-drawn from the brand mark + custom serif text).
function LogoLockup({ x = 0, y = 0, scale = 1, color = C.teal800, opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${scale})`, transformOrigin: 'top left',
      opacity,
      display: 'flex', alignItems: 'center', gap: 28,
      willChange: 'transform, opacity',
    }}>
      {/* House mark */}
      <svg width="180" height="170" viewBox="0 0 120 110" fill="none"
        stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 56 L60 22 L106 56 L106 90 Q106 96 100 96 L20 96 Q14 96 14 90 Z" strokeWidth="3.5" fill={C.cream50}/>
        <rect x="46" y="55" width="28" height="28" rx="2" strokeWidth="2.6"/>
        <line x1="60" y1="55" x2="60" y2="83" strokeWidth="2.6"/>
        <line x1="46" y1="69" x2="74" y2="69" strokeWidth="2.6"/>
        <g strokeWidth="2.4" fill="none">
          <path d="M92 14 L92 28 M85 21 L99 21"/>
          <path d="M104 30 L104 38 M100 34 L108 34"/>
        </g>
        <path d="M8 102 Q28 96 48 102 T88 102 T118 100" strokeWidth="2.6" fill="none"/>
      </svg>
      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 0.95 }}>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 600,
          fontSize: 92,
          color,
          letterSpacing: '-0.01em',
        }}>Neat</span>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 92,
          color,
          letterSpacing: '-0.01em',
          marginTop: -8,
        }}>and Tidy</span>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          fontSize: 30,
          color,
          letterSpacing: '0.32em',
          marginTop: 14,
        }}>TENNESSEE</span>
      </div>
    </div>
  );
}

// Eyebrow text (Montserrat ALL CAPS tracked).
function Eyebrow({ children, color = C.teal800, size = 22, x, y, opacity = 1, align = 'left' }) {
  const tx = align === 'center' ? '-50%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${tx})`,
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color, opacity,
      whiteSpace: 'nowrap',
    }}>{children}</div>
  );
}

// Headline text in Playfair (the brand serif). Optional italic.
function Headline({ children, x, y, size = 88, color = C.teal800, italic = false, weight = 500, align = 'left', opacity = 1, letterSpacing = '-0.015em', maxWidth }) {
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${tx})`,
      fontFamily: 'Playfair Display, serif',
      fontStyle: italic ? 'italic' : 'normal',
      fontWeight: weight,
      fontSize: size,
      letterSpacing,
      color, opacity,
      lineHeight: 1.05,
      textAlign: align === 'center' ? 'center' : align,
      maxWidth,
      textWrap: 'balance',
      willChange: 'opacity, transform',
    }}>{children}</div>
  );
}

// Drifting dust mote — slow vertical drift + sideways sway.
function DustMote({ x, y, size = 4, drift = 60, sway = 18, phase = 0, color = 'rgba(120,98,72,0.45)', opacity = 1 }) {
  const t = (window.useTime ? useTime() : 0);
  const dy = ((t * drift) + phase * 20) % 240 - 60;
  const dx = Math.sin((t + phase) * 1.3) * sway;
  return (
    <div style={{
      position: 'absolute',
      left: x + dx, top: y + dy,
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      opacity,
      filter: 'blur(0.6px)',
      willChange: 'transform',
    }}/>
  );
}

function DustField({ count = 18, opacity = 1, area = { x: 0, y: 0, w: 1080, h: 1200 } }) {
  const motes = React.useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: area.x + (i * 137) % area.w,
    y: area.y + (i * 211) % area.h,
    size: 3 + (i % 4),
    phase: i * 0.41,
    drift: 18 + (i % 5) * 6,
    sway: 8 + (i % 3) * 6,
  })), [count, area.x, area.y, area.w, area.h]);
  return (
    <>
      {motes.map((m, i) => (
        <DustMote key={i} {...m} opacity={opacity}/>
      ))}
    </>
  );
}

// Soft warm sun-gleam (large radial highlight) — used to "fill" rooms with light.
function SunGleam({ x, y, w = 700, h = 900, intensity = 0.6, color = '#FFE9B8' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: `radial-gradient(closest-side, ${color} 0%, rgba(255,233,184,0) 70%)`,
      opacity: intensity,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      willChange: 'opacity',
    }}/>
  );
}

// Wipe-mask reveal — clip-path travelling diagonal.
// progress 0 → 1: hidden → fully revealed
function WipeReveal({ progress = 0, soft = 12, children, style }) {
  // diagonal wipe; mask covers from -20% to 120%
  const p = progress * 140 - 20;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      WebkitMaskImage: `linear-gradient(115deg, #000 ${p - soft}%, transparent ${p + soft}%)`,
      maskImage: `linear-gradient(115deg, #000 ${p - soft}%, transparent ${p + soft}%)`,
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { C, BrandWave, Sparkle, SparkleCluster, LogoLockup, Eyebrow, Headline, DustMote, DustField, SunGleam, WipeReveal });
