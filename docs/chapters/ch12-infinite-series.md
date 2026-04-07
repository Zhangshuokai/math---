# 第十二章：无穷级数

> 文件夹：`src/chapters/Ch12_InfiniteSeries/`
> Composition 前缀：`Ch12_`

---

## 章节概览

无穷级数是本册的压轴章节，难点在于**收敛性的抽象判断**和**傅里叶级数的直觉理解**。动画的核心策略是：通过**部分和序列的动态折线图**呈现收敛/发散行为，通过**旋转圆叠加**可视化傅里叶展开的构成，将抽象分析命题转化为直观图形。`FourierSeries` 组件是本章的专属亮点。

---

## 分集结构

### Sec01 — 数项级数的概念与性质

**文件**：`Sec01_NumericSeries.tsx`
**Composition ID**：`Ch12_Sec01_NumericSeries`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第十二章 无穷级数」 | `TitleCard` |
| 级数概念 | 60–180 | 数列 {a_n} 的前 n 项和 S_n，动态折线图从 S_1 增长到 S_20 | `CoordinateSystem`, `FunctionPlot` |
| 收敛与发散 | 180–330 | 调和级数 vs 几何级数，两条 S_n 曲线对比（一条发散、一条收敛） | `CoordinateSystem`, `FunctionPlot` |
| 收敛必要条件 | 330–420 | 若 ∑a_n 收敛则 lim a_n = 0，反例：调和级数 | `TheoremBox`, `MathFormula` |
| 级数性质 | 420–480 | 线性性、加括号不改变收敛性 | `TheoremBox` |
| 小结 | 480–540 | 级数 vs 数列：求和与极限的关系 | `MathFormula` |

---

### Sec02 — 正项级数的收敛判别法

**文件**：`Sec02_ConvergenceTests.tsx`
**Composition ID**：`Ch12_Sec02_ConvergenceTests`
**时长**：720 帧（24 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「12.2 正项级数的收敛判别法」 | `TitleCard` |
| 比较判别法 | 60–210 | 0 ≤ a_n ≤ b_n，大级数收敛则小级数收敛；图形"夹逼"动画 | `CoordinateSystem`, `FunctionPlot`, `TheoremBox` |
| 比值判别法（达朗贝尔） | 210–360 | lim a_{n+1}/a_n = ρ，ρ<1 收敛、ρ>1 发散；StepByStep 推导 | `StepByStep`, `TheoremBox` |
| 根值判别法（柯西） | 360–480 | lim ⁿ√a_n = ρ，同比值法；两法对比 | `TheoremBox`, `MathFormula` |
| 积分判别法 | 480–600 | ∑f(n) 与 ∫f(x)dx 的比较，图形中矩形与曲线面积对应 | `CoordinateSystem`, `FunctionPlot`, `IntegralArea` |
| 小结 | 600–720 | 各判别法适用情形决策树 | `TheoremBox` |

---

### Sec03 — 交错级数与绝对收敛

**文件**：`Sec03_AlternatingSeries.tsx`
**Composition ID**：`Ch12_Sec03_AlternatingSeries`
**时长**：480 帧（16 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「12.3 交错级数与绝对收敛」 | `TitleCard` |
| 莱布尼茨定理 | 60–210 | (-1)^n b_n，S_n 在极限两侧交替收缩的"锯齿"动画 | `CoordinateSystem`, `FunctionPlot`, `TheoremBox` |
| 绝对收敛定义 | 210–300 | ∑|a_n| 收敛 ⟹ ∑a_n 收敛，反之不然 | `TheoremBox`, `MathFormula` |
| 条件收敛示例 | 300–390 | 交错调和级数：条件收敛但非绝对收敛；S_n 折线图 | `CoordinateSystem`, `FunctionPlot` |
| 绝对/条件收敛比较 | 390–420 | 重排定理简介（条件收敛级数重排后可趋任意值） | `TheoremBox` |
| 小结 | 420–480 | 收敛类型层级关系 | `TheoremBox` |

