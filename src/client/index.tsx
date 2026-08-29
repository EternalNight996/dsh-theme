// 主题皮肤（client 侧）：背景层 + 设置 → 主题 + 侧边栏「🎨 主题」按钮 + 导入/删除。
//
// - `shell.overlay`：背景层（position: fixed; inset: 0; z-index: -1; pointer-events: none），
//   渲染在页面最底层，不拦截任何交互；通过 theme.overrideTokens 让 DSH 主表面
//   随「内置主题/图片/视频」三态切换明暗或半透明，背景透出。
// - `settings.section`：设置面板顶层「主题」分区（id: dsh-theme, order: 25）。
// - `sidebar.footer.action`：侧边栏底部「🎨 主题」按钮（rail 态仅图标）。
//
// 视频皮肤两种：跟随鼠标（环绕跟随帧）/ 循环播放（autoplay loop）。
// 图片/视频/内置背景皮肤均支持蒙层（默认不加）；导入的皮肤持久化到 assets/imports，
// 支持删除。所有自定义 UI 用 var(--dsw-alias-*) 主题变量，明暗原生适配。

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ASSET_BASE, BUILTIN_THEMES, BUILTIN_VIDEOS, BUILTIN_3D, DEFAULT_VIDEO_SRC, LOCKED_SKINS, builtin3dById, themeById, themeImageUrl, translucentTokens } from '../../lib/themes.js'

const NS = 'dsh-theme'
const SOURCE = 'dsh-theme'

export const inject = ['settingsScope', 'slots', 'locale', 'theme']

// ── CSS（用 --dsw-alias-* 主题变量，明暗原生适配）─────────────────────────
const CSS = `
.dt-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
/* 提升为 GPU 合成层：视频/图片上屏走 GPU 合成，软解时帧不阻塞主线程（配合浏览器硬件加速解码） */
.dt-bg-media, .dt-bg-gradient { position: absolute; inset: 0; will-change: transform; transform: translateZ(0); }
.dt-bg-gradient { background-size: cover; background-position: center; }
.dt-bg-media img, .dt-bg-media video { width: 100%; height: 100%; object-fit: cover; backface-visibility: hidden; }
.dt-bg-media.fit-contain img { object-fit: contain; }
.dt-bg-mask { position: absolute; inset: 0; pointer-events: none; }
.dt-fade { animation: dt-fade-in 0.45s ease-out; }
@keyframes dt-fade-in { from { opacity: 0; } to { opacity: 1; } }

.dt-panel { display: flex; flex-direction: column; gap: 18px; }
/* 设置界面：即使背景皮肤透出，设置面板本身保持不透明，避免透底看不清 */
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
/* 3D 场景卡片 swatch 默认偏暗（金属渐变在 JSX inline style 中给出） */
.dt-themecard .swatch[style*="radial-gradient"] { color: #b8c0cc; }
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

/* sidebar footer button（照搬 dsh-memory-eternal 样式） */
/* .dt-footer:not(.rail) 在 footer action 横向容器里占满整行，避免与「记忆」挤在一行 */
.dt-footer { width: 100%; }
.dt-footer:not(.rail) { flex: 0 0 100%; }
.dt-footer-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 7px 10px; border: none; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 13.5px; line-height: 18px; border-radius: 8px; cursor: pointer; text-align: left; }
.dt-footer-btn:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
.dt-footer-btn:active { transform: translateY(0.5px); }
.dt-footer-ico { display: inline-flex; flex: none; width: 18px; height: 18px; align-items: center; justify-content: center; }
.dt-footer-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.dt-footer.rail .dt-footer-btn { justify-content: center; padding: 7px 0; }
.dt-footer.rail .dt-footer-label { display: none; }
`

// ── 词条 ─────────────────────────────────────────────────────────────────
const ZH = {
  nav: '主题',
  loading: '加载中…',
  modeBuiltin: '内置主题',
  modeImage: '图片皮肤',
  modeVideo: '视频皮肤',
  sectionDesc: '给 DSH Web GUI 换背景：内置主题 / 图片皮肤 / 视频皮肤（环绕跟随或循环播放）/ 3D 皮肤（Three.js 实时 GPU 渲染）。',
  colorHint: '应用配色主题（明暗原生适配，换色不换布局）',
  backdropHint: '内置背景皮肤',
  noImage: '尚未导入图片，点击下方导入。',
  importImage: '导入图片',
  importVideo: '导入视频',
  importHint: '导入后写入插件 assets/，重启不丢。',
  videoMode: '视频模式',
  modeFollow: '跟随鼠标',
  modeFollowHint: '鼠标左右移动 → 视频环绕旋转帧（平滑 lerp，跨边界不跳变）。',
  modeLoop: '循环播放',
  modeLoopHint: '视频自动循环播放，作为背景。',
  mask: '蒙层',
  maskHint: '背景压暗（仅影响背景不影响文字）；拖动仅预览，点「启用」后应用。',
  mode3d: '3D 皮肤',
  threeHint: 'Three.js 实时 3D 渲染，GPU 直出，跟手丝滑。点击场景触发金属波纹+脉冲。',
  threeRealtime: '实时 GPU 渲染',
  threeInteractLabel: '点击互动',
  threeOn: '开',
  threeOff: '关',
  threeOrbitLabel: '自动旋转速度',
  threeOrbitHint: '0=不旋转；跟随鼠标 + 自动 orbit 阻尼。',
  threePointerLabel: '鼠标驱动幅度',
  threePointerHint: '鼠标移动驱动相机 orbit 的幅度（0=不跟随，1=全幅度）。',
  delete: '删除',
  fit: '铺满方式',
  fitCover: '铺满 cover',
  fitContain: '完整 contain',
  dimLabel: '背景压暗',
  themeAlphaLabel: '主题面板透明',
  themeAlphaHint: '0 = 面板全透（背景全透），1 = 面板实底；气泡/卡片随之调节。拖动仅预览，点「启用」后应用。',
  dialogAlphaLabel: '对话栏透明',
  dialogAlphaHint: '0 = 对话栏全透（背景透出），1 = 对话栏实底；设置/侧栏不受影响（独立实底）。拖动仅预览，点「启用」后应用。',
  preview: '预览',
  reset: '恢复默认',
  apply: '启用',
  close: '关闭',
  footerTitle: '🎨 主题',
}
const EN = {
  nav: 'Theme',
  loading: 'Loading…',
  modeBuiltin: 'Built-in',
  modeImage: 'Image',
  modeVideo: 'Video',
  sectionDesc: 'Change the DSH web GUI background: built-in themes / image / video (orbit-follow or loop) / 3D skin (Three.js real-time GPU).',
  colorHint: 'App color themes (native light/dark; recolors, not relayouts)',
  backdropHint: 'Built-in backdrop skins',
  noImage: 'No image imported yet — import one below.',
  importImage: 'Import image',
  importVideo: 'Import video',
  importHint: 'Stored into the plugin assets/, persists across restarts.',
  videoMode: 'Video mode',
  modeFollow: 'Mouse-follow',
  modeFollowHint: 'Move the mouse left/right to orbit the video frames (smooth lerp, no jumps).',
  modeLoop: 'Loop',
  modeLoopHint: 'Autoplay looping video as the background.',
  mask: 'Mask',
  maskHint: 'Dims the backdrop (only affects the background, not text); drag to preview only, applied on "Apply".',
  mode3d: '3D Skin',
  threeHint: 'Three.js real-time 3D rendering, GPU direct, silky-smooth. Click triggers metal ripple + pulse.',
  threeRealtime: 'Real-time GPU',
  threeInteractLabel: 'Click interaction',
  threeOn: 'On',
  threeOff: 'Off',
  threeOrbitLabel: 'Auto-orbit speed',
  threeOrbitHint: '0 = no rotation; follows mouse + auto-orbit with damping.',
  threePointerLabel: 'Pointer follow range',
  threePointerHint: 'Mouse-driven orbit amplitude (0 = none, 1 = full).',
  delete: 'Delete',
  fit: 'Fit',
  fitCover: 'Cover',
  fitContain: 'Contain',
  dimLabel: 'Dim',
  themeAlphaLabel: 'Theme panels opacity',
  themeAlphaHint: '0 = panels fully transparent (background shows), 1 = solid; bubbles/cards follow. Drag to preview only; applied on "Apply".',
  dialogAlphaLabel: 'Dialog opacity',
  dialogAlphaHint: '0 = conversation fully transparent, 1 = solid; settings/sidebar stay solid (independent). Drag to preview only; applied on "Apply".',
  preview: 'Preview',
  reset: 'Reset defaults',
  apply: 'Apply',
  close: 'Close',
  footerTitle: '🎨 Theme',
}

