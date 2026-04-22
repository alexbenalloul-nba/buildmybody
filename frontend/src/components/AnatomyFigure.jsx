import { useEffect, useRef } from 'react';

const animationCss = `
  @keyframes musclePulse-hamstrings {
    0%,100% { filter: drop-shadow(0 0 4px #FF4422); opacity: 0.88; }
    50%      { filter: drop-shadow(0 0 16px #FF7755); opacity: 1.0; }
  }
  @keyframes musclePulse-glutes {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-calves {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-soleus {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.82; }
    50%      { filter: drop-shadow(0 0 10px #FF6644); opacity: 0.98; }
  }
  @keyframes musclePulse-erectors {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-lats {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-traps {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-reardelts {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.85; }
    50%      { filter: drop-shadow(0 0 12px #FF6644); opacity: 1.0; }
  }
  @keyframes musclePulse-triceps {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.82; }
    50%      { filter: drop-shadow(0 0 10px #FF6644); opacity: 0.98; }
  }
  @keyframes musclePulse-forearms {
    0%,100% { filter: drop-shadow(0 0 3px #FF4422); opacity: 0.80; }
    50%      { filter: drop-shadow(0 0 10px #FF6644); opacity: 0.96; }
  }
  #hamstrings { animation: musclePulse-hamstrings 3.2s ease-in-out 0.0s infinite; }
  #glutes     { animation: musclePulse-glutes     4.1s ease-in-out 0.7s infinite; }
  #calves     { animation: musclePulse-calves     3.7s ease-in-out 1.3s infinite; }
  #soleus     { animation: musclePulse-soleus     4.5s ease-in-out 0.4s infinite; }
  #erectors   { animation: musclePulse-erectors   3.9s ease-in-out 1.8s infinite; }
  #lats       { animation: musclePulse-lats       4.3s ease-in-out 0.9s infinite; }
  #traps      { animation: musclePulse-traps      3.5s ease-in-out 2.1s infinite; }
  #rear-delts { animation: musclePulse-reardelts  4.8s ease-in-out 0.3s infinite; }
  #triceps    { animation: musclePulse-triceps    3.3s ease-in-out 1.6s infinite; }
  #forearms   { animation: musclePulse-forearms   4.0s ease-in-out 2.4s infinite; }
`;

