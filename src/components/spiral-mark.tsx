"use client";

import { useEffect, useRef } from "react";

type SpiralMarkProps = {
  /** viewBox width & height (square) */
  size?: number;
  /** spiral bounding width inside the viewBox */
  w?: number;
  /** spiral bounding height inside the viewBox */
  h?: number;
  loops?: number;
  step?: number;
  radius?: number;
  /** stroke thickness for the yellow line */
  thick?: number;
  className?: string;
  /** 0–1: if provided renders a progress ring; otherwise renders the full mark */
  progress?: number;
};

function spiralPath(
  cx: number,
  cy: number,
  width: number,
  height: number,
  loops: number,
  step: number,
  radius: number,
): string {
  let w = width;
  let h = height;
  let x = cx - w / 2;
  let y = cy - h / 2;
  let d = `M ${x + radius} ${y}`;

  for (let i = 0; i < loops; i++) {
    const right = x + w;
    const bottom = y + h;
    d += ` L ${right - radius} ${y} Q ${right} ${y} ${right} ${y + radius}`;
    d += ` L ${right} ${bottom - radius} Q ${right} ${bottom} ${right - radius} ${bottom}`;
    d += ` L ${x + radius} ${bottom} Q ${x} ${bottom} ${x} ${bottom - radius}`;
    const newY = y + step;
    d += ` L ${x} ${newY + radius} Q ${x} ${newY} ${x + radius} ${newY}`;
    x = x + step;
    y = newY;
    w = w - step * 2;
    h = h - step * 2;
    if (w > 0 && h > 0) {
      d += ` L ${x + radius} ${y}`;
    }
  }
  d += ` L ${x + w * 0.4} ${y + h * 0.5}`;
  return d;
}

export function SpiralMark({
  size = 130,
  w = 112,
  h = 72,
  loops = 3,
  step = 13,
  radius = 12,
  thick = 14,
  className,
  progress,
}: SpiralMarkProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const cx = size / 2;
  const cy = size / 2;
  const d = spiralPath(cx, cy, w, h, loops, step, radius);
  const isProgress = progress !== undefined;

  useEffect(() => {
    if (!isProgress || pathRef.current == null) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = String(len);
    pathRef.current.style.strokeDashoffset = String(len * (1 - (progress ?? 0)));
  }, [isProgress, progress]);

  if (isProgress) {
    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
        className={className}
      >
        {/* track */}
        <path
          d={d}
          fill="none"
          stroke="#14140D"
          strokeWidth={thick + 6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.12}
        />
        {/* fill */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="#2CA14C"
          strokeWidth={thick}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke-dashoffset 900ms ease" }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      {/* ink outline */}
      <path
        d={d}
        fill="none"
        stroke="#14140D"
        strokeWidth={thick + 7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* yellow spiral */}
      <path
        d={d}
        fill="none"
        stroke="#FFD500"
        strokeWidth={thick}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
