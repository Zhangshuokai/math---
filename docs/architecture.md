# 同济高等数学第七版下册 Remotion 动画教学项目架构文档

> 版本：v1.0 | 日期：2026-04-07

---

## 1. 项目整体目录结构

```
math/
├── docs/
│   ├── architecture.md          # 本文档：整体架构规范
│   ├── chapter-structure.md     # 章节分集结构规划
│   └── component-design.md      # 组件接口详细设计
│
├── public/
│   └── fonts/
│       └── KaTeX_Math-Italic.woff2
│
├── src/
│   ├── Root.tsx                  # 所有 Composition 注册入口
│   ├── index.ts                  # 导出入口
│   │
│   ├── constants/
│   │   ├── colors.ts             # 全局颜色常量（COLORS 对象）
│   │   ├── timing.ts             # 动画帧数常量（TIMING 对象）
│   │   └── math.ts               # 数学常量（坐标范围、网格间距等）
│   │
│   ├── components/
│   │   ├── base/
│   │   │   ├── MathFormula.tsx          # KaTeX 公式渲染组件
│   │   │   ├── CoordinateSystem.tsx     # 2D 坐标系组件
│   │   │   ├── CoordinateSystem3D.tsx   # 3D 坐标系（等距投影）
│   │   │   ├── FunctionPlot.tsx         # 函数图像绘制组件
│   │   │   ├── IntegralArea.tsx         # 积分区域高亮组件
│   │   │   ├── Arrow.tsx                # 2D 箭头/向量组件
│   │   │   ├── Vector3D.tsx             # 3D 向量组件
│   │   │   └── VectorField.tsx          # 向量场组件
│   │   │
│   │   ├── layout/
│   │   │   ├── TitleCard.tsx            # 章节/小节标题卡片
│   │   │   ├── TheoremBox.tsx           # 定理/公式框
│   │   │   └── StepByStep.tsx           # 逐步推导步骤组件
│   │   │
│   │   └── special/
│   │       ├── FourierSeries.tsx        # 傅里叶级数可视化
│   │       ├── SurfaceIntegral.tsx      # 曲面积分可视化（第十一章）
│   │       ├── DiffEqSolution.tsx       # 微分方程解曲线族
│   │       └── PartialDerivative.tsx    # 偏导数切平面可视化
│   │
│   ├── hooks/
│   │   ├── useCoordinateTransform.ts    # 数学坐标 ↔ 像素坐标转换
│   │   ├── useDrawProgress.ts           # SVG 路径绘制进度动画
│   │   ├── useSpringValue.ts            # 弹性插值 Hook
│   │   └── useStaggeredEntrance.ts      # 错开入场时序 Hook
│   │
│   ├── utils/
│   │   ├── mathUtils.ts                 # 数学工具函数（采样、积分数值等）
│   │   ├── svgPath.ts                   # SVG 路径字符串构建工具
│   │   ├── d3Helpers.ts                 # D3.js 路径计算辅助（不操作 DOM）
│   │   └── katexRender.ts              # KaTeX 同步渲染工具函数
│   │
│   ├── styles/
│   │   ├── global.css                   # 全局样式（字体、背景）
│   │   ├── MathFormula.module.css
│   │   ├── CoordinateSystem.module.css
│   │   ├── TitleCard.module.css
│   │   ├── TheoremBox.module.css
│   │   └── StepByStep.module.css
│   │
│   └── chapters/
│       ├── Ch07_DifferentialEq/
│       │   ├── index.ts                           # 导出本章所有 Composition
│       │   ├── Sec01_Intro.tsx                    # 7.1 微分方程基本概念
│       │   ├── Sec02_FirstOrder.tsx               # 7.2 可分离变量方程
│       │   ├── Sec03_HomogeneousEq.tsx            # 7.3 齐次方程
│       │   ├── Sec04_LinearFirstOrder.tsx         # 7.4 一阶线性微分方程
│       │   ├── Sec05_Bernoulli.tsx                # 7.5 伯努利方程
│       │   ├── Sec06_HigherOrder.tsx              # 7.6 可降阶高阶方程
│       │   ├── Sec07_ConstCoeff.tsx               # 7.7 二阶常系数齐次方程
│       │   └── Sec08_NonHomogeneous.tsx           # 7.8 二阶常系数非齐次方程
│       │
│       ├── Ch08_VectorGeometry/
│       │   ├── index.ts
│       │   ├── Sec01_Vectors.tsx                  # 8.1 向量及其线性运算
│       │   ├── Sec02_DotProduct.tsx               # 8.2 数量积（点积）
│       │   ├── Sec03_CrossProduct.tsx             # 8.3 向量积（叉积）
│       │   ├── Sec04_Planes.tsx                   # 8.4 平面方程
│       │   ├── Sec05_Lines.tsx                    # 8.5 空间直线方程
│       │   └── Sec06_Surfaces.tsx                 # 8.6 二次曲面
│       │
│       ├── Ch09_MultivarCalc/
│       │   ├── index.ts
│       │   ├── Sec01_Limits.tsx                   # 9.1 多元函数极限与连续
│       │   ├── Sec02_PartialDerivatives.tsx       # 9.2 偏导数
│       │   ├── Sec03_TotalDifferential.tsx        # 9.3 全微分
│       │   ├── Sec04_ChainRule.tsx                # 9.4 多元复合函数求导
│       │   ├── Sec05_ImplicitDiff.tsx             # 9.5 隐函数求导
│       │   ├── Sec06_Extrema.tsx                  # 9.6 多元函数极值
│       │   └── Sec07_LagrangeMultipliers.tsx      # 9.7 拉格朗日乘数法
│       │
│       ├── Ch10_MultipleIntegrals/
│       │   ├── index.ts
│       │   ├── Sec01_DoubleIntegral.tsx           # 10.1 二重积分概念
│       │   ├── Sec02_CartesianDouble.tsx          # 10.2 直角坐标系二重积分
│       │   ├── Sec03_PolarDouble.tsx              # 10.3 极坐标系二重积分
│       │   ├── Sec04_TripleIntegral.tsx           # 10.4 三重积分概念
│       │   ├── Sec05_CartesianTriple.tsx          # 10.5 直角坐标三重积分
│       │   └── Sec06_CylindricalSpherical.tsx     # 10.6 柱面/球面坐标
│       │
│       ├── Ch11_CurveSurfaceIntegrals/
│       │   ├── index.ts
│       │   ├── Sec01_LineIntegral1.tsx            # 11.1 第一类曲线积分
│       │   ├── Sec02_LineIntegral2.tsx            # 11.2 第二类曲线积分
│       │   ├── Sec03_GreenTheorem.tsx             # 11.3 格林公式
│       │   ├── Sec04_SurfaceIntegral1.tsx         # 11.4 第一类曲面积分
│       │   ├── Sec05_SurfaceIntegral2.tsx         # 11.5 第二类曲面积分
│       │   ├── Sec06_GaussDivergence.tsx          # 11.6 高斯公式
│       │   └── Sec07_StokesTheorem.tsx            # 11.7 斯托克斯公式
│       │
│       └── Ch12_InfiniteSeries/
│           ├── index.ts
│           ├── Sec01_NumericSeries.tsx            # 12.1 数项级数概念
│           ├── Sec02_ConvergenceTests.tsx         # 12.2 正项级数收敛判别法
│           ├── Sec03_AlternatingSeries.tsx        # 12.3 交错级数
│           ├── Sec04_PowerSeries.tsx              # 12.4 幂级数
│           ├── Sec05_TaylorMaclaurin.tsx          # 12.5 泰勒/麦克劳林级数
│           └── Sec06_FourierSeries.tsx            # 12.6 傅里叶级数
│
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```

