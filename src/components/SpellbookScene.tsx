"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Book({ topic, onSelect }: { topic: "system" | "avalanche"; onSelect?: (index: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const [open, setOpen] = useState(true);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = -0.25 + Math.sin(state.clock.elapsedTime * 0.65) * 0.1;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.12;
  });
  const color = topic === "avalanche" ? "#b83730" : "#254866";
  return (
    <group ref={group} rotation={[-0.4, -0.25, 0.08]} onClick={() => setOpen(!open)}>
      <mesh position={[0, 0, -0.12]} castShadow><boxGeometry args={[open ? 3.15 : 2.65, 2.55, 0.18]} /><meshStandardMaterial color={color} roughness={0.78} /></mesh>
      {open ? <>
        <mesh position={[-0.77, 0, 0.015]} rotation={[0, 0.12, 0]}><boxGeometry args={[1.5, 2.38, 0.1]} /><meshStandardMaterial color="#eeddb8" /></mesh>
        <mesh position={[0.77, 0, 0.015]} rotation={[0, -0.12, 0]}><boxGeometry args={[1.5, 2.38, 0.1]} /><meshStandardMaterial color="#f5e6c7" /></mesh>
        <mesh position={[0, 0, 0.09]}><boxGeometry args={[0.055, 2.38, 0.13]} /><meshStandardMaterial color="#ad7646" /></mesh>
        <mesh position={[-0.73, 0.32, 0.13]}><torusGeometry args={[0.33, 0.018, 8, 48]} /><meshStandardMaterial color="#b99452" /></mesh>
        <mesh position={[0.7, 0.42, 0.13]}><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial color={topic === "avalanche" ? "#d73f36" : "#417fa6"} /></mesh>
      </> : <>
        <mesh position={[0, 0, 0.03]}><boxGeometry args={[2.48, 2.38, 0.12]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0, 0.1]}><torusGeometry args={[0.65, 0.025, 8, 64]} /><meshStandardMaterial color="#d5aa61" metalness={0.8} roughness={0.25} /></mesh>
      </>}
      {open && <group position={[0, 0.3, 0.65]}>
        <mesh position={[-0.55, 0.3, 0]} onClick={event => { event.stopPropagation(); onSelect?.(0); }}><icosahedronGeometry args={[0.22, 1]} /><meshStandardMaterial color={topic === "avalanche" ? "#e3443b" : "#75c7db"} emissive={topic === "avalanche" ? "#98251d" : "#176c8c"} emissiveIntensity={1} /></mesh>
        <mesh position={[0.3, 0.75, 0.1]} onClick={event => { event.stopPropagation(); onSelect?.(1); }}><octahedronGeometry args={[0.2]} /><meshStandardMaterial color="#f5d68c" emissive="#966c28" emissiveIntensity={0.8} /></mesh>
        <mesh position={[0.8, 0.18, 0]} onClick={event => { event.stopPropagation(); onSelect?.(2); }}><sphereGeometry args={[0.13]} /><meshStandardMaterial color="#f5d68c" emissive="#966c28" emissiveIntensity={0.8} /></mesh>
      </group>}
    </group>
  );
}

export default function SpellbookScene({ topic, onSelect }: { topic: "system" | "avalanche"; onSelect?: (index: number) => void }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 520px)");
    const update = () => setMobile(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (mobile) return <div className="mobile-spellbook" aria-label="Illustrated enchanted notebook"><span>✦</span><strong>📖</strong><span>✦</span></div>;
  return <div aria-label="Interactive 3D notebook. Click to open it." role="img" style={{ width: "100%", height: "100%", minHeight: 300, cursor: "pointer" }}>
    <Canvas camera={{ position: [0, 0.2, 6.1], fov: 42 }} dpr={[1, 1.7]} shadows>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 4]} intensity={3} castShadow />
      <pointLight position={[-3, -1, 2]} color="#e4b46f" intensity={22} />
      <mesh position={[0, -2.25, -0.3]} castShadow><boxGeometry args={[3.2, 0.7, 2.2]} /><meshStandardMaterial color="#251e37" roughness={0.88} /></mesh>
      <mesh position={[0, -1.87, -0.3]}><boxGeometry args={[3.25, 0.09, 2.25]} /><meshStandardMaterial color="#a9242c" emissive="#571119" emissiveIntensity={0.25} /></mesh>
      <mesh position={[-1.5, -2.22, 0.82]}><boxGeometry args={[0.35, 0.38, 0.35]} /><meshStandardMaterial color="#49c5bb" emissive="#126d77" emissiveIntensity={0.5} /></mesh>
      <mesh position={[1.5, -2.22, 0.82]}><boxGeometry args={[0.35, 0.38, 0.35]} /><meshStandardMaterial color="#49c5bb" emissive="#126d77" emissiveIntensity={0.5} /></mesh>
      <Book topic={topic} onSelect={onSelect} />
    </Canvas>
  </div>;
}