export default function AnatomyFigure({ className = '' }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`anatomy-wrapper ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
      }}
    >
      {/* Flex centering wrapper */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 600"
          width="500"
          height="600"
          style={{ display: 'block', margin: '0 auto' }}
        >
          <defs>
            <radialGradient id="grad-hamstrings" cx="50%" cy="38%" r="56%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF7755" />
              <stop offset="42%"  stopColor="#CC2200" />
              <stop offset="100%" stopColor="#5a0000" />
            </radialGradient>
            <radialGradient id="grad-glutes" cx="50%" cy="36%" r="58%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF5533" />
              <stop offset="48%"  stopColor="#BB1800" />
              <stop offset="100%" stopColor="#600000" />
            </radialGradient>
            <radialGradient id="grad-calves" cx="50%" cy="34%" r="54%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF5533" />
              <stop offset="45%"  stopColor="#CC2200" />
              <stop offset="100%" stopColor="#5a0000" />
            </radialGradient>
            <radialGradient id="grad-soleus" cx="50%" cy="50%" r="52%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#EE4422" />
              <stop offset="50%"  stopColor="#AA1500" />
              <stop offset="100%" stopColor="#4a0000" />
            </radialGradient>
            <radialGradient id="grad-erectors" cx="50%" cy="40%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF4422" />
              <stop offset="50%"  stopColor="#CC2200" />
              <stop offset="100%" stopColor="#5a0000" />
            </radialGradient>
            <radialGradient id="grad-lats" cx="44%" cy="38%" r="62%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF4422" />
              <stop offset="48%"  stopColor="#BB1800" />
              <stop offset="100%" stopColor="#580000" />
            </radialGradient>
            <radialGradient id="grad-traps" cx="50%" cy="36%" r="58%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF4422" />
              <stop offset="46%"  stopColor="#CC2200" />
              <stop offset="100%" stopColor="#5c0000" />
            </radialGradient>
            <radialGradient id="grad-reardelts" cx="50%" cy="44%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF5533" />
              <stop offset="48%"  stopColor="#CC2200" />
              <stop offset="100%" stopColor="#5a0000" />
            </radialGradient>
            <radialGradient id="grad-triceps" cx="50%" cy="38%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#FF4422" />
              <stop offset="48%"  stopColor="#BB1800" />
              <stop offset="100%" stopColor="#520000" />
            </radialGradient>
            <radialGradient id="grad-forearms" cx="50%" cy="38%" r="54%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#EE4422" />
              <stop offset="48%"  stopColor="#AA1500" />
              <stop offset="100%" stopColor="#4a0000" />
            </radialGradient>
          </defs>

          <style>{animationCss}</style>

          {/* ═══════════════════════════════════════════════════════
              LAYER 1 — BONES
              Spine has strong kyphotic C-curve (forward fold),
              vertebral processes prominent, bones at correct
              seated-stretch positions.
          ═══════════════════════════════════════════════════════ */}
          <g id="bones" stroke="#E8E8E8" fill="none" strokeWidth="1.5" opacity="0.42">

            {/* Spine — pronounced C-curve of thoracic kyphosis in forward fold.
                Spinous processes are enlarged and more separated because
                the posterior ligaments are under tension. */}
            <path d="M 250,108 C 252,128 255,155 258,186 C 261,218 260,250 257,278 C 254,300 252,316 250,322" strokeWidth="1.8" />
            {/* Cervical (C4–C7) — smaller, closer together */}
            <ellipse cx="250" cy="113" rx="4.5" ry="5.5" />
            <ellipse cx="250" cy="124" rx="4.5" ry="5.5" />
            <ellipse cx="250" cy="135" rx="4.5" ry="5.5" />
            {/* Thoracic (T1–T12) — largest, most prominent in kyphosis */}
            <ellipse cx="251" cy="148" rx="6" ry="7.5" />
            <ellipse cx="252" cy="162" rx="6" ry="7.5" />
            <ellipse cx="253" cy="176" rx="6.5" ry="8" />
            <ellipse cx="254" cy="190" rx="6.5" ry="8" />
            <ellipse cx="255" cy="204" rx="6.5" ry="8" />
            <ellipse cx="255" cy="218" rx="6" ry="7.5" />
            <ellipse cx="255" cy="231" rx="6" ry="7.5" />
            <ellipse cx="255" cy="244" rx="5.5" ry="7" />
            {/* Lumbar (L1–L5) — in flexion, lose normal lordosis */}
            <ellipse cx="254" cy="257" rx="5.5" ry="7" />
            <ellipse cx="253" cy="270" rx="5.5" ry="6.5" />
            <ellipse cx="252" cy="283" rx="5.5" ry="6.5" />
            <ellipse cx="251" cy="296" rx="5.5" ry="6.5" />
            <ellipse cx="250" cy="309" rx="5.5" ry="6" />

            {/* Pelvis — wide and spread (seated position, compressed against floor) */}
            <path d="M 184,294 C 192,273 220,262 250,262 C 280,262 308,273 316,294 C 323,309 314,326 298,330 C 278,334 222,334 202,330 C 186,326 177,309 184,294 Z" />

            {/* Right femur — curves from ischium down toward knee */}
            <path d="M 286,308 C 290,332 296,362 302,392 C 306,414 308,442 310,462" />
            {/* Left femur */}
            <path d="M 214,308 C 210,332 204,362 198,392 C 194,414 192,442 190,462" />

            {/* Right tibia (medial, thicker) */}
            <path d="M 310,465 C 312,492 313,520 312,548" />
            {/* Right fibula (lateral, thinner) */}
            <path d="M 318,467 C 321,494 323,522 322,548" />
            {/* Left tibia */}
            <path d="M 190,465 C 188,492 187,520 188,548" />
            {/* Left fibula */}
            <path d="M 182,467 C 179,494 177,522 178,548" />

            {/* Right calcaneus (heel bone) — elongated, seen from posterior */}
            <ellipse cx="308" cy="562" rx="18" ry="8" />
            {/* Left calcaneus */}
            <ellipse cx="192" cy="562" rx="18" ry="8" />

            {/* Ribcage right side — 7 arcs, more visible in forward fold */}
            <path d="M 254,150 C 266,145 288,142 310,151" />
            <path d="M 255,165 C 269,159 294,155 318,165" />
            <path d="M 255,180 C 270,173 298,169 323,180" />
            <path d="M 255,195 C 271,187 300,183 325,194" />
            <path d="M 255,210 C 271,202 300,198 324,209" />
            <path d="M 255,225 C 271,216 299,212 322,222" />
            <path d="M 254,240 C 270,231 296,227 316,237" />
            {/* Ribcage left side */}
            <path d="M 246,150 C 234,145 212,142 190,151" />
            <path d="M 245,165 C 231,159 206,155 182,165" />
            <path d="M 245,180 C 230,173 202,169 177,180" />
            <path d="M 245,195 C 229,187 200,183 175,194" />
            <path d="M 245,210 C 229,202 200,198 176,209" />
            <path d="M 245,225 C 229,216 201,212 178,222" />
            <path d="M 246,240 C 230,231 204,227 184,237" />

            {/* Right scapula — prominently winging in forward fold */}
            <path d="M 292,146 C 314,150 336,166 334,192 C 332,211 315,220 300,215 C 286,210 280,198 283,183 C 285,169 292,158 292,146 Z" />
            <path d="M 293,149 C 308,156 325,164 332,176" strokeWidth="2" />
            {/* Left scapula */}
            <path d="M 208,146 C 186,150 164,166 166,192 C 168,211 185,220 200,215 C 214,210 220,198 217,183 C 215,169 208,158 208,146 Z" />
            <path d="M 207,149 C 192,156 175,164 168,176" strokeWidth="2" />

            {/* Right humerus — arm reaching forward alongside body */}
            <path d="M 334,154 C 340,188 347,238 350,280" strokeWidth="2.5" />
            {/* Left humerus */}
            <path d="M 166,154 C 160,188 153,238 150,280" strokeWidth="2.5" />

            {/* Right radius & ulna — forearm extended reaching toward feet */}
            <path d="M 349,283 C 346,326 341,374 336,418" strokeWidth="2" />
            <path d="M 354,285 C 352,328 348,376 344,420" strokeWidth="1.4" />
            {/* Left radius & ulna */}
            <path d="M 151,283 C 154,326 159,374 164,418" strokeWidth="2" />
            <path d="M 146,285 C 148,328 152,376 156,420" strokeWidth="1.4" />
          </g>

          {/* ═══════════════════════════════════════════════════════
              LAYER 2 — BODY SILHOUETTE
              Seated hamstring stretch, posterior view.
              The torso is compact and hunched forward; arms are
              extended down alongside the legs reaching for the feet.
              Opacity reduced to 0.5 so muscles show through clearly.
          ═══════════════════════════════════════════════════════ */}
          <path
            id="silhouette"
            d="
              M 250,28
              C 278,28 290,44 290,64
              C 290,80 281,96 270,104
              C 275,109 287,114 308,118
              C 328,122 344,126 352,136
              C 360,148 362,168 358,192
              C 354,218 346,248 340,275
              C 335,296 330,316 326,332
              C 322,348 318,366 315,386
              C 312,410 310,436 309,460
              C 308,484 308,508 309,532
              C 309,544 310,554 309,562
              C 308,570 302,576 290,577
              C 278,578 264,574 260,566
              C 257,558 257,548 258,528
              C 259,504 260,480 261,456
              C 262,430 262,404 263,380
              C 264,362 265,346 267,332
              C 269,320 250,316 250,316
              C 250,316 231,320 233,332
              C 235,346 236,362 237,380
              C 238,404 238,430 239,456
              C 240,480 241,504 242,528
              C 243,548 243,558 240,566
              C 236,574 222,578 210,577
              C 198,576 192,570 191,562
              C 190,554 191,544 191,532
              C 192,508 192,484 191,460
              C 190,436 188,410 185,386
              C 182,366 178,348 174,332
              C 170,316 165,296 160,275
              C 154,248 146,218 142,192
              C 138,168 140,148 148,136
              C 156,126 172,122 192,118
              C 213,114 225,109 230,104
              C 219,96 210,80 210,64
              C 210,44 222,28 250,28 Z
            "
            fill="#1a0000"
            opacity="0.5"
          />

          {/* ═══════════════════════════════════════════════════════
              LAYER 3 — MUSCLE GROUPS
          ═══════════════════════════════════════════════════════ */}

          {/* ── TRAPEZIUS ──────────────────────────────────────── */}
          <g id="traps">
            <path
              d="M 250,115 C 272,117 308,129 340,152 C 325,168 303,178 282,185 C 268,190 258,192 250,194 C 242,192 232,190 218,185 C 197,178 175,168 160,152 C 192,129 228,117 250,115 Z"
              fill="url(#grad-traps)"
            />
          </g>

          {/* ── REAR DELTOIDS ───────────────────────────────────── */}
          <g id="rear-delts">
            <path
              d="M 340,138 C 354,136 368,146 368,162 C 368,178 356,188 342,185 C 329,182 322,171 326,158 C 329,147 335,140 340,138 Z"
              fill="url(#grad-reardelts)"
            />
            <path
              d="M 160,138 C 146,136 132,146 132,162 C 132,178 144,188 158,185 C 171,182 178,171 174,158 C 171,147 165,140 160,138 Z"
              fill="url(#grad-reardelts)"
            />
          </g>

          {/* ── LATISSIMUS DORSI ────────────────────────────────── */}
          <g id="lats">
            {/* Right lat — fan from axilla down to lower back */}
            <path
              d="M 336,162 C 350,178 358,208 358,238 C 358,265 353,292 348,312 C 341,308 328,296 314,282 C 302,269 294,252 292,235 C 290,220 296,200 307,188 C 318,176 330,164 336,162 Z"
              fill="url(#grad-lats)"
            />
            {/* Left lat */}
            <path
              d="M 164,162 C 150,178 142,208 142,238 C 142,265 147,292 152,312 C 159,308 172,296 186,282 C 198,269 206,252 208,235 C 210,220 204,200 193,188 C 182,176 170,164 164,162 Z"
              fill="url(#grad-lats)"
            />
          </g>

          {/* ── ERECTOR SPINAE ──────────────────────────────────── */}
          <g id="erectors">
            {/* Right column — under high tension in forward fold */}
            <path
              d="M 258,122 C 266,126 274,140 275,158 C 276,184 275,218 273,252 C 271,281 269,308 266,332 C 263,344 260,352 256,356 C 252,348 251,332 251,312 C 251,286 253,258 254,232 C 256,204 257,174 257,152 C 257,137 257,125 258,122 Z"
              fill="url(#grad-erectors)"
            />
            {/* Left column */}
            <path
              d="M 242,122 C 234,126 226,140 225,158 C 224,184 225,218 227,252 C 229,281 231,308 234,332 C 237,344 240,352 244,356 C 248,348 249,332 249,312 C 249,286 247,258 246,232 C 244,204 243,174 243,152 C 243,137 243,125 242,122 Z"
              fill="url(#grad-erectors)"
            />
          </g>

          {/* ── GLUTEUS MAXIMUS ─────────────────────────────────── */}
          <g id="glutes">
            {/* Right — spread wide and somewhat flattened, seated */}
            <path
              d="M 252,322 C 266,316 290,310 314,318 C 334,325 350,340 351,358 C 352,374 343,390 328,396 C 314,402 298,401 282,394 C 268,387 259,374 256,360 C 252,346 251,332 252,322 Z"
              fill="url(#grad-glutes)"
            />
            {/* Left */}
            <path
              d="M 248,322 C 234,316 210,310 186,318 C 166,325 150,340 149,358 C 148,374 157,390 172,396 C 186,402 202,401 218,394 C 232,387 241,374 244,360 C 248,346 249,332 248,322 Z"
              fill="url(#grad-glutes)"
            />
          </g>

          {/* ── HAMSTRINGS ──────────────────────────────────────── */}
          {/* 4 paths: biceps femoris (lateral) + semimembranosus
              (medial) for each leg. Under maximum stretch — the
              bellies are elongated and taut, not round.          */}
          <g id="hamstrings">
            {/* Right biceps femoris — outer/lateral */}
            <path
              d="M 310,368 C 323,366 336,376 340,396 C 345,415 340,437 330,448 C 322,457 312,458 304,452 C 295,445 292,427 294,408 C 297,389 302,370 310,368 Z"
              fill="url(#grad-hamstrings)"
            />
            {/* Right semimembranosus / semitendinosus — inner/medial */}
            <path
              d="M 284,372 C 296,368 309,378 310,398 C 312,418 307,440 297,450 C 289,458 279,459 272,452 C 264,443 263,424 266,405 C 270,385 276,375 284,372 Z"
              fill="url(#grad-hamstrings)"
            />
            {/* Left biceps femoris — outer/lateral */}
            <path
              d="M 190,368 C 177,366 164,376 160,396 C 155,415 160,437 170,448 C 178,457 188,458 196,452 C 205,445 208,427 206,408 C 203,389 198,370 190,368 Z"
              fill="url(#grad-hamstrings)"
            />
            {/* Left semimembranosus / semitendinosus — inner/medial */}
            <path
              d="M 216,372 C 204,368 191,378 190,398 C 188,418 193,440 203,450 C 211,458 221,459 228,452 C 236,443 237,424 234,405 C 230,385 224,375 216,372 Z"
              fill="url(#grad-hamstrings)"
            />
          </g>

          {/* ── GASTROCNEMIUS ───────────────────────────────────── */}
          {/* Also under stretch (knee extended). Two heads per leg. */}
          <g id="calves">
            {/* Right lateral head */}
            <path
              d="M 315,462 C 327,460 340,470 342,487 C 344,504 338,522 327,528 C 318,533 307,531 301,523 C 295,515 296,499 300,486 C 304,472 310,464 315,462 Z"
              fill="url(#grad-calves)"
            />
            {/* Right medial head */}
            <path
              d="M 292,463 C 304,459 316,470 317,487 C 318,503 312,522 302,528 C 293,534 282,532 277,523 C 271,514 272,497 277,485 C 282,472 287,466 292,463 Z"
              fill="url(#grad-calves)"
            />
            {/* Left lateral head */}
            <path
              d="M 185,462 C 173,460 160,470 158,487 C 156,504 162,522 173,528 C 182,533 193,531 199,523 C 205,515 204,499 200,486 C 196,472 190,464 185,462 Z"
              fill="url(#grad-calves)"
            />
            {/* Left medial head */}
            <path
              d="M 208,463 C 196,459 184,470 183,487 C 182,503 188,522 198,528 C 207,534 218,532 223,523 C 229,514 228,497 223,485 C 218,472 213,466 208,463 Z"
              fill="url(#grad-calves)"
            />
          </g>

          {/* ── SOLEUS & ACHILLES REGION ────────────────────────── */}
          {/* Shaped as the heel/ankle seen from posterior — wide
              horizontal oval, clearly a heel not a circle.        */}
          <g id="soleus">
            {/* Right heel / soleus insertion — wide, flat, heel-shaped */}
            <path
              d="M 270,530 C 266,540 267,554 278,562 C 287,568 308,568 322,560 C 330,554 330,540 322,534 C 312,528 274,528 270,530 Z"
              fill="url(#grad-soleus)"
            />
            {/* Left heel / soleus insertion */}
            <path
              d="M 230,530 C 234,540 233,554 222,562 C 213,568 192,568 178,560 C 170,554 170,540 178,534 C 188,528 226,528 230,530 Z"
              fill="url(#grad-soleus)"
            />
          </g>

          {/* ── TRICEPS BRACHII ─────────────────────────────────── */}
          {/* Arms are extended forward reaching toward feet,
              so triceps are elongated along the posterior upper arm. */}
          <g id="triceps">
            {/* Right — elongated oval running down posterior upper arm */}
            <path
              d="M 350,150 C 362,153 370,172 370,196 C 370,222 363,250 354,268 C 347,278 338,280 330,274 C 323,268 322,252 326,232 C 330,210 340,180 350,150 Z"
              fill="url(#grad-triceps)"
            />
            {/* Left */}
            <path
              d="M 150,150 C 138,153 130,172 130,196 C 130,222 137,250 146,268 C 153,278 162,280 170,274 C 177,268 178,252 174,232 C 170,210 160,180 150,150 Z"
              fill="url(#grad-triceps)"
            />
          </g>

          {/* ── FOREARM EXTENSORS ───────────────────────────────── */}
          {/* Forearms extended far down alongside the legs,
              reaching toward the feet — implies forward lean.     */}
          <g id="forearms">
            {/* Right — runs from elbow down toward ankle level */}
            <path
              d="M 358,274 C 368,282 372,308 369,338 C 366,368 358,402 349,432 C 342,454 334,468 327,470 C 321,465 318,448 322,422 C 326,396 336,362 344,332 C 350,306 354,284 358,274 Z"
              fill="url(#grad-forearms)"
            />
            {/* Left */}
            <path
              d="M 142,274 C 132,282 128,308 131,338 C 134,368 142,402 151,432 C 158,454 166,468 173,470 C 179,465 182,448 178,422 C 174,396 164,362 156,332 C 150,306 146,284 142,274 Z"
              fill="url(#grad-forearms)"
            />
          </g>

          {/* ═══════════════════════════════════════════════════════
              LABELS — right-side annotations
          ═══════════════════════════════════════════════════════ */}

          {/* Trapezius */}
          <circle cx="308" cy="154" r="2.5" fill="#FF4422" />
          <line x1="310" y1="153" x2="362" y2="132" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="364" y="136" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Trapezius</text>

          {/* Rear Deltoid */}
          <circle cx="354" cy="163" r="2.5" fill="#FF4422" />
          <line x1="357" y1="162" x2="380" y2="150" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="382" y="154" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Rear Deltoid</text>

          {/* Erector Spinae */}
          <circle cx="270" cy="215" r="2.5" fill="#FF4422" />
          <line x1="272" y1="214" x2="352" y2="195" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="354" y="199" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Erector Spinae</text>

          {/* Triceps */}
          <circle cx="355" cy="225" r="2.5" fill="#FF4422" />
          <line x1="358" y1="224" x2="385" y2="212" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="387" y="216" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Triceps</text>

          {/* Latissimus Dorsi */}
          <circle cx="342" cy="248" r="2.5" fill="#FF4422" />
          <line x1="345" y1="247" x2="376" y2="236" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="378" y="240" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Latissimus Dorsi</text>

          {/* Forearm Extensors */}
          <circle cx="360" cy="340" r="2.5" fill="#FF4422" />
          <line x1="363" y1="339" x2="390" y2="326" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="392" y="330" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Forearm Ext.</text>

          {/* Gluteus Maximus */}
          <circle cx="333" cy="358" r="2.5" fill="#FF4422" />
          <line x1="336" y1="357" x2="378" y2="344" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="380" y="348" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Glut. Maximus</text>

          {/* Hamstrings */}
          <circle cx="326" cy="410" r="2.5" fill="#FF4422" />
          <line x1="329" y1="409" x2="378" y2="396" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="380" y="400" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Hamstrings</text>

          {/* Gastrocnemius */}
          <circle cx="325" cy="490" r="2.5" fill="#FF4422" />
          <line x1="328" y1="489" x2="374" y2="474" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="376" y="478" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Gastrocnemius</text>

          {/* Soleus / Heel */}
          <circle cx="316" cy="548" r="2.5" fill="#FF4422" />
          <line x1="319" y1="547" x2="364" y2="533" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.6" />
          <text x="366" y="537" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fill="#FFFFFF">Soleus</text>
        </svg>
      </div>
    </div>
  );
}