---

## 2. 组件库设计规范

### 2.1 `MathFormula.tsx`

KaTeX 同步渲染的数学公式组件，支持淡入、逐字符显示等动画。

```typescript
interface MathFormulaProps {
  /** LaTeX 公式字符串，例如 "\\int_a^b f(x)\\,dx" */
  formula: string;
  /** 字体大小（像素），默认 36 */
  fontSize?: number;
  /** 公式颜色，默认 COLORS.formula */
  color?: string;
  /** 动画进度 [0, 1]，控制显示进度（逐字符淡入） */
  progress?: number;
  /** 是否行间公式（displayMode），默认 true */
  displayMode?: boolean;
  /** CSS 绝对定位：距离左边距 */
  x?: number;
  /** CSS 绝对定位：距离上边距 */
  y?: number;
  /** 容器宽度（px），超出则换行 */
  maxWidth?: number;
  /** 入场动画起始帧（配合 useCurrentFrame 使用） */
  enterFrame?: number;
  /** 入场动画持续帧数，默认 20 */
  enterDuration?: number;
  /** 不透明度（覆盖 progress 控制时使用） */
  opacity?: number;
}
```

**渲染方式**：调用 `katex.renderToString()` 生成 HTML 字符串，通过 `dangerouslySetInnerHTML` 注入，外层包裹 `<div style={{ position: 'absolute' }}>` 用于定位。

