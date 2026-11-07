import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Vector3 } from 'three'
import { logger } from '../../utils/logger'

const AMBIENT_TAG = 'AmbientCloud'

const CLOUD_VERTEX_SHADER = `
uniform float uTime;
uniform vec3 uWind;
uniform float uSize;
uniform float uSpeed;
uniform float uOpacity;
uniform sampler2D uFeather;
uniform bool uUsePalette;
uniform int uPresetPalette; // 0:Image 1:Golden 2:Cyber 3:Emerald 4:Ivory

attribute vec3 aRandom;
attribute vec2 aVal;    // Static UV coordinates for palette sampling

varying vec3 vColor;
varying float vAlpha;

vec3 getPresetColor(int index, float randValue) {
  if (index == 1) return mix(vec3(1.0, 0.7, 0.1), vec3(0.3, 0.2, 0.0), randValue);   // Golden Essence
  if (index == 2) return mix(vec3(0.0, 1.0, 0.8), vec3(1.0, 0.0, 0.5), randValue);   // Cyber Neon
  if (index == 3) return mix(vec3(0.1, 0.9, 0.4), vec3(0.01, 0.2, 0.1), randValue);  // Soft Emerald
  if (index == 4) return mix(vec3(0.95, 0.95, 1.0), vec3(0.5, 0.5, 0.6), randValue); // Ivory Pearl
  return vec3(0.3, 0.5, 0.82); // Default blue
}

void main() {
  vec3 pos = position;

  // Wind drift over time
  pos += uWind * uTime * uSpeed * (0.6 + aRandom.x * 0.8);

  // Smooth orbital drift
  float angle = uTime * uSpeed * 0.1 * (0.5 + aRandom.y);
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotatedPos = pos;
  rotatedPos.x = pos.x * cosA - pos.z * sinA;
  rotatedPos.z = pos.x * sinA + pos.z * cosA;

  // Modulo wrap inside [-12, 12] box — creates infinite background stream
  vec3 finalPos;
  finalPos.x = mod(rotatedPos.x + 12.0, 24.0) - 12.0;
  finalPos.y = mod(rotatedPos.y + 12.0, 24.0) - 12.0;
  finalPos.z = mod(rotatedPos.z + 12.0, 24.0) - 12.0;

  if (uUsePalette) {
    vec4 sampledColor = texture2D(uFeather, aVal.xy);
    vColor = sampledColor.rgb;
    vAlpha = sampledColor.a;
  } else {
    vColor = getPresetColor(uPresetPalette, aRandom.z);
    vAlpha = 1.0;
  }

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_PointSize = uSize * (1.0 / -mvPosition.z) * (0.5 + aRandom.z * 1.5);
  gl_Position = projectionMatrix * mvPosition;
}
`

const CLOUD_FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;
uniform float uOpacity;
uniform float uBokehHardness;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, uBokehHardness, dist);
  gl_FragColor = vec4(vColor, alpha * vAlpha * uOpacity);
}
`

export default function AmbientCloud({ featherTex, guiParams }) {
  const t = guiParams.ambientCloud.particleCount
  const i = useRef(null)
  const { positions, randoms, uvs } = useMemo(() => {
    logger.info(AMBIENT_TAG, `Building ambient cloud: ${t} particles`)
    const f = new Float32Array(t * 3)
    const d = new Float32Array(t * 3)
    const p = new Float32Array(t * 2)
    for (let h = 0; h < t; h++) {
      f[h * 3] = (Math.random() - 0.5) * 24
      f[h * 3 + 1] = (Math.random() - 0.5) * 24
      f[h * 3 + 2] = (Math.random() - 0.5) * 24
      d[h * 3] = Math.random()
      d[h * 3 + 1] = Math.random()
      d[h * 3 + 2] = Math.random()
      p[h * 2] = Math.random()
      p[h * 2 + 1] = Math.random()
    }
    return {
      positions: f,
      randoms: d,
      uvs: p,
    }
  }, [t])
  const o = useMemo(() => {
    const f = new BufferGeometry()
    f.setAttribute('position', new BufferAttribute(positions, 3))
    f.setAttribute('aRandom', new BufferAttribute(randoms, 3))
    f.setAttribute('aVal', new BufferAttribute(uvs, 2))
    return f
  }, [positions, randoms, uvs])
  const c = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uWind: {
        value: new Vector3(),
      },
      uSpeed: {
        value: 1,
      },
      uSize: {
        value: 12,
      },
      uOpacity: {
        value: 0.5,
      },
      uFeather: {
        value: null,
      },
      uUsePalette: {
        value: true,
      },
      uPresetPalette: {
        value: 0,
      },
      uBokehHardness: {
        value: 0.15,
      },
    }),
    [],
  )
  useFrame((f) => {
    if (!i.current) {
      return
    }
    const d = i.current.uniforms
    const p = guiParams.ambientCloud
    const h = new Vector3()
    const m = p.speed * 0.8
    const y = p.direction
    if (y === 'Up') {
      h.set(0, m, 0)
    } else if (y === 'Down') {
      h.set(0, -m, 0)
    } else if (y === 'Left') {
      h.set(-m, 0, 0)
    } else if (y === 'Right') {
      h.set(m, 0, 0)
    } else if (y === 'Forward') {
      h.set(0, 0, m)
    } else if (y === 'Reverse') {
      h.set(0, 0, -m)
    } else if (y === 'Orbit') {
      h.set(0.2, 0.1, 0)
    }
    d.uTime.value = f.clock.elapsedTime
    d.uWind.value.copy(h)
    d.uSpeed.value = p.speed
    d.uSize.value = p.size
    d.uOpacity.value = p.opacity
    d.uFeather.value = featherTex
    const S = p.colorSource
    d.uUsePalette.value = S === 'Image Palette'
    d.uPresetPalette.value =
      S === 'Golden Essence'
        ? 1
        : S === 'Cyber Neon'
          ? 2
          : S === 'Soft Emerald'
            ? 3
            : S === 'Ivory Pearl'
              ? 4
              : 0
    d.uBokehHardness.value = p.bokehHardness
  })
  return (
    <points geometry={o}>
      <shaderMaterial
        ref={i}
        vertexShader={CLOUD_VERTEX_SHADER}
        fragmentShader={CLOUD_FRAGMENT_SHADER}
        uniforms={c}
        transparent={true}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
