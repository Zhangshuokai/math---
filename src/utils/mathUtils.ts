/**
 * 生成函数的 SVG path 字符串
 * @param fn 数学函数
 * @param xMin x 轴最小值
 * @param xMax x 轴最大值
 * @param steps 采样点数量
 * @param toPixel 坐标变换函数
 */
export const generateFunctionPath = (
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  steps: number,
  toPixel: (x: number, y: number) => { px: number; py: number }
): string => {
  const points: string[] = [];
  let isFirst = true;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const y = fn(x);

    if (!isFinite(y) || Math.abs(y) > 1000) {
      isFirst = true;
      continue;
    }

    const { px, py } = toPixel(x, y);
    points.push(`${isFirst ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
    isFirst = false;
  }

  return points.join(" ");
};

/**
 * 生成积分面积的封闭路径
 */
export const generateIntegralPath = (
  fn: (x: number) => number,
  a: number,
  b: number,
  steps: number,
  toPixel: (x: number, y: number) => { px: number; py: number }
): string => {
  const curvePts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = a + (i / steps) * (b - a);
    const y = fn(x);
    const { px, py } = toPixel(x, isFinite(y) ? y : 0);
    curvePts.push(`${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
  }

  const { px: bPx, py: bPy0 } = toPixel(b, 0);
  const { px: aPx, py: aPy0 } = toPixel(a, 0);

  return `${curvePts.join(" ")} L ${bPx.toFixed(2)} ${bPy0.toFixed(2)} L ${aPx.toFixed(2)} ${aPy0.toFixed(2)} Z`;
};

/**
 * 数值微分
 */
export const numericalDerivative = (fn: (x: number) => number, x: number, h = 1e-5): number => {
  return (fn(x + h) - fn(x - h)) / (2 * h);
};

/**
 * 生成等差数列
 */
export const linspace = (start: number, end: number, n: number): number[] => {
  return Array.from({ length: n }, (_, i) => start + (i / (n - 1)) * (end - start));
};