---

### 2.2 `CoordinateSystem.tsx`

2D 直角坐标系，包含网格、坐标轴、刻度标注，作为函数绘图的容器。

```typescript
interface CoordinateSystemProps {
  /** 画布宽度（px），默认 800 */
  width?: number;
  /** 画布高度（px），默认 600 */
  height?: number;
  /** x 轴范围 [xMin, xMax]，默认 [-5, 5] */
  xRange?: [number, number];
  /** y 轴范围 [yMin, yMax]，默认 [-4, 4] */
  yRange?: [number, number];
  /** 网格间距（数学单位），默认 1 */
  gridStep?: number;
  /** 刻度标注间距，默认 1 */
  tickStep?: number;
  /** 是否显示网格，默认 true */
  showGrid?: boolean;
  /** 是否显示坐标轴，默认 true */
  showAxis?: boolean;
  /** 是否显示刻度数字，默认 true */
  showLabels?: boolean;
  /** 坐标轴颜色，默认 COLORS.axis */
  axisColor?: string;
  /** 网格颜色，默认 COLORS.grid */
  gridColor?: string;
  /** 坐标系整体不透明度（入场动画用），默认 1 */
  opacity?: number;
  /** 子组件（FunctionPlot、IntegralArea 等），通过 children 传入 */
  children?: React.ReactNode;
}
```

**坐标变换逻辑**（供 `useCoordinateTransform` 消费）：

```
pixelX = (mathX - xMin) / (xMax - xMin) * width
pixelY = height - (mathY - yMin) / (yMax - yMin) * height
```

`CoordinateSystem` 通过 React Context 向子组件提供变换函数，子组件无需重复计算范围参数。

---

### 2.3 `FunctionPlot.tsx`

在 `CoordinateSystem` 内绘制一条数学函数曲线（SVG path）。

```typescript
interface FunctionPlotProps {
  /** 函数 y = f(x)，接收数学坐标 x，返回 y */
  fn: (x: number) => number;
  /** 绘制 x 范围，默认继承 CoordinateSystem 的 xRange */
  xRange?: [number, number];
  /** 采样点数量，越大越精确，默认 300 */
  samples?: number;
  /** 曲线颜色，默认 COLORS.primaryCurve */
  color?: string;
  /** 曲线线宽（px），默认 3 */
  strokeWidth?: number;
  /** 绘制进度 [0, 1]，配合 useDrawProgress 实现动态描绘效果 */
  drawProgress?: number;
  /** 线条样式，默认 'solid' */
  dashArray?: string;
  /** 整体不透明度 */
  opacity?: number;
}
```

---

### 2.4 `IntegralArea.tsx`

在 `CoordinateSystem` 内高亮显示函数曲线下方的积分区域（填充多边形）。

```typescript
interface IntegralAreaProps {
  /** 被积函数 */
  fn: (x: number) => number;
  /** 积分下限 a */
  a: number;
  /** 积分上限 b（动态变化时可实现"填充扫过"动画） */
  b: number;
  /** 填充颜色，默认 COLORS.integralArea */
  fillColor?: string;
  /** 边界线颜色（左右边界竖线），默认 COLORS.primaryCurve */
  borderColor?: string;
  /** 填充进度 [0, 1]，从左到右逐步填充 */
  fillProgress?: number;
  /** 是否显示 Riemann 矩形近似，默认 false */
  showRiemann?: boolean;
  /** Riemann 矩形数量（当 showRiemann 为 true 时有效） */
  riemannN?: number;
  /** 矩形取样方式：'left' | 'right' | 'mid' */
  riemannMethod?: "left" | "right" | "mid";
}
```

---

### 2.5 `Arrow.tsx`

2D 箭头/向量，用于标注方向、表示导数切线、绘制向量。

```typescript
interface ArrowProps {
  /** 箭头起点（数学坐标或像素坐标，由 useCoordinateTransform 决定） */
  from: [number, number];
  /** 箭头终点 */
  to: [number, number];
  /** 坐标类型：'math'（数学坐标，需在 CoordinateSystem 内使用）| 'pixel' */
  coordType?: "math" | "pixel";
  /** 箭头颜色，默认 COLORS.vector */
  color?: string;
  /** 线宽（px），默认 2.5 */
  strokeWidth?: number;
  /** 箭头头部大小，默认 10 */
  arrowSize?: number;
  /** 动画进度 [0, 1]，从起点到终点逐步绘制 */
  drawProgress?: number;
  /** 是否双向箭头 */
  bidirectional?: boolean;
  /** 整体不透明度 */
  opacity?: number;
}
```

