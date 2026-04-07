import React, { useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";
import { generateIntegralPath } from "../../utils/mathUtils";

export interface IntegralAreaProps {
  fn: (x: number) => number;
  a: number;
  b: number;
  fillColor?: string;
  fillProgress?: number; // 0~1，积分区间从 a 扩展到 b 的动画进度
  steps?: number;
}

export const IntegralArea: React.FC<IntegralAreaProps> = ({
  fn,
  a,
  b,
  fillColor = COLORS.integralArea,
  fillProgress = 1,
  steps = 100,
}) => {
  const { toPixel } = useCoordContext();

  const currentB = a + (b - a) * fillProgress;

  const pathData = useMemo(() => {
    return generateIntegralPath(fn, a, currentB, steps, toPixel);
  }, [fn, a, currentB, steps, toPixel]);

  if (fillProgress <= 0) return null;

  return (
    <path
      d={pathData}
      fill={fillColor}
      stroke="none"
    />
  );
};
