# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 编码关键规则（非显然，必须遵守）

### KaTeX 禁止 useEffect
Remotion 按帧服务端渲染，`useEffect` 不执行。所有公式必须用 [`MathFormula`](../../src/components/math/MathFormula.tsx)：
```tsx
<MathFormula latex="\int_a^b f(x)\,dx" fontSize={48} color={COLORS.formula} />
```
直接在组件里调用 `katex.renderToString()` + `dangerouslySetInnerHTML` 也可，但不要用 `useEffect`。

### withWatermark 必须在模块顶层创建
```ts
// ✅ 正确：模块顶层
const WMyComp = withWatermark(MyComp);

// ❌ 错误：JSX 内 inline 会导致每帧重新创建，引起闪烁/性能问题
<Composition component={withWatermark(MyComp)} ... />
```

### Composition ID 格式（连字符，非下划线）
```
Ch07-Sec01-Intro   ✅
Ch07_Sec01_Intro   ❌（文件名格式，不是 Composition ID）
```

### 颜色与配置必须从常量读取
```ts
import { COLORS } from '../../constants/colorTheme';         // 所有颜色
import { VIDEO_CONFIG } from '../../constants/videoConfig';  // fps/width/height
// 不得硬编码 "#1a1a2e"、1920、1080、30 等值
```

### 场景帧驱动模式
```ts
const frame = useCurrentFrame();
const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 270 ? 3 : 4;
// 使用条件渲染，不要用 CSS visibility/display 切换场景
{scene === 1 && <TitleCard ... />}
```

### fade() 函数两种等效写法
```ts
// 从 animationUtils 导入（推荐复用）
import { fade } from '../../utils/animationUtils';

// 或在文件内局部定义（现有文件常见模式，也可接受）
const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
```

## 新节完整注册流程

① 创建文件：`src/compositions/Ch{XX}_{Name}/Sec{YY}_{Name}.tsx`
② [`Root.tsx`](../../src/Root.tsx) 顶部 import 组件
③ 模块顶层：`const WXxx = withWatermark(Xxx);`
④ 对应 `<Folder>` 内添加：
```tsx
<Composition
  id="Ch{XX}-Sec{YY}-{Name}"
  component={WXxx}
  durationInFrames={N}
  fps={VIDEO_CONFIG.fps}
  width={VIDEO_CONFIG.width}
  height={VIDEO_CONFIG.height}
/>
```

## 可用 UI 组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `TitleCard` | `components/ui/TitleCard.tsx` | Scene 1 标题卡 |
| `TheoremBox` | `components/ui/TheoremBox.tsx` | 定义/定理框 |
| `StepByStep` | `components/ui/StepByStep.tsx` | 推导步骤列表 |
| `ExampleBox` | `components/ui/ExampleBox.tsx` | 例题框 |
| `SolutionSteps` | `components/ui/SolutionSteps.tsx` | 解题步骤 |
| `MathFormula` | `components/math/MathFormula.tsx` | KaTeX 公式渲染 |
| `CoordinateSystem` | `components/math/CoordinateSystem.tsx` | 2D 坐标系 |
| `CoordinateSystem3D` | `components/math/CoordinateSystem3D.tsx` | 3D 坐标系 |
| `FunctionPlot` | `components/math/FunctionPlot.tsx` | 函数曲线 |
| `IntegralArea` | `components/math/IntegralArea.tsx` | 积分区域 |
| `VectorField` | `components/math/VectorField.tsx` | 向量场 |
| `SurfaceMesh3D` | `components/math/SurfaceMesh3D.tsx` | 3D 曲面网格 |

## 标准场景时序参考

```
Scene 1: TitleCard          0–60帧     60帧
Scene 2: ConceptIntro       60–150帧   90帧
Scene 3: TheoremStatement   150–210帧  60帧
Scene 4: Derivation         210–390帧  120~180帧
Scene 5: Visualization      390–570帧  120~180帧
Scene 6: Example            570–780帧  150~240帧
Scene 7: Summary            780–840帧  60帧
```

## 各章教学内容（同济高等数学下册）

### 第七章：微分方程（Ch07_DifferentialEq）
- Sec01_Intro: 微分方程基本概念、阶、解、通解/特解
- Sec02_Separable: 可分离变量方程 `M(x)dx + N(y)dy = 0`
- Sec03_Homogeneous: 齐次方程，令 `u = y/x` 换元
- Sec04_Linear: 一阶线性方程，积分因子法 `e^{∫P(x)dx}`
- Sec05_Exact: 全微分方程，势函数 `u(x,y)`
- Sec06_HighOrder: 可降阶高阶方程（`y^(n)=f(x)`、缺y型、缺x型）
- Sec07_Linear2: 高阶线性方程，Wronskian 行列式，叠加原理
- Sec08_ConstCoeff: 常系数齐次，特征方程三种根（实/重/复）
- Sec09_NonHomog: 常系数非齐次，待定系数法，参数变易法

