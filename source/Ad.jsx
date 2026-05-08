// Ad.jsx — main composition for the Neat & Tidy Tennessee 9:16 social ad.
// Total runtime: 28 seconds.
//
// Timeline:
//   0.0 –  4.5  Tired home (kitchen + bathroom clutter)         "Your weekend is not for chores."
//   4.5 –  6.5  Brand wipes in (wave + logo)
//   6.5 – 14.0  Reset montage (kitchen → bathroom → living room) "We reset the house."
//  14.0 – 22.0  Calm with homeowner + coffee                     "You enjoy the calm."
//  22.0 – 28.0  End card (logo + CTA + URL)

const STAGE_W = 1080;
const STAGE_H = 1920;
const DURATION = 28;

// ── Tired-home phase: cluttered kitchen → bathroom ───────────────
function TiredPhase() {
  const { localTime, duration } = useSprite();
  // Kitchen visible 0-2.6, bathroom visible 2.4-4.4 (small overlap = soft cross)
  const kOpacity = localTime < 2.4
    ? 1
    : localTime < 2.7 ? 1 - (localTime - 2.4) / 0.3 : 0;
  const bOpacity = localTime < 2.4
    ? 0
    : localTime < 2.7 ? (localTime - 2.4) / 0.3 : 1;

  // very faint sun (overcast / morning haze)
  const sun = 0.05;

  // Slow camera drift on each scene
  const kDrift = localTime * 6;       // pan down 0-2.6 → ~16px
  const bDrift = (localTime - 2.4) * 8; // pan down

  return (
    <>
      {/* Kitchen — cluttered */}
      <div style={{
        position: 'absolute', inset: 0, opacity: kOpacity,
        transform: `translateY(${-kDrift}px) scale(${1.04 + localTime * 0.005})`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      }}>
        <KitchenScene progress={0} sunIntensity={sun}/>
        <DustField count={22} opacity={0.7} area={{ x: 80, y: 200, w: 920, h: 800 }}/>
      </div>

      {/* Bathroom — cluttered */}
      <div style={{
        position: 'absolute', inset: 0, opacity: bOpacity,
        transform: `translateY(${-bDrift}px) scale(${1.04 + (localTime-2.4) * 0.005})`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      }}>
        <BathroomScene progress={0} sunIntensity={sun}/>
        <DustField count={14} opacity={0.5} area={{ x: 200, y: 200, w: 700, h: 800 }}/>
      </div>

      {/* Cool overcast wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,53,49,0.18) 0%, rgba(15,53,49,0.04) 60%, rgba(15,53,49,0.10) 100%)',
        pointerEvents: 'none',
      }}/>
    </>
  );
}

// ── Brand reveal — wave draws across, logo lockup pops in centered ──
function BrandReveal() {
  const { localTime, duration } = useSprite();
  // wave draw 0-0.9, logo entry 0.5-1.6, hold 1.6-1.9, exit 1.9-2.0
  const waveDraw = clamp(localTime / 0.9, 0, 1);
  let logoOpacity = 0, logoY = 30;
  if (localTime > 0.5) {
    const t = clamp((localTime - 0.5) / 0.9, 0, 1);
    logoOpacity = Easing.easeOutQuart(t);
    logoY = (1 - Easing.easeOutQuart(t)) * 30;
  }
  if (localTime > duration - 0.25) {
    const t = clamp((localTime - (duration - 0.25)) / 0.25, 0, 1);
    logoOpacity = 1 - t;
  }

  return (
    <>
      {/* Cream wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${C.cream50} 0%, ${C.cream100} 100%)`,
      }}/>

      {/* Brand wave drawing — sits ABOVE the logo */}
      <div style={{
        position: 'absolute', left: '50%', top: 600, transform: 'translate(-50%, -50%)',
      }}>
        <BrandWave width={780} drawProgress={waveDraw} strokeWidth={3} color={C.teal800}/>
      </div>

      {/* Logo lockup centered */}
      <div style={{
        position: 'absolute', left: 130, top: 720,
        opacity: logoOpacity,
        transform: `translateY(${logoY}px)`,
      }}>
        <LogoLockup scale={1.05} color={C.teal800}/>
      </div>

      {/* Tagline below logo */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1170, textAlign: 'center',
        opacity: clamp((localTime - 0.9) / 0.6, 0, 1) * (localTime > duration - 0.25 ? 1 - (localTime - (duration - 0.25))/0.25 : 1),
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: 56, color: C.teal800, fontWeight: 500, letterSpacing: '-0.01em',
        }}>
          Thoughtful cleaning.
        </div>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: 56, color: C.teal800, fontWeight: 500, letterSpacing: '-0.01em',
          marginTop: 4,
        }}>
          Beautifully simple.
        </div>
      </div>

      {/* sparkle accents */}
      <div style={{ opacity: clamp((localTime - 0.7) / 0.6, 0, 1) }}>
        <SparkleCluster items={[
          { x: 220, y: 660, size: 30, phase: 0 },
          { x: 880, y: 720, size: 22, phase: 0.6 },
          { x: 760, y: 1100, size: 18, phase: 1.2 },
          { x: 200, y: 1140, size: 16, phase: 0.4 },
        ]}/>
      </div>
    </>
  );
}