// ── 工具 ─────────────────────────────────────────────────────────────────
function useScope(scope) {
  const subscribe = useCallback((cb) => (scope && typeof scope.subscribe === 'function' ? scope.subscribe(cb) : () => {}), [scope])
  const getSnapshot = useCallback(() => (scope && typeof scope.getSnapshot === 'function' ? scope.getSnapshot() : null), [scope])
  return useSyncExternalStore(subscribe, getSnapshot)
}

function wrap01(v) { return v - Math.floor(v) }

// 判定当前是否为「背景透出」态（需要半透明 token + 可选蒙层）。
function isBackdropState(mode, btheme) {
  if (mode === 'image' || mode === 'video') return true
  if (mode === 'builtin') return btheme && btheme.kind === 'backdrop'
  return false
}

// 是否为受保护的默认皮肤（不可删除）。
function isLockedSkin(kind, url) {
  const list = (kind === 'video' ? LOCKED_SKINS.video : LOCKED_SKINS.image) || []
  return typeof url === 'string' && !!url && list.indexOf(url) >= 0
}

// 名称截断：超过 n 字用 … 省略。
function truncateName(s, n) {
  if (s == null) return ''
  s = String(s)
  return s.length <= n ? s : s.slice(0, n - 1) + '…'
}

// 从导入 URL 的 basename 提取文件名（不含扩展名），最多 15 字。
function skinName(url) {
  if (!url) return ''
  const base = String(url).split('/').pop() || ''
  const name = base.replace(/\.[^.]+$/, '') || base
  return truncateName(name, 15)
}

// ── 视频：跟随鼠标（照搬 Character360, meng-you）───────────────────────
function VideoFollow({ src, active }) {
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let reduced = false
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { reduced = false }
    if (reduced || !active) return
    const START = (-3 * Math.PI) / 4
    let current = 0.02
    let target = current
    let raf = 0
    let lastSeek = 0
    let lastMove = performance.now()
    const IDLE_MS = 600
    const SEEK_THROTTLE = 60 // ≈16Hz 真正 seek：跟手性与解码开销的平衡
    const MIN_SEEK_DELTA = 0.03 // 秒，跳过微小位移
    const LERP = 0.3 // 加快插值，显著降低跟手滞后
    const DURATION = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 5)

    let pending = 0           // seek 进行中记录的最新目标位置（欠帧，seek 完成后追平，不丢）
    let pendingFlag = false
    const seekTo = (t) => {
      if (!Number.isFinite(t)) return
      if (document.hidden) return // 后台不 seek
      if (video.readyState < 2) return // 数据不足不 seek
      const now = performance.now()
      if (video.seeking) { pending = t; pendingFlag = true; return } // 正在 seek：记录最新目标，避免丢弃
      if (now - lastSeek < SEEK_THROTTLE) return
      const next = t * DURATION()
      if (Math.abs(next - video.currentTime) > MIN_SEEK_DELTA) {
        video.currentTime = next
        lastSeek = now
      }
    }
    const onSeeked = () => {
      if (pendingFlag) { pendingFlag = false; seekTo(pending) } // 本次 seek 完成，立即追平最新位置
    }

    const step = () => {
      let diff = target - current
      diff -= Math.round(diff)
      const done = Math.abs(diff) < 0.003
      current = wrap01(current + diff * LERP)
      seekTo(current)
      // 到位且鼠标静止 → 停止 rAF 避免空转；后台窗口也停
      if (!document.hidden && !(done && performance.now() - lastMove > IDLE_MS)) {
        raf = requestAnimationFrame(step)
      } else {
        raf = 0
      }
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(step) }
    const onMove = (e) => {
      lastMove = performance.now()
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      target = wrap01((angle - START) / (2 * Math.PI))
      if (!document.hidden) start()
    }
    const onLoaded = () => {
      seekTo(current)
      if (video.readyState >= 2) { video.play().then(() => video.pause()).catch(() => {}) }
      start()
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    video.addEventListener('loadedmetadata', onLoaded, { once: true })
    video.addEventListener('seeked', onSeeked)
    if (video.readyState >= 1) onLoaded()
    start()
    return () => {
      window.removeEventListener('mousemove', onMove)
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('seeked', onSeeked)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [src, active])
  return React.createElement('video', { ref: videoRef, src, muted: true, playsInline: true, preload: 'auto', disablePictureInPicture: true, style: { width: '100%', height: '100%', objectFit: 'cover' } })
}