---

### 2.6 `Vector3D.tsx`

3D 空间向量，使用等距投影（isometric）或斜二测画法渲染到 2D 画布。

```typescript
interface Vector3DProps {
  /** 向量起点（三维数学坐标） */
  origin: [number, number, number];
  /** 向量分量 [dx, dy, dz] */
  components: [number, number, number];
  /** 颜色，默认 COLORS.vector */
  color?: string;
  /** 线宽，默认 2.5 */
  strokeWidth?: number;
  /** 是否显示分量（虚线投影），默认 false */
  showComponents?: boolean;
  /** 投影方式：'isometric' | 'oblique'，默认 'isometric' */
  projection?: "isometric" | "oblique";
  /** 投影矩阵（可选，覆盖默认投影），3x2 矩阵 */
  projectionMatrix?: [[number, number], [number, number], [number, number]];
  /** 标签文字（如 "\\vec{a}"，KaTeX 渲染） */
  label?: string;
  /** 动画进度 [0, 1] */
  drawProgress?: number;
  /** 整体不透明度 */
  opacity?: number;
}
```

---

### 2.7 `VectorField.tsx`

在 2D 平面上以小箭头矩阵展示向量场 F(x,y) = (P, Q)。

```typescript
interface VectorFieldProps {
  /** 向量场函数，输入坐标返回向量分量 */
  field: (x: number, y: number) => [number, number];
  /** x 方向采样数量，默认 15 */
  xSamples?: number;
  /** y 方向采样数量，默认 12 */
  ySamples?: number;
  /** 向量最大渲染长度（像素），默认 40 */
  maxLength?: number;
  /** 是否自动归一化向量长度 */
  normalize?: boolean;
  /** 颜色映射函数（按模长映射颜色） */
  colorMap?: (magnitude: number) => string;
  /** 默认颜色，默认 COLORS.vector */
  color?: string;
  /** 整体不透明度 */
  opacity?: number;
  /** 入场动画进度 [0, 1]，箭头逐个显示 */
  enterProgress?: number;
}
```

---

### 2.8 `TitleCard.tsx`

章节/小节标题卡片，用于每段视频开头，支持章节号、标题、副标题三层文字。

```typescript
interface TitleCardProps {
  /** 章节编号，例如 "第七章" */
  chapterLabel?: string;
  /** 主标题，例如 "微分方程" */
  title: string;
  /** 副标题，例如 "7.4 一阶线性微分方程" */
  subtitle?: string;
  /** 背景渐变色起点，默认 COLORS.background */
  bgColorStart?: string;
  /** 背景渐变色终点 */
  bgColorEnd?: string;
  /** 标题入场动画起始帧 */
  enterFrame?: number;
  /** 各层文字依次淡入的间隔帧数，默认 15 */
  staggerFrames?: number;
  /** 整体持续帧数，超出后淡出 */
  duration?: number;
}
```

---

### 2.9 `StepByStep.tsx`

逐步推导组件：按帧序列依次显示推导步骤，每步可包含文字说明和公式。

```typescript
interface DerivationStep {
  /** 步骤标注文字，例如 "将 P(x) = 1/x 代入" */
  annotation?: string;
  /** KaTeX 公式字符串 */
  formula: string;
  /** 该步骤高亮颜色（可选，突出变化部分） */
  highlightColor?: string;
  /** 该步骤入场所需帧数，默认 20 */
  enterDuration?: number;
}

interface StepByStepProps {
  /** 推导步骤数组 */
  steps: DerivationStep[];
  /** 当前显示到第几步（0-based），由外部帧计算控制 */
  currentStep: number;
  /** 每步间距（px），默认 60 */
  stepSpacing?: number;
  /** 已完成步骤的不透明度（变暗），默认 0.5 */
  pastOpacity?: number;
  /** 起始 x 坐标（px） */
  x?: number;
  /** 起始 y 坐标（px） */
  y?: number;
  /** 容器最大宽度（px） */
  maxWidth?: number;
}
```

---

### 2.10 `TheoremBox.tsx`

定理/公式框，带有边框装饰和标题标签（"定理"、"推论"、"定义"等）。

