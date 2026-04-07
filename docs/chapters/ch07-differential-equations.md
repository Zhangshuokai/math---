# 第七章：微分方程

> 文件夹：`src/chapters/Ch07_DifferentialEq/`
> Composition 前缀：`Ch07_`

---

## 章节概览

微分方程是高等数学下册的开篇章节，核心目标是让学生理解方程的建立、求解方法及几何意义。动画重点在于**解曲线族的动态生成**和**积分因子的几何直觉**。

---

## 分集结构

### Sec01 — 微分方程的基本概念

**文件**：`Sec01_Intro.tsx`
**Composition ID**：`Ch07_Sec01_Intro`
**时长**：480 帧（16 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「第七章 微分方程」主标题淡入，副标题「7.1 基本概念」上滑 | `TitleCard` |
| 概念引入 | 60–150 | 展示微分方程实例：自由落体 dv/dt = g，人口增长 dN/dt = kN | `MathFormula`, `TheoremBox` |
| 关键定义 | 150–240 | 定义：阶、通解、特解；TheoremBox 依次滑入 | `TheoremBox`, `StepByStep` |
| 几何意义 | 240–390 | 坐标系中绘制 dy/dx = y 的等倾线与积分曲线族 | `CoordinateSystem`, `FunctionPlot`, `DiffEqSolution` |
| 小结 | 390–480 | 关键词回顾：方程→解→曲线族，淡出 | `MathFormula` |

---

### Sec02 — 可分离变量的微分方程

**文件**：`Sec02_SeparableEq.tsx`
**Composition ID**：`Ch07_Sec02_SeparableEq`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.2 可分离变量的微分方程」 | `TitleCard` |
| 标准形式 | 60–150 | g(y)dy = f(x)dx 写出分离过程，高亮变量分离操作 | `MathFormula`, `StepByStep` |
| 推导步骤 | 150–360 | 5 步推导：写出方程→分离变量→两边积分→求解→验证 | `StepByStep` |
| 可视化 | 360–510 | 以 dy/dx = xy 为例，坐标系中绘制解曲线族 | `CoordinateSystem`, `DiffEqSolution` |
| 例题 | 510–570 | 求解具体例题，StepByStep 呈现 | `StepByStep`, `MathFormula` |
| 小结 | 570–600 | 要点：分离→积分→C | `TheoremBox` |

---

### Sec03 — 齐次方程

**文件**：`Sec03_HomogeneousEq.tsx`
**Composition ID**：`Ch07_Sec03_HomogeneousEq`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.3 齐次方程」 | `TitleCard` |
| 齐次函数定义 | 60–150 | 展示 f(tx,ty)=f(x,y) 的齐次性，用 v=y/x 换元思路 | `MathFormula`, `TheoremBox` |
| 换元推导 | 150–300 | 令 v=y/x，代换步骤全程 StepByStep | `StepByStep` |
| 几何意义 | 300–420 | 坐标系中展示以原点为中心的相似解曲线 | `CoordinateSystem`, `DiffEqSolution` |
| 小结 | 420–540 | 换元公式，恢复原变量提示 | `TheoremBox` |

---

### Sec04 — 一阶线性微分方程

**文件**：`Sec04_LinearFirstOrder.tsx`
**Composition ID**：`Ch07_Sec04_LinearFirstOrder`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.4 一阶线性微分方程」 | `TitleCard` |
| 方程结构分析 | 60–150 | dy/dx + P(x)y = Q(x)，高亮齐次与非齐次项 | `MathFormula` |
| 积分因子思路 | 150–210 | 引入 μ(x) = e^∫P(x)dx，TheoremBox 展示 | `TheoremBox` |
| 推导过程 | 210–390 | 6 步推导：乘积分因子→识别导数→两边积分→除以μ | `StepByStep` |
| 通解公式 | 390–450 | 最终公式高亮展示，注明 C 的含义 | `TheoremBox`, `MathFormula` |
| 解曲线族 | 450–600 | 坐标系中 P=1/x 时绘制不同 C 值的解曲线 | `CoordinateSystem`, `DiffEqSolution` |
| 小结 | 600–660 | 公式总结，与齐次方程对比 | `MathFormula` |

