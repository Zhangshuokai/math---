# 专题可视化组件（Special Components）

> 文件路径：`src/components/special/`
> 这些组件为特定章节的核心可视化需求定制，复用度低但视觉冲击力强。

---

## FourierSeries

**文件**：`src/components/special/FourierSeries.tsx`
**职责**：傅里叶级数可视化，支持逐项叠加曲线模式和旋转圆（龙卷风）模式。
**主要使用章节**：第十二章 Sec06

### Props 类型定义

```typescript
interface FourierCoefficient {
  /** 谐波次数（1, 2, 3, ...） */
  n: number;
  /** 余弦系数 aₙ */
  an: number;
  /** 正弦系数 bₙ */
  bn: number;
}

interface FourierSeriesProps {
  /** 常数项 a₀/2 */
  a0: number;
  /** 傅里叶系数数组（按 n 升序排列） */
  coefficients: FourierCoefficient[];
  /** 当前显示到第几项（1-based），控制叠加动画 */
  visibleTerms?: number;
  /** 目标函数（用于对比显示，可选） */
  targetFn?: (x: number) => number;
  /** 基本周期 2L，默认 2π */
  period?: number;
  /** x 显示范围（数学坐标），默认 [-π, π] */
  xRange?: [number, number];
  /**
   * 可视化模式：
   * 'curve'   — 叠加曲线模式（在坐标系内显示近似曲线）
   * 'circles' — 旋转圆模式（多圆叠加绘制路径）
   * 'both'    — 同时显示（画面左侧旋转圆，右侧实时曲线）
   */
  mode?: "curve" | "circles" | "both";
  /** 旋转圆动画相位（弧度），由 useCurrentFrame 驱动 */
  circlePhase?: number;
  /** 近似曲线颜色，默认 COLORS.primaryCurve */
  curveColor?: string;
  /** 目标函数颜色，默认 COLORS.secondaryCurve */
  targetColor?: string;
  /** 旋转圆圆周颜色，默认 COLORS.grid */
  circleStrokeColor?: string;
  /** 旋转圆半径向量颜色，默认 COLORS.vector */
  radiusColor?: string;
  /** 路径追踪颜色（circles 模式），默认 COLORS.primaryCurve */
  traceColor?: string;
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 坐标系宽度（curve 模式），默认 800 */
  width?: number;
  /** 坐标系高度（curve 模式），默认 500 */
  height?: number;
}
```

### 内置预设函数

```typescript
// 常用傅里叶展开的预设系数，可直接导入
export const FOURIER_PRESETS = {
  /** 方波：f(x) = 1 (0<x<π), -1 (-π<x<0) */
  squareWave: {
    a0: 0,
    coefficients: Array.from({ length: 15 }, (_, i) => {
      const n = 2 * i + 1; // 仅奇数项
      return { n, an: 0, bn: (4 / (n * Math.PI)) };
    }),
  },
  /** 锯齿波：f(x) = x/π (-π<x<π) */
  sawtoothWave: {
    a0: 0,
    coefficients: Array.from({ length: 15 }, (_, i) => {
      const n = i + 1;
      return { n, an: 0, bn: (2 * Math.pow(-1, n + 1)) / n };
    }),
  },
  /** 三角波 */
  triangleWave: {
    a0: 0,
    coefficients: Array.from({ length: 8 }, (_, i) => {
      const n = 2 * i + 1;
      return { n, an: 0, bn: (8 / (Math.PI * Math.PI * n * n)) * Math.pow(-1, i) };
    }),
  },
};
```

### 使用示例

```jsx
// 方波叠加动画（Ch12 Sec06）
const frame = useCurrentFrame();
const visibleTerms = Math.floor(
  interpolate(frame, [330, 540], [1, 15], { extrapolateRight: "clamp" })
);
const circlePhase = (frame / 30) * 2 * Math.PI * 0.5; // 旋转速度

<FourierSeries
  {...FOURIER_PRESETS.squareWave}
  mode="both"
  visibleTerms={visibleTerms}
  circlePhase={circlePhase}
  targetFn={(x) => (x > 0 ? 1 : -1)}
  curveColor={COLORS.primaryCurve}
  targetColor={COLORS.secondaryCurve}
  width={700}
  height={400}
/>
```

---

## SurfaceIntegral

