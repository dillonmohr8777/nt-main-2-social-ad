// LivingRoomScene.jsx — cozy living room with sofa, pillows, coffee table.
// homeowner sits on the sofa with a coffee in the calm phase.
// Progress 0 = cluttered/dim; 1 = tidy and bright with homeowner relaxing.

function LivingRoomScene({ progress = 0, sunIntensity = 0, opacity = 1, showHomeowner = false }) {
  const stagger = (s, e) => clamp((progress - s) / Math.max(0.001, e - s), 0, 1);
  const blanket = stagger(0.05, 0.30);
  const cups    = stagger(0.20, 0.45);
  const pillows = stagger(0.35, 0.65); // pillows go from messy → arranged
  const books   = stagger(0.50, 0.80);

  // Pillow positions interpolate from messy (rotated, off-center) → tidy
  const lerp = (a, b, t) => a + (b - a) * t;
  // Pillows sit on seat cushion (top y=860) — pillow center y must be ~835 (40px tall, bottom flush with cushion)
  const p1 = {
    x: lerp(310, 290, pillows),
    y: lerp(840, 835, pillows),
    rot: lerp(-18, -4, pillows),
  };
  const p2 = {
    x: lerp(440, 460, pillows),
    y: lerp(830, 835, pillows),
    rot: lerp(14, 4, pillows),
  };
  const p3 = {
    x: lerp(620, 640, pillows),
    y: lerp(845, 835, pillows),
    rot: lerp(-22, -2, pillows),
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, willChange: 'opacity' }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1ECE0"/>
            <stop offset="100%" stopColor="#E2DBC8"/>
          </linearGradient>
          <linearGradient id="lFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C2A982"/>
            <stop offset="100%" stopColor="#9D8460"/>
          </linearGradient>
          <linearGradient id="lSofa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8E1D0"/>
            <stop offset="100%" stopColor="#C8BFA6"/>
          </linearGradient>
          <linearGradient id="lWindowSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE9B8"/>
            <stop offset="100%" stopColor="#F2D78A"/>
          </linearGradient>
          <linearGradient id="lRug" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9C8A6"/>
            <stop offset="100%" stopColor="#B89F77"/>
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width="1080" height="1000" fill="url(#lWall)"/>
        <rect x="0" y="0" width="1080" height="1000" fill="#FFE9B8" opacity={sunIntensity * 0.20}/>

        {/* Floor */}
        <rect x="0" y="1000" width="1080" height="920" fill="url(#lFloor)"/>
        <g stroke="#7C6648" strokeWidth="1.5" opacity="0.35">
          {[1080,1170,1260,1360,1460,1560,1660,1760,1860].map(y => <line key={y} x1="0" y1={y} x2="1080" y2={y}/>)}
          {[180,420,660,900].map(x => <line key={x} x1={x} y1="1000" x2={x} y2="1920"/>)}
        </g>

        {/* Rug — large area rug filling lower frame */}
        <ellipse cx="540" cy="1380" rx="560" ry="230" fill="url(#lRug)"/>
        <ellipse cx="540" cy="1380" rx="500" ry="190" fill="none" stroke="#A8895C" strokeWidth="2" opacity="0.55"/>
        <ellipse cx="540" cy="1380" rx="440" ry="150" fill="none" stroke="#A8895C" strokeWidth="1.5" opacity="0.4"/>

        {/* Tall window (left) — sunlight pouring in */}
        <g>
          <rect x="60" y="120" width="280" height="540" rx="6" fill={C.teal800} opacity="0.18"/>
          <rect x="74" y="134" width="252" height="512" rx="2" fill="url(#lWindowSky)"/>
          <line x1="200" y1="134" x2="200" y2="646" stroke={C.teal800} strokeOpacity="0.35" strokeWidth="6"/>
          <line x1="74" y1="390" x2="326" y2="390" stroke={C.teal800} strokeOpacity="0.35" strokeWidth="6"/>
          {/* curtain */}
          <path d="M40 120 Q56 400 40 660 L70 660 L70 120 Z" fill={C.cream100} opacity="0.85"/>
          <path d="M340 120 Q356 400 340 660 L370 660 L370 120 Z" fill={C.cream100} opacity="0.85"/>
        </g>

        {/* Wall art (right above sofa) */}
        <g>
          <rect x="700" y="200" width="180" height="240" rx="4" fill={C.cream50} stroke={C.teal800} strokeWidth="3"/>
          <rect x="720" y="220" width="140" height="200" fill={C.teal100}/>
          <path d="M720 380 Q760 320 800 350 Q840 280 860 360 L860 420 L720 420 Z" fill={C.teal700}/>
          <circle cx="820" cy="260" r="14" fill="#F2D78A"/>
        </g>

        {/* Sofa */}
        <g>
          {/* shadow */}
          <ellipse cx="540" cy="1080" rx="440" ry="14" fill="rgba(22,76,70,0.18)"/>
          {/* back */}
          <rect x="200" y="700" width="680" height="180" rx="20" fill="url(#lSofa)"/>
          {/* seat cushion */}
          <rect x="180" y="860" width="720" height="160" rx="22" fill="#D8CFB6"/>
          <line x1="420" y1="870" x2="420" y2="1015" stroke={C.ink400} strokeOpacity="0.4" strokeWidth="2"/>
          <line x1="660" y1="870" x2="660" y2="1015" stroke={C.ink400} strokeOpacity="0.4" strokeWidth="2"/>
          {/* arms */}
          <rect x="160" y="780" width="60" height="240" rx="14" fill="#C5BB9F"/>
          <rect x="860" y="780" width="60" height="240" rx="14" fill="#C5BB9F"/>
          {/* legs */}
          <rect x="190" y="1020" width="20" height="20" fill="#5C4A33"/>
          <rect x="870" y="1020" width="20" height="20" fill="#5C4A33"/>
        </g>

        {/* Pillows (3) — animate from messy to tidy */}
        <g transform={`translate(${p1.x} ${p1.y}) rotate(${p1.rot})`}>
          <rect x="-50" y="-40" width="100" height="80" rx="14" fill={C.teal700}/>
          <rect x="-46" y="-36" width="92"  height="72" rx="11" fill="none" stroke={C.cream100} strokeOpacity="0.4" strokeWidth="2"/>
        </g>
        <g transform={`translate(${p2.x} ${p2.y}) rotate(${p2.rot})`}>
          <rect x="-55" y="-44" width="110" height="88" rx="14" fill={C.teal300}/>
          <rect x="-50" y="-39" width="100" height="78" rx="10" fill="none" stroke={C.teal800} strokeOpacity="0.3" strokeWidth="2"/>
        </g>
        <g transform={`translate(${p3.x} ${p3.y}) rotate(${p3.rot})`}>
          <rect x="-50" y="-40" width="100" height="80" rx="14" fill={C.cream100}/>
          {/* pinstripe */}
          <line x1="-46" y1="-36" x2="-46" y2="36" stroke={C.teal700} strokeOpacity="0.4" strokeWidth="2"/>
          <line x1="-30" y1="-36" x2="-30" y2="36" stroke={C.teal700} strokeOpacity="0.4" strokeWidth="2"/>
          <line x1="-14" y1="-36" x2="-14" y2="36" stroke={C.teal700} strokeOpacity="0.4" strokeWidth="2"/>
          <line x1="2"   y1="-36" x2="2"   y2="36" stroke={C.teal700} strokeOpacity="0.4" strokeWidth="2"/>
        </g>

        {/* Throw blanket — folded neatly when clean, draped messily when dirty */}
        <g opacity={1 - blanket * 0.6}>
          <path d="M740 880 Q780 870 820 880 Q840 920 800 950 Q760 970 720 940 Q700 910 740 880 Z"
                fill={C.teal100} opacity={1 - blanket}/>
          {/* folded version (bottom of sofa, neat) */}
          <g opacity={blanket}>
            <rect x="730" y="990" width="140" height="22" rx="3" fill={C.teal100}/>
            <rect x="730" y="990" width="140" height="6" fill={C.teal300} opacity="0.6"/>
          </g>
        </g>

        {/* Coffee table */}
        <g>
          <ellipse cx="540" cy="1380" rx="180" ry="14" fill="rgba(0,0,0,0.18)"/>
          <rect x="380" y="1300" width="320" height="30" rx="3" fill="#7A6347"/>
          <rect x="380" y="1300" width="320" height="8"  fill="#A88962"/>
          <rect x="400" y="1330" width="14" height="60" fill="#5C4A33"/>
          <rect x="666" y="1330" width="14" height="60" fill="#5C4A33"/>
        </g>

        {/* Plant on side table */}
        <g>
          <rect x="950" y="1180" width="80" height="80" rx="4" fill="#7A6347"/>
          <rect x="970" y="1130" width="48" height="54" rx="6" fill="#A88962"/>
          <g fill={C.teal700}>
            <ellipse cx="982" cy="1090" rx="14" ry="34"/>
            <ellipse cx="998" cy="1078" rx="16" ry="40"/>
            <ellipse cx="1014" cy="1094" rx="12" ry="30"/>
          </g>
          <ellipse cx="998" cy="1132" rx="22" ry="4" fill="#5C4733"/>
        </g>

        {/* CLUTTER on coffee table — mugs, snack bowl, books */}
        <g opacity={1 - cups}>
          {/* knocked-over mug */}
          <g transform="rotate(-30 460 1290)">
            <rect x="440" y="1278" width="40" height="24" rx="4" fill={C.cream100}/>
            <path d="M480 1282 Q492 1282 492 1290 Q492 1298 480 1298" stroke={C.cream100} strokeWidth="4" fill="none"/>
          </g>
          {/* spill */}
          <ellipse cx="430" cy="1300" rx="20" ry="3" fill="#7A553A" opacity="0.6"/>
          {/* second mug */}
          <rect x="540" y="1278" width="36" height="22" rx="3" fill={C.cream100}/>
          <path d="M576 1282 Q586 1282 586 1290 Q586 1298 576 1298" stroke={C.cream100} strokeWidth="4" fill="none"/>
        </g>

        {/* CLUTTER books spilled across table */}
        <g opacity={1 - books}>
          <g transform="rotate(8 620 1298)">
            <rect x="600" y="1286" width="60" height="14" rx="1.5" fill={C.teal800}/>
            <rect x="600" y="1286" width="60" height="3"  fill={C.teal300}/>
          </g>
          <g transform="rotate(-12 660 1294)">
            <rect x="640" y="1290" width="58" height="10" rx="1.5" fill="#A03B2E"/>
          </g>
        </g>

        {/* TIDY items on coffee table */}
        <g opacity={books}>
          <rect x="600" y="1280" width="80" height="10" rx="1" fill={C.teal800}/>
          <rect x="608" y="1270" width="70" height="10" rx="1" fill="#A03B2E"/>
          <rect x="612" y="1260" width="64" height="10" rx="1" fill={C.cream100} stroke={C.ink400}/>
          {/* small vase */}
          <path d="M450 1300 L470 1300 L466 1280 L454 1280 Z" fill={C.teal100}/>
          <g stroke={C.teal700} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M460 1280 Q458 1260 462 1242"/>
            <path d="M460 1280 Q464 1262 472 1250"/>
          </g>
          <circle cx="460" cy="1242" r="4" fill={C.teal300}/>
          <circle cx="472" cy="1250" r="3" fill={C.teal300}/>
        </g>

        {/* Homeowner — appears in tidy phase */}
        {showHomeowner && (
          <g opacity={progress}>
            {/* body — woman seated, leaning into sofa, holding mug */}
            {/* sweater */}
            <path d="M630 800 Q610 770 640 760 Q680 750 720 760 Q740 780 730 820 L740 940 Q720 980 670 980 Q620 980 610 940 Z"
                  fill="#C49B6F"/>
            {/* arm holding mug */}
            <path d="M708 820 Q740 830 762 870 Q770 900 745 906" stroke="#C49B6F" strokeWidth="36" fill="none" strokeLinecap="round"/>
            {/* hand */}
            <circle cx="745" cy="906" r="14" fill="#E8C7A6"/>
            {/* mug */}
            <rect x="724" y="880" width="38" height="32" rx="5" fill={C.cream100}/>
            <path d="M762 886 Q774 886 774 898 Q774 910 762 910" stroke={C.cream100} strokeWidth="5" fill="none"/>
            {/* steam */}
            <g opacity={0.6}>
              <path d="M732 870 Q728 855 736 842 Q744 830 738 818"
                    stroke={C.teal100} strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M748 870 Q752 855 744 842 Q738 830 746 818"
                    stroke={C.teal100} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
            </g>
            {/* head + hair */}
            <ellipse cx="675" cy="730" rx="42" ry="46" fill="#E8C7A6"/>
            <path d="M635 720 Q640 670 690 670 Q730 670 720 715 Q716 700 700 698 Q686 700 668 706 Q644 716 638 728 Z" fill="#5C4A33"/>
            {/* hair flowing past shoulder */}
            <path d="M716 730 Q740 760 728 800 Q720 820 706 815 Q716 780 710 750 Z" fill="#5C4A33"/>
            {/* face — soft smile */}
            <circle cx="664" cy="734" r="2.4" fill={C.ink800}/>
            <circle cx="688" cy="734" r="2.4" fill={C.ink800}/>
            <path d="M666 750 Q674 756 686 750" stroke={C.ink800} strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* cheek warmth */}
            <ellipse cx="657" cy="746" rx="6" ry="3" fill="#E1A87E" opacity="0.5"/>
          </g>
        )}
      </svg>

      <SunGleam x={-200} y={-100} w={1100} h={1100} intensity={sunIntensity * 0.9}/>

      {/* Sparkles around tidy elements */}
      <div style={{ opacity: progress * 0.9 }}>
        <SparkleCluster items={[
          { x: 540, y: 700, size: 22, phase: 0.0 },
          { x: 770, y: 980, size: 16, phase: 0.7 },
          { x: 280, y: 920, size: 18, phase: 1.3 },
          { x: 880, y: 280, size: 14, phase: 0.5 },
        ]} opacity={progress}/>
      </div>
    </div>
  );
}

Object.assign(window, { LivingRoomScene });
