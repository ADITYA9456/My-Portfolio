import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const TOTAL_DOTS = 66000
const CANDIDATES = TOTAL_DOTS * 5
const VOXEL = 0.022
const SHADE_R = 0.03
const FALLBACK_BYTES = 1.5e6
const FRAME_BUDGET_MS = 12
const TAN15 = Math.tan(Math.PI / 12)
const ABORT = Symbol('abort')

const rawColor = (hex) => new Color(hex).convertLinearToSRGB()

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

const BUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uSize;
uniform float uGlint;
uniform float uShine;
uniform vec2 uHead;
uniform vec3 uLight;
uniform vec3 uRingCenter;
uniform float uRingRadius;
attribute float aRand;
attribute vec2 aShade;
attribute float aPart;
varying float vAlpha;
varying float vBright;
varying float vShine;
varying float vGlint;
varying float vLens;

mat3 rotY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

void main() {
  float r2 = fract(sin(aRand * 91.7) * 43758.5453);

  float head = smoothstep(-1.3, -0.6, position.y);
  mat3 rot = rotY(uHead.x * (0.25 + 0.75 * head)) * rotX(uHead.y * head);
  vec3 pivot = vec3(0.0, -1.0, 0.0);
  vec3 home = rot * (position - pivot) + pivot;
  vec3 n = normalize(rot * normal);

  home += n * sin(uTime * 1.4 + aRand * 60.0) * 0.006;

  float t = clamp((uAssemble - aRand * 0.45) / 0.55, 0.0, 1.0);
  float e = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  float ang = aRand * 6.2831853;
  float ringR = uRingRadius * (1.0 + (r2 - 0.5) * 0.06);
  vec3 start = uRingCenter + vec3(sin(ang), cos(ang), 0.0) * ringR;
  vec3 arc = vec3(sin(aRand * 40.0 + uTime * 0.3), cos(aRand * 31.0), 0.9 + r2 * 1.4) * sin(e * 3.14159265) * 0.45;
  vec3 pos = mix(start, home, e) + arc;

  vec3 toLight = uLight - pos;
  float lit = max(dot(n, normalize(toLight)), 0.0) / (1.0 + dot(toLight, toLight) * 0.32);
  float key = max(dot(n, normalize(vec3(-0.5, 0.6, 0.7))), 0.0);
  float facing = normalize(normalMatrix * n).z;
  float rim = pow(1.0 - abs(facing), 3.0);

  float b = 0.3 + key * 0.22 + lit * 1.5 + rim * 0.14;
  b *= mix(0.55, 1.0, smoothstep(-0.3, 0.25, facing));

  float ridge = aShade.x;
  float thin = aShade.y;
  b *= ridge > 0.0 ? 1.0 + ridge * 0.7 : 1.0 + ridge * 0.5;
  b += thin * (0.26 + key * 0.3);

  float isLeaf = step(1.5, aPart) * step(aPart, 2.5);
  float isFrame = step(2.5, aPart) * step(aPart, 3.5);
  float isLens = step(3.5, aPart);
  b *= mix(1.0, 0.9, isLeaf);
  b *= mix(1.0, 0.78, max(isFrame, isLens));
  b *= mix(1.0, 0.7, isLens);
  b *= 0.7 + r2 * 0.5;

  float special = max(isLeaf, max(isFrame, isLens));
  float glint = (1.0 - smoothstep(0.0, 0.09, abs(position.x - uGlint))) * special;
  b += glint * 1.2;

  float band = home.y - home.x * 0.5 - uShine;
  float shine = exp(-band * band * 4.0);
  b += shine * 1.3;

  vAlpha = mix(0.75, 1.0, e);
  vBright = b;
  vShine = shine;
  vGlint = glint;
  vLens = isLens;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + r2 * r2 * 1.3) * (1.0 + shine * 0.6) / -mv.z;
}
`

const BUST_FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uBlue;
uniform vec3 uCream;
varying float vAlpha;
varying float vBright;
varying float vShine;
varying float vGlint;
varying float vLens;

void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = exp(-16.0 * r * r) * vAlpha;
  vec3 ink = mix(uInk, uCream, vShine * 0.6);
  ink = mix(ink, uBlue, vLens * 0.6);
  ink = mix(ink, uBlue, vGlint * 0.7);
  gl_FragColor = vec4(ink * vBright * alpha, 1.0);
}
`

