# 第十一章：曲线积分与曲面积分

> 文件夹：`src/chapters/Ch11_CurveSurfaceIntegrals/`
> Composition 前缀：`Ch11_`

---

## 章节概览

本章是向量微积分的核心，涵盖格林公式、高斯公式、斯托克斯公式三大定理。动画的难点在于**三维空间中场的可视化**——向量场的流线、曲面的法向量方向、环流量与通量的物理直觉。`VectorField`、`SurfaceIntegral` 组件在本章集中使用。

---

## 分集结构

### Sec01 — 第一类曲线积分（对弧长的曲线积分）

**文件**：`Sec01_LineIntegral1.tsx`
**Composition ID**：`Ch11_Sec01_LineIntegral1`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第十一章 曲线积分与曲面积分」 | `TitleCard` |
| 物理引入 | 60–180 | 弯曲细线的质量：ρ(x,y)·ds 的求和逼近，Riemann 和动画 | `CoordinateSystem`, `FunctionPlot` |
| 计算方法 | 180–330 | 参数化曲线 x=φ(t), y=ψ(t)，ds = √(φ'²+ψ'²)dt | `StepByStep`, `MathFormula` |
| 几何示例 | 330–450 | 在圆弧上计算曲线积分，配合坐标系图示 | `CoordinateSystem`, `FunctionPlot`, `StepByStep` |
| 性质 | 450–480 | 与路径方向无关，线性性 | `TheoremBox` |
| 小结 | 480–540 | 第一类 vs 第二类的本质区别预告 | `TheoremBox` |

---

### Sec02 — 第二类曲线积分（对坐标的曲线积分）

**文件**：`Sec02_LineIntegral2.tsx`
**Composition ID**：`Ch11_Sec02_LineIntegral2`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.2 第二类曲线积分」 | `TitleCard` |
| 做功引入 | 60–180 | 变力沿曲线做功：F·dr = Pdx+Qdy，向量场+曲线+切向量动画 | `VectorField`, `CoordinateSystem`, `Arrow` |
| 方向性 | 180–270 | 积分与曲线方向有关，反向加负号图示 | `CoordinateSystem`, `Arrow` |
| 计算公式 | 270–390 | 参数化代入，化为定积分，StepByStep | `StepByStep`, `MathFormula` |
| 与第一类的联系 | 390–480 | ∫Pdx+Qdy = ∫(Pcosα+Qcosβ)ds，方向余弦 | `TheoremBox`, `MathFormula` |
| 小结 | 480–600 | 两类曲线积分计算流程对比 | `TheoremBox` |

---

### Sec03 — 格林公式

**文件**：`Sec03_GreenTheorem.tsx`
**Composition ID**：`Ch11_Sec03_GreenTheorem`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.3 格林公式」 | `TitleCard` |
| 正方向约定 | 60–150 | 区域 D 的边界正方向（内侧始终在左）图示 | `CoordinateSystem` |
| 格林公式 | 150–270 | ∮_L Pdx+Qdy = ∬_D (∂Q/∂x - ∂P/∂y)dσ，TheoremBox | `TheoremBox`, `MathFormula` |
| 证明思路 | 270–420 | 拆成两部分分别证明，矩形区域先验证 | `StepByStep` |
| 路径无关性 | 420–540 | ∂Q/∂x = ∂P/∂y ⟺ 积分与路径无关，图形展示 | `VectorField`, `CoordinateSystem` |
| 计算示例 | 540–600 | 用格林公式计算面积，∬dσ = (1/2)∮xdy-ydx | `StepByStep`, `CoordinateSystem` |
| 小结 | 600–660 | 格林公式条件与应用场景 | `TheoremBox` |

---

### Sec04 — 第一类曲面积分（对面积的曲面积分）

**文件**：`Sec04_SurfaceIntegral1.tsx`
**Composition ID**：`Ch11_Sec04_SurfaceIntegral1`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.4 第一类曲面积分」 | `TitleCard` |
| 曲面质量引入 | 60–180 | 曲面密度 ρ(x,y,z)·dS 的求和，3D 曲面分割动画 | `SurfaceIntegral` |
| 计算公式 | 180–330 | z=z(x,y)，dS = √(1+z_x²+z_y²)dxdy 推导 | `StepByStep`, `MathFormula` |
| 计算示例 | 330–450 | 半球面上计算曲面积分 | `StepByStep`, `SurfaceIntegral` |
| 小结 | 450–540 | 与曲线积分第一类的类比 | `TheoremBox` |

---

### Sec05 — 第二类曲面积分（对坐标的曲面积分）

**文件**：`Sec05_SurfaceIntegral2.tsx`
**Composition ID**：`Ch11_Sec05_SurfaceIntegral2`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.5 第二类曲面积分」 | `TitleCard` |
| 流量引入 | 60–210 | 流体速度场 v=(P,Q,R) 穿过曲面的通量，法向量+流线动画 | `SurfaceIntegral`, `VectorField` |
| 曲面侧与方向 | 210–300 | 法向量的正/负侧方向约定，封闭曲面外法线 | `SurfaceIntegral` |
| 计算化简 | 300–450 | ∬Pdydz+Qdzdx+Rdxdy，投影到坐标面计算 | `StepByStep`, `MathFormula` |
| 与第一类的关系 | 450–510 | ∬F·dS = ∬(Pcosα+Qcosβ+Rcosγ)dS | `TheoremBox` |
| 小结 | 510–600 | 方向的重要性，物理意义：通量 | `TheoremBox` |

---

### Sec06 — 高斯公式（散度定理）

**文件**：`Sec06_GaussDivergence.tsx`
**Composition ID**：`Ch11_Sec06_GaussDivergence`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.6 高斯公式（散度定理）」 | `TitleCard` |
| 高斯公式 | 60–180 | ∯_Σ Pdydz+Qdzdx+Rdxdy = ∭_Ω (P_x+Q_y+R_z)dV，TheoremBox | `TheoremBox`, `MathFormula` |
| 散度定义 | 180–300 | div F = ∂P/∂x+∂Q/∂y+∂R/∂z，源与汇的物理含义 | `VectorField`, `TheoremBox` |
| 证明思路 | 300–420 | 以 ∭∂R/∂z dV = ∯Rdxdy 为例推导 | `StepByStep` |
| 向量场可视化 | 420–540 | 高散度（源）与低散度（汇）区域的向量场对比 | `VectorField` |
| 小结 | 540–660 | 高斯公式 vs 格林公式的维度类比 | `TheoremBox` |

---

### Sec07 — 斯托克斯公式

**文件**：`Sec07_StokesTheorem.tsx`
**Composition ID**：`Ch11_Sec07_StokesTheorem`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「11.7 斯托克斯公式」 | `TitleCard` |
| 斯托克斯公式 | 60–180 | ∮_Γ Pdx+Qdy+Rdz = ∬_Σ curl F·dS，TheoremBox | `TheoremBox`, `MathFormula` |
| 旋度定义 | 180–300 | curl F = ∇×F，3×3 行列式形式，旋转方向可视化 | `VectorField`, `MathFormula` |
| 右手定则 | 300–390 | 曲面 Σ 的边界 Γ 方向与曲面法向量的右手关系 | `SurfaceIntegral`, `Vector3D` |
| 证明思路 | 390–510 | 利用格林公式在 xy 平面投影证明 R 分量 | `StepByStep` |
| 三大公式统一 | 510–600 | 格林→斯托克斯→高斯：维度提升的统一视角 | `TheoremBox` |
| 小结 | 600–660 | 三大积分定理关系图，微积分基本定理的推广 | `TheoremBox` |
