// KitchenScene.jsx — stylized flat-illustration kitchen corner.
// Progress 0 = cluttered/dim; progress 1 = clean/sunlit.

function KitchenScene({ progress = 0, sunIntensity = 0, opacity = 1 }) {
  // Each piece of clutter has its own stagger so they vanish in waves
  // as the cleaning team works left → right.
  const stagger = (start, end) => clamp((progress - start) / Math.max(0.001, end - start), 0, 1);
  const sponge = stagger(0.05, 0.25);
  const dishes = stagger(0.18, 0.42);
  const food   = stagger(0.30, 0.55);
  const mug    = stagger(0.40, 0.65);
  const crumbs = stagger(0.55, 0.85);

  // 1080 wide × 1320 tall scene (sits inside 1920 stage with text margins above/below)
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, willChange: 'opacity' }}>
      {/* ── Wall + window ─────────────────────────── */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
        {/* Back wall — warm cream that brightens with sunIntensity */}
        <defs>
          <linearGradient id="kWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2EEE3"/>
            <stop offset="100%" stopColor="#E8E2D2"/>
          </linearGradient>
          <linearGradient id="kCounter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EDE5D2"/>
            <stop offset="100%" stopColor="#D8CDB3"/>
          </linearGradient>
          <linearGradient id="kCabinet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal100}/>
            <stop offset="100%" stopColor="#C8D6BF"/>
          </linearGradient>
          <linearGradient id="kFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C7B69A"/>
            <stop offset="100%" stopColor="#A89377"/>
          </linearGradient>
          <linearGradient id="kWindowSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8DBB6"/>
            <stop offset="100%" stopColor="#FFE9B8"/>
          </linearGradient>
          <linearGradient id="kTile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F1E8"/>
            <stop offset="100%" stopColor="#E2DDCB"/>
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width="1080" height="900" fill="url(#kWall)"/>
        {/* Wall warm overlay that intensifies with sunIntensity */}
        <rect x="0" y="0" width="1080" height="900" fill="#FFE9B8" opacity={sunIntensity * 0.18}/>

        {/* Floor */}
        <rect x="0" y="1100" width="1080" height="820" fill="url(#kFloor)"/>
        {/* Floor planks */}
        <g stroke="#8B7558" strokeWidth="1.5" opacity="0.35">
          {[1200,1300,1400,1500,1600,1700,1800].map(y => <line key={y} x1="0" y1={y} x2="1080" y2={y}/>)}
          {[180,420,660,900].map(x => <line key={x} x1={x} y1="1100" x2={x} y2="1920"/>)}
        </g>
        {/* small kitchen rug for warmth */}
        <ellipse cx="540" cy="1620" rx="380" ry="60" fill="#C8B690" opacity="0.65"/>
        <ellipse cx="540" cy="1620" rx="340" ry="42" fill="none" stroke="#8B7558" strokeWidth="2" opacity="0.4"/>

        {/* Window */}
        <g>
          <rect x="120" y="120" width="380" height="400" rx="8" fill={C.teal800} opacity="0.18"/>
          <rect x="132" y="132" width="356" height="376" rx="4" fill="url(#kWindowSky)"/>
          <line x1="310" y1="132" x2="310" y2="508" stroke={C.teal800} strokeOpacity="0.35" strokeWidth="6"/>
          <line x1="132" y1="320" x2="488" y2="320" stroke={C.teal800} strokeOpacity="0.35" strokeWidth="6"/>
          {/* Plant on sill */}
          <rect x="180" y="500" width="80" height="36" rx="4" fill="#B6926B"/>
          <g fill={C.teal700}>
            <ellipse cx="200" cy="490" rx="18" ry="34"/>
            <ellipse cx="225" cy="478" rx="20" ry="40"/>
            <ellipse cx="250" cy="492" rx="16" ry="32"/>
          </g>
        </g>

        {/* Subway tile backsplash */}
        <g>
          <rect x="540" y="540" width="540" height="280" fill="url(#kTile)"/>
          {/* tile lines */}
          <g stroke="#C9C2AE" strokeWidth="1.2" opacity="0.7">
            {[0,1,2,3].map(r => (
              <line key={r} x1="540" y1={580 + r*60} x2="1080" y2={580 + r*60}/>
            ))}
            {/* offset vertical lines */}
            {[0,1,2,3,4,5,6,7,8,9].map(c => (
              <line key={c} x1={540 + c*60 + (c%2 ? 30 : 0)} y1={540 + (c%2 ? 60 : 0)} x2={540 + c*60 + (c%2 ? 30 : 0)} y2={540 + (c%2 ? 120 : 60)}/>
            ))}
            {[0,1,2,3,4,5,6,7,8,9].map(c => (
              <line key={'b'+c} x1={540 + c*60 + (c%2 ? 0 : 30)} y1={660} x2={540 + c*60 + (c%2 ? 0 : 30)} y2={720}/>
            ))}
            {[0,1,2,3,4,5,6,7,8,9].map(c => (
              <line key={'c'+c} x1={540 + c*60 + (c%2 ? 30 : 0)} y1={720} x2={540 + c*60 + (c%2 ? 30 : 0)} y2={780}/>
            ))}
          </g>
        </g>

        {/* Counter slab */}
        <rect x="0" y="820" width="1080" height="60" fill="url(#kCounter)"/>
        <rect x="0" y="820" width="1080" height="6" fill="#fff" opacity="0.5"/>

        {/* Cabinets */}
        <rect x="0" y="880" width="1080" height="220" fill="url(#kCabinet)"/>
        {/* cabinet doors */}
        <g stroke={C.teal700} strokeOpacity="0.35" strokeWidth="2" fill="none">
          <rect x="40"  y="900" width="200" height="180" rx="4"/>
          <rect x="270" y="900" width="200" height="180" rx="4"/>
          <rect x="500" y="900" width="200" height="180" rx="4"/>
          <rect x="730" y="900" width="200" height="180" rx="4"/>
          <rect x="960" y="900" width="80"  height="180" rx="4"/>
        </g>
        {/* drawer pulls */}
        <g fill={C.teal800}>
          {[140, 370, 600, 830].map((cx, i) => (
            <circle key={i} cx={cx} cy="990" r="5"/>
          ))}
        </g>

        {/* Sink basin */}
        <g>
          <rect x="600" y="780" width="240" height="44" rx="6" fill={C.teal900} opacity="0.18"/>
          <rect x="610" y="785" width="220" height="36" rx="4" fill="#C7BEA8"/>
          <rect x="620" y="790" width="200" height="28" rx="3" fill="#B0A78F"/>
          {/* faucet */}
          <path d="M720 760 Q720 720 760 720 L760 750"
                stroke={C.teal900} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <circle cx="720" cy="760" r="6" fill={C.teal900}/>
        </g>

        {/* Soap bottle on counter (right of sink) */}
        <g>
          <rect x="870" y="770" width="28" height="50" rx="6" fill={C.teal700}/>
          <rect x="876" y="755" width="16" height="20" rx="4" fill={C.teal800}/>
          <line x1="884" y1="755" x2="884" y2="745" stroke={C.teal800} strokeWidth="3" strokeLinecap="round"/>
        </g>

        {/* Cutting board (always on counter — stays clean) */}
        <g>
          <rect x="60" y="800" width="170" height="22" rx="4" fill="#C99A6E"/>
          <rect x="60" y="800" width="170" height="6" fill="#E0B687"/>
        </g>

        {/* ── CLUTTER (fades out as progress increases) ─────────────── */}

        {/* Stack of dirty dishes (left of sink) */}
        <g opacity={1 - dishes} transform={`translate(0, ${dishes * -10})`}>
          <ellipse cx="430" cy="820" rx="80" ry="6" fill="rgba(0,0,0,0.18)"/>
          <rect x="360" y="800" width="140" height="20" rx="4" fill="#E2DCC9"/>
          <rect x="350" y="788" width="160" height="16" rx="4" fill="#EFE9D6"/>
          <rect x="370" y="776" width="120" height="14" rx="4" fill="#D8D2BE"/>
          <ellipse cx="430" cy="776" rx="58" ry="6" fill="#fff" opacity="0.5"/>
          {/* sauce smudge */}
          <ellipse cx="420" cy="784" rx="14" ry="3" fill="#A03B2E" opacity="0.55"/>
        </g>

        {/* Sponge in sink */}
        <g opacity={1 - sponge}>
          <rect x="660" y="794" width="48" height="20" rx="3" fill="#F2D169"/>
          <rect x="660" y="794" width="48" height="6"  rx="3" fill="#76B89B"/>
        </g>

        {/* Cereal box (right) */}
        <g opacity={1 - food} transform={`translate(${food * 14}, 0)`}>
          <rect x="940" y="700" width="80" height="120" fill={C.teal700}/>
          <rect x="950" y="715" width="60" height="36" fill={C.cream100}/>
          <rect x="950" y="760" width="60" height="6" fill={C.cream100} opacity="0.7"/>
          <rect x="950" y="775" width="40" height="4" fill={C.cream100} opacity="0.5"/>
        </g>

        {/* Half-empty mug (left) */}
        <g opacity={1 - mug} transform={`translate(${mug * -8}, ${mug * -6})`}>
          <ellipse cx="270" cy="822" rx="30" ry="4" fill="rgba(0,0,0,0.18)"/>
          <path d="M246 770 L294 770 L290 818 L250 818 Z" fill={C.cream100}/>
          <path d="M294 778 Q310 778 310 794 Q310 808 294 808" stroke={C.cream100} strokeWidth="6" fill="none"/>
          <ellipse cx="270" cy="772" rx="22" ry="4" fill="#7A553A"/>
          {/* steam wisp gone — old coffee */}
        </g>

        {/* Crumbs scattered along counter */}
        <g opacity={1 - crumbs} fill="#9E7A4D">
          {[
            [180, 824, 3], [195, 826, 2], [212, 823, 2.5], [228, 825, 2],
            [560, 826, 2.5], [578, 824, 2], [596, 826, 3], [612, 823, 2],
            [880, 826, 2], [898, 825, 2.5], [918, 824, 2], [932, 826, 2.5],
          ].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r}/>)}
        </g>

        {/* Counter shine that strengthens as it gets clean */}
        <g opacity={progress * 0.7}>
          <ellipse cx="200" cy="824" rx="120" ry="2.5" fill="#fff"/>
          <ellipse cx="540" cy="824" rx="80"  ry="2"   fill="#fff"/>
          <ellipse cx="940" cy="824" rx="100" ry="2.5" fill="#fff"/>
        </g>
      </svg>

      {/* Sun gleam — fades in at the end */}
      <SunGleam x={-100} y={-150} w={900} h={900} intensity={sunIntensity * 0.85}/>

      {/* Sparkles emerge as it gets clean */}
      <div style={{ opacity: progress }}>
        <SparkleCluster items={[
          { x: 660, y: 760, size: 28, phase: 0.0 },
          { x: 760, y: 740, size: 18, phase: 0.6 },
          { x: 836, y: 770, size: 22, phase: 1.2 },
          { x: 920, y: 660, size: 16, phase: 1.8 },
          { x: 280, y: 790, size: 20, phase: 0.3 },
        ]} opacity={progress}/>
      </div>
    </div>
  );
}

Object.assign(window, { KitchenScene });
