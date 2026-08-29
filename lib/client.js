window.__ModuleLoader__.load({
  id: "@eternalnight/dsh-theme",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
var ge=Object.create;var $=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var be=Object.getOwnPropertyNames;var ve=Object.getPrototypeOf,Ae=Object.prototype.hasOwnProperty;var Oe=(o,r)=>{for(var a in r)$(o,a,{get:r[a],enumerable:!0})},ne=(o,r,a,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of be(r))!Ae.call(o,s)&&s!==a&&$(o,s,{get:()=>r[s],enumerable:!(i=he(r,s))||i.enumerable});return o};var Le=(o,r,a)=>(a=o!=null?ge(ve(o)):{},ne(r||!o||!o.__esModule?$(a,"default",{value:o,enumerable:!0}):a,o)),Te=o=>ne($({},"__esModule",{value:!0}),o);var Ue={};Oe(Ue,{apply:()=>Pe,inject:()=>Ce});module.exports=Te(Ue);var e=Le(require("react"),1),de=require("react-dom");var ee="/dsh-theme/assets",Z=[{id:"dark",name:"\u6DF1\u7A7A\u6697",kind:"color",dark:!0,bg:"radial-gradient(120% 120% at 50% 0%, #1c2333 0%, #0d1117 55%, #070a10 100%)",tokens:{"--dsw-alias-bg-base":{light:"#f3f5f9",dark:"#0d1117"},"--dsw-alias-bg-layer-1":{light:"#ffffff",dark:"#161c28"},"--dsw-alias-bg-layer-2":{light:"#f6f8fc",dark:"#1d2433"},"--dsw-alias-bg-overlay":{light:"#ffffff",dark:"#12161f"},"--dsw-alias-border-l1":{light:"#e2e6ee",dark:"#242c3a"},"--dsw-alias-border-l2":{light:"#ccd3df",dark:"#333d4d"},"--dsw-specific-sidebar-fill":{light:"#eef1f7",dark:"#10141d"}}},{id:"graphite",name:"\u77F3\u58A8",kind:"color",dark:!0,bg:"radial-gradient(120% 120% at 50% 0%, #17181c 0%, #101114 55%, #050507 100%)",tokens:{"--dsw-alias-bg-base":{light:"#f1f1f3",dark:"#101114"},"--dsw-alias-bg-layer-1":{light:"#fafafa",dark:"#1a1b20"},"--dsw-alias-bg-layer-2":{light:"#f4f4f6",dark:"#222328"},"--dsw-alias-bg-overlay":{light:"#ffffff",dark:"#15161a"},"--dsw-alias-border-l1":{light:"#e3e3e6",dark:"#2a2b31"},"--dsw-alias-border-l2":{light:"#cfcfd6",dark:"#383a42"},"--dsw-specific-sidebar-fill":{light:"#eeeef0",dark:"#0c0d10"}}},{id:"light",name:"\u6668\u5149\u4EAE",kind:"color",dark:!1,bg:"radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f3f5f9 55%, #e6eaf1 100%)",tokens:{"--dsw-alias-bg-base":{light:"#f3f5f9",dark:"#121722"},"--dsw-alias-bg-layer-1":{light:"#ffffff",dark:"#1a2230"},"--dsw-alias-bg-layer-2":{light:"#f6f8fc",dark:"#212b3c"},"--dsw-alias-bg-overlay":{light:"#ffffff",dark:"#171e2a"},"--dsw-alias-border-l1":{light:"#e2e6ee",dark:"#2a3444"},"--dsw-alias-border-l2":{light:"#ccd3df",dark:"#3a465a"},"--dsw-specific-sidebar-fill":{light:"#eef1f7",dark:"#131926"}}},{id:"sakura",name:"\u6A31\u7C89",kind:"color",dark:!1,bg:"radial-gradient(120% 120% at 50% 0%, #fff0f3 0%, #fbe3ea 55%, #f2cfd9 100%)",tokens:{"--dsw-alias-bg-base":{light:"#fbe9ee",dark:"#231722"},"--dsw-alias-bg-layer-1":{light:"#fff7f9",dark:"#2d1d29"},"--dsw-alias-bg-layer-2":{light:"#fdeff3",dark:"#37212f"},"--dsw-alias-bg-overlay":{light:"#fff7f9",dark:"#291a25"},"--dsw-alias-border-l1":{light:"#f2d3dc",dark:"#43283a"},"--dsw-alias-border-l2":{light:"#e4b6c5",dark:"#55334a"},"--dsw-specific-sidebar-fill":{light:"#fbe0e8",dark:"#1f1520"}}},{id:"aurora",name:"\u6781\u5149\u661F\u4E91",kind:"backdrop",dark:!0,file:"aurora.png"},{id:"sunset",name:"\u66AE\u8272\u971E\u5149",kind:"backdrop",dark:!0,file:"sunset.png"},{id:"deep-space",name:"\u6DF1\u7A7A\u5B87\u5B99",kind:"backdrop",dark:!0,file:"deep-space.png"}];function G(o){return o&&o.file?`${ee}/backgrounds/${o.file}`:""}function W(o){return Z.find(r=>r.id===o)||Z[0]}function te(o=.75,r=.8){let a=Math.max(0,Math.min(1,o)),i=Math.max(0,Math.min(1,r));return{"--dsw-alias-bg-base":{light:`rgba(248, 250, 253, ${i})`,dark:`rgba(8, 12, 20, ${i})`},"--dsw-alias-bg-layer-1":{light:`rgba(255, 255, 255, ${a})`,dark:`rgba(24, 30, 42, ${a})`},"--dsw-alias-bg-layer-2":{light:`rgba(255, 255, 255, ${Math.max(0,a-.08)})`,dark:`rgba(30, 38, 52, ${Math.max(0,a-.08)})`},"--dsw-alias-bg-overlay":{light:"#ffffff",dark:"#0d1117"},"--dsw-alias-border-l1":{light:"rgba(120, 130, 150, 0.35)",dark:"rgba(120, 130, 150, 0.35)"},"--dsw-alias-border-l2":{light:"rgba(140, 150, 170, 0.45)",dark:"rgba(140, 150, 170, 0.45)"},"--dsw-specific-sidebar-fill":{light:"#eef1f7",dark:"#10141d"}}}var se=[],Ne=`${ee}/import-images/default.png`,re=`${ee}/import-videos/default.mp4`,B=re,Y={image:[Ne],video:[re]};var ie=`

precision highp float;

uniform vec2  uR;
uniform float uT, uS, uSc, uBl;

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// CONSTANTS \u2014 every magic number lives here, grouped by domain
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

// \u2500\u2500 Math \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

// \u2500\u2500 Render budget \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const int SEA_TRACE_STEPS  = 8;    // bisection iterations for surface find
const int SEA_OCTAVES_GEO  = 3;    // octaves used during ray marching
const int SEA_OCTAVES_FRAG = 5;    // octaves used for normal computation

// \u2500\u2500 Hash / noise \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const vec2  HASH_DOT   = vec2(127.1, 311.7);
const float HASH_SCALE = 43758.5453123;

// \u2500\u2500 Sea octave \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const mat2  SEA_OCT_M        = mat2(1.6, 1.2, -1.2, 1.6); // octave rotation
const float SEA_OCT_POWER    = 0.65;  // crest sharpness (1 = sharper)
const float SEA_UV_X_SCALE   = 0.75;  // horizontal stretch ratio
const float SEA_FREQ_BASE    = 0.16;  // initial spatial frequency
const float SEA_FREQ_MUL     = 1.9;   // frequency increase per octave
const float SEA_AMP_MUL      = 0.22;  // amplitude falloff per octave
const float SEA_CHOPPY_BLEND = 0.20;  // choppy \u2192 1.0 blend rate per octave
const float SEA_TRACE_FAR    = 1000.0;// maximum ray distance

// \u2500\u2500 Scene transitions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float STORM_FADE_LO = 0.500;  // scroll progress where storm begins
const float STORM_FADE_HI = 0.667;
const float NIGHT_FADE_LO = 0.667;  // scroll progress where night begins
const float NIGHT_FADE_HI = 0.833;

// \u2500\u2500 Camera \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float CAM_HEIGHT_START = 5.2;  // eye height at dawn
const float CAM_HEIGHT_END   = 4.4;  // eye height at storm
const float CAM_DRIFT_SPEED  = 0.5;  // forward drift units/sec
const float CAM_PITCH        = 0.20; // look-down angle
const float CAM_FOCAL        = -1.8; // z component of initial ray direction
const float CAM_BARREL       = 0.10; // lens barrel distortion coefficient

// \u2500\u2500 Sky gradient \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float SKY_GRAD_EXP = 0.42;    // power applied to vertical gradient

// \u2500\u2500 Clouds \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 Sun \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 Moon \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 Stars in sky \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float STAR_HOR_LO     = 0.02;    // horizon fade start
const float STAR_HOR_HI     = 0.28;    // horizon fade end
const float STAR_STORM_SUPP = 0.88;    // storm suppression of stars
const float STAR_NIGHT_SCL  = 2.80;    // overall star brightness scale
const float NIGHT_STARS_THRESHOLD = 0.02;

// \u2500\u2500 Horizon mist \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float HZ_MIST_CLEAR   = 38.0;  // falloff in clear weather
const float HZ_MIST_STORM   = 22.0;  // falloff in storm (wider mist)
const float HZ_MIST_SCL     = 0.09;  // base mist brightness
const float HZ_MIST_STORM_ADD = 0.10;

// \u2500\u2500 Storm sky tint \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const vec3  STORM_SKY_TINT     = vec3(0.91, 0.94, 0.98);
const float STORM_SKY_TINT_AMT = 0.22;

// \u2500\u2500 Lightning \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 Sea surface rendering \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float SEA_HORIZON_BLEND  = -0.05; // horizon softness (sea side)
const float SEA_HORIZON_EXP    = 0.30;  // horizon blend power
const float SEA_MIX_THRESHOLD  = 0.001; // skip sea below this blend value
const float SEA_NORMAL_EPS_K   = 0.10;  // adaptive normal eps: dist\xB2 \xD7 K / width
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
const float SSS_ATTEN_K   = 0.001; // attenuation per dist\xB2
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

// \u2500\u2500 Post-processing \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const float HOR_EDGE_LO    = -0.008; // horizon softening band start
const float HOR_EDGE_HI    = 0.018;  // horizon softening band end
const float HOR_BLEND      = 0.25;   // fog-into-horizon blend fraction
const float GRAIN_UV_SCL   = 0.5;    // noise coord scale for grain
const float GRAIN_TIME_SCL = 12.0;   // grain animation rate
const float GRAIN_STR      = 0.003;  // grain magnitude
const float GAMMA          = 0.78;   // photographic tone gamma

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// SCENE PALETTES  (6 stops: predawn / dawn / midday / dusk / storm / night)
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// PRE-DAWN: blue-lavender sky, warm rose-pink horizon glow (palette ref: image 1)
const vec3 SKY_TOP_PREDAWN  = vec3(0.38, 0.40, 0.64);  // soft periwinkle-blue
const vec3 SKY_TOP_DAWN     = vec3(0.42, 0.60, 0.90);  // pale blue \u2014 orange stays near horizon
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

// \u2500\u2500 Sea scalars per scene \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// UTILITY
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

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

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// SEA
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

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

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// MAIN
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

void main() {
  vec2  uv = (gl_FragCoord.xy - uR * 0.5) / uR.y;
  float s  = smoother(uS);

  float storm = smoothstep(STORM_FADE_LO, STORM_FADE_HI, s);
  float night = smoothstep(NIGHT_FADE_LO, NIGHT_FADE_HI, s);

  // \u2500\u2500 Scene-driven sea parameters \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  float seaH  = sF(SEA_H_DAWN, SEA_H_DAY, SEA_H_DUSK, SEA_H_STORM, SEA_H_NIGHT, SEA_H_PREDAWN)
               + storm * SEA_H_STORM_EXTRA;
  float seaCh = sF(SEA_CH_DAWN, SEA_CH_DAY, SEA_CH_DUSK, SEA_CH_STORM, SEA_CH_NIGHT, SEA_CH_PREDAWN);
  float seaT  = uT * sF(SEA_SPD_DAWN, SEA_SPD_DAY, SEA_SPD_DUSK, SEA_SPD_STORM, SEA_SPD_NIGHT, SEA_SPD_PREDAWN);

  // \u2500\u2500 Lightning \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  // \u2500\u2500 Scene palette \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  vec3 skyTop   = sCol(SKY_TOP_DAWN,   SKY_TOP_DAY,   SKY_TOP_DUSK,   SKY_TOP_STORM,   SKY_TOP_NIGHT,   SKY_TOP_PREDAWN);
  vec3 skyHori  = sCol(SKY_HOR_DAWN,   SKY_HOR_DAY,   SKY_HOR_DUSK,   SKY_HOR_STORM,   SKY_HOR_NIGHT,   SKY_HOR_PREDAWN);
  vec3 sunCol   = sCol(SUN_COL_DAWN,   SUN_COL_DAY,   SUN_COL_DUSK,   SUN_COL_STORM,   SUN_COL_NIGHT,   SUN_COL_PREDAWN);
  vec3 seaBase  = sCol(SEA_BASE_DAWN,  SEA_BASE_DAY,  SEA_BASE_DUSK,  SEA_BASE_STORM,  SEA_BASE_NIGHT,  SEA_BASE_PREDAWN);
  vec3 seaWater = sCol(SEA_WATER_DAWN, SEA_WATER_DAY, SEA_WATER_DUSK, SEA_WATER_STORM, SEA_WATER_NIGHT, SEA_WATER_PREDAWN);
  vec3 fogCol   = sCol(FOG_COL_DAWN,   FOG_COL_DAY,   FOG_COL_DUSK,   FOG_COL_STORM,   FOG_COL_NIGHT,   FOG_COL_PREDAWN);
  float fogDen  = sF(FOG_DEN_DAWN, FOG_DEN_DAY, FOG_DEN_DUSK, FOG_DEN_STORM, FOG_DEN_NIGHT, FOG_DEN_PREDAWN);

  // \u2500\u2500 Delayed warm-up for midday\u2192dusk (uSc==1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Water, sun color and fog all stay cool until the final quarter of the blend
  if (int(uSc) == 1) {
    float t  = uBl;
    float d5 = t * t * t * t * t;   // x^5 \u2014 very late onset
    sunCol   = mix(SUN_COL_DAY,      SUN_COL_DUSK,   d5);
    seaWater = mix(SEA_WATER_DAY,    SEA_WATER_DUSK, d5);
    seaBase  = mix(SEA_BASE_DAY,     SEA_BASE_DUSK,  d5);
    fogCol   = mix(FOG_COL_DAY,      FOG_COL_DUSK,   d5);
    fogDen   = mix(FOG_DEN_DAY,      FOG_DEN_DUSK,   d5);
  }

  // \u2500\u2500 Sun / moon direction & intensity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  float sunProgress = clamp(s / SUN_ARC_END, 0.0, 1.0);
  float sunAngle    = sunProgress * PI;
  vec3  sunDir  = normalize(vec3(cos(sunAngle) * SUN_ARC_X,
                                  sin(sunAngle) * SUN_ARC_Y_SCALE + SUN_ARC_Y_OFFSET,
                                  -1.0));
  vec3  moonDir = normalize(MOON_DIR_RAW);
  float moonAmt = sF(MOON_AMT_DAWN, MOON_AMT_DAY, MOON_AMT_DUSK, MOON_AMT_STORM, MOON_AMT_NIGHT, MOON_AMT_PREDAWN);
  float sunAbove = step(0.0, sunDir.y);
  float sunGlow  = smoothstep(SUN_GLOW_LO, SUN_GLOW_HI, sunDir.y);

  // \u2500\u2500 Camera \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  vec3 ori = vec3(0.0, mix(CAM_HEIGHT_START, CAM_HEIGHT_END, s), uT * CAM_DRIFT_SPEED);
  vec3 rd  = normalize(vec3(uv.x, uv.y - CAM_PITCH, CAM_FOCAL));
  rd.z    += length(uv) * CAM_BARREL;
  rd       = normalize(rd);

  // \u2500\u2500 Sky \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  vec3 skyCol;
  {
    float elev = clamp(rd.y, 0.0, 1.0);

    // Delay orange bleed during midday\u2192dusk (uSc==1):
    // quintic ease on both top and horizon \u2014 stays blue until ~final quarter
    vec3 skyTopFinal  = skyTop;
    vec3 skyHoriFinal = skyHori;
    if (int(uSc) == 1) {
      float t = uBl;
      float db = t * t * t * t * t;  // x^5 \u2014 very delayed warmth
      skyTopFinal  = mix(SKY_TOP_DAY,     SKY_TOP_DUSK,   db);
      skyHoriFinal = mix(SKY_HOR_DAY,     SKY_HOR_DUSK,   db * db);  // even later on horizon
    }
    // Also delay dawn\u2192midday top from bluing out too fast
    if (int(uSc) == 0) {
      float db = uBl * uBl;
      skyTopFinal  = mix(SKY_TOP_DAWN,    SKY_TOP_DAY,    db);
      skyHoriFinal = mix(SKY_HOR_DAWN,    SKY_HOR_DAY,    uBl);
    }

    // Per-scene gradient exponent: dusk gets a steeper curve so purple dominates
    // overhead and orange is tightly bound near the horizon
    float gradExp = SKY_GRAD_EXP;
    if (int(uSc) == 2) gradExp = 0.22;  // pure dusk: very steep \u2014 purple overhead, orange strip low
    if (int(uSc) == 1) {
      // midday\u2192dusk: ease the exponent from normal to steep
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

    // Stars \u2014 visible in night (fading in) and predawn (last scene, fading in)
    float predawnStars = smoothstep(0.833, 0.916, s);
    float starVis = max(night, predawnStars);
    if (starVis > NIGHT_STARS_THRESHOLD) {
      float starAngle = uT * 0.008;
      float cT = cos(starAngle), sT = sin(starAngle);
      vec3 srd = vec3(mat2(cT,-sT,sT,cT) * rd.xy, rd.z);

      float sn  = hash(srd.xy * 300.0 + vec2(srd.z * 300.0));
      // Tiered magnitudes \u2014 bright/medium/faint \u2014 creates depth and density
      float sBright = pow(clamp(sn - 0.9994, 0.0, 1.0) * 1667.0, 1.6);
      float sMedium = pow(clamp(sn - 0.998,  0.0, 1.0) *  500.0, 2.0) * 0.30;
      float sFaint  = pow(clamp(sn - 0.993,  0.0, 1.0) *  143.0, 2.0) * 0.07;
      float stars = sBright + sMedium + sFaint;
      // Smooth per-star atmospheric scintillation \u2014 each star has its own rate
      float scintSpeed = 0.30 + sn * 0.60;
      stars *= 0.92 + 0.08 * sin(uT * scintSpeed + sn * 19.7);

      float starMask = smoothstep(STAR_HOR_LO, STAR_HOR_HI, rd.y)
                     * (1.0 - storm * STAR_STORM_SUPP);
      skyCol += vec3(stars) * starMask * starVis * STAR_NIGHT_SCL;
    }

    // Lightning sheet glow \u2014 diffuse brightening of the cloud layer
    skyCol += LT_COL_SHEET * ltFlash * LT_SHEET_BRIGHT;

    // Lightning bolts \u2014 multi-bolt with organic branching
    if (ltFlash > 0.003 && rd.y > LT_BOLT_ELEV_MIN && rd.y < LT_BOLT_ELEV_MAX) {
      float screenX = rd.x / max(0.05, -rd.z);
      // elevN=1 at top of sky, elevN=0 at horizon \u2014 bolts travel 1\u21920
      float elevN   = (rd.y - LT_BOLT_ELEV_MIN) / (LT_BOLT_ELEV_MAX - LT_BOLT_ELEV_MIN);

      float boltGlow = 0.0;
      // Fade bolt out as it approaches the horizon \u2014 no hard cutoff
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

          // Branch: 25% chance, continuous position interpolated \u2014 no hard segment cuts
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

  // \u2500\u2500 Sea \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  // \u2500\u2500 Post-processing \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  col  = mix(fogCol, col, smoothstep(HOR_EDGE_LO, HOR_EDGE_HI, rd.y) * HOR_BLEND
           + (1.0 - HOR_BLEND));
  col += (hash(gl_FragCoord.xy * GRAIN_UV_SCL + floor(uT * GRAIN_TIME_SCL)) - 0.5)
       * GRAIN_STR;
  gl_FragColor = vec4(clamp(pow(col, vec3(GAMMA)), 0.0, 1.0), 1.0);
}

`;var I="dsh-theme",ye="dsh-theme",Ce=["settingsScope","slots","locale","theme"],J=`
.dt-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
/* \u63D0\u5347\u4E3A GPU \u5408\u6210\u5C42\uFF1A\u89C6\u9891/\u56FE\u7247\u4E0A\u5C4F\u8D70 GPU \u5408\u6210\uFF0C\u8F6F\u89E3\u65F6\u5E27\u4E0D\u963B\u585E\u4E3B\u7EBF\u7A0B\uFF08\u914D\u5408\u6D4F\u89C8\u5668\u786C\u4EF6\u52A0\u901F\u89E3\u7801\uFF09 */
.dt-bg-media, .dt-bg-gradient { position: absolute; inset: 0; will-change: transform; transform: translateZ(0); }
.dt-bg-gradient { background-size: cover; background-position: center; }
.dt-bg-media img, .dt-bg-media video { width: 100%; height: 100%; object-fit: cover; backface-visibility: hidden; }
.dt-bg-media.fit-contain img { object-fit: contain; }
.dt-bg-mask { position: absolute; inset: 0; pointer-events: none; }
.dt-fade { animation: dt-fade-in 0.45s ease-out; }
@keyframes dt-fade-in { from { opacity: 0; } to { opacity: 1; } }

.dt-panel { display: flex; flex-direction: column; gap: 18px; }
/* \u8BBE\u7F6E\u754C\u9762\uFF1A\u5373\u4F7F\u80CC\u666F\u76AE\u80A4\u900F\u51FA\uFF0C\u8BBE\u7F6E\u9762\u677F\u672C\u8EAB\u4FDD\u6301\u4E0D\u900F\u660E\uFF0C\u907F\u514D\u900F\u5E95\u770B\u4E0D\u6E05 */
.dt-settings { background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; padding: 18px 20px; box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
.dt-label { font-weight: 600; font-size: 13px; color: var(--dsw-alias-label-primary); }
.dt-hint { font-size: 12px; opacity: 0.65; color: var(--dsw-alias-label-secondary); }
.dt-seq { display: inline-flex; gap: 4px; padding: 3px; border-radius: 999px; background: var(--dsw-alias-bg-base); }
.dt-seq button { border: none; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; padding: 6px 14px; border-radius: 999px; cursor: pointer; }
.dt-seq button.active { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
.dt-cardgrid { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: thin; }
.dt-cardgrid > .dt-themecard { flex: 0 0 auto; min-width: 150px; }
.dt-themecard { border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; text-align: left; color: var(--dsw-alias-label-primary); }
.dt-themecard.active { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary); }
.dt-themecard .swatch { height: 60px; border-radius: 8px; }
.dt-themecard .name { font-size: 12.5px; font-weight: 600; }
.dt-themecard .sub { font-size: 10.5px; opacity: 0.6; }
.dt-clickable { cursor: pointer; }
.dt-clickable:hover { border-color: var(--dsw-alias-brand-primary); }
.dt-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dt-btn { border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.dt-btn:hover { background: var(--dsw-alias-bg-layer-1); }
.dt-btn.primary { background: var(--dsw-alias-button-info-fill, var(--dsw-alias-brand-primary)); color: #fff; border-color: transparent; font-weight: 600; }
.dt-btn.primary:hover { background: var(--dsw-alias-button-info-hover, var(--dsw-alias-brand-primary)); }
.dt-btn.danger { border-color: var(--dsw-alias-state-error-primary); color: var(--dsw-alias-state-error-primary); }
.dt-slider { width: 100%; accent-color: var(--dsw-alias-button-info-fill, var(--dsw-alias-brand-primary)); }
.dt-overlay { position: fixed; inset: 0; z-index: 200050; background: rgba(0,0,0,0.42); display: flex; align-items: center; justify-content: center; padding: 16px; }
.dt-modal { background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); border: 1px solid var(--dsw-alias-border-l1); border-radius: 18px; box-shadow: 0 34px 90px rgba(0,0,0,0.5); overflow: hidden; animation: dt-fade-in 0.22s cubic-bezier(0.2,0.8,0.2,1); max-width: 760px; width: 100%; max-height: 88vh; display: flex; flex-direction: column; }
.dt-modal-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dt-modal-head .title { font-weight: 700; font-size: 15px; }
.dt-modal-close { border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: inherit; border-radius: 8px; width: 30px; height: 30px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.dt-modal-body { padding: 18px 20px; overflow-y: auto; }
.dt-toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 300100; background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 9px 16px; font-size: 13px; font-weight: 600; box-shadow: 0 12px 32px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 8px; animation: dt-fade-in 0.2s ease-out; max-width: 82vw; }
.dt-toast .ok { color: var(--dsw-alias-state-success-primary); }
.dt-toast .err { color: var(--dsw-alias-state-error-primary); }
.dt-preview { height: 120px; border-radius: 12px; border: 1px solid var(--dsw-alias-border-l1); overflow: hidden; position: relative; background: var(--dsw-alias-bg-base); }
.dt-preview .pbg { position: absolute; inset: 0; }
.dt-preview .pmask { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }

/* sidebar footer button\uFF08\u7167\u642C dsh-memory-eternal \u6837\u5F0F\uFF09 */
/* .dt-footer:not(.rail) \u5728 footer action \u6A2A\u5411\u5BB9\u5668\u91CC\u5360\u6EE1\u6574\u884C\uFF0C\u907F\u514D\u4E0E\u300C\u8BB0\u5FC6\u300D\u6324\u5728\u4E00\u884C */
.dt-footer { width: 100%; }
.dt-footer:not(.rail) { flex: 0 0 100%; }
.dt-footer-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 7px 10px; border: none; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 13.5px; line-height: 18px; border-radius: 8px; cursor: pointer; text-align: left; }
.dt-footer-btn:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
.dt-footer-btn:active { transform: translateY(0.5px); }
.dt-footer-ico { display: inline-flex; flex: none; width: 18px; height: 18px; align-items: center; justify-content: center; }
.dt-footer-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.dt-footer.rail .dt-footer-btn { justify-content: center; padding: 7px 0; }
.dt-footer.rail .dt-footer-label { display: none; }
`,we={nav:"\u4E3B\u9898",loading:"\u52A0\u8F7D\u4E2D\u2026",modeBuiltin:"\u5185\u7F6E\u4E3B\u9898",modeImage:"\u56FE\u7247\u76AE\u80A4",modeVideo:"\u89C6\u9891\u76AE\u80A4",sectionDesc:"\u7ED9 DSH Web GUI \u6362\u80CC\u666F\uFF1A\u5185\u7F6E\u4E3B\u9898 / \u56FE\u7247\u76AE\u80A4 / \u89C6\u9891\u76AE\u80A4\uFF08\u73AF\u7ED5\u8DDF\u968F\u6216\u5FAA\u73AF\u64AD\u653E\uFF09/ \u6D77\u666F\u76AE\u80A4\uFF08WebGL \u5B9E\u65F6\u6E32\u67D3\uFF09\u3002",modeOcean:"\u6D77\u666F",oceanHint:"WebGL \u5B9E\u65F6\u6E32\u67D3\u7684\u6D77\u9762\uFF0C\u968F\u65F6\u95F4\u6F14\u7ECE 6 \u4E2A\u573A\u666F\uFF08\u7834\u6653/\u6668\u5149/\u6B63\u5348/\u9EC4\u660F/\u98CE\u66B4/\u591C\u665A\uFF09\u3002",oceanSpeedLabel:"\u573A\u666F\u5FAA\u73AF\u901F\u5EA6",oceanSpeedHint:"\u63A7\u5236 6 \u573A\u666F\u5207\u6362\u7684\u5FEB\u6162\uFF080.5 = \u6162, 1 = \u6B63\u5E38, 3 = \u5FEB\uFF09\u3002",oceanClickHint:"\u70B9\u51FB\u6D77\u9762\u89E6\u53D1\u8F7B\u5FAE\u52A0\u4EAE\u8109\u51B2\u3002",colorHint:"\u5E94\u7528\u914D\u8272\u4E3B\u9898\uFF08\u660E\u6697\u539F\u751F\u9002\u914D\uFF0C\u6362\u8272\u4E0D\u6362\u5E03\u5C40\uFF09",backdropHint:"\u5185\u7F6E\u80CC\u666F\u76AE\u80A4",noImage:"\u5C1A\u672A\u5BFC\u5165\u56FE\u7247\uFF0C\u70B9\u51FB\u4E0B\u65B9\u5BFC\u5165\u3002",importImage:"\u5BFC\u5165\u56FE\u7247",importVideo:"\u5BFC\u5165\u89C6\u9891",importHint:"\u5BFC\u5165\u540E\u5199\u5165\u63D2\u4EF6 assets/\uFF0C\u91CD\u542F\u4E0D\u4E22\u3002",videoMode:"\u89C6\u9891\u6A21\u5F0F",modeFollow:"\u8DDF\u968F\u9F20\u6807",modeFollowHint:"\u9F20\u6807\u5DE6\u53F3\u79FB\u52A8 \u2192 \u89C6\u9891\u73AF\u7ED5\u65CB\u8F6C\u5E27\uFF08\u5E73\u6ED1 lerp\uFF0C\u8DE8\u8FB9\u754C\u4E0D\u8DF3\u53D8\uFF09\u3002",modeLoop:"\u5FAA\u73AF\u64AD\u653E",modeLoopHint:"\u89C6\u9891\u81EA\u52A8\u5FAA\u73AF\u64AD\u653E\uFF0C\u4F5C\u4E3A\u80CC\u666F\u3002",mask:"\u8499\u5C42",maskHint:"\u80CC\u666F\u538B\u6697\uFF08\u4EC5\u5F71\u54CD\u80CC\u666F\u4E0D\u5F71\u54CD\u6587\u5B57\uFF09\uFF1B\u62D6\u52A8\u4EC5\u9884\u89C8\uFF0C\u70B9\u300C\u542F\u7528\u300D\u540E\u5E94\u7528\u3002",delete:"\u5220\u9664",fit:"\u94FA\u6EE1\u65B9\u5F0F",fitCover:"\u94FA\u6EE1 cover",fitContain:"\u5B8C\u6574 contain",dimLabel:"\u80CC\u666F\u538B\u6697",themeAlphaLabel:"\u4E3B\u9898\u9762\u677F\u900F\u660E",themeAlphaHint:"0 = \u9762\u677F\u5168\u900F\uFF08\u80CC\u666F\u5168\u900F\uFF09\uFF0C1 = \u9762\u677F\u5B9E\u5E95\uFF1B\u6C14\u6CE1/\u5361\u7247\u968F\u4E4B\u8C03\u8282\u3002\u62D6\u52A8\u4EC5\u9884\u89C8\uFF0C\u70B9\u300C\u542F\u7528\u300D\u540E\u5E94\u7528\u3002",dialogAlphaLabel:"\u5BF9\u8BDD\u680F\u900F\u660E",dialogAlphaHint:"0 = \u5BF9\u8BDD\u680F\u5168\u900F\uFF08\u80CC\u666F\u900F\u51FA\uFF09\uFF0C1 = \u5BF9\u8BDD\u680F\u5B9E\u5E95\uFF1B\u8BBE\u7F6E/\u4FA7\u680F\u4E0D\u53D7\u5F71\u54CD\uFF08\u72EC\u7ACB\u5B9E\u5E95\uFF09\u3002\u62D6\u52A8\u4EC5\u9884\u89C8\uFF0C\u70B9\u300C\u542F\u7528\u300D\u540E\u5E94\u7528\u3002",preview:"\u9884\u89C8",reset:"\u6062\u590D\u9ED8\u8BA4",apply:"\u542F\u7528",close:"\u5173\u95ED",footerTitle:"\u{1F3A8} \u4E3B\u9898"},De={nav:"Theme",loading:"Loading\u2026",modeBuiltin:"Built-in",modeImage:"Image",modeVideo:"Video",sectionDesc:"Change the DSH web GUI background: built-in themes / image / video (orbit-follow or loop) / ocean (WebGL real-time).",modeOcean:"Ocean",oceanHint:"WebGL real-time ocean, cycling through 6 scenes (predawn/dawn/midday/dusk/storm/night).",oceanSpeedLabel:"Scene cycle speed",oceanSpeedHint:"Controls the 6-scene cycle rate (0.5 = slow, 1 = normal, 3 = fast).",oceanClickHint:"Click the ocean to trigger a subtle brighten pulse.",colorHint:"App color themes (native light/dark; recolors, not relayouts)",backdropHint:"Built-in backdrop skins",noImage:"No image imported yet \u2014 import one below.",importImage:"Import image",importVideo:"Import video",importHint:"Stored into the plugin assets/, persists across restarts.",videoMode:"Video mode",modeFollow:"Mouse-follow",modeFollowHint:"Move the mouse left/right to orbit the video frames (smooth lerp, no jumps).",modeLoop:"Loop",modeLoopHint:"Autoplay looping video as the background.",mask:"Mask",maskHint:'Dims the backdrop (only affects the background, not text); drag to preview only, applied on "Apply".',delete:"Delete",fit:"Fit",fitCover:"Cover",fitContain:"Contain",dimLabel:"Dim",themeAlphaLabel:"Theme panels opacity",themeAlphaHint:'0 = panels fully transparent (background shows), 1 = solid; bubbles/cards follow. Drag to preview only; applied on "Apply".',dialogAlphaLabel:"Dialog opacity",dialogAlphaHint:'0 = conversation fully transparent, 1 = solid; settings/sidebar stay solid (independent). Drag to preview only; applied on "Apply".',preview:"Preview",reset:"Reset defaults",apply:"Apply",close:"Close",footerTitle:"\u{1F3A8} Theme"};function fe(o){let r=(0,e.useCallback)(i=>o&&typeof o.subscribe=="function"?o.subscribe(i):()=>{},[o]),a=(0,e.useCallback)(()=>o&&typeof o.getSnapshot=="function"?o.getSnapshot():null,[o]);return(0,e.useSyncExternalStore)(r,a)}function le(o){return o-Math.floor(o)}function me(o,r){return o==="image"||o==="video"?!0:o==="builtin"?r&&r.kind==="backdrop":!1}function ce(o,r){let a=(o==="video"?Y.video:Y.image)||[];return typeof r=="string"&&!!r&&a.indexOf(r)>=0}function xe(o,r){return o==null?"":(o=String(o),o.length<=r?o:o.slice(0,r-1)+"\u2026")}function Q(o){if(!o)return"";let r=String(o).split("/").pop()||"",a=r.replace(/\.[^.]+$/,"")||r;return xe(a,15)}function Re({src:o,active:r}){let a=(0,e.useRef)(null);return(0,e.useEffect)(()=>{let i=a.current;if(!i)return;let s=!1;try{s=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch{s=!1}if(s||!r)return;let f=-3*Math.PI/4,m=.02,u=m,l=0,T=0,A=performance.now(),E=600,y=60,_=.03,C=.3,S=()=>Number.isFinite(i.duration)&&i.duration>0?i.duration:5,c=0,n=!1,g=b=>{if(!Number.isFinite(b)||document.hidden||i.readyState<2)return;let R=performance.now();if(i.seeking){c=b,n=!0;return}if(R-T<y)return;let k=b*S();Math.abs(k-i.currentTime)>_&&(i.currentTime=k,T=R)},h=()=>{n&&(n=!1,g(c))},w=()=>{let b=u-m;b-=Math.round(b);let R=Math.abs(b)<.003;m=le(m+b*C),g(m),!document.hidden&&!(R&&performance.now()-A>E)?l=requestAnimationFrame(w):l=0},D=()=>{l||(l=requestAnimationFrame(w))},x=b=>{A=performance.now();let R=window.innerWidth/2,k=window.innerHeight/2,P=Math.atan2(b.clientY-k,b.clientX-R);u=le((P-f)/(2*Math.PI)),document.hidden||D()},F=()=>{g(m),i.readyState>=2&&i.play().then(()=>i.pause()).catch(()=>{}),D()};return window.addEventListener("mousemove",x,{passive:!0}),i.addEventListener("loadedmetadata",F,{once:!0}),i.addEventListener("seeked",h),i.readyState>=1&&F(),D(),()=>{window.removeEventListener("mousemove",x),i.removeEventListener("loadedmetadata",F),i.removeEventListener("seeked",h),l&&cancelAnimationFrame(l)}},[o,r]),e.default.createElement("video",{ref:a,src:o,muted:!0,playsInline:!0,preload:"auto",disablePictureInPicture:!0,style:{width:"100%",height:"100%",objectFit:"cover"}})}function _e({src:o}){return e.default.createElement("video",{src:o,muted:!0,autoPlay:!0,loop:!0,playsInline:!0,preload:"auto",disablePictureInPicture:!0,style:{width:"100%",height:"100%",objectFit:"cover"}})}function ke({src:o,mode:r,active:a}){return r==="loop"?e.default.createElement(_e,{src:o}):e.default.createElement(Re,{src:o,active:a})}function He({interact:o,speed:r}){let a=(0,e.useRef)(null),[i,s]=(0,e.useState)(null),f=(0,e.useRef)(typeof r=="number"&&r>0?r:1);return(0,e.useEffect)(()=>{f.current=typeof r=="number"&&r>0?r:1},[r]),(0,e.useEffect)(()=>{if(!a.current)return;let m=a.current,u=0,l=null,T=null,A=null,E=null,y={v:0},_={v:0},C=performance.now()/1e3,S=!1,c=document.createElement("canvas"),n=c.getContext("webgl2");if(!n){s("\u5F53\u524D WebView \u4E0D\u652F\u6301 WebGL2");return}let g,h;try{if(g=n.createShader(n.VERTEX_SHADER),n.shaderSource(g,"void main(){ gl_Position = vec4(position, 1.0); }"),n.compileShader(g),!n.getShaderParameter(g,n.COMPILE_STATUS))throw new Error("VS: "+n.getShaderInfoLog(g));if(h=n.createShader(n.FRAGMENT_SHADER),n.shaderSource(h,ie),n.compileShader(h),!n.getShaderParameter(h,n.COMPILE_STATUS))throw new Error("FS: "+n.getShaderInfoLog(h));if(l=n.createProgram(),n.attachShader(l,g),n.attachShader(l,h),n.linkProgram(l),!n.getProgramParameter(l,n.LINK_STATUS))throw new Error("LINK: "+n.getProgramInfoLog(l))}catch(N){s("\u6D77\u666F shader \u7F16\u8BD1\u5931\u8D25\uFF1A"+(N&&N.message||String(N)));return}A=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,A),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),T=n.createVertexArray(),n.bindVertexArray(T);let w=n.getAttribLocation(l,"position");n.enableVertexAttribArray(w),n.vertexAttribPointer(w,2,n.FLOAT,!1,0,0);let D=n.getUniformLocation(l,"uR"),x=n.getUniformLocation(l,"uT"),F=n.getUniformLocation(l,"uS"),b=n.getUniformLocation(l,"uSc"),R=n.getUniformLocation(l,"uBl"),k=n.getUniformLocation(l,"uClickPulse"),P=()=>{let N=window.innerWidth,v=window.innerHeight;c.width=Math.max(1,N),c.height=Math.max(1,v),c.style.width=N+"px",c.style.height=v+"px",n.viewport(0,0,c.width,c.height)};c.style.position="absolute",c.style.inset="0",c.style.width="100%",c.style.height="100%",c.style.pointerEvents="auto",c.style.zIndex="0",c.setAttribute("aria-label","dsh-theme \u6D77\u666F\u80CC\u666F\u5C42\uFF08\u70B9\u51FB\u4E92\u52A8\uFF09"),c.setAttribute("role","img"),m.appendChild(c),E=c,P(),window.addEventListener("resize",P);let z=()=>{o!==!1&&(y.v=performance.now(),_.v=1)};E.addEventListener("click",z);let H=()=>{if(S)return;u=requestAnimationFrame(H);let v=performance.now()/1e3-C,O=60/f.current,U=v%O/O;if(n.useProgram(l),n.bindVertexArray(T),n.uniform2f(D,E.width,E.height),n.uniform1f(x,v),n.uniform1f(F,U),n.uniform1f(b,Math.min(5,Math.floor(U*6))),n.uniform1f(R,U*6-Math.floor(U*6)),_.v>0){let X=(performance.now()-y.v)/600;_.v=X>=1?0:1-X}n.uniform1f(k,_.v),n.drawArrays(n.TRIANGLES,0,3)};return u=requestAnimationFrame(H),()=>{S=!0,cancelAnimationFrame(u),window.removeEventListener("resize",P),E.removeEventListener("click",z),l&&n.deleteProgram(l),A&&n.deleteBuffer(A),T&&n.deleteVertexArray(T);try{E.remove()}catch{}}},[o]),i?e.default.createElement("div",{style:{position:"absolute",inset:0,zIndex:1,background:"var(--dsw-alias-bg-base, #14181d)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--dsw-alias-label-secondary, #9aa4b2)",fontSize:12,padding:16,textAlign:"center",pointerEvents:"none",whiteSpace:"pre-line"}},`\u26A0 \u6D77\u666F\u4E0D\u53EF\u7528
`+i):e.default.createElement("div",{ref:a,style:{position:"absolute",inset:0,pointerEvents:"auto",zIndex:0}})}function Me({scope:o,themeService:r,t:a}){let i=fe(o),s=i&&i.value&&typeof i.value=="object"?i.value:null,f=s&&s.imageSrc||"",m=s&&s.imageFit?s.imageFit:"cover",u=s&&s.videoMode?s.videoMode:"follow",l=s&&s.videoSrc||B,T=s&&typeof s.oceanSpeed=="number"?Math.min(3,Math.max(.5,s.oceanSpeed)):1,A=s&&typeof s.dim=="number"?Math.min(.7,Math.max(0,s.dim)):0,E=s&&typeof s.themeAlpha=="number"?Math.min(1,Math.max(0,s.themeAlpha)):.75,y=s&&typeof s.dialogAlpha=="number"?Math.min(1,Math.max(0,s.dialogAlpha)):.8,_=W(builtinId),C=me(mode,_);if((0,e.useEffect)(()=>{if(!r||typeof r.overrideTokens!="function")return;let g=enabled?C?te(E,y):mode==="builtin"?_.tokens||{}:te(E,y):null;return g?r.overrideTokens(ye,g):void 0},[r,enabled,mode,builtinId,C,E,y]),!enabled)return null;let S=e.default.useMemo(()=>mode==="builtin"&&_.kind==="color"?e.default.createElement("div",{className:"dt-bg-gradient",style:{background:_.bg}}):mode==="builtin"&&_.kind==="backdrop"?e.default.createElement("img",{src:G(_),alt:"","aria-hidden":!0}):mode==="image"?f?e.default.createElement("img",{src:f,alt:"","aria-hidden":!0,style:{objectFit:m}}):e.default.createElement("img",{src:G(W("aurora")),alt:"","aria-hidden":!0,style:{objectFit:m}}):mode==="video"?e.default.createElement(ke,{src:l,mode:u,active:u!=="loop"}):mode==="ocean"?e.default.createElement(He,{interact:!0,speed:T}):null,[mode,_,f,m,u,l,T]),c=C&&A>0?e.default.createElement("div",{className:"dt-bg-mask",style:{background:`rgba(0,0,0,${A})`}}):null,n=e.default.createElement("div",{className:"dt-bg-media"+(mode==="image"&&m==="contain"?" fit-contain":"")},S);return(0,de.createPortal)(e.default.createElement("div",{className:"dt-bg dt-fade"},e.default.createElement("style",null,J),n,c),document.body)}function pe({scope:o,themeService:r,t:a}){let i=fe(o),s=i&&i.value&&typeof i.value=="object"?i.value:null,[f,m]=(0,e.useState)(null),u=(0,e.useRef)(null),[l,T]=(0,e.useState)(!1),A=(0,e.useRef)(null),[E,y]=(0,e.useState)(null),[_,C]=(0,e.useState)({}),S=(t,d)=>Object.prototype.hasOwnProperty.call(_,t)?_[t]:d,c=(t,d)=>C(p=>({...p,[t]:d}));if((0,e.useEffect)(()=>{s&&!l&&T(!0)},[s,l]),(0,e.useEffect)(()=>()=>{u.current&&clearTimeout(u.current)},[]),!s||!l)return e.default.createElement("div",{style:{padding:16,opacity:.6}},a("loading"));let n=S("mode",s.mode||"builtin"),g=S("builtinId",s.builtinId||"aurora"),h=S("imageSrc",s.imageSrc||""),w=S("imageFit",s.imageFit||"cover"),D=S("videoMode",s.videoMode||"follow"),x=S("videoSrc",s.videoSrc||""),F=S("oceanSpeed",typeof s.oceanSpeed=="number"?Math.min(3,Math.max(.5,s.oceanSpeed)):1),b=s.importedImages&&Array.isArray(s.importedImages)?s.importedImages:[],R=s.importedVideos&&Array.isArray(s.importedVideos)?s.importedVideos:[],k=S("dim",typeof s.dim=="number"?Math.min(.7,Math.max(0,s.dim)):0),P=S("themeAlpha",typeof s.themeAlpha=="number"?Math.min(1,Math.max(0,s.themeAlpha)):1),z=S("dialogAlpha",typeof s.dialogAlpha=="number"?Math.min(1,Math.max(0,s.dialogAlpha)):0),H=W(g),N=me(n,H),v=(t,d=!0)=>{m({text:t,ok:d}),u.current&&clearTimeout(u.current),u.current=setTimeout(()=>m(null),2400)},O=(t,d,p)=>{c(t,d),v("\u5DF2\u9009\uFF1A"+p+"\uFF0C\u70B9\u300C\u542F\u7528\u300D\u751F\u6548")},U=()=>a(n==="builtin"?"modeBuiltin":n==="image"?"modeImage":"modeVideo"),X=n==="builtin"?" \xB7 "+H.name:n==="image"?" \xB7 "+(h?"\u81EA\u5B9A\u4E49":"\u672A\u5BFC\u5165"):" \xB7 "+a(D==="loop"?"modeLoop":"modeFollow"),V=t=>t==="video"?"importedVideos":"importedImages",K=t=>t==="video"?"videoSrc":"imageSrc",M=t=>t==="video"?Y.video[0]||B:Y.image[0]||G(W("aurora")),ue=(t,d)=>{if(!d)return;let p=new FileReader;p.onload=()=>{let j=String(p.result||"");fetch("/dsh-theme/api/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:t,name:d.name,data:j})}).then(L=>L.json()).then(L=>{if(L&&L.ok){let q=L.url;if(!ce(t,q)){let ae=s[V(t)]||[];ae.indexOf(q)<0&&o.set(V(t),ae.concat(q))}c(K(t),q),v(t==="video"?"\u89C6\u9891\u5DF2\u5BFC\u5165\uFF0C\u70B9\u300C\u542F\u7528\u300D\u5E94\u7528":"\u56FE\u7247\u5DF2\u5BFC\u5165\uFF0C\u70B9\u300C\u542F\u7528\u300D\u5E94\u7528")}else v("\u5BFC\u5165\u5931\u8D25\uFF1A"+(L&&L.error||"unknown"),!1)}).catch(L=>v("\u5BFC\u5165\u5931\u8D25\uFF1A"+String(L&&L.message?L.message:L),!1))},p.onerror=()=>v("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",!1),p.readAsDataURL(d)},oe=(t,d)=>{let p=d||s[K(t)];if(!p)return;if(ce(t,p)){v("\u8FD9\u662F\u9ED8\u8BA4\u76AE\u80A4\uFF0C\u4E0D\u53EF\u5220\u9664",!1);return}let j=t+"|"+p;if(E!==j){y(j),v("\u518D\u70B9\u4E00\u6B21\u300C\u786E\u8BA4\u5220\u9664\u300D");return}y(null),o.set(V(t),(s[V(t)]||[]).filter(L=>L!==p)),S(K(t),s[K(t)])===p&&c(K(t),M(t)),fetch("/dsh-theme/api/import",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:p})}).catch(()=>{}),v(t==="video"?"\u5DF2\u5220\u9664\u5BFC\u5165\u89C6\u9891\uFF0C\u56DE\u9000\u9ED8\u8BA4\uFF1B\u70B9\u300C\u542F\u7528\u300D\u5E94\u7528":"\u5DF2\u5220\u9664\u5BFC\u5165\u56FE\u7247\uFF0C\u56DE\u9000\u9ED8\u8BA4\u58C1\u7EB8\uFF1B\u70B9\u300C\u542F\u7528\u300D\u5E94\u7528")},Se=[["builtin",a("modeBuiltin")],["image",a("modeImage")],["video",a("modeVideo")],["ocean",a("modeOcean")]],Ee=n==="builtin"?H.kind==="backdrop"?{backgroundImage:`url(${G(H)})`}:{background:H.bg}:n==="image"?{backgroundImage:h?`url(${h})`:"none",backgroundSize:w==="contain"?"contain":"cover",backgroundPosition:"center"}:{background:"#000"};return e.default.createElement("div",{className:"dt-panel"},e.default.createElement("style",null,J),e.default.createElement("div",{className:"dt-label"},a("sectionDesc")),e.default.createElement("div",{className:"dt-seq"},Se.map(([t,d])=>e.default.createElement("button",{key:t,className:n===t?"active":"",onClick:()=>O("mode",t,d),"aria-pressed":n===t},d))),n==="builtin"?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},e.default.createElement("span",{className:"dt-hint"},a("colorHint")),e.default.createElement("div",{className:"dt-cardgrid"},Z.map(t=>{let d=t.kind==="backdrop"?{backgroundImage:`url(${G(t)})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:t.bg,backgroundSize:"cover",backgroundPosition:"center"},p=t.kind==="backdrop"?a("backdropHint"):t.dark?"\u6697\u8272":"\u4EAE\u8272";return e.default.createElement("button",{key:t.id,className:"dt-themecard"+(g===t.id?" active":""),onClick:()=>O("builtinId",t.id,t.name)},e.default.createElement("div",{className:"swatch",style:d}),e.default.createElement("div",{className:"name"},t.name),e.default.createElement("div",{className:"sub"},p))}))):null,n==="image"?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},e.default.createElement("div",{className:"dt-row"},e.default.createElement("span",{className:"dt-label"},a("fit")),e.default.createElement("div",{className:"dt-seq"},e.default.createElement("button",{className:w==="cover"?"active":"",onClick:()=>O("imageFit","cover",a("fitCover"))},a("fitCover")),e.default.createElement("button",{className:w==="contain"?"active":"",onClick:()=>O("imageFit","contain",a("fitContain"))},a("fitContain")))),e.default.createElement("div",{className:"dt-cardgrid"},e.default.createElement("button",{className:"dt-themecard"+(h===M("image")?" active":""),onClick:()=>O("imageSrc",M("image"),"\u9ED8\u8BA4\u58C1\u7EB8")},e.default.createElement("div",{className:"swatch",style:{backgroundImage:`url(${M("image")})`,backgroundSize:"cover",backgroundPosition:"center"}}),e.default.createElement("div",{className:"name"},"\u9ED8\u8BA4\u58C1\u7EB8\uFF08\u4E0D\u53EF\u5220\u9664\uFF09"),e.default.createElement("div",{className:"sub"},"\u53D7\u4FDD\u62A4")),b.map(t=>e.default.createElement("div",{key:t,role:"button",tabIndex:0,className:"dt-themecard dt-clickable"+(h===t?" active":""),onClick:()=>O("imageSrc",t,Q(t))},e.default.createElement("div",{className:"swatch",style:{backgroundImage:`url(${t})`,backgroundSize:w==="contain"?"contain":"cover",backgroundPosition:"center"}}),e.default.createElement("div",{className:"name"},Q(t)),e.default.createElement("button",{className:"dt-btn danger",onClick:d=>{d.stopPropagation(),oe("image",t)}},E==="image|"+t?"\u786E\u8BA4\u5220\u9664\uFF1F":a("delete"))))),b.length===0?e.default.createElement("span",{className:"dt-hint"},a("noImage")):null,e.default.createElement("div",{className:"dt-row"},e.default.createElement("span",{className:"dt-hint"},a("importHint")),e.default.createElement("button",{className:"dt-btn primary",onClick:()=>{let t=A.current;t&&t.click()}},a("importImage")))):null,n==="video"?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},e.default.createElement("div",{className:"dt-row"},e.default.createElement("span",{className:"dt-label"},a("videoMode")),e.default.createElement("div",{className:"dt-seq"},e.default.createElement("button",{className:D==="follow"?"active":"",onClick:()=>O("videoMode","follow",a("modeFollow"))},a("modeFollow")),e.default.createElement("button",{className:D==="loop"?"active":"",onClick:()=>O("videoMode","loop",a("modeLoop"))},a("modeLoop")))),e.default.createElement("span",{className:"dt-hint"},a(D==="loop"?"modeLoopHint":"modeFollowHint")),e.default.createElement("div",{className:"dt-cardgrid"},e.default.createElement("button",{className:"dt-themecard"+(x===M("video")?" active":""),onClick:()=>O("videoSrc",M("video"),"\u9ED8\u8BA4\u89C6\u9891")},e.default.createElement("div",{className:"swatch",style:{background:"repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)",display:"flex",alignItems:"center",justifyContent:"center",color:"#9aa4b2",fontSize:20}},"\u{1F3AC}"),e.default.createElement("div",{className:"name"},"\u9ED8\u8BA4\u89C6\u9891\uFF08\u4E0D\u53EF\u5220\u9664\uFF09"),e.default.createElement("div",{className:"sub"},"\u53D7\u4FDD\u62A4")),se.map(t=>e.default.createElement("button",{key:t.id,className:"dt-themecard"+(!x||x===B?" active":""),onClick:()=>O("videoSrc",B,t.name)},e.default.createElement("div",{className:"swatch",style:{background:"repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)",display:"flex",alignItems:"center",justifyContent:"center",color:"#9aa4b2",fontSize:20}},"\u{1F3AC}"),e.default.createElement("div",{className:"name"},t.name))),R.map(t=>e.default.createElement("div",{key:t,role:"button",tabIndex:0,className:"dt-themecard dt-clickable"+(x===t?" active":""),onClick:()=>O("videoSrc",t,Q(t))},e.default.createElement("div",{className:"swatch",style:{background:"#000",display:"flex",alignItems:"center",justifyContent:"center",color:"#9aa4b2",fontSize:20}},"\u{1F3AC}"),e.default.createElement("div",{className:"name"},Q(t)),e.default.createElement("button",{className:"dt-btn danger",onClick:d=>{d.stopPropagation(),oe("video",t)}},E==="video|"+t?"\u786E\u8BA4\u5220\u9664\uFF1F":a("delete"))))),e.default.createElement("div",{className:"dt-row"},e.default.createElement("span",{className:"dt-hint"},a("importHint")),e.default.createElement("button",{className:"dt-btn primary",onClick:()=>{let t=A.current;t&&t.click()}},a("importVideo")))):null,n==="ocean"?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},e.default.createElement("span",{className:"dt-hint"},a("oceanHint")),e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},e.default.createElement("span",{className:"dt-label"},a("oceanSpeedLabel")),e.default.createElement("input",{className:"dt-slider",type:"range",min:.5,max:3,step:.1,value:F,onChange:t=>c("oceanSpeed",parseFloat(t.target.value))}),e.default.createElement("span",{className:"dt-hint"},a("oceanSpeedHint"))),e.default.createElement("span",{className:"dt-hint"},a("oceanClickHint"))):null,N?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6,borderTop:"1px solid var(--dsw-alias-border-l1)",paddingTop:14}},e.default.createElement("span",{className:"dt-label"},a("dimLabel")),e.default.createElement("input",{className:"dt-slider",type:"range",min:0,max:.7,step:.05,value:k,onChange:t=>c("dim",parseFloat(t.target.value))}),e.default.createElement("span",{className:"dt-hint"},a("maskHint"))):null,N?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},e.default.createElement("span",{className:"dt-label"},a("themeAlphaLabel")),e.default.createElement("input",{className:"dt-slider",type:"range",min:0,max:1,step:.05,value:P,onChange:t=>c("themeAlpha",parseFloat(t.target.value))}),e.default.createElement("span",{className:"dt-hint"},a("themeAlphaHint"))):null,N?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},e.default.createElement("span",{className:"dt-label"},a("dialogAlphaLabel")),e.default.createElement("input",{className:"dt-slider",type:"range",min:0,max:1,step:.05,value:z,onChange:t=>c("dialogAlpha",parseFloat(t.target.value))}),e.default.createElement("span",{className:"dt-hint"},a("dialogAlphaHint"))):null,N?e.default.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},e.default.createElement("span",{className:"dt-label"},a("preview")),e.default.createElement("div",{className:"dt-preview"},n==="video"?e.default.createElement(_e,{src:x||B}):e.default.createElement("div",{className:"pbg",style:Ee}),k>0?e.default.createElement("div",{className:"pmask",style:{background:`rgba(0,0,0,${k})`}}):null)):null,e.default.createElement("div",{style:{display:"flex",gap:10,alignItems:"center",justifyContent:"flex-end"}},e.default.createElement("button",{className:"dt-btn",onClick:()=>{let t=M("image"),d=M("video");C({mode:"image",builtinId:"deep-space",imageSrc:t,imageFit:"cover",videoMode:"follow",videoSrc:d,oceanSpeed:1,dim:0,themeAlpha:1,dialogAlpha:0}),o.set("importedImages",[]),o.set("importedVideos",[]),v("\u5DF2\u6062\u590D\u9ED8\u8BA4\uFF0C\u70B9\u300C\u542F\u7528\u300D\u751F\u6548")}},a("reset")),e.default.createElement("button",{className:"dt-btn primary",onClick:()=>{Object.keys(_).forEach(t=>o.set(t,_[t])),C({}),o.set("enabled",!0),v("\u2713 \u5DF2\u5E94\u7528\uFF1A"+U()+X)}},a("apply"))),e.default.createElement("input",{ref:A,type:"file",accept:"image/png,image/jpeg,image/webp,video/mp4,video/webm",style:{display:"none"},onChange:t=>{let d=t.target.files&&t.target.files[0];if(d){let p=d.type&&d.type.indexOf("video")===0?"video":"image";ue(p,d)}t.target.value=""}}),f?e.default.createElement("div",{className:"dt-toast"},e.default.createElement("span",{className:f.ok?"ok":"err"},f.ok?"\u2713":"\u2715"),e.default.createElement("span",null,f.text)):null)}function Ie({scope:o,themeService:r,t:a,wide:i}){let[s,f]=(0,e.useState)(!1);return(0,e.useEffect)(()=>{if(!s)return;let m=u=>{u.key==="Escape"&&f(!1)};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[s]),e.default.createElement("div",{className:`dt-footer${i===!1?" rail":""}`},e.default.createElement("style",null,J),e.default.createElement("button",{type:"button",className:"dt-footer-btn",onClick:()=>f(!0),"aria-label":a("nav"),title:a("nav")},e.default.createElement("span",{className:"dt-footer-ico","aria-hidden":!0},"\u{1F3A8}"),e.default.createElement("span",{className:"dt-footer-label"},a("nav"))),s?e.default.createElement("div",{className:"dt-overlay",onClick:()=>f(!1)},e.default.createElement("div",{className:"dt-modal",onClick:m=>m.stopPropagation()},e.default.createElement("div",{className:"dt-modal-head"},e.default.createElement("span",{className:"title"},a("footerTitle")),e.default.createElement("div",{style:{flex:1}}),e.default.createElement("button",{className:"dt-modal-close",onClick:()=>f(!1)},"\u2715")),e.default.createElement("div",{className:"dt-modal-body"},e.default.createElement(pe,{scope:o,themeService:r,t:a})))):null)}function Fe({scope:o,themeService:r,t:a}){return e.default.createElement("div",{className:"dt-settings",style:{maxWidth:680}},e.default.createElement("style",null,J),e.default.createElement(pe,{scope:o,themeService:r,t:a}))}function Pe(o){o.effect(()=>o.locale.register(I,{zh:we,en:De}),"dsh-theme: locale dictionaries");let r=o.locale.bind(I),a=o.settingsScope.bind({namespace:I}),i=o.get("theme"),s={scope:a,themeService:i,t:r};o.effect(()=>o.slots.inject("shell.overlay",function*(){yield o.slots.register({name:"shell.overlay",id:`${I}-bg`,order:0,inject:()=>s},Me)}),"dsh-theme: background layer"),o.effect(()=>o.slots.inject("settings.section",()=>o.slots.register({name:"settings.section",id:I,order:25,label:()=>r("nav"),locale:I,inject:()=>s},Fe)),"dsh-theme: settings section"),o.effect(()=>o.slots.inject("sidebar.footer.action",()=>o.slots.register({name:"sidebar.footer.action",id:`${I}:footer`,order:100,label:()=>r("nav"),locale:I,inject:()=>s},f=>e.default.createElement(Ie,{...s,wide:!(f&&f.wide===!1)}))),"dsh-theme: sidebar footer action")}

    return module.exports;
  },
});
