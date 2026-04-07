# 章节分集结构总览

> 同济高等数学第七版下册（第七章 ~ 第十二章）

---

## 目录索引

| 章节 | 文件夹名 | 文档链接 | 节数 | 预估总帧数 |
|------|----------|----------|------|-----------|
| 第七章：微分方程 | `Ch07_DifferentialEq` | [ch07-differential-equations.md](./ch07-differential-equations.md) | 8 节 | ~4800 帧 |
| 第八章：空间解析几何与向量代数 | `Ch08_VectorGeometry` | [ch08-vector-geometry.md](./ch08-vector-geometry.md) | 6 节 | ~3600 帧 |
| 第九章：多元函数微分法及其应用 | `Ch09_MultivarCalc` | [ch09-multivariable-calculus.md](./ch09-multivariable-calculus.md) | 7 节 | ~4200 帧 |
| 第十章：重积分 | `Ch10_MultipleIntegrals` | [ch10-multiple-integrals.md](./ch10-multiple-integrals.md) | 6 节 | ~3600 帧 |
| 第十一章：曲线积分与曲面积分 | `Ch11_CurveSurfaceIntegrals` | [ch11-curve-surface-integrals.md](./ch11-curve-surface-integrals.md) | 7 节 | ~4500 帧 |
| 第十二章：无穷级数 | `Ch12_InfiniteSeries` | [ch12-infinite-series.md](./ch12-infinite-series.md) | 6 节 | ~3900 帧 |

---

## 文件命名规范

### 文件夹（章）
```
Ch{两位章号}_{英文主题名}
```
示例：`Ch07_DifferentialEq`、`Ch11_CurveSurfaceIntegrals`

### 文件（节）
```
Sec{两位节号}_{英文主题名}.tsx
```
示例：`Sec01_Intro.tsx`、`Sec04_LinearFirstOrder.tsx`

### Composition ID
```
Ch{章号}_Sec{节号}_{英文主题名}
```
示例：`Ch07_Sec04_LinearFirstOrder`、`Ch12_Sec06_FourierSeries`

---

## 通用场景结构

每节视频的标准场景序列（可根据内容增减）：

```
Scene 1: TitleCard          （60 帧）   — 显示章节号+小节名
Scene 2: ConceptIntro       （90 帧）   — 引出核心概念，图文并茂
Scene 3: TheoremStatement   （60 帧）   — TheoremBox 展示定义/定理
Scene 4: Derivation         （120~180 帧）— StepByStep 推导过程
Scene 5: Visualization      （120~180 帧）— 图形/动画直观理解
Scene 6: Example            （150~240 帧）— 例题演示
Scene 7: Summary            （60 帧）   — 关键结论小结+淡出
```

---

## 各章组件使用矩阵

| 组件 | Ch07 | Ch08 | Ch09 | Ch10 | Ch11 | Ch12 |
|------|:----:|:----:|:----:|:----:|:----:|:----:|
| `TitleCard` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `TheoremBox` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `MathFormula` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `StepByStep` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `CoordinateSystem` | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `FunctionPlot` | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `IntegralArea` | — | — | — | ✓ | ✓ | — |
| `Arrow` / `Vector3D` | — | ✓ | ✓ | — | ✓ | — |
| `VectorField` | — | — | — | — | ✓ | — |
| `FourierSeries` | — | — | — | — | — | ✓ |
| `DiffEqSolution` | ✓ | — | — | — | — | — |
| `PartialDerivative` | — | — | ✓ | — | — | — |
| `SurfaceIntegral` | — | — | — | — | ✓ | — |
