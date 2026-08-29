// 内置主题定义：每个主题 = 一种皮肤形态的配置。
//
// 两类：
//  - kind:'color'     应用配色主题：覆盖 `--dsw-alias-*` token（`{ light, dark }` 对）
//                     并渲染一个渐变背景层，重着色但不改布局。
//  - kind:'backdrop'  内置背景皮肤：显示一张内置图片（透出 + 可选蒙层），如极光星云。
//
// 注意：DSH 的 `theme.overrideTokens` 要求每个 token 的值是 `{ light, dark }`
// 字符串对，裸字符串会抛 TypeError，因此所有 token 都是 `{ light, dark }` 对。

export const ASSET_BASE = '/dsh-theme/assets'

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

// ── 内置 3D 场景（kind: '3d'，Three.js 实时渲染，GPU 直出，跟手丝滑）──────────────────
// v0.2.0 起：每个 3D 场景是一个「程序化程序化场景定义」——client 端按 sceneId 实例化对应几何/材质/动画。
// 后续可在此数组增加更多程序化场景，或扩展支持用户 GLTF。
export const BUILTIN_3D = [
  // 暗夜金属人物：基于 default.png 的暗夜金属人物剪影，程序化金属反射角色 + 全景背景纹理。
  {
    id: 'metal-figure',
    name: '暗夜金属',
    kind: '3d',
    dark: true,
    bgTexture: `${ASSET_BASE}/import-images/default.png`, // 场景背景纹理（用户默认壁纸）
  },
  // 未来扩展更多程序化场景（深空、几何、晶体……）
]

export function themeImageUrl(theme) {
  return theme && theme.file ? `${ASSET_BASE}/backgrounds/${theme.file}` : ''
}
export function themeById(id) {
  return BUILTIN_THEMES.find((t) => t.id === id) || BUILTIN_THEMES[0]
}
export function builtin3dById(id) {
  return BUILTIN_3D.find((s) => s.id === id) || BUILTIN_3D[0]
}

// 背景皮肤（backdrop / image / video 模式）下，为了让背景尽量「透出来」：主表面
// 只保留很轻的底色（不再压暗成一片蒙层），对话/气泡（layer-1）给中等透明度保证
// 文字可读；**设置/弹窗（bg-overlay）与侧栏/顶栏（sidebar-fill）保持完全不透明**，
// 不随下面的透明度可调而变（独立背景）。值为 { light, dark } 对。
//
// @param themeAlpha  主题面板/气泡（layer-1/2）不透明度 0-1（0=全透明背景全透，1=实底）
// @param dialogAlpha 对话栏（bg-base）不透明度 0-1
export function translucentTokens(themeAlpha = 0.75, dialogAlpha = 0.8) {
  const la = Math.max(0, Math.min(1, themeAlpha))
  const da = Math.max(0, Math.min(1, dialogAlpha))
  return {
    '--dsw-alias-bg-base': { light: `rgba(248, 250, 253, ${da})`, dark: `rgba(8, 12, 20, ${da})` },
    '--dsw-alias-bg-layer-1': { light: `rgba(255, 255, 255, ${la})`, dark: `rgba(24, 30, 42, ${la})` },
    '--dsw-alias-bg-layer-2': { light: `rgba(255, 255, 255, ${Math.max(0, la - 0.08)})`, dark: `rgba(30, 38, 52, ${Math.max(0, la - 0.08)})` },
    '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#0d1117' },
    // 字体颜色不在此覆盖：由 dsh 通用设置外观（浅色/深色/跟随系统）原生决定，
    // 设置面板与对话文本用 var(--dsw-alias-label-*) 自动跟随。
    '--dsw-alias-border-l1': { light: 'rgba(120, 130, 150, 0.35)', dark: 'rgba(120, 130, 150, 0.35)' },
    '--dsw-alias-border-l2': { light: 'rgba(140, 150, 170, 0.45)', dark: 'rgba(140, 150, 170, 0.45)' },
    '--dsw-specific-sidebar-fill': { light: '#eef1f7', dark: '#10141d' },
  }
}

// 内置视频主题预设：已移除「环绕少女」，默认视频皮肤用 import-videos/default.mp4。
export const BUILTIN_VIDEOS = []

// 受保护的默认皮肤（不可删除）：import-images/default.png 与 import-videos/default.mp4。
export const LOCKED_DEFAULT_IMAGE = `${ASSET_BASE}/import-images/default.png`
export const LOCKED_DEFAULT_VIDEO = `${ASSET_BASE}/import-videos/default.mp4`
// 默认视频（受保护不可删），无独立内置环绕视频。
export const DEFAULT_VIDEO_SRC = LOCKED_DEFAULT_VIDEO
export const LOCKED_SKINS = {
  image: [LOCKED_DEFAULT_IMAGE],
  video: [LOCKED_DEFAULT_VIDEO],
}

// 默认皮肤：安装即显示一张内置背景（极光星云，kind:backdrop），让用户立刻看到效果。
export const DEFAULT_CONFIG = {
  enabled: true,
  mode: 'image',
  builtinId: 'deep-space',
  imageSrc: LOCKED_DEFAULT_IMAGE, // 当前激活图片（受保护默认不可删）
  imageFit: 'cover',
  videoMode: 'follow', // follow（跟随鼠标）/ loop（循环播放，不 seek 流畅）
  videoSrc: LOCKED_DEFAULT_VIDEO, // 当前激活视频（受保护默认不可删）
  threeSceneId: 'metal-figure', // 3D 场景：默认「暗夜金属」人物
  threeInteract: true,
  threeOrbitSpeed: 0.35,
  threePointerRange: 0.4,
  importedImages: [], // 导入的图片库（可删除，不含默认）
  importedVideos: [], // 导入的视频库（可删除，不含默认）
  dim: 0, // 背景压暗（蒙层强度），0 = 完全不压暗
  themeAlpha: 1, // 主题面板/气泡不透明度（用户当前配置）
  dialogAlpha: 0, // 对话栏不透明度（用户当前配置）
}
