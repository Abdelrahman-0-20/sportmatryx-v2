/**
 * American-football tactics model — the logic behind the 3D board.
 *
 * Everything the board renders comes from this module: formations (eleven
 * players each, positioned as 0–100 percentages on the field), phases (which
 * formations can run them, where the ball sits, and which ROLES carry the
 * action) and the game-systems library (one formation + phase pair each).
 *
 * Arrows reference players by role rather than by index, so one phase works on
 * every compatible formation — `resolveArrows` simply drops roles a formation
 * does not have. Selecting a phase calls `formationForPhase`, which swaps the
 * shape to one that can actually run it, so the board never draws an empty play.
 *
 * Coordinates: y = 10 is the far goal line and y = 90 the near goal line; the
 * two end zones live outside those bands (see FIELD in tactical-board.tsx).
 */

export type Player = { x: number; y: number; role: string };
export type Arrow = { from: string; to: [number, number] };
export type PhaseKey = "run" | "pass" | "defense" | "special";

/** Eleven players per shape. Keys are language-neutral (formation names). */
export const FORMATIONS: Record<string, Player[]> = {
  "I-Form": [
    { x: 34, y: 70, role: "OL1" },
    { x: 42, y: 70, role: "OL2" },
    { x: 50, y: 70, role: "OL3" },
    { x: 58, y: 70, role: "OL4" },
    { x: 66, y: 70, role: "OL5" },
    { x: 74, y: 70, role: "TE" },
    { x: 16, y: 64, role: "WR1" },
    { x: 84, y: 64, role: "WR2" },
    { x: 50, y: 76, role: "QB" },
    { x: 50, y: 83, role: "FB" },
    { x: 50, y: 89, role: "TB" },
  ],
  Shotgun: [
    { x: 34, y: 70, role: "OL1" },
    { x: 42, y: 70, role: "OL2" },
    { x: 50, y: 70, role: "OL3" },
    { x: 58, y: 70, role: "OL4" },
    { x: 66, y: 70, role: "OL5" },
    { x: 74, y: 71, role: "TE" },
    { x: 16, y: 64, role: "WR1" },
    { x: 84, y: 64, role: "WR2" },
    { x: 26, y: 65, role: "WR3" },
    { x: 50, y: 78, role: "QB" },
    { x: 58, y: 86, role: "TB" },
  ],
  Kickoff: [
    { x: 50, y: 88, role: "K" },
    { x: 30, y: 78, role: "T1" },
    { x: 40, y: 78, role: "T2" },
    { x: 50, y: 78, role: "T3" },
    { x: 60, y: 78, role: "T4" },
    { x: 70, y: 78, role: "T5" },
    { x: 24, y: 66, role: "M1" },
    { x: 50, y: 66, role: "M2" },
    { x: 76, y: 66, role: "M3" },
    { x: 38, y: 40, role: "R1" },
    { x: 62, y: 40, role: "R2" },
  ],
  "4-3": [
    { x: 34, y: 56, role: "DL1" },
    { x: 44, y: 56, role: "DL2" },
    { x: 56, y: 56, role: "DL3" },
    { x: 66, y: 56, role: "DL4" },
    { x: 32, y: 67, role: "LB1" },
    { x: 50, y: 67, role: "LB2" },
    { x: 68, y: 67, role: "LB3" },
    { x: 16, y: 80, role: "CB1" },
    { x: 84, y: 80, role: "CB2" },
    { x: 42, y: 86, role: "S1" },
    { x: 58, y: 86, role: "S2" },
  ],
  "3-4": [
    { x: 40, y: 56, role: "DL1" },
    { x: 50, y: 56, role: "DL2" },
    { x: 60, y: 56, role: "DL3" },
    { x: 26, y: 67, role: "LB1" },
    { x: 42, y: 67, role: "LB2" },
    { x: 58, y: 67, role: "LB3" },
    { x: 74, y: 67, role: "LB4" },
    { x: 16, y: 80, role: "CB1" },
    { x: 84, y: 80, role: "CB2" },
    { x: 42, y: 86, role: "S1" },
    { x: 58, y: 86, role: "S2" },
  ],
};

export const FORMATION_KEYS = Object.keys(FORMATIONS);

export type Phase = {
  key: PhaseKey;
  /** Shapes that can run this phase, in preference order. */
  formations: string[];
  /** Where the ball sits for this phase, in field percentages. */
  ball: [number, number];
  /** Action drawn by the board — resolved against the current formation. */
  arrows: Arrow[];
};

export const PHASES: Phase[] = [
  {
    key: "run",
    formations: ["I-Form", "Shotgun"],
    ball: [50, 72],
    arrows: [
      { from: "TB", to: [44, 54] },
      { from: "QB", to: [50, 66] },
      { from: "TE", to: [76, 54] },
    ],
  },
  {
    key: "pass",
    formations: ["I-Form", "Shotgun"],
    ball: [50, 74],
    arrows: [
      { from: "WR1", to: [18, 26] },
      { from: "WR2", to: [82, 30] },
      { from: "TE", to: [64, 44] },
      { from: "QB", to: [46, 62] },
    ],
  },
  {
    key: "defense",
    formations: ["4-3", "3-4"],
    ball: [50, 50],
    arrows: [
      { from: "DL1", to: [48, 42] },
      { from: "LB1", to: [40, 50] },
      { from: "CB1", to: [18, 58] },
    ],
  },
  {
    key: "special",
    formations: ["Kickoff"],
    ball: [50, 88],
    arrows: [
      { from: "K", to: [50, 34] },
      { from: "M1", to: [30, 50] },
      { from: "M2", to: [70, 50] },
    ],
  },
];

export const PHASE_KEYS = PHASES.map((p) => p.key);

/**
 * Game-systems library — a formation + phase pair each. Display copy (name,
 * tag, body) comes from the locale dictionary, indexed in this exact order.
 */
export const SYSTEMS: Array<{ formation: string; phase: PhaseKey }> = [
  { formation: "I-Form", phase: "run" },
  { formation: "I-Form", phase: "pass" },
  { formation: "Shotgun", phase: "pass" },
  { formation: "4-3", phase: "defense" },
  { formation: "3-4", phase: "defense" },
  { formation: "Kickoff", phase: "special" },
];

/** The phase a shape falls back to when the user picks a formation directly. */
export function phaseForFormation(formation: string): PhaseKey {
  return PHASES.find((p) => p.formations.includes(formation))?.key ?? PHASES[0]!.key;
}

/** A shape that can run `phase`, keeping the current one when it qualifies. */
export function formationForPhase(phase: PhaseKey, current: string): string {
  const p = PHASES.find((x) => x.key === phase)!;
  return p.formations.includes(current) ? current : p.formations[0]!;
}

/** Resolve a phase's arrows against a formation, skipping absent roles. */
export function resolveArrows(
  phase: Phase,
  players: Player[],
): Array<{ from: [number, number]; to: [number, number] }> {
  const byRole = new Map(players.map((p) => [p.role, p]));
  return phase.arrows.flatMap((a) => {
    const origin = byRole.get(a.from);
    return origin ? [{ from: [origin.x, origin.y] as [number, number], to: a.to }] : [];
  });
}
