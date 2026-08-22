# 发布到插件市场（npm + GitHub）指南

参考 [dsh-ui-three-body](https://github.com/EternalNight996/dsh-ui-three-body) 与 [dsh-ui-agents-pixe](https://github.com/EternalNight996/dsh-ui-agents-pixe) 的发布范式整理。本插件已按范式配置好，按下述顺序走即可。

---

## 1. 配置核对（已达成）

`package.json` 已具备市场收录所需关键字段：

- `name`: `dsh-theme`，version `0.1.0`
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

发布成功后：`dsh plugin --profile web add dsh-theme`

> 注意：本机 `npm config get registry` 可能是镜像（如 npmmirror），发布务必用
> `--registry=https://registry.npmjs.org/` 或改回官方源，避免误发镜像。

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
