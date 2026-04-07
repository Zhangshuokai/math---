# 第十章：重积分

> 文件夹：`src/chapters/Ch10_MultipleIntegrals/`
> Composition 前缀：`Ch10_`

---

## 章节概览

重积分是多元积分的核心内容，动画重点在于**积分区域的分割可视化**（Riemann 和逼近）和**坐标系转换的几何直觉**（极坐标/柱坐标/球坐标）。`IntegralArea` 组件在本章扩展为二维/三维版本，积分次序对换的动画是教学难点。

---

## 分集结构

### Sec01 — 二重积分的概念与性质

**文件**：`Sec01_DoubleIntegralConcept.tsx`
**Composition ID**：`Ch10_Sec01_DoubleIntegralConcept`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第十章 重积分」 | `TitleCard` |
| 曲顶柱体 | 60–210 | z=f(x,y) 曲面在区域 D 上围成的曲顶柱体 3D 动画 | `CoordinateSystem`, `PartialDerivative` |
| Riemann 和 | 210–360 | 将 D 分成小矩形，小柱体体积求和逼近过程（n 从 4 增大到 64） | `IntegralArea`, `MathFormula` |
| 性质 | 360–480 | 线性性、比较定理、估值定理动画 | `TheoremBox` |
| 小结 | 480–540 | 二重积分符号 ∬_D f(x,y)dσ 的含义 | `MathFormula` |

---

### Sec02 — 直角坐标系下的二重积分

**文件**：`Sec02_CartesianDouble.tsx`
**Composition ID**：`Ch10_Sec02_CartesianDouble`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「10.2 直角坐标系下的二重积分计算」 | `TitleCard` |
| 化为累次积分 | 60–210 | X 型区域：先对 y 积分（竖条），再对 x 积分，动画展示"切片扫描" | `CoordinateSystem`, `IntegralArea` |
| Y 型区域 | 210–330 | Y 型区域：先 x 后 y 的切片方式 | `CoordinateSystem`, `IntegralArea` |
| 积分次序变换 | 330–510 | 同一区域在 X 型和 Y 型下互换积分次序的图示与推导 | `CoordinateSystem`, `StepByStep` |
| 计算示例 | 510–600 | ∬_D xy dσ 全程计算，StepByStep 配合区域图 | `StepByStep`, `CoordinateSystem` |
| 小结 | 600–660 | 积分区域判型流程 | `TheoremBox` |

---

### Sec03 — 极坐标系下的二重积分

**文件**：`Sec03_PolarDouble.tsx`
**Composition ID**：`Ch10_Sec03_PolarDouble`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「10.3 极坐标系下的二重积分」 | `TitleCard` |
| 极坐标面积元素 | 60–210 | dσ = r·dr·dθ 的扇形推导，与直角坐标 dxdy 对比 | `CoordinateSystem`, `MathFormula` |
| 换元公式 | 210–300 | x=rcosθ, y=rsinθ，Jacobi 行列式 r | `TheoremBox`, `StepByStep` |
| 圆形区域计算 | 300–450 | x²+y²≤R² 上的积分，极坐标大幅简化演示 | `CoordinateSystem`, `IntegralArea`, `StepByStep` |
| 高斯积分 | 450–540 | ∫_{-∞}^{∞} e^{-x²}dx = √π 的推导（平方法+极坐标） | `StepByStep`, `MathFormula` |
| 小结 | 540–600 | 适用极坐标的区域特征：圆、扇形、含 x²+y² | `TheoremBox` |

---

### Sec04 — 三重积分的概念

**文件**：`Sec04_TripleIntegralConcept.tsx`
**Composition ID**：`Ch10_Sec04_TripleIntegralConcept`
**时长**：480 帧（16 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「10.4 三重积分」 | `TitleCard` |
| 物理背景 | 60–180 | 密度函数 ρ(x,y,z) 积分求总质量，三维空间中的 Riemann 和 | `MathFormula`, `TheoremBox` |
| 概念定义 | 180–300 | 三重积分 ∭_Ω f dV 的定义，与二重积分类比 | `TheoremBox`, `MathFormula` |
| 化为累次积分（投影法） | 300–420 | 先对 z 积分（铅直柱体），投影到 xy 平面 | `CoordinateSystem`, `StepByStep` |
| 小结 | 420–480 | 三重积分的几何/物理意义 | `TheoremBox` |

---

### Sec05 — 直角坐标系下的三重积分

**文件**：`Sec05_CartesianTriple.tsx`
**Composition ID**：`Ch10_Sec05_CartesianTriple`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「10.5 直角坐标下三重积分的计算」 | `TitleCard` |
| 投影法 | 60–210 | Ω 投影到 D，再竖直分层：∬_D [∫_{z1}^{z2} f dz] dσ | `CoordinateSystem`, `StepByStep` |
| 截面法 | 210–360 | 用平行 xOy 平面截 Ω，截面面积 A(z)，∫A(z)dz | `StepByStep`, `MathFormula` |
| 计算示例 | 360–480 | 计算四面体 Ω 上的三重积分，全程推导 | `StepByStep` |
| 小结 | 480–540 | 投影法 vs 截面法的选取策略 | `TheoremBox` |

---

### Sec06 — 柱面坐标与球面坐标

**文件**：`Sec06_CylindricalSpherical.tsx`
**Composition ID**：`Ch10_Sec06_CylindricalSpherical`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「10.6 柱面坐标与球面坐标」 | `TitleCard` |
| 柱面坐标定义 | 60–180 | (r,θ,z) 坐标系 3D 动画，柱坐标网格可视化 | `CoordinateSystem3D`, `MathFormula` |
| 柱坐标体积元素 | 180–270 | dV = r·dr·dθ·dz 的推导，小体积元素动态展示 | `StepByStep`, `MathFormula` |
| 球面坐标定义 | 270–390 | (ρ,φ,θ) 坐标系，球坐标网格 3D 可视化 | `CoordinateSystem3D`, `MathFormula` |
| 球坐标体积元素 | 390–480 | dV = ρ²sinφ·dρ·dφ·dθ 推导 | `StepByStep`, `MathFormula` |
| 球体积验证 | 480–570 | 积分 ∭ dV = 4/3πR³，坐标系下轻松推导 | `StepByStep` |
| 小结 | 570–660 | 三种坐标系选择策略：区域形状决定坐标系 | `TheoremBox` |