// ── Reset phase: kitchen → bathroom → living room (each fully resets) ──
function ResetPhase() {
  const { localTime, duration } = useSprite();
  // duration ~ 7.5s.
  // Kitchen: 0.0-2.6 (reset 0.3-2.0)
  // Bathroom: 2.6-4.8 (reset 2.9-4.4)
  // Living room (without homeowner yet): 4.8-7.5 (reset 5.0-6.8)
  const inSegment = (s, e) => localTime >= s && localTime <= e;

  // Kitchen
  const kVis = inSegment(-0.1, 2.8) ? clamp(1 - Math.max(0, (localTime - 2.6) / 0.2), 0, 1) * clamp((localTime + 0.1)/0.2, 0, 1) : 0;
  const kProg = clamp((localTime - 0.3) / 1.7, 0, 1);
  const kSun = clamp((localTime - 0.6) / 1.6, 0, 1);

  // Bathroom
  const bVis = inSegment(2.5, 4.9) ? clamp((localTime - 2.5)/0.2, 0, 1) * clamp(1 - Math.max(0, (localTime - 4.7) / 0.2), 0, 1) : 0;
  const bProg = clamp((localTime - 2.9) / 1.5, 0, 1);
  const bSun = clamp((localTime - 3.1) / 1.5, 0, 1);

  // Living room (tidy, no homeowner yet)
  const lVis = localTime > 4.7 ? clamp((localTime - 4.7)/0.2, 0, 1) : 0;
  const lProg = clamp((localTime - 5.0) / 1.8, 0, 1);
  const lSun = clamp((localTime - 5.4) / 1.8, 0, 1);

  // Subtle camera scale on each scene for life
  const camScale = (segStart) => 1.0 + Math.max(0, (localTime - segStart)) * 0.012;

  return (
    <>
      {kVis > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: kVis,
          transform: `scale(${camScale(0)})`, transformOrigin: 'center center', willChange: 'transform, opacity' }}>
          <KitchenScene progress={kProg} sunIntensity={kSun}/>
        </div>
      )}
      {bVis > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: bVis,
          transform: `scale(${camScale(2.6)})`, transformOrigin: 'center center', willChange: 'transform, opacity' }}>
          <BathroomScene progress={bProg} sunIntensity={bSun}/>
        </div>
      )}
      {lVis > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: lVis,
          transform: `scale(${camScale(4.8)})`, transformOrigin: 'center center', willChange: 'transform, opacity' }}>
          <LivingRoomScene progress={lProg} sunIntensity={lSun}/>
        </div>
      )}
    </>
  );
}

// ── Calm phase: living room with homeowner + coffee ──
function CalmPhase() {
  const { localTime, duration } = useSprite();
  // Slow ken-burns: scale 1.02 → 1.10 over 8s
  const t01 = clamp(localTime / duration, 0, 1);
  const scale = 1.02 + 0.08 * Easing.easeInOutSine(t01);
  // sun strengthens, peaks in middle
  const sun = 0.45 + 0.4 * Math.sin(Math.PI * t01);

  // Cross-fade in
  const fadeIn = clamp(localTime / 0.6, 0, 1);
  const fadeOut = clamp(1 - Math.max(0, (localTime - (duration - 0.6))/0.6), 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: fadeIn * fadeOut,
      transform: `scale(${scale})`,
      transformOrigin: '60% 65%',
      willChange: 'transform, opacity',
    }}>
      <LivingRoomScene progress={1} sunIntensity={sun} showHomeowner={true}/>
    </div>
  );
}

