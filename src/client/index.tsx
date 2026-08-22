// 主题皮肤（client 侧）：背景层 + 设置 → 主题 + 侧边栏「🎨 主题」按钮 + 导入。
//
// - `shell.overlay`：背景层（position: fixed; inset: 0; z-index: -1; pointer-events: none），
//   渲染在页面最底层，不拦截任何交互；通过 theme.overrideTokens 让 DSH 主表面
//   随「内置主题/图片/视频」三态切换明暗或半透明，背景透出。
// - `settings.section`：设置面板顶层「主题」分区（id: deep-theme, order: 25）。
// - `sidebar.footer.action`：侧边栏底部「🎨 主题」按钮（rail 态仅图标）→ 主题面板弹窗。
//
// 所有自定义 UI 用 var(--dsw-alias-*) 主题变量（明暗原生适配，绝不硬编码色值）。

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { BUILTIN_THEMES, BUILTIN_IMAGES, BUILTIN_VIDEOS, DEFAULT_VIDEO_SRC, translucentTokens } from '../../lib/themes.js'

const NS = 'deep-theme'
const SOURCE = 'deep-theme'
const ASSET_BASE = '/deep-theme/assets'

export const inject = ['settingsScope', 'slots', 'locale', 'theme']

// ── CSS（用 --dsw-alias-* 主题变量，明暗原生适配）─────────────────────────
const CSS = `
.dt-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.dt-bg::before { content: ''; position: absolute; inset: 0; background: var(--dsw-alias-bg-base, #0d1117); opacity: 0; transition: opacity 0.4s ease; }
.dt-bg-media, .dt-bg-gradient { position: absolute; inset: 0; }
.dt-bg-gradient { background-size: cover; background-position: center; }
.dt-bg-media img, .dt-bg-media video { width: 100%; height: 100%; object-fit: cover; }
.dt-bg-media.fit-contain img, .dt-bg-media.fit-contain video { object-fit: contain; }
.dt-bg-mask { position: absolute; inset: 0; pointer-events: none; }
.dt-fade { animation: dt-fade-in 0.45s ease-out; }
@keyframes dt-fade-in { from { opacity: 0; } to { opacity: 1; } }

.dt-panel { display: flex; flex-direction: column; gap: 18px; }
.dt-label { font-weight: 600; font-size: 13px; color: var(--dsw-alias-label-primary); }
.dt-hint { font-size: 12px; opacity: 0.65; color: var(--dsw-alias-label-secondary); }
.dt-seq { display: inline-flex; gap: 4px; padding: 3px; border-radius: 999px; background: var(--dsw-alias-bg-base); }
.dt-seq button { border: none; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; padding: 6px 14px; border-radius: 999px; cursor: pointer; }
.dt-seq button.active { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
.dt-cardgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.dt-themecard { border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); border-radius: 12px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; text-align: left; color: var(--dsw-alias-label-primary); }
.dt-themecard.active { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary); }
.dt-themecard .swatch { height: 64px; border-radius: 8px; }
.dt-themecard .name { font-size: 12.5px; font-weight: 600; }
.dt-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dt-btn { border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.dt-btn:hover { background: var(--dsw-alias-bg-layer-1); }
.dt-btn.primary { background: var(--dsw-alias-brand-primary); color: #fff; border-color: transparent; font-weight: 600; }
.dt-slider { width: 100%; accent-color: var(--dsw-alias-brand-primary); }
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
.dt-preview .pmask { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }

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
  sectionTitle: '主题皮肤',
  sectionDesc: '给 DSH Web GUI 换背景：内置主题 / 静态图片 / 动态视频环绕跟随帧。',
  builtinHint: '选择一套应用配色（明暗原生适配，换色不换布局）。',
  importImage: '导入图片',
  importVideo: '导入视频',
  importHint: '支持 png/jpg/webp；视频支持 mp4/webm。导入后写入插件 assets/，重启不丢。',
  fit: '铺满方式',
  fitCover: '铺满 cover',
  fitContain: '完整 contain',
  mask: '文字可读遮罩',
  follow: '鼠标环绕跟随',
  followHint: '鼠标左右移动 → 视频环绕旋转帧（平滑 lerp，跨边界不跳变）。',
  videoFollow: '跟随驱动',
  videoFollowHint: '关闭后视频停在初始朝向（prefers-reduced-motion 下也自动停止）。',
  dimLabel: '背景变暗',
  dimHint: '让界面文字更清晰。',
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
  sectionTitle: 'Theme Skins',
  sectionDesc: 'Change the DSH web GUI background: built-in themes / static image / dynamic 360-follow video.',
  builtinHint: 'Pick an app color scheme (native light/dark; recolors, not relayouts).',
  importImage: 'Import image',
  importVideo: 'Import video',
  importHint: 'png/jpg/webp; video mp4/webm. Stored into the plugin assets/, persists across restarts.',
  fit: 'Fit',
  fitCover: 'Cover',
  fitContain: 'Contain',
  mask: 'Readability mask',
  follow: 'Mouse orbit',
  followHint: 'Move the mouse left/right to orbit the video frames (smooth lerp, no jumps at boundaries).',
  videoFollow: 'Follow drive',
  videoFollowHint: 'Off stops the video at the initial angle (also auto-off under prefers-reduced-motion).',
  dimLabel: 'Dim',
  dimHint: 'Make UI text easier to read.',
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

// 内置图片皮肤 URI。
function builtinImageSrc(id) {
  const preset = BUILTIN_IMAGES.find((p) => p.id === id)
  return preset ? `${ASSET_BASE}/backgrounds/${preset.file}` : ''
}

// 解析当前生效的背景源。
function resolveImageSrc(value) {
  const src = value?.imageSrc || ''
  if (!src) return builtinImageSrc('aurora')
  if (src.startsWith('preset:')) return builtinImageSrc(src.slice(7))
  return src
}

// ── 360 环绕跟随帧（照搬 Character360, meng-you）───────────────────────
function Video360({ src, active }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // prefers-reduced-motion 或跟随关闭：不驱动，停在初始朝向。
    let reduced = false
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { reduced = false }
    if (reduced || !active) return

    const START = (-3 * Math.PI) / 4
    let current = 0.02
    let target = current
    let raf = 0
    let lastSeek = 0
    let lastMove = 0
    const IDLE_MS = 500
    const DURATION = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 5)

    const seekTo = (t) => {
      if (!Number.isFinite(t)) return
      const now = performance.now()
      if (now - lastSeek < 60) return
      if (video.seeking) return
      const next = t * DURATION()
      if (Math.abs(next - video.currentTime) > 0.02) {
        video.currentTime = next
        lastSeek = now
      }
    }
    const step = () => {
      let diff = target - current
      diff -= Math.round(diff) // wrap 到 [-0.5, 0.5]：最短路径，跨 ±π 不跳变
      const done = Math.abs(diff) < 0.004
      current = wrap01(current + diff * 0.14)
      seekTo(current)
      if (done && performance.now() - lastMove > IDLE_MS) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(step)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(step) }
    const onMove = (e) => {
      lastMove = performance.now()
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
      target = wrap01((angle - START) / (2 * Math.PI))
      start()
    }
    const onLoaded = () => {
      seekTo(current)
      if (video.readyState >= 2) {
        video.play().then(() => video.pause()).catch(() => {})
      }
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

  return React.createElement('video', {
    ref: videoRef,
    src,
    muted: true,
    playsInline: true,
    preload: 'auto',
    disablePictureInPicture: true,
    style: { width: '100%', height: '100%', objectFit: 'cover' },
  })
}

// ── 背景层 ────────────────────────────────────────────────────────────────
function BackgroundLayer({ scope, themeService, t }) {
  const snap = useScope(scope)
  const value = snap && snap.value && typeof snap.value === 'object' ? snap.value : null

  const enabled = value ? value.enabled !== false : true
  const mode = value && value.mode ? value.mode : 'builtin'
  const builtinId = value && value.builtinId ? value.builtinId : 'dark'
  const imageSrc = resolveImageSrc(value)
  const imageFit = value && value.imageFit ? value.imageFit : 'cover'
  const imageMask = value ? value.imageMask !== false : true
  const videoSrc = (value && value.videoSrc) || DEFAULT_VIDEO_SRC
  const videoFollow = value ? value.videoFollow !== false : true
  const dim = value && typeof value.dim === 'number' ? Math.min(0.7, Math.max(0, value.dim)) : 0.35

  const theme = BUILTIN_THEMES.find((x) => x.id === builtinId) || BUILTIN_THEMES[0]

  // 主题 token 覆盖：builtin 用主题色（不透明），image/video 用半透明让背景透出。
  useEffect(() => {
    if (!themeService || typeof themeService.overrideTokens !== 'function') return
    const tokens = !enabled ? null : (mode === 'builtin' ? (theme.tokens || {}) : translucentTokens())
    if (!tokens) return
    const dispose = themeService.overrideTokens(SOURCE, tokens)
    return dispose
  }, [themeService, enabled, mode, builtinId])

  if (!enabled) return null

  // 预览内容（设置面板里的小预览也复用这个渲染）
  const renderMedia = (forPreview) => {
    if (mode === 'builtin') {
      return React.createElement('div', { className: 'dt-bg-gradient', style: { background: theme.bg } })
    }
    if (mode === 'image') {
      return React.createElement('img', { src: imageSrc, alt: '', ariaHidden: true, style: { objectFit: imageFit } })
    }
    return React.createElement(Video360, { src: videoSrc, active: videoFollow })
  }

  const mediaWrap = React.createElement(
    'div',
    { className: 'dt-bg-media' + (mode === 'image' && imageFit === 'contain' ? ' fit-contain' : '') },
    renderMedia(),
  )

  const mask = mode !== 'builtin'
    ? React.createElement('div', { className: 'dt-bg-mask', style: { background: `rgba(0,0,0,${dim})` } })
    : null

  return createPortal(
    React.createElement('div', { className: 'dt-bg dt-fade' },
      React.createElement('style', null, CSS),
      mediaWrap,
      mask,
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

  useEffect(() => { if (value && !ready) setReady(true) }, [value, ready])
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  if (!value || !ready) return React.createElement('div', { style: { padding: 16, opacity: 0.6 } }, t('loading'))

  const mode = value.mode || 'builtin'
  const builtinId = value.builtinId || 'dark'
  const imageFit = value.imageFit || 'cover'
  const imageMask = value.imageMask !== false
  const videoFollow = value.videoFollow !== false
  const dim = typeof value.dim === 'number' ? value.dim : 0.35

  // 任一动作都给出可见回馈（toast），避免「点了没反应」。
  const flash = (text, ok = true) => {
    setToast({ text, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }
  const set = (k, v, fb) => { scope.set(k, v); if (fb) flash(fb) }
  const modeName = () => mode === 'builtin' ? t('modeBuiltin') : mode === 'image' ? t('modeImage') : t('modeVideo')
  const currentImageName = value.imageSrc && value.imageSrc.startsWith('preset:')
    ? ((BUILTIN_IMAGES.find((x) => 'preset:' + x.id === value.imageSrc) || {}).name || '')
    : ''
  const appliedLabel = mode === 'builtin'
    ? ' · ' + ((BUILTIN_THEMES.find((x) => x.id === builtinId) || {}).name || '')
    : mode === 'image' ? ' · ' + (currentImageName || '自定义') : mode === 'video' ? ' · 环绕跟随' : ''
  const previewSrc = mode === 'image'
    ? resolveImageSrc(value)
    : mode === 'video' ? ((value.videoSrc) || DEFAULT_VIDEO_SRC) : ''

  // 导入图片/视频：读为 data URL → 交给 host 写入插件 assets，返回持久化 URL。
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
            scope.set(kind === 'video' ? 'videoSrc' : 'imageSrc', res.url)
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

  const modeOptions = [['builtin', t('modeBuiltin')], ['image', t('modeImage')], ['video', t('modeVideo')]]

  const previewStyle = mode === 'builtin'
    ? { background: (BUILTIN_THEMES.find((x) => x.id === builtinId) || BUILTIN_THEMES[0]).bg, backgroundSize: 'cover', backgroundPosition: 'center' }
    : mode === 'image' ? { backgroundImage: `url(${previewSrc})`, backgroundSize: imageFit === 'contain' ? 'contain' : 'cover', backgroundPosition: 'center' }
    : { background: '#000' }

  return React.createElement('div', { className: 'dt-panel' },
    React.createElement('style', null, CSS),

    React.createElement('div', { className: 'dt-label' }, t('sectionDesc')),

    // 三态切换
    React.createElement('div', { className: 'dt-seq' },
      modeOptions.map(([v, label]) => React.createElement('button', {
        key: v, className: mode === v ? 'active' : '', onClick: () => set('mode', v, `已切换：${label}`), 'aria-pressed': mode === v,
      }, label)),
    ),

    // 内置主题
    mode === 'builtin' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('span', { className: 'dt-hint' }, t('builtinHint')),
      React.createElement('div', { className: 'dt-cardgrid' },
        BUILTIN_THEMES.map((th) => React.createElement('button', {
          key: th.id, className: 'dt-themecard' + (builtinId === th.id ? ' active' : ''), onClick: () => set('builtinId', th.id, '已切换：内置 · ' + th.name),
        },
          React.createElement('div', { className: 'swatch', style: { background: th.bg, backgroundSize: 'cover', backgroundPosition: 'center' } }),
          React.createElement('div', { className: 'name' }, th.name),
        )),
      ),
    ) : null,

    // 图片皮肤
    mode === 'image' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { className: 'dt-cardgrid' },
        BUILTIN_IMAGES.map((img) => React.createElement('button', {
          key: img.id, className: 'dt-themecard' + (!value.imageSrc || value.imageSrc === 'preset:' + img.id || value.imageSrc === builtinImageSrc(img.id) ? ' active' : ''), onClick: () => set('imageSrc', 'preset:' + img.id, '已切换：壁纸 · ' + img.name),
        },
          React.createElement('div', { className: 'swatch', style: { backgroundImage: `url(${builtinImageSrc(img.id)})`, backgroundSize: 'cover', backgroundPosition: 'center' } }),
          React.createElement('div', { className: 'name' }, img.name),
        )),
      ),
      React.createElement('label', { className: 'dt-btn primary', style: { alignSelf: 'flex-start', cursor: 'pointer' } },
        t('importImage'),
        React.createElement('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', style: { display: 'none' }, onChange: (e) => { onImport('image', e.target.files && e.target.files[0]); e.target.value = '' } }),
      ),
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-hint' }, t('fit')),
        React.createElement('div', { className: 'dt-seq' },
          React.createElement('button', { className: imageFit === 'cover' ? 'active' : '', onClick: () => set('imageFit', 'cover', '铺满方式：cover') }, t('fitCover')),
          React.createElement('button', { className: imageFit === 'contain' ? 'active' : '', onClick: () => set('imageFit', 'contain', '铺满方式：contain') }, t('fitContain')),
        ),
      ),
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-hint' }, t('mask')),
        React.createElement('button', { className: 'dt-btn', onClick: () => set('imageMask', !imageMask, t('mask') + '：' + (!imageMask ? '开' : '关')), 'aria-pressed': imageMask }, imageMask ? '开' : '关'),
      ),
    ) : null,

    // 视频皮肤
    mode === 'video' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { className: 'dt-cardgrid' },
        BUILTIN_VIDEOS.map((v) => React.createElement('button', {
          key: v.id, className: 'dt-themecard' + (!value.videoSrc ? ' active' : ''), onClick: () => set('videoSrc', '', '已切换：视频 · ' + v.name),
        },
          React.createElement('div', { className: 'swatch', style: { background: 'repeating-linear-gradient(135deg, #1b2230 0 10px, #141b28 10px 20px)' } }),
          React.createElement('div', { className: 'name' }, '🎬 ' + v.name),
        )),
      ),
      React.createElement('div', { className: 'dt-row' },
        React.createElement('span', { className: 'dt-hint' }, t('followHint')),
        React.createElement('button', { className: 'dt-btn', onClick: () => set('videoFollow', !videoFollow, t('videoFollow') + '：' + (!videoFollow ? '开' : '关')), 'aria-pressed': videoFollow }, videoFollow ? '开' : '关'),
      ),
      React.createElement('label', { className: 'dt-btn primary', style: { alignSelf: 'flex-start', cursor: 'pointer' } },
        t('importVideo'),
        React.createElement('input', { type: 'file', accept: 'video/mp4,video/webm', style: { display: 'none' }, onChange: (e) => { onImport('video', e.target.files && e.target.files[0]); e.target.value = '' } }),
      ),
      React.createElement('span', { className: 'dt-hint' }, '默认：main-compressed.mp4（1080p 压缩版环绕素材，鼠标左右滑动环绕跟随）'),
    ) : null,

    // 通用：变暗 + 预览
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('dimLabel')),
      React.createElement('input', { className: 'dt-slider', type: 'range', min: 0, max: 0.7, step: 0.05, value: dim, onChange: (e) => set('dim', parseFloat(e.target.value)) }),
      React.createElement('span', { className: 'dt-hint' }, t('dimHint')),
    ),

    mode !== 'builtin' ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      React.createElement('span', { className: 'dt-label' }, t('preview')),
      React.createElement('div', { className: 'dt-preview' },
        React.createElement('div', { className: 'pbg', style: previewStyle }),
        mode !== 'builtin' ? React.createElement('div', { className: 'pmask', style: { background: `rgba(0,0,0,${dim})` } }) : null,
      ),
    ) : null,

    React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' } },
      React.createElement('button', { className: 'dt-btn', onClick: () => { set('mode', 'image'); set('builtinId', 'dark'); set('imageSrc', 'preset:aurora'); set('imageFit', 'cover'); set('imageMask', true); set('videoSrc', ''); set('videoFollow', true); set('dim', 0.35); flash('已恢复默认：极光星云壁纸') } }, t('reset')),
      React.createElement('button', { className: 'dt-btn primary', onClick: () => { scope.set('enabled', true); flash('✓ 已应用：' + modeName() + appliedLabel) } }, t('apply')),
    ),

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
  return React.createElement('div', { className: 'dt-panel', style: { padding: 16, maxWidth: 640 } },
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
