export type Topic = "system" | "avalanche";
export type Variant = "hero" | "lesson";
export type Tier = "high" | "low";

export const COLORS = {
  bg: "#120c17",
  floor: "#1a1220",
  obsidian: "#17111f",
  obsidianPanel: "#261a36",
  gold: "#d8aa67",
  goldDeep: "#a9783d",
  cloth: "#8c1b2b",
  crystal: "#3fd3cf",
  parchment: "#f2e3bf",
  parchmentShade: "#dcc597",
  cover: "#4a1d2a",
  ink: "#5b3d22",
} as const;

export const TOPICS: Record<Topic, { accent: string; response: string; labels: [string, string, string]; title: string }> = {
  system: { accent: "#6fd6e0", response: "#f2c46d", labels: ["Device", "Server", "Database"], title: "System Design" },
  avalanche: { accent: "#ff5a5f", response: "#f2c46d", labels: ["Wallet", "Network", "Validators"], title: "Avalanche" },
};

// World layout. The floor sits at FLOOR_Y; the table is turned to a 3/4 angle while the
// concept chain faces the camera so the three objects always read left → right.
export const FLOOR_Y = -2;
export const TABLE_YAW = 0.62;
export const TABLE_TOP_Y = FLOOR_Y + 0.12 + 1.37;
export const BOOK_Y = TABLE_TOP_Y + 0.62;
export const CAMERA_YAW = 0.16;

// One request/response loop, in seconds: travel to station 2, pause, travel to 3, pause, return, pause.
export const CYCLE = { toMiddle: 1, atMiddle: 0.55, toEnd: 1, atEnd: 0.6, back: 1.25, atStart: 0.5 };
export const CYCLE_LENGTH = Object.values(CYCLE).reduce((sum, value) => sum + value, 0);

export const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