### 第八章：空间解析几何与向量代数（Ch08_VectorGeometry）
- Sec01_Vectors: 向量加减、数乘、模、方向余弦
- Sec02_Products: 点积（夹角、投影）、叉积（行列式、面积）
- Sec03_Surfaces: 球面、旋转曲面、柱面方程
- Sec04_Curves: 空间曲线参数方程、螺旋线、投影
- Sec05_Plane: 平面点法式、一般式、截距式、点面距
- Sec06_Line: 空间直线对称式/参数式、线线/线面角

### 第九章：多元函数微分法（Ch09_MultiVariable）
- Sec01_Concept: 多元函数定义域、极限（路径无关性）、连续
- Sec02_Partial: 偏导数几何意义（截面切线），高阶偏导
- Sec03_Total: 全微分，近似计算公式 `dz = f_x dx + f_y dy`
- Sec04_Chain: 链式法则（树状图）
- Sec05_Implicit: 隐函数求导公式 `∂F/∂x / ∂F/∂z`
- Sec06_Geometry: 曲面切平面与法线
- Sec07_Gradient: 方向导数，梯度，梯度方向最大增长率
- Sec08_Extremum: 极值、最值、拉格朗日乘数法

### 第十章：重积分（Ch10_MultipleIntegral）
- Sec01_Concept: 二重积分定义、几何意义（体积）
- Sec02_Calc2D: 直角/极坐标下二重积分计算
- Sec03_Triple: 三重积分、柱坐标、球坐标
- Sec04_Apps: 重积分应用（面积、体积、质心、转动惯量）

### 第十一章：曲线积分与曲面积分（Ch11_LineAndSurface）
- Sec01_Line1: 第一型曲线积分（弧长元素 `ds`）
- Sec02_Line2: 第二型曲线积分（力做功，`P dx + Q dy`）
- Sec03_Green: Green 公式，单连通区域，路径无关条件
- Sec04_Surface1: 第一型曲面积分（面积元素 `dS`）
- Sec05_Surface2: 第二型曲面积分（流量，`P dydz + Q dzdx + R dxdy`）
- Sec06_Gauss: Gauss 散度定理，闭合曲面
- Sec07_Stokes: Stokes 公式，环量与旋度

### 第十二章：无穷级数（Ch12_Series）
- Sec01_Concept: 级数收敛定义、必要条件、调和级数
- Sec02_Tests: 正项级数审敛法（比较、比值、根值、积分）
- Sec03_Power: 幂级数、收敛半径、Abel 定理
- Sec04_Taylor: Taylor/Maclaurin 展开，常用展开式
- Sec05_Apps: 级数应用（近似计算、微分方程求解）
- Sec06_Fourier: Fourier 级数，Dirichlet 定理
- Sec07_Fourier2: Fourier 正弦/余弦级数，奇偶延拓

## 例题开发规范

### 优先创建三维图形
例题涉及**空间 / 曲面 / 向量**内容时，必须优先使用 3D 组件，不得用 2D 近似替代：

| 场景 | 推荐组件 | 路径 |
|------|----------|------|
| 空间坐标系、轴标注 | `CoordinateSystem3D` | `components/math/CoordinateSystem3D.tsx` |
| 曲面（球面、抛物面等） | `SurfaceMesh3D` | `components/math/SurfaceMesh3D.tsx` |
| 空间参数曲线、螺旋线 | `ParametricCurve3D` | `components/math/ParametricCurve3D.tsx` |
| 空间向量、法向量、梯度 | `AnimatedVector3D` | `components/math/AnimatedVector3D.tsx` |
| 平面方程可视化 | `Plane3D` | `components/math/Plane3D.tsx` |

仅当例题纯粹涉及平面（xy 平面内的曲线积分、2D 向量场等）时，才使用 2D 组件。

### 3D 图形必须有旋转动画
所有 3D 场景必须由 `useCurrentFrame()` 驱动旋转角度，让观看者从多个视角理解空间关系。
**禁止**使用 CSS `animation`、`transition` 或 `setTimeout`。