**文件**：`src/components/special/SurfaceIntegral.tsx`
**职责**：三维曲面积分可视化，展示曲面、法向量、被积函数的三维图示。
**主要使用章节**：第十一章 Sec04、Sec05

### Props 类型定义

```typescript
interface SurfaceIntegralProps {
  /**
   * 曲面参数方程 r(u, v) = [x, y, z]
   * 若提供 z = z(x, y)，则用下方 zFn 代替
   */
  paramFn?: (u: number, v: number) => [number, number, number];
  /** 显式曲面 z = zFn(x, y)（与 paramFn 二选一） */
  zFn?: (x: number, y: number) => number;
  /** u 参数范围（paramFn 模式），默认 [0, 2π] */
  uRange?: [number, number];
  /** v 参数范围（paramFn 模式），默认 [0, π] */
  vRange?: [number, number];
  /** x 范围（zFn 模式），默认 [-2, 2] */
  xRange?: [number, number];
  /** y 范围（zFn 模式），默认 [-2, 2] */
  yRange?: [number, number];
  /** u/v 方向网格密度，默认 20 */
  meshResolution?: number;
  /** 曲面颜色（半透明），默认 "rgba(97,218,251,0.3)" */
  surfaceColor?: string;
  /** 网格线颜色，默认 "rgba(97,218,251,0.6)" */
  meshColor?: string;
  /** 是否显示法向量采样，默认 false */
  showNormals?: boolean;
  /** 法向量采样数量，默认 16 */
  normalCount?: number;
  /** 法向量颜色，默认 COLORS.vector */
  normalColor?: string;
  /** 被积函数（用于颜色映射），若提供则按函数值着色曲面 */
  colorFn?: (x: number, y: number, z: number) => number;
  /** 颜色映射范围 [min, max]，配合 colorFn 使用 */
  colorRange?: [number, number];
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 投影矩阵（等距投影参数），默认使用 CoordinateSystem3D 的设置 */
  scale?: number;
  /** 画布中心 x（px） */
  centerX?: number;
  /** 画布中心 y（px） */
  centerY?: number;
}
```

### 使用示例

```jsx
// 半球面上的曲面积分（第一类）
<SurfaceIntegral
  paramFn={(u, v) => [
    Math.sin(v) * Math.cos(u),
    Math.sin(v) * Math.sin(u),
    Math.cos(v),
  ]}
  uRange={[0, 2 * Math.PI]}
  vRange={[0, Math.PI / 2]}
  meshResolution={24}
  surfaceColor="rgba(97,218,251,0.25)"
  meshColor="rgba(97,218,251,0.5)"
  showNormals={true}
  normalCount={12}
  opacity={enterProgress}
  scale={180}
  centerX={960}
  centerY={540}
/>

// 抛物面（被积函数颜色映射）
<SurfaceIntegral
  zFn={(x, y) => x * x + y * y}
  xRange={[-2, 2]}
  yRange={[-2, 2]}
  colorFn={(x, y, z) => z}
  colorRange={[0, 4]}
/>
```

---

## DiffEqSolution

**文件**：`src/components/special/DiffEqSolution.tsx`
**职责**：微分方程解曲线族可视化，在坐标系中绘制不同初始条件（不同 C 值）对应的解曲线。
**主要使用章节**：第七章各节

### Props 类型定义

```typescript
interface DiffEqSolutionProps {
  /**
   * 解曲线族函数 y = solutionFn(x, C)
   * C 为积分常数，将对 cValues 中的每个值各绘制一条曲线
   */
  solutionFn: (x: number, C: number) => number;
  /**
   * 积分常数 C 的取值数组
   * 例如 [-3, -2, -1, 0, 1, 2, 3]
   */
  cValues: number[];
  /** 绘制 x 范围，默认继承 CoordinateSystem 的 xRange */
  xRange?: [number, number];
  /** 采样点数，默认 200 */
  samples?: number;
  /**
   * 曲线颜色策略：
   * 'single'   — 所有曲线同色
   * 'gradient' — 按 C 值从 startColor 渐变到 endColor
   * 'rainbow'  — 彩虹色
   */
  colorMode?: "single" | "gradient" | "rainbow";
  /** colorMode='single' 时的曲线颜色，默认 COLORS.primaryCurve */
  color?: string;
  /** colorMode='gradient' 时的起始颜色 */
  startColor?: string;
  /** colorMode='gradient' 时的终止颜色 */
  endColor?: string;
  /** 线宽（px），默认 2 */
  strokeWidth?: number;
  /** 所有曲线的整体绘制进度 [0, 1]（统一描绘动画） */
  drawProgress?: number;
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 是否高亮 C=0 的特解曲线，默认 false */
  highlightZero?: boolean;
  /** 高亮颜色，默认 COLORS.highlight */
  highlightColor?: string;
}
```

