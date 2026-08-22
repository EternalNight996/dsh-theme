// 主题皮肤（client 侧）：背景层 + 设置 → 主题 + 侧边栏「🎨 主题」按钮 + 导入/删除。
//
// - `shell.overlay`：背景层（position: fixed; inset: 0; z-index: -1; pointer-events: none），
//   渲染在页面最底层，不拦截任何交互；通过 theme.overrideTokens 让 DSH 主表面
//   随「内置主题/图片/视频」三态切换明暗或半透明，背景透出。
// - `settings.section`：设置面板顶层「主题」分区（id: deep-theme, order: 25）。
// - `sidebar.footer.action`：侧边栏底部「🎨 主题」按钮（rail 态仅图标）。
//
// 视频皮肤两种：跟随鼠标（环绕跟随帧）/ 循环播放（autoplay loop）。
// 图片/视频/内置背景皮肤均支持蒙层（默认不加）；导入的皮肤持久化到 assets/imports，
// 支持删除。所有自定义 UI 用 var(--dsw-alias-*) 主题变量，明暗原生适配。

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ASSET_BASE, BUILTIN_THEMES, BUILTIN_VIDEOS, DEFAULT_VIDEO_SRC, LOCKED_SKINS, themeById, themeImageUrl, translucentTokens } from '../../lib/themes.js'

const NS = 'deep-theme'
const SOURCE = 'deep-theme'

export const inject = ['settingsScope', 'slots', 'locale', 'theme']

