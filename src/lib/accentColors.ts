export type AccentColor = {
  id: string;
  name: string;
  hex: string;
  soft: string;
};

export const accentColors: AccentColor[] = [
  { id: "blue", name: "Blue", hex: "#0A84FF", soft: "rgba(10,132,255,0.35)" },
  { id: "purple", name: "Purple", hex: "#BF5AF2", soft: "rgba(191,90,242,0.35)" },
  { id: "pink", name: "Pink", hex: "#FF375F", soft: "rgba(255,55,95,0.35)" },
  { id: "red", name: "Red", hex: "#FF453A", soft: "rgba(255,69,58,0.35)" },
  { id: "orange", name: "Orange", hex: "#FF9F0A", soft: "rgba(255,159,10,0.35)" },
  { id: "yellow", name: "Yellow", hex: "#FFD60A", soft: "rgba(255,214,10,0.35)" },
  { id: "green", name: "Green", hex: "#32D74B", soft: "rgba(50,215,75,0.35)" },
  { id: "graphite", name: "Graphite", hex: "#8E8E93", soft: "rgba(142,142,147,0.35)" },
];
