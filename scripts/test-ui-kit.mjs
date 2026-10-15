import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'

const cdpUrl = process.env.CDP_URL || 'http://127.0.0.1:9230'
const appUrl = process.env.APP_URL || 'http://127.0.0.1:5173/'
const pages = await (await fetch(`${cdpUrl}/json`)).json()
const page = pages.find(item => item.type === 'page')
assert.ok(page, 'Chrome must have an open page')
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
let nextId = 0
const pending = new Map()
const errors = []
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const request = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) request.reject(message.error)
    else request.resolve(message.result)
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params)
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) errors.push(message.params)
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params)
})
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const pause = () => new Promise(resolve => setTimeout(resolve, 100))
async function key(key) {
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key })
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key })
  await pause()
}

try {
  await call('Runtime.enable')
  await call('Log.enable')
  await call('Page.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: `${appUrl}ui-kit` })
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await evaluate('Boolean(document.querySelector(".ui-kit__hero"))')) break
    await pause()
  }

  assert.equal(await evaluate('document.querySelectorAll(".ui-kit__section").length'), 7)
  assert.equal(await evaluate('document.querySelectorAll(".token-color").length'), 8)
  assert.equal(await evaluate('document.querySelectorAll(".component-row .dc-button").length'), 15)
  assert.equal(await evaluate('getComputedStyle(document.documentElement).getPropertyValue("--ds-color-primary").trim()'), '')
  assert.equal(await evaluate('document.querySelectorAll(".ui-kit__block.ds-preview .spacing-scale__item").length'), 11)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".ui-kit__block.ds-preview")).getPropertyValue("--ds-space-4xs").trim()'), '2px')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".ui-kit__block.ds-preview")).getPropertyValue("--ds-space-3xl").trim()'), '64px')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".ui-kit__block.ds-preview")).getPropertyValue("--ds-density").trim()'), 'default')
  assert.ok((await evaluate('document.querySelector(".ui-kit__block.ds-preview .ui-kit__block-heading code").textContent')).includes('default'))
  assert.equal(await evaluate('document.querySelector(".ui-kit__block.ds-preview .spacing-scale__item:last-child code").textContent'), '64px')

  await evaluate('document.querySelector("#dc-tab-foundations").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.querySelector("[role=tab][aria-selected=true]").textContent'), 'Components')
  await key('End')
  assert.equal(await evaluate('document.querySelector("[role=tab][aria-selected=true]").textContent'), 'Patterns')

  const checkedBefore = await evaluate('document.querySelector(".dc-switch__input").checked')
  await evaluate('document.querySelector(".dc-switch__input").click()')
  assert.notEqual(await evaluate('document.querySelector(".dc-switch__input").checked'), checkedBefore)

  const zoomBefore = await evaluate('document.querySelector(".dc-zoom output").textContent')
  await evaluate('document.querySelector(".dc-zoom button:last-child").click()')
  assert.notEqual(await evaluate('document.querySelector(".dc-zoom output").textContent'), zoomBefore)

  for (const width of [1440, 768, 390, 320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false })
    await pause()
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `UI Kit overflow at ${width}px`)
  }

  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  if (process.env.SCREENSHOT_PATH) {
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }
  assert.deepEqual(errors, [], 'No runtime errors, warnings or failed resources')
  console.log('PASS UI Kit structure, interactions, scoped DS tokens, responsive layouts and browser console')
} finally {
  socket.close()
}
