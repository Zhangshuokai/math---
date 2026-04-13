# 第十一章审计：曲线积分与曲面积分（Ch11_LineAndSurface）

> 审计时间：2026-04-13 | 共 11 个 Composition | 总帧数：6,330 | 总时长：211.0s（≈3.5min）

---

## Composition 详细表

| 文件路径 | Composition ID | 当前帧数 | 当前时长(秒) | 代码行数 | 场景数 | 3D组件 | 内容类型 |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| `Ch11_LineAndSurface/index.tsx` | `Ch11-Index` | 150 | 5.0 | ~60 | — | ❌ | 章节索引 |
| `Ch11_LineAndSurface/Sec01_Line1.tsx` | `Ch11-Sec01-Line1` | 480 | 16.0 | 216 | 5 | ❌ | Concept |
| `Ch11_LineAndSurface/Sec02_Line2.tsx` | `Ch11-Sec02-Line2` | 480 | 16.0 | 263 | 5 | ❌ | Derivation |
| `Ch11_LineAndSurface/Sec03_Green.tsx` | `Ch11-Sec03-Green` | 540 | 18.0 | 240 | 6 | ❌ | Derivation |
| `Ch11_LineAndSurface/Sec04_Surface1.tsx` | `Ch11-Sec04-Surface1` | 540 | 18.0 | 461 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D | Derivation |
| `Ch11_LineAndSurface/Sec05_Surface2.tsx` | `Ch11-Sec05-Surface2` | 480 | 16.0 | 342 | 5 | ❌ (无3D import，仅文字+公式) | Derivation |
| `Ch11_LineAndSurface/Sec06_Gauss.tsx` | `Ch11-Sec06-Gauss` | 480 | 16.0 | 211 | 5 | ❌ | Derivation |
| `Ch11_LineAndSurface/Sec07_Stokes.tsx` | `Ch11-Sec07-Stokes` | 480 | 16.0 | 163 | 5 | ❌ | Derivation |
| `Ch11_LineAndSurface/Sec08_Examples.tsx` | `Ch11-Sec08-Examples` | 1620 | 54.0 | 667 | 6×3 | ✅ CoordinateSystem3D, SurfaceMesh3D, ParametricCurve3D, AnimatedVector3D | Example |
| `Ch11_LineAndSurface/Sec09_IM_Flow.tsx` | `Ch11-IM01-Flow` | 540 | 18.0 | 405 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D, ParametricCurve3D, AnimatedVector3D | Application |
| `Ch11_LineAndSurface/Sec10_IM_Field.tsx` | `Ch11-IM02-Field` | 540 | 18.0 | 392 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D, AnimatedVector3D | Application |

---

## 章节统计小结

| 指标 | 数值 |
|---|---|
| Composition 总数 | 11 |
| 总帧数 | 6,330 |
| 总时长 | 211.0s（3分31秒） |
| 平均时长（排除Index/Examples） | 17.2s |
| 使用3D组件的文件数 | 4 / 11（36%） |
| 代码行数范围 | 60 ~ 667 行 |

---

## 异常与备注

### ⚠️ 需关注条目

- **Sec07_Stokes**（**163行，480帧**）：**全项目代码量最少的概念/推导节**。5场景仅含 TitleCard + 4个公式展示，无任何图形可视化组件。Stokes 公式（曲面边界与旋度的关系）极适合3D旋转曲面+边界曲线动画，当前实现严重欠缺直观性。**强烈建议补充 `CoordinateSystem3D` + `ParametricCurve3D` 展示环量方向。**
- **Sec06_Gauss**（**211行，480帧**）：代码量偏少，5场景以公式为主，缺乏散度的流量可视化（如箭头从封闭曲面向外穿出的3D动画）。建议参考 `Sec09_IM_Flow` 的实现风格补充 `SurfaceMesh3D` + `AnimatedVector3D`。
- **Sec01_Line1**（**216行，480帧**）：第一型曲线积分弧长元素的几何直觉，当前无3D/2D曲线描绘动画，仅有公式和文字。建议加入 `ParametricCurve3D` 的 `drawProgress` 动画。
- **Sec03_Green**（240行，540帧）：Green 公式内容较多（含路径无关+全微分），但代码量较少。6场景时长勉强合理，但可视化深度不足（无2D向量场图示）。

### ✅ 正常条目
- **Sec04_Surface1**（461行，540帧，含 `T = { s1..s6 }` 精细时序）：第一型曲面积分，含3D球面旋转动画+面积拉伸颜色分布，是本章可视化最好的推导节。
- **Sec08_Examples**（1620帧，667行）：3道例题（螺旋线弧长、曲线积分做功、球面通量）均含 3D 旋转场景，质量高。
- **Sec09_IM_Flow / Sec10_IM_Field**（各540帧，405/392行）：管道流速剖面+速度向量场、球面通量3D可视化完整，设计合理。