const LIGHT_VERT = /* glsl */ `
uniform vec3 uLight;
uniform float uSize;
uniform float uOn;
void main() {
  vec4 mv = viewMatrix * vec4(uLight, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uOn / -mv.z;
}
`

const LIGHT_FRAG = /* glsl */ `
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  float core = 1.0 - smoothstep(0.08, 0.14, r);
  float glow = exp(-4.0 * r) * 0.45 + exp(-12.0 * r) * 0.7;
  gl_FragColor = vec4(vec3(core + glow), 1.0);
}
`

const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uOn;
attribute float aRand;
varying float vBright;
void main() {
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.03 + aRand * 0.05) + 6.0, 12.0) - 6.0;
  p.x += sin(uTime * 0.2 + aRand * 40.0) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand) / -mv.z;
  vBright = (0.1 + aRand * 0.18) * uOn;
}
`

const DUST_FRAG = /* glsl */ `
uniform vec3 uInk;
varying float vBright;
void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = exp(-16.0 * r * r);
  gl_FragColor = vec4(uInk * vBright * alpha, 1.0);
}
`

async function downloadModel(url, signal, onProgress) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Model request failed: ${res.status}`)
  const total = Number(res.headers.get('Content-Length')) || 0
  const reader = res.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    const p = total ? received / total : Math.min(0.95, received / FALLBACK_BYTES)
    onProgress(Math.min(0.99, p))
  }
  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return bytes.buffer
}

function parseModel(buffer) {
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(buffer, '', resolve, reject)
  })
}

