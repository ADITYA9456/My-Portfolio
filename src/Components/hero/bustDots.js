import { Mesh, Vector3 } from 'three'
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

export async function buildBustDots(gltf, total, slice) {
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
  geometry.computeBoundingBox()
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

  for (let d = 0; d < headCount; d++) {
    pos[d * 3] = cp[d * 3]
    pos[d * 3 + 1] = cp[d * 3 + 1]
    pos[d * 3 + 2] = cp[d * 3 + 2]
    nor[d * 3] = cn[d * 3]
    nor[d * 3 + 1] = cn[d * 3 + 1]
    nor[d * 3 + 2] = cn[d * 3 + 2]
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
    shade[d * 2] = Math.max(-1, Math.min(1, ridgeRaw[d] / p90))
    shade[d * 2 + 1] = 0
  }

  const rand = new Float32Array(total)
  const part = new Float32Array(total).fill(1)
  for (let d = 0; d < total; d++) rand[d] = Math.random()

  return { pos, nor, rand, part, shade, nonBustMinX: -1, nonBustMaxX: 1 }
}