---

### Sec04 — 幂级数

**文件**：`Sec04_PowerSeries.tsx`
**Composition ID**：`Ch12_Sec04_PowerSeries`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「12.4 幂级数」 | `TitleCard` |
| 幂级数定义 | 60–150 | ∑a_n(x-x₀)^n，关于 x 的函数族概念 | `MathFormula`, `TheoremBox` |
| 收敛半径 | 150–300 | 阿贝尔定理：收敛区间 (x₀-R, x₀+R)，收敛域图示 | `CoordinateSystem`, `TheoremBox` |
| 收敛半径计算 | 300–420 | R = lim |a_n/a_{n+1}|，用比值法推导 | `StepByStep`, `MathFormula` |
| 幂级数的运算 | 420–510 | 逐项求导、逐项积分，收敛半径不变 | `TheoremBox`, `MathFormula` |
| 示例 | 510–540 | 1/(1-x) 的幂级数展开，几何级数 | `StepByStep`, `FunctionPlot` |
| 小结 | 540–600 | 幂级数收敛域求法流程 | `TheoremBox` |

---

### Sec05 — 函数展开成幂级数（泰勒/麦克劳林展开）

**文件**：`Sec05_TaylorMaclaurin.tsx`
**Composition ID**：`Ch12_Sec05_TaylorMaclaurin`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「12.5 函数展开成幂级数」 | `TitleCard` |
| 泰勒公式回顾 | 60–150 | 带余项的泰勒公式，余项 R_n → 0 的条件 | `TheoremBox`, `MathFormula` |
| sin x 展开 | 150–300 | 从 sinx ≈ x 到加入 x³/3! 再到 x⁵/5!，逐项叠加动画，与 sin 曲线对比拟合 | `CoordinateSystem`, `FunctionPlot` |
| e^x 展开 | 300–420 | 同样的逐项叠加动画（1+x+x²/2!+…），快速收敛 | `CoordinateSystem`, `FunctionPlot` |
| 常用展开式 | 420–540 | sin x、cos x、eˣ、ln(1+x)、(1+x)^α 的麦克劳林级数展示 | `TheoremBox` |
| 间接展开法 | 540–600 | 由已知展开式推导新展开，如 sin²x 利用倍角公式 | `StepByStep` |
| 小结 | 600–660 | 记忆口诀与应用场景 | `TheoremBox` |

---

### Sec06 — 傅里叶级数

**文件**：`Sec06_FourierSeries.tsx`
**Composition ID**：`Ch12_Sec06_FourierSeries`
**时长**：900 帧（30 秒）

> 本节是全册动画的**压轴亮点**，综合运用 `FourierSeries` 组件展示"旋转圆叠加"可视化。

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「12.6 傅里叶级数」 | `TitleCard` |
| 周期函数与正交性 | 60–210 | 正弦/余弦函数在 [-π,π] 上的正交性，内积图示 | `CoordinateSystem`, `FunctionPlot`, `TheoremBox` |
| 傅里叶系数公式 | 210–330 | a₀、aₙ、bₙ 三个积分公式，TheoremBox 展示 | `TheoremBox`, `MathFormula` |
| 方波傅里叶展开 | 330–540 | 从 1 项到 15 项，逐步叠加逼近方波：坐标系+实时曲线更新 | `FourierSeries`, `CoordinateSystem` |
| 旋转圆可视化 | 540–720 | 多个旋转圆（频率逐步增加）叠加合成方波的"龙卷风"动画 | `FourierSeries` |
| 吉布斯现象 | 720–810 | 间断点附近的超调现象，高亮显示 | `FourierSeries`, `CoordinateSystem` |
| 狄利克雷定理 | 810–840 | 收敛条件，间断点处收敛到左右极限均值 | `TheoremBox` |
| 小结 | 840–900 | 傅里叶展开的物理意义（频谱分析），全课总结 | `TheoremBox`, `MathFormula` |
