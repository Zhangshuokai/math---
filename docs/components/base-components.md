# 基础渲染组件（Base Components）

> 文件路径：`src/components/base/`
> 这些组件是无业务逻辑的原子级视觉单元，可在任意章节中复用。

---

## MathFormula

**文件**：`src/components/base/MathFormula.tsx`
**职责**：通过 KaTeX 同步渲染 LaTeX 公式为 HTML，支持位置控制和淡入动画。

### Props 类型定义

```typescript
interface MathFormulaProps {
  /** LaTeX 字符串，例如 "\\int_a^b f(x)\\,dx = F(b) - F(a)" */
  formula: string;
  /** 字体大小（px），默认 36 */
  fontSize?: number;
  /** 公式文字颜色，默认 COLORS.formula (#ffffff) */
  color?: string;
  /** 显示进度 [0, 1]，0=不可见，1=完全可见；用于淡入动画 */
  progress?: number;
  /** 行间公式模式（displayMode），默认 true */
  displayMode?: boolean;
  /** 绝对定位 left 偏移（px） */
  x?: number;
  /** 绝对定位 top 偏移（px） */
  y?: number;
  /** 最大宽度（px），超出则换行 */
  maxWidth?: number;
  /** 整体不透明度（与 progress 独立控制） */
  opacity?: number;
  /** 对齐方式，默认 'center' */
  align?: "left" | "center" | "right";
}
```

### 使用示例

```jsx
// 基础用法：居中展示积分公式
<MathFormula
  formula="\int_a^b f(x)\,dx = F(b) - F(a)"
  fontSize={42}
  x={960}
  y={400}
  align="center"
/>

// 动画淡入：配合帧插值
const frame = useCurrentFrame();
const progress = interpolate(frame, [60, 90], [0, 1], {
  extrapolateRight: "clamp",
});
<MathFormula
  formula="\frac{\partial z}{\partial x} = \lim_{\Delta x \to 0} \frac{f(x+\Delta x, y) - f(x,y)}{\Delta x}"
  fontSize={32}
  progress={progress}
  x={200}
  y={300}
/>
```

### 实现要点

```typescript
// 内部渲染逻辑
import katex from "katex";

const html = katex.renderToString(formula, {
  displayMode,
  throwOnError: false,
  output: "html",
});

// 通过 style 变量控制颜色（KaTeX 默认黑色需覆盖）
// CSS Module 中设置 .formula { color: var(--formula-color) }
```

---

## CoordinateSystem

**文件**：`src/components/base/CoordinateSystem.tsx`
**职责**：渲染 2D 直角坐标系（SVG），并通过 React Context 向子组件提供坐标变换函数。

### Props 类型定义

```typescript
interface CoordinateSystemProps {
  /** SVG 画布宽度（px），默认 MATH.COORD_WIDTH (800) */
  width?: number;
  /** SVG 画布高度（px），默认 MATH.COORD_HEIGHT (600) */
  height?: number;
  /** x 轴数学范围 [min, max]，默认 [-5, 5] */
  xRange?: [number, number];
  /** y 轴数学范围 [min, max]，默认 [-4, 4] */
  yRange?: [number, number];
  /** 网格线间距（数学单位），默认 1 */
  gridStep?: number;
  /** 坐标轴刻度间距（数学单位），默认 1 */
  tickStep?: number;
  /** 是否显示背景网格，默认 true */
  showGrid?: boolean;
  /** 是否显示坐标轴，默认 true */
  showAxis?: boolean;
  /** 是否显示刻度数字标注，默认 true */
  showLabels?: boolean;
  /** 坐标轴颜色，默认 COLORS.axis */
  axisColor?: string;
  /** 网格颜色，默认 COLORS.grid */
  gridColor?: string;
  /** 坐标系整体不透明度（入场动画用），默认 1 */
  opacity?: number;
  /** 坐标系在视频画面中的 x 偏移（px） */
  offsetX?: number;
  /** 坐标系在视频画面中的 y 偏移（px） */
  offsetY?: number;
  /** 子组件（FunctionPlot、IntegralArea、Arrow 等） */
  children?: React.ReactNode;
}
```

### Context 接口

