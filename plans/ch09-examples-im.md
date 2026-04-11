# 第九章 多元函数微分法及其应用 — 例题与 IM 案例设计

> **波兰尼认知路径**：从"固定一个变量看另一变量的变化率"的直觉出发 → 偏导数 → 全微分（误差传播）→ 梯度（最陡方向）→ 条件极值（约束优化）。
> 学生在接触 ∂f/∂x 符号之前，先看到3D曲面上沿不同方向切片，直觉先行。

---

## 例题设计

### Ex01：多元函数偏导数计算

**Composition ID**：`Ch09-Ex01-PartialDerivative`
**durationInFrames**：`450`（2D偏导图示，无3D旋转场景）

**题目**：
> 设 $f(x,y) = x^3y - xy^2 + e^{xy}$，求 $\dfrac{\partial f}{\partial x}$ 和 $\dfrac{\partial f}{\partial y}$。

**对应节**：§9.2 偏导数

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题1 · 多元函数偏导数
  函数：f(x,y) = x³y − xy² + e^{xy}
  问题：求 ∂f/∂x 和 ∂f/∂y
  提示："对 x 偏导时，把 y 看作常数"
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **偏导定义**：对 $x$ 求偏导 = 固定 $y$ 对 $x$ 求普通导数
2. 📐 **各项分析**：
   - $x^3y$ → 对 $x$ 是 $3x^2y$（y是系数）
   - $xy^2$ → 对 $x$ 是 $y^2$（纯线性）
   - $e^{xy}$ → 链式法则，内层对 $x$ 求导得 $y$
3. ⚖️ **符号规范**：偏导数符号 $\partial$ 与普通导数 $d$ 的区别
4. 🎯 **注意事项**：混合偏导数 $\partial^2 f/\partial x \partial y$ 通常可换序

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 对 $x$ 求偏导（y当常数）：$\dfrac{\partial f}{\partial x} = 3x^2y - y^2 + ye^{xy}$ |
| Step 2 | 195–240 | 对 $y$ 求偏导（x当常数）：$\dfrac{\partial f}{\partial y} = x^3 - 2xy + xe^{xy}$ |
| Step 3 | 240–285 | 验证混合偏导：$\dfrac{\partial^2 f}{\partial y\partial x} = 3x^2 - 2y + e^{xy}+xye^{xy}$ |
| Step 4 | 285–330 | 交换顺序验证：$\dfrac{\partial^2 f}{\partial x\partial y}$ 结果相同（施瓦茨定理） |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：偏导数结果
  公式1：∂f/∂x = 3x²y − y² + ye^{xy}
  公式2：∂f/∂y = x³ − 2xy + xe^{xy}
  定理：连续函数混合偏导数与求导顺序无关
```

#### Stage 5：无独立3D场景 → 总帧450
```
Stage 5 改为 2D 曲面切片展示（390–450帧）：
  FunctionPlot 在固定 y=1 时绘制 f(x,1) 曲线，
  高亮切线斜率 = ∂f/∂x|_{y=1}
  同理展示固定 x=1 时的 f(1,y) 切线
```

#### Stage 6（390–450帧，合并）：总结
```
✅ 偏导数：多元函数沿坐标方向的变化率
✅ 求法：固定其他变量，对目标变量用单变量微分规则
✅ 应用：梯度 = (∂f/∂x, ∂f/∂y) 指向函数增长最快方向
```

---

### Ex02：隐函数偏导数（含3D可视化）

**Composition ID**：`Ch09-Ex02-ImplicitPartial`
**durationInFrames**：`540`

**题目**：
> 设 $F(x,y,z) = x^2 + y^2 + z^2 - 4 = 0$ 确定 $z = z(x,y)$，求 $\dfrac{\partial z}{\partial x}$ 和 $\dfrac{\partial z}{\partial y}$。

**对应节**：§9.5 隐函数的求导法则

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题2 · 球面上的隐函数偏导
  方程：x² + y² + z² = 4（半径2的球面）
  问题：求 ∂z/∂x 和 ∂z/∂y（z=z(x,y) 由方程隐式确定）
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **几何直觉**：球面 $x^2+y^2+z^2=4$，上半球 $z=\sqrt{4-x^2-y^2}$，偏导 = 切平面斜率
2. 📐 **隐函数定理**：$\dfrac{\partial z}{\partial x} = -\dfrac{F_x}{F_z}$（不需显式解出 $z$）
3. ⚖️ **适用条件**：$F_z \neq 0$（即 $z \neq 0$，不在赤道圈）
4. 🎯 **几何含义**：$\partial z/\partial x$ = 沿 $x$ 方向球面的倾斜程度

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 计算偏导：$F_x=2x$，$F_y=2y$，$F_z=2z$ |
| Step 2 | 195–240 | 用公式：$\dfrac{\partial z}{\partial x}=-\dfrac{F_x}{F_z}=-\dfrac{2x}{2z}=-\dfrac{x}{z}$ |
| Step 3 | 240–285 | 同理：$\dfrac{\partial z}{\partial y}=-\dfrac{F_y}{F_z}=-\dfrac{y}{z}$ |
| Step 4 | 285–330 | 验证：取 $z=\sqrt{4-x^2-y^2}$，直接求偏导得 $-x/z$（一致✓） |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：球面上的偏导数
  公式1：∂z/∂x = −x/z
  公式2：∂z/∂y = −y/z
  公式总结：∂z/∂x = −F_x/F_z（隐函数定理）
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染球面 x²+y²+z²=4（半透明蓝色，上半球）
  - 取点 P(1,1,√2)，红色高亮
  - AnimatedVector3D 绘制两个偏导方向切向量（蓝/绿）
  - Plane3D 展示 P 处切平面（半透明，由两切向量张成）
  - AnimatedVector3D 展示法向量 (x,y,z)（金色）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 隐函数定理：不显式解出 z，直接用 F 的偏导计算 ∂z/∂x = −F_x/F_z
✅ 几何意义：切平面法向量 = 梯度向量 ∇F = (F_x, F_y, F_z)
✅ 条件：F_z ≠ 0（法向量的 z 分量不为零）
```

