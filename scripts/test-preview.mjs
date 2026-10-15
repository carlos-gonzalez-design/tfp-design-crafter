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

const pause = () => new Promise(resolve => setTimeout(resolve, 120))

async function waitFor(selector) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await pause()
  }
  assert.fail(`Timed out waiting for ${selector}`)
}

async function key(key, code = key) {
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code })
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code })
  await pause()
}

async function mouseClick(selectorExpression) {
  const point = await evaluate(`(() => {const element=${selectorExpression};element.scrollIntoView({block:'center'});const r=element.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point })
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point })
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point })
  await pause()
}

async function clickText(selector, label, exact = true) {
  const comparison = exact
    ? `element.textContent.trim()===${JSON.stringify(label)}`
    : `element.textContent.includes(${JSON.stringify(label)})`
  await evaluate(`(() => {const element=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(element=>${comparison});if(!element)throw new Error(${JSON.stringify(`Missing ${label}`)});element.click()})()`)
  await pause()
}

const selectFoundation = label => clickText('.foundation-nav__item', label)
const editorTab = label => clickText('.foundation-workspace__tabs .dc-tabs__tab', label)
const previewTab = label => mouseClick(`Array.from(document.querySelectorAll('.dc-preview-tabs__trigger')).find(element=>element.textContent.trim()===${JSON.stringify(label)})`)

async function style(selector, property) {
  return evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(selector)}))[${JSON.stringify(property)}]`)
}

async function customProperty(name) {
  return evaluate(`getComputedStyle(document.querySelector('.preview-canvas')).getPropertyValue(${JSON.stringify(name)}).trim()`)
}

async function setColor(index, value) {
  await evaluate(`(() => {const input=document.querySelectorAll('.foundation-workspace input[type=color]')[${index}];input.value=${JSON.stringify(value)};input.dispatchEvent(new Event('input',{bubbles:true}))})()`)
  await pause()
}

async function selectRadiusOption(category, label) {
  await evaluate(`(() => {const section=Array.from(document.querySelectorAll('.radius-decision')).find(element=>element.querySelector('h3').textContent.trim()===${JSON.stringify(category)});const option=Array.from(section.querySelectorAll('.radius-choice')).find(element=>element.querySelector('strong').textContent.trim()===${JSON.stringify(label)});option.click()})()`)
  await pause()
}

async function setBaseSize(value, blur = false) {
  await evaluate(`(() => {const input=document.querySelector('#type-base-size');input.value=${JSON.stringify(String(value))};input.dispatchEvent(new Event('input',{bubbles:true}));${blur ? "input.dispatchEvent(new Event('blur'));" : ''}})()`)
  await pause()
}

function approximately(actual, expected, tolerance = 0.05) {
  assert.ok(Math.abs(Number.parseFloat(actual) - expected) <= tolerance, `${actual} is not approximately ${expected}`)
}