```typescript
type TheoremType = "theorem" | "definition" | "corollary" | "formula" | "example" | "note";

interface TheoremBoxProps {
  /** 框类型，控制边框颜色和标签文字 */
  type?: TheoremType;
  /** 自定义标签文字（覆盖 type 默认标签） */
  label?: string;
  /** 定理名称（可选），例如 "格林公式" */
  name?: string;
  /** 正文内容（纯文字或 React 节点） */
  content?: React.ReactNode;
  /** 核心公式（KaTeX），显示在正文之后 */
  formula?: string;
  /** 宽度（px），默认 700 */
  width?: number;
  /** 框整体位置 x */
  x?: number;
  /** 框整体位置 y */
  y?: number;
  /** 入场动画进度 [0, 1] */
  enterProgress?: number;
}
```

**类型颜色映射**：
| type | 边框颜色 |
|------|----------|
| theorem | `#61dafb` |
| definition | `#ff79c6` |
| corollary | `#a9dc76` |
| formula | `#ffd700` |
| example | `#78dce8` |
| note | `#888888` |

---

### 2.11 `FourierSeries.tsx`

傅里叶级数动态可视化：展示有限项傅里叶级数近似，支持动态增加项数。

```typescript
interface FourierSeriesProps {
  /** 目标函数（用于对比，可选） */
  targetFn?: (x: number) => number;
  /** 傅里叶系数数组 [{a0, an, bn, n}] */
  coefficients: Array<{ n: number; an: number; bn: number }>;
  /** a0/2 常数项 */
  a0: number;
  /** 当前显示到第几项（动态动画用），默认显示全部 */
  visibleTerms?: number;
  /** x 轴周期区间 [-L, L] */
  period?: number;
  /** 是否显示旋转圆（龙卷风可视化模式），默认 false */
  showCircles?: boolean;
  /** 圆圈动画相位（弧度） */
  circlePhase?: number;
  /** 曲线颜色，默认 COLORS.primaryCurve */
  color?: string;
  /** 目标函数颜色，默认 COLORS.secondaryCurve */
  targetColor?: string;
  /** 在 CoordinateSystem 中使用时，由 Context 获取坐标变换 */
}
```

---

## 3. Hooks 规范

### 3.1 `useCoordinateTransform`

封装数学坐标与像素坐标的双向转换。由 `CoordinateSystem` 通过 React Context 提供，也可直接调用（传入参数）。

```typescript
interface CoordinateTransformOptions {
  width: number;
  height: number;
  xRange: [number, number];
  yRange: [number, number];
}

interface CoordinateTransform {
  /** 数学坐标 → 像素坐标 */
  toPixel: (mathX: number, mathY: number) => [number, number];
  /** 像素坐标 → 数学坐标 */
  toMath: (pixelX: number, pixelY: number) => [number, number];
  /** 数学长度 → 像素长度（x 方向） */
  scaleX: (mathLength: number) => number;
  /** 数学长度 → 像素长度（y 方向） */
  scaleY: (mathLength: number) => number;
}

function useCoordinateTransform(
  options?: CoordinateTransformOptions
): CoordinateTransform;
```

**使用场景**：
- `FunctionPlot` 将函数采样点转换为 SVG path
- `Arrow` 将数学坐标箭头转换为像素坐标
- `IntegralArea` 计算填充多边形顶点

---

### 3.2 `useDrawProgress`

控制 SVG 路径从头到尾的描绘动画，基于 `stroke-dashoffset` 技术。

```typescript
interface DrawProgressOptions {
  /** 动画起始帧（相对于 Composition 的帧） */
  from: number;
  /** 动画持续帧数 */
  duration: number;
  /** 缓动函数，默认 Easing.easeInOut */
  easing?: (t: number) => number;
}

interface DrawProgressResult {
  /** 当前绘制进度 [0, 1] */
  progress: number;
  /** 用于 SVG path 的 strokeDasharray 值（需配合 pathLength 使用） */
  strokeDasharray: string;
  /** 用于 SVG path 的 strokeDashoffset 值 */
  strokeDashoffset: number;
}

function useDrawProgress(options: DrawProgressOptions): DrawProgressResult;
```

**内部实现要点**：
1. 调用 `useCurrentFrame()` 获取当前帧
2. 使用 `interpolate(frame, [from, from + duration], [0, 1], { easing })` 计算进度
3. 返回 `strokeDasharray: "1"` + `strokeDashoffset: 1 - progress`（配合 `pathLength={1}`）