// ── 视频：循环播放 ──────────────────────────────────────────────────────
function VideoLoop({ src }) {
  return React.createElement('video', { src, muted: true, autoPlay: true, loop: true, playsInline: true, preload: 'auto', disablePictureInPicture: true, style: { width: '100%', height: '100%', objectFit: 'cover' } })
}

function VideoSkin({ src, mode, active }) {
  return mode === 'loop' ? React.createElement(VideoLoop, { src }) : React.createElement(VideoFollow, { src, active })
}

// ── 3D 皮肤：程序化粒子地球（pointsEarth inspired，零外部贴图依赖）────
// v0.2.2 起：去掉「暗夜金属人物」默认 3D 皮肤，改为基于 pointsEarth 示例的程序化实现。
// 灵感：https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=pointsEarth
// 实现要点：
//   - IcosahedronGeometry(1, 12) → ~40k 顶点，用 Points + ShaderMaterial 渲染为粒子地球
//   - 完全程序化：FBM 噪声生成陆地/海洋 alpha + 海拔 + 波浪位移；圆点 mask 用 gl_PointCoord
//   - 0 外部贴图依赖 → bundle 自包含（避免 v0.2.1 那样的 RoomEnvironment 子路径问题）
//   - 集成鼠标 orbit（azimuth/polar 阻尼）+ 点击脉冲（group 缩放）+ uTime 动画
function ThreeLayer({ sceneId, interact, orbitSpeed, pointerRange, bgTexture }) {
  const wrapRef = useRef(null)
  const [errMsg, setErrMsg] = useState(null) // 屏幕可见错误（WebGL 不可用 / 初始化失败）

  useEffect(() => {
    if (!wrapRef.current) return undefined
    let mounted = true
    let cleanup = () => {}

    // WebGL 预检
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) {
      setErrMsg('当前 WebView 不支持 WebGL（请检查 dsh-desktop 是否启用 GPU/硬件加速）')
      return undefined
    }
    probe.remove()

    ;(async () => {
      try {
        const THREE = await import('three')
        if (!mounted) return

        const wrap = wrapRef.current
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false })
        try {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.setClearColor(0x000000, 0)
          wrap.appendChild(renderer.domElement)
        } catch (e) {
          setErrMsg('WebGLRenderer 创建失败：' + (e && e.message || String(e)))
          return
        }
        const canvas = renderer.domElement
        canvas.style.display = 'block'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.position = 'absolute'
        canvas.style.inset = '0'
        canvas.style.pointerEvents = 'auto'
        canvas.style.zIndex = '0'
        canvas.setAttribute('aria-label', 'dsh-theme 3D 背景层（点击互动）')
        canvas.setAttribute('role', 'img')

        const scene = new THREE.Scene()

        // ── 程序化粒子地球（pointsEarth inspired）──────────────────────
        // 顶点 shader：FBM 噪声生成陆地/海洋 alpha（>0.5=陆地）+ 海拔 + 海洋波浪位移
        //              距离控制 gl_PointSize（近大远小）
        // 片元 shader：圆形 mask（gl_PointCoord 距离中心>0.5 discard）+ 海洋深蓝 + 陆地 HSL 彩虹 + 海拔调整
        const vertexShader = /* glsl */ `
          uniform float size;
          uniform float uTime;
          uniform float uWaveHeight;
          uniform float uWaveSpeed;
          varying vec3 vPos;
          varying float vAlpha;
          varying float vElevation;
          varying vec3 vNormal;

          float random(vec3 st) {
            return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453123);
          }
          float noise(vec3 st) {
            vec3 i = floor(st);
            vec3 f = fract(st);
            float a = random(i);
            float b = random(i + vec3(1.0, 0.0, 0.0));
            float c = random(i + vec3(0.0, 1.0, 0.0));
            float d = random(i + vec3(1.0, 1.0, 0.0));
            float e = random(i + vec3(0.0, 0.0, 1.0));
            float f1 = random(i + vec3(1.0, 0.0, 1.0));
            float g = random(i + vec3(0.0, 1.0, 1.0));
            float h = random(i + vec3(1.0, 1.0, 1.0));
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
                       mix(mix(e, f1, u.x), mix(g, h, u.x), u.y), u.z);
          }
          float fbm(vec3 st) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
              value += amplitude * noise(st);
              st *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec3 p = normalize(position);
            // 陆地/海洋阈值：基于球面坐标的 FBM（>0.5 = 陆地）
            float landN = fbm(p * 2.5 + vec3(13.1, 7.7, 3.3));
            float alphaLand = step(0.5, landN);
            vAlpha = alphaLand;
            // 海拔：陆地上 FBM（>0.5 部分）
            float elev = (fbm(p * 5.0) - 0.5) * 2.0;
            vElevation = elev * alphaLand;
            vec3 newPosition = position;
            if (alphaLand < 0.5) {
              // 海洋波浪位移
              float wave = uWaveHeight;
              float speed = uWaveSpeed;
              float displacement = (fbm(p * 4.0 + uTime * speed) * 2.0 - 1.0) * wave;
              newPosition += normal * displacement;
            }
            vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
            // 距离控制点大小
            float dist = length(mvPosition.xyz);
            gl_PointSize = max(size * (1.0 - dist / 10.0), 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vPos = newPosition;
          }
        `
        const fragmentShader = /* glsl */ `
          varying vec3 vPos;
          varying float vAlpha;
          varying float vElevation;
          uniform float uClickPulse;
          varying vec3 vNormal;
          void main() {
            // 圆形 mask（圆点精灵）
            vec2 c = gl_PointCoord - vec2(0.5);
            if (length(c) > 0.5) discard;
            // 距离淡出（背面 / 远）
            float backFade = clamp(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.15, 1.0);
            vec3 color;
            if (vAlpha > 0.5) {
              // 陆地：HSL 按高度 + 经度色相
              float lon = atan(vPos.y, vPos.x) / 6.28318;
              float lat = (vPos.z + 1.0) * 0.5;
              float hue = lon + vElevation * 0.3;
              float sat = 0.65 + vElevation * 0.2;
              float lig = 0.5 + vElevation * 0.25;
              // 简化 HSL → RGB
              float h = fract(hue);
              float c1 = (1.0 - abs(2.0 * lig - 1.0)) * sat;
              float x1 = c1 * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
              vec3 rgb;
              if (h < 1.0/6.0) rgb = vec3(c1, x1, 0.0);
              else if (h < 2.0/6.0) rgb = vec3(x1, c1, 0.0);
              else if (h < 3.0/6.0) rgb = vec3(0.0, c1, x1);
              else if (h < 4.0/6.0) rgb = vec3(0.0, x1, c1);
              else if (h < 5.0/6.0) rgb = vec3(x1, 0.0, c1);
              else rgb = vec3(c1, 0.0, x1);
              color = rgb + vec3(lig - 0.5);
              // 点击脉冲：陆地微亮
              color += vec3(0.3, 0.4, 0.5) * uClickPulse * 0.6;
            } else {
              // 海洋：深蓝随海拔调整（波浪高度）
              vec3 deep = vec3(0.004, 0.12, 0.30);
              vec3 shallow = vec3(0.05, 0.30, 0.50);
              float t = clamp(vElevation * 30.0 + 0.5, 0.0, 1.0);
              color = mix(deep, shallow, t);
              // 点击脉冲：海洋微亮
              color += vec3(0.2, 0.4, 0.6) * uClickPulse * 0.6;
            }
            gl_FragColor = vec4(color * backFade, 1.0);
          }
        `
        const pointsMat = new THREE.ShaderMaterial({
          uniforms: {
            size: { value: 4.0 },
            uTime: { value: 0.0 },
            uWaveHeight: { value: 0.06 },
            uWaveSpeed: { value: 0.2 },
            uClickPulse: { value: 0.0 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: true,
          side: THREE.FrontSide,
        })
        // IcosahedronGeometry(radius, detail)：detail 越高顶点数越多（detail=12 ≈ 40k 点）
        const geo = new THREE.IcosahedronGeometry(1, 12)
        const points = new THREE.Points(geo, pointsMat)
        scene.add(points)

        // 背景星点（细化视觉层次）
        const starCount = 800
        const starGeo = new THREE.BufferGeometry()
        const starPos = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount; i++) {
          const r = 18 + Math.random() * 22
          const th = Math.random() * Math.PI * 2
          const ph = (Math.random() - 0.5) * Math.PI
          starPos[i * 3] = r * Math.cos(ph) * Math.cos(th)
          starPos[i * 3 + 1] = r * Math.sin(ph)
          starPos[i * 3 + 2] = r * Math.cos(ph) * Math.sin(th)
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false })
        scene.add(new THREE.Points(starGeo, starMat))

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
        camera.position.set(0, 0.5, 4)
        camera.lookAt(0, 0, 0)

        const state = {
          renderer, scene, camera, points, stars: scene.children.find((o) => o.isPoints && o !== points) || null, uniforms: pointsMat.uniforms,
          az: 0, polar: 0.25, azTarget: 0, polarTarget: 0.25,
          clickT: 0, clickPulse: 0,
          orbitSpeed: typeof orbitSpeed === 'number' ? orbitSpeed : 0.35,
          pointerRange: typeof pointerRange === 'number' ? pointerRange : 0.4,
          interact: interact !== false,
          raf: 0,
          autoSpin: 0, // 地球自转累加
        }

        const onResize = () => {
          const w = window.innerWidth, h = window.innerHeight
          renderer.setSize(w, h)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)

        const onPointer = (e) => {
          const x = (e.clientX / window.innerWidth) * 2 - 1
          const y = (e.clientY / window.innerHeight) * 2 - 1
          state.azTarget = x * state.pointerRange * Math.PI * 0.6
          state.polarTarget = 0.25 + y * state.pointerRange * 0.4
        }
        window.addEventListener('pointermove', onPointer, { passive: true })

        const onClick = () => {
          if (!state.interact) return
          state.clickT = performance.now()
          state.clickPulse = 1
        }
        canvas.addEventListener('click', onClick)

        const step = () => {
          state.raf = requestAnimationFrame(step)
          // 鼠标阻尼 orbit
          state.az += (state.azTarget - state.az) * 0.08
          state.polar += (state.polarTarget - state.polar) * 0.08
          // 自动慢转（az 增量 = orbitSpeed * dt）
          state.az += state.orbitSpeed * 0.005
          state.autoSpin += state.orbitSpeed * 0.005
          // 相机围绕原点 orbit
          const r = 4
          camera.position.x = Math.sin(state.az) * r * Math.cos(state.polar)
          camera.position.y = Math.sin(state.polar) * r
          camera.position.z = Math.cos(state.az) * r * Math.cos(state.polar)
          camera.lookAt(0, 0, 0)
          // 地球自转（绕 Y 轴）：旋转 points（不是 camera，camera 自己已 orbit）
          state.points.rotation.y = state.autoSpin
          // 点击脉冲衰减
          if (state.clickPulse > 0) {
            const t = (performance.now() - state.clickT) / 600
            if (t >= 1) state.clickPulse = 0
            else state.clickPulse = 1 - t
          }
          // group 整体脉冲缩放
          const pulse = 1 + state.clickPulse * 0.06 * Math.sin((1 - state.clickPulse) * Math.PI)
          state.points.scale.setScalar(pulse)
          // uTime + 点击 pulse uniform
          state.uniforms.uTime.value = performance.now() * 0.001
          state.uniforms.uClickPulse.value = state.clickPulse
          // 星空缓慢自转
          if (state.stars) state.stars.rotation.y += 0.0003
          renderer.render(scene, camera)
        }
        state.raf = requestAnimationFrame(step)

        cleanup = () => {
          cancelAnimationFrame(state.raf)
          window.removeEventListener('resize', onResize)
          window.removeEventListener('pointermove', onPointer)
          canvas.removeEventListener('click', onClick)
          try { geo.dispose() } catch {}
          try { pointsMat.dispose() } catch {}
          try { starGeo.dispose(); starMat.dispose() } catch {}
          try { renderer.dispose() } catch {}
          try { canvas.remove() } catch {}
        }
      } catch (err) {
        console.error('[dsh-theme] ThreeLayer init failed:', err)
        if (mounted) setErrMsg('3D 初始化失败：' + (err && err.message || String(err)))
      }
    })()

    return () => {
      mounted = false
      cleanup()
    }
  }, [sceneId, interact, orbitSpeed, pointerRange, bgTexture])

  if (errMsg) {
    return React.createElement('div', {
      className: 'dt-bg-3d-fallback',
      style: {
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'var(--dsw-alias-bg-base, #14181d)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--dsw-alias-label-secondary, #9aa4b2)',
        fontSize: 12, padding: 16, textAlign: 'center', gap: 8,
        pointerEvents: 'none',
      },
    },
      React.createElement('div', { style: { fontWeight: 700, fontSize: 13 } }, '⚠ 3D 场景不可用'),
      React.createElement('div', null, errMsg),
    )
  }
  return React.createElement('div', {
    ref: wrapRef, className: 'dt-bg-3d',
    style: { position: 'absolute', inset: 0, pointerEvents: 'auto', zIndex: 0 },
  })
}

