# 布局展示组件（Layout Components）

> 文件路径：`src/components/layout/`
> 这些组件负责教学内容的信息架构与视觉布局，控制文字、公式、步骤的结构化呈现。

---

## TitleCard

**文件**：`src/components/layout/TitleCard.tsx`
**职责**：每段视频开头的标题卡片，展示章节编号、主标题、副标题，三层文字依次淡入。

### Props 类型定义

```typescript
interface TitleCardProps {
  /** 章节编号标注，例如 "第七章" 或 "Chapter 7" */
  chapterLabel?: string;
  /** 主标题，例如 "微分方程" */
  title: string;
  /** 副标题（小节名），例如 "7.4 一阶线性微分方程" */
  subtitle?: string;
  /** 背景渐变起始色，默认 COLORS.background (#1a1a2e) */
  bgColorStart?: string;
  /** 背景渐变结束色，默认比起始色稍亮的深蓝 (#16213e) */
  bgColorEnd?: string;
  /** 渐变方向，默认 'to-bottom-right' */
  gradientDirection?: "to-bottom" | "to-right" | "to-bottom-right";
  /** 章节标签字体大小（px），默认 28 */
  chapterFontSize?: number;
  /** 主标题字体大小（px），默认 72 */
  titleFontSize?: number;
  /** 副标题字体大小（px），默认 36 */
  subtitleFontSize?: number;
  /** 主标题颜色，默认 COLORS.primaryCurve */
  titleColor?: string;
  /** 副标题颜色，默认 COLORS.annotation */
  subtitleColor?: string;
  /** 章节标签颜色，默认 COLORS.secondaryCurve */
  chapterColor?: string;
  /** 各层文字的错开淡入间隔（帧），默认 15 */
  staggerFrames?: number;
  /** 整体入场起始帧，默认 0 */
  enterFrame?: number;
  /** 每层文字淡入持续帧数，默认 20 */
  enterDuration?: number;
  /** 总时长（帧）：超过后整体淡出；0 表示不自动淡出 */
  duration?: number;
  /** 淡出持续帧数，默认 20 */
  exitDuration?: number;
  /** 标题下方装饰线条宽度（px），0 表示不显示，默认 200 */
  decorLineWidth?: number;
}
```

### 使用示例

```jsx
// 章节开头的大标题卡片
<TitleCard
  chapterLabel="第十一章"
  title="曲线积分与曲面积分"
  bgColorStart="#1a1a2e"
  bgColorEnd="#0d1b3e"
  titleColor={COLORS.primaryCurve}
  staggerFrames={15}
  enterFrame={0}
  duration={60}
/>

// 小节标题（仅显示副标题样式）
<TitleCard
  title="格林公式"
  subtitle="11.3  平面曲线积分与二重积分的联系"
  titleFontSize={56}
  decorLineWidth={300}
  duration={60}
/>
```

### 动画时序说明

```
帧 enterFrame:                  背景渐变淡入 (0→1, 持续 20 帧)
帧 enterFrame + 0:              chapterLabel 淡入上移
帧 enterFrame + staggerFrames:  title 淡入上移
帧 enterFrame + 2*staggerFrames: subtitle 淡入上移
帧 enterFrame + 3*staggerFrames: 装饰线条从中心向两侧延伸
帧 duration - exitDuration:     整体淡出开始
```

---

## TheoremBox

**文件**：`src/components/layout/TheoremBox.tsx`
**职责**：展示定理、定义、推论、公式等正式数学命题，带有类型标签和左侧色块边框。

### Props 类型定义

```typescript
type TheoremType =
  | "theorem"    // 定理 — 边框色 #61dafb
  | "definition" // 定义 — 边框色 #ff79c6
  | "corollary"  // 推论 — 边框色 #a9dc76
  | "formula"    // 公式 — 边框色 #ffd700
  | "example"    // 例题 — 边框色 #78dce8
  | "note";      // 注记 — 边框色 #888888

interface TheoremBoxProps {
  /** 框类型，控制边框颜色与默认标签文字 */
  type?: TheoremType;
  /** 自定义标签文字（覆盖 type 的默认值），例如 "定理 11.3" */
  label?: string;
  /** 定理名称（可选），例如 "格林公式" */
  name?: string;
  /** 正文内容（纯文字）*/
  content?: string;
  /** 正文中的核心公式（KaTeX 字符串），显示在 content 之后 */
  formula?: string;
  /** 附加说明文字（公式之后），例如条件说明 */
  remark?: string;
  /** 框宽度（px），默认 720 */
  width?: number;
  /** 框在视频中的 x 中心位置（px），默认 960 */
  x?: number;
  /** 框顶部 y 位置（px），默认 200 */
  y?: number;
  /** 入场动画进度 [0, 1]：从左侧滑入 */
  enterProgress?: number;
  /** 整体不透明度，默认 1 */
  opacity?: number;
  /** 内边距（px），默认 24 */
  padding?: number;
  /** 公式字体大小（px），默认 32 */
  formulaSize?: number;
  /** 正文字体大小（px），默认 22 */
  contentSize?: number;
}
```

### 类型默认标签映射

```typescript
const THEOREM_LABELS: Record<TheoremType, string> = {
  theorem:    "定理",
  definition: "定义",
  corollary:  "推论",
  formula:    "公式",
  example:    "例",
  note:       "注",
};

const THEOREM_COLORS: Record<TheoremType, string> = {
  theorem:    "#61dafb",
  definition: "#ff79c6",
  corollary:  "#a9dc76",
  formula:    "#ffd700",
  example:    "#78dce8",
  note:       "#888888",
};
```

### 使用示例