```typescript
// src/components/base/CoordinateSystem.tsx 中导出
export interface CoordinateContextValue {
  toPixel: (mathX: number, mathY: number) => [number, number];
  toMath: (pixelX: number, pixelY: number) => [number, number];
  scaleX: (mathLength: number) => number;
  scaleY: (mathLength: number) => number;
  width: number;
  height: number;
  xRange: [number, number];
  yRange: [number, number];
}

export const CoordinateContext =
  React.createContext<CoordinateContextValue | null>(null);
```

### 坐标变换公式

```typescript
// 数学坐标 → 像素坐标（原点在左上角）
toPixel = (mathX, mathY) => {
  const px = ((mathX - xMin) / (xMax - xMin)) * width;
  const py = height - ((mathY - yMin) / (yMax - yMin)) * height;
  return [px, py];
};
```

### 使用示例

```jsx
<CoordinateSystem
  width={800}
  height={600}
  xRange={[-4, 4]}
  yRange={[-3, 3]}
  gridStep={1}
  offsetX={560}
  offsetY={240}
  opacity={fadeIn}
>
  <FunctionPlot fn={(x) => Math.sin(x)} color={COLORS.primaryCurve} drawProgress={0.8} />
  <IntegralArea fn={(x) => Math.sin(x)} a={0} b={Math.PI} fillProgress={1} />
</CoordinateSystem>
```

---

## CoordinateSystem3D

**文件**：`src/components/base/CoordinateSystem3D.tsx`
**职责**：等距投影（isometric）渲染三维坐标系，为第八章、第九章提供 3D 场景容器。

### Props 类型定义

```typescript
interface CoordinateSystem3DProps {
  /** SVG 画布宽度（px），默认 800 */
  width?: number;
  /** SVG 画布高度（px），默认 600 */
  height?: number;
  /** x/y/z 轴范围（对称），默认 5 */
  axisLength?: number;
  /** 等距投影角度（°），默认 30 */
  isoAngle?: number;
  /** x 轴颜色，默认 '#ff6b6b' */
  xAxisColor?: string;
  /** y 轴颜色，默认 '#a9dc76' */
  yAxisColor?: string;
  /** z 轴颜色，默认 '#61dafb' */
  zAxisColor?: string;
  /** 是否显示坐标平面（半透明），默认 true */
  showPlanes?: boolean;
  /** 坐标平面透明度，默认 0.08 */
  planeOpacity?: number;
  /** 整体不透明度 */
  opacity?: number;
  /** 在视频中的位置偏移 */
  offsetX?: number;
  offsetY?: number;
  /** 子组件（Vector3D 等） */
  children?: React.ReactNode;
}
```

### 等距投影矩阵

```typescript
// 默认等距投影（isoAngle = 30°）
// 3D (x, y, z) → 2D (px, py)
const ISO_MATRIX: [[number, number], [number, number], [number, number]] = [
  [Math.cos(Math.PI / 6), -Math.cos(Math.PI / 6)],  // x 轴
  [Math.sin(Math.PI / 6),  Math.sin(Math.PI / 6)],  // y 轴
  [0,                      1                     ],  // z 轴
];

project3D = (x: number, y: number, z: number): [number, number] => {
  const scale = width / (2 * axisLength);
  const px = (x * ISO_MATRIX[0][0] + y * ISO_MATRIX[1][0] + z * ISO_MATRIX[2][0]) * scale + width / 2;
  const py = (x * ISO_MATRIX[0][1] + y * ISO_MATRIX[1][1] + z * ISO_MATRIX[2][1]) * scale + height / 2;
  return [px, py];
};
```

---

## FunctionPlot

**文件**：`src/components/base/FunctionPlot.tsx`
**职责**：在 `CoordinateSystem` 内绘制数学函数曲线（SVG path），支持动态描绘动画。

### Props 类型定义

