// BathroomScene.jsx — stylized flat bathroom with vanity, sink, mirror.
// Progress 0 = cluttered/dim; progress 1 = clean & shining.

function BathroomScene({ progress = 0, sunIntensity = 0, opacity = 1 }) {
  const stagger = (s, e) => clamp((progress - s) / Math.max(0.001, e - s), 0, 1);
  const towel    = stagger(0.05, 0.30);
  const tooth    = stagger(0.20, 0.45);
  const droplets = stagger(0.30, 0.55);
  const bottles  = stagger(0.45, 0.75);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, willChange: 'opacity' }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFEEE6"/>
            <stop offset="100%" stopColor="#E1DDCD"/>
          </linearGradient>
          <linearGradient id="bVanity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7A6347"/>
            <stop offset="100%" stopColor="#5C4A33"/>
          </linearGradient>
          <linearGradient id="bCounter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2EDE0"/>
            <stop offset="100%" stopColor="#D9D1BC"/>
          </linearGradient>
          <linearGradient id="bMirror" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8E2DC"/>
            <stop offset="100%" stopColor="#B5C7BD"/>
          </linearGradient>
          <linearGradient id="bFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8E2D2"/>
            <stop offset="100%" stopColor="#C8BFA6"/>
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width="1080" height="1080" fill="url(#bWall)"/>
        <rect x="0" y="0" width="1080" height="1080" fill="#FFE9B8" opacity={sunIntensity * 0.16}/>

        {/* Floor (tile) */}
        <rect x="0" y="1080" width="1080" height="840" fill="url(#bFloor)"/>
        <g stroke="#A89A7B" strokeWidth="1.4" opacity="0.5">
          {[0,1,2,3,4,5,6].map(c => <line key={c} x1={c*180} y1="1080" x2={c*180} y2="1920"/>)}
          {[1180,1260,1340,1420,1500,1580,1660,1740,1820].map(y => <line key={y} x1="0" y1={y} x2="1080" y2={y}/>)}
        </g>
        {/* Small bath mat */}
        <ellipse cx="540" cy="1500" rx="360" ry="54" fill={C.teal100} opacity="0.85"/>
        <ellipse cx="540" cy="1500" rx="320" ry="36" fill="none" stroke={C.teal700} strokeWidth="2" opacity="0.35"/>

        {/* Round mirror */}
        <g>
          <circle cx="540" cy="280" r="190" fill={C.teal900} opacity="0.18"/>
          <circle cx="540" cy="280" r="178" fill="url(#bMirror)"/>
          {/* mirror reflection — soft window glow */}
          <ellipse cx="490" cy="240" rx="80" ry="60" fill="#FFF7E0" opacity={0.4 + sunIntensity * 0.4}/>
        </g>

        {/* Wall sconces */}
        <g>
          <circle cx="280" cy="280" r="22" fill={C.teal800}/>
          <circle cx="280" cy="280" r="14" fill="#FFE9B8" opacity={0.6 + sunIntensity * 0.4}/>
          <circle cx="800" cy="280" r="22" fill={C.teal800}/>
          <circle cx="800" cy="280" r="14" fill="#FFE9B8" opacity={0.6 + sunIntensity * 0.4}/>
        </g>

        {/* Vanity */}
        <rect x="160" y="780" width="760" height="40" rx="4" fill="url(#bCounter)"/>
        <rect x="160" y="780" width="760" height="6" fill="#fff" opacity="0.5"/>
        <rect x="160" y="820" width="760" height="260" fill="url(#bVanity)"/>
        {/* drawer fronts */}
        <g stroke="#3D2F1F" strokeWidth="2" fill="none">
          <rect x="180" y="840" width="220" height="220" rx="4"/>
          <rect x="420" y="840" width="240" height="100" rx="4"/>
          <rect x="420" y="960" width="240" height="100" rx="4"/>
          <rect x="680" y="840" width="220" height="220" rx="4"/>
        </g>
        <g fill="#C9A66B">
          <rect x="528" y="884" width="24" height="6" rx="2"/>
          <rect x="528" y="1004" width="24" height="6" rx="2"/>
          <circle cx="290" cy="950" r="6"/>
          <circle cx="790" cy="950" r="6"/>
        </g>

        {/* Sink basin (oval inset) */}
        <g>
          <ellipse cx="540" cy="800" rx="130" ry="22" fill={C.teal900} opacity="0.18"/>
          <ellipse cx="540" cy="800" rx="120" ry="18" fill="#E5DECC"/>
          <ellipse cx="540" cy="800" rx="108" ry="13" fill="#CFC6AE"/>
          {/* faucet */}
          <path d="M540 760 L540 720 L580 720"
                stroke={C.teal900} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <circle cx="540" cy="760" r="6" fill={C.teal900}/>
          {/* faucet gleam */}
          <line x1="544" y1="725" x2="552" y2="725" stroke="#fff" strokeWidth="2" opacity={progress * 0.9}/>
        </g>

        {/* Folded towels (always present, look neater as progress) */}
        <g transform={`translate(${(1 - progress) * 6}, 0)`}>
          <rect x="200" y="730" width="120" height="20" rx="3" fill={C.teal100}/>
          <rect x="200" y="752" width="120" height="20" rx="3" fill={C.cream100}/>
          <line x1="260" y1="740" x2="280" y2="740" stroke={C.teal800} strokeWidth="1.5" opacity="0.4"/>
          <line x1="260" y1="762" x2="280" y2="762" stroke={C.teal800} strokeWidth="1.5" opacity="0.4"/>
        </g>

        {/* Glass jar (clean accessory) */}
        <g>
          <rect x="760" y="744" width="44" height="38" rx="4" fill="#fff" opacity="0.7" stroke={C.teal700} strokeWidth="1.5"/>
          {/* cotton swabs */}
          <rect x="772" y="730" width="3" height="20" fill={C.cream100}/>
          <rect x="780" y="725" width="3" height="25" fill={C.cream100}/>
          <rect x="788" y="732" width="3" height="18" fill={C.cream100}/>
        </g>

        {/* ── CLUTTER ───────────────────────── */}

        {/* Towel on floor (slumped) */}
        <g opacity={1 - towel}>
          <path d="M70 1180 Q120 1140 200 1160 Q260 1180 220 1230 Q160 1260 100 1240 Q60 1220 70 1180 Z"
                fill={C.teal100}/>
          <path d="M90 1190 Q130 1170 180 1180" stroke={C.teal700} strokeWidth="2" fill="none" opacity="0.4"/>
        </g>

        {/* Toothbrush & tube on counter */}
        <g opacity={1 - tooth} transform={`translate(${tooth * 12}, 0)`}>
          {/* tube */}
          <rect x="380" y="770" width="80" height="14" rx="4" fill={C.cream100}/>
          <rect x="376" y="772" width="8" height="10" rx="2" fill={C.teal700}/>
          {/* brush */}
          <rect x="640" y="772" width="100" height="8" rx="3" fill={C.teal300}/>
          <rect x="730" y="768" width="22" height="16" rx="2" fill={C.cream100}/>
        </g>

        {/* Water droplets on mirror & faucet area */}
        <g opacity={1 - droplets} fill="#94B5AD">
          {[
            [470, 240, 4], [510, 220, 3], [560, 250, 4], [600, 230, 3], [580, 280, 3],
            [500, 760, 3], [560, 745, 4], [530, 770, 3]
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.3}/>
          ))}
        </g>

        {/* Random bottles knocked over on counter */}
        <g opacity={1 - bottles} transform={`translate(0, ${bottles * 6})`}>
          <rect x="700" y="754" width="22" height="28" rx="3" fill={C.teal700}/>
          <rect x="705" y="744" width="12" height="12" rx="3" fill={C.teal800}/>
          <g transform="rotate(-22 838 770)">
            <rect x="820" y="754" width="22" height="32" rx="3" fill={C.cream100} stroke={C.ink400}/>
            <rect x="826" y="746" width="10" height="10" rx="2" fill={C.ink600}/>
          </g>
        </g>

        {/* Counter shine */}
        <g opacity={progress * 0.65}>
          <ellipse cx="280" cy="800" rx="80"  ry="2" fill="#fff"/>
          <ellipse cx="800" cy="800" rx="100" ry="2" fill="#fff"/>
        </g>
      </svg>

      <SunGleam x={500} y={-100} w={800} h={800} intensity={sunIntensity * 0.7}/>

      <div style={{ opacity: progress }}>
        <SparkleCluster items={[
          { x: 540, y: 720, size: 26, phase: 0.0 },
          { x: 600, y: 760, size: 18, phase: 0.5 },
          { x: 470, y: 760, size: 16, phase: 1.1 },
          { x: 720, y: 240, size: 22, phase: 0.8 },
          { x: 350, y: 270, size: 16, phase: 1.4 },
        ]} opacity={progress}/>
      </div>
    </div>
  );
}

Object.assign(window, { BathroomScene });
