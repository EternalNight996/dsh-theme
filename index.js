// 主题皮肤（host 侧）：设置命名空间 + 静态资源服务 + 导入持久化。
//
// 职责：
// 1. 注册 `dsh-theme` 设置命名空间（enabled / mode / builtinId / imageSrc /
//    imageFit / videoSrc / videoMode / dim / themeAlpha / dialogAlpha /
//    importedImages / importedVideos）。当前主题持久化到 settings 文件，重启保留。
// 2. 注册 `/dsh-theme/assets/*` 静态路由：从本插件的 assets/ 目录提供内置图片
//    皮肤与默认视频（default.png / default.mp4），供客户端背景层直接引用。
// 3. 注册 `/dsh-theme/api/import`：客户端把导入的图片/视频（base64 data URL）
//    交给 host，写入本插件 assets/import-images 或 import-videos 目录，返回持久化 URL。
//    —— 导入文件落地到包内，重启不丢。
//
// 不改 dsh 源码：只用 settings 命名空间 + webServer 路由 + 标准 slot。

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import z from '@deepseek-ai/schemastery'
import { LOCKED_DEFAULT_IMAGE, LOCKED_DEFAULT_VIDEO } from './lib/themes.js'

export const name = 'dsh-theme'
export const inject = ['settings']

export const Config = z.object({
  enabled: z.boolean().default(true),
  // 三态互斥：builtin（内置主题）/ image（导入图片）/ video（视频：环绕跟随或循环播放）
  mode: z.union(['builtin', 'image', 'video']).default('image'),
  builtinId: z.string().default('deep-space'),
  imageSrc: z.string().default(LOCKED_DEFAULT_IMAGE), // 当前激活图片（受保护默认不可删）
  imageFit: z.union(['cover', 'contain']).default('cover'),
  videoMode: z.union(['follow', 'loop']).default('follow'), // 跟随鼠标 / 循环播放
  videoSrc: z.string().default(LOCKED_DEFAULT_VIDEO), // 当前激活视频（受保护默认不可删）
  importedImages: z.array(z.string()).default([]), // 导入的图片库（可删除，不含默认）
  importedVideos: z.array(z.string()).default([]), // 导入的视频库（可删除，不含默认）
  dim: z.number().min(0).max(0.7).default(0), // 背景压暗（蒙层强度），0 = 完全不压暗
  themeAlpha: z.number().min(0).max(1).default(1), // 主题面板/气泡不透明度（0=全透明背景全透, 1=实底）
  dialogAlpha: z.number().min(0).max(1).default(0), // 对话栏不透明度
})

// 插件根目录（ESM：从 import.meta.url 推导）。
const PLUGIN_ROOT = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.join(PLUGIN_ROOT, 'assets')
const IMAGE_IMPORTS_DIR = path.join(ASSETS_DIR, 'import-images')
const VIDEO_IMPORTS_DIR = path.join(ASSETS_DIR, 'import-videos')

const MIME = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

export function apply(ctx, config) {
  // 设置命名空间（base 传 composition 配置，层序 = schema 默认 → base → 用户覆盖）。
  const settings = ctx.settings.register('dsh-theme', Config, { base: config ?? {} })

  // 确保导入目录存在（首次激活）：图片在 import-images/，视频在 import-videos/。
  ctx.effect(() => {
    fs.mkdir(IMAGE_IMPORTS_DIR, { recursive: true }).catch((e) => console.error('[dsh-theme] mkdir import-images failed:', e))
    fs.mkdir(VIDEO_IMPORTS_DIR, { recursive: true }).catch((e) => console.error('[dsh-theme] mkdir import-videos failed:', e))
  }, 'dsh-theme: ensure import dirs')

  // -- 静态资源服务：/dsh-theme/assets/* ────────────────────────────────
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    webServer.register({
      kind: 'prefix',
      path: '/dsh-theme/assets',
      handler: async (req, res) => {
        try {
          await serveAsset(req, res)
        } catch (error) {
          if (!res.headersSent) sendText(res, 404, 'not found')
          else res.end()
        }
      },
    })

    // -- 导入持久化：POST /dsh-theme/api/import ────────────────────────
    webServer.register({
      kind: 'prefix',
      path: '/dsh-theme/api',
      handler: async (req, res) => {
        try {
          await handleApi(req, res, settings)
        } catch (error) {
          json(res, 500, { ok: false, error: String(error?.message || error) })
        }
      },
    })
  }
}

