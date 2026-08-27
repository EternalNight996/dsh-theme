# 发布到插件市场（npm + GitHub）指南

参考 [dsh-ui-three-body](https://github.com/EternalNight996/dsh-ui-three-body) 与 [dsh-ui-agents-pixe](https://github.com/EternalNight996/dsh-ui-agents-pixe) 的发布范式整理。本插件已按范式配置好，按下述顺序走即可。

---

## 1. 配置核对（已达成）

`package.json` 已具备市场收录所需关键字段：

- `name`: `@eternalnight/dsh-theme`，version `0.1.0`（`dsh-theme` 已被他人占用）
- `files` 白名单：`index.js`、`lib`、`assets`、`docs`、`cordis.patch.yml`、`README.md`、`PUBLISH.md`、`LICENSE`
- `keywords`: 含 `dsh-plugin`（+ `deepseek-harness`、`dsh`、`theme`、`skin`、`background`、`wallpaper`）
- `repository` / `homepage` / `author` / `license`(MIT) / `publishConfig.registry`
- `dsh.client`: `platform: web` + `inject`（运行时自动挂载）
- `dsh.bundle.patch`: `./cordis.patch.yml`（host 行自动挂载）
- `scripts.prepublishOnly`: `node build.mjs`（发布前自动构建 client）

## 2. 本地先验证（发布前必做）

```bash
npm install
npm run build                 # 生成 lib/client.js
dsh plugin --profile web add F:/absolute/path/to/dsh-theme
# 重启 dsh web：设置 → 主题；侧边栏底部「🎨 主题」
```

## 3. 上传 GitHub

```bash
cd dsh-theme
git init
git add .
git commit -m "feat: 初始主题皮肤插件"
git remote add origin https://github.com/EternalNight996/dsh-theme.git
git remote add gitee https://gitee.com/EternalNight996/dsh-theme.git
git branch -M main
git push -u origin main
git push -u gitee main
```

**关键一步**：在 GitHub 仓库页 → 🏷 Topics 添加 `dsh-plugin`（再加 `deepseek-harness`、`dsh`）。

## 4. 上传 npm

```bash
npm login
npm publish --registry=https://registry.npmjs.org/
```

发布成功后：`dsh plugin --profile web add @eternalnight/dsh-theme`

> 注意：本机 `npm config get registry` 可能是镜像（如 npmmirror），发布务必用
> `--registry=https://registry.npmjs.org/` 或改回官方源，避免误发镜像。

## 4.5 git 安装管路必配（防「每次安装各式各样问题」）

若用户以 git 源安装（`github:EternalNight996/dsh-theme` 或 `git+https://...git`），且反复出现
启动失败/版本错乱，**90% 是 profile 的 `pnpm-workspace.yaml` 没随新版更新**，与插件代码无关。
请让用户确认下述 3 项（均在 `~/.dsh/profiles/<profile>/pnpm-workspace.yaml`）：

```yaml
allowBuilds:
  # ① 放行本插件 git 源构建（缺它 → pnpm 拦停 git 安装）
  'git+https://github.com/EternalNight996/dsh-theme.git': true

minimumReleaseAgeExclude:
  # ② 把豁免版本更新到当前发布版（留旧版 → npm 管路退到旧版）
  - '@eternalnight/dsh-theme@<当前版本>'
```

③ 拉最新（重装/更新时 git 快照常停在旧版）：

```bash
dsh plugin --profile web update
# 或
dsh plugin --profile web add github:EternalNight996/dsh-theme
```

> 本插件**无 `prepare` script**，`dsh plugin` 不会自动重建 `lib/client.js`，依赖发布时已提交的
> 同步产物——因此**发布者每次改 `src/` 后必须 `npm run build` 并提交 `lib/client.js`**，
> 否则 git 用户会拿到「源码新、产物旧」的不一致包（这正是「各式各样问题」的常见来源）。

## 5. 更新版本

```bash
npm version patch && npm publish --registry=https://registry.npmjs.org/
git push --follow-tags
```

---

## 一句话总览

```
本地验证 → GitHub 建仓打 dsh-plugin topic → npm login + npm publish → 市场自动收录
```
