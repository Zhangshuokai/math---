import React from 'react';
import { useCoordContext3D } from './CoordinateSystem3D';

export interface Plane3DProps {
  // 直接给定四角点（顺序应构成凸四边形，推荐顺时针或逆时针排列）
  corners: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
  color?: string;         // 默认 '#ff79c6'
  fillOpacity?: number;   // 默认 0.3
  strokeOpacity?: number; // 默认 0.8
  strokeWidth?: number;   // 默认 1.5
  opacity?: number;       // 整体透明度，默认 1
}

export const Plane3D: React.FC<Plane3DProps> = ({
  corners,
  color = '#ff79c6',
  fillOpacity = 0.3,
  strokeOpacity = 0.8,
  strokeWidth = 1.5,
  opacity = 1,
}) => {
  const { toISO } = useCoordContext3D();

  // 将四角点转换为SVG坐标
  const svgCorners = corners.map(([cx, cy, cz]) => toISO(cx, cy, cz));

  // 构建 polygon points 字符串（四角点连成四边形）
  const polygonPoints = svgCorners
    .map(({ svgX, svgY }) => `${svgX},${svgY}`)
    .join(' ');

  // 构建边框 polyline points（闭合：最后加回第一个点）
  const borderPoints = [...svgCorners, svgCorners[0]]
    .map(({ svgX, svgY }) => `${svgX},${svgY}`)
    .join(' ');

  return (
    <g opacity={opacity}>
      {/* 半透明填充面 */}
      <polygon
        points={polygonPoints}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
      />
      {/* 边框描边 */}
      <polyline
        points={borderPoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinejoin="round"
      />
    </g>
  );
};
