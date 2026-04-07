/**
 * 生成箭头 marker 的 SVG defs 代码（返回 JSX 用的属性对象）
 */
export const arrowMarkerId = (color: string): string => {
  return `arrow-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
};

/**
 * 创建坐标变换函数
 */
export const createCoordinateTransform = (
  svgWidth: number,
  svgHeight: number,
  xRange: [number, number],
  yRange: [number, number]
) => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const toPixel = (x: number, y: number) => ({
    px: ((x - xMin) / (xMax - xMin)) * svgWidth,
    py: svgHeight - ((y - yMin) / (yMax - yMin)) * svgHeight,
  });

  const toMath = (px: number, py: number) => ({
    x: xMin + (px / svgWidth) * (xMax - xMin),
    y: yMin + ((svgHeight - py) / svgHeight) * (yMax - yMin),
  });

  return { toPixel, toMath };
};
