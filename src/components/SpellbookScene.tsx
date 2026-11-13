"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Topic = "system" | "avalanche";
const gold = "#d8aa67";

function Table() {
  return <group position={[0, -1.65, 0]}>
    <mesh castShadow receiveShadow><boxGeometry args={[3.85, 1.05, 2.65]} /><meshStandardMaterial color="#171521" roughness={0.7} metalness={0.18} /></mesh>
    <mesh position={[0, 0.54, 0]} castShadow><boxGeometry args={[4.15, 0.18, 2.9]} /><meshStandardMaterial color="#7d1e2e" roughness={0.75} /></mesh>
    <mesh position={[0, 0.64, 0]}><boxGeometry args={[3.3, 0.03, 2.05]} /><meshStandardMaterial color="#b53643" roughness={0.85} /></mesh>
    {[-1, 1].flatMap(x => [-1, 1].map(z => <group key={`${x}-${z}`} position={[x * 1.8, 0.55, z * 1.1]}>
      <mesh castShadow><boxGeometry args={[0.47, 0.48, 0.47]} /><meshStandardMaterial color="#299c9f" roughness={0.25} metalness={0.32} emissive="#0b626a" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, 0.26, 0]}><boxGeometry args={[0.5, 0.07, 0.5]} /><meshStandardMaterial color={gold} metalness={0.72} roughness={0.25} /></mesh>
    </group>))}
    {[-1, 1].map(x => <mesh key={x} position={[x * 1.43, -0.08, 1.34]}><boxGeometry args={[0.08, 0.8, 0.04]} /><meshStandardMaterial color={gold} metalness={0.7} roughness={0.3} /></mesh>)}
    <mesh position={[0, -0.28, 1.34]}><torusGeometry args={[0.34, 0.025, 8, 48]} /><meshStandardMaterial color={gold} metalness={0.8} roughness={0.2} /></mesh>
  </group>;
}

function Book() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = -0.18 + Math.sin(clock.elapsedTime * 1.5) * 0.1; });
  return <group ref={ref} rotation={[-0.42, 0, 0]}>
    <mesh castShadow position={[0, 0, -0.18]}><boxGeometry args={[2.95, 1.72, 0.16]} /><meshStandardMaterial color="#5c2533" roughness={0.65} /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 0.73, 0, -0.02]} rotation={[0, side * -0.17, 0]}>
      <mesh castShadow><boxGeometry args={[1.46, 1.6, 0.1]} /><meshStandardMaterial color="#f1dfb7" roughness={0.92} /></mesh>
      <mesh position={[0, 0, 0.058]}><boxGeometry args={[1.32, 1.47, 0.008]} /><meshStandardMaterial color="#f8eacb" roughness={1} /></mesh>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[side * 0.05, 0.35 - i * 0.19, 0.068]}><boxGeometry args={[0.86 - i * 0.09, 0.012, 0.003]} /><meshBasicMaterial color="#a78960" transparent opacity={0.42} /></mesh>)}
    </group>)}
    <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.055, 1.55, 0.17]} /><meshStandardMaterial color={gold} metalness={0.6} roughness={0.35} /></mesh>
    <pointLight position={[0, 0.2, 0.55]} color="#9b7bff" intensity={3.5} distance={3.5} />
  </group>;
}

