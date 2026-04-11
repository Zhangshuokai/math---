# 开发会话总结文档（2026-04-10）

> 同济高等数学第七版下册 Remotion 动画教学项目 · 全面升级总结

---

## 目录

1. [项目背景与本次升级目标](#1-项目背景与本次升级目标)
2. [完成内容汇总](#2-完成内容汇总)
3. [新增 Composition 完整列表](#3-新增-composition-完整列表)
4. [智能制造应用案例清单](#4-智能制造应用案例清单)
5. [例题内容清单](#5-例题内容清单)
6. [技术规范遵守情况](#6-技术规范遵守情况)
7. [项目当前状态](#7-项目当前状态)
8. [运行方式](#8-运行方式)

---

## 1. 项目背景与本次升级目标

### 1.1 项目背景

本项目为同济大学《高等数学》第七版下册（第七章至第十二章）的程序化动画教学系统，基于 **Remotion 4.0.230 + React + TypeScript + KaTeX** 构建，产出 1920×1080 / 30fps 教学视频。

在前序版本中，项目已完成：
- 41 节核心知识点动画（共 ~20,100 帧）
- 公共动画工具模块 [`src/utils/animationUtils.ts`](../src/utils/animationUtils.ts)
- 3D 可视化组件体系（`CoordinateSystem3D`、`SurfaceMesh3D`、`ParametricCurve3D`、`AnimatedVector3D`、`Plane3D`）
- 全部知识节从"基础动画"升级至"完整动画"（≥ 450 帧）

### 1.2 本次升级目标

| 目标 | 详情 |
|------|------|
| 新增例题动画 | 每章新增 3 道精选例题，含分步推导 + 图形可视化 |
| 新增智能制造（IM）应用案例 | 每章新增 2 个工程应用案例，体现数学在制造业的实际价值 |
| 重建已有例题节 | Ch07/Ch08/Ch09 原有例题节升级至详解型标准（1530~1620 帧） |
| 达成 65 个 Composition | 新增 15 个 Composition 注册，更新 3 个帧数 |

---

## 2. 完成内容汇总

### 2.1 按章节汇总表

| 章节 | 例题文件 | 帧数 | IM 案例 1 | IM 案例 2 | 新增 Comp 数 |
|------|---------|------|----------|----------|------------|
| **Ch07** 微分方程 | [`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx)（重建） | 1,530 | [`Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) RC 电路 | [`Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) 振动系统 | 2 新增 + 1 更新 |
| **Ch08** 向量几何 | [`Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx)（重建） | 1,620 | [`Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) 机械臂 | [`Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) CNC 刀轴 | 2 新增 + 1 更新 |
| **Ch09** 多元函数 | [`Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx)（重建） | 1,620 | [`Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) 生产优化 | [`Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) 误差传播 | 2 新增 + 1 更新 |
| **Ch10** 重积分 | [`Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx)（新建） | 1,620 | [`Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) 极惯性矩 | [`Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) 铸件体积 | 3 新增 |
| **Ch11** 曲线曲面积分 | [`Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx)（新建） | 1,620 | [`Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) 管道流量 | [`Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) 电磁通量 | 3 新增 |
| **Ch12** 无穷级数 | [`Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx)（新建） | 1,440 | [`Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) 傅里叶滤波 | [`Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) 插补近似 | 3 新增 |
| **合计** | 6 个例题文件 | **9,450 帧** | 12 个 IM 案例 | — | **15 新增 + 3 更新** |

### 2.2 新增/重建 TSX 文件清单（共 18 个）

| # | 文件路径 | 类型 | 帧数 | 时长 |
|---|----------|------|------|------|
| 1 | [`src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) | 例题（重建） | 1,530 | 51s |
| 2 | [`src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) | IM 案例（新建） | 540 | 18s |
| 3 | [`src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) | IM 案例（新建） | 540 | 18s |
| 4 | [`src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) | 例题（重建） | 1,620 | 54s |
| 5 | [`src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) | IM 案例（新建） | 540 | 18s |
| 6 | [`src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) | IM 案例（新建） | 540 | 18s |
| 7 | [`src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx) | 例题（重建） | 1,620 | 54s |
| 8 | [`src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) | IM 案例（新建） | 540 | 18s |
| 9 | [`src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) | IM 案例（新建） | 540 | 18s |
| 10 | [`src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx) | 例题（新建） | 1,620 | 54s |
| 11 | [`src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) | IM 案例（新建） | 540 | 18s |
| 12 | [`src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) | IM 案例（新建） | 540 | 18s |
| 13 | [`src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx) | 例题（新建） | 1,620 | 54s |
| 14 | [`src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) | IM 案例（新建） | 540 | 18s |
| 15 | [`src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) | IM 案例（新建） | 540 | 18s |
| 16 | [`src/compositions/Ch12_Series/Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx) | 例题（新建） | 1,440 | 48s |
| 17 | [`src/compositions/Ch12_Series/Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) | IM 案例（新建） | 540 | 18s |
| 18 | [`src/compositions/Ch12_Series/Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) | IM 案例（新建） | 540 | 18s |

---

## 3. 新增 Composition 完整列表

> Root.tsx 本次新增 15 个 Composition 注册，更新 3 个帧数，当前合计 **65 个 Composition**。

### 3.1 本次新增（15 个）

| Composition ID | 帧数 | 时长 | 源文件 |
|----------------|------|------|--------|
| `Ch07-Sec11-IM-Control` | 540 | 18s | [`Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) |
| `Ch07-Sec12-IM-Dynamics` | 540 | 18s | [`Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) |
| `Ch08-Sec08-IM-RobotArm` | 540 | 18s | [`Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) |
| `Ch08-Sec09-IM-CNC` | 540 | 18s | [`Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) |
| `Ch09-Sec10-IM-Optimization` | 540 | 18s | [`Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) |
| `Ch09-Sec11-IM-Sensor` | 540 | 18s | [`Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) |
| `Ch10-Sec05-Examples` | 1,620 | 54s | [`Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx) |
| `Ch10-Sec06-IM-Mass` | 540 | 18s | [`Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) |
| `Ch10-Sec07-IM-CNC` | 540 | 18s | [`Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) |
| `Ch11-Sec08-Examples` | 1,620 | 54s | [`Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx) |
| `Ch11-Sec09-IM-Flow` | 540 | 18s | [`Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) |
| `Ch11-Sec10-IM-Field` | 540 | 18s | [`Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) |
| `Ch12-Sec08-Examples` | 1,440 | 48s | [`Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx) |
| `Ch12-Sec09-IM-Signal` | 540 | 18s | [`Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) |
| `Ch12-Sec10-IM-Approx` | 540 | 18s | [`Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) |

### 3.2 本次帧数更新（3 个）

| Composition ID | 更新前帧数 | 更新后帧数 | 源文件 |
|----------------|-----------|-----------|--------|
| `Ch07-Sec10-Examples` | 原版本 | 1,530 | [`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) |
| `Ch08-Sec07-Examples` | 原版本 | 1,620 | [`Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) |
| `Ch09-Sec09-Examples` | 原版本 | 1,620 | [`Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx) |

---

## 4. 智能制造应用案例清单

> 每章 2 个 IM 案例，共 12 个。每个案例 540 帧 / 18 秒，包含：题目展示、数学模型推导、工程仿真动画、参数敏感性分析。

### 第七章：微分方程 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) | **RC 电路充放电控制** | 一阶线性常微分方程 `RC·du/dt + u = E(t)` | 工业伺服驱动器中滤波电容的充电曲线分析；控制响应时间优化 |
| [`Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) | **机床振动系统建模** | 二阶常系数线性方程 `mẍ + cẋ + kx = F(t)` | 数控机床主轴振动抑制；阻尼比对加工精度影响的动态可视化 |

### 第八章：空间解析几何与向量代数 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) | **工业机械臂正向运动学** | 齐次变换矩阵 + 向量叉积 `T = Rz(θ)·Ry(φ)·t` | 六轴工业机器人末端执行器位姿计算；焊接路径规划中的关节角求解 |
| [`Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) | **CNC 五轴加工刀轴矢量控制** | 空间直线方程 + 法向量 `n = t × b` | 复杂曲面零件五轴联动加工；刀轴倾角对切削力分布的影响分析 |

### 第九章：多元函数微分法 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) | **多目标生产优化** | 多元函数极值 + Lagrange 乘数法 `∇f = λ∇g` | 汽车冲压件生产线参数优化；在材料成本、能耗约束下最大化产量 |
| [`Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) | **传感器测量误差传播分析** | 全微分误差公式 `dz = (∂z/∂x)dx + (∂z/∂y)dy` | IMU 惯性传感器精度评估；多参数测量系统中误差累积的定量预测 |

### 第十章：重积分 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) | **旋转零件极惯性矩计算** | 极坐标二重积分 `Ip = ∬ρ r² dA` | 飞轮、齿轮等旋转体转动惯量精确计算；异形截面零件惯性矩数值积分动画 |
| [`Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) | **铸件不规则体积估算** | 三重积分体积公式 `V = ∭ dV` | 复杂铸造件毛坯体积与重量精算；数值积分精度与网格密度关系的动态演示 |

### 第十一章：曲线积分与曲面积分 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) | **管道流量场分析** | 第二类曲线积分 `∮ v·dr` + 格林公式 | 液压系统管道截面流量积分计算；管道弯折处流速分布与压降的可视化 |
| [`Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) | **电机线圈电磁通量计算** | 曲面积分 `Φ = ∬ B·dS` + 高斯公式 | 永磁同步电机定子绕组磁通量精确积分；气隙磁场非均匀分布的通量误差分析 |

### 第十二章：无穷级数 IM 案例

| 文件 | 案例名称 | 数学模型 | 工程背景 |
|------|---------|---------|---------|
| [`Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) | **工业信号傅里叶滤波** | 傅里叶级数 `f(t) = a₀ + Σ(aₙcos nωt + bₙsin nωt)` | 振动传感器信号去噪；保留基频成分、滤除高次谐波噪声的频谱分析动画 |
| [`Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) | **数控插补泰勒近似** | 幂级数截断近似 `f(x) ≈ Σ f⁽ⁿ⁾(x₀)/n! · (x−x₀)ⁿ` | CNC 圆弧插补算法中三角函数泰勒展开；截断阶数对插补精度与计算速度的权衡 |

---

## 5. 例题内容清单

> 每章 3 道精选例题，采用"详解型"标准场景（540 帧 / 例题）。每道例题包含：题目展示（Stage 1）→ 审题分析（Stage 2）→ 分步推导+配图（Stage 3）→ 关键结论（Stage 4）→ 3D 可视化（Stage 5）→ 总结（Stage 6）。

### 第七章：微分方程例题（[`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx)，1530 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–510 | 求解一阶线性方程 `dy/dx − 2y = eˣ` 的通解，并画出解族曲线 | 积分因子法，解族可视化 |
| 例 2 | 510–1020 | 求 `(x²+1)y″ + 2xy′ = 4x` 满足 `y(0)=0, y′(0)=1` 的特解 | 高阶方程降阶，初值问题 |
| 例 3 | 1020–1530 | 某质量弹簧阻尼系统满足 `mẍ + cẋ + kx = A sin ωt`，求稳态响应振幅 | 常系数非齐次方程，共振分析 |

### 第八章：向量几何例题（[`Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx)，1620 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–540 | 已知空间中三点坐标，求过此三点的平面方程及点到平面的距离 | 法向量叉积，点法式，距离公式 |
| 例 2 | 540–1080 | 求过直线 `L₁` 且与平面 `π` 平行的平面方程，并求 `L₁` 与 `π` 的夹角 | 直线与平面位置关系，3D 旋转展示 |
| 例 3 | 1080–1620 | 椭球面 `x²/4 + y²/9 + z² = 1` 上某点处的切平面方程及法线方程 | 曲面法向量，切平面方程，3D 曲面旋转 |

### 第九章：多元函数微分例题（[`Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx)，1620 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–540 | 求函数 `z = x³ − y³ + 3xy` 的极值，并判断鞍点 | Hessian 行列式判别，等值线可视化 |
| 例 2 | 540–1080 | 在约束 `g(x,y,z) = x² + y² + z² = 1` 下，求 `f = x + 2y + 3z` 的最大值 | Lagrange 乘数法，球面上最值，3D 旋转 |
| 例 3 | 1080–1620 | 已知隐函数 `F(x, y, z) = x² + y² − z² − 1 = 0`，求 `∂z/∂x`, `∂²z/∂x²` | 隐函数求导，二阶偏导，旋转曲面动画 |

### 第十章：重积分例题（[`Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx)，1620 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–540 | 计算 `∬_D (x² + y²) dA`，其中 D 为圆域 `x² + y² ≤ R²` | 极坐标变换，极坐标网格动画 |
| 例 2 | 540–1080 | 利用三重积分求球缺 `x² + y² + z² ≤ R², z ≥ 0` 的体积和质心 | 球坐标变换，对称性，质心公式 |
| 例 3 | 1080–1620 | 计算 `∬_D e^(−x²−y²) dA` 在整个平面上的广义积分，推导 `∫_{-∞}^{+∞} e^{-x²} dx = √π` | 无界区域积分，极坐标，高斯积分推导 |

### 第十一章：曲线曲面积分例题（[`Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx)，1620 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–540 | 计算沿螺旋线 `x=cos t, y=sin t, z=t (t: 0→2π)` 的第一类曲线积分 `∫_L (x²+y²+z²) ds` | 参数化弧长积分，空间螺旋线 3D 旋转 |
| 例 2 | 540–1080 | 用格林公式计算沿正向椭圆 `x²/a² + y²/b² = 1` 的曲线积分 `∮ (y dx − x dy)` | 格林公式，封闭曲线方向，面积计算 |
| 例 3 | 1080–1620 | 利用高斯公式计算向量场 `F = (x, y, z)` 穿过单位球面 `x²+y²+z²=1` 的通量 | 散度定理，向量场通量，球面 3D 旋转 |

### 第十二章：无穷级数例题（[`Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx)，1440 帧）

| 例题 | 帧范围 | 题目描述 | 知识点 |
|------|--------|---------|--------|
| 例 1 | 0–480 | 求幂级数 `Σ nxⁿ` 的收敛域与和函数 | 比值审敛法，逐项求导，收敛半径动画 |
| 例 2 | 480–960 | 将 `f(x) = x²`（`−π < x ≤ π`）展开成傅里叶级数 | 计算 Fourier 系数，叠加逼近动画 |
| 例 3 | 960–1440 | 利用泰勒展开求极限 `lim_{x→0} (e^x − 1 − x)/x²` 及数值积分 `∫₀¹ sin(x)/x dx` | 等价无穷小，幂级数逐项积分，误差估计 |

---

## 6. 技术规范遵守情况

### 6.1 文件命名规范

| 规范要求 | 遵守情况 |
|---------|---------|
| 文件夹（章）：`Ch{两位章号}_{英文主题}` | ✅ 所有文件位于已有章节文件夹 |
| 文件（节）：`Sec{两位节号}_{英文主题}.tsx` | ✅ 全部 18 个文件符合命名规范 |
| Composition ID：`Ch{章}-Sec{节}-{主题}` 用连字符 | ✅ 新增 15 个均使用连字符格式 |

### 6.2 KaTeX 公式渲染

所有例题和 IM 案例中的数学公式均使用 [`MathFormula`](../src/components/math/MathFormula.tsx) 组件，调用 `katex.renderToString()` + `dangerouslySetInnerHTML`，严格禁止 `useEffect` 渲染，确保服务端按帧渲染时公式同步显示。

### 6.3 Watermark HOC 包裹

所有新增 Composition 在 [`Root.tsx`](../src/Root.tsx) 中均遵循模块顶层预创建模式：

```tsx
// 顶层预创建（禁止在 JSX 内 inline）
const WCh10Examples = withWatermark(Ch10Examples);
const WCh10IMMass = withWatermark(Ch10IMMass);
// ...

// Composition 注册
<Composition component={WCh10Examples} id="Ch10-Sec05-Examples" ... />
```

### 6.4 帧驱动动画

所有动画均使用 `useCurrentFrame()` + `interpolate()` 驱动，严格禁止 CSS `animation`、`transition` 或 `setTimeout`。

### 6.5 3D 图形规范

凡涉及空间图形的例题（Ch08 例 2/3、Ch09 例 2/3、Ch10 例 1/2、Ch11 例 1/3）均：
- 优先使用 [`CoordinateSystem3D`](../src/components/math/CoordinateSystem3D.tsx)、[`SurfaceMesh3D`](../src/components/math/SurfaceMesh3D.tsx)、[`ParametricCurve3D`](../src/components/math/ParametricCurve3D.tsx) 等 3D 组件
- Stage 5（3D 可视化）中提供帧驱动旋转动画（`rotationY = interpolate(frame, [...], [0, 360])`）

### 6.6 例题详解型标准时序

所有例题节严格遵循 AGENTS.md 规定的详解型 6 阶段时序：

```
Stage 1: 展示题目     0–60 帧   (2s)  — ExampleBox 淡入
Stage 2: 审题分析    60–150 帧  (3s)  — 文字拆解已知条件
Stage 3: 分步计算   150–330 帧  (6s)  — StepByStep 逐步推导
Stage 4: 关键结论   330–390 帧  (2s)  — TheoremBox 高亮答案
Stage 5: 3D 可视化  390–480 帧  (3s)  — 旋转展示（或扩展 Stage 3）
Stage 6: 总结       480–540 帧  (2s)  — 关键点回顾淡出
```

---

## 7. 项目当前状态

### 7.1 Composition 统计

| 指标 | 升级前 | 升级后 |
|------|--------|--------|
| Composition 总数 | 50 | **65** |
| 例题节数 | 3（Ch07/08/09） | **6（全章覆盖）** |
| IM 应用案例数 | 0 | **12** |
| TypeScript 编译错误 | 0 | **0** |

### 7.2 各章当前帧数统计

| 章节 | 原有帧数 | 本次新增帧数 | 当前总帧数 | 当前时长 | Comp 数 |
|------|---------|------------|---------|---------|--------|
| 第七章：微分方程 | ~4,530 | 2,610（Sec10重建+1530，Sec11/12各540） | **~7,140** | **~238s** | 12 |
| 第八章：向量几何 | ~2,730 | 2,700（Sec07重建+1620，Sec08/09各540） | **~5,430** | **~181s** | 9 |
| 第九章：多元函数 | ~3,780 | 2,700（Sec09重建+1620，Sec10/11各540） | **~6,480** | **~216s** | 11 |
| 第十章：重积分 | ~2,040 | 2,700（Sec05新+1620，Sec06/07各540） | **~4,740** | **~158s** | 7 |
| 第十一章：曲线曲面 | ~3,420 | 2,700（Sec08新+1620，Sec09/10各540） | **~6,120** | **~204s** | 10 |
| 第十二章：无穷级数 | ~3,600 | 2,520（Sec08新+1440，Sec09/10各540） | **~6,120** | **~204s** | 10 |
| **合计** | **~20,100** | **+15,930** | **~36,030** | **~1,201s（≈20分钟）** | **65** |

### 7.3 内容覆盖完整性

| 类别 | 数量 | 覆盖范围 |
|------|------|---------|
| 核心知识节 | 41 节 | 第七章至第十二章全覆盖 |
| 例题节 | 6 节 × 3 例题 = **18 道例题** | 每章 3 道，难度递进 |
| IM 应用案例 | **12 个** | 每章 2 个，覆盖控制/机器人/优化/信号处理等领域 |

---

## 8. 运行方式

### 启动 Remotion Studio 预览

```bash
npm start
# 等同于：npx remotion studio
```

启动后浏览器自动打开 `http://localhost:3000`，左侧面板可按文件夹展开各章节：

```
Ch07_DifferentialEq/
  ├── Ch07-Sec10-Examples     ← 3 道微分方程例题（51s）
  ├── Ch07-Sec11-IM-Control   ← RC 电路控制案例（18s）
  └── Ch07-Sec12-IM-Dynamics  ← 机床振动建模案例（18s）
Ch08_VectorGeometry/
  ├── Ch08-Sec07-Examples     ← 3 道向量几何例题（54s）
  ├── Ch08-Sec08-IM-RobotArm  ← 机械臂运动学案例（18s）
  └── Ch08-Sec09-IM-CNC       ← CNC 刀轴矢量案例（18s）
...（其余章节同理）
```

### 渲染单个 Composition

```bash
# 渲染例题节
npx remotion render src/index.ts Ch10-Sec05-Examples out/Ch10-Sec05-Examples.mp4

# 渲染 IM 案例
npx remotion render src/index.ts Ch12-Sec09-IM-Signal out/Ch12-Sec09-IM-Signal.mp4
```

### 升级依赖

```bash
npm run upgrade
```

---

*文档生成时间：2026-04-10 | 项目版本：v1.3.0*
