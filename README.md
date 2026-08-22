# dsh-ui-deep-theme 主题皮肤

> 🎨 **给 DeepSeek Harness 的 Web GUI 换背景**：内置主题 / 静态图片 / 动态视频（鼠标环绕跟随帧）三种皮肤形态，侧边栏底部一键切换，设置页完整管理。**一条命令安装，不改 dsh 源码。**

---

## 🖼 效果预览

<p align="center">
  <img src="assets/screen/theme-dark.png" width="720" alt="暗色 + 极光图片皮肤 + 设置 → 主题" />
  <br/>
  <em>暗色模式 + 「极光星云」图片皮肤：背景透出，界面文字/控件自动加遮罩保证可读</em>
</p>

<p align="center">
  <img src="assets/screen/theme-light.png" width="720" alt="亮色内置主题 + 设置 → 主题" />
  <br/>
  <em>亮色内置主题（晨光亮） + 设置 → 主题 面板：内置列表 / 导入图片视频 / 预览</em>
</p>

---

## 🚀 安装

```bash
# 已发布后（npm）
npx @deepseek-ai/dsh plugin --profile web add dsh-ui-deep-theme

# 从 GitHub
npx @deepseek-ai/dsh plugin --profile web add github:EternalNight996/dsh-ui-deep-theme

# 本地联调（link 本地目录，改代码即时生效）
npx @deepseek-ai/dsh plugin --profile web add F:/MyApp/eternal/dsh-theme
```

装完**重启 dsh web**：侧边栏底部出现「🎨 主题」按钮，设置页出现顶层「主题」分区。**默认已显示「极光星云」壁纸**，可随时切换到视频环绕或内置主题。

> 每次点选（模式/主题/壁纸/视频/导入/启用）都会弹出✓回馈提示，不会「点了没反应」。

---

## ✨ 功能

### 三种皮肤形态（互斥启用）

| 形态 | 说明 |
| --- | --- |
| **内置主题** | **应用配色**4 套（深空暗 / 石墨 / 晨光亮 / 樱粉）+ **内置背景皮肤**3 张（极光星云 / 暮色霞光 / 深空宇宙，**默认即极光星云**），统一在「内置主题」里选 |
| **图片皮肤** | 导入本地图（png/jpg/webp），持久化到插件 `assets/imports/`，支持删除 |
| **视频皮肤** | **跟随鼠标**（环绕跟随帧）/ **循环播放**（autoplay loop）两类；内置「环绕少女」+ 导入视频（mp4/webm，持久化 + 可删除） |

> **蒙层默认不加**：图片/视频/内置背景皮肤都提供「蒙层」开关（默认关），开启后按蒙层强度压暗背景提升文字可读性。

### 🎥 视频皮肤 · 两种模式

- **跟随鼠标**：鼠标横向位置 → 视频 `currentTime`，绕屏幕中心转一圈角色随之转向；`rAF` 里对归一化时间做**最短路径 lerp**（wrap 到 `[-0.5, 0.5]`），跨 ±π 边界不跳变；目标时差足够大才真正 seek（~16Hz + 位移阈值），1080p 不卡顿；`prefers-reduced-motion` 下停在初始朝向
- **循环播放**：自动循环播放的纯背景视频
- 背景层 `pointer-events: none`，**绝不拦截任何交互**；mousemove 挂在 window

### 导入 · 持久化 · 删除

- 导入的图片/视频提交给 host → 写入插件 `assets/imports/` 并返回可持久化 URL（存进设置命名空间），**重启不丢**
- 「图片皮肤」/「视频皮肤」有**删除按钮**：清除引用并删除 `assets/imports/` 下对应文件

### 入口

- **侧边栏底部**「🎨 主题」按钮（rail 窄条态仅图标）→ 主题面板弹窗（快切 / 导入 / 预览）
- **设置 → 主题** 顶层分区（id: `deep-theme`, order: 25）
- 当前主题持久化到 `deep-theme` 设置命名空间，**重启保留**
- 全部自定义 UI 用 `var(--dsw-alias-*)`，明暗原生适配

---

## 📁 目录结构

```
dsh-ui-deep-theme/
├── index.js              # host 插件：settings 命名空间 + 静态资源 + 导入持久化
├── lib/
│   ├── client.js         # client bundle（构建产物，__ModuleLoader__ 格式）
│   └── themes.js         # 内置主题定义（token / 背景色 / 预设图）
├── src/
│   └── client/index.tsx  # client 源码：背景层 + 设置分区 + footer 按钮 + 360 跟随
├── assets/
│   ├── backgrounds/      # 内置默认图片（aurora / sunset / deep-space）
│   ├── videos/
│   │   └── main-compressed.mp4  # 默认视频（拷贝自 meng-you，1080p 压缩版）
│   └── imports/          # 用户导入的图片/视频（运行时写入）
├── cordis.patch.yml      # bundle 补丁层（host 行，安装自动挂载）
├── build.mjs             # esbuild 构建脚本（TSX → lib/client.js）
├── scripts/gen-bgs.ps1   # 内置背景图生成脚本
├── package.json          # dsh.client + dsh.bundle.patch 清单
└── README.md
```

---

## 🛠 开发 / 构建

```bash
npm install
npm run build        # 只改 client（src/client）时需要
npm run gen:bg       # 重新生成内置背景图
# 改 index.js / lib/themes.js 无需构建，重启即生效
```

## 🗺 待办 / 路线图

- [ ] **更多内置视频/图片素材**：提供多套环绕素材与抽象背景
- [ ] **按会话/工作区记忆主题**：不同会话记住各自主题
- [ ] **自定义 CSS 主题**：导入/导出完整主题 token 方案
- [ ] **动效强度分级**：除 `prefers-reduced-motion` 外提供手动档位

## 📄 License

MIT

---

> 换上喜欢的背景，让 DSH 每天都不一样。🎨