---

### Ex03：拉格朗日乘子法求条件极值

**Composition ID**：`Ch09-Ex03-Lagrange`
**durationInFrames**：`540`

**题目**：
> 求函数 $f(x,y,z) = x + 2y + 3z$ 在约束条件 $x^2+y^2+z^2=14$ 下的最大值。

**对应节**：§9.8 多元函数的极值及其求法

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题3 · 拉格朗日乘子法
  目标：最大化 f(x,y,z) = x + 2y + 3z
  约束：x² + y² + z² = 14（球面）
  几何直觉："线性函数在球面上的最大值"
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **几何直觉**：$f=x+2y+3z=c$ 是平面族，求最大的 $c$ 使平面与球面 $x^2+y^2+z^2=14$ 相切
2. 📐 **拉格朗日条件**：$\nabla f = \lambda \nabla g$（梯度共线）
3. ⚖️ **方程组**：4个方程（3个分量 + 约束）解4个未知数（$x,y,z,\lambda$）
4. 🎯 **最大值**：利用柯西-施瓦茨不等式可快速验证

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | $\nabla f=(1,2,3)$，$\nabla g=(2x,2y,2z)$，方程 $(1,2,3)=\lambda(2x,2y,2z)$ |
| Step 2 | 195–240 | 解方程：$x=\tfrac{1}{2\lambda}$，$y=\tfrac{1}{\lambda}$，$z=\tfrac{3}{2\lambda}$ |
| Step 3 | 240–285 | 代入约束：$\tfrac{1}{4\lambda^2}+\tfrac{1}{\lambda^2}+\tfrac{9}{4\lambda^2}=14$ → $\tfrac{14}{4\lambda^2}=14$ → $\lambda^2=\tfrac{1}{4}$ |
| Step 4 | 285–330 | $\lambda=\tfrac{1}{2}$：$(x,y,z)=(1,2,3)$；$f=1+4+9=14$（最大值）；$\lambda=-\tfrac{1}{2}$时最小值 $-14$ |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：条件极值
  最大值点：(x,y,z) = (1, 2, 3)
  最大值：f_max = 14
  最小值：f_min = −14，在 (−1,−2,−3) 处取得
  柯西验证：|f| ≤ |(1,2,3)|·|(x,y,z)| = √14·√14 = 14 ✓
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染球面 x²+y²+z²=14（半透明绿）
  - Plane3D 展示最大值切平面 x+2y+3z=14（金色半透明）
  - Plane3D 展示最小值切平面 x+2y+3z=-14（红色半透明）
  - 两个切点用大圆点高亮
  - AnimatedVector3D 绘制梯度方向 (1,2,3)（从原点出发）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 拉格朗日乘子法：∇f = λ∇g（目标函数梯度与约束梯度平行）
