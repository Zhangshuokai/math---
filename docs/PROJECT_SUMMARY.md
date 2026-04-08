# 同济高等数学动画教学项目 · 项目总结文档

> 基于 **Remotion 4.x + TypeScript** 的大学高等数学（同济版第七版下册）动画教学视频项目

---

## 目录

1. [项目概述](#1-项目概述)
2. [快速开始](#2-快速开始)
3. [项目结构说明](#3-项目结构说明)
4. [组件库参考手册](#4-组件库参考手册)
5. [章节内容索引](#5-章节内容索引)
6. [动画开发规范](#6-动画开发规范)
7. [完成度统计](#7-完成度统计)
8. [后续扩展建议](#8-后续扩展建议)

---

## 1. 项目概述

### 1.1 项目目标

本项目旨在将同济大学《高等数学》第七版下册（第七章至第十二章）中的核心知识点，通过程序化动画的方式进行可视化呈现，帮助学习者建立直觉性的数学理解。

每节视频对应教材中的一个小节，涵盖概念引入、定理推导、例题演算三个层次，最终产出可渲染为 1920×1080 MP4 的教学视频。

### 1.2 技术选型理由

| 技术 | 版本 | 选型理由 |
|------|------|---------|
| [Remotion](https://www.remotion.dev/) | 4.0.230 | 用 React 编写视频，天然支持 TypeScript、热重载与帧级精确控制 |
| React | 18.2.0 | 组件化 UI，Context 机制便于坐标系状态传递 |
| TypeScript | 5.0.4 | 静态类型检查，降低 Props 接口错误 |
| KaTeX | 0.16.9 | 纯同步 HTML 渲染，避免 SSR 闪烁，公式清晰 |
| D3.js（仅计算） | — | 路径生成算法（不操作 DOM），与 SVG 渲染完全解耦 |
| `@remotion/shapes` | 4.0.230 | 内置形状动画工具 |
| `@remotion/noise` | 4.0.230 | Perlin 噪声，用于有机感动画 |

### 1.3 设计哲学：波兰尼默会知识原则

> *"我们所知道的，多于我们能说出口的。"*  —— Michael Polanyi

纯文字讲授无法传递数学的直觉层。本项目核心原则是：**用动态可视化替代静态公式说教**，让学习者在"看懂"动画的过程中积累默会知识：

- 积分面积填充动画 → 黎曼和逼近直觉
- 向量场网格动画 → 梯度/旋度物理意义
- 傅里叶级数逐项叠加 → 频谱分解直觉
- 特征根振荡解动画 → 微分方程解的行为直觉

---

## 2. 快速开始

### 2.1 环境要求

- Node.js ≥ 18.0
- npm ≥ 9.0

### 2.2 安装依赖

```bash
npm install
```

### 2.3 启动 Remotion Studio

```bash
npm start
# 等同于：npx remotion studio
```

启动后浏览器自动打开 `http://localhost:3000`，可在左侧面板选择任意 Composition 预览。

### 2.4 渲染视频

```bash
# 渲染单个 Composition（示例：第七章第一节）
npx remotion render src/index.ts Ch07_Sec01_Intro out/Ch07_Sec01_Intro.mp4

# 渲染所有 Composition（脚本示例）
npx remotion render src/index.ts --bundle-cache=true
```

### 2.5 在 Remotion Studio 中预览

1. 运行 `npm start` 打开 Studio
2. 左侧 **Compositions** 面板中，按 `Ch07_` / `Ch08_` 等前缀查找章节
3. 使用底部播放条逐帧检查，或按 `Space` 播放
4. 按 `R` 键触发热重载后查看修改效果

---

## 3. 项目结构说明

```
math/
├── package.json                          # 项目依赖与 npm 脚本
├── tsconfig.json                         # TypeScript 配置
├── remotion.config.ts                    # Remotion 渲染配置
├── docs/                                 # 项目文档（14 个 md 文件）
│   ├── PROJECT_SUMMARY.md                # 本文件：项目总结
│   ├── architecture.md                   # 整体架构设计说明
│   ├── chapters/                         # 各章节详细文档
│   │   ├── README.md                     # 章节索引总表（含 Composition ID）
│   │   ├── ch07-differential-equations.md
│   │   ├── ch08-vector-geometry.md
│   │   ├── ch09-multivariable-calculus.md
│   │   ├── ch10-multiple-integrals.md
│   │   ├── ch11-curve-surface-integrals.md
│   │   └── ch12-infinite-series.md
│   └── components/                       # 组件 API 文档
│       ├── README.md
│       ├── base-components.md
│       ├── hooks.md
│       ├── layout-components.md
│       └── special-components.md
└── src/
    ├── index.ts                          # Remotion 入口，指向 Root
    ├── Root.tsx                          # 注册全部 47 个 Composition
    ├── constants/
    │   ├── colorTheme.ts                 # 3B1B 风格全局色板（COLORS 对象）
    │   └── videoConfig.ts                # 视频规格：1920×1080 / 30fps
    ├── hooks/
    │   ├── useCoordinateTransform.ts     # 数学坐标 → SVG 像素坐标变换 Hook
    │   └── useDrawProgress.ts            # 基于帧号的绘制进度 [0,1] Hook
    ├── utils/
    │   ├── mathUtils.ts                  # generateFunctionPath 等数学计算工具
    │   └── pathUtils.ts                  # createCoordinateTransform 坐标变换工厂
    ├── components/
    │   ├── math/                         # 7 个核心数学可视化组件
    │   │   ├── MathFormula.tsx           # KaTeX 公式渲染组件
    │   │   ├── CoordinateSystem.tsx      # 坐标系 + Context Provider
    │   │   ├── FunctionPlot.tsx          # 函数曲线（支持 drawProgress 动画）
    │   │   ├── IntegralArea.tsx          # 积分面积填充动画
    │   │   ├── Arrow.tsx                 # 向量箭头（带箭头头部）
    │   │   ├── VectorField.tsx           # 向量场网格可视化
    │   │   └── FourierSeries.tsx         # 傅里叶级数逐项叠加动画
    │   └── ui/                           # 3 个布局/排版组件
    │       ├── TitleCard.tsx             # 章节标题卡（淡入动画）
    │       ├── TheoremBox.tsx            # 定理/定义框（带边框高亮）
    │       └── StepByStep.tsx            # 逐步推导容器（按 progress 显示各步）
    └── compositions/                     # 6 章 41 节动画实现
        ├── Ch07_DifferentialEq/          # 第七章：微分方程（9 节）
        │   ├── index.tsx                 # 章节占位组件
        │   ├── Sec01_Intro.tsx           # 微分方程基本概念
        │   ├── Sec02_Separable.tsx       # 可分离变量方程
        │   ├── Sec03_Homogeneous.tsx     # 齐次方程
        │   ├── Sec04_Linear.tsx          # 一阶线性方程（重点）
        │   ├── Sec05_Exact.tsx           # 全微分方程
        │   ├── Sec06_HighOrder.tsx       # 可降阶高阶方程
        │   ├── Sec07_Linear2.tsx         # 高阶线性方程
        │   ├── Sec08_ConstCoeff.tsx      # 常系数齐次线性方程（重点）
        │   └── Sec09_NonHomog.tsx        # 常系数非齐次线性方程
        ├── Ch08_VectorGeometry/          # 第八章：空间解析几何（6 节）
        │   ├── index.tsx
        │   ├── Sec01_Vectors.tsx         # 向量代数基础
        │   ├── Sec02_Products.tsx        # 点积与叉积（重点）
        │   ├── Sec03_Surfaces.tsx        # 二次曲面方程
        │   ├── Sec04_Curves.tsx          # 空间曲线参数方程
        │   ├── Sec05_Plane.tsx           # 平面方程
        │   └── Sec06_Line.tsx            # 空间直线方程
        ├── Ch09_MultiVariable/           # 第九章：多元函数微分法（8 节）
        │   ├── index.tsx
        │   ├── Sec01_Concept.tsx         # 多元函数基本概念
        │   ├── Sec02_Partial.tsx         # 偏导数（重点）
        │   ├── Sec03_Total.tsx           # 全微分
        │   ├── Sec04_Chain.tsx           # 链式法则
        │   ├── Sec05_Implicit.tsx        # 隐函数求导
        │   ├── Sec06_Geometry.tsx        # 曲面切平面与法线
        │   ├── Sec07_Gradient.tsx        # 梯度与方向导数（重点）
        │   └── Sec08_Extremum.tsx        # 极值与最值
        ├── Ch10_MultipleIntegral/        # 第十章：重积分（4 节）
        │   ├── index.tsx
        │   ├── Sec01_Concept.tsx         # 二重积分概念
        │   ├── Sec02_Calc2D.tsx          # 二重积分计算（重点）
        │   ├── Sec03_Triple.tsx          # 三重积分
        │   └── Sec04_Apps.tsx            # 重积分应用
        ├── Ch11_LineAndSurface/          # 第十一章：曲线与曲面积分（7 节）
        │   ├── index.tsx
        │   ├── Sec01_Line1.tsx           # 第一类曲线积分
        │   ├── Sec02_Line2.tsx           # 第二类曲线积分
        │   ├── Sec03_Green.tsx           # 格林公式（重点）
        │   ├── Sec04_Surface1.tsx        # 第一类曲面积分
        │   ├── Sec05_Surface2.tsx        # 第二类曲面积分
        │   ├── Sec06_Gauss.tsx           # 高斯公式
        │   └── Sec07_Stokes.tsx          # 斯托克斯公式
        └── Ch12_Series/                  # 第十二章：无穷级数（7 节）
            ├── index.tsx
            ├── Sec01_Concept.tsx         # 级数收敛概念
            ├── Sec02_Tests.tsx           # 收敛判别法
            ├── Sec03_Power.tsx           # 幂级数与收敛半径
            ├── Sec04_Taylor.tsx          # 泰勒展开（重点）
            ├── Sec05_Apps.tsx            # 幂级数应用
            ├── Sec06_Fourier.tsx         # 傅里叶级数（压轴！）
            └── Sec07_Fourier2.tsx        # 奇偶延拓
```

---

## 4. 组件库参考手册

### 4.1 数学可视化组件

#### `MathFormula` — KaTeX 公式渲染

文件：[`src/components/math/MathFormula.tsx`](../src/components/math/MathFormula.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `latex` | `string` | **必填** | LaTeX 公式字符串 |
| `displayMode` | `boolean` | `true` | `true` 为块级公式，`false` 为行内公式 |
| `color` | `string` | `"#ffffff"` | 公式颜色 |
| `fontSize` | `number` | `48` | 字体大小（px） |
| `opacity` | `number` | `1` | 透明度 [0, 1] |
| `style` | `React.CSSProperties` | — | 额外样式覆盖 |

```tsx
// 使用示例
import { MathFormula } from "../../components/math/MathFormula";

<MathFormula
  latex="\int_a^b f(x)\,dx = F(b) - F(a)"
  displayMode={true}
  color={COLORS.formula}
  fontSize={52}
  opacity={titleProgress}
/>
```

---

#### `CoordinateSystem` — 坐标系 Context Provider

文件：[`src/components/math/CoordinateSystem.tsx`](../src/components/math/CoordinateSystem.tsx)

通过 React Context 向子组件注入坐标变换函数，子组件无需重复传参。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `xRange` | `[number, number]` | **必填** | X 轴数学范围，如 `[-5, 5]` |
| `yRange` | `[number, number]` | **必填** | Y 轴数学范围，如 `[-3, 3]` |
| `width` | `number` | **必填** | SVG 画布宽度（px） |
| `height` | `number` | **必填** | SVG 画布高度（px） |
| `showGrid` | `boolean` | `true` | 是否显示网格线 |
| `showAxes` | `boolean` | `true` | 是否显示坐标轴 |
| `children` | `ReactNode` | — | 子组件（可直接使用坐标变换 Context） |

```tsx
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";

<CoordinateSystem xRange={[-4, 4]} yRange={[-2, 2]} width={900} height={600}>
  <FunctionPlot fn={(x) => Math.sin(x)} drawProgress={progress} color={COLORS.primaryCurve} />
</CoordinateSystem>
```

---

#### `FunctionPlot` — 函数曲线

文件：[`src/components/math/FunctionPlot.tsx`](../src/components/math/FunctionPlot.tsx)

需在 `CoordinateSystem` 内使用，自动读取坐标变换 Context。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fn` | `(x: number) => number` | **必填** | 函数表达式 |
| `drawProgress` | `number` | `1` | 绘制进度 [0, 1]，0=未绘，1=完整 |
| `color` | `string` | `COLORS.primaryCurve` | 曲线颜色 |
| `strokeWidth` | `number` | `3` | 线宽（px） |
| `samples` | `number` | `200` | 采样点数，越大越平滑 |

```tsx
// 动态绘制 sin(x) 曲线
const drawProgress = interpolate(frame, [30, 120], [0, 1]);
<FunctionPlot fn={(x) => Math.sin(x)} drawProgress={drawProgress} />
```

---

#### `IntegralArea` — 积分面积填充

文件：[`src/components/math/IntegralArea.tsx`](../src/components/math/IntegralArea.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fn` | `(x: number) => number` | **必填** | 被积函数 |
| `xMin` | `number` | **必填** | 积分下限 |
| `xMax` | `number` | **必填** | 积分上限 |
| `fillProgress` | `number` | `1` | 填充进度 [0, 1] |
| `fillColor` | `string` | `COLORS.integralArea` | 填充颜色（建议半透明） |
| `showRiemann` | `boolean` | `false` | 是否显示黎曼矩形条 |
| `riemannN` | `number` | `20` | 黎曼矩形条数量 |

---

#### `Arrow` — 向量箭头

文件：[`src/components/math/Arrow.tsx`](../src/components/math/Arrow.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `from` | `[number, number]` | **必填** | 起点坐标（数学坐标） |
| `to` | `[number, number]` | **必填** | 终点坐标（数学坐标） |
| `color` | `string` | `COLORS.vector` | 箭头颜色 |
| `strokeWidth` | `number` | `2` | 线宽 |
| `drawProgress` | `number` | `1` | 绘制进度 [0, 1] |
| `label` | `string` | — | 箭头标注文字 |

---

#### `VectorField` — 向量场

文件：[`src/components/math/VectorField.tsx`](../src/components/math/VectorField.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fieldFn` | `(x: number, y: number) => [number, number]` | **必填** | 向量场函数 |
| `gridN` | `number` | `10` | 网格密度（每轴格数） |
| `arrowScale` | `number` | `0.3` | 箭头缩放因子 |
| `color` | `string` | `COLORS.vector` | 箭头颜色 |
| `opacity` | `number` | `1` | 整体透明度 |

```tsx
// 梯度场可视化示例
<VectorField
  fieldFn={(x, y) => [2 * x, 2 * y]}  // ∇(x²+y²) = (2x, 2y)
  gridN={8}
  arrowScale={0.25}
  color={COLORS.vector}
/>
```

---

#### `FourierSeries` — 傅里叶级数叠加

文件：[`src/components/math/FourierSeries.tsx`](../src/components/math/FourierSeries.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `targetFn` | `(x: number) => number` | **必填** | 目标函数（如方波） |
| `terms` | `number` | `5` | 当前叠加项数（动态变化） |
| `maxTerms` | `number` | `21` | 最大项数 |
| `showGibbs` | `boolean` | `false` | 是否标注吉布斯现象 |
| `color` | `string` | `COLORS.primaryCurve` | 合成波颜色 |

---

### 4.2 布局组件

#### `TitleCard` — 章节标题卡

文件：[`src/components/ui/TitleCard.tsx`](../src/components/ui/TitleCard.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chapterNumber` | `string` | **必填** | 章节编号，如 `"第七章"` |
| `title` | `string` | **必填** | 小节标题 |
| `subtitle` | `string` | — | 副标题（可选） |
| `progress` | `number` | `1` | 淡入进度 [0, 1] |

```tsx
const titleProgress = interpolate(frame, [0, 30], [0, 1]);
<TitleCard chapterNumber="第十二章" title="傅里叶级数" progress={titleProgress} />
```

---

#### `TheoremBox` — 定理框

文件：[`src/components/ui/TheoremBox.tsx`](../src/components/ui/TheoremBox.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | `"定理"` | 框左上角标签（"定义"/"引理"/"定理"） |
| `content` | `string \| ReactNode` | **必填** | 正文内容 |
| `progress` | `number` | `1` | 出现进度 [0, 1] |
| `highlightColor` | `string` | `COLORS.theoremBorder` | 边框高亮色 |

---

#### `StepByStep` — 逐步推导

文件：[`src/components/ui/StepByStep.tsx`](../src/components/ui/StepByStep.tsx)

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `steps` | `ReactNode[]` | **必填** | 推导步骤数组，每步一个元素 |
| `progress` | `number` | `1` | 总进度 [0, 1]，按步数均分 |
| `stepGap` | `number` | `40` | 步骤间距（px） |

```tsx
// 3 步推导，0~0.33 显示第1步，0.33~0.67 显示第2步，0.67~1 显示第3步
<StepByStep
  steps={[
    <MathFormula latex="\frac{dy}{dx} = P(x)y + Q(x)" />,
    <MathFormula latex="\mu(x) = e^{-\int P(x)\,dx}" />,
    <MathFormula latex="y = e^{\int P\,dx}\left(\int Q e^{-\int P\,dx}\,dx + C\right)" />,
  ]}
  progress={progress}
/>
```

---

### 4.3 自定义 Hooks

#### `useCoordinateTransform` — 坐标变换

文件：[`src/hooks/useCoordinateTransform.ts`](../src/hooks/useCoordinateTransform.ts)

从 `CoordinateSystem` Context 中读取坐标变换函数。

```tsx
const { toSVG, toMath } = useCoordinateTransform();
const [svgX, svgY] = toSVG(mathX, mathY);  // 数学坐标 → SVG 像素
const [mx, my] = toMath(svgX, svgY);        // SVG 像素 → 数学坐标
```

#### `useDrawProgress` — 绘制进度

文件：[`src/hooks/useDrawProgress.ts`](../src/hooks/useDrawProgress.ts)

```tsx
// 在帧 [startFrame, endFrame] 区间内将 progress 从 0 插值到 1
const progress = useDrawProgress(frame, startFrame, endFrame);
```

---

### 4.4 工具函数

#### `mathUtils.ts`

文件：[`src/utils/mathUtils.ts`](../src/utils/mathUtils.ts)

| 函数 | 签名 | 说明 |
|------|------|------|
| `generateFunctionPath()` | `(fn, xMin, xMax, samples) => string` | 生成 SVG path `d` 属性字符串 |
| `clamp()` | `(val, min, max) => number` | 值域限制 |
| `lerp()` | `(a, b, t) => number` | 线性插值 |

#### `pathUtils.ts`

文件：[`src/utils/pathUtils.ts`](../src/utils/pathUtils.ts)

| 函数 | 签名 | 说明 |
|------|------|------|
| `createCoordinateTransform()` | `(xRange, yRange, width, height) => TransformFns` | 创建坐标变换对象 |

---

## 5. 章节内容索引

> 总帧数基于 [`src/Root.tsx`](../src/Root.tsx) 中的 `durationInFrames` 统计，视频规格：30fps / 1920×1080

### 第七章：微分方程（9 节，3810 帧，127 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch07_Sec01_Intro` | [Sec01_Intro.tsx](../src/compositions/Ch07_DifferentialEq/Sec01_Intro.tsx) | 450 | 15s | 微分方程基本概念 + 解的验证 + 解族曲线可视化 | |
| `Ch07_Sec02_Separable` | [Sec02_Separable.tsx](../src/compositions/Ch07_DifferentialEq/Sec02_Separable.tsx) | 540 | 18s | 可分离变量方程 + 分离过程动画 + 5条解曲线 | |
| `Ch07_Sec03_Homogeneous` | [Sec03_Homogeneous.tsx](../src/compositions/Ch07_DifferentialEq/Sec03_Homogeneous.tsx) | 300 | 10s | 齐次方程 + u=y/x 换元法 | |
| `Ch07_Sec04_Linear` | [Sec04_Linear.tsx](../src/compositions/Ch07_DifferentialEq/Sec04_Linear.tsx) | 540 | 18s | 一阶线性方程 + 积分因子法 + 解族 | ⭐ 重点 |
| `Ch07_Sec05_Exact` | [Sec05_Exact.tsx](../src/compositions/Ch07_DifferentialEq/Sec05_Exact.tsx) | 300 | 10s | 全微分方程 + 势函数法 | |
| `Ch07_Sec06_HighOrder` | [Sec06_HighOrder.tsx](../src/compositions/Ch07_DifferentialEq/Sec06_HighOrder.tsx) | 300 | 10s | 可降阶高阶方程三种类型 | |
| `Ch07_Sec07_Linear2` | [Sec07_Linear2.tsx](../src/compositions/Ch07_DifferentialEq/Sec07_Linear2.tsx) | 300 | 10s | 高阶线性方程 + 朗斯基行列式 | |
| `Ch07_Sec08_ConstCoeff` | [Sec08_ConstCoeff.tsx](../src/compositions/Ch07_DifferentialEq/Sec08_ConstCoeff.tsx) | 600 | 20s | 常系数齐次线性方程 + 特征根三种情况 + 振荡解动画 | ⭐ 重点 |
| `Ch07_Sec09_NonHomog` | [Sec09_NonHomog.tsx](../src/compositions/Ch07_DifferentialEq/Sec09_NonHomog.tsx) | 480 | 16s | 常系数非齐次线性方程 + 待定系数法 | |

### 第八章：空间解析几何与向量代数（6 节，2550 帧，85 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch08_Sec01_Vectors` | [Sec01_Vectors.tsx](../src/compositions/Ch08_VectorGeometry/Sec01_Vectors.tsx) | 450 | 15s | 向量加法平行四边形法则 + 数乘 + 坐标分解 | |
| `Ch08_Sec02_Products` | [Sec02_Products.tsx](../src/compositions/Ch08_VectorGeometry/Sec02_Products.tsx) | 540 | 18s | 点积夹角动画 + 叉积行列式 + 平行四边形面积可视化 | ⭐ 重点 |
| `Ch08_Sec03_Surfaces` | [Sec03_Surfaces.tsx](../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx) | 300 | 10s | 球面/旋转面/柱面方程 | |
| `Ch08_Sec04_Curves` | [Sec04_Curves.tsx](../src/compositions/Ch08_VectorGeometry/Sec04_Curves.tsx) | 300 | 10s | 螺旋线参数方程 + 投影 | |
| `Ch08_Sec05_Plane` | [Sec05_Plane.tsx](../src/compositions/Ch08_VectorGeometry/Sec05_Plane.tsx) | 480 | 16s | 平面点法式推导 + 点到平面距离公式 | |
| `Ch08_Sec06_Line` | [Sec06_Line.tsx](../src/compositions/Ch08_VectorGeometry/Sec06_Line.tsx) | 480 | 16s | 空间直线对称式/参数式 + 线面夹角 | |

### 第九章：多元函数微分法及其应用（8 节，3060 帧，102 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch09_Sec01_Concept` | [Sec01_Concept.tsx](../src/compositions/Ch09_MultiVariable/Sec01_Concept.tsx) | 300 | 10s | 多元函数定义域 + 极限路径无关性 | |
| `Ch09_Sec02_Partial` | [Sec02_Partial.tsx](../src/compositions/Ch09_MultiVariable/Sec02_Partial.tsx) | 540 | 18s | 偏导数几何意义 + 截面切线动画 | ⭐ 重点 |
| `Ch09_Sec03_Total` | [Sec03_Total.tsx](../src/compositions/Ch09_MultiVariable/Sec03_Total.tsx) | 300 | 10s | 全微分 + 近似计算 | |
| `Ch09_Sec04_Chain` | [Sec04_Chain.tsx](../src/compositions/Ch09_MultiVariable/Sec04_Chain.tsx) | 300 | 10s | 链式法则 SVG 树状图 | |
| `Ch09_Sec05_Implicit` | [Sec05_Implicit.tsx](../src/compositions/Ch09_MultiVariable/Sec05_Implicit.tsx) | 300 | 10s | 隐函数求导公式 | |
| `Ch09_Sec06_Geometry` | [Sec06_Geometry.tsx](../src/compositions/Ch09_MultiVariable/Sec06_Geometry.tsx) | 300 | 10s | 曲面切平面与法线 | |
| `Ch09_Sec07_Gradient` | [Sec07_Gradient.tsx](../src/compositions/Ch09_MultiVariable/Sec07_Gradient.tsx) | 540 | 18s | 梯度 + VectorField 向量场动画 + 方向导数 | ⭐ 重点 |
| `Ch09_Sec08_Extremum` | [Sec08_Extremum.tsx](../src/compositions/Ch09_MultiVariable/Sec08_Extremum.tsx) | 480 | 16s | 极值必要条件 + Hessian 判别法 + 鞍点等值线图 | |

### 第十章：重积分（4 节，2040 帧，68 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch10_Sec01_Concept` | [Sec01_Concept.tsx](../src/compositions/Ch10_MultipleIntegral/Sec01_Concept.tsx) | 480 | 16s | 黎曼和矩形条 + 对称性消去动画 | |
| `Ch10_Sec02_Calc2D` | [Sec02_Calc2D.tsx](../src/compositions/Ch10_MultipleIntegral/Sec02_Calc2D.tsx) | 600 | 20s | 累次积分扫描线动画 + 极坐标变换 + e^(x²+y²) 例题 | ⭐ 重点 |
| `Ch10_Sec03_Triple` | [Sec03_Triple.tsx](../src/compositions/Ch10_MultipleIntegral/Sec03_Triple.tsx) | 480 | 16s | 柱坐标/球坐标变换图示 | |
| `Ch10_Sec04_Apps` | [Sec04_Apps.tsx](../src/compositions/Ch10_MultipleIntegral/Sec04_Apps.tsx) | 480 | 16s | 曲面面积公式 + 质心标记动画 | |

### 第十一章：曲线积分与曲面积分（7 节，3060 帧，102 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch11_Sec01_Line1` | [Sec01_Line1.tsx](../src/compositions/Ch11_LineAndSurface/Sec01_Line1.tsx) | 480 | 16s | 弧长积分定义 + 参数化计算 + 单位圆例题 | |
| `Ch11_Sec02_Line2` | [Sec02_Line2.tsx](../src/compositions/Ch11_LineAndSurface/Sec02_Line2.tsx) | 480 | 16s | 力场做功 + 路径方向性 | |
| `Ch11_Sec03_Green` | [Sec03_Green.tsx](../src/compositions/Ch11_LineAndSurface/Sec03_Green.tsx) | 540 | 18s | 格林公式封闭曲线动画 + 路径无关条件 | ⭐ 重点 |
| `Ch11_Sec04_Surface1` | [Sec04_Surface1.tsx](../src/compositions/Ch11_LineAndSurface/Sec04_Surface1.tsx) | 300 | 10s | 第一类曲面积分公式 | |
| `Ch11_Sec05_Surface2` | [Sec05_Surface2.tsx](../src/compositions/Ch11_LineAndSurface/Sec05_Surface2.tsx) | 300 | 10s | 第二类曲面积分流量 | |
| `Ch11_Sec06_Gauss` | [Sec06_Gauss.tsx](../src/compositions/Ch11_LineAndSurface/Sec06_Gauss.tsx) | 480 | 16s | 高斯公式 + 散度物理意义 | |
| `Ch11_Sec07_Stokes` | [Sec07_Stokes.tsx](../src/compositions/Ch11_LineAndSurface/Sec07_Stokes.tsx) | 480 | 16s | 斯托克斯公式 + 旋度 | |

### 第十二章：无穷级数（7 节，3420 帧，114 秒）

| Composition ID | 文件 | 帧数 | 时长 | 内容摘要 | 标注 |
|----------------|------|------|------|---------|------|
| `Ch12_Sec01_Concept` | [Sec01_Concept.tsx](../src/compositions/Ch12_Series/Sec01_Concept.tsx) | 480 | 16s | 等比级数收敛数轴动画 + 调和级数柱状发散图 | |
| `Ch12_Sec02_Tests` | [Sec02_Tests.tsx](../src/compositions/Ch12_Series/Sec02_Tests.tsx) | 540 | 18s | 比较/比值/莱布尼茨审敛法 | |
| `Ch12_Sec03_Power` | [Sec03_Power.tsx](../src/compositions/Ch12_Series/Sec03_Power.tsx) | 480 | 16s | 收敛半径数轴动画 | |
| `Ch12_Sec04_Taylor` | [Sec04_Taylor.tsx](../src/compositions/Ch12_Series/Sec04_Taylor.tsx) | 540 | 18s | 泰勒展开逐阶逼近 eˣ 动画 | ⭐ 重点 |
| `Ch12_Sec05_Apps` | [Sec05_Apps.tsx](../src/compositions/Ch12_Series/Sec05_Apps.tsx) | 300 | 10s | 幂级数近似计算 + 求极限 | |
| `Ch12_Sec06_Fourier` | [Sec06_Fourier.tsx](../src/compositions/Ch12_Series/Sec06_Fourier.tsx) | 600 | 20s | 傅里叶级数方波逼近（1→21项）+ 吉布斯现象 | 🎬 压轴 |
| `Ch12_Sec07_Fourier2` | [Sec07_Fourier2.tsx](../src/compositions/Ch12_Series/Sec07_Fourier2.tsx) | 480 | 16s | 奇/偶延拓正弦/余弦级数 | |

---

## 6. 动画开发规范

### 6.1 添加新章节

1. 在 [`src/compositions/`](../src/compositions/) 下新建目录，命名规范：`Ch{两位章号}_{英文主题名}`
2. 创建 `index.tsx` 作为章节占位组件
3. 在 [`src/Root.tsx`](../src/Root.tsx) 中 `import` 组件并注册 `<Composition>`

```tsx
// src/Root.tsx 中添加
import NewSec from "./compositions/Ch13_NewChapter/Sec01_NewSec";

<Composition
  id="Ch13_Sec01_NewSec"
  component={NewSec}
  durationInFrames={450}
  fps={VIDEO_CONFIG.fps}
  width={VIDEO_CONFIG.width}
  height={VIDEO_CONFIG.height}
/>
```

### 6.2 添加新节

1. 在对应章节目录下创建 `Sec{两位节号}_{英文主题名}.tsx`
2. 遵循标准场景结构模板（见下方）
3. 在 [`src/Root.tsx`](../src/Root.tsx) 注册对应的 `<Composition>`

### 6.3 标准场景结构模板

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Series, Sequence } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { VIDEO_CONFIG } from "../../constants/videoConfig";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { MathFormula } from "../../components/math/MathFormula";

const MyNewSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Series>
        {/* 场景一：标题卡（60帧）*/}
        <Series.Sequence durationInFrames={60}>
          <TitleCard
            chapterNumber="第X章"
            title="小节标题"
            progress={interpolate(frame, [0, 30], [0, 1])}
          />
        </Series.Sequence>

        {/* 场景二：概念引入（90帧）*/}
        <Series.Sequence durationInFrames={90}>
          {/* 图文并茂内容 */}
        </Series.Sequence>

        {/* 场景三：定理展示（60帧）*/}
        <Series.Sequence durationInFrames={60}>
          <TheoremBox label="定理" content="..." />
        </Series.Sequence>

        {/* 场景四：推导过程（120帧）*/}
        <Series.Sequence durationInFrames={120}>
          {/* StepByStep 推导 */}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export default MyNewSection;
```

### 6.4 时序约定

| 场景类型 | 建议帧数 | 说明 |
|---------|---------|------|
| 标题卡 | 60 帧（2s） | `TitleCard` 淡入 |
| 概念引入 | 90 帧（3s） | 图文并茂，逐步出现 |
| 定理框 | 60 帧（2s） | `TheoremBox` 出现 |
| 推导过程 | 120~180 帧（4~6s） | `StepByStep` 分步展示 |
| 图形动画 | 150~300 帧（5~10s） | 函数绘制/面积填充 |
| 总结回顾 | 60 帧（2s） | 公式回放或文字总结 |

**帧→进度映射规范：**

```tsx
// 在场景内使用 useCurrentFrame() 后，用 interpolate 归一化
const sceneFrame = useCurrentFrame(); // Series.Sequence 内的相对帧
const progress = interpolate(sceneFrame, [0, durationInFrames], [0, 1], {
  extrapolateRight: "clamp",
});
```

### 6.5 颜色约定

参见 [`src/constants/colorTheme.ts`](../src/constants/colorTheme.ts)：

| 常量名 | 颜色值 | 用途 |
|--------|--------|------|
| `COLORS.background` | `#1a1a2e` | 背景（深海蓝） |
| `COLORS.primaryCurve` | `#61dafb` | 主函数曲线（React 蓝） |
| `COLORS.secondaryCurve` | `#ff79c6` | 辅助函数曲线（粉红） |
| `COLORS.tertiaryCurve` | `#50fa7b` | 第三条曲线（绿色） |
| `COLORS.vector` | `#ffd700` | 向量/箭头（金黄） |
| `COLORS.integralArea` | `rgba(97,218,251,0.25)` | 积分面积填充（半透明蓝） |
| `COLORS.highlight` | `#ff6b6b` | 重点标注（橙红） |
| `COLORS.formula` | `#ffffff` | 公式文字（白色） |
| `COLORS.annotation` | `#f8f8f2` | 注释文字（米白） |
| `COLORS.axis` | `#888888` | 坐标轴（灰色） |
| `COLORS.grid` | `#333355` | 网格线（深蓝灰） |
| `COLORS.theoremBg` | `rgba(97,218,251,0.1)` | 定理框背景 |
| `COLORS.theoremBorder` | `#61dafb` | 定理框边框 |

### 6.6 Composition ID 命名规范

```
Ch{两位章号}_Sec{两位节号}_{英文主题名}
```

示例：
- `Ch07_Sec04_Linear`
- `Ch12_Sec06_Fourier`
- `Ch09_Sec07_Gradient`

---

## 7. 完成度统计

### 7.1 总体概览

| 指标 | 数值 |
|------|------|
| 总 Composition 数量 | **47 个** |
| 完整动画（450 帧以上） | **31 个** |
| 基础动画（300 帧） | **16 个** |
| 总动画帧数 | **17,940 帧** |
| 当前动画总时长 | **约 598 秒（10 分钟）** |
| 总预计教学视频内容 | **~350 分钟** |
| 覆盖章节 | 第七章 ~ 第十二章（共 6 章） |
| 覆盖教材节数 | 41 节 |

### 7.2 各章统计

| 章节 | 节数 | 总帧数 | 当前时长 | 重点节 |
|------|------|--------|---------|--------|
| 第七章：微分方程 | 9 | 3,810 | 127s | Sec04, Sec08 |
| 第八章：空间解析几何 | 6 | 2,550 | 85s | Sec02 |
| 第九章：多元函数微分 | 8 | 3,060 | 102s | Sec02, Sec07 |
| 第十章：重积分 | 4 | 2,040 | 68s | Sec02 |
| 第十一章：曲线与曲面积分 | 7 | 3,060 | 102s | Sec03 |
| 第十二章：无穷级数 | 7 | 3,420 | 114s | Sec04, Sec06 |
| **合计** | **41** | **17,940** | **598s** | |

### 7.3 动画完成度分级

**完整动画（450 帧以上，≥15s）共 31 个：**

Ch07: Sec01(450), Sec02(540), Sec04(540), Sec08(600), Sec09(480)  
Ch08: Sec01(450), Sec02(540), Sec05(480), Sec06(480)  
Ch09: Sec02(540), Sec07(540), Sec08(480)  
Ch10: Sec01(480), Sec02(600), Sec03(480), Sec04(480)  
Ch11: Sec01(480), Sec02(480), Sec03(540), Sec06(480), Sec07(480)  
Ch12: Sec01(480), Sec02(540), Sec03(480), Sec04(540), Sec06(600), Sec07(480)

**基础动画（300 帧，=10s）共 16 个：**

Ch07: Sec03, Sec05, Sec06, Sec07  
Ch08: Sec03, Sec04  
Ch09: Sec01, Sec03, Sec04, Sec05, Sec06  
Ch11: Sec04, Sec05  
Ch12: Sec05  
（另含 Ch07_Sec07_Linear2=300 帧，Ch09_Sec01_Concept=300 帧）

---

## 8. 后续扩展建议

### 8.1 音频支持

Remotion 内置音频轨道支持，可叠加 TTS 语音旁白：

```tsx
import { Audio } from "remotion";

// 在 Composition 内添加音频轨道
<Audio src={staticFile("narration/ch07-sec01.mp3")} />
```

**建议方案：**
- 使用 TTS 服务（如微软 Azure Neural TTS）生成旁白音频
- 以章节为单位制作音频文件，置于 `public/audio/` 目录
- 通过 `Sequence` 对齐音频与动画时序

### 8.2 字幕叠加

```tsx
// 可创建 Subtitle 组件
import { Sequence } from "remotion";

<Sequence from={0} durationInFrames={90}>
  <Subtitle text="微分方程，是含有未知函数及其导数的方程" />
</Sequence>
```

### 8.3 交互式预览（Remotion Player）

将动画嵌入网页，供学生自主控制播放：

```tsx
import { Player } from "@remotion/player";
import { Ch07Sec01Intro } from "./compositions/Ch07_DifferentialEq/Sec01_Intro";

<Player
  component={Ch07Sec01Intro}
  durationInFrames={450}
  fps={30}
  style={{ width: "100%" }}
  controls
/>
```

### 8.4 章节封面与目录动画

为每章制作独立的封面动画（`Ch07_Cover` 等），包含本章知识导图，串联各节视频。

### 8.5 习题演示动画

针对典型习题制作解题过程动画，帧数约 600~900 帧，与正课分集发布。

### 8.6 批量渲染脚本

```bash
#!/bin/bash
# render-all.sh：批量渲染所有 Composition

COMPOSITIONS=(
  "Ch07_Sec01_Intro"
  "Ch07_Sec02_Separable"
  # ... 其余 Composition ID
)

for COMP in "${COMPOSITIONS[@]}"; do
  npx remotion render src/index.ts "$COMP" "out/$COMP.mp4" \
    --codec=h264 --crf=18 --frames=0-end
done
```

### 8.7 主题切换支持

当前仅支持深色主题（3B1B 风格），可扩展为：
- 浅色主题（适合打印/投影仪）
- 高对比度主题（无障碍访问）

在 [`src/constants/colorTheme.ts`](../src/constants/colorTheme.ts) 中新增主题对象，通过 Context 注入即可实现主题切换。

### 8.8 单元测试

对核心工具函数添加单元测试：

```bash
npm install --save-dev jest @types/jest ts-jest
```

测试重点：[`src/utils/mathUtils.ts`](../src/utils/mathUtils.ts) 中的 `generateFunctionPath`、[`src/utils/pathUtils.ts`](../src/utils/pathUtils.ts) 中的坐标变换精度。

---

## 参考资料

- [Remotion 官方文档](https://www.remotion.dev/docs)
- [KaTeX 支持的 LaTeX 命令](https://katex.org/docs/support_table.html)
- [同济大学《高等数学》第七版下册](https://book.douban.com/subject/10338536/)
- [3Blue1Brown 视频制作工具 Manim](https://github.com/3b1b/manim)（设计风格参考）
- [D3.js 路径生成 API](https://d3js.org/d3-path)

---

*文档生成时间：2026-04-07 | 项目版本：v1.0.0*

---

## 最近更新（2026-04-08）

> 详细内容请参阅：[开发会话总结文档（2026-04-08）](./SESSION_SUMMARY_20260408.md)

### 本次会话改进

1. **创建公共动画工具模块 [`src/utils/animationUtils.ts`](../src/utils/animationUtils.ts)**  
   提取 41 个动画文件中各自重复定义的 `fade()` 函数，统一至公共模块；新增 [`lerp()`](../src/utils/animationUtils.ts)、[`isVisible()`](../src/utils/animationUtils.ts)、[`stepOpacity()`](../src/utils/animationUtils.ts)、[`springFade()`](../src/utils/animationUtils.ts) 等 4 个公共动画辅助函数，消除技术债务。

2. **增强 Ch07 微分方程 4 个薄弱节**  
   [`Sec03_Homogeneous.tsx`](../src/compositions/Ch07_DifferentialEq/Sec03_Homogeneous.tsx)（添加换元推导动画 + 解族曲线可视化）、[`Sec05_Exact.tsx`](../src/compositions/Ch07_DifferentialEq/Sec05_Exact.tsx)（添加势函数等值线同心圆族）、[`Sec06_HighOrder.tsx`](../src/compositions/Ch07_DifferentialEq/Sec06_HighOrder.tsx)（逐次积分动画 + 解族曲线对比）、[`Sec07_Linear2.tsx`](../src/compositions/Ch07_DifferentialEq/Sec07_Linear2.tsx)（简谐振动三曲线叠加）——每节从 **~300帧/3场景 → ~480帧/5场景**。

3. **增强 Ch08 和 Ch09 共 5 个薄弱节**  
   [`Ch08/Sec03_Surfaces.tsx`](../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx)（球面截圆、柱面截面族、二次曲面 XY 投影）；[`Ch09/Sec01_Concept.tsx`](../src/compositions/Ch09_MultiVariable/Sec01_Concept.tsx)（定义域圆区域 + 极限方向箭头 + 等值线）、[`Ch09/Sec03_Total.tsx`](../src/compositions/Ch09_MultiVariable/Sec03_Total.tsx)（Δx/Δy 增量箭头 + 截线对比）、[`Ch09/Sec05_Implicit.tsx`](../src/compositions/Ch09_MultiVariable/Sec05_Implicit.tsx)（圆曲线 + 切点/切线/斜率标注）、[`Ch09/Sec06_Geometry.tsx`](../src/compositions/Ch09_MultiVariable/Sec06_Geometry.tsx)（梯度向量场 + 半球切平面/法线）。

4. **增强 Ch11 和 Ch12 共 3 个薄弱节**  
   [`Ch11/Sec04_Surface1.tsx`](../src/compositions/Ch11_LineAndSurface/Sec04_Surface1.tsx)（椭圆区域网格分割 + 球面体积示意）、[`Ch11/Sec05_Surface2.tsx`](../src/compositions/Ch11_LineAndSurface/Sec05_Surface2.tsx)（曲面法向量场 + 方向选取规则）、[`Ch12/Sec05_Apps.tsx`](../src/compositions/Ch12_Series/Sec05_Apps.tsx)（泰勒多项式逼近 + 欧拉公式单位圆）。

5. **修复 `IntegralArea` 组件零使用率问题**  
   在 [`Ch10/Sec01_Concept.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec01_Concept.tsx) 中集成 `IntegralArea` 展示 f(x)=x² 的黎曼和填充动画；在 [`Ch10/Sec04_Apps.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec04_Apps.tsx) 中集成展示半圆截面积分。

### 当前完成度

| 章节 | 节数 | 更新前总帧数 | 更新后总帧数 | 完整动画节数（≥450帧） |
|------|------|------------|------------|----------------------|
| 第七章：微分方程 | 9 | 3,810 | 4,530 | 9 / 9（全部完整） |
| 第八章：空间解析几何 | 6 | 2,550 | 2,730 | 5 / 6 |
| 第九章：多元函数微分 | 8 | 3,060 | 3,780 | 8 / 8（全部完整） |
| 第十章：重积分 | 4 | 2,040 | 2,040 | 4 / 4（含 IntegralArea 集成） |
| 第十一章：曲线与曲面积分 | 7 | 3,060 | 3,420 | 7 / 7（全部完整） |
| 第十二章：无穷级数 | 7 | 3,420 | 3,600 | 7 / 7（全部完整） |
| **合计** | **41** | **17,940** | **20,100** | **40 / 41** |

> 注：第八章 Sec04_Curves 仍为基础动画（300帧），为本次会话后唯一遗留的基础节。

*文档更新时间：2026-04-08 | 项目版本：v1.1.0*
