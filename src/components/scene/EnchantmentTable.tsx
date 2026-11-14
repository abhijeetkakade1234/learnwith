import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { COLORS } from "./constants";

// Procedural enchanting table. Local origin sits at the centre of the cloth top (y = 0);
// everything else hangs below, so the stage can place it with position={[0, TABLE_TOP_Y, 0]}.
// Overall footprint ≈ 2.56 × 2.56, height 1.49 (matches TABLE_TOP_Y - FLOOR_Y).

const HALF = 1.1;
const FACES = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
const CORNERS: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

type Glyph = { x: number; y: number; w: number; h: number };

// Deterministic rune grooves per face so the carving is stable across renders.
function runes(seed: number): Glyph[] {
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out: Glyph[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const x = -0.54 + col * 0.36;
      const y = 0.22 - row * 0.22;
      const vertical = rand() > 0.5;
      out.push({ x, y, w: vertical ? 0.035 : 0.16, h: vertical ? 0.14 : 0.035 });
      if (rand() > 0.35) out.push({ x: x + (rand() - 0.5) * 0.1, y: y + (vertical ? 0.05 : -0.05), w: 0.08, h: 0.03 });
    }
  }
  return out;
}

function Obsidian({ panel = false }: { panel?: boolean }) {
  return <meshStandardMaterial color={panel ? COLORS.obsidianPanel : COLORS.obsidian} roughness={panel ? 0.55 : 0.32} metalness={0.15} />;
}

function Gold({ deep = false }: { deep?: boolean }) {
  return <meshStandardMaterial color={deep ? COLORS.goldDeep : COLORS.gold} roughness={0.28} metalness={0.9} />;
}

function Crystal({ glow = 0.35 }: { glow?: number }) {
  return <meshStandardMaterial color={COLORS.crystal} emissive={COLORS.crystal} emissiveIntensity={glow} roughness={0.12} metalness={0.2} flatShading />;
}