✅ 几何意义：等值面与约束曲面相切时取极值
✅ 工程应用：多变量优化设计（如最优配料比、最小材料用量）
```

---

## 智能制造（IM）应用案例

### IM01：多参数生产函数优化

**文件名建议**：`Im01_ProductionOpt.tsx`
**Composition ID**：`Ch09-IM01-ProductionOpt`
**durationInFrames**：`540`

**工程背景**：
某智能工厂的产量函数为柯布-道格拉斯生产函数 $Q = AL^{\alpha}K^{\beta}$，其中 $L$ 为劳动力（人时），$K$ 为资本投入（万元）。在总成本约束 $wL + rK = C$ 下，寻找最优 $L, K$ 组合使产量最大，此即生产理论中的条件极值问题。

**数学模型**：
$$\max Q = L^{0.6}K^{0.4} \quad \text{s.t.} \quad 2L + 5K = 100$$

拉格朗日条件：
$$\frac{0.6}{L} = \frac{2}{\lambda}, \quad \frac{0.4}{K} = \frac{5}{\lambda}$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例1 · 生产要素最优配置
  生产函数：Q = L^{0.6} · K^{0.4}
  成本约束：2L + 5K = 100（万元）
  问题：L=?,K=? 时产量Q最大？
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **经济含义**：边际产量之比 = 要素价格之比（边际替代率 = 价格比）
2. 📐 **方法**：拉格朗日乘子法，设 $\mathcal{L}=L^{0.6}K^{0.4}-\lambda(2L+5K-100)$
3. ⚖️ **最优条件**：$\partial\mathcal{L}/\partial L=0$，$\partial\mathcal{L}/\partial K=0$，$2L+5K=100$
4. 🎯 **工程应用**：给定预算找产量最大化的人机配比

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 一阶条件：$0.6L^{-0.4}K^{0.4}=2\lambda$ 和 $0.4L^{0.6}K^{-0.6}=5\lambda$ |
| Step 2 | 195–240 | 两式相除：$\dfrac{0.6K}{0.4L}=\dfrac{2}{5}$ → $\dfrac{K}{L}=\dfrac{2\times0.4}{5\times0.6}=\dfrac{4}{15}$ |
| Step 3 | 240–285 | 代入约束：$2L+5\cdot\dfrac{4L}{15}=100$ → $2L+\dfrac{4L}{3}=100$ → $L=30$ |
| Step 4 | 285–330 | $K=\dfrac{4\times30}{15}=8$，最大产量 $Q=30^{0.6}\cdot8^{0.4}\approx 12.28$ 单位 |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：最优生产要素配置
  结果：L* = 30（人时），K* = 8（万元）
  最大产量：Q* ≈ 12.28 单位
  规律：最优时 (∂Q/∂L)/w = (∂Q/∂K)/r（单位成本边际产量相等）
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染生产函数曲面 Q=L^0.6·K^0.4（L∈[0,50],K∈[0,20]）
  - Plane3D 展示约束平面 2L+5K=100（垂直切面，半透明红）
  - ParametricCurve3D 绘制约束线上的 Q 轨迹（约束截线）
  - 最优点 (30,8,Q*) 红色高亮
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 生产优化 = 多元函数条件极值（拉格朗日乘子法）
✅ 经济学最优规则：边际技术替代率 = 要素价格比
✅ 工程延伸：多工序调度、多资源分配问题均属此类
```

---

### IM02：传感器测量误差传播分析

**文件名建议**：`Im02_ErrorPropagation.tsx`
**Composition ID**：`Ch09-IM02-ErrorPropagation`
**durationInFrames**：`450`（无3D，用2D误差椭圆图）

**工程背景**：
智能制造中，工件尺寸由多个传感器联合测量。例如，圆柱体体积 $V = \pi r^2 h$ 中，半径 $r$ 和高 $h$ 均有测量误差，全微分给出了体积误差的最坏估计，指导传感器精度的选型和布置。

**数学模型**：
$$dV = \frac{\partial V}{\partial r}dr + \frac{\partial V}{\partial h}dh = 2\pi rh\,dr + \pi r^2\,dh$$
$$\frac{dV}{V} = 2\frac{dr}{r} + \frac{dh}{h} \quad \text{（相对误差公式）}$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例2 · 圆柱体体积测量误差传播
  参数：r = 50mm（±0.1mm），h = 200mm（±0.2mm）
  问题：估算体积 V 的最大相对误差
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **工程背景**：精密零件检测，体积误差影响质量判定
2. 📐 **全微分方法**：$dV \approx \Delta V$（微小误差的线性近似）
3. ⚖️ **最坏情况**：取绝对值叠加 $|dV| \leq |2\pi rh||dr| + |\pi r^2||dh|$
4. 🎯 **相对误差**：除以 $V$ 得 $|\Delta V|/V \leq 2|\Delta r|/r + |\Delta h|/h$

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 计算 $V = \pi \times 50^2 \times 200 = 500000\pi \approx 1.571\times10^6$ mm³ |
| Step 2 | 195–240 | 绝对误差：$|dV| \leq 2\pi\times50\times200\times0.1 + \pi\times50^2\times0.2 = 2000\pi+500\pi = 2500\pi$ |
| Step 3 | 240–285 | 相对误差：$\dfrac{|dV|}{V} \leq \dfrac{2500\pi}{500000\pi} = 0.005 = 0.5\%$ |
| Step 4 | 285–330 | 分项：半径误差贡献 $2\times0.1/50=0.4\%$，高度误差贡献 $0.2/200=0.1\%$（半径更关键！） |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：误差传播结果
  公式：ΔV/V ≤ 2(Δr/r) + (Δh/h) = 0.4% + 0.1% = 0.5%
  工程结论：体积最大相对误差 0.5%；r 的测量精度对体积影响是 h 的4倍
  设计建议：优先提高半径测量精度
