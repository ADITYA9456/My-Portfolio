const GRID_W = 336
const GRID_H = 432
const BG_TOLERANCE = 16

// World-space placement of the portrait (image height maps to WORLD_H).
const WORLD_H = 4.5
const WORLD_TOP = 2.05
const BODY_DEPTH = 0.55
const RELIEF = 0.5

export function loadImage(url, signal) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image request failed: ${url}`))
    if (signal) signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
    img.src = url
  })
}

function readPixels(img) {
  const canvas = document.createElement('canvas')
  canvas.width = GRID_W
  canvas.height = GRID_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, GRID_W, GRID_H)
  return ctx.getImageData(0, 0, GRID_W, GRID_H).data
}

function boxBlur(src, w, h, radius) {
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const span = radius * 2 + 1
  for (let y = 0; y < h; y++) {
    let acc = 0
    for (let x = -radius; x <= radius; x++) acc += src[y * w + Math.min(w - 1, Math.max(0, x))]
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = acc / span
      acc += src[y * w + Math.min(w - 1, x + radius + 1)] - src[y * w + Math.max(0, x - radius)]
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0
    for (let y = -radius; y <= radius; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / span
      acc += tmp[Math.min(h - 1, y + radius + 1) * w + x] - tmp[Math.max(0, y - radius) * w + x]
    }
  }
  return out
}

// Flood fill from the border through near-background pixels, then keep the largest foreground blob.
export function segment(data) {
  const w = GRID_W
  const h = GRID_H
  let br = 0, bg = 0, bb = 0, n = 0
  const sample = (x, y) => {
    const i = (y * w + x) * 4
    br += data[i]
    bg += data[i + 1]
    bb += data[i + 2]
    n++
  }
  for (let x = 0; x < w; x += 4) {
    sample(x, 0)
    sample(x, 1)
  }
  for (let y = 0; y < 40; y += 2) {
    sample(0, y)
    sample(w - 1, y)
  }
  br /= n
  bg /= n
  bb /= n

  const isBg = (p) => {
    const i = p * 4
    return Math.max(Math.abs(data[i] - br), Math.abs(data[i + 1] - bg), Math.abs(data[i + 2] - bb)) < BG_TOLERANCE
  }

  const bgMask = new Uint8Array(w * h)
  const stack = []
  const seed = (x, y) => {
    const p = y * w + x
    if (!bgMask[p] && isBg(p)) {
      bgMask[p] = 1
      stack.push(p)
    }
  }
  for (let x = 0; x < w; x++) seed(x, 0)
  for (let y = 0; y < h; y++) {
    seed(0, y)
    seed(w - 1, y)
  }
  while (stack.length) {
    const p = stack.pop()
    const x = p % w
    const y = (p / w) | 0
    if (x > 0) seed(x - 1, y)
    if (x < w - 1) seed(x + 1, y)
    if (y > 0) seed(x, y - 1)
    if (y < h - 1) seed(x, y + 1)
  }

  const mask = new Float32Array(w * h)
  for (let p = 0; p < w * h; p++) mask[p] = bgMask[p] ? 0 : 1
  // Smooth the cut-out edge a little so the silhouette is not jagged.
  const soft = boxBlur(mask, w, h, 1)
  for (let p = 0; p < w * h; p++) mask[p] = soft[p] > 0.5 ? 1 : 0
  return mask
}

// Chamfer distance (in pixels) to the nearest empty pixel; the image edge does not count as empty.
function distanceInside(mask, w, h) {
  const INF = 1e6
  const d = new Float32Array(w * h)
  for (let p = 0; p < w * h; p++) d[p] = mask[p] ? INF : 0
  const a = 1
  const b = 1.4142
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x
      if (!d[p]) continue
      let v = d[p]
      if (x > 0) v = Math.min(v, d[p - 1] + a)
      if (y > 0) {
        v = Math.min(v, d[p - w] + a)
        if (x > 0) v = Math.min(v, d[p - w - 1] + b)
        if (x < w - 1) v = Math.min(v, d[p - w + 1] + b)
      }
      d[p] = v
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const p = y * w + x
      if (!d[p]) continue
      let v = d[p]
      if (x < w - 1) v = Math.min(v, d[p + 1] + a)
      if (y < h - 1) {
        v = Math.min(v, d[p + w] + a)
        if (x < w - 1) v = Math.min(v, d[p + w + 1] + b)
        if (x > 0) v = Math.min(v, d[p + w - 1] + b)
      }
      d[p] = v
    }
  }
  return d
}

export function analyse(img) {
  const data = readPixels(img)
  const w = GRID_W
  const h = GRID_H
  const mask = segment(data)

  const lum = new Float32Array(w * h)
  for (let p = 0; p < w * h; p++) {
    const i = p * 4
    lum[p] = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
  }

  // Rounded body volume: distance from the silhouette, softened.
  const dist = distanceInside(mask, w, h)
  let maxDist = 1
  for (let p = 0; p < w * h; p++) if (dist[p] < 1e5 && dist[p] > maxDist) maxDist = dist[p]
  const volume = new Float32Array(w * h)
  for (let p = 0; p < w * h; p++) {
    if (!mask[p]) continue
    const t = Math.min(1, dist[p] / (maxDist * 0.55))
    volume[p] = Math.sqrt(1 - (1 - t) * (1 - t))
  }

  // Facial relief: dark local detail (eyes, brows, mouth, nostrils) sits deeper than its surroundings.
  const fine = boxBlur(lum, w, h, 1)
  const coarse = boxBlur(lum, w, h, 6)
  const height = new Float32Array(w * h)
  const unit = WORLD_H / h
  for (let p = 0; p < w * h; p++) {
    if (!mask[p]) continue
    const detail = Math.max(-0.25, Math.min(0.25, fine[p] - coarse[p]))
    height[p] = (volume[p] * BODY_DEPTH + detail * RELIEF) / unit
  }
  const smooth = boxBlur(height, w, h, 1)

  const toneMap = new Float32Array(w * h)
  for (let p = 0; p < w * h; p++) {
    toneMap[p] = Math.max(0.22, Math.min(1, (lum[p] - 0.08) * 1.15 + (fine[p] - coarse[p]) * 3.0))
  }

  return { w, h, mask, lum: fine, tone: toneMap, height: smooth, unit }
}

export async function buildPortraitDots(img, total, slice) {
  await slice()
  const { w, h, mask, lum, tone, height, unit } = analyse(img)
  await slice()

  // Sampling weight: denser where the photo is bright or has contrast, so features read as halftone.
  const weights = new Float32Array(w * h)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x
      if (!mask[p]) continue
      const gx = lum[p + 1] - lum[p - 1]
      const gy = lum[p + w] - lum[p - w]
      const edge = Math.min(1, Math.hypot(gx, gy) * 5)
      const wgt = 0.2 + 1.4 * tone[p] + 0.5 * edge
      weights[p] = wgt
    }
  }
  const cdf = new Float64Array(w * h)
  let acc = 0
  for (let p = 0; p < w * h; p++) {
    acc += weights[p]
    cdf[p] = acc
  }
  await slice()

  const pos = new Float32Array(total * 3)
  const nor = new Float32Array(total * 3)
  const rand = new Float32Array(total)
  const part = new Float32Array(total)
  const shade = new Float32Array(total * 2)
  const dotTone = new Float32Array(total)

  const aspectW = w * unit
  const heightAt = (fx, fy) => {
    const x = Math.min(w - 2, Math.max(0, fx))
    const y = Math.min(h - 2, Math.max(0, fy))
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = x - x0
    const ty = y - y0
    const p = y0 * w + x0
    return (
      height[p] * (1 - tx) * (1 - ty) + height[p + 1] * tx * (1 - ty) + height[p + w] * (1 - tx) * ty + height[p + w + 1] * tx * ty
    )
  }

  for (let i = 0; i < total; i++) {
    if ((i & 1023) === 0) await slice()
    const target = Math.random() * acc
    let lo = 0
    let hi = w * h - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < target) lo = mid + 1
      else hi = mid
    }
    const px = lo % w
    const py = (lo / w) | 0
    const fx = px + Math.random()
    const fy = py + Math.random()

    const hz = heightAt(fx, fy)
    const dx = (heightAt(fx + 1, fy) - heightAt(fx - 1, fy)) * 0.5
    const dy = (heightAt(fx, fy + 1) - heightAt(fx, fy - 1)) * 0.5
    let nx = -dx
    let ny = dy
    let nz = 1
    const len = Math.hypot(nx, ny, nz)
    nx /= len
    ny /= len
    nz /= len

    pos[i * 3] = (fx / w - 0.5) * aspectW
    pos[i * 3 + 1] = WORLD_TOP - fy * unit
    pos[i * 3 + 2] = hz * unit
    nor[i * 3] = nx
    nor[i * 3 + 1] = ny
    nor[i * 3 + 2] = nz
    rand[i] = Math.random()
    part[i] = 1
    dotTone[i] = tone[lo]
    shade[i * 2] = Math.max(-1, Math.min(1, -(Math.abs(nx) + Math.abs(ny)) * 0.6 + 0.2))
    shade[i * 2 + 1] = 0
  }

  return { pos, nor, rand, part, shade, tone: dotTone, nonBustMinX: -1, nonBustMaxX: 1 }
}
