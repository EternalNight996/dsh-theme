# dsh-theme · DeepSeek Harness 主题皮肤

> 🎨 **给 DeepSeek Harness 的 Web GUI 换背景**：内置主题 / 静态图片 / 动态视频（鼠标环绕跟随帧）三种皮肤形态，侧边栏底部一键切换，设置页完整管理。**一条命令安装，不改 dsh 源码。**
>
> 🎨 **Give the DeepSeek Harness web GUI a new look**: built-in themes / static image / dynamic 360°-follow video, one-click switch from the sidebar, full management in Settings. **One command to install; no dsh source changes.**

---

## 🖼 效果预览 / Preview

<p align="center">
  <img src="docs/screen/dsh-theme.gif" width="720" alt="主题皮肤演示 GIF" />
  <br/>
  <em>主题皮肤演示：内置主题 / 图片 / 视频环绕跟随 / 侧边栏「🎨 主题」按钮 / 导入</em>
  <br/>
  <em>Demo: built-in themes / image / 360°-follow video / sidebar 🎨 button / import</em>
</p>

<p align="center">
  <img src="docs/screen/dsh-desktop.png" width="720" alt="桌面效果截图" />
  <br/>
  <em>桌面实拍：背景透出 + 主题面板 + 明暗适配</em>
  <br/>
  <em>Desktop screenshot: background showing through + theme panel + light/dark</em>
</p>

---

## 🚀 安装 / Install

```bash
# 已发布后（npm）
dsh plugin --profile web add dsh-theme

# 从 GitHub
dsh plugin --profile web add github:EternalNight996/dsh-theme

# 本地联调（link 本地目录）
dsh plugin --profile web add F:/MyApp/eternal/dsh-theme
```

装完**重启 dsh web**：侧边栏底部出现「🎨 主题」按钮，设置页出现顶层「主题」分区，默认已显示默认壁纸。

After install **restart dsh web**: a 🎨 Theme button appears at the sidebar foot and a top-level "Theme" section appears in Settings (default wallpaper shown by default).

---

## ✨ 功能 / Features

### 三种皮肤形态（互斥）/ Three skin modes (mutually exclusive)

| 形态 / Mode | 说明 / Description |
| --- | --- |
| **内置主题 / Built-in** | **应用配色**4 套（深空暗 / 石墨 / 晨光亮 / 樱粉）+ **背景皮肤**（极光星云等），统一在此选择。4 app color schemes + backdrop skins (aurora etc.) |
| **图片皮肤 / Image** | 导入本地图片（png/jpg/webp），持久化到 `assets/import-images/`，**以文件名命名（≤15 字）**，支持删除。Import png/jpg/webp, persisted, named by filename (≤15 chars), deletable |
| **视频皮肤 / Video** | **跟随鼠标**（360° 环绕跟随帧）/ **循环播放**两类；默认 `import-videos/default.mp4`，导入视频持久化 + 可删除。Follow-mouse 360° orbit / loop; default `default.mp4`, import persisted + deletable |

### 🎥 视频皮肤 · 两种模式 / Video · two modes

- **跟随鼠标**：鼠标横向位置 → 视频 `currentTime`，`rAF` 最短路径 lerp（跨 ±π 不跳变），节流 seek + 阈值，1080p 不卡顿；`prefers-reduced-motion` 下停帧。Mouse-follow: currentTime via shortest-path lerp, throttled seeks, no stutter; stops under reduced-motion.
- **循环播放**：自动循环纯背景。Autoplay looping background.
- 背景层 `pointer-events: none`，不拦截交互。Background layer never intercepts interaction.

### 受保护默认皮肤 / Protected default skins
- `import-images/default.png` 与 `import-videos/default.mp4` 为**默认皮肤，不可删除**。`default.png` / `default.mp4` are non-deletable defaults.

### 透明可调 / Adjustable transparency
- 「主题面板透明」「对话栏透明」「背景压暗」滑杆独立可调；设置/侧栏/顶栏保持独立实底。Sliders for panel/dialog transparency & dim; settings/sidebar/topbar stay solid independently.

### 入口 / Entry points
- 侧边栏底部「🎨 主题」按钮（rail 窄条态仅图标）→ 主题面板弹窗。Sidebar footer 🎨 button (rail shows icon only) → theme panel.
- **设置 → 主题** 顶层分区（id `deep-theme`, order 25）。Settings → Theme (top-level).
- 当前主题持久化到 `deep-theme` 命名空间，重启保留。Persisted in `deep-theme`, survives restart.
- 全部 UI 用 `var(--dsw-alias-*)`，明暗自适应。All UI uses `var(--dsw-alias-*)`, light/dark native.

---

## 🛠 构建 / Build

> 安装后可改前端源码并重新构建。

```bash
npm install
npm run build        # 只改 client（src/client）时需要
npm run gen:bg       # 重新生成内置背景图（可选）
# 改 index.js / lib/themes.js 无需构建，重启即生效
```

---

## 📜 日志更新 / Changelog

- **v0.1.0** 初始主题皮肤插件：背景层 + 设置 → 主题 + 侧边栏「🎨 主题」按钮；三种皮肤形态（内置主题 / 图片 / 视频环绕跟随）。Initial plugin: background layer, Settings → Theme, sidebar 🎨 button; three skin modes.
- **v0.1.1+** 视频**两种模式**（跟随鼠标 / 循环播放）；**蒙层/透明可调**（主题面板、对话栏、背景压暗）；导入图片/视频**持久化** + 两步删除；字体/按钮颜色**随 DSH 通用外观适配**；跟随鼠标**性能优化**（seek 节流 / 后台暂停 / 空闲停帧）。Video two modes; adjustable mask/transparency; import persistence + two-step delete; font/buttons adapt to DSH appearance; follow-mouse perf.
- **v0.1.2+** 导入**库**（多张新增/删除）、**default.png/default.mp4 默认皮肤不可删**、导入图片/视频按类型存入 `import-images` / `import-videos`、导入皮肤以**文件名命名（≤15 字）**、移除内置环绕少女。Import library (multi add/delete), protected default skins, per-type import dirs, filename-named skins, removed built-in orbit video.

---

## 🗺 待办 / Roadmap

- [ ] **导入记录/最近使用**：最近导入的皮肤排序与最近使用标签。Recent-imports ordering & "recently used" badge.
- [ ] **多语言**：界面 i18n（当前中英词条，补充更多语言）。i18n for the panel (en/zh now, more later).
- [ ] **按会话记忆主题**：不同工作区记住各自主题。Per-workspace theme memory.
- [ ] **自定义 CSS 主题**：导入/导出完整主题 token 方案。Import/export custom token themes.
- [ ] **动效强度分级**：除 `prefers-reduced-motion` 外提供手动档位。Manual motion-strength level.
- [ ] **拖拽上传**：拖拽图片/视频到面板即可导入。Drag-and-drop import.
- [ ] **视频帧预览**：跟随鼠标模式显示实时帧缩略图。Live frame thumbnail preview in follow mode.

---

## 📄 License

MIT

---

> 换上喜欢的背景，让 DSH 每天都不一样。🎨
> Give DSH a background you love, so it feels different every day.
