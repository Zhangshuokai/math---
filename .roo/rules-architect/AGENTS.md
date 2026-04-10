# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 架构约束（非显然，必须遵守）

### Remotion 按帧渲染限制
- **禁止 useEffect / useLayoutEffect**：Remotion 服务端渲染不执行生命周期副作用，动画必须全部通过 `useCurrentFrame()` + `interpolate()` 计算
- **禁止异步数据获取**：所有数据必须在渲染时同步可用，不能在组件内 fetch
- **KaTeX 必须同步渲染**：`katex.renderToString()` → `dangerouslySetInnerHTML`，见 [`MathFormula`](../../src/components/math/MathFormula.tsx)

### Composition 注册架构（Root.tsx 三步法）
新增任何节的完整路径：
1. 创建 `src/compositions/Ch{XX}_{Name}/Sec{YY}_{Name}.tsx`
2. 在 [`Root.tsx`](../../src/Root.tsx) 模块**顶层**创建 `const WXxx = withWatermark(Xxx)` — 不能放在 JSX 内，否则每帧重新创建导致闪烁
3. 在对应 `<Folder>` 内注册 `<Composition id="Ch{XX}-Sec{YY}-{Name}" .../>`

### 命名系统双轨制
| 位置 | 分隔符 | 示例 |
|------|--------|------|
| 文件夹/文件名 | 下划线 `_` | `Ch07_DifferentialEq/Sec04_Linear.tsx` |
| Composition ID | 连字符 `-` | `Ch07-Sec04-Linear` |

混淆会导致 Remotion Studio 找不到 Composition。

### 章节目录结构约定
每章包含：
- `index.tsx`：章节目录索引（仅展示章节列表，独立注册为 `Ch{XX}-Index`）
- `Sec{YY}_{Name}.tsx`：各节动画内容
- 不使用 barrel 导出（无 `index.ts` 汇总导出），Root.tsx 直接 import 各个文件

### 配置常量强制读取来源
```ts
VIDEO_CONFIG.fps / .width / .height  // src/constants/videoConfig.ts
ANIMATION_TIMING.title/intro/...     // src/constants/videoConfig.ts（60/90/120/150/60帧）
COLORS.*                              // src/constants/colorTheme.ts
```
任何硬编码数字（1920、1080、30、`#1a1a2e`）均视为违规。

## 标准场景时序架构

```
Scene 1: TitleCard       0–60      60帧
Scene 2: ConceptIntro    60–150    90帧
Scene 3: TheoremBox      150–210   60帧
Scene 4: Derivation      210–390   120~180帧
Scene 5: Visualization   390–570   120~180帧
Scene 6: Example         570–780   150~240帧
Scene 7: Summary         780–840   60帧
```
短节（仅讲概念）可裁剪为 300 帧（10s），长节（含例题）通常 480–600 帧。

## 可用可复用工具层

| 层次 | 工具 | 路径 |
|------|------|------|
| 动画 | `fade`, `lerp`, `springFade`, `isVisible`, `stepOpacity` | [`src/utils/animationUtils.ts`](../../src/utils/animationUtils.ts) |
| 数学路径 | `generateFunctionPath`, `generateIntegralPath`, `linspace` | [`src/utils/mathUtils.ts`](../../src/utils/mathUtils.ts) |
| 坐标变换 | `useCoordinateTransform` | [`src/hooks/useCoordinateTransform.ts`](../../src/hooks/useCoordinateTransform.ts) |
| 例题时序 | `useExampleTimeline` | [`src/hooks/useExampleTimeline.ts`](../../src/hooks/useExampleTimeline.ts) |

## 教学内容架构（同济高等数学下册）

项目覆盖第七章～第十二章，共 41 节约 17,940 帧：

| 章 | 文件夹 | 节数 | 总帧数 |
|----|--------|------|--------|
| 7 微分方程 | `Ch07_DifferentialEq` | 9节 | 3,810 |
| 8 向量与解析几何 | `Ch08_VectorGeometry` | 6节 | 2,550 |
| 9 多元函数微分法 | `Ch09_MultiVariable` | 8节 | 3,060 |
| 10 重积分 | `Ch10_MultipleIntegral` | 4节 | 2,040 |
| 11 曲线/曲面积分 | `Ch11_LineAndSurface` | 7节 | 3,060 |
| 12 无穷级数 | `Ch12_Series` | 7节 | 3,420 |
