# 第七章审计：微分方程（Ch07_DifferentialEq）

> 审计时间：2026-04-13 | 共 13 个 Composition | 总帧数：6,380 | 总时长：212.7s（≈3.5min）

---

## Composition 详细表

| 文件路径 | Composition ID | 当前帧数 | 当前时长(秒) | 代码行数 | 场景数 | 3D组件 | 内容类型 |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| `Ch07_DifferentialEq/index.tsx` | `Ch07-Index` | 150 | 5.0 | ~60 | — | ❌ | 章节索引 |
| `Ch07_DifferentialEq/Sec01_Intro.tsx` | `Ch07-Sec01-Intro` | 450 | 15.0 | 347 | 5 | ❌ | Concept |
| `Ch07_DifferentialEq/Sec02_Separable.tsx` | `Ch07-Sec02-Separable` | 540 | 18.0 | 425 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec03_Homogeneous.tsx` | `Ch07-Sec03-Homogeneous` | 480 | 16.0 | 349 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec04_Linear.tsx` | `Ch07-Sec04-Linear` | 540 | 18.0 | 414 | 6 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec05_Exact.tsx` | `Ch07-Sec05-Exact` | 480 | 16.0 | 446 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec06_HighOrder.tsx` | `Ch07-Sec06-HighOrder` | 480 | 16.0 | 396 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec07_Linear2.tsx` | `Ch07-Sec07-Linear2` | 480 | 16.0 | 362 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec08_ConstCoeff.tsx` | `Ch07-Sec08-ConstCoeff` | 600 | 20.0 | 411 | 6 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec09_NonHomog.tsx` | `Ch07-Sec09-NonHomog` | 480 | 16.0 | 331 | 5 | ❌ | Derivation |
| `Ch07_DifferentialEq/Sec10_Examples.tsx` | `Ch07-Sec10-Examples` | 1620 | 54.0 | 746 | 6×3 | ❌ | Example |
| `Ch07_DifferentialEq/Sec11_IM_Control.tsx` | `Ch07-IM01-Control` | 540 | 18.0 | 419 | 6 | ❌ | Application |
| `Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx` | `Ch07-IM02-Dynamics` | 540 | 18.0 | 506 | 6 | ❌ | Application |

---

## 章节统计小结

| 指标 | 数值 |
|---|---|
| Composition 总数 | 13 |
| 总帧数 | 6,380 |
| 总时长 | 212.7s（3分32秒） |
| 平均时长（排除Index/Examples） | 17.3s |
| 使用3D组件的文件数 | 0 / 13 |
| 代码行数范围 | 60 ~ 746 行 |

---

## 异常与备注

### ✅ 正常条目
- **Ch07-Index**（150帧）：章节封面，属预期设计。
- **Ch07-Sec10-Examples**（1620帧）：3道例题×540帧，内容充实（746行），结构合理。
- **Ch07-Sec08-ConstCoeff**（600帧）：因三种特征根情况内容较多，比其他推导节多60帧，合理。

### 🔍 观察点
- **整章无 3D 组件**：微分方程以符号推导为主，2D 函数图像（`CoordinateSystem`+`FunctionPlot`）足够表达，不构成缺陷。
- **Sec01_Intro 只有 450 帧**（15秒）：是本章最短的概念节，考虑到第一节仅介绍基本概念，内容不复杂，时长合理。
- **Sec09_NonHomog**（331行，480帧）：代码行数在推导节中最少，内容相对精简，时长尚可。
- **Sec11/Sec12 IM 节**（419/506行，各540帧）：IM 应用节代码量充足，帧数合理。
