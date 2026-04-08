import React, { useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { useCoordContext } from "./CoordinateSystem";
import { generateFunctionPath } from "../../utils/mathUtils";

// ── 新增：通用傅里叶系数类型 ──────────────────────────────────────────────
export type FourierCoeffFn = (n: number) => { an: number; bn: number };
export type FourierPreset = 'square' | 'sawtooth' | 'triangle';

// 内置预设系数函数
const PRESET_COEFFICIENTS: Record<FourierPreset, FourierCoeffFn> = {
  square: (n) => ({
    an: 0,
    bn: n % 2 === 1 ? 4 / (n * Math.PI) : 0,
  }),
  sawtooth: (n) => ({
    an: 0,
    bn: (2 * Math.pow(-1, n + 1)) / (n * Math.PI),
  }),
  triangle: (n) => ({
    an: n % 2 === 1
      ? (8 / (n * n * Math.PI * Math.PI)) * Math.pow(-1, (n - 1) / 2)
      : 0,
    bn: 0,
  }),
};

export interface FourierSeriesProps {
  terms: number;         // 展示的项数
  drawProgress?: number; // 0~1
  showPartialSums?: boolean;
  color?: string;
  /** 系数来源：预设名称或自定义系数函数。不传时保持方波行为（向后兼容） */
  coefficients?: FourierPreset | FourierCoeffFn;
}

export const FourierSeries: React.FC<FourierSeriesProps> = ({
  terms,
  drawProgress = 1,
  showPartialSums = true,
  color = COLORS.primaryCurve,
  coefficients,
}) => {
  const { toPixel, xRange } = useCoordContext();
  const [xMin, xMax] = xRange;

  const paths = useMemo(() => {
    // 向后兼容：不传 coefficients 时保留原始方波奇数谐波实现
    const isDefaultSquare = !coefficients || coefficients === 'square';

    // 原始方波公式（奇数谐波迭代，与旧版行为完全一致）
    const squarePartialSum = (x: number, n: number): number => {
      let sum = 0;
      for (let k = 1; k <= n; k++) {
        sum += Math.sin((2 * k - 1) * x) / (2 * k - 1);
      }
      return (4 / Math.PI) * sum;
    };

    // 通用傅里叶展开（从 k=1 到 n，使用 an·cos + bn·sin）
    const resolvedCoeffFn: FourierCoeffFn =
      typeof coefficients === 'function'
        ? coefficients
        : PRESET_COEFFICIENTS[(coefficients ?? 'square') as FourierPreset] ??
          PRESET_COEFFICIENTS.square;

    const generalPartialSum = (x: number, n: number): number => {
      let sum = 0;
      for (let k = 1; k <= n; k++) {
        const { an, bn } = resolvedCoeffFn(k);
        sum += an * Math.cos(k * x) + bn * Math.sin(k * x);
      }
      return sum;
    };

    const calcPartialSum = isDefaultSquare ? squarePartialSum : generalPartialSum;

    const result: React.ReactNode[] = [];
    for (let n = 1; n <= terms; n++) {
      const fn = (x: number) => calcPartialSum(x, n);
      const pathData = generateFunctionPath(fn, xMin, xMax, 400, toPixel);
      const isLast = n === terms;
      result.push(
        <path
          key={n}
          d={pathData}
          fill="none"
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
  }, [terms, drawProgress, color, toPixel, xMin, xMax, coefficients]);

  return <g>{paths}</g>;
};
