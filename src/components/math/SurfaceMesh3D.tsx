import React from 'react';
import { useCoordContext3D } from './CoordinateSystem3D';

export interface SurfaceMesh3DProps {
  x: (u: number, v: number) => number;
  y: (u: number, v: number) => number;
  z: (u: number, v: number) => number;
  uMin: number;
  uMax: number;
  uSteps?: number;    // u方向步数，默认 12
  vMin: number;
  vMax: number;
  vSteps?: number;    // v方向步数，默认 12
  color?: string;     // 默认 '#61dafb'
  strokeWidth?: number; // 默认 1
  opacity?: number;   // 默认 0.6
  fillOpacity?: number; // 默认 0（不填充）
}

export const SurfaceMesh3D: React.FC<SurfaceMesh3DProps> = ({
  x,
  y,
  z,
  uMin,
  uMax,
  uSteps = 12,
  vMin,
  vMax,
  vSteps = 12,
  color = '#61dafb',
  strokeWidth = 1,
  opacity = 0.6,
  fillOpacity = 0,
}) => {
  const { toISO } = useCoordContext3D();

  const lines: React.ReactNode[] = [];

  // 沿u方向画线：固定v，让u从uMin到uMax变化（共 vSteps+1 条）
  for (let vi = 0; vi <= vSteps; vi++) {
    const v = vMin + (vMax - vMin) * (vi / vSteps);
    const pts: string[] = [];
    for (let ui = 0; ui <= uSteps; ui++) {
      const u = uMin + (uMax - uMin) * (ui / uSteps);
      const { svgX, svgY } = toISO(x(u, v), y(u, v), z(u, v));
      pts.push(`${svgX},${svgY}`);
    }
    lines.push(
      <polyline
        key={`u-line-${vi}`}
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }

  // 沿v方向画线：固定u，让v从vMin到vMax变化（共 uSteps+1 条）
  for (let ui = 0; ui <= uSteps; ui++) {
    const u = uMin + (uMax - uMin) * (ui / uSteps);
    const pts: string[] = [];
    for (let vi = 0; vi <= vSteps; vi++) {
      const v = vMin + (vMax - vMin) * (vi / vSteps);
      const { svgX, svgY } = toISO(x(u, v), y(u, v), z(u, v));
      pts.push(`${svgX},${svgY}`);
    }
    lines.push(
      <polyline
        key={`v-line-${ui}`}
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <g opacity={opacity} fillOpacity={fillOpacity}>
      {lines}
    </g>
  );
};
