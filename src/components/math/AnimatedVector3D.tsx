import React from 'react';
import { interpolate } from 'remotion';
import { useCoordContext3D } from './CoordinateSystem3D';

export interface AnimatedVector3DProps {
  from: [number, number, number];  // 起点 [x,y,z]
  to: [number, number, number];    // 终点 [x,y,z]
  color?: string;                   // 默认 '#ffd700'
  strokeWidth?: number;             // 默认 2
  drawProgress?: number;            // 0→1 描绘动画，默认 1
  label?: string;                   // 标签文字
  labelOffset?: [number, number];   // 标签SVG偏移，默认 [8, -8]
  opacity?: number;                 // 默认 1
}

export const AnimatedVector3D: React.FC<AnimatedVector3DProps> = ({
  from,
  to,
  color = '#ffd700',
  strokeWidth = 2,
  drawProgress = 1,
  label,
  labelOffset = [8, -8],
  opacity = 1,
}) => {
  const { toISO } = useCoordContext3D();

  // 将起终点转换为SVG坐标
  const startSVG = toISO(from[0], from[1], from[2]);
  const endSVG = toISO(to[0], to[1], to[2]);

  // 根据 drawProgress 计算实际终点（线性插值）
  const currentX = interpolate(drawProgress, [0, 1], [startSVG.svgX, endSVG.svgX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentY = interpolate(drawProgress, [0, 1], [startSVG.svgY, endSVG.svgY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 计算箭头方向
  const dx = currentX - startSVG.svgX;
  const dy = currentY - startSVG.svgY;
  const len = Math.sqrt(dx * dx + dy * dy);

  // 箭头头部三角形（仅在有足够长度时渲染）
  const ARROW_SIZE = 10;
  const showArrow = drawProgress > 0.05 && len > ARROW_SIZE;

  let arrowPoints = '';
  if (showArrow) {
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    // 三角形：尖端 + 两翼
    const tipX = currentX;
    const tipY = currentY;
    const baseX = currentX - ARROW_SIZE * ux;
    const baseY = currentY - ARROW_SIZE * uy;
    const wing1X = baseX + (ARROW_SIZE * 0.5) * px;
    const wing1Y = baseY + (ARROW_SIZE * 0.5) * py;
    const wing2X = baseX - (ARROW_SIZE * 0.5) * px;
    const wing2Y = baseY - (ARROW_SIZE * 0.5) * py;
    arrowPoints = `${tipX},${tipY} ${wing1X},${wing1Y} ${wing2X},${wing2Y}`;
  }

  // 线段终点（如有箭头则缩短一点，避免线段超出箭头）
  const lineEndX = showArrow && len > 0 ? currentX - (ARROW_SIZE * 0.8) * (dx / len) : currentX;
  const lineEndY = showArrow && len > 0 ? currentY - (ARROW_SIZE * 0.8) * (dy / len) : currentY;

  return (
    <g opacity={opacity}>
      {/* 向量线段 */}
      <line
        x1={startSVG.svgX}
        y1={startSVG.svgY}
        x2={lineEndX}
        y2={lineEndY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* 箭头头部 */}
      {showArrow && (
        <polygon
          points={arrowPoints}
          fill={color}
        />
      )}
      {/* 标签 */}
      {label && drawProgress > 0.8 && (
        <text
          x={currentX + labelOffset[0]}
          y={currentY + labelOffset[1]}
          fill={color}
          fontSize={16}
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};
