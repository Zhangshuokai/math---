# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 项目概述

同济高等数学第七版**下册**动画教学项目（第七章～第十二章），基于 **Remotion 4.0.230** + React + TypeScript + KaTeX 构建。

## 命令

```bash
npm start         # 启动 Remotion Studio 预览（开发）
npm run build     # 渲染导出视频（npx remotion render）
npm run upgrade   # 升级 Remotion 版本
```

> 无测试框架，无 lint 脚本。

## 视频规格

- 分辨率：1920×1080，帧率：30fps
- 常量统一从 [`VIDEO_CONFIG`](src/constants/videoConfig.ts) 读取
- 所有颜色从 [`COLORS`](src/constants/colorTheme.ts) 读取（背景色 `#1a1a2e`，主色 `#61dafb`）

## 文件命名规范（必须严格遵守）

| 层级 | 格式 | 示例 |
|------|------|------|
| 文件夹（章） | `Ch{两位章号}_{英文主题}` | `Ch07_DifferentialEq` |
| 文件（节） | `Sec{两位节号}_{英文主题}.tsx` | `Sec04_Linear.tsx` |
| Composition ID | `Ch{章}-Sec{节}-{主题}` | `Ch07-Sec04-Linear` |

**注意**：Composition ID 用**连字符**（`-`），文件夹/文件名用**下划线**（`_`）。

## 关键非显然模式

### 1. KaTeX 公式渲染（必须同步渲染）
Remotion 服务端按帧渲染，**禁止**用 `useEffect` 渲染 KaTeX。必须用 `katex.renderToString()` + `dangerouslySetInnerHTML`。组件：[`MathFormula`](src/components/math/MathFormula.tsx)。

### 2. Watermark HOC（所有 Composition 必须包裹）
新增节组件时，必须在 [`Root.tsx`](src/Root.tsx) **模块顶层**预创建带水印的变体：
```ts
const WNewComp = withWatermark(NewComp);  // 顶层，不能在 JSX 内 inline
```
然后在 `<Composition component={WNewComp} .../>` 中使用。

### 3. 场景切换模式（帧驱动）
每节通过 `frame` 范围判断当前场景，条件渲染不同内容：
```ts
const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 270 ? 3 : 4;
{scene === 1 && <TitleCard ... />}
{scene === 2 && <div>...</div>}
```
局部 `fade()` 函数通常直接定义在文件中（而非导入 animationUtils），两种方式均可。

### 4. 新节注册到 Root.tsx 的完整流程
① 创建 `src/compositions/Ch{XX}_{Name}/Sec{YY}_{Name}.tsx`
② 在 [`Root.tsx`](src/Root.tsx) 顶部 import
③ 顶层创建 `const WXxx = withWatermark(Xxx)`
④ 在对应 `<Folder>` 内添加 `<Composition id="Ch{XX}-Sec{YY}-{Name}" component={WXxx} durationInFrames={N} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />`

## 教学内容结构（同济高等数学下册）

| 章节 | 文件夹 | 节数 |
|------|--------|------|
| 第七章：微分方程 | `Ch07_DifferentialEq` | 9节 |
| 第八章：空间解析几何与向量代数 | `Ch08_VectorGeometry` | 6节 |
| 第九章：多元函数微分法及其应用 | `Ch09_MultiVariable` | 8节 |
| 第十章：重积分 | `Ch10_MultipleIntegral` | 4节 |
| 第十一章：曲线积分与曲面积分 | `Ch11_LineAndSurface` | 7节 |
| 第十二章：无穷级数 | `Ch12_Series` | 7节 |

## 标准场景时序

```
Scene 1: TitleCard          60帧  — TitleCard 组件
Scene 2: ConceptIntro       90帧  — 引出核心概念
Scene 3: TheoremStatement   60帧  — TheoremBox 展示定义/定理
Scene 4: Derivation      120~180帧 — StepByStep 推导
Scene 5: Visualization   120~180帧 — 图形/动画
Scene 6: Example         150~240帧 — 例题演示
Scene 7: Summary            60帧  — 小结淡出
```

## 例题创建规范

### 优先创建三维图形
例题涉及**空间 / 曲面 / 向量**内容时，必须优先使用 3D 组件，不得用 2D 近似替代：

| 场景 | 推荐组件 |
|------|----------|
| 空间坐标系、轴标注 | `CoordinateSystem3D` |
| 曲面（球面、抛物面等） | `SurfaceMesh3D` |
| 空间参数曲线、螺旋线 | `ParametricCurve3D` |
| 空间向量、法向量、梯度 | `AnimatedVector3D` |
| 平面方程可视化 | `Plane3D` |

仅当例题纯粹涉及平面（xy 平面内的曲线积分、2D 向量场等）时，才使用 2D 组件。

### 3D 图形必须有旋转动画
所有 3D 场景必须由 `useCurrentFrame()` 驱动旋转角度，让观看者从多个视角理解空间关系。
**禁止**使用 CSS `animation`、`transition` 或 `setTimeout`。

```ts
const frame = useCurrentFrame();
const rotateY = interpolate(
  frame,
  [sceneStart, sceneStart + sceneDuration],
  [0, 360],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
// 传入组件
<CoordinateSystem3D rotationY={rotateY} ... />
<SurfaceMesh3D rotationY={rotateY} ... />
```

旋转范围可视教学需要调整（如 `[−30, 30]` 小幅摇摆，或 `[0, 360]` 完整一圈）。

### 每个例题独立文件
每道例题创建单独的 `.tsx` 文件（如 `Sec10_Examples.tsx` 或按例题编号 `Ex01_SphereSurface.tsx`），文件内必须包含：

1. **分步解题展示**：使用 `StepByStep` 或 `SolutionSteps` 组件，每个步骤对应一段帧区间，随帧逐步显示。
2. **步骤同步图形**：每个解题步骤的关键变化对应动画进度（用 `fade()` 或 `interpolate()` 控制透明度/位置）。
3. **3D 旋转场景**：若例题涉及空间图形，在最终可视化场景中附加旋转展示（建议 60～120 帧完成一次旋转或摇摆）。

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

## 可复用工具

- **动画**：[`src/utils/animationUtils.ts`](src/utils/animationUtils.ts) — `fade()`, `lerp()`, `springFade()`, `isVisible()`, `stepOpacity()`
- **数学**：[`src/utils/mathUtils.ts`](src/utils/mathUtils.ts) — `generateFunctionPath()`, `generateIntegralPath()`, `linspace()`
- **例题时序 Hook**：[`src/hooks/useExampleTimeline.ts`](src/hooks/useExampleTimeline.ts)
- **坐标变换 Hook**：[`src/hooks/useCoordinateTransform.ts`](src/hooks/useCoordinateTransform.ts)