// ── CSS（用 --dsw-alias-* 主题变量，明暗原生适配）─────────────────────────
const CSS = `
.dt-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.dt-bg-media, .dt-bg-gradient { position: absolute; inset: 0; }
.dt-bg-gradient { background-size: cover; background-position: center; }
.dt-bg-media img, .dt-bg-media video { width: 100%; height: 100%; object-fit: cover; }
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
.dt-footer { width: 100%; }
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
  sectionDesc: '给 DSH Web GUI 换背景：内置主题 / 图片皮肤 / 视频皮肤（环绕跟随或循环播放）。',
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
  maskHint: '背景压暗（0 = 不压暗，拖动实时生效，仅影响背景不影响文字）。',
  delete: '删除',
  fit: '铺满方式',
  fitCover: '铺满 cover',
  fitContain: '完整 contain',
  dimLabel: '背景压暗',
  themeAlphaLabel: '主题面板透明',
  themeAlphaHint: '0 = 面板全透（背景全透），1 = 面板实底；气泡/卡片随之调节。',
  dialogAlphaLabel: '对话栏透明',
  dialogAlphaHint: '0 = 对话栏全透（背景透出），1 = 对话栏实底；设置/侧栏不受影响（独立实底）。',
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
  sectionDesc: 'Change the DSH web GUI background: built-in themes / image / video (orbit-follow or loop).',
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
  maskHint: 'Dims the background (0 = off; drag to live-dim; only affects the backdrop, not text).',
  delete: 'Delete',
  fit: 'Fit',
  fitCover: 'Cover',
  fitContain: 'Contain',
  dimLabel: 'Dim',
  themeAlphaLabel: 'Theme panels opacity',
  themeAlphaHint: '0 = panels fully transparent (background shows), 1 = solid; bubbles/cards follow.',
  dialogAlphaLabel: 'Dialog opacity',
  dialogAlphaHint: '0 = conversation fully transparent, 1 = solid; settings/sidebar stay solid (independent).',
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
    const SEEK_THROTTLE = 90 // ≈11Hz 真正 seek，1080p 下显著减少解码开销
    const MIN_SEEK_DELTA = 0.035 // 秒，跳过微小位移，避免无谓 seek
    const DURATION = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 5)

    const seekTo = (t) => {
      if (!Number.isFinite(t)) return
      if (document.hidden) return // 后台不 seek
      if (video.readyState < 2) return // 数据不足不 seek
      const now = performance.now()
      if (now - lastSeek < SEEK_THROTTLE) return
      if (video.seeking) return // 正在 seek，下一帧再试，避免堆积打断
      const next = t * DURATION()
      if (Math.abs(next - video.currentTime) > MIN_SEEK_DELTA) {
        video.currentTime = next
        lastSeek = now
      }
    }

    const step = () => {
      let diff = target - current
      diff -= Math.round(diff)
      const done = Math.abs(diff) < 0.003
      current = wrap01(current + diff * 0.14)
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
    if (video.readyState >= 1) onLoaded()
    start()
    return () => {
      window.removeEventListener('mousemove', onMove)
      video.removeEventListener('loadedmetadata', onLoaded)
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

  let media
  if (mode === 'builtin' && btheme.kind === 'color') {
    media = React.createElement('div', { className: 'dt-bg-gradient', style: { background: btheme.bg } })
  } else if (mode === 'builtin' && btheme.kind === 'backdrop') {
    media = React.createElement('img', { src: themeImageUrl(btheme), alt: '', 'aria-hidden': true })
  } else if (mode === 'image') {
    // 未导入 → 回退到内置默认壁纸（极光星云，受保护不可删），保证默认图片主题始终存在。
    media = imageSrc
      ? React.createElement('img', { src: imageSrc, alt: '', 'aria-hidden': true, style: { objectFit: imageFit } })
      : React.createElement('img', { src: themeImageUrl(themeById('aurora')), alt: '', 'aria-hidden': true, style: { objectFit: imageFit } })
  } else if (mode === 'video') {
    media = React.createElement(VideoSkin, { src: videoSrc, mode: videoMode, active: videoMode !== 'loop' })
  }

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

  useEffect(() => { if (value && !ready) setReady(true) }, [value, ready])
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  if (!value || !ready) return React.createElement('div', { style: { padding: 16, opacity: 0.6 } }, t('loading'))

  const mode = value.mode || 'builtin'
  const builtinId = value.builtinId || 'aurora'
  const imageSrc = value.imageSrc || ''
  const imageFit = value.imageFit || 'cover'
  const videoMode = value.videoMode || 'follow'
  const videoSrc = value.videoSrc || ''
  const importedImages = value.importedImages && Array.isArray(value.importedImages) ? value.importedImages : []
  const importedVideos = value.importedVideos && Array.isArray(value.importedVideos) ? value.importedVideos : []
  const dim = typeof value.dim === 'number' ? Math.min(0.7, Math.max(0, value.dim)) : 0
  const themeAlpha = typeof value.themeAlpha === 'number' ? Math.min(1, Math.max(0, value.themeAlpha)) : 1
  const dialogAlpha = typeof value.dialogAlpha === 'number' ? Math.min(1, Math.max(0, value.dialogAlpha)) : 0

  const btheme = themeById(builtinId)
  const backdrop = isBackdropState(mode, btheme)

  const flash = (text, ok = true) => {
    setToast({ text, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }
  const set = (k, v, fb) => { scope.set(k, v); if (fb) flash(fb) }
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
      fetch('/deep-theme/api/import', {
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
              if (cur.indexOf(url) < 0) scope.set(libKey(kind), cur.concat(url))
            }
            scope.set(activeKey(kind), url)
            flash(kind === 'video' ? '视频已导入并应用' : '图片已导入并应用')
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
    if (value[activeKey(kind)] === target) scope.set(activeKey(kind), lockedDefault(kind))
    fetch('/deep-theme/api/import', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: target }) }).catch(() => {})
    flash(kind === 'video' ? '已删除导入视频，回到默认' : '已删除导入图片，回到默认壁纸')
  }

  const modeOptions = [['builtin', t('modeBuiltin')], ['image', t('modeImage')], ['video', t('modeVideo')]]

  const previewStyle = mode === 'builtin'
    ? (btheme.kind === 'backdrop' ? { backgroundImage: `url(${themeImageUrl(btheme)})` } : { background: btheme.bg })
    : mode === 'image' ? { backgroundImage: imageSrc ? `url(${imageSrc})` : 'none', backgroundSize: imageFit === 'contain' ? 'contain' : 'cover', backgroundPosition: 'center' }
    : { background: '#000' }

  return React.createElement('div', { className: 'dt-panel' },
    React.createElement('style', null, CSS),

    React.createElement('div', { className: 'dt-label' }, t('sectionDesc')),

    // 三态切换
    React.createElement('div', { className: 'dt-seq' },
      modeOptions.map(([v, label]) => React.createElement('button', { key: v, className: mode === v ? 'active' : '', onClick: () => set('mode', v, `已切换：${label}`), 'aria-pressed': mode === v }, label)),
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
            onClick: () => set('builtinId', th.id, '已切换：' + th.name),
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
          React.createElement('button', { className: imageFit === 'cover' ? 'active' : '', onClick: () => set('imageFit', 'cover', t('fitCover')) }, t('fitCover')),
          React.createElement('button', { className: imageFit === 'contain' ? 'active' : '', onClick: () => set('imageFit', 'contain', t('fitContain')) }, t('fitContain')),
        ),
      ),
      React.createElement('div', { className: 'dt-cardgrid' },
        React.createElement('button', { className: 'dt-themecard' + (imageSrc === lockedDefault('image') ? ' active' : ''), onClick: () => set('imageSrc', lockedDefault('image'), '已切换到默认壁纸') },
          React.createElement('div', { className: 'swatch', style: { backgroundImage: `url(${lockedDefault('image')})`, backgroundSize: 'cover', backgroundPosition: 'center' } }),
          React.createElement('div', { className: 'name' }, '默认壁纸（不可删除）'),
          React.createElement('div', { className: 'sub' }, '受保护'),
        ),
        importedImages.map((url) => React.createElement('div', { key: url, role: 'button', tabIndex: 0, className: 'dt-themecard dt-clickable' + (imageSrc === url ? ' active' : ''), onClick: () => set('imageSrc', url, '已切换到：' + skinName(url)) },
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
          React.createElement('button', { className: videoMode === 'follow' ? 'active' : '', onClick: () => set('videoMode', 'follow', t('modeFollow')) }, t('modeFollow')),
          React.createElement('button', { className: videoMode === 'loop' ? 'active' : '', onClick: () => set('videoMode', 'loop', t('modeLoop')) }, t('modeLoop')),
        ),
      ),
      React.createElement('span', { className: 'dt-hint' }, videoMode === 'loop' ? t('modeLoopHint') : t('modeFollowHint')),
      React.createElement('div', { className: 'dt-cardgrid' },
        React.createElement('button', { className: 'dt-themecard' + (videoSrc === lockedDefault('video') ? ' active' : ''), onClick: () => set('videoSrc', lockedDefault('video'), '已切换到默认视频') },
          React.createElement('div', { className: 'swatch', style: { background: 'repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2', fontSize: 20 } }, '🎬'),
          React.createElement('div', { className: 'name' }, '默认视频（不可删除）'),
          React.createElement('div', { className: 'sub' }, '受保护'),
        ),
        BUILTIN_VIDEOS.map((v) => React.createElement('button', {
          key: v.id, className: 'dt-themecard' + (!videoSrc || videoSrc === DEFAULT_VIDEO_SRC ? ' active' : ''), onClick: () => set('videoSrc', DEFAULT_VIDEO_SRC, '已切换：视频 · ' + v.name),
        },
          React.createElement('div', { className: 'swatch', style: { background: 'repeating-linear-gradient(135deg, #1b2230 0 12px, #141b28 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2', fontSize: 20 } }, '🎬'),
          React.createElement('div', { className: 'name' }, v.name),
        )),
        importedVideos.map((url) => React.createElement('div', { key: url, role: 'button', tabIndex: 0, className: 'dt-themecard dt-clickable' + (videoSrc === url ? ' active' : ''), onClick: () => set('videoSrc', url, '已切换到：' + skinName(url)) },
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

    // 背景压暗（蒙层强度滑杆，默认 0 = 不压暗）
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--dsw-alias-border-l1)', paddingTop: 14 } },
      React.createElement('span', { className: 'dt-label' }, t('dimLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 0.7, step: 0.05, value: dim, onChange: (e) => set('dim', parseFloat(e.target.value), t('dimLabel') + '：' + Math.round(e.target.value * 100) + '%') }),
      React.createElement('span', { className: 'dt-hint' }, t('maskHint')),
    ) : null,

    // 主题面板透明可调
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('themeAlphaLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 1, step: 0.05, value: themeAlpha, onChange: (e) => set('themeAlpha', parseFloat(e.target.value), t('themeAlphaLabel') + '：' + Math.round(e.target.value * 100) + '%') }),
      React.createElement('span', { className: 'dt-hint' }, t('themeAlphaHint')),
    ) : null,

    // 对话栏透明可调
    backdrop ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('dialogAlphaLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 1, step: 0.05, value: dialogAlpha, onChange: (e) => set('dialogAlpha', parseFloat(e.target.value), t('dialogAlphaLabel') + '：' + Math.round(e.target.value * 100) + '%') }),
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
      React.createElement('button', { className: 'dt-btn', onClick: () => { const lockImg = lockedDefault('image'); const lockVid = lockedDefault('video'); set('mode', 'image'); set('builtinId', 'deep-space'); set('imageSrc', lockImg); set('imageFit', 'cover'); set('videoMode', 'follow'); set('videoSrc', lockVid); set('importedImages', []); set('importedVideos', []); set('dim', 0); set('themeAlpha', 1); set('dialogAlpha', 0); flash('已恢复默认主题') } }, t('reset')),
      React.createElement('button', { className: 'dt-btn primary', onClick: () => { scope.set('enabled', true); flash('✓ 已应用：' + modeName() + appliedLabel) } }, t('apply')),
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
  ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'deep-theme: locale dictionaries')
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
    'deep-theme: background layer',
  )

  // 设置面板顶层「主题」分区（与「插件」同层）。
  ctx.effect(
    () => ctx.slots.inject('settings.section', () => ctx.slots.register(
      { name: 'settings.section', id: NS, order: 25, label: () => t('nav'), locale: NS, inject: () => common },
      ThemeSettings,
    )),
    'deep-theme: settings section',
  )

  // 侧边栏底部「🎨 主题」按钮 → 主题面板弹窗。
  ctx.effect(
    () => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register(
      { name: 'sidebar.footer.action', id: `${NS}:footer`, order: 100, label: () => t('nav'), locale: NS, inject: () => common },
      (props) => React.createElement(ThemeFooterButton, { ...common, wide: !(props && props.wide === false) }),
    )),
    'deep-theme: sidebar footer action',
  )
}
