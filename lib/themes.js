// 内置主题定义：每个主题 = 一种皮肤形态的配置。
//
// 两类：
//  - kind:'color'     应用配色主题：覆盖 `--dsw-alias-*` token（`{ light, dark }` 对）
//                     并渲染一个渐变背景层，重着色但不改布局。
//  - kind:'backdrop'  内置背景皮肤：显示一张内置图片（透出 + 可选蒙层），如极光星云。
//
// 注意：DSH 的 `theme.overrideTokens` 要求每个 token 的值是 `{ light, dark }`
// 字符串对，裸字符串会抛 TypeError，因此所有 token 都是 `{ light, dark }` 对。

export const ASSET_BASE = '/deep-theme/assets'

export const BUILTIN_THEMES = [
  // ── 应用配色主题（kind: color）──────────────────────────────────────
  {
    id: 'dark',
    name: '深空暗',
    kind: 'color',
    dark: true,
    bg: 'radial-gradient(120% 120% at 50% 0%, #1c2333 0%, #0d1117 55%, #070a10 100%)',
    tokens: {
      '--dsw-alias-bg-base': { light: '#f3f5f9', dark: '#0d1117' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#161c28' },
      '--dsw-alias-bg-layer-2': { light: '#f6f8fc', dark: '#1d2433' },
      '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#12161f' },
      '--dsw-alias-border-l1': { light: '#e2e6ee', dark: '#242c3a' },
      '--dsw-alias-border-l2': { light: '#ccd3df', dark: '#333d4d' },
      '--dsw-specific-sidebar-fill': { light: '#eef1f7', dark: '#10141d' },
    },
  },
  {
    id: 'graphite',
    name: '石墨',
    kind: 'color',
    dark: true,
    bg: 'radial-gradient(120% 120% at 50% 0%, #17181c 0%, #101114 55%, #050507 100%)',
    tokens: {
      '--dsw-alias-bg-base': { light: '#f1f1f3', dark: '#101114' },
      '--dsw-alias-bg-layer-1': { light: '#fafafa', dark: '#1a1b20' },
      '--dsw-alias-bg-layer-2': { light: '#f4f4f6', dark: '#222328' },
      '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#15161a' },
      '--dsw-alias-border-l1': { light: '#e3e3e6', dark: '#2a2b31' },
      '--dsw-alias-border-l2': { light: '#cfcfd6', dark: '#383a42' },
      '--dsw-specific-sidebar-fill': { light: '#eeeef0', dark: '#0c0d10' },
    },
  },
  {
    id: 'light',
    name: '晨光亮',
    kind: 'color',
    dark: false,
    bg: 'radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f3f5f9 55%, #e6eaf1 100%)',
    tokens: {
      '--dsw-alias-bg-base': { light: '#f3f5f9', dark: '#121722' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#1a2230' },
      '--dsw-alias-bg-layer-2': { light: '#f6f8fc', dark: '#212b3c' },
      '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#171e2a' },
      '--dsw-alias-border-l1': { light: '#e2e6ee', dark: '#2a3444' },
      '--dsw-alias-border-l2': { light: '#ccd3df', dark: '#3a465a' },
      '--dsw-specific-sidebar-fill': { light: '#eef1f7', dark: '#131926' },
    },
  },
  {
    id: 'sakura',
    name: '樱粉',
    kind: 'color',
    dark: false,
    bg: 'radial-gradient(120% 120% at 50% 0%, #fff0f3 0%, #fbe3ea 55%, #f2cfd9 100%)',
    tokens: {
      '--dsw-alias-bg-base': { light: '#fbe9ee', dark: '#231722' },
      '--dsw-alias-bg-layer-1': { light: '#fff7f9', dark: '#2d1d29' },
      '--dsw-alias-bg-layer-2': { light: '#fdeff3', dark: '#37212f' },
      '--dsw-alias-bg-overlay': { light: '#fff7f9', dark: '#291a25' },
      '--dsw-alias-border-l1': { light: '#f2d3dc', dark: '#43283a' },
      '--dsw-alias-border-l2': { light: '#e4b6c5', dark: '#55334a' },
      '--dsw-specific-sidebar-fill': { light: '#fbe0e8', dark: '#1f1520' },
    },
  },

  // ── 内置背景皮肤（kind: backdrop，显示一张内置图片）──────────────────
  { id: 'aurora', name: '极光星云', kind: 'backdrop', dark: true, file: 'aurora.png' },
  { id: 'sunset', name: '暮色霞光', kind: 'backdrop', dark: true, file: 'sunset.png' },
  { id: 'deep-space', name: '深空宇宙', kind: 'backdrop', dark: true, file: 'deep-space.png' },
]

export function themeImageUrl(theme) {
  return theme && theme.file ? `${ASSET_BASE}/backgrounds/${theme.file}` : ''
}
export function themeById(id) {
  return BUILTIN_THEMES.find((t) => t.id === id) || BUILTIN_THEMES[0]
}

// 背景皮肤（backdrop / image / video 模式）下，为了让背景尽量「透出来」：主表面
// 只保留很轻的底色（不再压暗成一片蒙层），对话/气泡（layer-1）给中等透明度保证
// 文字可读；**设置/弹窗（bg-overlay）保持完全不透明**，避免设置界面透底看不清。
// 值为 { light, dark } 对。
export function translucentTokens() {
  return {
    '--dsw-alias-bg-base': { light: 'rgba(255, 255, 255, 0)', dark: 'rgba(0, 0, 0, 0)' },
    '--dsw-alias-bg-layer-1': { light: 'rgba(255, 255, 255, 0)', dark: 'rgba(0, 0, 0, 0)' },
    '--dsw-alias-bg-layer-2': { light: 'rgba(255, 255, 255, 0)', dark: 'rgba(0, 0, 0, 0)' },
    '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#0d1117' },
    '--dsw-alias-border-l1': { light: 'rgba(120, 130, 150, 0.35)', dark: 'rgba(120, 130, 150, 0.35)' },
    '--dsw-alias-border-l2': { light: 'rgba(140, 150, 170, 0.45)', dark: 'rgba(140, 150, 170, 0.45)' },
    '--dsw-specific-sidebar-fill': { light: '#eef1f7', dark: '#10141d' },
  }
}

// 内置视频主题预设：目前一份压缩版环绕素材，后续可扩展多套。
export const BUILTIN_VIDEOS = [
  { id: 'orbit', name: '环绕少女', file: 'main-compressed.mp4' },
]

export const DEFAULT_VIDEO_SRC = `${ASSET_BASE}/videos/main-compressed.mp4`

// 默认皮肤：安装即显示一张内置背景（极光星云，kind:backdrop），让用户立刻看到效果。
export const DEFAULT_CONFIG = {
  enabled: true,
  mode: 'builtin',
  builtinId: 'aurora',
  imageSrc: '', // 导入的图片（/deep-theme/assets/imports/*），空 = 未导入
  imageFit: 'cover',
  videoMode: 'follow', // follow（环绕跟随）/ loop（循环播放）
  videoSrc: '', // 导入的视频（/deep-theme/assets/imports/*），空 = 内置环绕少女
  dim: 0, // 背景压暗（蒙层强度），0 = 完全不压暗
}
