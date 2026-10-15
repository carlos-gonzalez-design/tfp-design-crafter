import { access, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = join(projectRoot, 'dist')
const htmlPath = join(distRoot, 'index.html')

const mimeTypes = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const toDataUrl = async (filePath) => {
  await access(filePath)
  const mimeType = mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  const contents = await readFile(filePath)
  return `data:${mimeType};base64,${contents.toString('base64')}`
}

const replaceAsync = async (source, pattern, replacer) => {
  const matches = [...source.matchAll(pattern)]
  const replacements = await Promise.all(matches.map((match) => replacer(match)))

  let result = source
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index]
    result = `${result.slice(0, match.index)}${replacements[index]}${result.slice(match.index + match[0].length)}`
  }

  return result
}

let html = await readFile(htmlPath, 'utf8')
const scriptTag = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
const stylesheetTag = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)

if (!scriptTag || !stylesheetTag) {
  throw new Error('No se han encontrado los recursos generados por Vite en dist/index.html.')
}

const scriptPath = resolve(distRoot, scriptTag[1])
const stylesheetPath = resolve(distRoot, stylesheetTag[1])
let javascript = await readFile(scriptPath, 'utf8')
let css = await readFile(stylesheetPath, 'utf8')

css = await replaceAsync(css, /url\((['"]?)(?!data:|https?:|#)([^)'"\s]+)\1\)/g, async (match) => {
  const assetPath = resolve(dirname(stylesheetPath), match[2])
  return `url("${await toDataUrl(assetPath)}")`
})

javascript = await replaceAsync(
  javascript,
  /new URL\(([`'"])([^`'"]+)\1,\s*import\.meta\.url\)\.href/g,
  async (match) => JSON.stringify(await toDataUrl(resolve(dirname(scriptPath), match[2]))),
)

html = html
  .replace(stylesheetTag[0], `<style>${css.replaceAll('</style', '<\\/style')}</style>`)
  .replace(scriptTag[0], `<script type="module">${javascript.replaceAll('</script', '<\\/script')}</script>`)

await writeFile(htmlPath, html, 'utf8')

console.log('dist/index.html preparado para abrirse directamente sin servidor.')
