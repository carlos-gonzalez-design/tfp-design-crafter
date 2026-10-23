import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const cdpUrl = process.env.CDP_URL || 'http://127.0.0.1:9230'
const appUrl = process.env.APP_URL || 'http://127.0.0.1:5173/app'
const outputDirectory = resolve('public/images/dashboard-showcase')
const frames = [
  { id: 'overview', label: 'Home' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius', label: 'Border Radius' },
]
const themes = ['light', 'dark']

const pages = await (await fetch(`${cdpUrl}/json`)).json()
const page = pages.find(item => item.type === 'page')
assert.ok(page, 'Chrome must have an open page')
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(resolveSocket => socket.addEventListener('open', resolveSocket, { once: true }))
let nextId = 0
const pending = new Map()

socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (!message.id) return
  const request = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) request.reject(message.error)
  else request.resolve(message.result)
})

function call(method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = ++nextId
    pending.set(id, { resolve: resolveCall, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}

const pause = (duration = 240) => new Promise(resolvePause => setTimeout(resolvePause, duration))

async function waitFor(selector) {
  for (let attempt = 0; attempt < 70; attempt++) {
    if (await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await pause(100)
  }
  assert.fail(`Timed out waiting for ${selector}`)
}

try {
  await mkdir(outputDirectory, { recursive: true })
  await call('Runtime.enable')
  await call('Page.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1200, deviceScaleFactor: 2, mobile: false })
  await call('Page.navigate', { url: appUrl })
  await waitFor('.foundation-overview')
  await waitFor('.preview-canvas')
  await evaluate('document.fonts.ready')

  for (const theme of themes) {
    await evaluate(`localStorage.setItem('design-crafter-theme', ${JSON.stringify(theme)})`)
    await call('Page.reload')
    await waitFor('.foundation-overview')
    await waitFor('.preview-canvas')
    await evaluate('document.fonts.ready')
    await pause(300)

    for (const frame of frames) {
      await evaluate(`(() => {const button=Array.from(document.querySelectorAll('.foundation-nav__item')).find(element=>element.textContent.trim()===${JSON.stringify(frame.label)});if(!button)throw new Error(${JSON.stringify(`Missing foundation: ${frame.label}`)});button.click()})()`)
      await pause(400)
      await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=0;document.querySelector(".preview-canvas").scrollTop=0')
      await pause(180)
      const screenshot = await call('Page.captureScreenshot', {
        format: 'webp',
        quality: 92,
        fromSurface: true,
        captureBeyondViewport: false,
      })
      const filePath = resolve(outputDirectory, `${frame.id}-${theme}.webp`)
      await writeFile(filePath, Buffer.from(screenshot.data, 'base64'))
      console.log(`CAPTURED ${frame.id}-${theme}.webp`)
    }
  }
} finally {
  socket.close()
}
