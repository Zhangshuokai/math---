import React, { useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";

export interface VectorFieldProps {
  Px: (x: number, y: number) => number; // x 分量
  Py: (x: number, y: number) => number; // y 分量
  gridCount?: number; // 每轴采样点数
  scale?: number;     // 箭头缩放
  color?: string;
  opacity?: number;
}

export const VectorField: React.FC<VectorFieldProps> = ({
  Px,
  Py,
  gridCount = 12,
  scale = 0.3,
  color = COLORS.vector,
  opacity = 0.7,
}) => {
  const { toPixel, xRange, yRange } = useCoordContext();
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const arrows = useMemo(() => {
    const result: React.ReactNode[] = [];
    const dx = (xMax - xMin) / gridCount;
    const dy = (yMax - yMin) / gridCount;

    for (let i = 0; i <= gridCount; i++) {
      for (let j = 0; j <= gridCount; j++) {
        const x = xMin + i * dx;
        const y = yMin + j * dy;
        const vx = Px(x, y);
        const vy = Py(x, y);
        const len = Math.sqrt(vx * vx + vy * vy);
        if (len < 1e-10) continue;

        const normVx = (vx / len) * scale;
        const normVy = (vy / len) * scale;

        const { px: x1, py: y1 } = toPixel(x, y);
        const { px: x2, py: y2 } = toPixel(x + normVx, y + normVy);
        const markerId = `vf-arrow-${i}-${j}`;

        result.push(
          <g key={`${i}-${j}`}>
            <defs>
              <marker id={markerId} markerWidth="6" markerHeight="5"
                refX="5" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={color} />
              </marker>
            </defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color} strokeWidth={1.5}
              markerEnd={`url(#${markerId})`} />
          </g>
        );
      }
    }
    return result;
  }, [Px, Py, gridCount, scale, color, toPixel, xMin, xMax, yMin, yMax]);

  return <g opacity={opacity}>{arrows}</g>;
};
