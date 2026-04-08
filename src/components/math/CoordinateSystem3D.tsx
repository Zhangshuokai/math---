import React, { createContext, useContext } from 'react';

// 等轴测投影常量
const COS30 = Math.sqrt(3) / 2; // ≈ 0.866
const SIN30 = 0.5;

export interface ToISOResult { svgX: number; svgY: number }
export type ToISOFn = (x: number, y: number, z: number) => ToISOResult;

interface CoordContext3DType {
  toISO: ToISOFn;
  center: [number, number];
  scale: number;
}

const CoordContext3D = createContext<CoordContext3DType | null>(null);

export function useCoordContext3D(): CoordContext3DType {
  const ctx = useContext(CoordContext3D);
  if (!ctx) throw new Error('useCoordContext3D must be used inside CoordinateSystem3D');
  return ctx;
}

export interface CoordinateSystem3DProps {
  center?: [number, number];    // SVG 坐标系原点位置，默认 [540, 400]
  scale?: number;               // 单位长度对应像素数，默认 60
  xRange?: [number, number];    // x 轴范围，默认 [-3, 3]
  yRange?: [number, number];    // y 轴范围，默认 [-3, 3]
  zRange?: [number, number];    // z 轴范围，默认 [0, 4]
  showGrid?: boolean;           // 是否显示 xy 平面网格，默认 true
  axisColor?: string;           // 坐标轴颜色，默认 '#94A3B8'
  gridColor?: string;           // 网格线颜色，默认 '#1E293B'
  children?: React.ReactNode;
  width?: number;               // SVG 宽度，默认 500
  height?: number;              // SVG 高度，默认 450
}

export const CoordinateSystem3D: React.FC<CoordinateSystem3DProps> = ({
  center = [540, 400],
  scale = 60,
  xRange = [-3, 3],
  yRange = [-3, 3],
  zRange = [0, 4],
  showGrid = true,
  axisColor = '#94A3B8',
  gridColor = '#1E293B',
  children,
  width = 500,
  height = 450,
}) => {
  const [cx, cy] = center;
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const [, zMax] = zRange;

  // 等轴测投影函数
  const toISO: ToISOFn = (x, y, z) => ({
    svgX: cx + (x - y) * COS30 * scale,
    svgY: cy + (x + y) * SIN30 * scale - z * scale,
  });

  // 绘制 xy 平面网格（z=0）
  const gridLines: React.ReactNode[] = [];
  if (showGrid) {
    // x 方向网格线（固定 x，沿 y 方向延伸）
    for (let xi = Math.ceil(xMin); xi <= Math.floor(xMax); xi++) {
      const start = toISO(xi, yMin, 0);
      const end = toISO(xi, yMax, 0);
      gridLines.push(
        <line
          key={`gx-${xi}`}
          x1={start.svgX} y1={start.svgY}
          x2={end.svgX} y2={end.svgY}
          stroke={gridColor}
          strokeWidth={0.8}
        />
      );
    }
    // y 方向网格线（固定 y，沿 x 方向延伸）
    for (let yi = Math.ceil(yMin); yi <= Math.floor(yMax); yi++) {
      const start = toISO(xMin, yi, 0);
      const end = toISO(xMax, yi, 0);
      gridLines.push(
        <line
          key={`gy-${yi}`}
          x1={start.svgX} y1={start.svgY}
          x2={end.svgX} y2={end.svgY}
          stroke={gridColor}
          strokeWidth={0.8}
        />
      );
    }
  }

  // 绘制坐标轴（带箭头和标签）
  const ARROW_LEN = 8;
  const ARROW_HALF_WIDTH = 4;

  function makeArrowAxis(
    fromPt: [number, number, number],
    toPt: [number, number, number],
    label: string,
    key: string
  ): React.ReactNode {
    const p1 = toISO(fromPt[0], fromPt[1], fromPt[2]);
    const p2 = toISO(toPt[0], toPt[1], toPt[2]);
    const dx = p2.svgX - p1.svgX;
    const dy = p2.svgY - p1.svgY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-6) return null;
    const ux = dx / len;
    const uy = dy / len;
    // 垂直方向
    const px = -uy;
    const py = ux;
    // 箭头两翼
    const ax = p2.svgX - ARROW_LEN * ux + ARROW_HALF_WIDTH * px;
    const ay = p2.svgY - ARROW_LEN * uy + ARROW_HALF_WIDTH * py;
    const bx = p2.svgX - ARROW_LEN * ux - ARROW_HALF_WIDTH * px;
    const by = p2.svgY - ARROW_LEN * uy - ARROW_HALF_WIDTH * py;

    return (
      <g key={key}>
        <line
          x1={p1.svgX} y1={p1.svgY}
          x2={p2.svgX} y2={p2.svgY}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        <polygon
          points={`${p2.svgX},${p2.svgY} ${ax},${ay} ${bx},${by}`}
          fill={axisColor}
        />
        <text
          x={p2.svgX + ux * 16}
          y={p2.svgY + uy * 16}
          fill={axisColor}
          fontSize={16}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          {label}
        </text>
      </g>
    );
  }

  return (
    <CoordContext3D.Provider value={{ toISO, center, scale }}>
      <svg
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      >
        {/* 渲染顺序：grid → axes → children */}
        {showGrid && gridLines}
        {makeArrowAxis([0, 0, 0], [xMax + 0.5, 0, 0], 'x', 'axis-x')}
        {makeArrowAxis([0, 0, 0], [0, yMax + 0.5, 0], 'y', 'axis-y')}
        {makeArrowAxis([0, 0, 0], [0, 0, zMax + 0.5], 'z', 'axis-z')}
        {children}
      </svg>
    </CoordContext3D.Provider>
  );
};