```typescript
interface FunctionPlotProps {
  /** 函数 y = fn(x)，接收数学坐标 x 返回 y */
  fn: (x: number) => number;
  /** x 绘制范围（数学坐标），默认继承 CoordinateSystem 的 xRange */
  xRange?: [number, number];
  /** 采样点数量，默认 300（影响曲线精度） */
  samples?: number;
  /** 曲线颜色，默认 COLORS.primaryCurve */
  color?: string;
  /** 线宽（px），默认 3 */
  strokeWidth?: number;
  /** 描绘进度 [0, 1]，配合 stroke-dashoffset 实现从左到右描绘 */
  drawProgress?: number;
  /** 虚线样式，例如 "8 4"，默认实线 */
  dashArray?: string;
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 函数值越界时的处理：'skip'（跳过该点）| 'clip'（截断），默认 'skip' */
  overflowMode?: "skip" | "clip";
}
```

### 使用示例

```jsx
// 在 CoordinateSystem 内使用（自动获取坐标变换）
<CoordinateSystem xRange={[-2 * Math.PI, 2 * Math.PI]} yRange={[-1.5, 1.5]}>
  {/* 主函数曲线，动态描绘 */}
  <FunctionPlot
    fn={Math.sin}
    color={COLORS.primaryCurve}
    strokeWidth={3}
    drawProgress={drawProgress}
  />
  {/* 对比曲线，虚线显示 */}
  <FunctionPlot
    fn={Math.cos}
    color={COLORS.secondaryCurve}
    dashArray="6 3"
    opacity={0.7}
  />
</CoordinateSystem>
```

---

## IntegralArea

**文件**：`src/components/base/IntegralArea.tsx`
**职责**：在 `CoordinateSystem` 内高亮显示积分区域，支持 Riemann 矩形可视化。

### Props 类型定义

```typescript
interface IntegralAreaProps {
  /** 被积函数 */
  fn: (x: number) => number;
  /** 积分下限 */
  a: number;
  /** 积分上限（可动态变化以实现"扫过"效果） */
  b: number;
  /** 填充颜色，默认 COLORS.integralArea */
  fillColor?: string;
  /** 边界竖线颜色，默认 COLORS.primaryCurve */
  borderColor?: string;
  /** 填充进度 [0, 1]，从 a 到 b 逐步显示 */
  fillProgress?: number;
  /** 是否显示 Riemann 矩形近似，默认 false */
  showRiemann?: boolean;
  /** Riemann 矩形数量（showRiemann=true 时有效），默认 10 */
  riemannN?: number;
  /** 取样方式：左端点 | 右端点 | 中点，默认 'mid' */
  riemannMethod?: "left" | "right" | "mid";
  /** Riemann 矩形颜色，默认与 fillColor 相同但更不透明 */
  riemannColor?: string;
  /** 整体不透明度，默认 1 */
  opacity?: number;
}
```

### 使用示例

```jsx
// 静态积分区域
<CoordinateSystem xRange={[0, 4]} yRange={[0, 3]}>
  <FunctionPlot fn={(x) => x * x / 4} />
  <IntegralArea
    fn={(x) => x * x / 4}
    a={0}
    b={3}
    fillColor="rgba(97, 218, 251, 0.3)"
    fillProgress={1}
  />
</CoordinateSystem>

// Riemann 近似动画（n 从 4 逐渐增大）
<IntegralArea
  fn={(x) => Math.sin(x)}
  a={0}
  b={Math.PI}
  showRiemann={true}
  riemannN={riemannCount}  // 由帧计算控制
/>
```

---

## Arrow

**文件**：`src/components/base/Arrow.tsx`
**职责**：绘制带箭头头部的 2D 有向线段，用于标注方向、向量、切线等。

### Props 类型定义

```typescript
interface ArrowProps {
  /** 起点坐标 */
  from: [number, number];
  /** 终点坐标 */
  to: [number, number];
  /** 坐标类型：'math' 需在 CoordinateSystem 内使用 | 'pixel' 直接像素坐标 */
  coordType?: "math" | "pixel";
  /** 线条颜色，默认 COLORS.vector */
  color?: string;
  /** 线宽（px），默认 2.5 */
  strokeWidth?: number;
  /** 箭头头部大小（px），默认 10 */
  arrowSize?: number;
  /** 绘制进度 [0, 1]，从起点向终点延伸 */
  drawProgress?: number;
  /** 是否显示双向箭头，默认 false */
  bidirectional?: boolean;
  /** 箭头旁的标签文字（KaTeX 渲染） */
  label?: string;
  /** 标签字体大小，默认 24 */
  labelSize?: number;
  /** 整体不透明度，默认 1 */
  opacity?: number;
}
```