// ── 背景层 ────────────────────────────────────────────────────────────────
function BackgroundLayer({ scope, themeService, t }) {
  const snap = useScope(scope)
  const value = snap && snap.value && typeof snap.value === 'object' ? snap.value : null

  const enabled = value ? value.enabled !== false : true
  const mode = value && value.mode ? value.mode : 'builtin'
  const builtinId = value && value.builtinId ? value.builtinId : 'aurora'
  const imageSrc = (value && value.imageSrc) || ''
  const imageFit = value && value.imageFit ? value.imageFit : 'cover'
  const videoMode = value && value.videoMode ? value.videoMode : 'follow'
  const videoSrc = (value && value.videoSrc) || DEFAULT_VIDEO_SRC
  const threeSceneId = value && value.threeSceneId ? value.threeSceneId : 'metal-figure'
  const threeInteract = value && typeof value.threeInteract === 'boolean' ? value.threeInteract : true
  const threeOrbitSpeed = value && typeof value.threeOrbitSpeed === 'number' ? Math.min(2, Math.max(0, value.threeOrbitSpeed)) : 0.35
  const threePointerRange = value && typeof value.threePointerRange === 'number' ? Math.min(1, Math.max(0, value.threePointerRange)) : 0.4
  const dim = value && typeof value.dim === 'number' ? Math.min(0.7, Math.max(0, value.dim)) : 0
  const themeAlpha = value && typeof value.themeAlpha === 'number' ? Math.min(1, Math.max(0, value.themeAlpha)) : 0.75
  const dialogAlpha = value && typeof value.dialogAlpha === 'number' ? Math.min(1, Math.max(0, value.dialogAlpha)) : 0.8

  const btheme = themeById(builtinId)
  const backdrop = isBackdropState(mode, btheme)

  useEffect(() => {
    if (!themeService || typeof themeService.overrideTokens !== 'function') return
    const tokens = !enabled ? null : (backdrop ? translucentTokens(themeAlpha, dialogAlpha) : (mode === 'builtin' ? (btheme.tokens || {}) : translucentTokens(themeAlpha, dialogAlpha)))
    if (!tokens) return
    const dispose = themeService.overrideTokens(SOURCE, tokens)
    return dispose
  }, [themeService, enabled, mode, builtinId, backdrop, themeAlpha, dialogAlpha])

  if (!enabled) return null

  // memo 化背景媒体：只在皮肤相关字段变化时重建，滑块拖动等无关变化不复用重建。
  const media = React.useMemo(() => {
    if (mode === 'builtin' && btheme.kind === 'color') {
      return React.createElement('div', { className: 'dt-bg-gradient', style: { background: btheme.bg } })
    }
    if (mode === 'builtin' && btheme.kind === 'backdrop') {
      return React.createElement('img', { src: themeImageUrl(btheme), alt: '', 'aria-hidden': true })
    }
    if (mode === 'image') {
      return imageSrc
        ? React.createElement('img', { src: imageSrc, alt: '', 'aria-hidden': true, style: { objectFit: imageFit } })
        : React.createElement('img', { src: themeImageUrl(themeById('aurora')), alt: '', 'aria-hidden': true, style: { objectFit: imageFit } })
    }
    if (mode === 'video') {
      return React.createElement(VideoSkin, { src: videoSrc, mode: videoMode, active: videoMode !== 'loop' })
    }
    if (mode === '3d') {
      const sc = builtin3dById(threeSceneId)
      return React.createElement(ThreeLayer, {
        sceneId: threeSceneId,
        interact: threeInteract,
        orbitSpeed: threeOrbitSpeed,
        pointerRange: threePointerRange,
        bgTexture: sc.bgTexture,
      })
    }
    return null
  }, [mode, btheme, imageSrc, imageFit, videoMode, videoSrc, threeSceneId, threeInteract, threeOrbitSpeed, threePointerRange])

  const maskEl = backdrop && dim > 0
    ? React.createElement('div', { className: 'dt-bg-mask', style: { background: `rgba(0,0,0,${dim})` } })
    : null

  const mediaWrap = React.createElement('div', { className: 'dt-bg-media' + (mode === 'image' && imageFit === 'contain' ? ' fit-contain' : '') }, media)

  return createPortal(
    React.createElement('div', { className: 'dt-bg dt-fade' },
      React.createElement('style', null, CSS),
      mediaWrap,
      maskEl,
    ),
    document.body,
  )
}

