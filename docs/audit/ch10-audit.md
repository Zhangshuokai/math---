# 第十章审计：重积分（Ch10_MultipleIntegral）

> 审计时间：2026-04-13 | 共 8 个 Composition | 总帧数：4,950 | 总时长：165.0s（≈2.8min）

---

## Composition 详细表

| 文件路径 | Composition ID | 当前帧数 | 当前时长(秒) | 代码行数 | 场景数 | 3D组件 | 内容类型 |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| `Ch10_MultipleIntegral/index.tsx` | `Ch10-Index` | 150 | 5.0 | ~60 | — | ❌ | 章节索引 |
| `Ch10_MultipleIntegral/Sec01_Concept.tsx` | `Ch10-Sec01-Concept` | 480 | 16.0 | 232 | 5 | ❌ | Concept |
| `Ch10_MultipleIntegral/Sec02_Calc2D.tsx` | `Ch10-Sec02-Calc2D` | 600 | 20.0 | 311 | 6 | ❌ | Derivation |
| `Ch10_MultipleIntegral/Sec03_Triple.tsx` | `Ch10-Sec03-Triple` | 540 | 18.0 | 482 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D | Derivation |
| `Ch10_MultipleIntegral/Sec04_Apps.tsx` | `Ch10-Sec04-Apps` | 480 | 16.0 | 177 | 5 | ❌ | Application |
| `Ch10_MultipleIntegral/Sec05_Examples.tsx` | `Ch10-Sec05-Examples` | 1620 | 54.0 | 740 | 6×3 | ✅ CoordinateSystem3D, SurfaceMesh3D, AnimatedVector3D | Example |
| `Ch10_MultipleIntegral/Sec06_IM_Mass.tsx` | `Ch10-IM01-Mass` | 540 | 18.0 | 400 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D, AnimatedVector3D | Application |
| `Ch10_MultipleIntegral/Sec07_IM_CNC.tsx` | `Ch10-IM02-CNC` | 540 | 18.0 | 325 | 6 | ✅ CoordinateSystem3D, SurfaceMesh3D | Application |

---

## 章节统计小结

| 指标 | 数值 |
|---|---|
| Composition 总数 | 8 |
| 总帧数 | 4,950 |
| 总时长 | 165.0s（2分45秒） |
| 平均时长（排除Index/Examples） | 18.5s |
| 使用3D组件的文件数 | 4 / 8（50%） |
| 代码行数范围 | 60 ~ 740 行 |

---

## 异常与备注

### ⚠️ 需关注条目

- **Sec04_Apps**（**177行，480帧**）：**全项目代码行数最少的概念/应用节之一**。内容覆盖曲面面积、质心、转动惯量三项应用，仅5场景，每场景平均不足30行代码，内容高度精简。考虑到该节偏"公式汇总"性质，可接受，但建议增加至少1个3D体积/质心可视化动画（`SurfaceMesh3D`），以提升直观性。
- **Sec01_Concept**（**232行，480帧**）：代码量在概念节中属于偏少。5场景仅展示基本定义和性质，无3D可视化，缺乏曲顶柱体的空间感直觉。建议在 Scene 2（曲顶柱体）中引入 `SurfaceMesh3D`。

### ✅ 正常条目
- **Sec02_Calc2D**（600帧，311行）：累次积分+极坐标换序，6场景，额外60帧合理（极坐标换元推导较复杂）。
- **Sec03_Triple**（540帧，482行）：三重积分含柱坐标+球坐标，使用 `CoordinateSystem3D`+`SurfaceMesh3D` 展示三维坐标元素，内容密度合理。
- **Sec05_Examples**（1620帧，740行）：3道例题×540帧，含极坐标/柱坐标3D展示，内容充实。
- **Sec06_IM_Mass**（540帧，400行）：密度曲面 `z=xy` 的3D景观图，结合质心向量标注，设计完善。
- **Sec07_IM_CNC**（540帧，325行）：3D旋转体加工材料去除可视化，代码量偏少但5个 `SurfaceMesh3D` 子组件结构清晰，内容聚焦。