// ── End card ──
function EndCard() {
  const { localTime, duration } = useSprite();
  // build-in: bg 0-0.5, logo 0.4-1.2, headline 1.0-1.7, cta 1.5-2.1, url 1.9-2.5
  const bg   = clamp(localTime / 0.5, 0, 1);
  const logo = clamp((localTime - 0.4) / 0.8, 0, 1);
  const head = clamp((localTime - 1.0) / 0.7, 0, 1);
  const cta  = clamp((localTime - 1.5) / 0.6, 0, 1);
  const url  = clamp((localTime - 1.9) / 0.6, 0, 1);

  // gentle ambient sparkle
  const sparkleOpacity = clamp((localTime - 1.2) / 0.6, 0, 1);

  return (
    <>
      {/* deep teal panel sliding up */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${(1 - bg) * STAGE_H}px)`,
        background: `linear-gradient(180deg, ${C.teal800} 0%, ${C.teal900} 100%)`,
      }}/>

      {/* subtle wave decoration top */}
      <div style={{
        position: 'absolute', left: 60, top: 220, opacity: bg * 0.7,
      }}>
        <BrandWave width={420} color={C.teal300} drawProgress={bg} strokeWidth={2.4}/>
      </div>
      <div style={{
        position: 'absolute', right: 60, bottom: 260, opacity: bg * 0.5,
        transform: 'scaleX(-1)',
      }}>
        <BrandWave width={420} color={C.teal300} drawProgress={bg} strokeWidth={2.4}/>
      </div>

      {/* Logo (inverted — cream on teal) */}
      <div style={{
        position: 'absolute', left: 130, top: 540,
        opacity: logo,
        transform: `translateY(${(1-logo)*20}px)`,
      }}>
        <LogoLockup scale={1.0} color={C.cream100}/>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center',
        opacity: head, transform: `translateY(${(1-head)*16}px)`,
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: 60, color: C.cream100, fontWeight: 500, letterSpacing: '-0.01em',
        }}>A cleaner home.</div>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: 60, color: C.cream100, fontWeight: 500, letterSpacing: '-0.01em',
          marginTop: 4,
        }}>A calmer life.</div>
      </div>

      {/* CTA pill */}
      <div style={{
        position: 'absolute', left: '50%', top: 1240,
        transform: `translate(-50%, ${(1-cta)*20}px)`,
        opacity: cta,
        background: C.cream100,
        padding: '26px 56px',
        borderRadius: 999,
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 700,
        fontSize: 30,
        color: C.teal800,
        letterSpacing: '0.02em',
        boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
      }}>
        Start recurring service
      </div>

      {/* small mint badge above CTA */}
      <div style={{
        position: 'absolute', left: '50%', top: 1180,
        transform: `translate(-50%, ${(1-cta)*12}px)`,
        opacity: cta * 0.95,
        fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 18,
        color: C.teal300, letterSpacing: '0.22em', textTransform: 'uppercase',
      }}>
        Middle Tennessee
      </div>

      {/* URL */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center',
        opacity: url,
        fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 28,
        color: C.teal300, letterSpacing: '0.04em',
      }}>
        neatandtidytn.com
      </div>

      {/* Trust badges row */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1500,
        display: 'flex', justifyContent: 'center', gap: 50,
        opacity: url,
        fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 16,
        color: C.cream100, letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        <span style={{ opacity: 0.85 }}>Licensed &amp; insured</span>
        <span style={{ opacity: 0.85 }}>Background checked</span>
      </div>

      {/* sparkles for life */}
      <div style={{ opacity: sparkleOpacity }}>
        <SparkleCluster items={[
          { x: 880, y: 480, size: 28, color: C.teal300, phase: 0 },
          { x: 200, y: 980, size: 20, color: C.teal300, phase: 0.6 },
          { x: 940, y: 1320, size: 22, color: C.teal300, phase: 1.0 },
          { x: 120, y: 1260, size: 16, color: C.teal300, phase: 1.4 },
        ]}/>
      </div>
    </>
  );
}

// ── On-screen text overlays (positioned in safe zone, not over faces) ──
function TextOverlays() {
  return (
    <>
      {/* "Your weekend is not for chores." — over tired home */}
      <Sprite start={0.7} end={4.2}>
        {({ localTime, duration }) => {
          const inT = clamp(localTime / 0.7, 0, 1);
          const outT = clamp(1 - Math.max(0, localTime - (duration - 0.6))/0.6, 0, 1);
          const op = inT * outT;
          const ty = (1 - inT) * 16;
          return (
            <div style={{
              position: 'absolute', left: 80, top: 220, width: 920,
              opacity: op, transform: `translateY(${ty}px)`,
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 22,
                color: C.teal800, letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: 18,
              }}>Saturday morning</div>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontWeight: 500, fontSize: 84, color: C.teal800,
                lineHeight: 1.05, letterSpacing: '-0.015em',
                textWrap: 'balance',
              }}>Your weekend is&nbsp;not for chores.</div>
            </div>
          );
        }}
      </Sprite>

      {/* "We reset the house." — across reset montage, repositions slightly */}
      <Sprite start={6.9} end={13.8}>
        {({ localTime, duration }) => {
          const inT = clamp(localTime / 0.6, 0, 1);
          const outT = clamp(1 - Math.max(0, localTime - (duration - 0.6))/0.6, 0, 1);
          const op = inT * outT;
          const ty = (1 - inT) * 14;
          return (
            <div style={{
              position: 'absolute', left: 80, top: 200, width: 920,
              opacity: op, transform: `translateY(${ty}px)`,
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 22,
                color: C.teal800, letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: 18,
              }}>How we work</div>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontWeight: 500, fontSize: 92, color: C.teal800,
                lineHeight: 1.0, letterSpacing: '-0.015em',
              }}>We reset the&nbsp;house.</div>
              {/* small process chips fade in late */}
              <div style={{
                marginTop: 26,
                display: 'flex', gap: 12, flexWrap: 'wrap',
                opacity: clamp((localTime - 1.0) / 0.6, 0, 1),
              }}>
                {['Quote', 'Book', 'We clean', 'You approve'].map((label, i) => (
                  <div key={i} style={{
                    padding: '10px 22px',
                    background: 'rgba(247, 246, 242, 0.9)',
                    color: C.teal800,
                    borderRadius: 999,
                    fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 22,
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                  }}>{label}</div>
                ))}
              </div>
            </div>
          );
        }}
      </Sprite>

      {/* "You enjoy the calm." — over calm scene, lower-third for breathing room */}
      <Sprite start={14.4} end={21.6}>
        {({ localTime, duration }) => {
          const inT = clamp(localTime / 0.7, 0, 1);
          const outT = clamp(1 - Math.max(0, localTime - (duration - 0.6))/0.6, 0, 1);
          const op = inT * outT;
          const ty = (1 - inT) * 18;
          return (
            <div style={{
              position: 'absolute', left: 80, top: 220, width: 920,
              opacity: op, transform: `translateY(${ty}px)`,
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 22,
                color: C.teal800, letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: 18,
              }}>Home reset</div>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontWeight: 500, fontSize: 92, color: C.teal800,
                lineHeight: 1.0, letterSpacing: '-0.015em',
              }}>You enjoy the&nbsp;calm.</div>
            </div>
          );
        }}
      </Sprite>
    </>
  );
}

// ── Persistent footer brand chip during phases (except end card) ──
function BrandChip() {
  return (
    <Sprite start={0} end={22.0}>
      {({ localTime, duration }) => {
        // small mark + "Neat and Tidy Tennessee" ribbon at bottom-left
        // hide during brand reveal (4.5-6.5)
        const fade = (localTime > 4.4 && localTime < 6.6) ? 0 : 1;
        const op = 0.9 * fade;
        return (
          <div style={{
            position: 'absolute', left: 60, top: 1780,
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: op,
            transition: 'opacity 0.2s linear',
          }}>
            <svg width="44" height="42" viewBox="0 0 120 110" fill="none"
              stroke={C.teal800} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 56 L60 22 L106 56 L106 90 Q106 96 100 96 L20 96 Q14 96 14 90 Z"/>
              <rect x="46" y="55" width="28" height="28" rx="2" strokeWidth="3.4"/>
              <line x1="60" y1="55" x2="60" y2="83" strokeWidth="3.4"/>
              <line x1="46" y1="69" x2="74" y2="69" strokeWidth="3.4"/>
              <g strokeWidth="3" fill="none">
                <path d="M92 14 L92 28 M85 21 L99 21"/>
              </g>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.0 }}>
              <span style={{
                fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontSize: 30, color: C.teal800, fontWeight: 500,
              }}>Neat and Tidy</span>
              <span style={{
                fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14,
                color: C.teal800, letterSpacing: '0.32em', marginTop: 4,
              }}>TENNESSEE</span>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// Soft vignette to keep type readable.
function Vignette() {
  // very light cream wash to keep dark-green type readable; no dark vignette
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 60%, rgba(247,246,242,0.18) 100%)',
      pointerEvents: 'none',
    }}/>
  );
}

// ── The full ad ──
function Ad() {
  return (
    <Stage width={STAGE_W} height={STAGE_H} duration={DURATION}
           background={C.cream100} loop={true} persistKey="ntt-ad">
      {/* Phase scenes */}
      <Sprite start={0} end={4.5}><TiredPhase/></Sprite>
      <Sprite start={4.4} end={6.6}><BrandReveal/></Sprite>
      <Sprite start={6.5} end={14.0}><ResetPhase/></Sprite>
      <Sprite start={14.0} end={22.0}><CalmPhase/></Sprite>
      <Sprite start={21.9} end={28.0}><EndCard/></Sprite>

      {/* Vignette + text overlays + brand chip — ABOVE scenes */}
      <Sprite start={0} end={22.0}><Vignette/></Sprite>
      <TextOverlays/>
      <BrandChip/>
    </Stage>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Ad/>);