### 使用示例

```jsx
// 数学坐标中的向量（在 CoordinateSystem 内使用）
<CoordinateSystem xRange={[-3, 3]} yRange={[-3, 3]}>
  <Arrow
    from={[0, 0]}
    to={[2, 1]}
    coordType="math"
    color={COLORS.vector}
    label="\vec{a}"
    drawProgress={arrowProgress}
  />
</CoordinateSystem>

// 像素坐标中的标注箭头
<Arrow
  from={[400, 300]}
  to={[650, 200]}
  coordType="pixel"
  color={COLORS.highlight}
  strokeWidth={2}
  opacity={0.8}
/>
```

---

## Vector3D

**文件**：`src/components/base/Vector3D.tsx`
**职责**：在 `CoordinateSystem3D` 内渲染三维向量，支持分量投影显示。

### Props 类型定义

```typescript
interface Vector3DProps {
  /** 向量起点（三维数学坐标） */
  origin?: [number, number, number];
  /** 向量分量 [dx, dy, dz] */
  components: [number, number, number];
  /** 线条颜色，默认 COLORS.vector */
  color?: string;
  /** 线宽（px），默认 2.5 */
  strokeWidth?: number;
  /** 是否显示三个分量的虚线投影，默认 false */
  showComponents?: boolean;
  /** 分量投影颜色，默认与 color 相同但半透明 */
  componentColor?: string;
  /** 箭头标签（KaTeX），例如 "\\vec{a}" */
  label?: string;
  /** 标签字体大小（px），默认 24 */
  labelSize?: number;
  /** 绘制进度 [0, 1] */
  drawProgress?: number;
  /** 整体不透明度，默认 1 */
  opacity?: number;
}
```

### 使用示例

```jsx
<CoordinateSystem3D axisLength={4}>
  {/* 基本向量 a = (2, 1, 3) */}
  <Vector3D
    origin={[0, 0, 0]}
    components={[2, 1, 3]}
    color="#ffd700"
    label="\vec{a}"
    drawProgress={1}
  />
  {/* 显示分量投影 */}
  <Vector3D
    components={[3, 2, 0]}
    color={COLORS.secondaryCurve}
    showComponents={true}
    label="\vec{b}"
  />
</CoordinateSystem3D>
```

---

## VectorField

**文件**：`src/components/base/VectorField.tsx`
**职责**：在 `CoordinateSystem` 内以小箭头矩阵可视化 2D 向量场 F(x,y) = (P,Q)。

### Props 类型定义

```typescript
interface VectorFieldProps {
  /** 向量场函数：给定坐标返回向量分量 [P, Q] */
  field: (x: number, y: number) => [number, number];
  /** x 方向采样格数，默认 15 */
  xSamples?: number;
  /** y 方向采样格数，默认 12 */
  ySamples?: number;
  /** 箭头最大渲染长度（像素），默认 40 */
  maxLength?: number;
  /** 是否归一化所有箭头为统一长度，默认 false */
  normalize?: boolean;
  /**
   * 颜色映射函数（按向量模长映射颜色）
   * 若不提供则使用 color 参数统一颜色
   */
  colorMap?: (magnitude: number) => string;
  /** 统一颜色（colorMap 未提供时使用），默认 COLORS.vector */
  color?: string;
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 入场动画进度 [0, 1]，箭头按格点顺序逐个显示 */
  enterProgress?: number;
}
```

### 使用示例

```jsx
// 旋转向量场（格林公式演示）
<CoordinateSystem xRange={[-4, 4]} yRange={[-3, 3]}>
  <VectorField
    field={(x, y) => [-y, x]}
    xSamples={14}
    ySamples={11}
    maxLength={35}
    colorMap={(mag) => `hsl(${200 + mag * 20}, 80%, 60%)`}
    enterProgress={fieldProgress}
  />
</CoordinateSystem>

// 梯度场（拉格朗日乘数法演示）
<VectorField
  field={(x, y) => [2 * x, 2 * y]}
  normalize={true}
  color={COLORS.vector}
/>
```
