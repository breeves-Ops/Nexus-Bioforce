import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DataTexture,
  FloatType,
  HalfFloatType,
  NormalBlending,
  RGBAFormat,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  SubtractiveBlending,
  TextureLoader,
  Vector2,
  Vector3,
  VideoTexture,
} from 'three'
import { GLTFLoader, GPUComputationRenderer } from 'three-stdlib'
import AmbientCloud from './AmbientCloud'
import { logger } from '../../utils/logger'

const PARTICLE_SYSTEM_TAG = 'ParticleSystem'

const ORIGIN = new Vector3(0, 0, 0)

const POSITION_SIM_SHADER = `
uniform sampler2D uFeather;
uniform vec3  uMouse3D;
uniform float uInteractionRadius;
uniform float uInteractionForce;
uniform float uSpeed;
uniform float uCurlIntensity;
uniform float uTime;
uniform float uRespawnRate;
uniform int   uShape;
uniform float uAspect;
uniform float uDisplacement;
uniform float uPullForce;
uniform float uScaleX;
uniform float uScaleY;
uniform float uMorphHD;
uniform vec3  uWindForce;
uniform sampler2D uCustomMeshTex;
uniform bool  uHasCustomMesh;
uniform bool  uReset;

// ── Simplex Noise ──────────────────────────────────────────────────────────
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x2 = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x2) - 0.5;
  vec3 ox = floor(x2 + 0.5);
  vec3 a0 = x2 - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec3 snoiseVec3(vec3 x) {
  return vec3(snoise(vec2(x.x,x.y)), snoise(vec2(x.y,x.z)), snoise(vec2(x.z,x.x)));
}
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx=vec3(e,0,0), dy=vec3(0,e,0), dz=vec3(0,0,e);
  float x = snoiseVec3(p-dy).z - snoiseVec3(p+dy).z - snoiseVec3(p-dz).y + snoiseVec3(p+dz).y;
  float y = snoiseVec3(p-dz).x - snoiseVec3(p+dz).x - snoiseVec3(p-dx).z + snoiseVec3(p+dx).z;
  float z = snoiseVec3(p-dx).y - snoiseVec3(p+dx).y - snoiseVec3(p-dy).x + snoiseVec3(p+dy).x;
  return normalize(vec3(x,y,z) / (2.0*e));
}

// ── Shape Target Positions ─────────────────────────────────────────────────
void getShape(vec2 uv, out vec3 pos, out vec3 norm) {
  if (uShape == 0) { // Plane
    pos  = vec3((uv.x-0.5)*2.0*uScaleX, (uv.y-0.5)*2.0*uScaleY, 0.0);
    norm = vec3(0,0,1);
  } else if (uShape == 1) { // Sphere
    float theta = uv.x*6.28318;
    float phi   = (uv.y-0.5)*3.14159;
    float r = 1.2;
    pos  = vec3(r*cos(phi)*cos(theta), r*sin(phi), r*cos(phi)*sin(theta));
    norm = normalize(pos);
  } else if (uShape == 2) { // Cylinder
    float theta = uv.x*6.28318;
    pos  = vec3(0.8*cos(theta), (uv.y-0.5)*2.5, 0.8*sin(theta));
    norm = normalize(vec3(cos(theta),0,sin(theta)));
  } else if (uShape == 3) { // Torus
    float theta = uv.x*6.28318;
    float phi   = uv.y*6.28318;
    float R=1.0, r=0.3;
    pos  = vec3((R+r*cos(phi))*cos(theta), r*sin(phi), (R+r*cos(phi))*sin(theta));
    norm = normalize(vec3(cos(phi)*cos(theta), sin(phi), cos(phi)*sin(theta)));
  } else if (uShape == 4) { // Explode
    float rx = fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453)*2.0-1.0;
    float ry = fract(sin(dot(uv,vec2(93.9898,67.345)))*43758.5453)*2.0-1.0;
    float rz = fract(sin(dot(uv,vec2(43.1428,12.897)))*43758.5453)*2.0-1.0;
    pos  = normalize(vec3(rx,ry,rz))*3.0;
    norm = normalize(pos);
  } else if (uShape == 5 && uHasCustomMesh) { // Custom GLTF
    pos  = texture2D(uCustomMeshTex, uv).xyz;
    norm = normalize(pos);
  } else {
    pos  = vec3((uv.x-0.5)*2.0*uScaleX, (uv.y-0.5)*2.0*uScaleY, 0.0);
    norm = vec3(0,0,1);
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 current = texture2D(texturePosition, uv);
  vec3 currentPos = current.xyz;

  vec3 tPos, tNorm;
  getShape(uv, tPos, tNorm);

  float luma = dot(texture2D(uFeather, uv).rgb, vec3(0.299,0.587,0.114));
  tPos += tNorm * (luma * uDisplacement);

  if (uReset || current.w < 0.1) { currentPos = tPos; }

  float activePull = mix(uPullForce, 0.95, uMorphHD);
  vec3 velocity = (tPos - currentPos) * activePull;

  vec3 noise = curlNoise(currentPos * uCurlIntensity + uTime * 0.1) * uSpeed * 0.02 * (1.0 - uMorphHD);
  vec3 constantWind = uWindForce * 0.02 * (1.0 - uMorphHD);
  velocity += noise + constantWind;

  float dist = length(currentPos - uMouse3D);
  if (dist < uInteractionRadius && dist > 0.0) {
    float falloff = pow(1.0 - (dist / uInteractionRadius), 2.0);
    velocity += normalize(currentPos - uMouse3D) * falloff * uInteractionForce * 0.2;
  }

  currentPos += velocity;

  float life = current.w + 1.0;
  float rand = fract(sin(dot(uv, vec2(12.9898,78.233)) + uTime) * 43758.5453);
  if (rand < uRespawnRate) { currentPos = tPos; life = 1.0; }

  gl_FragColor = vec4(currentPos, life);
}
`

