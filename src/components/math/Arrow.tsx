import React from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";

export interface ArrowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
  opacity?: number;
}

export const Arrow: React.FC<ArrowProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  color = COLORS.vector,
  strokeWidth = 2.5,
  label,
  opacity = 1,
}) => {
  const { toPixel } = useCoordContext();
  const { px: x1, py: y1 } = toPixel(fromX, fromY);
  const { px: x2, py: y2 } = toPixel(toX, toY);
  const markerId = `arrow-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <g opacity={opacity}>
      <defs>
        <marker id={markerId} markerWidth="10" markerHeight="7"
          refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={strokeWidth}
        markerEnd={`url(#${markerId})`} />
      {label && (
        <text x={(x1 + x2) / 2 + 10} y={(y1 + y2) / 2 - 10}
          fill={color} fontSize={16} fontStyle="italic">{label}</text>
      )}
    </g>
  );
};
