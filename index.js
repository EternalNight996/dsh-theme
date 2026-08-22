// 主题皮肤（host 侧）：设置命名空间 + 静态资源服务 + 导入持久化。
//
// 职责：
// 1. 注册 `deep-theme` 设置命名空间（enabled / mode / builtinId / imageSrc /
//    imageFit / imageMask / videoSrc / videoFollow / dim）。当前主题持久化到
//    settings 文件，重启保留。
// 2. 注册 `/deep-theme/assets/*` 静态路由：从本插件的 assets/ 目录提供内置图片
//    皮肤与默认视频（main-compressed.mp4），供客户端背景层直接引用。
// 3. 注册 `/deep-theme/api/import`：客户端把导入的图片/视频（base64 data URL）
//    交给 host，写入本插件 assets/imports/ 目录，返回可持久化的内部 URL。
//    —— 导入文件落地到包内，重启不丢。
//
// 不改 dsh 源码：只用 settings 命名空间 + webServer 路由 + 标准 slot。

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import z from '@deepseek-ai/schemastery'

export const name = 'deep-theme'
export const inject = ['settings']

export const Config = z.object({
  enabled: z.boolean().default(true),
  // 三态互斥：builtin（内置主题）/ image（静态图片）/ video（动态视频环绕跟随）
  mode: z.union(['builtin', 'image', 'video']).default('builtin'),
  builtinId: z.string().default('dark'),
  imageSrc: z.string().default(''), // 内置预设 id 或 /deep-theme/assets/** 或 data URL
  imageFit: z.union(['cover', 'contain']).default('cover'),
  imageMask: z.boolean().default(true), // 全局遮罩保证文字可读
  videoSrc: z.string().default(''), // 空 = 内置默认 /deep-theme/assets/videos/main-compressed.mp4
  videoFollow: z.boolean().default(true), // 鼠标驱动环绕跟随帧
  dim: z.number().min(0).max(0.7).default(0.35), // 背景变暗量，文字可读
})

// 插件根目录（ESM：从 import.meta.url 推导）。
const PLUGIN_ROOT = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.join(PLUGIN_ROOT, 'assets')
const IMPORTS_DIR = path.join(ASSETS_DIR, 'imports')

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
  const settings = ctx.settings.register('deep-theme', Config, { base: config ?? {} })

  // 确保 assets/imports 目录存在（首次激活）。
  ctx.effect(() => {
    fs.mkdir(IMPORTS_DIR, { recursive: true }).catch((error) => {
      console.error('[deep-theme] mkdir imports failed:', error)
    })
  }, 'deep-theme: ensure imports dir')

  // -- 静态资源服务：/deep-theme/assets/* ────────────────────────────────
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    webServer.register({
      kind: 'prefix',
      path: '/deep-theme/assets',
      handler: async (req, res) => {
        try {
          await serveAsset(req, res)
        } catch (error) {
          if (!res.headersSent) sendText(res, 404, 'not found')
          else res.end()
        }
      },
    })

    // -- 导入持久化：POST /deep-theme/api/import ────────────────────────
    webServer.register({
      kind: 'prefix',
      path: '/deep-theme/api',
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
  const rel = decodeURIComponent(url.pathname.replace(/^\/deep-theme\/assets/, '').replace(/^\/+/, ''))
  // 默认视频省略 path 时兜底到主视频（便于客户端 src="" 用内置默认）。
  const safeRel = rel || 'videos/main-compressed.mp4'
  const file = safeJoin(ASSETS_DIR, safeRel)
  if (!file) return sendText(res, 404, 'not found')
  const buf = await fs.readFile(file).catch(() => null)
  if (!buf) return sendText(res, 404, 'not found')
  const ext = path.extname(file).toLowerCase()
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': buf.length,
    'Cache-Control': 'public, max-age=3600',
  })
  res.end(buf)
}

async function handleApi(req, res, settings) {
  const url = new URL(req.url, 'http://localhost')
  const route = url.pathname.replace(/^\/deep-theme\/api/, '').replace(/\/+$/, '') || '/import'
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
  const safeName = (rawName.replace(/[^\w.\-]+/g, '_').replace(/\.+$/, '') || 'imported') + ext
  await fs.mkdir(IMPORTS_DIR, { recursive: true })
  const target = joinSafeImportPath(safeName)
  await fs.writeFile(target, buf)
  const fileBase = safeName.replace(/\\/g, '/')
  const urlOut = `/deep-theme/assets/imports/${encodeURIComponent(fileBase)}`
  json(res, 200, { ok: true, url: urlOut, kind })
}

function joinSafeImportPath(name) {
  const clean = name.split(/[/\\]/).pop()
  return path.join(IMPORTS_DIR, clean)
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
