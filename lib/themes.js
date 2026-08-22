// 内置主题定义：每个主题 = 一套 `--dsw-alias-*` 主题 token 覆盖 + 背景层 CSS 背景。
//
// 注意：DSH 的 `theme.overrideTokens` 要求每个 token 的值是 `{ light, dark }`
// 字符串对（同一 token 在明暗两种配色下各给一个值），传入裸字符串会抛 TypeError。
// 因此本文件所有 token 都写成 `{ light, dark }` 对。

// 内置「应用配色」主题：token 对按当前配色给合适颜色（dark 给暗、light 给亮），
// 保证明暗原生适配、文字永远可读；主题的身份主要来自背景层渐变 + 微妙的底色。
export const BUILTIN_THEMES = [
  {
    id: 'dark',
    name: '深空暗',
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
]

// 背景皮肤（image / video 模式）下，为了让背景图/视频透出来，把 DSH 的主表面
// 变成「半透明」：文字仍在表面层，配合插件全局遮罩（dt-bg-mask）保证可读。
// 对话框/弹窗（bg-overlay）保持更实，避免深色弹窗看不清。值为 { light, dark } 对。
export function translucentTokens() {
  return {
    '--dsw-alias-bg-base': { light: 'rgba(248, 250, 253, 0.55)', dark: 'rgba(8, 12, 20, 0.68)' },
    '--dsw-alias-bg-layer-1': { light: 'rgba(255, 255, 255, 0.5)', dark: 'rgba(22, 28, 40, 0.5)' },
    '--dsw-alias-bg-layer-2': { light: 'rgba(255, 255, 255, 0.42)', dark: 'rgba(28, 35, 48, 0.45)' },
    '--dsw-alias-bg-overlay': { light: 'rgba(255, 255, 255, 0.92)', dark: 'rgba(10, 14, 22, 0.86)' },
    '--dsw-alias-border-l1': { light: 'rgba(120, 130, 150, 0.4)', dark: 'rgba(120, 130, 150, 0.4)' },
    '--dsw-alias-border-l2': { light: 'rgba(140, 150, 170, 0.5)', dark: 'rgba(140, 150, 170, 0.5)' },
    '--dsw-specific-sidebar-fill': { light: 'rgba(240, 244, 250, 0.5)', dark: 'rgba(8, 12, 20, 0.62)' },
  }
}

// 内置图片皮肤预设：id → assets/backgrounds 下的文件名。
export const BUILTIN_IMAGES = [
  { id: 'aurora', name: '极光星云', file: 'aurora.png' },
  { id: 'sunset', name: '暮色霞光', file: 'sunset.png' },
  { id: 'deep-space', name: '深空宇宙', file: 'deep-space.png' },
]

// 内置视频主题预设：目前一份压缩版环绕素材，后续可扩展多套。
export const BUILTIN_VIDEOS = [
  { id: 'orbit', name: '环绕少女', file: 'main-compressed.mp4' },
]

export const DEFAULT_VIDEO_SRC = '/deep-theme/assets/videos/main-compressed.mp4'

// 默认皮肤：安装即显示一张内置壁纸（极光星云），让用户立刻看到效果；
// 可切换「内置主题 / 图片 / 视频」三态。
export const DEFAULT_CONFIG = {
  enabled: true,
  mode: 'image',
  builtinId: 'dark',
  imageSrc: 'preset:aurora',
  imageFit: 'cover',
  imageMask: true,
  videoSrc: '',
  videoFollow: true,
  dim: 0.35,
}