function SideFace({ yaw, seed }: { yaw: number; seed: number }) {
  const glyphs = useMemo(() => runes(seed), [seed]);
  return (
    <group rotation={[0, yaw, 0]}>
      {/* recessed carved panel framed in deep gold */}
      <group position={[0, -0.8, HALF + 0.005]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.62, 0.74, 0.02]} />
          <Obsidian panel />
        </mesh>
        {[0.385, -0.385].map((y) => (
          <mesh key={y} position={[0, y, 0.01]} castShadow>
            <boxGeometry args={[1.7, 0.035, 0.03]} />
            <Gold deep />
          </mesh>
        ))}
        {[0.83, -0.83].map((x) => (
          <mesh key={x} position={[x, 0, 0.01]} castShadow>
            <boxGeometry args={[0.035, 0.8, 0.03]} />
            <Gold deep />
          </mesh>
        ))}
        {glyphs.map((g, i) => (
          <mesh key={i} position={[g.x, g.y, 0.012]}>
            <boxGeometry args={[g.w, g.h, 0.006]} />
            <Crystal glow={0.55} />
          </mesh>
        ))}
      </group>
      {/* cloth drape folding over the slab edge, with gold hem and tassels */}
      <group position={[0, 0, 1.232]}>
        <mesh position={[0, -0.21, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.26, 0.025]} />
          <meshStandardMaterial color={COLORS.cloth} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.33, 0.006]}><boxGeometry args={[1.52, 0.03, 0.035]} /><Gold /></mesh>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((x) => (
          <mesh key={x} position={[x, -0.39, 0.006]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.03, 0.09, 6]} />
            <Gold />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CornerPost({ sx, sz }: { sx: number; sz: number }) {
  const yaw = Math.atan2(sx, sz);
  return (
    <group position={[sx * (HALF - 0.04), 0, sz * (HALF - 0.04)]}>
      <RoundedBox args={[0.28, 1.06, 0.28]} radius={0.03} smoothness={3} position={[0, -0.79, 0]} castShadow receiveShadow>
        <Obsidian />
      </RoundedBox>
      {/* crystal veins breaking out of the vertical edge */}
      <group rotation={[0, yaw, 0]}>
        {[[-1.12, 0.07, 0.4], [-0.86, 0.05, -0.5], [-0.58, 0.06, 0.25]].map(([y, s, tilt], i) => (
          <mesh key={i} position={[0, y, 0.19]} rotation={[0.9, 0, tilt]} scale={[s, s * 2.4, s]} castShadow>
            <octahedronGeometry args={[1, 0]} />
            <Crystal />
          </mesh>
        ))}
      </group>
      {/* gold hex setting holding the crown crystal at the top corner */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.17, 0.08, 6]} />
        <Gold />
      </mesh>
      <mesh position={[0, 0.13, 0]} scale={[0.1, 0.22, 0.1]} castShadow>
        <octahedronGeometry args={[1, 0]} />
        <Crystal glow={0.5} />
      </mesh>
      {[-0.6, 0.7].map((tilt, i) => (
        <mesh key={i} position={[i ? -0.06 : 0.07, 0.08, i ? 0.05 : -0.04]} rotation={[tilt * 0.5, 0, tilt]} scale={[0.06, 0.16, 0.06]} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <Crystal glow={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function EnchantmentTable() {
  return (
    <group>
      {/* plinth and foot band */}
      <RoundedBox args={[2.56, 0.12, 2.56]} radius={0.025} smoothness={3} position={[0, -1.43, 0]} castShadow receiveShadow>
        <Obsidian />
      </RoundedBox>
      <mesh position={[0, -1.345, 0]} castShadow>
        <boxGeometry args={[2.36, 0.05, 2.36]} />
        <Gold deep />
      </mesh>
      {/* main obsidian body */}
      <RoundedBox args={[HALF * 2, 1.06, HALF * 2]} radius={0.02} smoothness={2} position={[0, -0.79, 0]} castShadow receiveShadow>
        <Obsidian />
      </RoundedBox>
      <mesh position={[0, -0.28, 0]}><boxGeometry args={[2.26, 0.04, 2.26]} /><Gold deep /></mesh>
      {/* top slab with gilded rim */}
      <RoundedBox args={[2.4, 0.16, 2.4]} radius={0.03} smoothness={3} position={[0, -0.18, 0]} castShadow receiveShadow>
        <Obsidian />
      </RoundedBox>
      {FACES.map((yaw) => (
        <mesh key={yaw} rotation={[0, yaw, 0]} position={[Math.sin(yaw) * 1.19, -0.1, Math.cos(yaw) * 1.19]}>
          <boxGeometry args={[2.42, 0.04, 0.05]} />
          <Gold />
        </mesh>
      ))}
      {/* red cloth top with embroidered border and centre diamond */}
      <RoundedBox args={[2.18, 0.08, 2.18]} radius={0.02} smoothness={2} position={[0, -0.04, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.cloth} roughness={0.85} />
      </RoundedBox>
      {FACES.map((yaw) => (
        <mesh key={yaw} rotation={[0, yaw, 0]} position={[Math.sin(yaw) * 0.92, 0.002, Math.cos(yaw) * 0.92]}>
          <boxGeometry args={[1.86, 0.006, 0.025]} />
          <Gold />
        </mesh>
      ))}
      <mesh position={[0, 0.002, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.62, 0.005, 0.62]} />
        <Gold deep />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.52, 0.005, 0.52]} />
        <meshStandardMaterial color={COLORS.cover} roughness={0.8} />
      </mesh>
      {FACES.map((yaw, i) => <SideFace key={yaw} yaw={yaw} seed={i + 1} />)}
      {CORNERS.map(([sx, sz]) => <CornerPost key={`${sx}${sz}`} sx={sx} sz={sz} />)}
    </group>
  );
}

export default EnchantmentTable;