---

### Sec05 — 伯努利方程

**文件**：`Sec05_Bernoulli.tsx`
**Composition ID**：`Ch07_Sec05_Bernoulli`
**时长**：480 帧（16 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.5 伯努利方程」 | `TitleCard` |
| 方程形式 | 60–150 | dy/dx + P(x)y = Q(x)y^n，对比线性方程 | `MathFormula`, `TheoremBox` |
| 换元法推导 | 150–330 | 令 z=y^(1-n)，代入化为线性，全程 5 步推导 | `StepByStep` |
| 应用示例 | 330–420 | 逻辑斯谛增长模型 dN/dt = rN(1-N/K) | `MathFormula`, `CoordinateSystem`, `FunctionPlot` |
| 小结 | 420–480 | 换元关键：z=y^(1-n) | `TheoremBox` |

---

### Sec06 — 可降阶的高阶微分方程

**文件**：`Sec06_ReducibleHighOrder.tsx`
**Composition ID**：`Ch07_Sec06_ReducibleHighOrder`
**时长**：540 帧（18 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.6 可降阶的高阶微分方程」 | `TitleCard` |
| 三种类型展示 | 60–180 | 依次展示三种：y^(n)=f(x)、y''=f(x,y')、y''=f(y,y') | `MathFormula`, `TheoremBox` |
| 类型一推导 | 180–300 | 逐次积分法 y^(n)=f(x)，动画展示积分累积 | `StepByStep` |
| 类型二推导 | 300–420 | 令 p=y'，降为一阶，StepByStep | `StepByStep` |
| 小结 | 420–540 | 三种类型对比表格，换元策略总结 | `TheoremBox` |

---

### Sec07 — 二阶常系数齐次线性方程

**文件**：`Sec07_ConstCoeffHomogeneous.tsx`
**Composition ID**：`Ch07_Sec07_ConstCoeffHomogeneous`
**时长**：600 帧（20 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.7 二阶常系数齐次线性方程」 | `TitleCard` |
| 特征方程引入 | 60–180 | y''+py'+qy=0，令 y=e^(rx) 代入推出特征方程 r²+pr+q=0 | `MathFormula`, `StepByStep` |
| 三种情况 | 180–390 | 判别式 Δ>0、=0、<0 三种根的情况，通解形式逐一展示 | `TheoremBox`, `MathFormula` |
| 解的图形 | 390–510 | 坐标系中绘制过阻尼/临界/欠阻尼三种振动曲线 | `CoordinateSystem`, `FunctionPlot` |
| 小结 | 510–600 | 特征根→通解的映射表 | `TheoremBox` |

---

### Sec08 — 二阶常系数非齐次线性方程

**文件**：`Sec08_ConstCoeffNonHomogeneous.tsx`
**Composition ID**：`Ch07_Sec08_ConstCoeffNonHomogeneous`
**时长**：660 帧（22 秒）

| 场景 | 帧范围 | 动画内容 | 使用组件 |
|------|--------|----------|----------|
| 标题卡 | 0–60 | 「7.8 二阶常系数非齐次线性方程」 | `TitleCard` |
| 通解结构 | 60–180 | Y = Y* + y_通 结构展示，叠加原理动画 | `MathFormula`, `TheoremBox` |
| f(x)=P_m(x)e^αx 型 | 180–360 | 特解设法，待定系数法推导步骤 | `StepByStep` |
| f(x)=e^αx[A cos βx + B sin βx] 型 | 360–540 | 复数法引入，特解形式推导 | `StepByStep`, `MathFormula` |
| 示例 | 540–600 | 具体例题求解，最终通解 | `StepByStep` |
| 小结 | 600–660 | 特解判断流程图 | `TheoremBox` |
