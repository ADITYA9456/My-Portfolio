import { BufferGeometry, Float32BufferAttribute, Mesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const SHADE_R = 0.03
const HEIGHT = 4.3
const BUST_TOP = 1.75

export async function loadModel(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Model request failed: ${res.status}`)
  const buffer = await res.arrayBuffer()
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(buffer, '', resolve, reject)
  })
}

function mergeBust(gltf, cutFraction, hide) {
  gltf.scene.updateMatrixWorld(true)
  const parts = []
  gltf.scene.traverse((o) => {
    if (!o.isMesh || (hide && hide.test(o.name))) return
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()
    g.applyMatrix4(o.matrixWorld)
    if (!g.attributes.normal) g.computeVertexNormals()
    parts.push(g)
  })
  if (!parts.length) throw new Error('Model has no mesh')

  let top = -Infinity
  let bottom = Infinity
  for (const g of parts) {
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      top = Math.max(top, p.getY(i))
      bottom = Math.min(bottom, p.getY(i))
    }
  }
  const cutY = cutFraction ? top - (top - bottom) * cutFraction : bottom

  const pos = []
  const nor = []
  for (const g of parts) {
    const p = g.attributes.position
    const n = g.attributes.normal
    for (let i = 0; i + 2 < p.count; i += 3) {
      if ((p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3 < cutY) continue
      for (let k = 0; k < 3; k++) {
        pos.push(p.getX(i + k), p.getY(i + k), p.getZ(i + k))
        nor.push(n.getX(i + k), n.getY(i + k), n.getZ(i + k))
      }
    }
    g.dispose()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(nor, 3))
  geometry.computeBoundingBox()
  return geometry
}

export async function buildBustDots(gltf, total, slice, cutFraction = 0, hide = null) {
  await slice()
  const geometry = mergeBust(gltf, cutFraction, hide)
  const box = geometry.boundingBox
  const scale = HEIGHT / (box.max.y - box.min.y)
  const cx = (box.max.x + box.min.x) / 2
  const cz = (box.max.z + box.min.z) / 2
  await slice()
  const headCount = total
  const sampler = new MeshSurfaceSampler(new Mesh(geometry)).build()

  const pos = new Float32Array(total * 3)
  const nor = new Float32Array(total * 3)
  const sp = new Vector3()
  const sn = new Vector3()
  const CAND = headCount * 3
  const cp = new Float32Array(CAND * 3)
  const cn = new Float32Array(CAND * 3)
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < CAND; i++) {
    if ((i & 63) === 0) await slice()
    sampler.sample(sp, sn)
    const x = (sp.x - cx) * scale
    const y = BUST_TOP - (box.max.y - sp.y) * scale
    const z = (sp.z - cz) * scale
    cp[i * 3] = x
    cp[i * 3 + 1] = y
    cp[i * 3 + 2] = z
    cn[i * 3] = sn.x
    cn[i * 3 + 1] = sn.y
    cn[i * 3 + 2] = sn.z
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }
  geometry.dispose()

  // Hair: the avatar's own hair is hidden, so grow curly strands from the scalp samples.
  let zc = 0
  let zn = 0
  for (let i = 0; i < CAND; i++) {
    if (maxY - cp[i * 3 + 1] < 1) {
      zc += cp[i * 3 + 2]
      zn++
    }
  }
  zc = zn ? zc / zn : 0
  const hair = []
  const skin = []
  for (let i = 0; i < CAND; i++) {
    const rel = maxY - cp[i * 3 + 1]
    const front = cp[i * 3 + 2] > zc + 0.22
    const isHair = rel < 1.25 && (front ? rel < 0.5 : true) && Math.abs(cp[i * 3]) < 1.35
    if (isHair) hair.push(i)
    else skin.push(i)
  }
  const hairCount = hair.length
    ? Math.min(hair.length, Math.round(total * (hide ? 0.24 : 0)))
    : 0
  const order = hair.slice(0, hairCount).concat(skin)
  const ridgeBoost = new Float32Array(total)
  for (let d = 0; d < headCount; d++) {
    const i = order[d % order.length]
    let x = cp[i * 3]
    let y = cp[i * 3 + 1]
    let z = cp[i * 3 + 2]
    if (d < hairCount) {
      const r = Math.random()
      const lift = 0.03 + 0.14 * r * r
      const k = (x * 11 + y * 13 + z * 7) * 9 + r * 6
      x += cn[i * 3] * lift + Math.sin(k) * 0.055
      y += cn[i * 3 + 1] * lift + Math.cos(k * 1.3) * 0.055 + 0.03
      z += cn[i * 3 + 2] * lift + Math.sin(k * 0.7) * 0.055
      ridgeBoost[d] = 0.6
    }
    pos[d * 3] = x
    pos[d * 3 + 1] = y
    pos[d * 3 + 2] = z
    nor[d * 3] = cn[i * 3]
    nor[d * 3 + 1] = cn[i * 3 + 1]
    nor[d * 3 + 2] = cn[i * 3 + 2]
  }

  // Surface relief and thin-area shading from neighbouring head samples.
  const M = CAND
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
  for (let d = 0; d < headCount; d++) {
    if ((d & 15) === 0) await slice()
    const px = pos[d * 3], py = pos[d * 3 + 1], pz = pos[d * 3 + 2]
    const cxI = Math.floor((px - minX) / SHADE_R)
    const cyI = Math.floor((py - minY) / SHADE_R)
    const czI = Math.floor((pz - minZ) / SHADE_R)
    let count = 0, ox = 0, oy = 0, oz = 0
    for (let ix = Math.max(0, cxI - 1); ix <= Math.min(gx - 1, cxI + 1); ix++) {
      for (let iy = Math.max(0, cyI - 1); iy <= Math.min(gy - 1, cyI + 1); iy++) {
        for (let iz = Math.max(0, czI - 1); iz <= Math.min(gz - 1, czI + 1); iz++) {
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
  const absSorted = Float32Array.from(ridgeRaw.subarray(0, headCount), Math.abs).sort()
  const p90 = absSorted[Math.floor(headCount * 0.9)] || 1
  const shade = new Float32Array(total * 2)
  for (let d = 0; d < headCount; d++) {
    shade[d * 2] = Math.max(-1, Math.min(1, ridgeRaw[d] / p90 + ridgeBoost[d]))
    shade[d * 2 + 1] = 0
  }

  const rand = new Float32Array(total)
  const part = new Float32Array(total).fill(1)
  for (let d = 0; d < total; d++) rand[d] = Math.random()

  return { pos, nor, rand, part, shade, nonBustMinX: -1, nonBustMaxX: 1 }
}