async function buildDots(gltf, slice) {
  await slice()
  gltf.scene.updateMatrixWorld(true)
  let sourceMesh = null
  gltf.scene.traverse((o) => {
    if (!sourceMesh && o.isMesh) sourceMesh = o
  })
  if (!sourceMesh) throw new Error('Model has no mesh')

  const geometry = sourceMesh.geometry.clone()
  geometry.applyMatrix4(sourceMesh.matrixWorld)
  if (!geometry.attributes.normal) geometry.computeVertexNormals()
  await slice()
  const sampler = new MeshSurfaceSampler(new Mesh(geometry)).build()
  await slice()

  const N = CANDIDATES
  const cp = new Float32Array(N * 3)
  const cn = new Float32Array(N * 3)
  const sp = new Vector3()
  const sn = new Vector3()
  for (let i = 0; i < N; i++) {
    if ((i & 63) === 0) await slice()
    sampler.sample(sp, sn)
    cp[i * 3] = sp.x
    cp[i * 3 + 1] = sp.y
    cp[i * 3 + 2] = sp.z
    cn[i * 3] = sn.x
    cn[i * 3 + 1] = sn.y
    cn[i * 3 + 2] = sn.z
  }
  geometry.dispose()
  sourceMesh.geometry.dispose()

  // Leaf candidates skip the voxel cap.
  const isLeaf = new Uint8Array(N)
  const leafIdx = []
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < N; i++) {
    if ((i & 511) === 0) await slice()
    const x = cp[i * 3], y = cp[i * 3 + 1], z = cp[i * 3 + 2]
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
    if (x > 0.13 && y > 0.6 && (x - 0.02) ** 2 + (z + 0.06) ** 2 > 0.035) {
      isLeaf[i] = 1
      leafIdx.push(i)
    }
  }
  const leafKeep = Math.round(leafIdx.length * 0.6)

  const FRAME_DOTS = 950 + 380 + 70 * 2 + 70 * 2
  const LENS_DOTS = 1500
  const needBust = TOTAL_DOTS - FRAME_DOTS - LENS_DOTS - leafKeep

  // Even density: per-voxel cap.
  const dx = Math.floor((maxX - minX) / VOXEL) + 1
  const dy = Math.floor((maxY - minY) / VOXEL) + 1
  const dz = Math.floor((maxZ - minZ) / VOXEL) + 1
  const voxCount = new Int32Array(dx * dy * dz)
  const voxOf = new Int32Array(N).fill(-1)
  for (let i = 0; i < N; i++) {
    if ((i & 511) === 0) await slice()
    if (isLeaf[i]) continue
    const ix = Math.floor((cp[i * 3] - minX) / VOXEL)
    const iy = Math.floor((cp[i * 3 + 1] - minY) / VOXEL)
    const iz = Math.floor((cp[i * 3 + 2] - minZ) / VOXEL)
    const v = (ix * dy + iy) * dz + iz
    voxOf[i] = v
    voxCount[v]++
  }
  let maxCount = 0
  for (let v = 0; v < voxCount.length; v++) {
    if ((v & 32767) === 0) await slice()
    if (voxCount[v] > maxCount) maxCount = voxCount[v]
  }
  const hist = new Int32Array(maxCount + 2)
  for (let v = 0; v < voxCount.length; v++) {
    if ((v & 32767) === 0) await slice()
    hist[voxCount[v]]++
  }
  const target = 1.8 * needBust
  let cap = maxCount
  let sum = 0
  let atLeast = 0
  for (let c = maxCount; c >= 1; c--) atLeast += hist[c]
  // atLeast now = voxels with count >= 1; walk caps upward.
  {
    let geq = atLeast
    for (let c = 1; c <= maxCount; c++) {
      sum += geq
      if (sum >= target) {
        cap = c
        break
      }
      geq -= hist[c]
    }
  }
  await slice()

  const taken = new Int32Array(voxCount.length)
  const pool = []
  for (let i = 0; i < N; i++) {
    if ((i & 511) === 0) await slice()
    const v = voxOf[i]
    if (v < 0) continue
    if (taken[v] < cap) {
      taken[v]++
      pool.push(i)
    }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    if ((i & 511) === 0) await slice()
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }

  await slice()
  // Visor: height map of the face.
  const HX0 = -0.32, HX1 = 0.32, HY0 = 0.2, HY1 = 0.45, CELL = 0.01
  const hw = Math.round((HX1 - HX0) / CELL)
  const hh = Math.round((HY1 - HY0) / CELL)
  const height = new Float32Array(hw * hh).fill(-Infinity)
  for (let i = 0; i < N; i++) {
    if ((i & 511) === 0) await slice()
    if (cn[i * 3 + 2] < 0.2) continue
    const x = cp[i * 3], y = cp[i * 3 + 1]
    if (x < HX0 || x > HX1 || y < HY0 || y > HY1) continue
    const cx = Math.min(hw - 1, Math.floor((x - HX0) / CELL))
    const cy = Math.min(hh - 1, Math.floor((y - HY0) / CELL))
    const k = cy * hw + cx
    if (cp[i * 3 + 2] > height[k]) height[k] = cp[i * 3 + 2]
  }
  const faceHeight = (x, y) => {
    const cx = Math.floor((x - HX0) / CELL)
    const cy = Math.floor((y - HY0) / CELL)
    let best = -Infinity
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const gx = cx + i, gy = cy + j
        if (gx < 0 || gy < 0 || gx >= hw || gy >= hh) continue
        const h = height[gy * hw + gx]
        if (h > best) best = h
      }
    }
    return best
  }

  const W = 0.215
  const CLEAR = 0.028
  const topEdge = (x) => 0.378 - 0.022 * (x / W) ** 2
  const lowEdge = (x) => 0.282 + 0.032 * Math.exp(-((x / 0.034) ** 2)) + 0.026 * (x / W) ** 4

  let frontBase = -Infinity
  for (let x = -0.06; x <= 0.0601; x += 0.01) {
    for (let y = 0.3; y <= 0.3601; y += 0.01) frontBase = Math.max(frontBase, faceHeight(x, y))
  }
  const front = frontBase + CLEAR
  let wrap = Infinity
  for (let k = -Math.round(W / 0.01); k <= Math.round(W / 0.01); k++) {
    const x = k * 0.01
    if (Math.abs(x) < 0.05) continue
    let need = -Infinity
    const lo = lowEdge(x), hi = topEdge(x)
    for (let y = lo; y <= hi; y += 0.005) need = Math.max(need, faceHeight(x, y))
    if (!Number.isFinite(need)) continue
    wrap = Math.min(wrap, (front - need - 0.7 * CLEAR) / (x * x))
  }
  if (!Number.isFinite(wrap) || wrap <= 0) wrap = 2.4
  const lensZ = (x) => front - wrap * x * x

  const total = TOTAL_DOTS
  const pos = new Float32Array(total * 3)
  const nor = new Float32Array(total * 3)
  const rand = new Float32Array(total)
  const part = new Float32Array(total)
  let w = 0
  let nonBustMinX = Infinity
  let nonBustMaxX = -Infinity

  const jit = () => (Math.random() - 0.5) * 0.004
  const pushVisor = (x, y, z, kind) => {
    const nx = 2 * wrap * x
    const len = Math.hypot(nx, 1)
    pos[w * 3] = x
    pos[w * 3 + 1] = y
    pos[w * 3 + 2] = z
    nor[w * 3] = nx / len
    nor[w * 3 + 1] = 0
    nor[w * 3 + 2] = 1 / len
    part[w] = kind
    w++
  }
  for (let i = 0; i < 950; i++) {
    const x = (Math.random() * 2 - 1) * W
    const y = topEdge(x) - Math.random() ** 2 * 0.016
    pushVisor(x + jit(), y + jit() * 0.5, lensZ(x) + 0.004 + jit(), 3)
  }
  for (let i = 0; i < 380; i++) {
    const x = (Math.random() * 2 - 1) * W
    pushVisor(x + jit(), lowEdge(x) + jit() * 0.5, lensZ(x) + 0.002 + jit(), 3)
  }
  for (const side of [-1, 1]) {
    const x = side * W
    const lo = lowEdge(x), hi = topEdge(x)
    for (let i = 0; i < 70; i++) {
      pushVisor(x + jit(), lo + Math.random() * (hi - lo), lensZ(x) + jit(), 3)
    }
  }
  for (const side of [-1, 1]) {
    const x0 = side * W
    const y = topEdge(x0) - 0.008
    for (let i = 0; i < 70; i++) {
      const s = Math.random()
      pushVisor(x0 + side * 0.03 * s + jit(), y + jit() * 0.5, lensZ(x0) - 0.15 * s + jit(), 3)
    }
  }
  let lens = 0
  while (lens < LENS_DOTS) {
    const x = (Math.random() * 2 - 1) * W
    const y = 0.26 + Math.random() * 0.14
    if (y < lowEdge(x) || y > topEdge(x)) continue
    pushVisor(x, y, lensZ(x) + jit(), 4)
    lens++
  }

  const pushCandidate = (i, kind) => {
    pos[w * 3] = cp[i * 3]
    pos[w * 3 + 1] = cp[i * 3 + 1]
    pos[w * 3 + 2] = cp[i * 3 + 2]
    nor[w * 3] = cn[i * 3]
    nor[w * 3 + 1] = cn[i * 3 + 1]
    nor[w * 3 + 2] = cn[i * 3 + 2]
    part[w] = kind
    w++
  }
  for (let i = 0; i < leafKeep; i++) pushCandidate(leafIdx[i], 2)
  for (let i = 0; i < needBust; i++) pushCandidate(pool[i % pool.length], 1)
  if (w !== total) throw new Error(`Dot count mismatch: ${w}`)

  // Depth values from neighbours among the first half of candidates.
  const M = N >> 1
  const gx = Math.floor((maxX - minX) / SHADE_R) + 1
  const gy = Math.floor((maxY - minY) / SHADE_R) + 1
  const gz = Math.floor((maxZ - minZ) / SHADE_R) + 1
  const cellStart = new Int32Array(gx * gy * gz + 1)
  const cellOf = new Int32Array(M)
  for (let i = 0; i < M; i++) {
    if ((i & 511) === 0) await slice()
    const c =
      (Math.floor((cp[i * 3] - minX) / SHADE_R) * gy + Math.floor((cp[i * 3 + 1] - minY) / SHADE_R)) * gz +
      Math.floor((cp[i * 3 + 2] - minZ) / SHADE_R)
    cellOf[i] = c
    cellStart[c + 1]++
  }
  for (let c = 0; c < gx * gy * gz; c++) {
    if ((c & 32767) === 0) await slice()
    cellStart[c + 1] += cellStart[c]
  }
  const fill = cellStart.slice(0, -1)
  const items = new Int32Array(M)
  for (let i = 0; i < M; i++) {
    if ((i & 8191) === 0) await slice()
    items[fill[cellOf[i]]++] = i
  }

  const ridgeRaw = new Float32Array(total)
  const counts = new Float32Array(total)
  const R2 = SHADE_R * SHADE_R
  for (let d = 0; d < total; d++) {
    if ((d & 15) === 0) await slice()
    const px = pos[d * 3], py = pos[d * 3 + 1], pz = pos[d * 3 + 2]
    const cx = Math.floor((px - minX) / SHADE_R)
    const cy = Math.floor((py - minY) / SHADE_R)
    const cz = Math.floor((pz - minZ) / SHADE_R)
    let count = 0, ox = 0, oy = 0, oz = 0
    for (let ix = Math.max(0, cx - 1); ix <= Math.min(gx - 1, cx + 1); ix++) {
      for (let iy = Math.max(0, cy - 1); iy <= Math.min(gy - 1, cy + 1); iy++) {
        for (let iz = Math.max(0, cz - 1); iz <= Math.min(gz - 1, cz + 1); iz++) {
          const c = (ix * gy + iy) * gz + iz
          for (let k = cellStart[c]; k < cellStart[c + 1]; k++) {
            const q = items[k] * 3
            const ex = cp[q] - px, ey = cp[q + 1] - py, ez = cp[q + 2] - pz
            if (ex * ex + ey * ey + ez * ez <= R2) {
              count++
              ox += ex
              oy += ey
              oz += ez
            }
          }
        }
      }
    }
    counts[d] = count
    if (count > 0) {
      const avg = (ox * nor[d * 3] + oy * nor[d * 3 + 1] + oz * nor[d * 3 + 2]) / count
      ridgeRaw[d] = -avg / SHADE_R
    }
  }
  await slice()
  const absSorted = Float32Array.from(ridgeRaw, Math.abs).sort()
  const p90 = absSorted[Math.floor(total * 0.9)] || 1
  await slice()
  const countSorted = counts.slice().sort()
  const median = countSorted[total >> 1] || 1
  await slice()
  const shade = new Float32Array(total * 2)
  for (let d = 0; d < total; d++) {
    shade[d * 2] = Math.max(-1, Math.min(1, ridgeRaw[d] / p90))
    shade[d * 2 + 1] = Math.max(0, Math.min(1, 1 - counts[d] / (0.55 * median)))
  }

  // Placement into world space.
  for (let d = 0; d < total; d++) {
    pos[d * 3] *= 2.8
    pos[d * 3 + 1] = pos[d * 3 + 1] * 2.8 - 0.68
    pos[d * 3 + 2] *= 2.8
    rand[d] = Math.random()
    if (part[d] >= 2) {
      if (pos[d * 3] < nonBustMinX) nonBustMinX = pos[d * 3]
      if (pos[d * 3] > nonBustMaxX) nonBustMaxX = pos[d * 3]
    }
  }

  return { pos, nor, rand, part, shade, nonBustMinX, nonBustMaxX }
}