// ── 主题管理（设置分区 + 弹窗共用）───────────────────────────────────────
function ThemeManager({ scope, themeService, t }) {
  const snap = useScope(scope)
  const value = snap && snap.value && typeof snap.value === 'object' ? snap.value : null
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const [ready, setReady] = useState(false)
  const fileRef = useRef(null)
  const [confirmDel, setConfirmDel] = useState(null) // 'image' | 'video' | null：待确认删除
  const [draft, setDraftState] = useState({}) // 外观配置草稿（增量 key→新值）：选择/拖动只改面板预览，点「启用」才批量写入 scope，避免高频 overrideTokens 卡顿
  // helpers：草稿有值取草稿，否则回落已应用 value。
  const dv = (k, fb) => (Object.prototype.hasOwnProperty.call(draft, k) ? draft[k] : fb)
  const setDraft = (k, v) => setDraftState((s) => ({ ...s, [k]: v }))

  useEffect(() => { if (value && !ready) setReady(true) }, [value, ready])
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  if (!value || !ready) return React.createElement('div', { style: { padding: 16, opacity: 0.6 } }, t('loading'))

  // 外观配置：草稿有值取草稿，未修改回落 scope；资源库（importedImages/importedVideos）始终即时读 scope。
  const mode = dv('mode', value.mode || 'builtin')
  const builtinId = dv('builtinId', value.builtinId || 'aurora')
  const imageSrc = dv('imageSrc', value.imageSrc || '')
  const imageFit = dv('imageFit', value.imageFit || 'cover')
  const videoMode = dv('videoMode', value.videoMode || 'follow')
  const videoSrc = dv('videoSrc', value.videoSrc || '')
  const threeSceneId = dv('threeSceneId', value.threeSceneId || 'metal-figure')
  const threeInteract = typeof value.threeInteract === 'boolean' ? value.threeInteract : true
  const threeOrbitSpeed = typeof value.threeOrbitSpeed === 'number' ? Math.min(2, Math.max(0, value.threeOrbitSpeed)) : 0.35
  const threePointerRange = typeof value.threePointerRange === 'number' ? Math.min(1, Math.max(0, value.threePointerRange)) : 0.4
  // threeInteract/threeOrbitSpeed/threePointerRange 同样受 draft 覆盖（如果有的话）
  const dThreeInteract = draft.threeInteract !== undefined ? draft.threeInteract : threeInteract
  const dThreeOrbitSpeed = draft.threeOrbitSpeed !== undefined ? draft.threeOrbitSpeed : threeOrbitSpeed
  const dThreePointerRange = draft.threePointerRange !== undefined ? draft.threePointerRange : threePointerRange
  const importedImages = value.importedImages && Array.isArray(value.importedImages) ? value.importedImages : []
  const importedVideos = value.importedVideos && Array.isArray(value.importedVideos) ? value.importedVideos : []
  const dim = dv('dim', typeof value.dim === 'number' ? Math.min(0.7, Math.max(0, value.dim)) : 0)
  const themeAlpha = dv('themeAlpha', typeof value.themeAlpha === 'number' ? Math.min(1, Math.max(0, value.themeAlpha)) : 1)
  const dialogAlpha = dv('dialogAlpha', typeof value.dialogAlpha === 'number' ? Math.min(1, Math.max(0, value.dialogAlpha)) : 0)

  const btheme = themeById(builtinId)
  const backdrop = isBackdropState(mode, btheme)

  const flash = (text, ok = true) => {
    setToast({ text, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }
  const sel = (k, v, name) => { setDraft(k, v); flash('已选：' + name + '，点「启用」生效') }
  const modeName = () => mode === 'builtin' ? t('modeBuiltin') : mode === 'image' ? t('modeImage') : t('modeVideo')
  const appliedLabel = mode === 'builtin'
    ? ' · ' + btheme.name
    : mode === 'image' ? ' · ' + (imageSrc ? '自定义' : '未导入') : ' · ' + (videoMode === 'loop' ? t('modeLoop') : t('modeFollow'))

  const libKey = (kind) => kind === 'video' ? 'importedVideos' : 'importedImages'
  const activeKey = (kind) => kind === 'video' ? 'videoSrc' : 'imageSrc'
  const lockedDefault = (kind) => (kind === 'video' ? (LOCKED_SKINS.video[0] || DEFAULT_VIDEO_SRC) : (LOCKED_SKINS.image[0] || themeImageUrl(themeById('aurora'))))

  // 导入图片/视频：读为 data URL → host 写入插件 assets 返回持久化 URL；
  // 加入库（非默认）+ 设为当前激活。
  const onImport = (kind, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      fetch('/dsh-theme/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, name: file.name, data: dataUrl }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res && res.ok) {
            const url = res.url
            if (!isLockedSkin(kind, url)) {
              const cur = value[libKey(kind)] || []
              if (cur.indexOf(url) < 0) scope.set(libKey(kind), cur.concat(url)) // 库即时持久化
            }
            setDraft(activeKey(kind), url) // 当前激活设为草稿，不即时切换背景
            flash(kind === 'video' ? '视频已导入，点「启用」应用' : '图片已导入，点「启用」应用')
          } else {
            flash('导入失败：' + ((res && res.error) || 'unknown'), false)
          }
        })
        .catch((e) => flash('导入失败：' + String(e && e.message ? e.message : e), false))
    }
    reader.onerror = () => flash('读取文件失败', false)
    reader.readAsDataURL(file)
  }

  // 删除导入皮肤（两步确认）：默认皮肤不可删；删除后回退到受保护的默认。
  const onDeleteImport = (kind, url) => {
    const target = url || value[activeKey(kind)]
    if (!target) return
    if (isLockedSkin(kind, target)) { flash('这是默认皮肤，不可删除', false); return }
    const token = kind + '|' + target
    if (confirmDel !== token) { setConfirmDel(token); flash('再点一次「确认删除」'); return }
    setConfirmDel(null)
    scope.set(libKey(kind), (value[libKey(kind)] || []).filter((u) => u !== target))
    if (dv(activeKey(kind), value[activeKey(kind)]) === target) setDraft(activeKey(kind), lockedDefault(kind)) // 回退激活到草稿，不即时切换
    fetch('/dsh-theme/api/import', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: target }) }).catch(() => {})
    flash(kind === 'video' ? '已删除导入视频，回退默认；点「启用」应用' : '已删除导入图片，回退默认壁纸；点「启用」应用')
  }

  const modeOptions = [['builtin', t('modeBuiltin')], ['image', t('modeImage')], ['video', t('modeVideo')], ['3d', t('mode3d')]]

  const previewStyle = mode === 'builtin'
    ? (btheme.kind === 'backdrop' ? { backgroundImage: `url(${themeImageUrl(btheme)})` } : { background: btheme.bg })
    : mode === 'image' ? { backgroundImage: imageSrc ? `url(${imageSrc})` : 'none', backgroundSize: imageFit === 'contain' ? 'contain' : 'cover', backgroundPosition: 'center' }
    : { background: '#000' }

  return React.createElement('div', { className: 'dt-panel' },
    React.createElement('style', null, CSS),

    React.createElement('div', { className: 'dt-label' }, t('sectionDesc')),

    // 三态切换
    React.createElement('div', { className: 'dt-seq' },
      modeOptions.map(([v, label]) => React.createElement('button', { key: v, className: mode === v ? 'active' : '', onClick: () => sel('mode', v, label), 'aria-pressed': mode === v }, label)),
    ),

    // 内置主题（配色 + 背景皮肤）
    mode === 'builtin' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('span', { className: 'dt-hint' }, t('colorHint')),
      React.createElement('div', { className: 'dt-cardgrid' },
        BUILTIN_THEMES.map((th) => {
          const swatch = th.kind === 'backdrop'
            ? { backgroundImage: `url(${themeImageUrl(th)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: th.bg, backgroundSize: 'cover', backgroundPosition: 'center' }
          const sub = th.kind === 'backdrop' ? t('backdropHint') : (th.dark ? '暗色' : '亮色')
          return React.createElement('button', {
            key: th.id, className: 'dt-themecard' + (builtinId === th.id ? ' active' : ''),
            onClick: () => sel('builtinId', th.id, th.name),
          },
            React.createElement('div', { className: 'swatch', style: swatch }),
            React.createElement('div', { className: 'name' }, th.name),
            React.createElement('div', { className: 'sub' }, sub),
          )
        }),
      ),
    ) : null,

    // 图片皮肤（锁定的默认壁纸 + 导入图片库 + 铺满方式）
    mode === 'image' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-label' }, t('fit')),
        React.createElement('div', { className: 'dt-seq' },
          React.createElement('button', { className: imageFit === 'cover' ? 'active' : '', onClick: () => sel('imageFit', 'cover', t('fitCover')) }, t('fitCover')),
          React.createElement('button', { className: imageFit === 'contain' ? 'active' : '', onClick: () => sel('imageFit', 'contain', t('fitContain')) }, t('fitContain')),
        ),
      ),
      React.createElement('div', { className: 'dt-cardgrid' },
        React.createElement('button', { className: 'dt-themecard' + (imageSrc === lockedDefault('image') ? ' active' : ''), onClick: () => sel('imageSrc', lockedDefault('image'), '默认壁纸') },
          React.createElement('div', { className: 'swatch', style: { backgroundImage: `url(${lockedDefault('image')})`, backgroundSize: 'cover', backgroundPosition: 'center' } }),
          React.createElement('div', { className: 'name' }, '默认壁纸（不可删除）'),
          React.createElement('div', { className: 'sub' }, '受保护'),
        ),
        importedImages.map((url) => React.createElement('div', { key: url, role: 'button', tabIndex: 0, className: 'dt-themecard dt-clickable' + (imageSrc === url ? ' active' : ''), onClick: () => sel('imageSrc', url, skinName(url)) },
          React.createElement('div', { className: 'swatch', style: { backgroundImage: `url(${url})`, backgroundSize: imageFit === 'contain' ? 'contain' : 'cover', backgroundPosition: 'center' } }),
          React.createElement('div', { className: 'name' }, skinName(url)),
          React.createElement('button', { className: 'dt-btn danger', onClick: (e) => { e.stopPropagation(); onDeleteImport('image', url) } }, confirmDel === ('image|' + url) ? '确认删除？' : t('delete')),
        )),
      ),
      importedImages.length === 0 ? React.createElement('span', { className: 'dt-hint' }, t('noImage')) : null,
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-hint' }, t('importHint')),
        React.createElement('button', { className: 'dt-btn primary', onClick: () => { const el = fileRef.current; if (el) el.click() } }, t('importImage')),
      ),
    ) : null,

    // 视频皮肤（跟随/循环 + 默认视频 + 内置视频 + 导入库）
    mode === 'video' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-label' }, t('videoMode')),
        React.createElement('div', { className: 'dt-seq' },
          React.createElement('button', { className: videoMode === 'follow' ? 'active' : '', onClick: () => sel('videoMode', 'follow', t('modeFollow')) }, t('modeFollow')),
          React.createElement('button', { className: videoMode === 'loop' ? 'active' : '', onClick: () => sel('videoMode', 'loop', t('modeLoop')) }, t('modeLoop')),
        ),
      ),
      React.createElement('span', { className: 'dt-hint' }, videoMode === 'loop' ? t('modeLoopHint') : t('modeFollowHint')),
      React.createElement('div', { className: 'dt-cardgrid' },
        React.createElement('button', { className: 'dt-themecard' + (videoSrc === lockedDefault('video') ? ' active' : ''), onClick: () => sel('videoSrc', lockedDefault('video'), '默认视频') },
          React.createElement('div', { className: 'swatch', style: { background: 'repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2', fontSize: 20 } }, '🎬'),
          React.createElement('div', { className: 'name' }, '默认视频（不可删除）'),
          React.createElement('div', { className: 'sub' }, '受保护'),
        ),
        BUILTIN_VIDEOS.map((v) => React.createElement('button', {
          key: v.id, className: 'dt-themecard' + (!videoSrc || videoSrc === DEFAULT_VIDEO_SRC ? ' active' : ''), onClick: () => sel('videoSrc', DEFAULT_VIDEO_SRC, v.name),
        },
          React.createElement('div', { className: 'swatch', style: { background: 'repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2', fontSize: 20 } }, '🎬'),
          React.createElement('div', { className: 'name' }, v.name),
        )),
        importedVideos.map((url) => React.createElement('div', { key: url, role: 'button', tabIndex: 0, className: 'dt-themecard dt-clickable' + (videoSrc === url ? ' active' : ''), onClick: () => sel('videoSrc', url, skinName(url)) },
          React.createElement('div', { className: 'swatch', style: { background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2', fontSize: 20 } }, '🎬'),
          React.createElement('div', { className: 'name' }, skinName(url)),
          React.createElement('button', { className: 'dt-btn danger', onClick: (e) => { e.stopPropagation(); onDeleteImport('video', url) } }, confirmDel === ('video|' + url) ? '确认删除？' : t('delete')),
        )),
      ),
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-hint' }, t('importHint')),
        React.createElement('button', { className: 'dt-btn primary', onClick: () => { const el = fileRef.current; if (el) el.click() } }, t('importVideo')),
      ),
    ) : null,

    // 3D 皮肤（Three.js 实时渲染，GPU 直出，跟手丝滑）
    mode === '3d' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('span', { className: 'dt-hint' }, t('threeHint')),
      React.createElement('div', { className: 'dt-cardgrid' },
        BUILTIN_3D.map((sc) => {
          // swatch：3D 场景用渐变金属感预览（替代图片预览）
          const swatch = {
            background: `radial-gradient(120% 120% at 50% 40%, #2a3038 0%, #14181d 60%, #0a0c0f 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9aa4b2', fontSize: 24,
          }
          return React.createElement('button', {
            key: sc.id, className: 'dt-themecard' + (threeSceneId === sc.id ? ' active' : ''),
            onClick: () => sel('threeSceneId', sc.id, sc.name),
          },
            React.createElement('div', { className: 'swatch', style: swatch }, '🔮'),
            React.createElement('div', { className: 'name' }, sc.name),
            React.createElement('div', { className: 'sub' }, t('threeRealtime')),
          )
        }),
      ),
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-label' }, t('threeInteractLabel')),
        React.createElement('div', { className: 'dt-seq' },
          React.createElement('button', { className: dThreeInteract ? 'active' : '', onClick: () => sel('threeInteract', true, t('threeOn')) }, t('threeOn')),
          React.createElement('button', { className: !dThreeInteract ? 'active' : '', onClick: () => sel('threeInteract', false, t('threeOff')) }, t('threeOff')),
        ),
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        React.createElement('span', { className: 'dt-label' }, t('threeOrbitLabel')),
        React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 2, step: 0.05, value: dThreeOrbitSpeed, onChange: (e) => setDraft('threeOrbitSpeed', parseFloat(e.target.value)) }),
        React.createElement('span', { className: 'dt-hint' }, t('threeOrbitHint')),
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        React.createElement('span', { className: 'dt-label' }, t('threePointerLabel')),
        React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 1, step: 0.05, value: dThreePointerRange, onChange: (e) => setDraft('threePointerRange', parseFloat(e.target.value)) }),
        React.createElement('span', { className: 'dt-hint' }, t('threePointerHint')),
      ),
    ) : null,

    // 背景压暗（蒙层强度滑杆，默认 0 = 不压暗）
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--dsw-alias-border-l1)', paddingTop: 14 } },
      React.createElement('span', { className: 'dt-label' }, t('dimLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 0.7, step: 0.05, value: dim, onChange: (e) => setDraft('dim', parseFloat(e.target.value)) }),
      React.createElement('span', { className: 'dt-hint' }, t('maskHint')),
    ) : null,

    // 主题面板透明可调
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('themeAlphaLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 1, step: 0.05, value: themeAlpha, onChange: (e) => setDraft('themeAlpha', parseFloat(e.target.value)) }),
      React.createElement('span', { className: 'dt-hint' }, t('themeAlphaHint')),
    ) : null,

    // 对话栏透明可调
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('dialogAlphaLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 1, step: 0.05, value: dialogAlpha, onChange: (e) => setDraft('dialogAlpha', parseFloat(e.target.value)) }),
      React.createElement('span', { className: 'dt-hint' }, t('dialogAlphaHint')),
    ) : null,

    // 预览（视频用真实视频播放，图片/背景用静态图）
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('preview')),
      React.createElement('div', { className: 'dt-preview' },
        mode === 'video'
          ? React.createElement(VideoLoop, { src: videoSrc || DEFAULT_VIDEO_SRC })
          : React.createElement('div', { className: 'pbg', style: previewStyle }),
        dim > 0 ? React.createElement('div', { className: 'pmask', style: { background: `rgba(0,0,0,${dim})` } }) : null,
      ),
    ) : null,

    React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' } },
      React.createElement('button', { className: 'dt-btn', onClick: () => { const lockImg = lockedDefault('image'); const lockVid = lockedDefault('video'); setDraftState({ mode: 'image', builtinId: 'deep-space', imageSrc: lockImg, imageFit: 'cover', videoMode: 'follow', videoSrc: lockVid, threeSceneId: 'metal-figure', threeInteract: true, threeOrbitSpeed: 0.35, threePointerRange: 0.4, dim: 0, themeAlpha: 1, dialogAlpha: 0 }); scope.set('importedImages', []); scope.set('importedVideos', []); flash('已恢复默认，点「启用」生效') } }, t('reset')),
      React.createElement('button', { className: 'dt-btn primary', onClick: () => {
        // 把草稿中所有外观配置一次性写入 scope（React 自动批处理，一次生效）
        Object.keys(draft).forEach((k) => scope.set(k, draft[k]))
        setDraftState({})
        scope.set('enabled', true)
        flash('✓ 已应用：' + modeName() + appliedLabel)
      } }, t('apply')),
    ),

    React.createElement('input', {
      ref: fileRef, type: 'file',
      accept: 'image/png,image/jpeg,image/webp,video/mp4,video/webm',
      style: { display: 'none' },
      onChange: (e) => {
        const f = e.target.files && e.target.files[0]
        if (f) {
          const kind = (f.type && f.type.indexOf('video') === 0) ? 'video' : 'image'
          onImport(kind, f)
        }
        e.target.value = '' // 允许再次选择同一文件
      },
    }),

    toast ? React.createElement('div', { className: 'dt-toast' },
      React.createElement('span', { className: toast.ok ? 'ok' : 'err' }, toast.ok ? '✓' : '✕'),
      React.createElement('span', null, toast.text),
    ) : null,
  )
}

