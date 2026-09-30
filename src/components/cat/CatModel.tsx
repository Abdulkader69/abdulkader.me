"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { postureFor, type CatMood, type Posture } from "./mood";

const FUR = "#E8933A";
const FUR_DARK = "#C9761F";
const BELLY = "#FBE0BE";
const PINK = "#F09AA8";

const TAIL_SEGMENTS = 10;

// Eye height, in the eye mesh's own local scale units.
const EYE_OPEN = 0.1;
const EYE_SHUT = 0.012;

type V3 = [number, number, number];

/**
 * Postures place the torso, head and limbs individually rather than squashing
 * the whole cat: the front legs pivot at the shoulder, so lying down swings
 * them forward into a sphinx the way a real cat's do.
 */
const POSES: Record<
  Posture,
  {
    torsoPos: V3;
    torsoScale: V3;
    headPos: V3;
    headRotX: number;
    legsPos: V3;
    legsRotX: number;
    haunchPos: V3;
  }
> = {
  up: {
    torsoPos: [0, -0.42, 0],
    torsoScale: [0.54, 0.62, 0.48],
    headPos: [0, 0.36, 0.06],
    headRotX: 0,
    legsPos: [0, -0.6, 0.28],
    legsRotX: 0,
    haunchPos: [0, -0.72, -0.05],
  },
  lying: {
    torsoPos: [0, -0.74, -0.04],
    torsoScale: [0.56, 0.44, 0.66],
    headPos: [0, -0.12, 0.4],
    headRotX: 0,
    legsPos: [0, -0.95, 0.26],
    legsRotX: -1.3,
    haunchPos: [0, -0.88, -0.18],
  },
  sleeping: {
    torsoPos: [0, -0.78, -0.04],
    torsoScale: [0.58, 0.42, 0.68],
    headPos: [0, -0.46, 0.46],
    headRotX: 0.5,
    legsPos: [0, -0.97, 0.26],
    legsRotX: -1.36,
    haunchPos: [0, -0.9, -0.18],
  },
};

function dampV(v: THREE.Vector3, to: V3, lambda: number, dt: number) {
  v.x = THREE.MathUtils.damp(v.x, to[0], lambda, dt);
  v.y = THREE.MathUtils.damp(v.y, to[1], lambda, dt);
  v.z = THREE.MathUtils.damp(v.z, to[2], lambda, dt);
}

