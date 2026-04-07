import React, { createContext, useContext, useMemo } from "react";
import { COLORS } from "../../constants/colorTheme";
import { createCoordinateTransform } from "../../utils/pathUtils";

// Context
interface CoordContextType {
  toPixel: (x: number, y: number) => { px: number; py: number };
  toMath: (px: number, py: number) => { x: number; y: number };
  svgWidth: number;
  svgHeight: number;
  xRange: [number, number];
  yRange: [number, number];
}

export const CoordContext = createContext<CoordContextType | null>(null);

export const useCoordContext = () => {
  const ctx = useContext(CoordContext);
  if (!ctx) throw new Error("useCoordContext must be used inside CoordinateSystem");
  return ctx;
};

export interface CoordinateSystemProps {
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  gridStep?: number;
  showLabels?: boolean;
  labelStep?: number;
  opacity?: number;
  children?: React.ReactNode;
}

export const CoordinateSystem: React.FC<CoordinateSystemProps> = ({
  width = 1200,
  height = 800,
  xRange = [-5, 5],
  yRange = [-4, 4],
  showGrid = true,
  gridStep = 1,
  showLabels = true,
  labelStep = 1,
  opacity = 1,
  children,
}) => {
  const { toPixel, toMath } = useMemo(
    () => createCoordinateTransform(width, height, xRange, yRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height, xRange[0], xRange[1], yRange[0], yRange[1]]
  );

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  // 生成网格线
  const gridLines: React.ReactNode[] = [];
  if (showGrid) {
    // 垂直网格线
    for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
      const { px } = toPixel(x, 0);
      gridLines.push(
        <line key={`vg-${x}`} x1={px} y1={0} x2={px} y2={height}
          stroke={COLORS.grid} strokeWidth={1} />
      );
    }
    // 水平网格线
    for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
      const { py } = toPixel(0, y);
      gridLines.push(
        <line key={`hg-${y}`} x1={0} y1={py} x2={width} y2={py}
          stroke={COLORS.grid} strokeWidth={1} />
      );
    }
  }

  // 坐标轴原点
  const { px: ox } = toPixel(0, 0);
  const { py: oy } = toPixel(0, 0);

  // 刻度标签
  const labels: React.ReactNode[] = [];
  if (showLabels) {
    for (let x = Math.ceil(xMin / labelStep) * labelStep; x <= xMax; x += labelStep) {
      if (Math.abs(x) < 1e-10) continue;
      const { px } = toPixel(x, 0);
      labels.push(
        <text key={`xl-${x}`} x={px} y={oy + 20} textAnchor="middle"
          fill={COLORS.annotation} fontSize={14}>{x}</text>
      );
    }
    for (let y = Math.ceil(yMin / labelStep) * labelStep; y <= yMax; y += labelStep) {
      if (Math.abs(y) < 1e-10) continue;
      const { py } = toPixel(0, y);
      labels.push(
        <text key={`yl-${y}`} x={ox - 10} y={py + 5} textAnchor="end"
          fill={COLORS.annotation} fontSize={14}>{y}</text>
      );
    }
  }

  const contextValue: CoordContextType = {
    toPixel,
    toMath,
    svgWidth: width,
    svgHeight: height,
    xRange,
    yRange,
  };

  return (
    <CoordContext.Provider value={contextValue}>
      <svg width={width} height={height} style={{ opacity }}>
        {/* 网格 */}
        {gridLines}
        {/* X 轴 */}
        <line x1={0} y1={oy} x2={width} y2={oy} stroke={COLORS.axis} strokeWidth={2} />
        {/* Y 轴 */}
        <line x1={ox} y1={0} x2={ox} y2={height} stroke={COLORS.axis} strokeWidth={2} />
        {/* 箭头：X 轴 */}
        <polygon points={`${width},${oy} ${width - 10},${oy - 5} ${width - 10},${oy + 5}`} fill={COLORS.axis} />
        {/* 箭头：Y 轴 */}
        <polygon points={`${ox},0 ${ox - 5},10 ${ox + 5},10`} fill={COLORS.axis} />
        {/* 轴标签 */}
        <text x={width - 15} y={oy - 10} fill={COLORS.annotation} fontSize={16} fontStyle="italic">x</text>
        <text x={ox + 10} y={15} fill={COLORS.annotation} fontSize={16} fontStyle="italic">y</text>
        {/* 刻度 */}
        {labels}
        {/* 子组件 */}
        {children}
      </svg>
    </CoordContext.Provider>
  );
};