// -- helpers -----------------------------------------------------------------

function safeJoin(root, rel) {
  const target = path.normalize(path.join(root, rel))
  if (!target.startsWith(root + path.sep) && target !== root) return null
  return target
}

async function serveAsset(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const rel = decodeURIComponent(url.pathname.replace(/^\/dsh-theme\/assets/, '').replace(/^\/+/, ''))
  // 省略 path 时兜底到默认视频皮肤（import-videos/default.mp4）。
  const safeRel = rel || 'import-videos/default.mp4'
  const file = safeJoin(ASSETS_DIR, safeRel)
  if (!file) return sendText(res, 404, 'not found')
  const buf = await fs.readFile(file).catch(() => null)
  if (!buf) return sendText(res, 404, 'not found')
  const ext = path.extname(file).toLowerCase()
  // 用 mtime 做 Last-Modified；配合 If-Modified-Since → 304，实现「每次 revalidate、
  // 更新后浏览器立即拿到新资源」——避免升级后仍用旧缓存（曾致视频跟随卡顿）。
  const lastModified = await fs.stat(file).then((s) => s.mtime.toUTCString()).catch(() => undefined)
  const ifModifiedSince = req.headers && req.headers['if-modified-since']
  if (lastModified && ifModifiedSince === lastModified) {
    res.writeHead(304, { 'Last-Modified': lastModified })
    return res.end()
  }
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': buf.length,
    'Last-Modified': lastModified,
    // no-cache：浏览器绝不直接用缓存，总是发条件请求；避免 max-age 导致的过期资源。
    'Cache-Control': 'no-cache',
  })
  res.end(buf)
}

async function handleApi(req, res, settings) {
  const url = new URL(req.url, 'http://localhost')
  const route = url.pathname.replace(/^\/dsh-theme\/api/, '').replace(/\/+$/, '') || '/import'

  // 删除导入的皮肤文件：DELETE /dsh-theme/api/import  body|query { path: <url or filename> }
  if (req.method === 'DELETE') {
    let body = ''
    for await (const chunk of req) body += chunk
    let payload = {}
    try { payload = JSON.parse(body || '{}') } catch { payload = {} }
    const raw = String(payload.path || url.searchParams.get('path') || '')
    // 从 url 或裸文件名提取 basename 后，按类型目录删除（防路径穿越）。
    const name = raw.split('/').pop().split('\\').pop()
    if (!name) return json(res, 400, { ok: false, error: '缺少 path' })
    const dir = raw.indexOf('import-videos') >= 0 ? VIDEO_IMPORTS_DIR : IMAGE_IMPORTS_DIR
    await fs.rm(path.join(dir, name), { force: true }).catch(() => {})
    return json(res, 200, { ok: true })
  }

  if (route !== '/import' || req.method !== 'POST') {
    return json(res, 404, { ok: false, error: '未知接口' })
  }
  let body = ''
  for await (const chunk of req) body += chunk
  let payload
  try { payload = JSON.parse(body || '{}') } catch { payload = {} }

  const kind = payload.kind === 'video' ? 'video' : 'image'
  const rawName = String(payload.name || 'imported').trim()
  const dataUrl = String(payload.data || '')

  // data URL: data:*;base64,<data>
  const m = /^data:[^;,]*;base64,(.*)$/s.exec(dataUrl)
  const base64 = m ? m[1] : dataUrl
  if (!base64) return json(res, 400, { ok: false, error: '缺少数据内容' })
  const buf = Buffer.from(base64, 'base64')
  if (!buf.length) return json(res, 400, { ok: false, error: '数据为空' })

  const ext = kind === 'video' ? '.mp4' : '.png'
  // 去掉非法字符，并避免重复扩展名（如 foo.png 不再追加成 foo.png.png）。
  const rawClean = rawName.replace(/[^\w.\-]+/g, '_').replace(/\.+$/, '')
  const base = (rawClean || 'imported').replace(new RegExp(ext.replace('.', '\\.') + '$', 'i'), '')
  const safeName = base + ext
  const dir = kind === 'video' ? VIDEO_IMPORTS_DIR : IMAGE_IMPORTS_DIR
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, safeName), buf)
  const sub = kind === 'video' ? 'import-videos' : 'import-images'
  const urlOut = `/dsh-theme/assets/${sub}/${encodeURIComponent(safeName)}`
  json(res, 200, { ok: true, url: urlOut, kind })
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(text)
}

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
  })
  res.end(payload)
}
