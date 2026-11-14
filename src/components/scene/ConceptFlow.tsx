"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { TOPICS, type Topic } from "./constants";

function Station({ topic, index, active, onSelect }: { topic: Topic; index: number; active: boolean; onSelect?: (index: number) => void }) {
  const accent = TOPICS[topic].accent;
  return <group position={[(index - 1) * 1.38, index === 1 ? 0.2 : 0, 0]} scale={1.25} onClick={event => { event.stopPropagation(); onSelect?.(index); }}>
    <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.31, 0.34, 48]} /><meshBasicMaterial color={active ? accent : "#9b7d6d"} transparent opacity={active ? 0.9 : 0.35} side={2} /></mesh>
    {topic === "system" ? index === 0 ? <group>
      <mesh castShadow><boxGeometry args={[0.44, 0.31, 0.07]} /><meshStandardMaterial color="#d9d3c7" metalness={0.25} roughness={0.35} /></mesh>
      <mesh position={[0, 0, 0.041]}><planeGeometry args={[0.36, 0.23]} /><meshBasicMaterial color={accent} /></mesh>
      <mesh position={[0, -0.2, 0]}><boxGeometry args={[0.5, 0.035, 0.25]} /><meshStandardMaterial color="#b0a9a0" metalness={0.4} /></mesh>
    </group> : index === 1 ? <group>{[-0.15, 0, 0.15].map((y, i) => <group key={i} position={[0, y, 0]}><mesh castShadow><boxGeometry args={[0.43, 0.12, 0.3]} /><meshStandardMaterial color="#393744" metalness={0.35} roughness={0.42} /></mesh><mesh position={[0.15, 0, 0.155]}><sphereGeometry args={[0.018, 8, 8]} /><meshBasicMaterial color={accent} /></mesh></group>)}</group> : <group>
      <mesh castShadow><cylinderGeometry args={[0.22, 0.22, 0.36, 32]} /><meshStandardMaterial color="#a5c2c4" metalness={0.4} roughness={0.33} /></mesh>
      {[-0.17, 0, 0.17].map(y => <mesh key={y} position={[0, y, 0]}><torusGeometry args={[0.22, 0.015, 8, 32]} /><meshBasicMaterial color={accent} /></mesh>)}
    </group> : index === 0 ? <group>
      <mesh castShadow rotation={[0, 0, -0.15]}><boxGeometry args={[0.46, 0.32, 0.09]} /><meshStandardMaterial color="#9e343b" roughness={0.55} /></mesh>
      <mesh position={[0.1, 0.12, 0.055]}><boxGeometry args={[0.18, 0.07, 0.025]} /><meshStandardMaterial color="#d6aa67" metalness={0.7} /></mesh>
    </group> : index === 1 ? <group>
      {[[-0.19, -0.11], [0.18, -0.12], [0, 0.2]].map(([x, y], i) => <mesh key={i} position={[x, y, 0]}><icosahedronGeometry args={[0.12, 1]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.32} /></mesh>)}
      <mesh rotation={[0, 0, 0.45]}><boxGeometry args={[0.45, 0.012, 0.012]} /><meshBasicMaterial color="#dfb390" /></mesh>
      <mesh rotation={[0, 0, -0.45]}><boxGeometry args={[0.45, 0.012, 0.012]} /><meshBasicMaterial color="#dfb390" /></mesh>
    </group> : <group>{[-0.22, 0, 0.22].map((x, i) => <group key={i} position={[x, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.09, 0.11, 0.4, 6]} /><meshStandardMaterial color="#e2cec3" metalness={0.25} roughness={0.4} /></mesh><mesh position={[0, 0.23, 0]}><coneGeometry args={[0.12, 0.17, 6]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.28} /></mesh></group>)}</group>}
    <pointLight color={accent} intensity={active ? 1.8 : 0.3} distance={1.7} />
  </group>;
}

export function ConceptFlow({ topic, active, onSelect, reduced }: { topic: Topic; active: number; onSelect?: (index: number) => void; reduced: boolean }) {
  const rise = useRef<Group>(null);
  const packet = useRef<Mesh>(null);
  const start = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (start.current === null) start.current = clock.elapsedTime;
    const t = clock.elapsedTime - start.current;
    if (rise.current) rise.current.position.y = reduced ? 1.05 : 1.05 - 0.55 * Math.exp(-t * 2.5) + Math.sin(t * 0.9) * 0.035;
    if (packet.current) {
      const path = reduced ? active : (t * 0.32) % 2;
      packet.current.position.set(-1.38 + path * 1.38, path < 1 ? path * 0.2 : (2 - path) * 0.2, 0.03);
    }
  });
  return <group ref={rise} position={[0, 1.05, 0]}>
    {[-0.69, 0.69].map((x, i) => <mesh key={i} position={[x, 0.1, -0.04]} rotation={[0, 0, i ? -0.17 : 0.17]}><cylinderGeometry args={[0.009, 0.009, 1.4, 6]} /><meshBasicMaterial color={TOPICS[topic].accent} transparent opacity={0.6} /></mesh>)}
    {[0, 1, 2].map(index => <Station key={index} topic={topic} index={index} active={active === index} onSelect={onSelect} />)}
    <mesh ref={packet}><octahedronGeometry args={[0.065, 0]} /><meshBasicMaterial color={TOPICS[topic].response} /></mesh>
  </group>;
}
