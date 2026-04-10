import React from 'react';
import { useCoordContext3D } from './CoordinateSystem3D';

export interface ParametricCurve3DProps {
  x: (t: number) => number;  // x(t)
  y: (t: number) => number;  // y(t)
  z: (t: number) => number;  // z(t)
  tMin: number;               // 参数t范围
  tMax: number;
  segments?: number;          // 分段数，默认 100
  color?: string;             // 默认 '#61dafb'
  strokeWidth?: number;       // 默认 2
  drawProgress?: number;      // 0→1 描绘动画，默认 1
  opacity?: number;
}

export const ParametricCurve3D: React.FC<ParametricCurve3DProps> = ({
  x,
  y,
  z,
  tMin,
  tMax,
  segments = 100,
  color = '#61dafb',
  strokeWidth = 2,
  drawProgress = 1,
  opacity = 1,
}) => {
  const { toISO } = useCoordContext3D();

  // 生成所有采样点（共 segments+1 个）
  const allPoints: Array<{ svgX: number; svgY: number }> = [];
  for (let i = 0; i <= segments; i++) {
    const t = tMin + (tMax - tMin) * (i / segments);
    allPoints.push(toISO(x(t), y(t), z(t)));
  }

  // 根据 drawProgress 截取前 N 个点
  const visibleCount = Math.max(2, Math.floor(drawProgress * allPoints.length));
  const visiblePoints = allPoints.slice(0, visibleCount);

  if (visiblePoints.length < 2) return null;

  // 构建 polyline points 属性字符串
  const pointsStr = visiblePoints
    .map(({ svgX, svgY }) => `${svgX},${svgY}`)
    .join(' ');

  return (
    <polyline
      points={pointsStr}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
};