```jsx
// 格林公式定理框
<TheoremBox
  type="theorem"
  label="定理 11.3"
  name="格林公式"
  content="设闭区域 D 由分段光滑的曲线 L 围成，函数 P(x,y)、Q(x,y) 在 D 上有连续偏导数，则"
  formula="\oint_L P\,dx + Q\,dy = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) d\sigma"
  remark="其中 L 取正方向（区域 D 始终在前进方向的左侧）。"
  width={800}
  x={960}
  y={180}
  enterProgress={boxProgress}
/>

// 定义框（偏导数）
<TheoremBox
  type="definition"
  name="偏导数"
  formula="\frac{\partial f}{\partial x}\bigg|_{(x_0,y_0)} = \lim_{\Delta x \to 0} \frac{f(x_0+\Delta x, y_0) - f(x_0,y_0)}{\Delta x}"
  enterProgress={1}
/>

// 例题框
<TheoremBox
  type="example"
  label="例 7.4.1"
  content="求方程 dy/dx + y/x = x² 的通解。"
  opacity={0.9}
/>
```

### 视觉结构

```
┌─────────────────────────────────────────────────────┐
│ ████ [定理 11.3  格林公式]                            │  ← 类型标签 + 名称
│ ███                                                   │
│ ███  正文说明文字...                                   │  ← content
│ ███                                                   │
│ ███       ∮_L P dx + Q dy = ∬_D (∂Q/∂x-∂P/∂y) dσ  │  ← formula (居中)
│ ███                                                   │
│ ███  * 注记文字                                       │  ← remark
└─────────────────────────────────────────────────────┘
  ↑ 左侧 4px 色块边框（颜色由 type 决定）
```

---

## StepByStep

**文件**：`src/components/layout/StepByStep.tsx`
**职责**：逐步展示数学推导过程，每步包含说明文字和公式，支持高亮当前步骤、淡化已过步骤。

### Props 类型定义

```typescript
interface DerivationStep {
  /** 步骤序号（可选，若不提供则自动编号） */
  index?: number;
  /** 步骤说明文字（中文注释），例如 "两边乘以积分因子 μ(x)" */
  annotation?: string;
  /** 该步骤的核心公式（KaTeX 字符串） */
  formula: string;
  /** 公式中需高亮的子表达式（用颜色标出变化部分），KaTeX 字符串 */
  highlight?: string;
  /** 高亮颜色，默认 COLORS.highlight */
  highlightColor?: string;
  /** 该步骤入场动画持续帧数，默认 20 */
  enterDuration?: number;
}

interface StepByStepProps {
  /** 推导步骤数组 */
  steps: DerivationStep[];
  /**
   * 当前激活到第几步（0-based）
   * 由外层 Composition 通过帧计算传入
   * 值为 n 时显示 steps[0..n]
   */
  currentStep: number;
  /** 步骤间的垂直间距（px），默认 64 */
  stepSpacing?: number;
  /** 已完成步骤的不透明度（变暗表示"已过"），默认 0.45 */
  pastOpacity?: number;
  /** 当前步骤的比例缩放，默认 1.0（不缩放） */
  activeScale?: number;
  /** 当前步骤的高亮背景色（半透明），默认 "rgba(97,218,251,0.08)" */
  activeBg?: string;
  /** 组件左上角 x 坐标（px） */
  x?: number;
  /** 组件左上角 y 坐标（px） */
  y?: number;
  /** 容器最大宽度（px），默认 800 */
  maxWidth?: number;
  /** 公式字体大小（px），默认 30 */
  formulaSize?: number;
  /** 说明文字字体大小（px），默认 20 */
  annotationSize?: number;
  /** 是否显示步骤编号，默认 true */
  showIndex?: boolean;
}
```

### 使用示例

```jsx
// 一阶线性方程推导（Ch07 Sec04）
const STEPS: DerivationStep[] = [
  {
    annotation: "原方程（标准形式）",
    formula: "\\frac{dy}{dx} + P(x)y = Q(x)",
  },
  {
    annotation: "两边乘以积分因子 μ(x) = e^{∫P dx}",
    formula: "e^{\\int P\\,dx}\\frac{dy}{dx} + P(x)e^{\\int P\\,dx}y = Q(x)e^{\\int P\\,dx}",
    highlight: "e^{\\int P\\,dx}",
    highlightColor: COLORS.highlight,
  },
  {
    annotation: "左边恰好是乘积的导数",
    formula: "\\frac{d}{dx}\\left[e^{\\int P\\,dx} \\cdot y\\right] = Q(x)e^{\\int P\\,dx}",
  },
  {
    annotation: "两边积分",
    formula: "e^{\\int P\\,dx} \\cdot y = \\int Q(x)e^{\\int P\\,dx}\\,dx + C",
  },
  {
    annotation: "除以积分因子，得通解",
    formula: "y = e^{-\\int P\\,dx}\\left[\\int Q(x)e^{\\int P\\,dx}\\,dx + C\\right]",
  },
];

// 在 Composition 中计算 currentStep
const frame = useCurrentFrame();
const currentStep = Math.floor(
  interpolate(frame, [210, 360], [0, STEPS.length - 1], {
    extrapolateRight: "clamp",
  })
);

<StepByStep
  steps={STEPS}
  currentStep={currentStep}
  x={160}
  y={100}
  maxWidth={760}
  stepSpacing={72}
  pastOpacity={0.4}
/>
```

### 动画行为说明

```
currentStep = 0：仅显示 steps[0]，带入场动画
currentStep = 1：steps[0] 变暗（opacity=pastOpacity），steps[1] 以入场动画显示
currentStep = n：steps[0..n-1] 变暗，steps[n] 高亮显示（activeBg 背景色）
```

每步的入场动画通过 `enterDuration` 控制，过渡为从下方上移 + 淡入（`translateY: 20px → 0, opacity: 0 → 1`）。
