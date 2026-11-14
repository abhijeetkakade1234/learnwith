"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { PlaneGeometry, type Group } from "three";
import { COLORS } from "./constants";

function Page({ side, lift = 0 }: { side: -1 | 1; lift?: number }) {
  const geometry = useMemo(() => {
    const page = new PlaneGeometry(1.08, 1.42, 16, 5);
    const vertices = page.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      vertices.setZ(i, 0.06 + Math.sin((x + 0.54) / 1.08 * Math.PI) * 0.065);
    }
    page.computeVertexNormals();
    return page;
  }, []);
  return <mesh geometry={geometry} position={[side * 0.55, lift, 0]} rotation={[-Math.PI / 2, 0, side * 0.055]} receiveShadow castShadow>
    <meshStandardMaterial color={side === -1 ? COLORS.parchmentShade : COLORS.parchment} roughness={0.95} side={2} />
  </mesh>;
}

export function FloatingBook({ reduced, active }: { reduced: boolean; active: number }) {
  const group = useRef<Group>(null);
  const leaf = useRef<Group>(null);
  const last = useRef(active);
  const turn = useRef(2);
  useFrame(({ clock }, delta) => {
    if (active !== last.current) { last.current = active; turn.current = 0; }
    turn.current = Math.min(2, turn.current + delta);
    if (group.current) {
      group.current.position.y = reduced ? 0 : Math.sin(clock.elapsedTime * 1.1) * 0.055;
      group.current.rotation.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.025;
    }
    if (leaf.current) leaf.current.rotation.y = reduced ? 0 : -Math.sin(Math.min(turn.current / 1.2, 1) * Math.PI) * Math.PI * 0.8;
  });
  return <group ref={group}>
    <mesh castShadow position={[0, -0.13, 0]}><boxGeometry args={[2.35, 0.12, 1.61]} /><meshStandardMaterial color={COLORS.cover} roughness={0.7} /></mesh>
    <mesh position={[0, -0.045, 0]}><boxGeometry args={[2.23, 0.08, 1.52]} /><meshStandardMaterial color={COLORS.goldDeep} metalness={0.55} roughness={0.4} /></mesh>
    <mesh position={[0, -0.005, 0]}><boxGeometry args={[2.15, 0.065, 1.47]} /><meshStandardMaterial color="#ded0ac" roughness={0.95} /></mesh>
    {[-1, 1].map(side => <group key={side}>{[0, 0.015, 0.03].map(lift => <Page key={lift} side={side as -1 | 1} lift={lift} />)}</group>)}
    <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.055, 0.06, 1.48]} /><meshStandardMaterial color={COLORS.gold} metalness={0.65} roughness={0.3} /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 0.56, 0.092, 0]}>
      {[0, 1, 2].map(i => <mesh key={i} position={[0, 0, -0.34 + i * 0.27]}><boxGeometry args={[0.62, 0.003, 0.012]} /><meshBasicMaterial color={COLORS.ink} transparent opacity={0.36} /></mesh>)}
      <mesh position={[0, 0.002, 0.4]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.14, 32]} /><meshBasicMaterial color={COLORS.goldDeep} side={2} /></mesh>
    </group>)}
    <group ref={leaf} position={[0, 0.13, 0]}>
      <mesh position={[0.53, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[1.02, 1.4, 10, 4]} /><meshStandardMaterial color={COLORS.parchment} side={2} roughness={0.95} transparent opacity={0.93} /></mesh>
    </group>
    <pointLight color="#efc78b" intensity={0.9} distance={2} position={[0, 0.35, 0]} />
  </group>;
}
