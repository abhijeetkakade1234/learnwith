"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { ConceptFlow } from "./scene/ConceptFlow";
import { FloatingBook } from "./scene/FloatingBook";
import { EnchantmentTable } from "./scene/EnchantmentTable";
import { BOOK_Y, COLORS, FLOOR_Y, TABLE_TOP_Y, TABLE_YAW, type Topic, type Variant } from "./scene/constants";

function Chamber({ mobile }: { mobile: boolean }) {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y - 0.02, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color={COLORS.floor} roughness={0.92} /></mesh>
    <mesh position={[0, 1.5, -5.2]} receiveShadow><boxGeometry args={[18, 7, 0.3]} /><meshStandardMaterial color="#241724" roughness={1} /></mesh>
    {!mobile && [-1, 1].map(side => <group key={side} position={[side * 4.45, -0.05, -3.85]} rotation={[0, side * -0.22, 0]}>
      <mesh position={[0, 1.75, 0]}><boxGeometry args={[1.15, 4.4, 0.7]} /><meshStandardMaterial color="#39231e" roughness={0.8} /></mesh>
      {[0, 1, 2].map(row => <group key={row} position={[0, row * 1.24, 0.42]}>
        <mesh><boxGeometry args={[1.3, 0.09, 0.87]} /><meshStandardMaterial color="#79503a" roughness={0.7} /></mesh>
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.48 + i * 0.16, 0.38 + (i % 3) * 0.045, 0]} rotation={[0, 0, (i % 4 - 2) * 0.025]}><boxGeometry args={[0.11 + (i % 2) * 0.035, 0.64 + (i % 3) * 0.08, 0.35]} /><meshStandardMaterial color={["#785044", "#805b34", "#2d5962", "#563550"][i % 4]} roughness={0.85} /></mesh>)}
      </group>)}
    </group>)}
    {!mobile && [-1, 1].map(side => <group key={side} position={[side * 3.1, 2.8, -4.5]}>
      <mesh><boxGeometry args={[0.55, 3.6, 0.55]} /><meshStandardMaterial color="#4a302a" roughness={0.8} /></mesh>
      <pointLight position={[0, -0.4, 0.7]} color="#e5a766" intensity={1.2} distance={5} />
    </group>)}
  </group>;
}

function Camera({ variant, mobile }: { variant: Variant; mobile: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(mobile ? 3.3 : variant === "lesson" ? 5.1 : 3.6, mobile ? 2.2 : variant === "lesson" ? 3.2 : 2.7, mobile ? 6.7 : variant === "lesson" ? 10.2 : 6.8);
    camera.lookAt(mobile || variant === "lesson" ? 0 : -0.1, -0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile, variant]);
  return null;
}

export default function SpellbookScene({ topic, onSelect, active = 0, variant = "hero" }: { topic: Topic; onSelect?: (index: number) => void; active?: number; variant?: Variant }) {
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setMobile(mobileQuery.matches); setReduced(motionQuery.matches); };
    const check = window.setTimeout(() => {
      update();
      try { const c = document.createElement("canvas"); setWebgl(Boolean(c.getContext("webgl2") || c.getContext("webgl"))); } catch { setWebgl(false); }
    }, 0);
    mobileQuery.addEventListener("change", update); motionQuery.addEventListener("change", update);
    return () => { window.clearTimeout(check); mobileQuery.removeEventListener("change", update); motionQuery.removeEventListener("change", update); };
  }, []);
  if (!webgl) return <div className="scene-fallback" role="img" aria-label="An open book on an enchanting table">Open the book to explore {topic === "system" ? "System Design" : "Avalanche"}</div>;
  return <div className="spellbook-scene" aria-label="Interactive 3D enchanting table with a floating book and three concept objects">
    <Canvas dpr={mobile ? 1 : [1, 1.5]} shadows={{ type: PCFSoftShadowMap }} camera={{ fov: mobile ? 44 : 38, position: [3.6, 2.7, 6.8], near: 0.1, far: 60 }} gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, outputColorSpace: SRGBColorSpace, powerPreference: "high-performance" }}>
      <Camera variant={variant} mobile={mobile} />
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 8, 19]} />
      <ambientLight intensity={0.23} />
      <hemisphereLight args={["#e9d9c4", "#332738", 0.35]} />
      <directionalLight position={[-3, 7, 5]} color="#ffdfb0" intensity={1.7} castShadow shadow-mapSize={mobile ? [512, 512] : [1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0002} />
      <Environment resolution={mobile ? 64 : 128}>
        <Lightformer form="rect" intensity={1.1} color="#fff1d5" position={[-3, 6, 3]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#85ded4" position={[4, 3, -2]} scale={[4, 5, 1]} />
      </Environment>
      <Chamber mobile={mobile} />
      <group rotation={[0, TABLE_YAW, 0]} position={[0, TABLE_TOP_Y, 0]}><EnchantmentTable /></group>
      <group position={[0, BOOK_Y, 0]} rotation={[0, TABLE_YAW, 0]}><FloatingBook active={active} reduced={reduced} /></group>
      <ConceptFlow key={topic} topic={topic} active={active} onSelect={onSelect} reduced={reduced} />
      {!mobile && <ContactShadows frames={1} position={[0, FLOOR_Y + 0.01, 0]} opacity={0.38} scale={7} blur={2.6} far={3.5} resolution={256} color="#000000" />}
      {!mobile && <EffectComposer multisampling={0}><Bloom intensity={0.22} luminanceThreshold={0.86} mipmapBlur /><Vignette eskil={false} offset={0.35} darkness={0.3} /></EffectComposer>}
    </Canvas>
  </div>;
}