export function createBustScene({ container, url, reducedMotion, onProgress, onReady, onError }) {
  let disposed = false
  const abort = new AbortController()
  const cleanups = []
  const disposables = []

  const slice = (() => {
    let start = performance.now()
    return async () => {
      if (disposed) throw ABORT
      if (performance.now() - start > FRAME_BUDGET_MS) {
        await tick()
        if (disposed) throw ABORT
        start = performance.now()
      }
    }
  })()

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let renderer = null

  const dispose = () => {
    if (disposed) return
    disposed = true
    abort.abort()
    for (const fn of cleanups.splice(0)) fn()
    for (const d of disposables.splice(0)) d.dispose()
    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      renderer = null
    }
  }

  const run = async () => {
    const buffer = await downloadModel(url, abort.signal, (p) => {
      if (!disposed) onProgress(p)
    })
    if (disposed) return
    const gltf = await parseModel(buffer)
    await slice()
    const data = await buildDots(gltf, slice)
    if (disposed) return

    renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x0f110d, 1)
    container.appendChild(renderer.domElement)

    onProgress(1)
    if (!reducedMotion) {
      await new Promise((resolve) => setTimeout(resolve, 380))
      if (disposed) return
    }

    const scene = new Scene()
    const camera = new PerspectiveCamera(30, 1, 0.1, 100)
    const target = new Vector3(0, -0.15, 0)

    const lightPos = new Vector3(-1.4, 1.2, 1.6)
    const ringCenter = new Vector3(0, -0.15, 0)
    const head = new Vector2()
    const uHead = new Vector2()
    const ink = rawColor('#c9d4b8')

    const bustGeo = new BufferGeometry()
    bustGeo.setAttribute('position', new Float32BufferAttribute(data.pos, 3))
    bustGeo.setAttribute('normal', new Float32BufferAttribute(data.nor, 3))
    bustGeo.setAttribute('aRand', new Float32BufferAttribute(data.rand, 1))
    bustGeo.setAttribute('aShade', new Float32BufferAttribute(data.shade, 2))
    bustGeo.setAttribute('aPart', new Float32BufferAttribute(data.part, 1))
    const bustUniforms = {
      uTime: { value: 0 },
      uAssemble: { value: reducedMotion ? 1 : 0 },
      uSize: { value: 26 * dpr },
      uGlint: { value: -9 },
      uShine: { value: 99 },
      uHead: { value: uHead },
      uLight: { value: lightPos },
      uRingCenter: { value: ringCenter },
      uRingRadius: { value: 1 },
      uInk: { value: ink },
      uBlue: { value: rawColor('#7fa8a3') },
      uCream: { value: rawColor('#f0e5c8') },
    }
    const blend = { transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending }
    const bustMat = new ShaderMaterial({ uniforms: bustUniforms, vertexShader: BUST_VERT, fragmentShader: BUST_FRAG, ...blend })
    const bust = new Points(bustGeo, bustMat)
    bust.frustumCulled = false

    const lightGeo = new BufferGeometry()
    lightGeo.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3))
    const lightUniforms = { uLight: { value: lightPos }, uSize: { value: 240 * dpr }, uOn: { value: reducedMotion ? 1 : 0 } }
    const lightMat = new ShaderMaterial({ uniforms: lightUniforms, vertexShader: LIGHT_VERT, fragmentShader: LIGHT_FRAG, ...blend })
    const lightPoint = new Points(lightGeo, lightMat)
    lightPoint.frustumCulled = false

    const DUST = 900
    const dustPos = new Float32Array(DUST * 3)
    const dustRand = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() * 2 - 1) * 9
      dustPos[i * 3 + 1] = (Math.random() * 2 - 1) * 6
      dustPos[i * 3 + 2] = -6 + Math.random() * 8
      dustRand[i] = Math.random()
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3))
    dustGeo.setAttribute('aRand', new Float32BufferAttribute(dustRand, 1))
    const dustUniforms = {
      uTime: bustUniforms.uTime,
      uSize: { value: 22 * dpr },
      uOn: { value: reducedMotion ? 1 : 0 },
      uInk: { value: ink },
    }
    const dustMat = new ShaderMaterial({ uniforms: dustUniforms, vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, ...blend })
    const dustPoints = new Points(dustGeo, dustMat)
    dustPoints.frustumCulled = false

    scene.add(dustPoints, bust, lightPoint)
    disposables.push(bustGeo, bustMat, lightGeo, lightMat, dustGeo, dustMat)

    let width = 1
    let height = 1
    const resize = () => {
      width = Math.max(1, container.clientWidth)
      height = Math.max(1, container.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const distance = Math.max(2.35 / TAN15, 1.7 / (TAN15 * camera.aspect))
      camera.position.set(0, -0.15, distance)
      camera.lookAt(target)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      bustUniforms.uRingRadius.value = 92 * ((2 * distance * TAN15) / height)
      dirty = true
    }

    const pointer = { has: false, down: false, x: 0, y: 0, type: 'mouse', lastTouch: -Infinity }
    const ndc = new Vector3()
    const dir = new Vector3()
    const goal = new Vector3()
    const headGoal = new Vector2()

    let t = 0
    let last = 0
    let rafId = 0
    let inView = true
    let started = false
    let readyFired = false
    let dirty = true

    const render = () => renderer.render(scene, camera)

    const update = (dt, now) => {
      if (!reducedMotion) t += dt
      bustUniforms.uTime.value = reducedMotion ? 0 : t
      const assemble = reducedMotion ? 1 : Math.min(1, t / 2.6)
      bustUniforms.uAssemble.value = assemble

      if (!reducedMotion) {
        const lk = 1 - Math.exp(-dt * 4)
        lightUniforms.uOn.value += (Math.min(1, 1.6 * assemble) - lightUniforms.uOn.value) * lk
        dustUniforms.uOn.value += (1 - dustUniforms.uOn.value) * (1 - Math.exp(-dt * 0.8))

        let shine = 99
        if (t >= 2.34 && t <= 4.54) {
          const s = (t - 2.34) / 2.2
          shine = 2.8 - (1 - (1 - s) * (1 - s)) * 7.4
        }
        bustUniforms.uShine.value = shine
        let glint = -9
        if (t >= 4.6) {
          const ph = (t - 4.6) % 4.2
          if (ph < 0.9) {
            const a = data.nonBustMinX - 0.15
            const b = data.nonBustMaxX + 0.15
            glint = a + (b - a) * (ph / 0.9)
          }
        }
        bustUniforms.uGlint.value = glint
      }

      let active = false
      if (pointer.has) {
        const rect = container.getBoundingClientRect()
        ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -((pointer.y - rect.top) / rect.height) * 2 + 1, 0.5)
        const touchOk = pointer.type !== 'touch' || pointer.down || now - pointer.lastTouch < 1500
        active = touchOk && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1
      }
      const orbitT = reducedMotion ? 0 : t
      if (active) {
        dir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
        goal.copy(camera.position).addScaledVector(dir, (2.6 - camera.position.z) / dir.z)
        headGoal.set(0.5 * ndc.x, 0.18 * ndc.y)
        const lk = reducedMotion ? 1 : 1 - Math.exp(-dt * 5)
        lightPos.lerp(goal, lk)
        if (!reducedMotion) head.lerp(headGoal, 1 - Math.exp(-dt * 3))
      } else {
        goal.set(1.9 * Math.sin(0.45 * orbitT), 0.5 + 0.8 * Math.cos(0.33 * orbitT), 2.6)
        const lk = reducedMotion ? 1 : 1 - Math.exp(-dt * 5)
        lightPos.lerp(goal, lk)
        if (!reducedMotion) {
          headGoal.set(0.35 * Math.sin(0.45 * orbitT), 0.12 * Math.cos(0.33 * orbitT))
          head.lerp(headGoal, 1 - Math.exp(-dt * 1.5))
        }
      }
      uHead.set(head.x, -head.y)
      return assemble
    }

    const frame = (now) => {
      rafId = 0
      if (disposed || !canRun()) return
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      const assemble = update(dt, now)
      dirty = false
      render()
      if (!readyFired && assemble > 0.55) {
        readyFired = true
        onReady()
      }
      if (!reducedMotion) rafId = requestAnimationFrame(frame)
    }

    const canRun = () => started && inView && !document.hidden
    const sync = () => {
      if (canRun()) {
        if (!rafId && (!reducedMotion || dirty)) rafId = requestAnimationFrame(frame)
      } else {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
        last = 0
      }
    }
    const requestFrame = () => {
      dirty = true
      sync()
    }

    resize()
    // Compile shaders without blocking, then upload buffers while the canvas is hidden.
    if (renderer.extensions.has('KHR_parallel_shader_compile')) {
      await renderer.compileAsync(scene, camera)
      if (disposed) return
    }
    renderer.domElement.style.visibility = 'hidden'
    render()
    renderer.domElement.style.visibility = ''

    const ro = new ResizeObserver(() => {
      resize()
      requestFrame()
    })
    ro.observe(container)
    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting
      sync()
    })
    io.observe(container)
    const onVisibility = () => sync()
    const onMove = (e) => {
      pointer.has = true
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.type = e.pointerType || 'mouse'
      if (pointer.type === 'touch') {
        pointer.down = e.type !== 'pointerup' && e.type !== 'pointercancel'
        pointer.lastTouch = performance.now()
      }
      if (reducedMotion && inView) requestFrame()
    }
    const onUp = (e) => {
      if (e.pointerType === 'touch') {
        pointer.down = false
        pointer.lastTouch = performance.now()
      }
    }
    const onLeave = () => {
      pointer.has = false
      if (reducedMotion && inView) requestFrame()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    cleanups.push(() => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    })

    started = true
    sync()
  }

  run().catch((err) => {
    if (disposed || err === ABORT || err?.name === 'AbortError') return
    console.error('[hero] failed to start', err)
    onError()
    dispose()
  })

  return { dispose }
}