### 使用示例

```jsx
// 一阶线性方程解曲线族（Ch07 Sec04）
// y = e^{-∫P dx} [∫Q e^{∫P dx} dx + C]
// 以 dy/dx + y = e^x 为例：解为 y = (1/2)e^x + Ce^{-x}
<CoordinateSystem xRange={[-2, 3]} yRange={[-4, 6]}>
  <DiffEqSolution
    solutionFn={(x, C) => 0.5 * Math.exp(x) + C * Math.exp(-x)}
    cValues={[-3, -2, -1, 0, 1, 2, 3]}
    colorMode="gradient"
    startColor="#61dafb"
    endColor="#ff79c6"
    strokeWidth={2}
    drawProgress={curveProgress}
    highlightZero={true}
  />
</CoordinateSystem>

// 可分离变量方程（等倾线 + 解曲线）
<DiffEqSolution
  solutionFn={(x, C) => Math.sqrt(x * x + C)}
  cValues={[0.5, 1, 2, 4, 8]}
  colorMode="rainbow"
/>
```

---

## PartialDerivative

**文件**：`src/components/special/PartialDerivative.tsx`
**职责**：多元函数偏导数与全微分的三维可视化，展示曲面、切线方向、切平面。
**主要使用章节**：第九章 Sec02、Sec03

### Props 类型定义

```typescript
interface PartialDerivativeProps {
  /** 二元函数 z = fn(x, y) */
  fn: (x: number, y: number) => number;
  /** x 绘制范围，默认 [-2, 2] */
  xRange?: [number, number];
  /** y 绘制范围，默认 [-2, 2] */
  yRange?: [number, number];
  /** 曲面网格密度，默认 30 */
  meshResolution?: number;
  /** 曲面颜色，默认 "rgba(97,218,251,0.2)" */
  surfaceColor?: string;
  /**
   * 偏导数可视化模式：
   * 'none'      — 仅显示曲面
   * 'partial-x' — 显示 x 方向截面曲线与切线
   * 'partial-y' — 显示 y 方向截面曲线与切线
   * 'both'      — 同时显示两方向
   * 'tangent-plane' — 显示切平面
   */
  showMode?: "none" | "partial-x" | "partial-y" | "both" | "tangent-plane";
  /** 切线/切平面的计算点 (x₀, y₀) */
  pointX0?: number;
  pointY0?: number;
  /** x 方向切线颜色，默认 COLORS.highlight */
  dxColor?: string;
  /** y 方向切线颜色，默认 COLORS.secondaryCurve */
  dyColor?: string;
  /** 切平面颜色，默认 "rgba(255,215,0,0.2)" */
  tangentPlaneColor?: string;
  /** 是否标注偏导数值，默认 false */
  showValues?: boolean;
  /** 动画进度 [0, 1]（切线从切点延伸） */
  enterProgress?: number;
  /** 等距投影缩放比例，默认 120 */
  scale?: number;
  /** 画布中心坐标（px） */
  centerX?: number;
  centerY?: number;
  /** 整体不透明度 */
  opacity?: number;
}
```

### 使用示例

```jsx
// 马鞍面极值分析（Ch09 Sec06）
<PartialDerivative
  fn={(x, y) => x * x - y * y}
  xRange={[-2, 2]}
  yRange={[-2, 2]}
  showMode="tangent-plane"
  pointX0={0}
  pointY0={0}
  tangentPlaneColor="rgba(255,215,0,0.25)"
  showValues={true}
  enterProgress={1}
  scale={130}
  centerX={960}
  centerY={480}
/>

// 偏导数几何意义（Ch09 Sec02）— x 方向截面
<PartialDerivative
  fn={(x, y) => Math.sin(x) * Math.exp(-y * y / 2)}
  showMode="partial-x"
  pointX0={1}
  pointY0={0}
  dxColor={COLORS.highlight}
  enterProgress={tangentProgress}
/>
```
