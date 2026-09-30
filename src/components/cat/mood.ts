export type CatMood =
  | "sit"
  | "lie" // sphinx: lying down, front paws stretched forward, head up
  | "sleep" // lying with her head down on her paws
  | "groom"
  | "walk"
  | "chase"
  | "pounce"
  | "pet";

/** Which of the three body postures a mood is played on top of. */
export type Posture = "up" | "lying" | "sleeping";

export function postureFor(mood: CatMood): Posture {
  if (mood === "sleep") return "sleeping";
  if (mood === "lie") return "lying";
  return "up";
}
