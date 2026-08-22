<p align="center">
  <img src="docs/screen/dsh-theme.gif" width="720" alt="dsh-theme 主题皮肤演示" />
</p>

<div align="center">
  <h1 align="center">@eternalnight/dsh-theme</h1>
  <p><strong>DeepSeek Harness 主题皮肤插件</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/@eternalnight/dsh-theme"><img src="https://img.shields.io/npm/v/@eternalnight/dsh-theme?style=flat-square" alt="npm version" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" /></a>
    <a href="https://github.com/EternalNight996/dsh-theme"><img src="https://img.shields.io/badge/GitHub-dsh%20plugin-blue?style=flat-square" alt="GitHub" /></a>
  </p>
  <p><strong>简体中文</strong> | <a href="README.en.md">English</a></p>
  <p>🎨 给 DeepSeek Harness 的 Web GUI 换背景：内置主题 / 静态图片 / 动态视频（鼠标环绕跟随帧）三种皮肤形态，侧边栏底部一键切换，设置页完整管理。<strong>一条命令安装，不改 dsh 源码。</strong></p>
</div>

<p align="center">
  <img src="docs/screen/dsh-desktop.png" width="720" alt="桌面效果截图" />
  <br/>
  <em>桌面实拍：背景透出 + 主题面板 + 明暗适配</em>
</p>

---

## 🚀 安装

```bash
# 已发布后（npm）
dsh plugin --profile web add @eternalnight/dsh-theme

# 从 GitHub
dsh plugin --profile web add github:EternalNight996/dsh-theme

# 本地联调（link 本地目录）
dsh plugin --profile web add F:/MyApp/eternal/dsh-theme
```

装完**重启 dsh web**：侧边栏底部出现「🎨 主题」按钮，设置页出现顶层「主题」分区，默认已显示默认壁纸。

---

## ✨ 功能

### 三种皮肤形态（互斥）

| 形态 | 说明 |
| --- | --- |
| **内置主题** | **应用配色**4 套（深空暗 / 石墨 / 晨光亮 / 樱粉）+ **背景皮肤**（极光星云等），统一在此选择 |
| **图片皮肤** | 导入本地图片（png/jpg/webp），持久化到 `assets/import-images/`，**以文件名命名（≤15 字）**，支持删除 |
| **视频皮肤** | **跟随鼠标**（360° 环绕跟随帧）/ **循环播放**两类；默认 `import-videos/default.mp4`，导入视频持久化 + 可删除 |

### 🎥 视频皮肤 · 两种模式

- **跟随鼠标**：鼠标横向位置 → 视频 `currentTime`，`rAF` 最短路径 lerp（跨 ±π 不跳变），节流 seek + 阈值，1080p 不卡顿；`prefers-reduced-motion` 下停帧。
- **循环播放**：自动循环纯背景。
- 背景层 `pointer-events: none`，不拦截交互。

### 受保护默认皮肤

- `import-images/default.png` 与 `import-videos/default.mp4` 为**默认皮肤，不可删除**。

### 透明可调

- 「主题面板透明」「对话栏透明」「背景压暗」滑杆独立可调；设置/侧栏/顶栏保持独立实底。

### 入口

- 侧边栏底部「🎨 主题」按钮（rail 窄条态仅图标）→ 主题面板弹窗。
- **设置 → 主题** 顶层分区（id `dsh-theme`, order 25）。
- 当前主题持久化到 `dsh-theme` 命名空间，重启保留。
- 全部 UI 用 `var(--dsw-alias-*)`，明暗自适应。

---

## 🛠 构建

> 安装后可改前端源码并重新构建。

```bash
npm install
npm run build        # 只改 client（src/client）时需要
npm run gen:bg       # 重新生成内置背景图（可选）
# 改 index.js / lib/themes.js 无需构建，重启即生效
```

---

## 📜 日志更新

- **v0.1.2** 中英分文件：`README.md`（中文）与 `README.en.md`（英文）分离，顶部语言切换。
- **v0.1.1** README 重构：MVCheck 式居中横幅 + badge 徽章 + 中英分文件 + 展示素材前置 + 待办 + 日志；插件市场收录达标（GitHub 打 `dsh-plugin` 等 topics）。
- **v0.1.0** 初始发布：背景层 + 设置 → 主题 + 侧边栏「🎨 主题」按钮；三种皮肤形态（内置主题 / 图片 / 视频环绕跟随）；视频**跟随鼠标**（360° 环绕跟随帧）与**循环播放**两类；**透明可调**（主题面板 / 对话栏 / 背景压暗）；导入图片/视频**持久化**到 `import-images` / `import-videos` + 两步删除；**default.png / default.mp4 默认皮肤不可删**；导入皮肤以**文件名命名（≤15 字）**；字体/按钮颜色随 DSH 外观适配；跟随鼠标性能优化（seek 节流 / 后台暂停 / 空闲停帧）。

---

## 🗺 待办 / 路线图

- [ ] **导入记录/最近使用**：最近导入的皮肤排序与最近使用标签。
- [ ] **多语言**：界面 i18n（当前中英词条，补充更多语言）。
- [ ] **按会话记忆主题**：不同工作区记住各自主题。
- [ ] **自定义 CSS 主题**：导入/导出完整主题 token 方案。
- [ ] **动效强度分级**：除 `prefers-reduced-motion` 外提供手动档位。
- [ ] **拖拽上传**：拖拽图片/视频到面板即可导入。
- [ ] **视频帧预览**：跟随鼠标模式显示实时帧缩略图。

---

## 📄 License

MIT

---

> 换上喜欢的背景，让 DSH 每天都不一样。🎨