---

## 4. Composition 注册规范（Root.tsx）

`Root.tsx` 是 Remotion 的入口文件，所有 Composition 在此注册。规范如下：

```typescript
// src/Root.tsx 结构规范

import { Composition } from "remotion";

// 各章节导入（按需 import，避免打包过大）
import { Ch07Compositions } from "./chapters/Ch07_DifferentialEq";
import { Ch08Compositions } from "./chapters/Ch08_VectorGeometry";
// ... 其余章节

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 第七章：微分方程 */}
      <Composition
        id="Ch07_Sec01_Intro"
        component={Ch07Compositions.Sec01}
        durationInFrames={480}   // 16 秒 @ 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* ... 按相同模式注册每节 */}
    </>
  );
};
```

**命名规范**：
- Composition ID 格式：`Ch{章号两位}_{文件名去扩展名}`
  - 示例：`Ch07_Sec01_Intro`、`Ch11_Sec03_GreenTheorem`
- 所有 Composition 使用统一规格：`1920×1080, 30fps`
- 每节时长参考「动画时序规范」按实际场景数量计算

---

## 5. 动画时序规范

每段教学视频由若干**场景（Scene）**组成，以下是典型帧数分配：

| 场景类型 | 典型帧数 | 说明 |
|----------|----------|------|
| 标题卡 TitleCard | 60 帧（2 秒） | 章节/小节标题展示，淡入淡出 |
| 概念引入 | 90 帧（3 秒） | 文字+图示引出概念 |
| 公式推导（单步） | 30 帧（1 秒） | StepByStep 每步之间的间隔 |
| 公式推导（完整） | 120~180 帧（4~6 秒） | 3~6 步推导过程 |
| 图形绘制（坐标系出现） | 45 帧（1.5 秒） | CoordinateSystem 淡入+轴描绘 |
| 函数曲线描绘 | 60~90 帧（2~3 秒） | FunctionPlot drawProgress 动画 |
| 重点公式展示 | 60 帧（2 秒） | TheoremBox + MathFormula 入场 |
| 应用示例讲解 | 150~240 帧（5~8 秒） | 图形变化+公式联动 |
| 小结 | 60 帧（2 秒） | 关键结论回顾，淡出 |

**典型单节总时长**：480~900 帧（16~30 秒）

---

### 5.1 场景时序示例（以 7.4 一阶线性微分方程为例）

```
帧 0   - 60:   TitleCard 「7.4 一阶线性微分方程」入场
帧 60  - 150:  方程标准形式 dy/dx + P(x)y = Q(x) 显示，分析结构
帧 150 - 210:  引入积分因子思路（TheoremBox 滑入）
帧 210 - 390:  推导过程（StepByStep，6 步，每步 30 帧）
帧 390 - 450:  最终公式（TheoremBox + formula 高亮）
帧 450 - 600:  例题：坐标系出现，解曲线族动态绘制
帧 600 - 660:  小结淡出
```

---

## 6. 全局常量规范

### `src/constants/colors.ts`
```typescript
export const COLORS = {
  background:     "#1a1a2e",
  axis:           "#888888",
  grid:           "#333355",
  primaryCurve:   "#61dafb",
  secondaryCurve: "#ff79c6",
  integralArea:   "rgba(97, 218, 251, 0.25)",
  vector:         "#ffd700",
  highlight:      "#ff6b6b",
  formula:        "#ffffff",
  annotation:     "#f8f8f2",
  theorem:        "#61dafb",
  definition:     "#ff79c6",
  corollary:      "#a9dc76",
} as const;
```

### `src/constants/timing.ts`
```typescript
export const TIMING = {
  FPS: 30,
  TITLE_CARD:      60,
  INTRO:           90,
  STEP_INTERVAL:   30,
  CURVE_DRAW:      75,
  THEOREM_ENTER:   45,
  EXAMPLE:        180,
  SUMMARY:         60,
} as const;
```

### `src/constants/math.ts`
```typescript
export const MATH = {
  DEFAULT_X_RANGE: [-5, 5] as [number, number],
  DEFAULT_Y_RANGE: [-4, 4] as [number, number],
  GRID_STEP:       1,
  SAMPLE_COUNT:    300,
  CANVAS_WIDTH:   1920,
  CANVAS_HEIGHT:  1080,
  COORD_WIDTH:     800,
  COORD_HEIGHT:    600,
} as const;
```