const PARTICLE_VERTEX_SHADER = `
uniform sampler2D uPositions;
uniform sampler2D uFeather;
uniform float uSize;
uniform float uBrightness;
uniform float uAmbientLight;
uniform float uDirLightIntensity;
uniform vec3  uLightDir;
uniform int   uShape;
uniform float uDepthShadow;
uniform sampler2D uCustomMeshTex;
uniform bool  uHasCustomMesh;

attribute vec2 reference;
varying vec3 vColor;
varying float vAlpha;

void getShapeNorm(vec2 uv, out vec3 norm) {
  if (uShape == 0) { norm = vec3(0,0,1); }
  else if (uShape == 1) {
    float theta = uv.x*6.28318, phi = (uv.y-0.5)*3.14159;
    norm = normalize(vec3(cos(phi)*cos(theta), sin(phi), cos(phi)*sin(theta)));
  } else if (uShape == 2) {
    float theta = uv.x*6.28318;
    norm = normalize(vec3(cos(theta),0,sin(theta)));
  } else if (uShape == 3) {
    float theta = uv.x*6.28318, phi = uv.y*6.28318;
    norm = normalize(vec3(cos(phi)*cos(theta), sin(phi), cos(phi)*sin(theta)));
  } else if (uShape == 4) { norm = vec3(0,0,1); }
  else if (uShape == 5 && uHasCustomMesh) {
    vec3 p = texture2D(uCustomMeshTex, uv).xyz;
    norm = (length(p) > 0.0) ? normalize(p) : vec3(0,0,1);
  } else { norm = vec3(0,0,1); }
}

void main() {
  vec4 pos = texture2D(uPositions, reference);
  vec3 worldPos = pos.xyz;

  vec3 tNorm;
  getShapeNorm(reference, tNorm);

  float diff = max(dot(tNorm, normalize(uLightDir)), 0.0);
  vec3 lighting = vec3(uAmbientLight) + vec3(1.0) * diff * uDirLightIntensity;

  float depthMul = clamp(1.0 + worldPos.z * uDepthShadow, 0.2, 1.5);
  lighting *= depthMul;

  vec4 imgColor = texture2D(uFeather, reference);
  vColor = imgColor.rgb * lighting * uBrightness;
  vAlpha = imgColor.a;

  vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
  gl_PointSize = uSize * (1.0 / -mvPosition.z);
  gl_Position  = projectionMatrix * mvPosition;
}
`

