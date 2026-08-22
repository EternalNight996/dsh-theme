// 内置主题定义：每个主题 = 一套 `--dsw-alias-*` 主题 token 覆盖 + 背景层 CSS 背景。
// 客户端在 builtin 模式时用 `theme.overrideTokens('deep-theme', tokens)` 落地，
// 并渲染一个独立的背景层 DOM。

// 默认（DSH 原生暗色）基础值，供深色主题作为底色参考。
export const BUILTIN_THEMES = [
  {
    id: 'dark',
    name: '深空暗',
    dark: true,
    bg: 'radial-gradient(120% 120% at 50% 0%, #1c2333 0%, #0d1117 55%, #070a10 100%)',
    tokens: {
      '--dsw-alias-bg-base': '#0d1117',
      '--dsw-alias-bg-layer-1': '#161c28',
      '--dsw-alias-bg-layer-2': '#1d2433',
      '--dsw-alias-bg-overlay': '#12161f',
      '--dsw-alias-border-l1': '#242c3a',
      '--dsw-alias-border-l2': '#333d4d',
      '--dsw-alias-label-primary': '#e7eaf0',
      '--dsw-alias-label-secondary': '#9aa4b2',
      '--dsw-specific-sidebar-fill': '#10141d',
    },
  },
  {
    id: 'graphite',
    name: '石墨',
    dark: true,
    bg: 'radial-gradient(120% 120% at 50% 0%, #17181c 0%, #101114 55%, #050507 100%)',
    tokens: {
      '--dsw-alias-bg-base': '#101114',
      '--dsw-alias-bg-layer-1': '#1a1b20',
      '--dsw-alias-bg-layer-2': '#222328',
      '--dsw-alias-bg-overlay': '#15161a',
      '--dsw-alias-border-l1': '#2a2b31',
      '--dsw-alias-border-l2': '#383a42',
      '--dsw-alias-label-primary': '#e6e7ea',
      '--dsw-alias-label-secondary': '#98999f',
      '--dsw-specific-sidebar-fill': '#0c0d10',
    },
  },
  {
    id: 'light',
    name: '晨光亮',
    dark: false,
    bg: 'radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f3f5f9 55%, #e6eaf1 100%)',
    tokens: {
      '--dsw-alias-bg-base': '#f3f5f9',
      '--dsw-alias-bg-layer-1': '#ffffff',
      '--dsw-alias-bg-layer-2': '#f6f8fc',
      '--dsw-alias-bg-overlay': '#ffffff',
      '--dsw-alias-border-l1': '#e2e6ee',
      '--dsw-alias-border-l2': '#ccd3df',
      '--dsw-alias-label-primary': '#18202c',
      '--dsw-alias-label-secondary': '#56606f',
      '--dsw-specific-sidebar-fill': '#eef1f7',
    },
  },
  {
    id: 'sakura',
    name: '樱粉',
    dark: false,
    bg: 'radial-gradient(120% 120% at 50% 0%, #fff0f3 0%, #fbe3ea 55%, #f2cfd9 100%)',
    tokens: {
      '--dsw-alias-bg-base': '#fbe9ee',
      '--dsw-alias-bg-layer-1': '#fff7f9',
      '--dsw-alias-bg-layer-2': '#fdeff3',
      '--dsw-alias-bg-overlay': '#fff7f9',
      '--dsw-alias-border-l1': '#f2d3dc',
      '--dsw-alias-border-l2': '#e4b6c5',
      '--dsw-alias-label-primary': '#3a2530',
      '--dsw-alias-label-secondary': '#7d5a68',
      '--dsw-specific-sidebar-fill': '#fbe0e8',
    },
  },
]

// 背景皮肤（image / video 模式）下，为了让背景图/视频透出来，把 DSH 的主表面
// 变成「半透明」：文字仍在表面层，配合插件全局遮罩（dt-bg-mask）保证可读。
// 对话框/弹窗（bg-overlay）保持更实，避免深色弹窗看不清。
export function translucentTokens() {
  return {
    '--dsw-alias-bg-base': 'rgba(8, 12, 20, 0.68)',
    '--dsw-alias-bg-layer-1': 'rgba(22, 28, 40, 0.5)',
    '--dsw-alias-bg-layer-2': 'rgba(28, 35, 48, 0.45)',
    '--dsw-alias-bg-overlay': 'rgba(10, 14, 22, 0.86)',
    '--dsw-alias-border-l1': 'rgba(120, 130, 150, 0.4)',
    '--dsw-alias-border-l2': 'rgba(140, 150, 170, 0.5)',
    '--dsw-specific-sidebar-fill': 'rgba(8, 12, 20, 0.62)',
  }
}

// 内置图片皮肤预设：id → assets/backgrounds 下的文件名。
export const BUILTIN_IMAGES = [
  { id: 'aurora', name: '极光星云', file: 'aurora.png' },
  { id: 'sunset', name: '暮色霞光', file: 'sunset.png' },
  { id: 'deep-space', name: '深空宇宙', file: 'deep-space.png' },
]

export const DEFAULT_VIDEO_SRC = '/deep-theme/assets/videos/main-compressed.mp4'
