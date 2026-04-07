import React, { useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";
import { generateFunctionPath } from "../../utils/mathUtils";

export interface FourierSeriesProps {
  terms: number;         // 展示的项数（奇数项：1, 3, 5...）
  drawProgress?: number; // 0~1
  showPartialSums?: boolean;
  color?: string;
}

export const FourierSeries: React.FC<FourierSeriesProps> = ({
  terms,
  drawProgress = 1,
  showPartialSums = true,
  color = COLORS.primaryCurve,
}) => {
  const { toPixel, xRange } = useCoordContext();
  const [xMin, xMax] = xRange;

  // 方波傅里叶展开：f(x) = (4/π) * Σ sin((2k-1)x) / (2k-1)
  const partialSum = (x: number, n: number): number => {
    let sum = 0;
    for (let k = 1; k <= n; k++) {
      sum += Math.sin((2 * k - 1) * x) / (2 * k - 1);
    }
    return (4 / Math.PI) * sum;
  };

  const paths = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let n = 1; n <= terms; n++) {
      const fn = (x: number) => partialSum(x, n);
      const pathData = generateFunctionPath(fn, xMin, xMax, 400, toPixel);
      const isLast = n === terms;
      result.push(
        <path key={n} d={pathData} fill="none"
          stroke={isLast ? color : COLORS.secondaryCurve}
          strokeWidth={isLast ? 3 : 1}
          opacity={isLast ? 1 : 0.3}
          pathLength={isLast ? 1 : undefined}
          strokeDasharray={isLast ? 1 : undefined}
          strokeDashoffset={isLast ? 1 - drawProgress : undefined}
        />
      );
    }
    return result;
  }, [terms, drawProgress, color, toPixel, xMin, xMax]);

  return <g>{paths}</g>;
};