function Concept({ topic, onSelect }: { topic: Topic; onSelect?: (index: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = 0.55 + Math.sin(clock.elapsedTime * 1.2) * 0.09; });
  const positions: [number, number, number][] = [[-1.05, 0.0, 0.45], [0, 0.55, 0.22], [1.05, 0.0, 0.45]];
  return <group ref={ref}>
    {positions.map(([x, y, z], index) => <group key={index} position={[x, y, z]} onClick={e => { e.stopPropagation(); onSelect?.(index); }}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.38, 0.012, 6, 48]} /><meshBasicMaterial color={topic === "system" ? "#77d7e1" : "#ffb4a5"} transparent opacity={0.75} /></mesh>
      {topic === "system" ? index === 0 ? <group><mesh><boxGeometry args={[0.39, 0.27, 0.08]} /><meshStandardMaterial color="#78d9e7" emissive="#125f82" emissiveIntensity={1.3} metalness={0.35} /></mesh><mesh position={[0, -0.19, 0]}><boxGeometry args={[0.48, 0.04, 0.22]} /><meshStandardMaterial color={gold} metalness={0.7} /></mesh></group> : index === 1 ? <group>{[-0.12, 0, 0.12].map(offset => <mesh key={offset} position={[0, offset, 0]}><boxGeometry args={[0.42, 0.085, 0.27]} /><meshStandardMaterial color="#9dc1cb" emissive="#267b91" emissiveIntensity={0.6} /></mesh>)}</group> : <mesh><cylinderGeometry args={[0.24, 0.24, 0.35, 24]} /><meshStandardMaterial color="#66cbd6" emissive="#145b77" emissiveIntensity={0.75} metalness={0.35} /></mesh> : index === 0 ? <mesh rotation={[0, 0, 0.28]}><boxGeometry args={[0.39, 0.27, 0.08]} /><meshStandardMaterial color="#ef928e" emissive="#a53b40" emissiveIntensity={0.9} /></mesh> : index === 1 ? <mesh><octahedronGeometry args={[0.27]} /><meshStandardMaterial color="#f5c4a8" emissive="#b8494e" emissiveIntensity={1.2} /></mesh> : <group>{[-0.2, 0, 0.2].map(offset => <mesh key={offset} position={[offset, 0, 0]}><boxGeometry args={[0.16, 0.3, 0.17]} /><meshStandardMaterial color="#e78a88" emissive="#b3373f" emissiveIntensity={0.7} /></mesh>)}</group>}
      <mesh position={[0, -0.4, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshBasicMaterial color={gold} /></mesh>
    </group>)}
    {[-0.52, 0.52].map((x, i) => <mesh key={i} position={[x, 0.22, 0.32]} rotation={[0, 0, i ? -0.47 : 0.47]}><cylinderGeometry args={[0.013, 0.013, 1.2, 6]} /><meshBasicMaterial color={gold} transparent opacity={0.7} /></mesh>)}
  </group>;
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.07; });
  return <group ref={ref}>{Array.from({ length: count }, (_, i) => {
    const x = Math.sin(i * 22.4) * 2.3, y = Math.cos(i * 9.7) * 1.25 + 0.35, z = Math.sin(i * 4.8) * 1.1;
    return <mesh key={i} position={[x, y, z]}><sphereGeometry args={[i % 4 === 0 ? 0.024 : 0.012, 6, 6]} /><meshBasicMaterial color={i % 3 === 0 ? "#93e4e5" : "#e7c48d"} transparent opacity={0.7} /></mesh>;
  })}</group>;
}

export default function SpellbookScene({ topic, onSelect, variant = "hero" }: { topic: Topic; onSelect?: (index: number) => void; variant?: "hero" | "lesson" }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => { const q = window.matchMedia("(max-width: 640px)"); const update = () => setMobile(q.matches); update(); q.addEventListener("change", update); return () => q.removeEventListener("change", update); }, []);
  return <div className="spellbook-scene" aria-label="Interactive enchanted table with floating book and three concept objects">
    <Canvas camera={{ position: [0, 1.1, mobile || variant === "lesson" ? 8.4 : 6.8], fov: 42 }} dpr={mobile ? 1 : [1, 1.5]} shadows={!mobile} gl={{ antialias: !mobile, toneMapping: THREE.ACESFilmicToneMapping }}>
      <fog attach="fog" args={["#190e18", 9, 15]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 4]} intensity={2.5} color="#ffd3a0" castShadow={!mobile} />
      <pointLight position={[-3, 1.8, 2]} color="#6ccbd5" intensity={5} distance={8} />
      <pointLight position={[3, 0.8, 2]} color="#b07ad9" intensity={4} distance={8} />
      <Table /><Book /><Concept topic={topic} onSelect={onSelect} /><Dust count={mobile ? 12 : 38} />
    </Canvas>
  </div>;
}