```ts
const frame = useCurrentFrame();

// 完整一圈旋转（适合总览性展示）
const rotateY = interpolate(
  frame,
  [sceneStart, sceneStart + sceneDuration],
  [0, 360],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

// 小幅摇摆（适合局部细节展示）
const rotateY = interpolate(
  frame,
  [sceneStart, sceneStart + sceneDuration],
  [-30, 30],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

// 传入 3D 组件
<CoordinateSystem3D rotationY={rotateY} ... />
<SurfaceMesh3D rotationY={rotateY} ... />
<ParametricCurve3D rotationY={rotateY} ... />
```

### 每个例题独立文件
每道例题创建单独的 `.tsx` 文件（如 `Sec10_Examples.tsx` 或按例题编号 `Ex01_SphereSurface.tsx`），文件内必须包含：

1. **分步解题展示**：使用 [`StepByStep`](../../src/components/ui/StepByStep.tsx) 或 [`SolutionSteps`](../../src/components/ui/SolutionSteps.tsx) 组件，每个步骤对应一段帧区间，随帧逐步显示。
2. **步骤同步图形**：每个解题步骤的关键变化对应动画进度（用 `fade()` 或 `interpolate()` 控制透明度/位置）。
3. **3D 旋转场景**：若例题涉及空间图形，在最终可视化场景中附加旋转展示（建议 60～120 帧完成一次旋转或摇摆）。

```tsx
// 例题文件结构示例（以曲面积分例题为例）
export const ExSphereSurface: React.FC = () => {
  const frame = useCurrentFrame();

  // 场景时序定义
  const S1_END = 60;   // 题目展示
  const S2_END = 150;  // 步骤1：参数化曲面
  const S3_END = 270;  // 步骤2：建立积分
  const S4_END = 420;  // 步骤3：计算结果
  const S5_END = 540;  // 3D旋转展示

  const scene = frame < S1_END ? 1
    : frame < S2_END ? 2
    : frame < S3_END ? 3
    : frame < S4_END ? 4
    : 5;

  // Scene 5 旋转动画（帧驱动，不能用 CSS animation）
  const rotateY = interpolate(frame, [S4_END, S5_END], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {scene === 1 && <ExampleBox title="例题" ... />}
      {scene === 2 && <StepByStep steps={[step1]} ... />}
      {scene === 3 && <StepByStep steps={[step1, step2]} ... />}
      {scene === 4 && <SolutionSteps ... />}
      {scene === 5 && <SurfaceMesh3D rotationY={rotateY} ... />}
    </AbsoluteFill>
  );
};
```

### 例题讲解预设阶段（详解型，共 540 帧 / 18秒）

| Stage | 帧范围 | 帧数 | 时长 | 内容 |
|-------|--------|------|------|------|
| Stage 1: 展示题目 | 0–60 | 60帧 | 2s | ExampleBox 展示完整题目，淡入 |
| Stage 2: 审题分析 | 60–150 | 90帧 | 3s | 文字拆解已知条件、求解目标、分析思路 |
| Stage 3: 分步计算+配图 | 150–330 | 180帧 | 6s | StepByStep 逐步推导，每步配同步图形 |
| Stage 4: 关键结论 | 330–390 | 60帧 | 2s | TheoremBox 高亮最终公式/答案 |
| Stage 5: 3D可视化+旋转 | 390–480 | 90帧 | 3s | 3D 旋转展示空间关系（rotateY 0→360 或摇摆 ±30°） |
| Stage 6: 总结 | 480–540 | 60帧 | 2s | 关键点回顾，淡出 |

帧边界常量建议（可在文件内局部定义）：
```ts
const T = { s1: 0, s2: 60, s3: 150, s4: 330, s5: 390, s6: 480, end: 540 };
```

场景判断：
```ts
const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;
```

**注意**：
- Stage 3（分步计算）共 180 帧，建议每个计算步骤约 45 帧（最多 4 步）
- Stage 5（3D可视化）若题目无空间图形，可省略，将帧数并入 Stage 3（总帧数变为 450 帧）
- `durationInFrames` 默认用 540，无 3D 场景的题目用 450

### 禁止的模式

```ts
// ❌ 禁止：CSS 动画驱动旋转
<div style={{ animation: 'spin 3s linear infinite' }}>

// ❌ 禁止：setTimeout 控制动画
setTimeout(() => setRotation(rotation + 1), 33);

// ❌ 禁止：空间图形使用 2D 组件替代
// （如用 CoordinateSystem 画球面截面替代 SurfaceMesh3D）

// ✅ 正确：useCurrentFrame() 驱动一切动画
const frame = useCurrentFrame();
const rotateY = interpolate(frame, [420, 540], [0, 360], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
```