```

#### Stage 5（390–450帧，合并Stage6）：2D 误差贡献图
```
2D 条形图或饼图：
  显示各参数误差对总误差的贡献比例
  r 贡献：0.4%（80%），h 贡献：0.1%（20%）
  动画：条形从零逐帧增长，颜色区分
```

#### Stage 6（390–450帧）：总结
```
✅ 全微分 dV ≈ ΔV 是误差传播的线性近似工具
✅ 相对误差公式：ΔV/V ≤ Σ|系数|·(Δxi/xi)
✅ 工程价值：识别误差主导因素，优先提升关键传感器精度
```

---

### IM03：温度场梯度与热流方向

**文件名建议**：`Im03_ThermalGradient.tsx`
**Composition ID**：`Ch09-IM03-ThermalGradient`
**durationInFrames**：`540`

**工程背景**：
电子元器件散热设计中，温度场 $T(x,y,z)$ 的梯度方向指向温度上升最快的方向，而热流方向（傅里叶定律）与梯度反向。工程师通过计算梯度来确定冷却水道的最佳布置位置。

**数学模型**：
$$T(x,y,z) = 100 - 2x^2 - y^2 - z^2 \quad (\text{℃})$$
$$\nabla T = (-4x, -2y, -2z), \quad \text{热流方向} = -\nabla T = (4x, 2y, 2z)$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例3 · 散热器温度场梯度分析
  温度场：T(x,y,z) = 100 − 2x² − y² − z²（℃）
  问题：在热源点 P(1,2,1) 处，求梯度方向和热流方向（冷却水道应沿此方向布置）
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **物理意义**：梯度指向温度升高最快方向，冷却需沿热流方向（负梯度）
2. 📐 **梯度计算**：$\nabla T = (\partial T/\partial x, \partial T/\partial y, \partial T/\partial z)$
3. ⚖️ **方向导数**：沿任意方向 $\vec{l}$ 的温度变化率 = $\nabla T \cdot \hat{l}$
4. 🎯 **等温面**：$T=$ 常数的曲面，梯度与等温面垂直

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 三个偏导：$\partial T/\partial x=-4x$，$\partial T/\partial y=-2y$，$\partial T/\partial z=-2z$ |
| Step 2 | 195–240 | 在 $P(1,2,1)$：$\nabla T=(-4,-4,-2)$ |
| Step 3 | 240–285 | 梯度模长：$|\nabla T|=\sqrt{16+16+4}=6$，单位梯度：$\hat{n}=(-\tfrac{2}{3},-\tfrac{2}{3},-\tfrac{1}{3})$ |
| Step 4 | 285–330 | 热流方向（冷却方向）：$(4,4,2)/6=(\tfrac{2}{3},\tfrac{2}{3},\tfrac{1}{3})$，温度最大下降率 6℃/m |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：P(1,2,1) 处的热流分析
  梯度：∇T = (−4, −4, −2)（温度升高方向）
  热流方向：(4, 4, 2)，单位化 = (2/3, 2/3, 1/3)
  最大降温率：6 ℃/m
  等温面法向量 = 梯度方向
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染等温面 T=95（椭球面 2x²+y²+z²=5，半透明橙色）
  - 点 P(1,2,1) 红色高亮
  - AnimatedVector3D 绘制梯度向量 ∇T=(-4,-4,-2)（蓝色，指向温度升高）
  - AnimatedVector3D 绘制热流方向 (4,4,2)（金色，指向冷却方向）
  - 小箭头场：VectorField 显示周围梯度分布
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 梯度 ∇f 指向函数增大最快方向，模长 = 最大方向导数
✅ 热流方向 = 负梯度（傅里叶热传导定律）
✅ 工程应用：冷却液流道设计、温度传感器最优布置位置
```