// ── 侧边栏 footer 按钮 + 主题面板弹窗 ──────────────────────────────────────
function ThemeFooterButton({ scope, themeService, t, wide }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return React.createElement('div', { className: `dt-footer${wide === false ? ' rail' : ''}` },
    React.createElement('style', null, CSS),
    React.createElement('button', { type: 'button', className: 'dt-footer-btn', onClick: () => setOpen(true), 'aria-label': t('nav'), title: t('nav') },
      React.createElement('span', { className: 'dt-footer-ico', 'aria-hidden': true }, '🎨'),
      React.createElement('span', { className: 'dt-footer-label' }, t('nav')),
    ),
    open ? React.createElement('div', { className: 'dt-overlay', onClick: () => setOpen(false) },
      React.createElement('div', { className: 'dt-modal', onClick: (e) => e.stopPropagation() },
        React.createElement('div', { className: 'dt-modal-head' },
          React.createElement('span', { className: 'title' }, t('footerTitle')),
          React.createElement('div', { style: { flex: 1 } }),
          React.createElement('button', { className: 'dt-modal-close', onClick: () => setOpen(false) }, '✕'),
        ),
        React.createElement('div', { className: 'dt-modal-body' },
          React.createElement(ThemeManager, { scope, themeService, t }),
        ),
      ),
    ) : null,
  )
}

