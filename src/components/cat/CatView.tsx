"use client";

import { Canvas } from "@react-three/fiber";
import CatModel from "./CatModel";
import type { CatMood } from "./mood";

export default function CatView({
  mood,
  facing,
  look,
  blinking,
  size = 130,
}: {
  mood: CatMood;
  facing: 1 | -1;
  look: { x: number; y: number };
  blinking: boolean;
  size?: number;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0.25, 4.5], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} />
        {/* cool rim light so she reads against the blue wallpapers */}
        <directionalLight position={[-3, 1.5, -2]} intensity={0.8} color="#9ec5ff" />
        <group position={[0, 0.1, 0]}>
          <CatModel mood={mood} facing={facing} look={look} blinking={blinking} />
        </group>
      </Canvas>
    </div>
  );
}
