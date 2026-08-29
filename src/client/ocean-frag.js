// 海景 fragment shader —— 基于 CodePen Margarita (xbgrWpd) 移植
// 原生 WebGL2（不依赖 three.js）
// 已修复 HTML 实体 &amp;&amp; 转义（原页面把 && 转成 &amp;&amp;，曾致 GLSL 编译失败黑屏）
export default `

precision highp float;

uniform vec2  uR;
uniform float uT, uS, uSc, uBl;

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS — every magic number lives here, grouped by domain
// ═══════════════════════════════════════════════════════════════════

// ── Math ────────────────────────────────────────────────────────────
const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

// ── Render budget ───────────────────────────────────────────────────
const int SEA_TRACE_STEPS  = 8;    // bisection iterations for surface find
const int SEA_OCTAVES_GEO  = 3;    // octaves used during ray marching
const int SEA_OCTAVES_FRAG = 5;    // octaves used for normal computation

// ── Hash / noise ────────────────────────────────────────────────────
const vec2  HASH_DOT   = vec2(127.1, 311.7);
const float HASH_SCALE = 43758.5453123;

// ── Sea octave ──────────────────────────────────────────────────────
const mat2  SEA_OCT_M        = mat2(1.6, 1.2, -1.2, 1.6); // octave rotation
const float SEA_OCT_POWER    = 0.65;  // crest sharpness (1 = sharper)
const float SEA_UV_X_SCALE   = 0.75;  // horizontal stretch ratio
const float SEA_FREQ_BASE    = 0.16;  // initial spatial frequency
const float SEA_FREQ_MUL     = 1.9;   // frequency increase per octave
const float SEA_AMP_MUL      = 0.22;  // amplitude falloff per octave
const float SEA_CHOPPY_BLEND = 0.20;  // choppy → 1.0 blend rate per octave
const float SEA_TRACE_FAR    = 1000.0;// maximum ray distance

// ── Scene transitions ───────────────────────────────────────────────
const float STORM_FADE_LO = 0.500;  // scroll progress where storm begins
const float STORM_FADE_HI = 0.667;
const float NIGHT_FADE_LO = 0.667;  // scroll progress where night begins
const float NIGHT_FADE_HI = 0.833;

// ── Camera ──────────────────────────────────────────────────────────
const float CAM_HEIGHT_START = 5.2;  // eye height at dawn
const float CAM_HEIGHT_END   = 4.4;  // eye height at storm
const float CAM_DRIFT_SPEED  = 0.5;  // forward drift units/sec
const float CAM_PITCH        = 0.20; // look-down angle
const float CAM_FOCAL        = -1.8; // z component of initial ray direction
const float CAM_BARREL       = 0.10; // lens barrel distortion coefficient

// ── Sky gradient ────────────────────────────────────────────────────
const float SKY_GRAD_EXP = 0.42;    // power applied to vertical gradient

// ── Clouds ──────────────────────────────────────────────────────────
const float CLOUD_FREQ_A    = 5.5;   // coarse noise spatial scale
const float CLOUD_FREQ_B    = 8.0;   // fine noise spatial scale
const float CLOUD_TIME_A    = 0.012; // coarse noise time rate
const float CLOUD_TIME_B    = 0.008; // fine noise time rate
const float CLOUD_THRESH_LO = 0.62;  // cloud density threshold low
const float CLOUD_THRESH_HI = 0.86;  // cloud density threshold high
const float CLOUD_BLEND_A   = 0.65;  // coarse octave weight
const float CLOUD_BLEND_B   = 0.35;  // fine octave weight
const float CLOUD_HOR_LO    = -0.02; // fade out below horizon
const float CLOUD_HOR_HI    = 0.24;  // fully visible above
const float CLOUD_AMT_BASE  = 0.06;  // cloud amount in clear weather
const float CLOUD_AMT_STORM = 0.22;  // additional cloud amount in storm
const float CLOUD_DARKEN    = 0.97;  // sky darkening under cloud
const float CLOUD_MIX       = 0.35;  // cloud opacity blend
const vec3  CLOUD_COL_CLEAR = vec3(1.00, 0.82, 0.65); // warm daytime cloud tint
const vec3  CLOUD_COL_STORM = vec3(0.42, 0.48, 0.56); // grey storm cloud tint

// ── Sun ─────────────────────────────────────────────────────────────
const float SUN_ARC_END      = 0.46;  // fraction of scroll at which sun sets
const float SUN_ARC_X        = -0.75; // arc x radius
const float SUN_ARC_Y_SCALE  = 0.38;  // arc y amplitude
const float SUN_ARC_Y_OFFSET = 0.00; // sun sits on horizon at start of dawn
const float SUN_GLOW_LO      = -0.10; // glow start (sun below horizon)
const float SUN_GLOW_HI      = 0.06;  // glow fully active
const float SUN_HALO_EXP_A   = 380.0; // tight inner halo exponent
const float SUN_HALO_SCL_A   = 6.8;
const float SUN_HALO_EXP_B   = 22.0;  // mid corona exponent
const float SUN_HALO_SCL_B   = 0.22;
const float SUN_HALO_EXP_C   = 5.0;   // broad scatter exponent
const float SUN_HALO_SCL_C   = 0.09;
const float SUN_HALO_EXP_D   = 3.0;   // very-wide atmospheric scatter
const float SUN_HALO_SCL_D   = 0.035;
const float SUN_DISK_LO      = 0.99975;  // disk edge inner
const float SUN_DISK_HI      = 0.99998;  // disk edge outer
const float SUN_DISK_SCL     = 1.8;
const float SUN_HORIZON_FALL = 24.0;  // horizon glow vertical falloff
const float SUN_HORIZON_SCL  = 0.11;

// ── Moon ────────────────────────────────────────────────────────────
const vec3  MOON_DIR_RAW     = vec3(-0.14, 0.42, -1.0); // fixed direction
const float MOON_THRESHOLD   = 0.04;   // moonAmt below which moon is skipped
const float MOON_DISK_LO     = 0.99985;
const float MOON_DISK_HI     = 0.99998;
const float MOON_DISK_SCL    = 3.5;
const vec3  MOON_COL_DISK    = vec3(0.95, 0.97, 1.00);
const vec3  MOON_COL_CORONA  = vec3(0.88, 0.92, 1.00);
const float MOON_CORONA_EXP  = 820.0; const float MOON_CORONA_SCL  = 5.0;
const vec3  MOON_COL_HALO1   = vec3(0.65, 0.75, 0.95);
const float MOON_HALO1_EXP   = 60.0;  const float MOON_HALO1_SCL   = 0.18;
const vec3  MOON_COL_HALO2   = vec3(0.40, 0.52, 0.82);
const float MOON_HALO2_EXP   = 12.0;  const float MOON_HALO2_SCL   = 0.07;

// ── Stars in sky ────────────────────────────────────────────────────
const float STAR_HOR_LO     = 0.02;    // horizon fade start
const float STAR_HOR_HI     = 0.28;    // horizon fade end
const float STAR_STORM_SUPP = 0.88;    // storm suppression of stars
const float STAR_NIGHT_SCL  = 2.80;    // overall star brightness scale
const float NIGHT_STARS_THRESHOLD = 0.02;

// ── Horizon mist ────────────────────────────────────────────────────
const float HZ_MIST_CLEAR   = 38.0;  // falloff in clear weather
const float HZ_MIST_STORM   = 22.0;  // falloff in storm (wider mist)
const float HZ_MIST_SCL     = 0.09;  // base mist brightness
const float HZ_MIST_STORM_ADD = 0.10;

// ── Storm sky tint ──────────────────────────────────────────────────
const vec3  STORM_SKY_TINT     = vec3(0.91, 0.94, 0.98);
const float STORM_SKY_TINT_AMT = 0.22;

// ── Lightning ────────────────────────────────────────────────────────
const float LT_RATE          = 0.28;   // flash slots per second
const float LT_PROB          = 0.30;   // fraction of slots that fire
const float LT_DECAY         = 9.0;    // flash decay (higher = shorter)
const float LT_BOLT_ELEV_MIN = 0.015;  // bolt lower elevation bound
const float LT_BOLT_ELEV_MAX = 0.82;   // bolt upper elevation bound
const float LT_BOLT_WIDTH    = 0.0020; // hard-core half-width (thin)
const float LT_BOLT_GLOW     = 0.013;  // soft corona radius
const float LT_JITTER        = 0.070;  // per-segment lateral displacement
const float LT_SEGS          = 9.0;    // angular segments in main bolt
const float LT_BRANCH_SEGS   = 5.0;   // segments in branch arm
const float LT_BRANCH_SPREAD = 0.09;  // branch lateral divergence
const vec3  LT_COL_SHEET     = vec3(0.76, 0.86, 1.00); // sheet glow
const vec3  LT_COL_BOLT      = vec3(0.96, 0.97, 1.00); // bolt + branch
const float LT_SHEET_BRIGHT  = 2.2;
const float LT_BOLT_BRIGHT   = 12.0;  // hard core brightness
const float LT_GLOW_BRIGHT   = 1.6;   // soft corona brightness
const float LT_BRANCH_BRIGHT = 6.0;   // branch arm brightness
const float LT_WATER_BRIGHT  = 0.55;

// ── Sea surface rendering ───────────────────────────────────────────
const float SEA_HORIZON_BLEND  = -0.05; // horizon softness (sea side)
const float SEA_HORIZON_EXP    = 0.30;  // horizon blend power
const float SEA_MIX_THRESHOLD  = 0.001; // skip sea below this blend value
const float SEA_NORMAL_EPS_K   = 0.10;  // adaptive normal eps: dist² × K / width
const float FRESNEL_EXP        = 3.0;
const float FRESNEL_SCL        = 0.65;
// Sun reflection highlights on water
const float REFL_SUN_EXP_A     = 140.0; const float REFL_SUN_SCL_A = 3.0;
const float REFL_SUN_EXP_B     = 18.0;  const float REFL_SUN_SCL_B = 0.10;
// Moon reflection on water
const vec3  REFL_MOON_COL_A = vec3(0.90, 0.94, 1.00);
const float REFL_MOON_EXP_A = 320.0;   const float REFL_MOON_SCL_A = 2.40;
const vec3  REFL_MOON_COL_B = vec3(0.72, 0.82, 0.98);
const float REFL_MOON_EXP_B = 28.0;    const float REFL_MOON_SCL_B = 0.42;
const vec3  REFL_MOON_COL_C = vec3(0.50, 0.62, 0.88);
const float REFL_MOON_EXP_C = 6.0;     const float REFL_MOON_SCL_C = 0.12;
// Diffuse lighting
const float DIFF_WRAP        = 0.4;   // wrap lighting coefficient
const float DIFF_LIFT        = 0.6;   // diffuse minimum
const float DIFF_EXP         = 80.0;  // diffuse exponent
const float DIFF_WATER_SCL   = 0.12;  // water color diffuse contribution
// Subsurface scatter
const float SSS_ATTEN_K   = 0.001; // attenuation per dist²
const float SSS_SCL       = 0.18;  // scatter brightness
// Sun specular on water
const float SPEC_EXP      = 60.0;
// Water glitter
const float GLITTER_UV_SCL    = 18.0;
const float GLITTER_TIME_U    = 0.55;
const float GLITTER_TIME_V    = 0.22;
const float GLITTER_THRESH    = 0.94;
const float GLITTER_SCL       = 0.09;
// Moon specular on water
const vec3  MSPEC_COL_A   = vec3(0.88, 0.93, 1.00);
const float MSPEC_EXP_A   = 380.0; const float MSPEC_SCL_A = 0.55;
const vec3  MSPEC_COL_B   = vec3(0.70, 0.80, 0.97);
const float MSPEC_EXP_B   = 22.0;  const float MSPEC_SCL_B = 0.14;
// Fog
const float FOG_SCALE = 1.6;

// ── Post-processing ─────────────────────────────────────────────────
const float HOR_EDGE_LO    = -0.008; // horizon softening band start
const float HOR_EDGE_HI    = 0.018;  // horizon softening band end
const float HOR_BLEND      = 0.25;   // fog-into-horizon blend fraction
const float GRAIN_UV_SCL   = 0.5;    // noise coord scale for grain
const float GRAIN_TIME_SCL = 12.0;   // grain animation rate
const float GRAIN_STR      = 0.003;  // grain magnitude
const float GAMMA          = 0.78;   // photographic tone gamma

// ═══════════════════════════════════════════════════════════════════
// SCENE PALETTES  (6 stops: predawn / dawn / midday / dusk / storm / night)
// ═══════════════════════════════════════════════════════════════════
// PRE-DAWN: blue-lavender sky, warm rose-pink horizon glow (palette ref: image 1)
const vec3 SKY_TOP_PREDAWN  = vec3(0.38, 0.40, 0.64);  // soft periwinkle-blue
const vec3 SKY_TOP_DAWN     = vec3(0.42, 0.60, 0.90);  // pale blue — orange stays near horizon
const vec3 SKY_TOP_DAY      = vec3(0.04, 0.22, 0.62);
const vec3 SKY_TOP_DUSK     = vec3(0.14, 0.04, 0.26);  // deep purple overhead
const vec3 SKY_TOP_STORM    = vec3(0.04, 0.05, 0.09);
const vec3 SKY_TOP_NIGHT    = vec3(0.01, 0.01, 0.05);  // near-black, no purple

const vec3 SKY_HOR_PREDAWN  = vec3(0.70, 0.52, 0.64);  // soft rose blush at horizon
const vec3 SKY_HOR_DAWN     = vec3(0.98, 0.50, 0.12);  // bright orange sunrise
const vec3 SKY_HOR_DAY      = vec3(0.50, 0.68, 0.92);
const vec3 SKY_HOR_DUSK     = vec3(0.98, 0.22, 0.02);  // vivid red-orange horizon
const vec3 SKY_HOR_STORM    = vec3(0.15, 0.17, 0.23);
const vec3 SKY_HOR_NIGHT    = vec3(0.02, 0.02, 0.06);  // dark near-black, no purple

const vec3 SUN_COL_PREDAWN  = vec3(0.90, 0.55, 0.62);  // soft salmon-pink sub-horizon glow
const vec3 SUN_COL_DAWN     = vec3(1.00, 0.88, 0.35);  // bright warm gold
const vec3 SUN_COL_DAY      = vec3(1.00, 0.96, 0.80);
const vec3 SUN_COL_DUSK     = vec3(1.00, 0.28, 0.04);  // deep red sun at horizon
const vec3 SUN_COL_STORM    = vec3(0.26, 0.28, 0.34);
const vec3 SUN_COL_NIGHT    = vec3(0.72, 0.78, 0.98);  // moonlight blue-white

const vec3 SEA_BASE_PREDAWN = vec3(0.02, 0.02, 0.06);  // near-black deep indigo
const vec3 SEA_BASE_DAWN    = vec3(0.08, 0.04, 0.02);  // dark warm
const vec3 SEA_BASE_DAY     = vec3(0.02, 0.10, 0.26);
const vec3 SEA_BASE_DUSK    = vec3(0.09, 0.05, 0.03);
const vec3 SEA_BASE_STORM   = vec3(0.03, 0.04, 0.06);
const vec3 SEA_BASE_NIGHT   = vec3(0.01, 0.01, 0.04);

const vec3 SEA_WATER_PREDAWN = vec3(0.25, 0.28, 0.54);  // dark muted blue-lavender
const vec3 SEA_WATER_DAWN    = vec3(0.82, 0.55, 0.32);  // warm peach-amber
const vec3 SEA_WATER_DAY     = vec3(0.42, 0.82, 0.88);  // turquoise midday
const vec3 SEA_WATER_DUSK    = vec3(0.32, 0.18, 0.08);  // dark amber-brown, not bright orange
const vec3 SEA_WATER_STORM   = vec3(0.48, 0.54, 0.60);
const vec3 SEA_WATER_NIGHT   = vec3(0.20, 0.32, 0.62);  // dark moonlit blue, no purple

const vec3 FOG_COL_PREDAWN  = vec3(0.60, 0.46, 0.58);  // muted rose-lavender haze
const vec3 FOG_COL_DAWN     = vec3(0.92, 0.65, 0.45);  // warm peach haze
const vec3 FOG_COL_DAY      = vec3(0.60, 0.76, 0.94);
const vec3 FOG_COL_DUSK     = vec3(0.30, 0.10, 0.06);  // dark, low saturation
const vec3 FOG_COL_STORM    = vec3(0.12, 0.14, 0.18);
const vec3 FOG_COL_NIGHT    = vec3(0.01, 0.01, 0.04);  // near-black, no purple cast

// ── Sea scalars per scene ───────────────────────────────────────────
const float SEA_H_PREDAWN = 0.42;
const float SEA_H_DAWN  = 0.62;
const float SEA_H_DAY   = 0.48;
const float SEA_H_DUSK  = 0.72;
const float SEA_H_NIGHT = 0.48;
const float SEA_H_STORM = 1.35;
const float SEA_H_STORM_EXTRA = 0.25; // extra height added by storm blend

const float SEA_CH_PREDAWN = 0.68;
const float SEA_CH_DAWN  = 1.00;
const float SEA_CH_DAY   = 0.75;
const float SEA_CH_DUSK  = 1.25;
const float SEA_CH_NIGHT = 0.75;
const float SEA_CH_STORM = 2.80;

const float SEA_SPD_PREDAWN = 0.48;
const float SEA_SPD_DAWN  = 0.80;
const float SEA_SPD_DAY   = 0.65;
const float SEA_SPD_DUSK  = 0.90;
const float SEA_SPD_NIGHT = 0.55;
const float SEA_SPD_STORM = 1.40;

const float FOG_DEN_PREDAWN = 0.010;
const float FOG_DEN_DAWN  = 0.012;
const float FOG_DEN_DAY   = 0.010;
const float FOG_DEN_DUSK  = 0.014;
const float FOG_DEN_NIGHT = 0.028;
const float FOG_DEN_STORM = 0.046;

const float MOON_AMT_PREDAWN = 0.62;  // moon still visible
const float MOON_AMT_DAWN  = 0.10;   // nearly gone
const float MOON_AMT_DAY   = 0.00;
const float MOON_AMT_DUSK  = 0.00;
const float MOON_AMT_NIGHT = 0.80;
const float MOON_AMT_STORM = 0.10;  // faint moon through storm clouds

// ═══════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════

float sat(float x) { return clamp(x, 0.0, 1.0); }

// Smooth Hermite interpolation (C2)
float smoother(float x) {
  x = sat(x);
  return x*x*x * (x*(x*6.0 - 15.0) + 10.0);
}

// Interpolate a vec3 across 6 named scene stops
vec3 sCol(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, vec3 c5) {
  int si = int(uSc);
  vec3 a = c0, b = c1;
  if      (si == 1) { a = c1; b = c2; }
  else if (si == 2) { a = c2; b = c3; }
  else if (si == 3) { a = c3; b = c4; }
  else if (si == 4) { a = c4; b = c5; }
  return mix(a, b, uBl);
}

// Interpolate a float across 6 named scene stops
float sF(float c0, float c1, float c2, float c3, float c4, float c5) {
  int si = int(uSc);
  float a = c0, b = c1;
  if      (si == 1) { a = c1; b = c2; }
  else if (si == 2) { a = c2; b = c3; }
  else if (si == 3) { a = c3; b = c4; }
  else if (si == 4) { a = c4; b = c5; }
  return mix(a, b, uBl);
}

float hash(vec2 p) {
  return fract(sin(dot(p, HASH_DOT)) * HASH_SCALE);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f * (3.0 - 2.0*f);
  float a = hash(i),              b = hash(i + vec2(1,0));
  float c = hash(i + vec2(0,1)),  d = hash(i + vec2(1,1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float snoise(vec2 p) { return noise(p) * 2.0 - 1.0; }

// ═══════════════════════════════════════════════════════════════════
// SEA
// ═══════════════════════════════════════════════════════════════════

float sea_octave(vec2 uv, float choppy) {
  uv += snoise(uv);
  vec2 wv  = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, SEA_OCT_POWER), choppy);
}

float seaMap(vec3 p, float seaH, float ch, float seaT) {
  float freq = SEA_FREQ_BASE, amp = seaH, choppy = ch;
  vec2  uv   = p.xz; uv.x *= SEA_UV_X_SCALE;
  float d, h = 0.0;
  for (int i = 0; i < SEA_OCTAVES_GEO; i++) {
    d    = sea_octave((uv + seaT) * freq, choppy);
    d   += sea_octave((uv - seaT) * freq, choppy);
    h   += d * amp;
    uv  *= SEA_OCT_M;
    freq *= SEA_FREQ_MUL;
    amp  *= SEA_AMP_MUL;
    choppy = mix(choppy, 1.0, SEA_CHOPPY_BLEND);
  }
  return p.y - h;
}

float seaMapFine(vec3 p, float seaH, float ch, float seaT) {
  float freq = SEA_FREQ_BASE, amp = seaH, choppy = ch;
  vec2  uv   = p.xz; uv.x *= SEA_UV_X_SCALE;
  float d, h = 0.0;
  for (int i = 0; i < SEA_OCTAVES_FRAG; i++) {
    d    = sea_octave((uv + seaT) * freq, choppy);
    d   += sea_octave((uv - seaT) * freq, choppy);
    h   += d * amp;
    uv  *= SEA_OCT_M;
    freq *= SEA_FREQ_MUL;
    amp  *= SEA_AMP_MUL;
    choppy = mix(choppy, 1.0, SEA_CHOPPY_BLEND);
  }
  return p.y - h;
}

float seaTrace(vec3 ori, vec3 dir, out vec3 p, float seaH, float ch, float seaT) {
  float tm = 0.0, tx = SEA_TRACE_FAR;
  float hx = seaMap(ori + dir * tx, seaH, ch, seaT);
  if (hx > 0.0) { p = ori + dir * tx; return tx; }
  float hm = seaMap(ori, seaH, ch, seaT);
  float tmid = 0.0;
  for (int i = 0; i < SEA_TRACE_STEPS; i++) {
    tmid = mix(tm, tx, hm / (hm - hx));
    p    = ori + dir * tmid;
    float hmid = seaMap(p, seaH, ch, seaT);
    if (hmid < 0.0) { tx = tmid; hx = hmid; }
    else            { tm = tmid; hm = hmid; }
  }
  return tmid;
}

vec3 seaNormal(vec3 p, float eps, float seaH, float ch, float seaT) {
  vec3 n;
  n.y = seaMapFine(p, seaH, ch, seaT);
  n.x = seaMapFine(vec3(p.x + eps, p.y, p.z), seaH, ch, seaT) - n.y;
  n.z = seaMapFine(vec3(p.x, p.y, p.z + eps), seaH, ch, seaT) - n.y;
  n.y = eps;
  return normalize(n);
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

void main() {
  vec2  uv = (gl_FragCoord.xy - uR * 0.5) / uR.y;
  float s  = smoother(uS);

  float storm = smoothstep(STORM_FADE_LO, STORM_FADE_HI, s);
  float night = smoothstep(NIGHT_FADE_LO, NIGHT_FADE_HI, s);

  // ── Scene-driven sea parameters ────────────────────────────────
  float seaH  = sF(SEA_H_DAWN, SEA_H_DAY, SEA_H_DUSK, SEA_H_STORM, SEA_H_NIGHT, SEA_H_PREDAWN)
               + storm * SEA_H_STORM_EXTRA;
  float seaCh = sF(SEA_CH_DAWN, SEA_CH_DAY, SEA_CH_DUSK, SEA_CH_STORM, SEA_CH_NIGHT, SEA_CH_PREDAWN);
  float seaT  = uT * sF(SEA_SPD_DAWN, SEA_SPD_DAY, SEA_SPD_DUSK, SEA_SPD_STORM, SEA_SPD_NIGHT, SEA_SPD_PREDAWN);

  // ── Lightning ──────────────────────────────────────────────────
  // Quantise time into slots; each slot either fires or stays dark
  float ltSlot  = floor(uT * LT_RATE);
  float ltRand  = hash(vec2(ltSlot, 17.31));
  float ltPhase = fract(uT * LT_RATE);
  float ltFire  = step(1.0 - LT_PROB, ltRand);
  // Second sub-flash ~0.08 s after the main one for double-strike feel
  float ltRand2 = hash(vec2(ltSlot, 5.77));
  float ltPhase2 = clamp(ltPhase - 0.12, 0.0, 1.0);
  float ltFire2  = step(1.0 - LT_PROB * 0.5, ltRand2);
  float ltFlash = (ltFire  * exp(-ltPhase  * LT_DECAY)
                + ltFire2 * exp(-ltPhase2 * LT_DECAY) * 0.55) * storm;
  // Horizontal position of bolt, random per slot
  float ltBoltX = (hash(vec2(ltSlot, 3.91)) - 0.5) * 1.4;

  // ── Scene palette ──────────────────────────────────────────────
  vec3 skyTop   = sCol(SKY_TOP_DAWN,   SKY_TOP_DAY,   SKY_TOP_DUSK,   SKY_TOP_STORM,   SKY_TOP_NIGHT,   SKY_TOP_PREDAWN);
  vec3 skyHori  = sCol(SKY_HOR_DAWN,   SKY_HOR_DAY,   SKY_HOR_DUSK,   SKY_HOR_STORM,   SKY_HOR_NIGHT,   SKY_HOR_PREDAWN);
  vec3 sunCol   = sCol(SUN_COL_DAWN,   SUN_COL_DAY,   SUN_COL_DUSK,   SUN_COL_STORM,   SUN_COL_NIGHT,   SUN_COL_PREDAWN);
  vec3 seaBase  = sCol(SEA_BASE_DAWN,  SEA_BASE_DAY,  SEA_BASE_DUSK,  SEA_BASE_STORM,  SEA_BASE_NIGHT,  SEA_BASE_PREDAWN);
  vec3 seaWater = sCol(SEA_WATER_DAWN, SEA_WATER_DAY, SEA_WATER_DUSK, SEA_WATER_STORM, SEA_WATER_NIGHT, SEA_WATER_PREDAWN);
  vec3 fogCol   = sCol(FOG_COL_DAWN,   FOG_COL_DAY,   FOG_COL_DUSK,   FOG_COL_STORM,   FOG_COL_NIGHT,   FOG_COL_PREDAWN);
  float fogDen  = sF(FOG_DEN_DAWN, FOG_DEN_DAY, FOG_DEN_DUSK, FOG_DEN_STORM, FOG_DEN_NIGHT, FOG_DEN_PREDAWN);

  // ── Delayed warm-up for midday→dusk (uSc==1) ──────────────────
  // Water, sun color and fog all stay cool until the final quarter of the blend
  if (int(uSc) == 1) {
    float t  = uBl;
    float d5 = t * t * t * t * t;   // x^5 — very late onset
    sunCol   = mix(SUN_COL_DAY,      SUN_COL_DUSK,   d5);
    seaWater = mix(SEA_WATER_DAY,    SEA_WATER_DUSK, d5);
    seaBase  = mix(SEA_BASE_DAY,     SEA_BASE_DUSK,  d5);
    fogCol   = mix(FOG_COL_DAY,      FOG_COL_DUSK,   d5);
    fogDen   = mix(FOG_DEN_DAY,      FOG_DEN_DUSK,   d5);
  }

  // ── Sun / moon direction & intensity ───────────────────────────
  float sunProgress = clamp(s / SUN_ARC_END, 0.0, 1.0);
  float sunAngle    = sunProgress * PI;
  vec3  sunDir  = normalize(vec3(cos(sunAngle) * SUN_ARC_X,
                                  sin(sunAngle) * SUN_ARC_Y_SCALE + SUN_ARC_Y_OFFSET,
                                  -1.0));
  vec3  moonDir = normalize(MOON_DIR_RAW);
  float moonAmt = sF(MOON_AMT_DAWN, MOON_AMT_DAY, MOON_AMT_DUSK, MOON_AMT_STORM, MOON_AMT_NIGHT, MOON_AMT_PREDAWN);
  float sunAbove = step(0.0, sunDir.y);
  float sunGlow  = smoothstep(SUN_GLOW_LO, SUN_GLOW_HI, sunDir.y);

  // ── Camera ─────────────────────────────────────────────────────
  vec3 ori = vec3(0.0, mix(CAM_HEIGHT_START, CAM_HEIGHT_END, s), uT * CAM_DRIFT_SPEED);
  vec3 rd  = normalize(vec3(uv.x, uv.y - CAM_PITCH, CAM_FOCAL));
  rd.z    += length(uv) * CAM_BARREL;
  rd       = normalize(rd);

  // ── Sky ────────────────────────────────────────────────────────
  vec3 skyCol;
  {
    float elev = clamp(rd.y, 0.0, 1.0);

    // Delay orange bleed during midday→dusk (uSc==1):
    // quintic ease on both top and horizon — stays blue until ~final quarter
    vec3 skyTopFinal  = skyTop;
    vec3 skyHoriFinal = skyHori;
    if (int(uSc) == 1) {
      float t = uBl;
      float db = t * t * t * t * t;  // x^5 — very delayed warmth
      skyTopFinal  = mix(SKY_TOP_DAY,     SKY_TOP_DUSK,   db);
      skyHoriFinal = mix(SKY_HOR_DAY,     SKY_HOR_DUSK,   db * db);  // even later on horizon
    }
    // Also delay dawn→midday top from bluing out too fast
    if (int(uSc) == 0) {
      float db = uBl * uBl;
      skyTopFinal  = mix(SKY_TOP_DAWN,    SKY_TOP_DAY,    db);
      skyHoriFinal = mix(SKY_HOR_DAWN,    SKY_HOR_DAY,    uBl);
    }

    // Per-scene gradient exponent: dusk gets a steeper curve so purple dominates
    // overhead and orange is tightly bound near the horizon
    float gradExp = SKY_GRAD_EXP;
    if (int(uSc) == 2) gradExp = 0.22;  // pure dusk: very steep — purple overhead, orange strip low
    if (int(uSc) == 1) {
      // midday→dusk: ease the exponent from normal to steep
      float db = uBl * uBl * uBl * uBl * uBl;
      gradExp = mix(SKY_GRAD_EXP, 0.22, db);
    }

    skyCol = mix(skyHoriFinal, skyTopFinal, pow(elev, gradExp));

    // Dusk crimson mid-band: vivid red-crimson strip between horizon orange and purple sky
    if (int(uSc) == 2 || (int(uSc) == 1 && uBl > 0.6)) {
      float duskAmt = (int(uSc) == 2) ? 1.0 : (uBl - 0.6) / 0.4;
      float midBand = exp(-pow((elev - 0.12) / 0.09, 2.0));  // gaussian centered at low elevation
      vec3  crimson = vec3(0.78, 0.10, 0.04);
      skyCol = mix(skyCol, crimson, midBand * 0.55 * duskAmt);
    }

    // Clouds
    float cn1    = noise(vec2(rd.x * CLOUD_FREQ_A + rd.y * 3.0, uT * CLOUD_TIME_A));
    float cn2    = noise(vec2(rd.x * CLOUD_FREQ_B - rd.y * 4.0, uT * CLOUD_TIME_B));
    float clouds = smoothstep(CLOUD_THRESH_LO, CLOUD_THRESH_HI,
                              cn1 * CLOUD_BLEND_A + cn2 * CLOUD_BLEND_B);
    clouds *= smoothstep(CLOUD_HOR_LO, CLOUD_HOR_HI, rd.y)
           * (CLOUD_AMT_BASE + storm * CLOUD_AMT_STORM);
    vec3 cloudC  = mix(CLOUD_COL_CLEAR, CLOUD_COL_STORM, storm);
    skyCol = mix(skyCol, mix(skyCol * CLOUD_DARKEN, cloudC, CLOUD_MIX), clouds);

    // Sun glows + disk
    float sd = max(dot(rd, sunDir), 0.0);
    skyCol += sunCol * pow(sd, SUN_HALO_EXP_A) * SUN_HALO_SCL_A * sunGlow;
    skyCol += sunCol * pow(sd, SUN_HALO_EXP_B) * SUN_HALO_SCL_B * sunGlow;
    skyCol += sunCol * pow(sd, SUN_HALO_EXP_C) * SUN_HALO_SCL_C * sunGlow;
    skyCol += sunCol * pow(sd, SUN_HALO_EXP_D) * SUN_HALO_SCL_D * sunGlow;
    skyCol += sunCol * smoothstep(SUN_DISK_LO, SUN_DISK_HI, dot(rd, sunDir))
                     * SUN_DISK_SCL * sunGlow;
    skyCol += sunCol * exp(-abs(rd.y) * SUN_HORIZON_FALL) * SUN_HORIZON_SCL * sunGlow;

    // Moon disk + halo
    if (moonAmt > MOON_THRESHOLD) {
      float md = max(dot(rd, moonDir), 0.0);
      skyCol += MOON_COL_DISK   * smoothstep(MOON_DISK_LO, MOON_DISK_HI, dot(rd, moonDir))
                                * MOON_DISK_SCL * moonAmt;
      skyCol += MOON_COL_CORONA * pow(md, MOON_CORONA_EXP) * MOON_CORONA_SCL * moonAmt;
      skyCol += MOON_COL_HALO1  * pow(md, MOON_HALO1_EXP)  * MOON_HALO1_SCL  * moonAmt;
      skyCol += MOON_COL_HALO2  * pow(md, MOON_HALO2_EXP)  * MOON_HALO2_SCL  * moonAmt;
    }

    // Stars — visible in night (fading in) and predawn (last scene, fading in)
    float predawnStars = smoothstep(0.833, 0.916, s);
    float starVis = max(night, predawnStars);
    if (starVis > NIGHT_STARS_THRESHOLD) {
      float starAngle = uT * 0.008;
      float cT = cos(starAngle), sT = sin(starAngle);
      vec3 srd = vec3(mat2(cT,-sT,sT,cT) * rd.xy, rd.z);

      float sn  = hash(srd.xy * 300.0 + vec2(srd.z * 300.0));
      // Tiered magnitudes — bright/medium/faint — creates depth and density
      float sBright = pow(clamp(sn - 0.9994, 0.0, 1.0) * 1667.0, 1.6);
      float sMedium = pow(clamp(sn - 0.998,  0.0, 1.0) *  500.0, 2.0) * 0.30;
      float sFaint  = pow(clamp(sn - 0.993,  0.0, 1.0) *  143.0, 2.0) * 0.07;
      float stars = sBright + sMedium + sFaint;
      // Smooth per-star atmospheric scintillation — each star has its own rate
      float scintSpeed = 0.30 + sn * 0.60;
      stars *= 0.92 + 0.08 * sin(uT * scintSpeed + sn * 19.7);

      float starMask = smoothstep(STAR_HOR_LO, STAR_HOR_HI, rd.y)
                     * (1.0 - storm * STAR_STORM_SUPP);
      skyCol += vec3(stars) * starMask * starVis * STAR_NIGHT_SCL;
    }

    // Lightning sheet glow — diffuse brightening of the cloud layer
    skyCol += LT_COL_SHEET * ltFlash * LT_SHEET_BRIGHT;

    // Lightning bolts — multi-bolt with organic branching
    if (ltFlash > 0.003 && rd.y > LT_BOLT_ELEV_MIN && rd.y < LT_BOLT_ELEV_MAX) {
      float screenX = rd.x / max(0.05, -rd.z);
      // elevN=1 at top of sky, elevN=0 at horizon — bolts travel 1→0
      float elevN   = (rd.y - LT_BOLT_ELEV_MIN) / (LT_BOLT_ELEV_MAX - LT_BOLT_ELEV_MIN);

      float boltGlow = 0.0;
      // Fade bolt out as it approaches the horizon — no hard cutoff
      float horizFade = smoothstep(0.0, 0.12, elevN);
      const int NSEGS = 18;

      for (int bi = 0; bi < 2; bi++) {
        float bSeed = ltSlot * 7.3 + float(bi) * 50.0;
        float j     = bSeed * 17.3;

        // Pre-walk x positions: xs[0] = top of bolt, xs[17] = near horizon
        float xs[18];
        xs[0] = (hash(vec2(bSeed, 0.3)) - 0.5) * 1.0;
        for (int i = 1; i < NSEGS; i++) {
          float fi = float(i);
          xs[i] = xs[i-1] + (hash(vec2(j + fi * 0.71, 2.0)) - 0.5) * 0.06;
        }

        // Main bolt: segment i spans elevN from (1 - (i+1)/N) to (1 - i/N)
        // i.e. segment 0 is at the top, segment N-1 near the horizon
        for (int i = 0; i < NSEGS; i++) {
          float fi    = float(i);
          float segHi = 1.0 - fi / float(NSEGS);
          float segLo = 1.0 - (fi + 1.0) / float(NSEGS);
          float x0    = xs[i];
          float x1    = (i < NSEGS - 1) ? xs[i+1] : xs[i];

          if (elevN >= segLo && elevN < segHi) {
            float t  = (segHi - elevN) / (segHi - segLo);
            float cx = mix(x0, x1, t);
            float dM = abs(screenX - cx);
            boltGlow += smoothstep(0.0007, 0.0, dM) * 4.5;
            boltGlow += exp(-dM * 120.0) * 1.2;
            boltGlow += exp(-dM * 40.0)  * 0.35;
          }

          // Branch: 25% chance, continuous position interpolated — no hard segment cuts
          if (hash(vec2(j + fi * 1.9, 3.0)) < 0.25 && segLo > 0.06) {
            float ba    = hash(vec2(j + fi * 3.1, 4.0)) * 1.5;
            float bSpan = segLo * 0.65;
            float bTop  = segLo;
            float bBot  = segLo - bSpan;

            if (elevN >= bBot && elevN < bTop) {
              // How far along the branch (0=start at split, 1=tip)
              float bt = (bTop - elevN) / bSpan;
              // Fade branch out toward tip
              float bFade = 1.0 - bt * bt;

              // Walk branch steps to find x at this bt
              const int NBSEGS = 7;
              float bcX = x0;
              float prevBcX = x0;
              for (int k = 0; k < NBSEGS; k++) {
                float fk   = float(k);
                float tLo  = fk       / float(NBSEGS);
                float tHi  = (fk+1.0) / float(NBSEGS);
                float bnX  = bcX + (hash(vec2(ba + fk * 0.5, 5.0)) - 0.5) * 0.05;
                if (bt >= tLo && bt < tHi) {
                  float lt   = (bt - tLo) / (tHi - tLo);
                  float bcx  = mix(bcX, bnX, lt);
                  float dB   = abs(screenX - bcx);
                  boltGlow  += (smoothstep(0.0006, 0.0, dB) * 2.5
                              + exp(-dB * 100.0) * 0.6
                              + exp(-dB * 32.0)  * 0.15) * bFade;
                }
                bcX = bnX;
              }
            }
          }
        }
      }

      skyCol += LT_COL_BOLT * boltGlow * ltFlash * horizFade;
    }

    // Horizon mist
    float hzMist = exp(-abs(rd.y) * mix(HZ_MIST_CLEAR, HZ_MIST_STORM, storm));
    skyCol += fogCol * hzMist * (HZ_MIST_SCL + storm * HZ_MIST_STORM_ADD);
    skyCol  = mix(skyCol, skyCol * STORM_SKY_TINT, storm * STORM_SKY_TINT_AMT);
  }

  // ── Sea ────────────────────────────────────────────────────────
  float seaMix = pow(smoothstep(0.0, SEA_HORIZON_BLEND, rd.y), SEA_HORIZON_EXP);
  vec3  col;

  if (seaMix > SEA_MIX_THRESHOLD) {
    vec3 p;
    seaTrace(ori, rd, p, seaH, seaCh, seaT);
    vec3  dist   = p - ori;
    float eps    = dot(dist, dist) * SEA_NORMAL_EPS_K / uR.x;
    vec3  n      = seaNormal(p, eps, seaH, seaCh, seaT);
    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), FRESNEL_EXP) * FRESNEL_SCL;

    // Sky reflected in surface
    vec3  reflDir = reflect(rd, n);
    float rElev   = clamp(reflDir.y, 0.0, 1.0);
    vec3  reflSky = mix(skyHori, skyTop, pow(rElev, SKY_GRAD_EXP));

    float rSun = max(dot(reflDir, sunDir), 0.0);
    reflSky += sunCol * pow(rSun, REFL_SUN_EXP_A) * REFL_SUN_SCL_A * sunGlow;
    reflSky += sunCol * pow(rSun, REFL_SUN_EXP_B) * REFL_SUN_SCL_B * sunGlow;

    if (moonAmt > MOON_THRESHOLD) {
      float rMoon = max(dot(reflDir, moonDir), 0.0);
      reflSky += REFL_MOON_COL_A * pow(rMoon, REFL_MOON_EXP_A) * REFL_MOON_SCL_A * moonAmt;
      reflSky += REFL_MOON_COL_B * pow(rMoon, REFL_MOON_EXP_B) * REFL_MOON_SCL_B * moonAmt;
      reflSky += REFL_MOON_COL_C * pow(rMoon, REFL_MOON_EXP_C) * REFL_MOON_SCL_C * moonAmt;
    }

    // Diffuse + refracted base
    float diff      = pow(dot(n, sunDir) * DIFF_WRAP + DIFF_LIFT, DIFF_EXP) * sunGlow;
    vec3  refracted = seaBase + diff * seaWater * DIFF_WATER_SCL;
    vec3  waterCol  = mix(refracted, reflSky, fresnel);

    // Subsurface scatter
    float atten = max(1.0 - dot(dist, dist) * SSS_ATTEN_K, 0.0);
    waterCol   += seaWater * (p.y - seaH) * SSS_SCL * atten;

    // Sun specular (energy-conserving Blinn-Phong)
    float specNrm = (SPEC_EXP + 8.0) / (PI * 8.0);
    float spec    = pow(max(dot(reflect(-sunDir, n), -rd), 0.0), SPEC_EXP) * specNrm;
    waterCol     += sunCol * spec * sunAbove;

    // Glitter
    float glitter = noise(p.xz * GLITTER_UV_SCL + vec2(uT * GLITTER_TIME_U, uT * GLITTER_TIME_V));
    waterCol += sunCol * smoothstep(GLITTER_THRESH, 1.0, glitter) * GLITTER_SCL * sunGlow * sunAbove;

    // Moon specular on water
    if (moonAmt > MOON_THRESHOLD) {
      waterCol += MSPEC_COL_A * pow(max(dot(reflect(-moonDir,n),-rd),0.0), MSPEC_EXP_A) * MSPEC_SCL_A * moonAmt;
      waterCol += MSPEC_COL_B * pow(max(dot(reflect(-moonDir,n),-rd),0.0), MSPEC_EXP_B) * MSPEC_SCL_B * moonAmt;
    }

    // Lightning flash on water
    waterCol += LT_COL_SHEET * ltFlash * LT_WATER_BRIGHT;

    // Fog
    waterCol = mix(waterCol, fogCol, 1.0 - exp(-length(dist) * fogDen * FOG_SCALE));

    col = mix(skyCol, waterCol, seaMix);
  } else {
    col = skyCol;
  }

  // ── Post-processing ────────────────────────────────────────────
  col  = mix(fogCol, col, smoothstep(HOR_EDGE_LO, HOR_EDGE_HI, rd.y) * HOR_BLEND
           + (1.0 - HOR_BLEND));
  col += (hash(gl_FragCoord.xy * GRAIN_UV_SCL + floor(uT * GRAIN_TIME_SCL)) - 0.5)
       * GRAIN_STR;
  gl_FragColor = vec4(clamp(pow(col, vec3(GAMMA)), 0.0, 1.0), 1.0);
}

`
