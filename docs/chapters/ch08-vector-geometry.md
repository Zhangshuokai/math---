# 第八章：空间解析几何与向量代数

> 文件夹：`src/chapters/Ch08_VectorGeometry/`
> Composition 前缀：`Ch08_`

---

## 章节概览

本章是多元微积分的几何基础，动画重点在于**三维空间的直观化**——向量运算的几何意义、平面与直线的空间关系、二次曲面的形状。使用等距投影渲染 3D 场景，`Vector3D` 和 `CoordinateSystem3D` 是本章的核心组件。

---

## 分集结构

### Sec01 — 空间直角坐标系与向量

**文件**：`Sec01_Vectors.tsx`
**Composition ID**：`Ch08_Sec01_Vectors`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第八章 空间解析几何与向量代数」 | `TitleCard` |
| 3D 坐标系建立 | 60–180 | x、y、z 轴依次描绘出现，坐标面着色 | `CoordinateSystem3D` |
| 向量定义 | 180–270 | 空间中绘制向量 a，展示模长、方向余弦 | `Vector3D`, `MathFormula` |
| 向量运算 | 270–420 | 加法（平行四边形法则）、数乘、减法动画 | `Vector3D`, `Arrow` |
| 基底分解 | 420–480 | 分解为 i、j、k 三分量，虚线投影显示 | `Vector3D` |
| 小结 | 480–540 | 向量与坐标的转换公式 | `MathFormula`, `TheoremBox` |

---

### Sec02 — 数量积（点积）

**文件**：`Sec02_DotProduct.tsx`
**Composition ID**：`Ch08_Sec02_DotProduct`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「8.2 数量积（点积）」 | `TitleCard` |
| 几何定义 | 60–180 | 展示两向量夹角θ，|a||b|cosθ 的投影图示 | `Vector3D`, `MathFormula` |
| 代数计算 | 180–270 | a·b = a₁b₁+a₂b₂+a₃b₃ 推导 | `StepByStep` |
| 几何应用 | 270–390 | 用点积求夹角、判断垂直、投影动画 | `Vector3D`, `Arrow`, `MathFormula` |
| 性质展示 | 390–480 | 交换律、分配律的向量图形证明 | `Vector3D` |
| 小结 | 480–540 | 公式汇总，正交条件 a·b=0 | `TheoremBox` |

---

### Sec03 — 向量积（叉积）

**文件**：`Sec03_CrossProduct.tsx`
**Composition ID**：`Ch08_Sec03_CrossProduct`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「8.3 向量积（叉积）」 | `TitleCard` |
| 几何定义 | 60–180 | 两向量确定平面，结果向量垂直于该平面，右手定则动画 | `Vector3D`, `CoordinateSystem3D` |
| 行列式计算 | 180–300 | 3×3 行列式展开求叉积，逐步展开动画 | `StepByStep`, `MathFormula` |
| 模长意义 | 300–390 | |a×b|=|a||b|sinθ，平行四边形面积图示 | `Vector3D`, `MathFormula` |
| 应用：法向量 | 390–510 | 平面内两向量的叉积作为法向量 | `Vector3D` |
| 小结 | 510–600 | 叉积反交换律，与点积对比表 | `TheoremBox` |

---

### Sec04 — 平面方程

**文件**：`Sec04_Planes.tsx`
**Composition ID**：`Ch08_Sec04_Planes`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「8.4 平面方程」 | `TitleCard` |
| 法向量确定平面 | 60–180 | 3D 中展示法向量 n=(A,B,C)，动态生成平面 | `CoordinateSystem3D`, `Vector3D` |
| 点法式推导 | 180–300 | A(x-x₀)+B(y-y₀)+C(z-z₀)=0 推导过程 | `StepByStep` |
| 一般式 | 300–390 | Ax+By+Cz+D=0，三种特殊情况（过原点、平行轴等） | `TheoremBox`, `MathFormula` |
| 截距式与两点式 | 390–480 | x/a+y/b+z/c=1，坐标轴截距图示 | `CoordinateSystem3D`, `MathFormula` |
| 点到平面距离 | 480–540 | 距离公式推导与动态图示 | `StepByStep`, `Vector3D` |
| 小结 | 540–600 | 各种方程形式对比 | `TheoremBox` |

---

### Sec05 — 空间直线方程

**文件**：`Sec05_Lines.tsx`
**Composition ID**：`Ch08_Sec05_Lines`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「8.5 空间直线方程」 | `TitleCard` |
| 对称式推导 | 60–180 | 方向向量 v=(l,m,n)，(x-x₀)/l=(y-y₀)/m=(z-z₀)/n | `Vector3D`, `StepByStep` |
| 参数式 | 180–270 | x=x₀+lt，y=y₀+mt，z=z₀+nt，动态参数 t 变化 | `MathFormula`, `CoordinateSystem3D` |
| 两平面交线 | 270–390 | 两平面方程组联立，叉积求方向向量 | `CoordinateSystem3D`, `StepByStep` |
| 直线与平面关系 | 390–480 | 夹角公式，平行/垂直条件动态展示 | `Vector3D`, `TheoremBox` |
| 小结 | 480–540 | 各种形式互相转换规律 | `TheoremBox` |

---

### Sec06 — 曲面与空间曲线

**文件**：`Sec06_Surfaces.tsx`
**Composition ID**：`Ch08_Sec06_Surfaces`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「8.6 曲面与空间曲线」 | `TitleCard` |
| 旋转曲面 | 60–210 | 母线绕轴旋转生成旋转面，动画旋转过程 | `CoordinateSystem3D` |
| 柱面 | 210–330 | 准线 + 母线方向确定柱面，展示椭圆柱/双曲柱 | `CoordinateSystem3D`, `MathFormula` |
| 二次曲面 | 330–510 | 依次展示椭球面、抛物面、双曲面的标准方程与形状 | `CoordinateSystem3D`, `TheoremBox` |
| 空间曲线 | 510–600 | 两曲面交线的参数表示，螺旋线示例 | `CoordinateSystem3D`, `MathFormula` |
| 小结 | 600–660 | 各类曲面方程特征对比表 | `TheoremBox` |