/** A low-poly tabby built entirely from primitives — no external model. */
export default function CatModel({
  mood,
  facing,
  look,
  blinking,
}: {
  mood: CatMood;
  facing: 1 | -1;
  /** Normalised direction to the pointer, so she can watch it. */
  look: { x: number; y: number };
  blinking: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = useRef<THREE.Group>(null);
  const haunches = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const pawL = useRef<THREE.Mesh>(null);
  const tailBones = useRef<(THREE.Mesh | null)[]>([]);

  const posture = postureFor(mood);
  const asleep = mood === "sleep";
  const down = posture !== "up";
  const moving = mood === "walk" || mood === "chase" || mood === "pounce";

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05); // clamp so a stalled tab doesn't snap everything
    const P = POSES[posture];

    // Turn to face travel direction.
    if (root.current) {
      const targetY = facing === 1 ? 0.5 : -0.5;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, 6, d);
    }

    // Posture: torso, limbs and haunches all ease to their pose targets.
    if (torso.current) {
      dampV(torso.current.position, P.torsoPos, 7, d);
      dampV(torso.current.scale, P.torsoScale, 7, d);
    }
    if (legs.current) {
      dampV(legs.current.position, P.legsPos, 7, d);
      legs.current.rotation.x = THREE.MathUtils.damp(legs.current.rotation.x, P.legsRotX, 7, d);
    }
    if (haunches.current) dampV(haunches.current.position, P.haunchPos, 7, d);

    // Breathing, a walk bob, and a purr tremor.
    if (body.current) {
      const breathe = down ? Math.sin(t * 1.2) * 0.022 : Math.sin(t * 2.4) * 0.016;
      const bob = moving ? Math.abs(Math.sin(t * 9)) * 0.06 : 0;
      const purr = mood === "pet" ? Math.sin(t * 42) * 0.012 : 0;
      body.current.position.y = breathe + bob + purr;
      body.current.rotation.z = moving ? Math.sin(t * 9) * 0.035 : 0;
    }

    // Head: pose first, then watch the pointer on top of it.
    if (head.current) {
      dampV(head.current.position, P.headPos, 7, d);
      const wantY = asleep ? 0 : look.x * (down ? 0.35 : 0.5);
      const wantX =
        mood === "groom"
          ? 0.45 + Math.sin(t * 3) * 0.12
          : mood === "pet"
            ? -0.2
            : P.headRotX + (asleep ? 0 : look.y * 0.28);
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, wantY, 5, d);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, wantX, 5, d);
      head.current.rotation.z = THREE.MathUtils.damp(
        head.current.rotation.z,
        mood === "pet" ? 0.15 : asleep ? 0.22 : 0,
        5,
        d
      );
    }

    // Ears swivel forward when she's locked on, flatten when asleep.
    const tilt = mood === "chase" ? 0.12 + Math.sin(t * 12) * 0.06 : asleep ? -0.4 : 0;
    if (earL.current)
      earL.current.rotation.z = THREE.MathUtils.damp(earL.current.rotation.z, 0.3 + tilt, 6, d);
    if (earR.current)
      earR.current.rotation.z = THREE.MathUtils.damp(earR.current.rotation.z, -0.3 - tilt, 6, d);

    // Blink by squashing the eyeballs. These are the mesh's *local* scale units,
    // so they must stay relative to EYE_OPEN — not 1, which would stretch the
    // eyeball into a spike ten times its own height.
    const open = blinking || asleep || mood === "pet" ? EYE_SHUT : EYE_OPEN;
    if (eyeL.current) eyeL.current.scale.y = THREE.MathUtils.damp(eyeL.current.scale.y, open, 22, d);
    if (eyeR.current) eyeR.current.scale.y = THREE.MathUtils.damp(eyeR.current.scale.y, open, 22, d);

    // Tail: curled up beside her when sitting, laid out along the floor when down.
    const speed = asleep ? 0.8 : moving ? 7 : 2.4;
    const amp = asleep ? 0.02 : moving ? 0.26 : 0.13;
    tailBones.current.forEach((bone, i) => {
      if (!bone) return;
      const f = i / (TAIL_SEGMENTS - 1);
      const sway = Math.sin(t * speed - f * 2.2) * amp * f;
      if (posture === "up") {
        dampV(
          bone.position,
          [0.28 + sway + f * 0.22, -0.66 + f * f * 1.15, -0.34 - f * 0.12],
          9,
          d
        );
      } else {
        // sweeps around her side along the ground, curling toward the front
        const a = f * Math.PI * 0.62;
        dampV(
          bone.position,
          [
            0.3 + Math.sin(a) * 0.62 + sway * 0.5,
            -0.96 + f * 0.02,
            -0.4 + (1 - Math.cos(a)) * 0.95,
          ],
          9,
          d
        );
      }
    });

    // Grooming paw comes up to the mouth (local to the shoulder pivot).
    if (pawL.current) {
      const groom = mood === "groom";
      dampV(pawL.current.position, groom ? [0.19, 0.02, 0.26] : [0.19, -0.32, 0.1], 8, d);
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* haunches, behind the body */}
        <group ref={haunches} position={[0, -0.72, -0.05]}>
          <mesh position={[0.4, 0, 0]} scale={[0.27, 0.26, 0.3]}>
            <sphereGeometry args={[1, 16, 14]} />
            <meshStandardMaterial color={FUR_DARK} roughness={0.9} />
          </mesh>
          <mesh position={[-0.4, 0, 0]} scale={[0.27, 0.26, 0.3]}>
            <sphereGeometry args={[1, 16, 14]} />
            <meshStandardMaterial color={FUR_DARK} roughness={0.9} />
          </mesh>
        </group>

        {/* torso + chest bib */}
        <group ref={torso} position={[0, -0.42, 0]} scale={[0.54, 0.62, 0.48]}>
          <mesh castShadow>
            <sphereGeometry args={[1, 26, 22]} />
            <meshStandardMaterial color={FUR} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.1, 0.62]} scale={[0.54, 0.55, 0.5]}>
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial color={BELLY} roughness={0.9} />
          </mesh>
        </group>

        {/* front legs, pivoting at the shoulder so they can swing forward */}
        <group ref={legs} position={[0, -0.6, 0.28]}>
          <mesh position={[0.19, -0.18, 0]} scale={[0.1, 0.19, 0.1]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
          <mesh position={[-0.19, -0.18, 0]} scale={[0.1, 0.19, 0.1]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color={FUR} roughness={0.9} />
          </mesh>
          <mesh ref={pawL} position={[0.19, -0.32, 0.1]} scale={[0.12, 0.09, 0.16]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color={BELLY} roughness={0.9} />
          </mesh>
          <mesh position={[-0.19, -0.32, 0.1]} scale={[0.12, 0.09, 0.16]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color={BELLY} roughness={0.9} />
          </mesh>
        </group>

        {/* tail */}
        {Array.from({ length: TAIL_SEGMENTS }).map((_, i) => {
          const f = i / (TAIL_SEGMENTS - 1);
          return (
            <mesh
              key={i}
              ref={(el) => {
                tailBones.current[i] = el;
              }}
              scale={0.14 - f * 0.045}
            >
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color={i > TAIL_SEGMENTS - 3 ? BELLY : FUR} roughness={0.9} />
            </mesh>
          );
        })}

        {/* head — deliberately large, which is what reads as "cat" at this size */}
        <group ref={head} position={[0, 0.36, 0.06]}>
          <mesh scale={[0.5, 0.45, 0.45]} castShadow>
            <sphereGeometry args={[1, 26, 22]} />
            <meshStandardMaterial color={FUR} roughness={0.85} />
          </mesh>

          {/* ears */}
          <group ref={earL} position={[0.29, 0.34, -0.02]}>
            <mesh>
              <coneGeometry args={[0.16, 0.32, 4]} />
              <meshStandardMaterial color={FUR} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, -0.03, 0.07]} scale={[0.55, 0.6, 0.55]}>
              <coneGeometry args={[0.16, 0.32, 4]} />
              <meshStandardMaterial color={PINK} roughness={0.9} flatShading />
            </mesh>
          </group>
          <group ref={earR} position={[-0.29, 0.34, -0.02]}>
            <mesh>
              <coneGeometry args={[0.16, 0.32, 4]} />
              <meshStandardMaterial color={FUR} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, -0.03, 0.07]} scale={[0.55, 0.6, 0.55]}>
              <coneGeometry args={[0.16, 0.32, 4]} />
              <meshStandardMaterial color={PINK} roughness={0.9} flatShading />
            </mesh>
          </group>

          {/* whisker pads + nose */}
          <mesh position={[0.1, -0.16, 0.36]} scale={[0.15, 0.11, 0.12]}>
            <sphereGeometry args={[1, 16, 14]} />
            <meshStandardMaterial color={BELLY} roughness={0.9} />
          </mesh>
          <mesh position={[-0.1, -0.16, 0.36]} scale={[0.15, 0.11, 0.12]}>
            <sphereGeometry args={[1, 16, 14]} />
            <meshStandardMaterial color={BELLY} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.08, 0.43]} rotation={[Math.PI, 0, 0]} scale={[0.7, 0.55, 0.7]}>
            <coneGeometry args={[0.08, 0.08, 4]} />
            <meshStandardMaterial color={PINK} roughness={0.7} flatShading />
          </mesh>

          {/* eyes */}
          <mesh ref={eyeL} position={[0.18, 0.06, 0.38]} scale={[0.08, EYE_OPEN, 0.05]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color="#2B2118" roughness={0.3} />
          </mesh>
          <mesh ref={eyeR} position={[-0.18, 0.06, 0.38]} scale={[0.08, EYE_OPEN, 0.05]}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color="#2B2118" roughness={0.3} />
          </mesh>

          {/* forehead stripes */}
          {[-0.14, 0, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.3, 0.28]} scale={[0.022, 0.08, 0.02]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={FUR_DARK} roughness={0.9} />
            </mesh>
          ))}

          {/* whiskers */}
          {[
            [0.3, -0.16, 0.3, 0.35],
            [0.3, -0.21, 0.28, 0.18],
            [-0.3, -0.16, 0.3, -0.35],
            [-0.3, -0.21, 0.28, -0.18],
          ].map(([x, y, z, rot], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]} scale={[0.22, 0.007, 0.007]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4A3826" roughness={1} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
