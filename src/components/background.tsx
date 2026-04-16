"use client";

import { useMemo } from "react";

/** Deterministic hash so server & client render the same grid */
function rand(i: number, seed: number): number {
  let h = ((i + 1) * 2654435761 + seed) | 0;
  h = (((h >> 16) ^ h) * 0x45d9f3b) | 0;
  return (((h >> 16) ^ h) >>> 0) / 4294967295;
}

const CELL = 16; // px – square cell size
const GAP = 3; // px
// Enough cells to tile a large viewport (overflow hidden handles excess)
const TOTAL = 8000;

const COLORS_LIGHT = [
  "rgb(220 252 231 / 0.6)",
  "rgb(187 247 208 / 0.7)",
  "rgb(134 239 172 / 0.6)",
  "rgb(74 222 128 / 0.6)",
];

const COLORS_DARK = [
  "rgb(5 46 22 / 0.25)",
  "rgb(20 83 45 / 0.3)",
  "rgb(21 128 61 / 0.25)",
  "rgb(34 197 94 / 0.3)",
];

export const Background = () => {
  const cells = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => {
        const r = rand(i, 42);
        const level = r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.82 ? 2 : 3;
        const pulses = rand(i, 137) < 0.08;
        const delay = +(rand(i, 251) * 12).toFixed(1);
        const duration = +(3 + rand(i, 389) * 5).toFixed(1);
        return { level, pulses, delay, duration };
      }),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Center fade — hides grid behind content, visible on left/right edges */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-white [mask-image:linear-gradient(to_right,transparent_0%,transparent_10%,white_25%,white_75%,transparent_90%,transparent_100%)] dark:bg-black" />

      {/* Activity grid — fixed-size square cells, auto-wrapped */}
      <div
        className="absolute inset-0 grid p-1"
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
          gap: `${GAP}px`,
        }}
      >
        {cells.map(({ level, pulses, delay, duration }, i) => (
          <div
            key={i}
            className="rounded-[2px] bg-[--cell-bg] dark:bg-[--cell-bg-dark]"
            style={
              {
                "--cell-bg": COLORS_LIGHT[level],
                "--cell-bg-dark": COLORS_DARK[level],
                ...(pulses
                  ? {
                      animation: `grid-pulse ${duration}s ease-in-out ${delay}s infinite`,
                    }
                  : {}),
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
};
