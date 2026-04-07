# 第九章：多元函数微分法及其应用

> 文件夹：`src/chapters/Ch09_MultivarCalc/`
> Composition 前缀：`Ch09_`

---

## 章节概览

本章将一元微积分推广到多元情形，核心难点是**偏导数的几何意义**（曲面上的切线方向）和**全微分的几何直觉**（切平面近似）。动画着重通过 3D 曲面可视化帮助学生建立空间想象力，`PartialDerivative` 组件是本章的专属核心。

---

## 分集结构

### Sec01 — 多元函数的基本概念

**文件**：`Sec01_Basics.tsx`
**Composition ID**：`Ch09_Sec01_Basics`
**时长**：480 帧（16 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第九章 多元函数微分法及其应用」 | `TitleCard` |
| 二元函数定义 | 60–180 | z=f(x,y) 的定义域（平面区域）→值域，二元到三元的类比 | `CoordinateSystem`, `MathFormula`, `TheoremBox` |
| 极限与连续 | 180–330 | 二重极限沿不同路径趋近的动画（路径依赖性） | `CoordinateSystem`, `FunctionPlot` |
| 有界闭区域 | 330–420 | 区域概念：内点、边界点、开闭区域的图示 | `CoordinateSystem` |
| 小结 | 420–480 | 与一元函数对比：定义域维度提升 | `TheoremBox` |

---

### Sec02 — 偏导数

**文件**：`Sec02_PartialDerivatives.tsx`
**Composition ID**：`Ch09_Sec02_PartialDerivatives`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.2 偏导数」 | `TitleCard` |
| 偏导数定义 | 60–180 | 固定 y=y₀，z=f(x,y₀) 截面曲线，切线斜率即 f_x | `PartialDerivative`, `CoordinateSystem` |
| 几何意义 | 180–330 | 3D 曲面上，x 方向切线 vs y 方向切线动态展示 | `PartialDerivative` |
| 计算规则 | 330–450 | 视另一变量为常数，用一元微分法则求偏导 | `StepByStep`, `MathFormula` |
| 高阶偏导 | 450–570 | 混合偏导 f_xy = f_yx 的条件与计算 | `StepByStep`, `TheoremBox` |
| 小结 | 570–660 | 偏导数符号体系 ∂f/∂x，∂²f/∂x∂y | `MathFormula` |

---

### Sec03 — 全微分

**文件**：`Sec03_TotalDifferential.tsx`
**Composition ID**：`Ch09_Sec03_TotalDifferential`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.3 全微分」 | `TitleCard` |
| 全增量分解 | 60–180 | Δz = f_x·Δx + f_y·Δy + ε，几何上是切平面近似 | `PartialDerivative`, `MathFormula` |
| 全微分定义 | 180–300 | dz = (∂z/∂x)dx + (∂z/∂y)dy，TheoremBox 展示 | `TheoremBox` |
| 切平面可视化 | 300–450 | 3D 场景：曲面 + 切平面，平面近似曲面的动画 | `PartialDerivative` |
| 可微条件 | 450–540 | 偏导连续⟹可微，举反例说明反向不成立 | `TheoremBox`, `MathFormula` |
| 小结 | 540–600 | 全微分近似公式，误差分析 | `TheoremBox` |

---

### Sec04 — 多元复合函数求导（链式法则）

**文件**：`Sec04_ChainRule.tsx`
**Composition ID**：`Ch09_Sec04_ChainRule`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.4 多元复合函数的求导法则」 | `TitleCard` |
| 变量树结构 | 60–180 | 树状图：z→(u,v)→(x,y)，依赖关系可视化 | `MathFormula` |
| 链式法则公式 | 180–300 | dz/dx = (∂z/∂u)(∂u/∂x)+(∂z/∂v)(∂v/∂x)，TheoremBox | `TheoremBox` |
| 分情况推导 | 300–480 | 一个中间变量 vs 两个中间变量的情况 StepByStep | `StepByStep` |
| 应用示例 | 480–540 | 计算 z = e^(u²+v²) 的偏导数 | `StepByStep`, `MathFormula` |
| 小结 | 540–600 | 全微分形式不变性 | `TheoremBox` |

---

### Sec05 — 隐函数求导

**文件**：`Sec05_ImplicitDiff.tsx`
**Composition ID**：`Ch09_Sec05_ImplicitDiff`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.5 隐函数的求导公式」 | `TitleCard` |
| 隐函数存在定理 | 60–180 | F(x,y)=0 确定 y=f(x) 的条件，TheoremBox | `TheoremBox`, `MathFormula` |
| 一元隐函数 | 180–300 | dy/dx = -F_x/F_y，两边对 x 求导法 StepByStep | `StepByStep` |
| 二元隐函数 | 300–420 | F(x,y,z)=0 确定 z=z(x,y)，∂z/∂x = -F_x/F_z | `StepByStep`, `MathFormula` |
| 示例 | 420–480 | 球面 x²+y²+z²=1 上求偏导 | `StepByStep` |
| 小结 | 480–540 | 隐函数微分法总结 | `TheoremBox` |

---

### Sec06 — 多元函数的极值

**文件**：`Sec06_Extrema.tsx`
**Composition ID**：`Ch09_Sec06_Extrema`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.6 多元函数的极值及其求法」 | `TitleCard` |
| 极值定义 | 60–150 | 3D 曲面上，极大值（山峰）极小值（谷底）图示 | `PartialDerivative` |
| 极值必要条件 | 150–270 | f_x=0, f_y=0 的几何意义（切平面水平），TheoremBox | `TheoremBox`, `MathFormula` |
| 极值充分条件 | 270–420 | Hessian 矩阵判别法，AC-B²>0 vs <0 三种情况 | `StepByStep`, `TheoremBox` |
| 鞍点演示 | 420–510 | 马鞍面 z=x²-y² 的 3D 动画，极值点与鞍点对比 | `PartialDerivative` |
| 最值问题 | 510–600 | 有界闭区域上求最值的步骤 | `StepByStep` |
| 小结 | 600–660 | 极值求解流程图 | `TheoremBox` |

---

### Sec07 — 拉格朗日乘数法

**文件**：`Sec07_LagrangeMultipliers.tsx`
**Composition ID**：`Ch09_Sec07_LagrangeMultipliers`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「9.7 条件极值·拉格朗日乘数法」 | `TitleCard` |
| 问题引入 | 60–180 | 在约束曲线 g=0 上求 f 极值，等高线与约束线相切的几何意义 | `CoordinateSystem`, `FunctionPlot` |
| 拉格朗日方程 | 180–300 | ∇f = λ∇g，方程组构建 TheoremBox | `TheoremBox`, `MathFormula` |
| 求解步骤 | 300–480 | 构建 L(x,y,λ)，偏导=0，联立求解 StepByStep | `StepByStep` |
| 示例 | 480–540 | 正方体各面之和固定时体积最大 | `StepByStep` |
| 小结 | 540–600 | 几何意义：梯度共线，适用场景 | `TheoremBox` |