// ── 设置分区 ──────────────────────────────────────────────────────────────
function ThemeSettings({ scope, themeService, t }) {
  return React.createElement('div', { className: 'dt-settings', style: { maxWidth: 680 } },
    React.createElement('style', null, CSS),
    React.createElement(ThemeManager, { scope, themeService, t }),
  )
}

// ── apply ─────────────────────────────────────────────────────────────────
export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'dsh-theme: locale dictionaries')
  const t = ctx.locale.bind(NS)

  const scope = ctx.settingsScope.bind({ namespace: NS })
  const themeService = ctx.get('theme')
  const common = { scope, themeService, t }

  // 背景层（frame 级，页面最底层，pointer-events: none）。
  ctx.effect(
    () => ctx.slots.inject('shell.overlay', function* () {
      yield ctx.slots.register(
        { name: 'shell.overlay', id: `${NS}-bg`, order: 0, inject: () => common },
        BackgroundLayer,
      )
    }),
    'dsh-theme: background layer',
  )

  // 设置面板顶层「主题」分区（与「插件」同层）。
  ctx.effect(
    () => ctx.slots.inject('settings.section', () => ctx.slots.register(
      { name: 'settings.section', id: NS, order: 25, label: () => t('nav'), locale: NS, inject: () => common },
      ThemeSettings,
    )),
    'dsh-theme: settings section',
  )

  // 侧边栏底部「🎨 主题」按钮 → 主题面板弹窗。
  ctx.effect(
    () => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register(
      { name: 'sidebar.footer.action', id: `${NS}:footer`, order: 100, label: () => t('nav'), locale: NS, inject: () => common },
      (props) => React.createElement(ThemeFooterButton, { ...common, wide: !(props && props.wide === false) }),
    )),
    'dsh-theme: sidebar footer action',
  )
}