try {
  await call('Runtime.enable')
  await call('Log.enable')
  await call('Page.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: appUrl })
  await waitFor('.foundation-overview')
  await waitFor('.preview-canvas')

  assert.equal(await evaluate('document.querySelectorAll(".foundation-nav__item").length'), 5)
  assert.equal(await evaluate('document.querySelector(".foundation-nav__item[aria-pressed=true]").textContent.trim()'), 'Home')
  assert.equal(await evaluate('document.querySelector(".foundation-panel .foundation-controls")'), null)
  assert.equal(await evaluate('document.querySelector(".foundation-overview h1").textContent'), 'Demo Design System')
  assert.equal(await evaluate('document.querySelectorAll(".overview-card").length'), 4)
  assert.ok(await evaluate('Boolean(document.querySelector(".preview-area"))'))
  assert.equal(await style('.dashboard__editor-pane', 'overflowY'), 'auto')
  assert.equal(await style('.preview-area', 'overflowY'), 'hidden')
  assert.equal(await style('.preview-workspace', 'overflowY'), 'hidden')
  assert.equal(await style('.dc-preview-tabs', 'overflowY'), 'hidden')
  assert.equal(await style('.preview-canvas', 'overflowY'), 'auto')
  assert.equal(await style('.component-inspector', 'overflowY'), 'auto')
  const dashboardColumns = await evaluate('getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.split(" ").map(parseFloat)')
  assert.ok(dashboardColumns[2] / dashboardColumns[1] > 2.95 && dashboardColumns[2] / dashboardColumns[1] < 3.05)
  const workspaceColumns = await evaluate('getComputedStyle(document.querySelector(".preview-workspace")).gridTemplateColumns.split(" ").map(parseFloat)')
  assert.ok(workspaceColumns[0] / workspaceColumns[1] > 2.95 && workspaceColumns[0] / workspaceColumns[1] < 3.05)
  assert.ok(await evaluate('document.querySelector(".component-inspector").getBoundingClientRect().left >= document.querySelector(".dc-preview-tabs").getBoundingClientRect().right'))
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".foundation-overview__grid")).gridTemplateColumns.split(" ").length'), 1)
  console.log('PASS Home overview, Foundation navigation and persistent Live Preview')

  assert.deepEqual(
    await evaluate('Array.from(document.querySelectorAll(".dc-preview-tabs__trigger"), element=>element.textContent.trim())'),
    ['Overview', 'Typography', 'Actions', 'Forms', 'Cards', 'Navigation', 'Feedback'],
  )
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Typography')
  assert.ok(await evaluate('Boolean(document.querySelector("[data-ds-portal-root]"))'))
  await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Actions')
  await key('ArrowLeft')
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Typography')
  await previewTab('Navigation')
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-tabs"))'))
  await evaluate('document.querySelector(".ds-tabs__trigger[data-state=active]").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.querySelector(".ds-tabs__trigger[data-state=active]").textContent.trim()'), 'Activity')
  assert.equal(await evaluate('document.querySelector(".ds-tabs__trigger:last-child").disabled'), true)
  assert.ok(await evaluate('document.querySelector(".ds-tabs__trigger:last-child").hasAttribute("data-disabled")'))
  await previewTab('Typography')
  console.log('PASS Seven-category Playground architecture and keyboard navigation')

  await previewTab('Actions')
  assert.ok(await evaluate('document.querySelectorAll(".ds-button").length >= 12'))
  assert.equal(await evaluate('document.querySelectorAll(".ds-button--destructive").length'), 1)
  assert.equal(await evaluate('document.querySelectorAll(".ds-button[aria-busy=true]").length'), 1)
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-toggle-group"))'))
  await evaluate('document.querySelector(".ds-toggle-group__item").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.activeElement.textContent.trim()'), 'Center')

  await previewTab('Forms')
  assert.equal(await evaluate('document.querySelectorAll(".ds-input").length'), 5)
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-textarea"))'))
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-select__trigger"))'))
  const checkboxBefore = await evaluate('document.querySelector(".ds-checkbox").getAttribute("data-state")')
  await evaluate('document.querySelector(".ds-checkbox").click()')
  assert.notEqual(await evaluate('document.querySelector(".ds-checkbox").getAttribute("data-state")'), checkboxBefore)
  const checkboxAfter = await evaluate('document.querySelector(".ds-checkbox").getAttribute("data-state")')
  const switchBefore = await evaluate('document.querySelector(".ds-switch").getAttribute("data-state")')
  await evaluate('document.querySelector(".ds-switch").click()')
  assert.notEqual(await evaluate('document.querySelector(".ds-switch").getAttribute("data-state")'), switchBefore)
  const switchAfter = await evaluate('document.querySelector(".ds-switch").getAttribute("data-state")')
  await evaluate('document.querySelector(".ds-select__trigger").focus()')
  await key('Enter')
  assert.ok(await evaluate('Boolean(document.querySelector("[data-ds-portal-root] .ds-select__content"))'))
  await key('ArrowDown')
  await key('Enter')
  assert.ok(await evaluate('document.querySelector(".ds-select__trigger").textContent.includes("Frontend Developer")'))
  const sliderBefore = await evaluate('document.querySelector(".ds-slider-control output").textContent')
  await evaluate('document.querySelector(".ds-slider__thumb").focus()')
  await key('ArrowRight')
  assert.notEqual(await evaluate('document.querySelector(".ds-slider-control output").textContent'), sliderBefore)

  await previewTab('Cards')
  assert.equal(await evaluate('document.querySelectorAll(".ds-card-showcase > .ds-card").length'), 11)
  assert.equal(await evaluate('new Set(Array.from(document.querySelectorAll(".ds-card-showcase > .ds-card"), element=>element.dataset.dsVariant)).size'), 11)
  const previewChromeBeforeScroll = await evaluate('(() => {const header=document.querySelector(".preview-area__heading").getBoundingClientRect();const tabs=document.querySelector(".dc-preview-tabs__list").getBoundingClientRect();return {headerTop:header.top,tabsTop:tabs.top,pageScroll:document.scrollingElement.scrollTop}})()')
  assert.ok(await evaluate('document.querySelector(".preview-canvas").scrollHeight > document.querySelector(".preview-canvas").clientHeight'))
  await evaluate('document.querySelector(".preview-canvas").scrollTop=240')
  await pause()
  const cardsScrollPosition = await evaluate('document.querySelector(".preview-canvas").scrollTop')
  assert.ok(cardsScrollPosition > 0)
  assert.deepEqual(
    await evaluate('(() => {const header=document.querySelector(".preview-area__heading").getBoundingClientRect();const tabs=document.querySelector(".dc-preview-tabs__list").getBoundingClientRect();return {headerTop:header.top,tabsTop:tabs.top,pageScroll:document.scrollingElement.scrollTop}})()'),
    previewChromeBeforeScroll,
  )
  await previewTab('Forms')
  assert.equal(await evaluate('document.querySelector(".ds-checkbox").getAttribute("data-state")'), checkboxAfter)
  assert.equal(await evaluate('document.querySelector(".ds-switch").getAttribute("data-state")'), switchAfter)
  await previewTab('Cards')
  assert.equal(await evaluate('document.querySelector(".preview-canvas").scrollTop'), cardsScrollPosition)
  console.log('PASS Fixed Preview chrome, per-category scroll and preserved component state')
  console.log('PASS Expanded Actions, interactive Forms and varied Card compositions')

  await previewTab('Navigation')
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-breadcrumbs"))'))
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-navigation-menu"))'))
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-pagination"))'))
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-accordion"))'))
  assert.equal(await evaluate('document.querySelector(".ds-accordion__trigger").getAttribute("data-state")'), 'open')
  await evaluate('document.querySelector(".ds-menu__trigger").click()')
  await pause()
  assert.ok(await evaluate('Boolean(document.querySelector("[data-ds-portal-root] .ds-menu__content"))'))
  await key('Escape')
  const selectedPageBefore = await evaluate('document.querySelector(".ds-pagination__item[data-selected]").textContent.trim()')
  await evaluate('Array.from(document.querySelectorAll(".ds-pagination__item")).at(-1).click()')
  assert.notEqual(await evaluate('document.querySelector(".ds-pagination__item[data-selected]").textContent.trim()'), selectedPageBefore)

  await previewTab('Feedback')
  assert.equal(await evaluate('document.querySelectorAll(".ds-badge").length'), 5)
  assert.equal(await evaluate('document.querySelectorAll(".ds-alert").length'), 3)
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-progress[role=progressbar]"))'))
  await clickText('.ds-button', 'Open dialog')
  assert.ok(await evaluate('Boolean(document.querySelector("[data-ds-portal-root] .ds-dialog__content"))'))
  assert.ok(await evaluate('document.querySelector("[data-ds-portal-root] .ds-dialog__content").contains(document.activeElement)'))
  await key('Escape')
  assert.equal(await evaluate('document.querySelector("[data-ds-portal-root] .ds-dialog__content")'), null)
  await clickText('.ds-button', 'Show notification')
  assert.ok(await evaluate('Boolean(document.querySelector("[data-ds-portal-root] .ds-toast"))'))
  await evaluate('document.querySelector("[data-ds-portal-root] .ds-toast__close").click()')
  console.log('PASS Advanced Navigation and portal-isolated Feedback primitives')

  await previewTab('Overview')
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-product-demo"))'))
  assert.equal(await evaluate('document.querySelectorAll(".ds-product-demo__stats > .ds-card").length'), 3)
  assert.equal(await evaluate('document.querySelectorAll(".ds-project-list__item").length'), 3)
  assert.ok(await evaluate('Boolean(document.querySelector(".ds-product-demo .ds-select__trigger"))'))
  assert.equal(await evaluate('document.querySelector(".ds-playground-placeholder")'), null)

  await previewTab('Actions')
  await evaluate('document.querySelector(".ds-button--primary:not([aria-busy])").click()')
  assert.equal(await evaluate('document.querySelector(".component-inspector__heading h3").textContent'), 'DsButton')
  assert.ok(await evaluate('document.querySelector(".component-inspector__tokens").textContent.includes("--ds-color-button-primary-default")'))
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".component-inspector__token-group summary > span:first-child"), element=>element.textContent.trim())'), ['Color', 'Typography', 'Spacing', 'Radius'])
  assert.equal(await evaluate('document.querySelectorAll(".component-inspector__swatch").length'), 2)
  assert.ok(await evaluate('Array.from(document.querySelectorAll(".component-inspector__token-copy > span"), element=>element.textContent.trim()).every(value=>value && value!=="—")'))
  assert.ok(await evaluate('Array.from(document.querySelectorAll(".component-inspector__token--color .component-inspector__token-copy > span"), element=>/^(#[0-9A-F]{6}(?:[0-9A-F]{2})?|transparent)$/.test(element.textContent.trim()))'))
  assert.equal(await evaluate('document.querySelector(".component-inspector__token--color .component-inspector__token-copy > span").textContent.trim()'), '#4353FF')
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".component-inspector__metadata dt"), element=>element.textContent.trim())'), ['Variant', 'Size', 'State'])
  assert.equal(await style('.preview-selection-indicator', 'pointerEvents'), 'none')
  await evaluate('(() => {const select=document.querySelector(".component-inspector__select");select.value="ghost";select.dispatchEvent(new Event("change",{bubbles:true}))})()')
  assert.ok(await evaluate('document.querySelector(".ds-button--ghost[data-ds-variant=ghost]") !== null'))
  await evaluate('(() => {const select=document.querySelectorAll(".component-inspector__select")[1];select.value="large";select.dispatchEvent(new Event("change",{bubbles:true}))})()')
  assert.ok(await evaluate('document.querySelector(".ds-button--large[data-ds-size=large]") !== null'))
  assert.ok(await evaluate('getComputedStyle(document.querySelector(".component-inspector")).fontFamily !== getComputedStyle(document.querySelector(".ds-button")).fontFamily'))
  await previewTab('Cards')
  assert.equal(await evaluate('document.querySelector(".component-inspector__heading h3").textContent'), 'Select a component')
  await previewTab('Actions')
  assert.equal(await evaluate('document.querySelector(".component-inspector__heading h3").textContent'), 'DsButton')
  assert.ok(await evaluate('Boolean(document.querySelector(".component-inspector__status"))'))
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 700, deviceScaleFactor: 1, mobile: false })
  await pause()
  assert.ok(await evaluate('document.querySelector(".component-inspector").scrollHeight > document.querySelector(".component-inspector").clientHeight'))
  const canvasScrollBeforeInspector = await evaluate('document.querySelector(".preview-canvas").scrollTop')
  await evaluate('document.querySelector(".component-inspector").scrollTop=120')
  await pause()
  assert.ok(await evaluate('document.querySelector(".component-inspector").scrollTop > 0'))
  assert.equal(await evaluate('document.querySelector(".preview-canvas").scrollTop'), canvasScrollBeforeInspector)
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await pause()
  console.log('PASS Realistic Overview and token-aware Component Inspector controls')

  await clickText('.overview-card .dc-button', 'Edit colors')
  assert.equal(await evaluate('document.querySelector(".foundation-workspace__title").textContent'), 'Colors')
  await setColor(0, '#112233')
  assert.equal(await evaluate('document.querySelector(".component-inspector__token--color .component-inspector__token-copy > span").textContent.trim()'), '#112233')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".component-inspector__swatch"), "::after").backgroundColor'), 'rgb(17, 34, 51)')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".component-inspector__swatch")).getPropertyValue("--component-token-color").trim()'), 'rgb(17, 34, 51)')
  await setColor(0, '#4353ff')
  await evaluate('document.querySelector(".foundation-workspace__tabs [role=tab]").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.querySelector(".foundation-workspace__tabs [role=tab][aria-selected=true]").textContent'), 'Tokens')
  await key('End')
  assert.equal(await evaluate('document.querySelector(".foundation-workspace__tabs [role=tab][aria-selected=true]").textContent'), 'Code')
  await key('Home')
  console.log('PASS Accessible Edit, Tokens and Code tabs')

  await previewTab('Typography')
  for (const [index, value] of ['#123456', '#ffcc00', '#eeeeee', '#fafafa', '#222222'].entries()) await setColor(index, value)
  assert.equal(await style('.preview-canvas', 'backgroundColor'), 'rgb(238, 238, 238)')
  assert.equal(await style('.ds-typography--h1', 'color'), 'rgb(34, 34, 34)')
  await editorTab('Tokens')
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('--ds-color-primary'))
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('#123456'))
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__notice").textContent')).includes('read-only'))
  await editorTab('Code')
  const colorsCss = await evaluate('document.querySelector(".generated-css__code").textContent')
  assert.ok(colorsCss.includes('--ds-color-primary: #123456;'))
  assert.ok(!colorsCss.includes('--ds-font-family'))
  await clickText('.foundation-code__intro .dc-button', 'Show all CSS')
  const completeCss = await evaluate('document.querySelector(".generated-css__code").textContent')
  assert.ok(completeCss.includes('--ds-font-size-base: 1rem;'))
  assert.ok(completeCss.includes('--ds-font-size-6xl: 4.7684rem;'))
  assert.ok(completeCss.includes('--ds-text-heading-1: var(--ds-font-size-3xl);'))
  assert.ok(completeCss.includes('--ds-text-heading-1-weight: 700;'))
  assert.ok(completeCss.includes('--ds-color-bg-fill-primary-default: var(--ds-color-primary);'))
  assert.ok(completeCss.includes('--ds-font-size-button-primary: var(--ds-font-size-body-md);'))
  assert.ok(completeCss.includes('--ds-radius-none: 0px;'))
  assert.ok(completeCss.includes('--ds-radius-full: 9999px;'))
  assert.ok(completeCss.includes('--ds-radius-button-primary: var(--ds-radius-lg);'))
  assert.ok(!completeCss.includes('font-size-step'))
  assert.ok(completeCss.includes('--ds-space-3xl: 64px;'))
  console.log('PASS Reactive colors, token table and filtered/full CSS')

  await previewTab('Actions')
  assert.equal(await style('.ds-button--primary', 'backgroundColor'), 'rgb(18, 52, 86)')
  assert.equal(await evaluate('document.querySelector(".ds-button:disabled").disabled'), true)
  await previewTab('Navigation')
  assert.equal(await style('.ds-tabs__trigger[data-state=active]', 'borderBottomColor'), 'rgb(18, 52, 86)')
  await previewTab('Cards')
  await clickText('.preview-area__expand-action', 'Expand Preview')
  assert.equal(await evaluate('document.querySelector(".foundation-panel")'), null)
  assert.equal(await evaluate('document.querySelector(".dashboard__editor-pane")'), null)
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Cards')
  const expandedWorkspaceColumns = await evaluate('getComputedStyle(document.querySelector(".preview-workspace")).gridTemplateColumns.split(" ").map(parseFloat)')
  assert.ok(expandedWorkspaceColumns[0] / expandedWorkspaceColumns[1] > 2.95 && expandedWorkspaceColumns[0] / expandedWorkspaceColumns[1] < 3.05)
  const expandedChromeBeforeScroll = await evaluate('(() => {const header=document.querySelector(".preview-area__heading").getBoundingClientRect();const tabs=document.querySelector(".dc-preview-tabs__list").getBoundingClientRect();return {headerTop:header.top,tabsTop:tabs.top,pageScroll:document.scrollingElement.scrollTop}})()')
  await evaluate('document.querySelector(".preview-canvas").scrollTop=document.querySelector(".preview-canvas").scrollHeight')
  await pause()
  assert.deepEqual(
    await evaluate('(() => {const header=document.querySelector(".preview-area__heading").getBoundingClientRect();const tabs=document.querySelector(".dc-preview-tabs__list").getBoundingClientRect();return {headerTop:header.top,tabsTop:tabs.top,pageScroll:document.scrollingElement.scrollTop}})()'),
    expandedChromeBeforeScroll,
  )
  assert.equal(await style('.preview-area', 'overflowY'), 'hidden')
  await clickText('.preview-area__expand-action', 'Back to Editor')
  assert.equal(await evaluate('document.querySelector(".foundation-workspace__title").textContent'), 'Colors')
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Cards')
  console.log('PASS Expanded Preview keeps fixed chrome, isolated scroll and selected state')

  await selectFoundation('Typography')
  await editorTab('Edit')
  await evaluate('document.querySelector(".foundation-controls .dc-select__trigger").focus()')
  await key('Enter')
  await key('ArrowDown')
  await key('Enter')
  assert.equal(await customProperty('--ds-font-family'), 'Arial, sans-serif')
  await previewTab('Actions')
  assert.ok((await style('.ds-button', 'fontFamily')).includes('Arial'))
  await previewTab('Navigation')
  assert.ok((await style('.ds-tabs__trigger', 'fontFamily')).includes('Arial'))
  await evaluate('document.querySelector(".foundation-controls .dc-select__trigger").focus()')
  await key('Enter')
  await key('Home')
  await key('Enter')
  assert.equal(await customProperty('--ds-font-family'), 'Inter, sans-serif')
  assert.equal(await evaluate('document.querySelectorAll(".type-scale-preview li").length'), 11)
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".type-scale-preview__meta code"), element=>element.textContent)'), ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'])
  assert.ok(await evaluate('Array.from(document.querySelectorAll(".type-scale-preview output"), element=>element.textContent).every(value=>value.endsWith("rem"))'))
  assert.equal(await evaluate('document.querySelectorAll(".type-scale-preview__item--base").length'), 1)
  assert.ok(!(await evaluate('document.querySelector(".foundation-workspace").textContent')).includes('Scale Steps'))
  await evaluate('(() => {const input=document.querySelector("#type-scale-sample");input.value="Flexible systems";input.dispatchEvent(new Event("input",{bubbles:true}))})()')
  await pause()
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".type-scale-preview__sample span"), element=>element.textContent).every(text=>text==="Flexible systems")'), true)
  await setBaseSize(17)
  assert.equal(await evaluate('document.querySelector("#type-base-size").value'), '17')
  assert.equal(await customProperty('--ds-font-size-base'), '1.0625rem')
  await setBaseSize(0)
  assert.equal(await customProperty('--ds-font-size-base'), '1.0625rem')
  assert.equal(await evaluate('document.querySelector("#type-base-size").getAttribute("aria-invalid")'), 'true')
  await setBaseSize(0, true)
  assert.equal(await evaluate('document.querySelector("#type-base-size").value'), '17')
  await evaluate('document.querySelectorAll(".type-ratio-grid__option")[3].click()')
  await pause()
  assert.equal(await evaluate('document.querySelectorAll(".type-scale-preview li").length'), 11)
  assert.equal(await evaluate('document.querySelector(".type-scale-preview li:last-child code").textContent'), '6xl')
  approximately(await style('.type-scale-preview li:last-child .type-scale-preview__sample span', 'fontSize'), 17 * 1.333 ** 7)
  assert.equal(await style('.type-scale-preview__sample', 'overflowX'), 'auto')
  assert.equal(await evaluate('document.querySelector(".type-scale-preview li:last-child .type-scale-preview__sample").scrollWidth > document.querySelector(".type-scale-preview li:last-child .type-scale-preview__sample").clientWidth'), true)
  const previewScrollBefore = await evaluate('document.querySelector(".preview-area").scrollTop')
  await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=120')
  await pause()
  assert.ok(await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop>0'))
  assert.equal(await evaluate('document.querySelector(".preview-area").scrollTop'), previewScrollBefore)
  await previewTab('Typography')
  approximately(await style('.ds-typography--h1', 'fontSize'), 17 * 1.333 ** 4)
  approximately(await style('.ds-typography--h2', 'fontSize'), 17 * 1.333 ** 3)
  approximately(await style('.ds-typography--h3', 'fontSize'), 17 * 1.333 ** 2)
  approximately(await style('.ds-typography--body-large', 'fontSize'), 17 * 1.333)
  approximately(await style('.ds-typography--body', 'fontSize'), 17)
  approximately(await style('.ds-typography--small', 'fontSize'), 17 * 1.333 ** -1)
  approximately(await style('.ds-typography--caption', 'fontSize'), 17 * 1.333 ** -2)
  assert.equal(await customProperty('--ds-font-scale-ratio'), '1.333')

  assert.equal(await evaluate('document.querySelectorAll(".semantic-style-card").length'), 7)
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".semantic-style-card__heading strong"), element=>element.textContent)'), ['Heading 1', 'Heading 2', 'Heading 3', 'Body Large', 'Body', 'Small', 'Caption'])
  assert.equal(await evaluate('document.querySelectorAll(".semantic-style-editor .dc-select__trigger").length'), 2)
  await evaluate('document.querySelectorAll(".semantic-style-editor .dc-select__trigger")[0].focus()')
  await key('Enter')
  await key('ArrowDown')
  await key('Enter')
  await evaluate('document.querySelectorAll(".semantic-style-editor .dc-select__trigger")[1].focus()')
  await key('Enter')
  await key('ArrowUp')
  await key('Enter')
  approximately(await style('.ds-typography--h1', 'fontSize'), 17 * 1.333 ** 5)
  assert.equal(await style('.ds-typography--h1', 'fontWeight'), '600')
  await editorTab('Tokens')
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".foundation-tokens__group th"), element=>element.textContent)'), ['Configuration', 'Primitive size tokens', 'Semantic text tokens'])
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('--ds-font-size-6xl'))
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('--ds-text-heading-1'))
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('--ds-text-heading-1-weight'))
  await editorTab('Code')
  let typographyCss = await evaluate('document.querySelector(".generated-css__code").textContent')
  assert.ok(typographyCss.includes('--ds-font-size-6xl:'))
  assert.ok(typographyCss.includes('--ds-text-heading-1: var(--ds-font-size-4xl);'))
  assert.ok(typographyCss.includes('--ds-text-heading-1-weight: 600;'))
  assert.ok(!typographyCss.includes('px;'))
  assert.equal(await evaluate('Array.from(document.querySelectorAll(".generated-css__code")[0].textContent.matchAll(/var\\((--ds-font-size-[^)]+)\\)/g), match=>match[1]).every(name=>document.querySelector(".preview-canvas").style.getPropertyValue(name))'), true)
  assert.ok(!typographyCss.includes('scale-steps'))
  console.log('PASS Fixed 11-token typography scale, semantic aliases and weights')

  await selectFoundation('Spacing')
  await editorTab('Edit')
  assert.equal(await evaluate('document.querySelectorAll(".spacing-scale-preview__item").length'), 11)
  const primitiveLabels = await evaluate('Array.from(document.querySelectorAll(".spacing-scale-preview__item output"), element=>element.textContent)')
  for (const scenario of [
    { label: 'Compact', applied: ['12px', '8px', '12px', '12px', '8px'] },
    { label: 'Default', applied: ['16px', '12px', '16px', '16px', '12px'] },
    { label: 'Spacious', applied: ['24px', '16px', '24px', '24px', '16px'] },
  ]) {
    await clickText('.spacing-density__option', scenario.label)
    assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".applied-spacing__item output"), element=>element.textContent)'), scenario.applied)
    assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".spacing-scale-preview__item output"), element=>element.textContent)'), primitiveLabels)
  }
  await previewTab('Cards')
  assert.equal(await style('.ds-card', 'paddingTop'), '24px')
  assert.equal(await style('.ds-card__content', 'gap'), '16px')
  await previewTab('Forms')
  assert.equal(await style('.ds-input', 'paddingTop'), '12px')
  assert.equal(await style('.ds-input', 'paddingLeft'), '24px')
  await previewTab('Navigation')
  assert.equal(await style('.ds-tabs__list', 'columnGap'), '16px')
  assert.equal(await style('.ds-tabs__trigger', 'paddingTop'), '16px')
  assert.equal(await style('.ds-tabs__content', 'paddingTop'), '24px')
  console.log('PASS Stable spacing primitives and density assignments')

  await selectFoundation('Border Radius')
  await editorTab('Edit')
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".radius-decision h3"), element=>element.textContent.trim())'), ['Button Shape', 'Card Corners', 'Input Corners'])
  assert.equal(await evaluate('document.querySelectorAll(".radius-decision input[type=range], .radius-decision input[type=number]").length'), 0)
  assert.equal(await evaluate('document.querySelectorAll(".radius-choice[aria-checked=true]").length'), 3)
  assert.equal(await evaluate('document.querySelectorAll(".radius-live-preview .ds-button, .radius-live-preview .ds-card, .radius-live-preview .ds-input").length'), 3)
  await evaluate('document.querySelector(".radius-decision .radius-choice[aria-checked=true]").focus()')
  await key('ArrowRight')
  assert.equal(await evaluate('document.querySelector(".radius-decision .radius-choice[aria-checked=true] strong").textContent.trim()'), 'Pill')

  await selectRadiusOption('Button Shape', 'Square')
  await previewTab('Actions')
  assert.deepEqual(await evaluate('["small","medium","large"].map(size=>getComputedStyle(document.querySelector(`.ds-button--${size}`)).borderRadius)'), ['0px', '0px', '0px'])
  await selectRadiusOption('Button Shape', 'Rounded')
  assert.equal(await style('.ds-button', 'borderRadius'), '8px')
  await selectRadiusOption('Button Shape', 'Pill')
  assert.deepEqual(await evaluate('["small","medium","large"].map(size=>getComputedStyle(document.querySelector(`.ds-button--${size}`)).borderRadius)'), ['9999px', '9999px', '9999px'])
  assert.equal(await style('.ds-button:disabled', 'borderRadius'), '9999px')

  await selectRadiusOption('Card Corners', 'Sharp')
  await previewTab('Cards')
  assert.equal(await style('.ds-card', 'borderRadius'), '0px')
  await selectRadiusOption('Card Corners', 'Subtle')
  assert.equal(await style('.ds-card', 'borderRadius'), '4px')
  await selectRadiusOption('Card Corners', 'Rounded')
  assert.equal(await style('.ds-card', 'borderRadius'), '12px')
  await selectRadiusOption('Card Corners', 'Soft')
  assert.equal(await style('.ds-card', 'borderRadius'), '20px')
  assert.equal(await style('.ds-card__media', 'borderRadius'), '12px')
  assert.equal(await style('.ds-card__badge', 'borderRadius'), '9999px')

  await selectRadiusOption('Input Corners', 'Square')
  await previewTab('Forms')
  assert.equal(await style('.ds-input', 'borderRadius'), '0px')
  assert.equal(await style('.ds-textarea', 'borderRadius'), '0px')
  assert.equal(await style('.ds-select__trigger', 'borderRadius'), '0px')
  await selectRadiusOption('Input Corners', 'Subtle')
  assert.equal(await style('.ds-input', 'borderRadius'), '6px')
  await selectRadiusOption('Input Corners', 'Rounded')
  assert.equal(await style('.ds-input', 'borderRadius'), '12px')
  assert.equal(await style('.ds-textarea', 'borderRadius'), '12px')
  assert.equal(await style('.ds-select__trigger', 'borderRadius'), '12px')
  assert.equal(await style('.ds-switch', 'borderRadius'), '9999px')
  assert.equal(await style('.ds-checkbox', 'borderRadius'), '4px')

  await previewTab('Feedback')
  assert.equal(await style('.ds-badge', 'borderRadius'), '9999px')
  assert.equal(await style('.ds-progress', 'borderRadius'), '9999px')
  assert.equal(await style('.ds-alert', 'borderRadius'), '20px')
  await clickText('.ds-button', 'Open dialog')
  assert.equal(await style('[data-ds-portal-root] .ds-dialog__content', 'borderRadius'), '20px')
  await key('Escape')

  await editorTab('Tokens')
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".foundation-tokens__group th"), element=>element.textContent.trim())'), ['Primitive tokens', 'Semantic tokens', 'Component tokens'])
  assert.equal(await evaluate('document.querySelectorAll(".foundation-tokens__table thead th").length'), 5)
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('--ds-radius-button-primary'))
  assert.ok((await evaluate('document.querySelector(".foundation-tokens__table").textContent')).includes('9999px'))
  await editorTab('Code')
  const radiusCss = await evaluate('document.querySelector(".generated-css__code").textContent')
  assert.ok(radiusCss.includes('--ds-radius-md: 6px;'))
  assert.ok(radiusCss.includes('--ds-radius-2xl: 20px;'))
  assert.ok(radiusCss.includes('--ds-radius-shape-pill: var(--ds-radius-full);'))
  assert.ok(radiusCss.includes('--ds-radius-button-primary: var(--ds-radius-full);'))
  assert.ok(radiusCss.includes('--ds-radius-card-primary: var(--ds-radius-surface-primary);'))

  await previewTab('Actions')
  await evaluate('document.querySelector(".ds-button--primary:not([aria-busy])").click()')
  const inspectorRadius = await evaluate('(() => {const token=Array.from(document.querySelectorAll(".component-inspector__token")).find(element=>element.textContent.includes("--ds-radius-button-primary"));return Array.from(token.querySelectorAll(".component-inspector__token-details dd"), element=>element.textContent.trim())})()')
  assert.deepEqual(inspectorRadius, ['--ds-radius-full', '9999px', 'Pill'])

  await selectFoundation('Typography')
  await selectFoundation('Border Radius')
  await editorTab('Edit')
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".radius-choice[aria-checked=true] strong"), element=>element.textContent.trim())'), ['Pill', 'Soft', 'Rounded'])
  await previewTab('Navigation')
  assert.equal(await style('.ds-tabs__trigger', 'borderTopLeftRadius'), '4px')
  assert.equal(await style('.ds-tabs__content', 'borderRadius'), '20px')
  console.log('PASS Purpose-led radius decisions, token hierarchy, persistence and Inspector integration')

  await call('Emulation.setDeviceMetricsOverride', { width: 1024, height: 900, deviceScaleFactor: 1, mobile: false })
  await pause()
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".foundation-nav")).gridTemplateColumns.split(" ").length'), 5)
  const tabletColumns = await evaluate('getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.split(" ").map(parseFloat)')
  assert.ok(tabletColumns[1] / tabletColumns[0] > 2.45)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".preview-workspace")).gridTemplateColumns.split(" ").length'), 1)
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'))

  for (const width of [767, 390, 320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await pause()
    await clickText('.dashboard__mobile-switch button', 'Editor')
    assert.notEqual(await style('.dashboard__editor-pane', 'display'), 'none')
    assert.equal(await style('.preview-area', 'display'), 'none')
    await clickText('.dashboard__mobile-switch button', 'Preview')
    assert.equal(await style('.dashboard__editor-pane', 'display'), 'none')
    assert.notEqual(await style('.preview-area', 'display'), 'none')
    assert.equal(await style('.preview-area', 'overflowY'), 'hidden')
    assert.equal(await style('.preview-canvas', 'overflowY'), 'auto')
    assert.equal(await style('.component-inspector', 'overflowY'), 'auto')
    assert.ok(await evaluate('document.scrollingElement.scrollHeight<=innerHeight'))
    assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'), `Dashboard overflow at ${width}px`)
  }
  console.log('PASS Tablet layout and state-preserving mobile Editor/Preview switch')

  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await pause()
  assert.equal(await evaluate('document.querySelector(".foundation-nav__item[aria-pressed=true]").textContent.trim()'), 'Border Radius')
  assert.equal(await evaluate('document.querySelector(".dc-preview-tabs__trigger[data-state=active]").textContent.trim()'), 'Navigation')

  if (process.env.SCREENSHOT_PATH) {
    await selectFoundation('Home')
    await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=0;document.querySelector(".preview-area").scrollTop=0')
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.TYPOGRAPHY_SCREENSHOT_PATH) {
    await selectFoundation('Typography')
    await editorTab('Edit')
    await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=0;document.querySelector(".preview-area").scrollTop=0')
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.TYPOGRAPHY_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.TYPOGRAPHY_DETAILS_SCREENSHOT_PATH) {
    await selectFoundation('Typography')
    await editorTab('Edit')
    await evaluate('document.querySelector(".radius-live-preview").scrollIntoView({block:"center"})')
    await pause()
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.TYPOGRAPHY_DETAILS_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.RADIUS_SCREENSHOT_PATH) {
    await selectFoundation('Border Radius')
    await editorTab('Edit')
    await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=0;document.querySelector(".preview-area").scrollTop=0')
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.RADIUS_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.RADIUS_DETAILS_SCREENSHOT_PATH) {
    await selectFoundation('Border Radius')
    await editorTab('Edit')
    await evaluate('document.querySelector(".dashboard__editor-pane").scrollTop=document.querySelector(".dashboard__editor-pane").scrollHeight')
    await pause()
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.RADIUS_DETAILS_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  if (process.env.PREVIEW_SCREENSHOT_PATH) {
    if (process.env.PREVIEW_CATEGORY) await previewTab(process.env.PREVIEW_CATEGORY)
    await clickText('.preview-area__expand-action', 'Expand Preview')
    if (process.env.PREVIEW_CATEGORY === 'Actions') {
      await evaluate('document.querySelector(".ds-button--primary:not([aria-busy])").click()')
      await pause()
    }
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    await writeFile(process.env.PREVIEW_SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'))
  }

  assert.deepEqual(errors, [], 'No runtime errors, warnings or failed resources')
  console.log('PASS Dashboard architecture, reactivity, responsive behavior and browser console')
} finally {
  socket.close()
}
