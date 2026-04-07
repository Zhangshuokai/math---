import React, { useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";
import { generateFunctionPath } from "../../utils/mathUtils";

export interface FunctionPlotProps {
  fn: (x: number) => number;
  color?: string;
  strokeWidth?: number;
  steps?: number;
  drawProgress?: number; // 0~1，控制动态绘制进度
  opacity?: number;
  xMin?: number;
  xMax?: number;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  fn,
  color = COLORS.primaryCurve,
  strokeWidth = 3,
  steps = 300,
  drawProgress = 1,
  opacity = 1,
  xMin,
  xMax,
}) => {
  const { toPixel, xRange } = useCoordContext();
  const [ctxXMin, ctxXMax] = xRange;

  const pathData = useMemo(() => {
    return generateFunctionPath(fn, xMin ?? ctxXMin, xMax ?? ctxXMax, steps, toPixel);
  }, [fn, xMin, xMax, ctxXMin, ctxXMax, steps, toPixel]);

  return (
    <path
      d={pathData}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - drawProgress}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};
