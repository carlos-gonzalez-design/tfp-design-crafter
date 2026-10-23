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

const pause = () => new Promise(resolve => setTimeout(resolve, 260))

async function key(key, code = key) {
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code })
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code })
  await pause()
}

async function waitFor(selector) {
  for (let attempt = 0; attempt < 70; attempt++) {
    if (await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await pause()
  }
  assert.fail(`Timed out waiting for ${selector}`)
}

async function clickText(selector, label) {
  await evaluate(`(() => {const element=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(element=>element.textContent.trim()===${JSON.stringify(label)});if(!element)throw new Error(${JSON.stringify(`Missing ${label}`)});element.click()})()`)
  await pause()
}

try {
  await call('Runtime.enable')
  await call('Log.enable')
  await call('Page.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: appUrl })
  await waitFor('.landing-hero')
  await waitFor('.live-demo__card')

  if (await evaluate('location.port === "4173"')) {
    assert.equal(await evaluate('navigator.serviceWorker.ready.then(registration => Boolean(registration.active))'), true)
    console.log('PASS Production service worker activation')
  }

  assert.equal(await evaluate('getComputedStyle(document.documentElement).getPropertyValue("--dc-color-brand").trim()'), '#635bff')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-hero .landing-link--brand")).backgroundColor'), 'rgb(99, 91, 255)')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-hero .landing-link--brand")).color'), 'rgb(255, 255, 255)')
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".landing-brand img")).length'), 2)
  assert.equal(await evaluate('document.querySelector(".landing-header .landing-brand img").getAttribute("src").endsWith(`/images/logo-design-crafter${document.querySelector(".landing").dataset.theme === "dark" ? "-dark" : ""}.svg`)'), true)
  assert.equal(await evaluate('document.querySelector(".landing-footer .landing-brand img").getAttribute("src").endsWith("/images/logo-design-crafter-dark.svg")'), true)
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".landing-brand__mark")).length'), 0)
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("h1 > *"), element => element.textContent.trim())'), ['Craft your system.', 'Shape your design.'])
  assert.equal(await evaluate('document.querySelectorAll(".foundation-tile").length'), 4)
  assert.equal(await evaluate('document.querySelectorAll(`a[data-app-link][href="/app"]`).length >= 3'), true)
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".landing-footer a")).some(link => link.textContent.includes("UI Kit") && link.getAttribute("href") === "/ui-kit")'), true)
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".landing-footer a")).some(link => link.textContent.includes("Open Playground") && link.getAttribute("href") === "/app")'), true)
  assert.equal(await evaluate('document.querySelector(".landing-footer").textContent.includes("Final Project")'), false)
  assert.equal(await evaluate('Boolean(document.querySelector(".dashboard-scroll-showcase figcaption h2") && document.querySelector(".dashboard-scroll-showcase figcaption").compareDocumentPosition(document.querySelector(".dashboard-scroll-showcase__frame")) & Node.DOCUMENT_POSITION_FOLLOWING)'), true)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".dashboard-scroll-showcase figcaption p")).textAlign'), 'center')
  assert.equal(await evaluate('document.querySelector(".landing-install") !== null'), true)
  assert.equal(await evaluate('Promise.all([fetch("/manifest.webmanifest"), fetch("/sw.js")]).then(responses => responses.every(response => response.ok))'), true)
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".landing-header__navigation > a:not([data-app-link]), .landing-hero .landing-link--light"), element => element.getAttribute("href"))'), ['#features', '#how-it-works', '#about', '#features'])
  await evaluate('Promise.all(Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img"), image => image.complete ? true : new Promise(resolve => image.addEventListener("load", resolve, { once: true }))))')
  assert.equal(await evaluate('document.querySelectorAll(".dashboard-scroll-showcase__stage img").length'), 5)
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img")).every(image => image.complete && image.naturalWidth === 3840 && image.naturalHeight === 2400 && getComputedStyle(image).objectFit === "contain")'), true)
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img"), image => image.getAttribute("src").endsWith("-" + document.querySelector(".landing").dataset.theme + ".webp")).every(Boolean)'), true)
  assert.equal(await evaluate('document.querySelectorAll(".dashboard-scroll-showcase__controls button").length'), 5)
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'))
  await clickText('.landing-theme-control button', 'Dark')
  assert.equal(await evaluate('document.querySelector(".landing").dataset.theme'), 'dark')
  await evaluate('Promise.all(Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img"), image => image.complete ? true : new Promise(resolve => image.addEventListener("load", resolve, { once: true }))))')
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img"), image => image.getAttribute("src").endsWith("-dark.webp")).every(Boolean)'), true)
  assert.equal(await evaluate('localStorage.getItem("design-crafter-theme")'), 'dark')
  assert.equal(await evaluate('document.querySelector(".landing-header .landing-brand img").getAttribute("src").endsWith("logo-design-crafter-dark.svg")'), true)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".foundations-showcase")).backgroundColor'), 'rgb(17, 17, 19)')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-eyebrow")).alignItems'), 'center')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-eyebrow")).gap'), '2px')
  await evaluate('document.querySelector(".landing-header__cta").click()')
  await waitFor('.dashboard')
  assert.equal(await evaluate('document.querySelector(".app-shell").classList.contains("dc-theme--dark")'), true)
  await evaluate('history.back()')
  await waitFor('.landing-hero')
  assert.equal(await evaluate('document.querySelector(".landing").dataset.theme'), 'dark')
  await clickText('.landing-theme-control button', 'Light')
  assert.equal(await evaluate('document.querySelector(".landing").dataset.theme'), 'light')
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".dashboard-scroll-showcase__stage img"), image => image.getAttribute("src").endsWith("-light.webp")).every(Boolean)'), true)
  assert.equal(await evaluate('document.querySelector(".landing-header .landing-brand img").getAttribute("src").endsWith("logo-design-crafter.svg")'), true)
  console.log('PASS Landing structure, five real dashboard frames and desktop overflow')

  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase").classList.contains("dashboard-scroll-showcase--scroll-driven")'), true)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".dashboard-scroll-showcase__sticky")).position'), 'sticky')
  assert.ok(await evaluate('document.querySelector(".dashboard-scroll-showcase").offsetHeight > innerHeight * 3'))

  const expectedFrames = ['Overview', 'Colors', 'Typography', 'Spacing', 'Border Radius']
  for (const [index, frameProgress] of [0, 0.25, 0.5, 0.75, 1].entries()) {
    await evaluate(`(() => {const section=document.querySelector('.dashboard-scroll-showcase');const top=scrollY+section.getBoundingClientRect().top;const distance=section.offsetHeight-innerHeight;scrollTo(0,top+(distance*${frameProgress}))})()`)
    await pause()
    assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase__controls button[aria-current=step]").textContent.trim().replace(/^\\d+\\s*/, "")'), expectedFrames[index])
  }
  for (const [index, frameProgress] of [1, 0.75, 0.5, 0.25, 0].entries()) {
    await evaluate(`(() => {const section=document.querySelector('.dashboard-scroll-showcase');const top=scrollY+section.getBoundingClientRect().top;const distance=section.offsetHeight-innerHeight;scrollTo(0,top+(distance*${frameProgress}))})()`)
    await pause()
    assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase__controls button[aria-current=step]").textContent.trim().replace(/^\\d+\\s*/, "")'), expectedFrames[expectedFrames.length - 1 - index])
  }
  await evaluate('document.querySelector("#features").scrollIntoView()')
  await pause()
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase").getBoundingClientRect().bottom < 0'), true)
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase__sticky").getBoundingClientRect().bottom <= document.querySelector(".dashboard-scroll-showcase").getBoundingClientRect().bottom + 1'), true)
  console.log('PASS Scroll-driven frame order in both directions and sticky release')

  await clickText('.live-control__palettes button small', 'Forest')
  assert.equal(await evaluate('document.querySelector(".live-demo__preview").style.getPropertyValue("--color-primary-source")'), '#138A5B')
  await clickText('.live-control--segmented:last-of-type .ds-toggle-group__item', 'Sharp')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".live-demo__card")).borderRadius'), '0px')
  await clickText('.live-control--segmented:last-of-type .ds-toggle-group__item', 'Subtle')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".live-demo__card")).borderRadius'), '12px')
  await clickText('.live-control--segmented:last-of-type .ds-toggle-group__item', 'Pill')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".live-demo__card")).borderRadius'), '32px')
  console.log('PASS Live Card palettes and Sharp/Subtle/Pill states')

  await evaluate('document.querySelector(".css-showcase__editor .ds-tabs__trigger[data-state=active]").focus()')
  await key('ArrowRight')
  assert.ok((await evaluate('document.querySelector(".ds-tabs__content[data-state=active] .code-window pre").textContent')).includes('.card__title'))
  await key('ArrowRight')
  const allCss = await evaluate('document.querySelector(".ds-tabs__content[data-state=active] .code-window pre").textContent')
  assert.ok(allCss.includes('--color-primary-source') && allCss.includes('.card__button'))
  await key('Home')
  assert.ok((await evaluate('document.querySelector(".ds-tabs__content[data-state=active] .code-window pre").textContent')).includes('--ds-radius-card-primary'))
  await evaluate('document.querySelector(".ds-tabs__content[data-state=active] .code-window__meta .ds-button").click()')
  await pause()
  assert.equal(await evaluate('document.querySelector(".ds-tabs__content[data-state=active] .code-window__meta .ds-button").textContent.trim()'), 'Copied!')
  console.log('PASS CSS export tabs')

  for (const width of [768, 390, 320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await pause()
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Landing overflow at ${width}px`)
    assert.ok(await evaluate('Array.from(document.querySelectorAll(".landing-brand img")).every(image=>image.getBoundingClientRect().width>0&&image.getBoundingClientRect().width<=innerWidth)'), `Landing logo sizing at ${width}px`)
  }
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase").classList.contains("dashboard-scroll-showcase--scroll-driven")'), false)
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".dashboard-scroll-showcase__sticky")).position'), 'sticky')
  await evaluate('document.querySelector("[data-frame-control=\\"4\\"]").click()')
  await pause()
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase__controls button[aria-current=step]").textContent.trim().replace(/^\\d+\\s*/, "")'), 'Border Radius')
  await evaluate('document.querySelector(".landing-header__menu-button").click()')
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".landing-header__navigation")).display'), 'none')
  console.log('PASS Mobile static controls, layouts and navigation')

  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: appUrl })
  await waitFor('.landing-hero')
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-reveal]")).opacity'), '1')
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase").classList.contains("dashboard-scroll-showcase--scroll-driven")'), false)
  await evaluate('document.querySelector("[data-frame-control=\\"2\\"]").focus();document.querySelector("[data-frame-control=\\"2\\"]").click()')
  await key('End')
  assert.equal(await evaluate('document.activeElement.dataset.frameControl'), '4')
  assert.equal(await evaluate('document.querySelector(".dashboard-scroll-showcase__controls button[aria-current=step]").textContent.trim().replace(/^\\d+\\s*/, "")'), 'Border Radius')
  console.log('PASS Reduced motion static mode and keyboard controls')

  await evaluate('document.querySelector(".landing-cta a[data-app-link]").click()')
  await waitFor('.dashboard')
  assert.equal(await evaluate('location.pathname'), '/app')
  await evaluate('history.back()')
  await waitFor('.landing-hero')
  assert.equal(await evaluate('location.pathname'), '/')
  console.log('PASS CTA navigation to /app and browser history')

  if (process.env.SCREENSHOT_PATH) {
    await clickText('.landing-theme-control button', 'Light')
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
    await call('Page.navigate', { url: appUrl })
    await waitFor('.landing-hero')
    await evaluate('document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"))')
    await pause()
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.DARK_SCREENSHOT_PATH) {
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
    await evaluate('document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"))')
    await clickText('.landing-theme-control button', 'Dark')
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.DARK_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.MOBILE_SCREENSHOT_PATH) {
    await clickText('.landing-theme-control button', 'Light')
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
    await call('Page.navigate', { url: appUrl })
    await waitFor('.landing-hero')
    await evaluate('document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"))')
    await pause()
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.MOBILE_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.MOBILE_DARK_SCREENSHOT_PATH) {
    await clickText('.landing-theme-control button', 'Dark')
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.MOBILE_DARK_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  const fallbackAvailable = await evaluate('document.querySelector(".landing-install button").textContent.includes("How to install")')
  if (fallbackAvailable) {
    await evaluate('document.querySelector(".landing-install button").click()')
    await pause()
    assert.equal(await evaluate('Boolean(document.querySelector(".landing-install [role=status]"))'), true)
  }
  await evaluate('(() => {const event=new Event("beforeinstallprompt",{cancelable:true});event.prompt=()=>{window.__installPromptCalled=true};event.userChoice=Promise.resolve({outcome:"accepted"});window.dispatchEvent(event)})()')
  await evaluate('document.querySelector(".landing-install button").click()')
  await pause()
  assert.equal(await evaluate('window.__installPromptCalled'), true)
  await evaluate('window.dispatchEvent(new Event("appinstalled"))')
  await pause()
  assert.equal(await evaluate('document.querySelector(".landing-install")'), null)
  console.log(`PASS PWA ${fallbackAvailable ? 'fallback instructions' : 'native install action'}, prompt handling and installed state`)

  if (process.env.SHOWCASE_SCREENSHOT_PATH) {
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
    await call('Page.navigate', { url: appUrl })
    await waitFor('.dashboard-scroll-showcase--scroll-driven')
    await evaluate('(() => {const section=document.querySelector(".dashboard-scroll-showcase");const top=scrollY+section.getBoundingClientRect().top;scrollTo(0,top+(section.offsetHeight-innerHeight)*0.5)})()')
    await pause()
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    await writeFile(process.env.SHOWCASE_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  assert.deepEqual(errors, [], 'No runtime errors, warnings or failed resources')
  console.log('PASS Landing browser console')
} finally {
  socket.close()
}