const PARTICLE_FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;
uniform float uOpacity;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, dist);
  gl_FragColor = vec4(vColor, alpha * vAlpha * uOpacity);
}
`

function setWindVector(n, e, t) {
  t.set(0, 0, 0)
  if (n === 'Up') {
    t.set(0, e, 0)
  } else if (n === 'Down') {
    t.set(0, -e, 0)
  } else if (n === 'Left') {
    t.set(-e, 0, 0)
  } else if (n === 'Right') {
    t.set(e, 0, 0)
  } else if (n === 'Forward') {
    t.set(0, 0, e)
  } else if (n === 'Reverse') {
    t.set(0, 0, -e)
  }
}

export default function ParticleSystem({ featherUrl, gltfUrl, gridSize, guiParams }) {
  var w
  const { gl, size } = useThree()
  const a = useRef(new Vector3(0, 0, 0))
  const o = useRef(new Vector2(0, 0))
  const c = useRef(null)
  const f = useRef(-1)
  const d = useRef(0)
  const p = useRef(new Vector3())
  const [h, m] = useState(null)
  const [y, S] = useState(1)
  const [_, v] = useState(null)
  useEffect(() => {
    if (!featherUrl) {
      const L = document.createElement('canvas')
      L.width = L.height = 512
      const H = L.getContext('2d')
      const j = H.createRadialGradient(256, 256, 0, 256, 256, 280)
      j.addColorStop(0, 'rgba(220,230,235,1.0)')
      j.addColorStop(0.4, 'rgba(140,165,175,0.85)')
      j.addColorStop(0.75, 'rgba(60,80,90,0.6)')
      j.addColorStop(1, 'rgba(4,10,12,0.0)')
      H.fillStyle = j
      H.fillRect(0, 0, 512, 512)
      const Z = new CanvasTexture(L)
      Z.colorSpace = SRGBColorSpace
      S(1)
      m(Z)
      return
    }
    let D = featherUrl
    let P
    if (featherUrl.startsWith('nexus-media:')) {
      const L = featherUrl.indexOf(':', 12)
      P = featherUrl.slice(12, L) === 'video'
      D = featherUrl.slice(L + 1)
    } else {
      P = /\.(mp4|webm|ogg)$/i.test(featherUrl)
    }
    if (P) {
      const L = document.createElement('video')
      L.src = D
      L.crossOrigin = 'Anonymous'
      L.loop = true
      L.muted = true
      L.playsInline = true
      const H = () => S(L.videoWidth / (L.videoHeight || 1))
      L.addEventListener('loadedmetadata', H)
      L.play()
        .then(() => {
          const j = new VideoTexture(L)
          j.colorSpace = SRGBColorSpace
          m(j)
          logger.info(PARTICLE_SYSTEM_TAG, 'Video texture loaded')
        })
        .catch((j) => {
          logger.warn(PARTICLE_SYSTEM_TAG, `Video play() failed: ${j.message}`)
        })
      return () => {
        L.removeEventListener('loadedmetadata', H)
        L.pause()
        L.removeAttribute('src')
        L.load()
      }
    } else {
      new TextureLoader().setCrossOrigin('Anonymous').load(
        D,
        (L) => {
          var H
          var j
          L.colorSpace = SRGBColorSpace
          if (L.image) {
            S(L.image.width / (L.image.height || 1))
          }
          m(L)
          logger.info(
            PARTICLE_SYSTEM_TAG,
            `Image texture loaded (${(H = L.image) == null ? undefined : H.width}x${(j = L.image) == null ? undefined : j.height})`,
          )
        },
        undefined,
        (L) =>
          logger.error(
            PARTICLE_SYSTEM_TAG,
            `Texture load error: ${(L == null ? undefined : L.message) ?? L}`,
          ),
      )
    }
  }, [featherUrl])
  useEffect(() => {
    if (!gltfUrl) {
      v(null)
      return
    }
    new GLTFLoader().load(
      gltfUrl,
      (P) => {
        const L = []
        P.scene.traverse((ee) => {
          if (ee.isMesh) {
            const G = ee.geometry.attributes.position
            if (G) {
              const B = new Vector3()
              ee.updateMatrixWorld(true)
              for (let ne = 0; ne < G.count; ne++) {
                B.fromBufferAttribute(G, ne).applyMatrix4(ee.matrixWorld)
                L.push(B.clone())
              }
            }
          }
        })
        if (!L.length) {
          logger.warn(PARTICLE_SYSTEM_TAG, 'GLTF has no mesh vertices')
          return
        }
        const H = new Box3().setFromPoints(L)
        const j = new Vector3()
        H.getCenter(j)
        const Z = new Vector3()
        H.getSize(Z)
        const $ = 2 / (Math.max(Z.x, Z.y, Z.z) || 1)
        const W = new Float32Array(gridSize * gridSize * 4)
        for (let ee = 0; ee < gridSize * gridSize; ee++) {
          const G = L[ee % L.length]
          W[ee * 4] = (G.x - j.x) * $
          W[ee * 4 + 1] = (G.y - j.y) * $
          W[ee * 4 + 2] = (G.z - j.z) * $
          W[ee * 4 + 3] = 1
        }
        const X = new DataTexture(W, gridSize, gridSize, RGBAFormat, FloatType)
        X.needsUpdate = true
        v(X)
        logger.info(PARTICLE_SYSTEM_TAG, `GLTF loaded: ${L.length} vertices → DataTexture`)
      },
      undefined,
      (P) => logger.error(PARTICLE_SYSTEM_TAG, `GLTF load error: ${P.message}`),
    )
  }, [gltfUrl, gridSize])
  const { posData, referenceUv } = useMemo(() => {
    const D = new Float32Array(gridSize * gridSize * 4)
    const P = new Float32Array(gridSize * gridSize * 2)
    for (let L = 0; L < gridSize; L++) {
      for (let H = 0; H < gridSize; H++) {
        const j = L * gridSize + H
        P[j * 2] = H / gridSize
        P[j * 2 + 1] = 1 - L / gridSize
      }
    }
    return {
      posData: D,
      referenceUv: P,
    }
  }, [gridSize])
  const { gpuCompute, posVar } = useMemo(() => {
    logger.info(
      PARTICLE_SYSTEM_TAG,
      `Init GPUComputationRenderer ${gridSize}×${gridSize} = ${gridSize * gridSize} particles`,
    )
    const D = new GPUComputationRenderer(gridSize, gridSize, gl)
    if (!gl.capabilities.isWebGL2) {
      D.setDataType(HalfFloatType)
    }
    const P = D.createTexture()
    P.image.data = posData
    const L = D.addVariable('texturePosition', POSITION_SIM_SHADER, P)
    L.wrapS = RepeatWrapping
    L.wrapT = RepeatWrapping
    L.material.uniforms = {
      uFeather: {
        value: null,
      },
      uMouse3D: {
        value: new Vector3(),
      },
      uInteractionRadius: {
        value: 0.3,
      },
      uInteractionForce: {
        value: 1.5,
      },
      uSpeed: {
        value: 0,
      },
      uCurlIntensity: {
        value: 0,
      },
      uTime: {
        value: 0,
      },
      uRespawnRate: {
        value: 0,
      },
      uShape: {
        value: 0,
      },
      uAspect: {
        value: 1,
      },
      uDisplacement: {
        value: 0.02,
      },
      uPullForce: {
        value: 0.5,
      },
      uScaleX: {
        value: 1,
      },
      uScaleY: {
        value: 1,
      },
      uMorphHD: {
        value: 0.85,
      },
      uWindForce: {
        value: new Vector3(),
      },
      uCustomMeshTex: {
        value: null,
      },
      uHasCustomMesh: {
        value: false,
      },
      uReset: {
        value: false,
      },
    }
    D.setVariableDependencies(L, [L])
    const H = D.init()
    if (H) {
      logger.error(PARTICLE_SYSTEM_TAG, `GPUComputationRenderer init error: ${H}`)
    }
    return {
      gpuCompute: D,
      posVar: L,
    }
  }, [gl, posData, gridSize])
  const R = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: PARTICLE_VERTEX_SHADER,
        fragmentShader: PARTICLE_FRAGMENT_SHADER,
        uniforms: {
          uPositions: {
            value: null,
          },
          uFeather: {
            value: null,
          },
          uSize: {
            value: 4.5,
          },
          uOpacity: {
            value: 0.85,
          },
          uBrightness: {
            value: 1.3,
          },
          uAmbientLight: {
            value: 0.9,
          },
          uDirLightIntensity: {
            value: 1,
          },
          uLightDir: {
            value: new Vector3(1, 1.2, 0.8),
          },
          uShape: {
            value: 0,
          },
          uDepthShadow: {
            value: 0.4,
          },
          uCustomMeshTex: {
            value: null,
          },
          uHasCustomMesh: {
            value: false,
          },
        },
        blending: NormalBlending,
        depthWrite: false,
        transparent: true,
      }),
    [],
  )
  const N = useMemo(() => {
    const D = new BufferGeometry()
    D.setAttribute('position', new BufferAttribute(new Float32Array(gridSize * gridSize * 3), 3))
    D.setAttribute('reference', new BufferAttribute(referenceUv, 2))
    return D
  }, [referenceUv, gridSize])
  useFrame((D) => {
    const { pointer, clock, raycaster, camera } = D
    if (c.current) {
      raycaster.setFromCamera(pointer, camera)
      const De = raycaster.intersectObject(c.current)
      const Oe = o.current
      if (De.length > 0) {
        a.current.lerp(De[0].point, 0.12)
        Oe.x += (De[0].point.x - Oe.x) * 0.06
        Oe.y += (De[0].point.y - Oe.y) * 0.06
      } else {
        a.current.lerp(ORIGIN, 0.04)
        Oe.x += (0 - Oe.x) * 0.04
        Oe.y += (0 - Oe.y) * 0.04
      }
    }
    const Z = size.width / size.height
    const W = Math.max(
      0,
      ['Plane', 'Sphere', 'Cylinder', 'Torus', 'Explode', 'Custom GLTF'].indexOf(
        guiParams.transform.shape,
      ),
    )
    let X = false
    if (f.current !== -1 && f.current !== W) {
      X = true
      d.current = 4
    }
    if (guiParams.transform.forceResetParticles) {
      X = true
      d.current = 4
      guiParams.transform.forceResetParticles = false
    }
    f.current = W
    if (d.current > 0) {
      X = true
      d.current--
    }
    let ee = 1
    let G = 1
    const B = guiParams.transform.fitMode
    if (B === 'Cover') {
      if (y > Z) {
        ee = y / Z
      } else {
        G = Z / y
      }
    } else if (B === 'Maintain Aspect') {
      ee = y
    } else {
      ee = Z
    }
    setWindVector(guiParams.flow.windDirection, guiParams.flow.windStrength, p.current)
    const ne = posVar.material.uniforms
    ne.uReset.value = X
    ne.uTime.value = clock.elapsedTime
    ne.uSpeed.value = guiParams.flow.speed
    ne.uCurlIntensity.value = guiParams.flow.curlIntensity
    const ve = guiParams.interaction.magneticsEnabled !== false
    ne.uInteractionRadius.value = ve ? guiParams.interaction.radius : 0
    ne.uInteractionForce.value = ve
      ? guiParams.interaction.force * (guiParams.interaction.invertMouse ? -1 : 1)
      : 0
    ne.uRespawnRate.value = guiParams.rendering.respawnRate
    ne.uMouse3D.value.set(a.current.x, a.current.y, a.current.z)
    ne.uFeather.value = h
    ne.uShape.value = W
    ne.uAspect.value = Z
    ne.uScaleX.value = ee
    ne.uScaleY.value = G
    ne.uMorphHD.value = guiParams.transform.morphHD
    ne.uDisplacement.value = guiParams.transform.displacement
    ne.uPullForce.value = guiParams.transform.pullForce
    ne.uWindForce.value.copy(p.current)
    ne.uCustomMeshTex.value = _
    ne.uHasCustomMesh.value = !!_
    gpuCompute.compute()
    const Ue = R.uniforms
    Ue.uPositions.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    Ue.uFeather.value = h
    Ue.uSize.value = guiParams.rendering.particleSize
    Ue.uOpacity.value = guiParams.rendering.opacity
    Ue.uBrightness.value = guiParams.rendering.brightness
    Ue.uAmbientLight.value = guiParams.lighting.ambient
    Ue.uDirLightIntensity.value = guiParams.lighting.intensity
    Ue.uLightDir.value.set(
      guiParams.lighting.dirX,
      guiParams.lighting.dirY,
      guiParams.lighting.dirZ,
    )
    Ue.uShape.value = W
    Ue.uDepthShadow.value = guiParams.lighting.depthShadow
    Ue.uCustomMeshTex.value = _
    Ue.uHasCustomMesh.value = !!_
    if (R.blending !== guiParams.rendering.blending) {
      R.blending = guiParams.rendering.blending
      R.premultipliedAlpha = guiParams.rendering.blending === SubtractiveBlending
      R.needsUpdate = true
    }
  })
  return (
    <>
      <group
        position={[
          o.current.x * guiParams.interaction.parallax,
          o.current.y * guiParams.interaction.parallax,
          0,
        ]}
        scale={2.5}
      >
        <mesh ref={c} visible={false}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial />
        </mesh>
        <points geometry={N} material={R} />
      </group>
      {((w = guiParams.ambientCloud) == null ? undefined : w.enabled) && (
        <AmbientCloud featherTex={h} guiParams={guiParams} />
      )}
    </>
  )
}
