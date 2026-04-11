# 第十章 重积分 — 例题与 IM 案例设计

> **波兰尼认知路径**：从"切片求和"的物理直觉出发（把圆柱体切成薄片，每片面积×厚度）→ 建立二重积分 → 极坐标变换消除复杂边界 → 推广到三重积分和球坐标。
> 学生在接触 ∬ 符号之前，先看到3D切片动画，体会"无穷薄片叠加"的极限过程。

---

## 例题设计

### Ex01：极坐标下的二重积分

**Composition ID**：`Ch10-Ex01-PolarIntegral`
**durationInFrames**：`540`

**题目**：
> 计算 $\displaystyle\iint_D \sqrt{x^2+y^2}\,dA$，其中 $D$ 是圆 $x^2+y^2 \leq 4$（半径2的圆盘）。

**对应节**：§10.2 二重积分的计算法（极坐标）

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题1 · 极坐标二重积分
  被积函数：√(x²+y²)（到原点的距离）
  积分区域：圆盘 x²+y² ≤ 4
  几何直觉："对圆盘上每点到原点距离求积分"
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **圆形区域 + 含 √(x²+y²)**：天然适合极坐标变换
2. 📐 **极坐标换元**：$x=r\cos\theta$，$y=r\sin\theta$，$dA = r\,dr\,d\theta$，区域变为 $0\leq r\leq2$，$0\leq\theta\leq2\pi$
3. ⚖️ **被积函数化简**：$\sqrt{x^2+y^2}=r$，整个被积式变为 $r \cdot r\,dr\,d\theta = r^2\,dr\,d\theta$
4. 🎯 **化为累次积分**：先对 $r$ 积分，再对 $\theta$ 积分

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 换元：$\iint_D \sqrt{x^2+y^2}\,dA = \int_0^{2\pi}\int_0^2 r\cdot r\,dr\,d\theta = \int_0^{2\pi}\int_0^2 r^2\,dr\,d\theta$ |
| Step 2 | 195–240 | 内层积分：$\int_0^2 r^2\,dr = \left[\dfrac{r^3}{3}\right]_0^2 = \dfrac{8}{3}$ |
| Step 3 | 240–285 | 外层积分：$\int_0^{2\pi}\dfrac{8}{3}\,d\theta = \dfrac{8}{3}\times2\pi = \dfrac{16\pi}{3}$ |
| Step 4 | 285–330 | 物理验证：圆盘平均距离 $=\dfrac{16\pi/3}{\pi\times4}=\dfrac{4}{3}\approx1.33$（半径2圆盘，平均距离约为2/3半径，合理✓） |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：积分结果
  公式：∬_D √(x²+y²) dA = 16π/3
  换元公式：dA = r dr dθ（极坐标面积元素，含 Jacobi 行列式 r）
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染曲面 z=√(x²+y²)（锥面，x²+y²≤4，半透明金色）
  - 底部圆盘 D 用绿色填充（z=0 平面）
  - 动画：积分区域从中心向外径向扩展（drawProgress 驱动）
  - 用红色高亮一圈等 r 的同心圆弧（展示极坐标分割）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 极坐标换元适用：圆形/扇形区域，被积函数含 x²+y²
✅ 关键：dA = r dr dθ（不要忘记 Jacobi 因子 r）
✅ 结果 16π/3：圆盘上"距离函数"的总积累量
```

---

### Ex02：球坐标下的三重积分

**Composition ID**：`Ch10-Ex02-SphericalIntegral`
**durationInFrames**：`540`

**题目**：
> 计算 $\displaystyle\iiint_\Omega z\,dV$，其中 $\Omega$ 是上半球 $x^2+y^2+z^2 \leq 1$，$z \geq 0$。

**对应节**：§10.3 三重积分（球坐标换元）

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题2 · 球坐标三重积分
  被积函数：z（高度函数）
  积分区域：上半球 Ω（半径1，z≥0）
  几何直觉："对上半球内所有点的高度求积分"
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **球形区域**：首选球坐标 $x=\rho\sin\phi\cos\theta$，$y=\rho\sin\phi\sin\theta$，$z=\rho\cos\phi$
2. 📐 **区域变换**：$\Omega$ 变为 $0\leq\rho\leq1$，$0\leq\phi\leq\pi/2$，$0\leq\theta\leq2\pi$
3. ⚖️ **体积元素**：$dV = \rho^2\sin\phi\,d\rho\,d\phi\,d\theta$（Jacobi因子 $\rho^2\sin\phi$）
4. 🎯 **被积式化简**：$z=\rho\cos\phi$，整体 = $\rho^3\cos\phi\sin\phi\,d\rho\,d\phi\,d\theta$

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 换元：$\iiint_\Omega z\,dV = \int_0^{2\pi}\int_0^{\pi/2}\int_0^1 \rho\cos\phi\cdot\rho^2\sin\phi\,d\rho\,d\phi\,d\theta$ |
| Step 2 | 195–240 | $\rho$ 积分：$\int_0^1\rho^3\,d\rho=\tfrac{1}{4}$ |
| Step 3 | 240–285 | $\phi$ 积分：$\int_0^{\pi/2}\cos\phi\sin\phi\,d\phi=\int_0^{\pi/2}\tfrac{\sin2\phi}{2}\,d\phi=\tfrac{1}{2}$ |
| Step 4 | 285–330 | $\theta$ 积分：$\int_0^{2\pi}d\theta=2\pi$；总结果 $=\tfrac{1}{4}\times\tfrac{1}{2}\times2\pi=\dfrac{\pi}{4}$ |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：三重积分结果
  公式：∭_Ω z dV = π/4
  体积元素：dV = ρ² sinφ dρ dφ dθ
  物理含义：上半球各点高度之和（积分值/体积 = 平均高度 = 3/8）
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染上半球（半透明蓝色，ρ=1，φ∈[0,π/2]）
  - 动画：球坐标网格线（等ρ同心球壳，等φ纬线，等θ经线）逐帧显示
  - 用颜色映射（冷→暖）表示 z 值大小（顶部暖色，底部冷色）
  - AnimatedVector3D 标注坐标轴 ρ, φ, θ
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 球坐标适用：球形/半球/锥形区域，被积函数含 x²+y²+z²
✅ 三个 Jacobi 因子：ρ²sinφ（必须乘上，否则体积元不正确）
✅ 分离变量：ρ, φ, θ 各自独立积分，化简计算
```

---

### Ex03：二重积分计算薄板质心

**Composition ID**：`Ch10-Ex03-CenterOfMass`
**durationInFrames**：`540`

**题目**：
> 密度 $\rho(x,y)=x+y$ 的薄板，区域 $D: 0\leq x\leq1,\,0\leq y\leq1$，求质心坐标 $(\bar{x},\bar{y})$。

**对应节**：§10.4 重积分的应用

#### Stage 1（0–60帧）：展示题目
```
ExampleBox：
  标题：例题3 · 变密度薄板质心
  密度函数：ρ(x,y) = x + y（右上角密度最大）
  区域：单位正方形 D = [0,1] × [0,1]
  问题：质心 (x̄, ȳ) = ?
```

#### Stage 2（60–150帧）：审题分析
1. 🔍 **质心公式**：$\bar{x}=M_y/M$，$\bar{y}=M_x/M$，其中 $M=\iint_D\rho\,dA$
2. 📐 **静矩**：$M_y=\iint_D x\rho\,dA$，$M_x=\iint_D y\rho\,dA$
3. ⚖️ **对称性分析**：$\rho=x+y$ 关于 $y=x$ 对称 → $\bar{x}=\bar{y}$（质心在对角线上）
4. 🎯 **计算顺序**：先 $y$ 后 $x$（均匀上下限，顺序可换）

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 总质量：$M=\int_0^1\int_0^1(x+y)\,dy\,dx=\int_0^1(x+\tfrac{1}{2})dx=\tfrac{1}{2}+\tfrac{1}{2}=1$ |
| Step 2 | 195–240 | $M_y=\int_0^1\int_0^1 x(x+y)\,dy\,dx=\int_0^1(x^2+\tfrac{x}{2})dx=\tfrac{1}{3}+\tfrac{1}{4}=\tfrac{7}{12}$ |
| Step 3 | 240–285 | 由对称性：$M_x=\tfrac{7}{12}$（直接利用 $\rho$ 关于 $y=x$ 的对称性） |
| Step 4 | 285–330 | 质心：$\bar{x}=M_y/M=\tfrac{7}{12}$，$\bar{y}=\tfrac{7}{12}$（偏右偏上，符合密度分布直觉✓） |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：质心坐标
  公式：(x̄, ȳ) = (7/12, 7/12) ≈ (0.583, 0.583)
  说明：偏向密度较大的右上角（比几何中心 (0.5,0.5) 更靠右上）
  验证：利用对称性 x̄ = ȳ（ρ=x+y 关于 y=x 对称）
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染密度曲面 z=x+y（x,y∈[0,1]，暖色映射）
  - 底部正方形 D 颜色填充（密度热图）
  - 质心投影点 (7/12, 7/12) 在底面用红色圆点标注
  - 虚线从质心点垂直连接到密度曲面
  - 对角线 y=x 用白色虚线标注（对称轴）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 质心 = 加权平均位置，权重为密度分布
✅ 利用对称性减少计算量（ρ关于y=x对称 → x̄=ȳ）
✅ 工程应用：不均匀铸件的重心定位，影响平衡和装夹方案
```

---

## 智能制造（IM）应用案例

### IM01：复杂截面零件的惯性矩计算

**文件名建议**：`Im01_MomentOfInertia.tsx`
**Composition ID**：`Ch10-IM01-MomentOfInertia`
**durationInFrames**：`540`

**工程背景**：
机床主轴、齿轮盘等旋转零件的设计中，截面对旋转轴的惯性矩 $I$ 直接决定刚度和振动特性。二重积分是计算任意截面惯性矩的标准工具。

**数学模型**：
截面为圆环 $R_1^2 \leq x^2+y^2 \leq R_2^2$，均匀密度 $\rho_0$，对 $z$ 轴的极惯性矩：
$$I_z = \iint_D \rho_0(x^2+y^2)\,dA = \rho_0\int_0^{2\pi}\int_{R_1}^{R_2} r^2\cdot r\,dr\,d\theta = \frac{\rho_0\pi(R_2^4-R_1^4)}{2}$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例1 · 主轴截面极惯性矩
  截面：圆环，内径 R₁=20mm，外径 R₂=40mm
  密度：ρ₀ = 7.8×10⁻⁶ kg/mm³（钢）
  问题：求截面对旋转轴的极惯性矩 Iₓ
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **工程意义**：惯性矩越大，旋转时储存动能越多，振动抵抗力越强
2. 📐 **圆环区域 + x²+y²**：极坐标最简，$r$ 从 $R_1$ 到 $R_2$
3. ⚖️ **面积元**：$dA = r\,dr\,d\theta$，被积函数 $\rho_0 r^2$，整体 $\rho_0 r^3\,dr\,d\theta$
4. 🎯 **公式推导后直接代入数值**

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | $I_z=\rho_0\int_0^{2\pi}d\theta\int_{R_1}^{R_2}r^3\,dr = \rho_0\cdot2\pi\cdot\dfrac{R_2^4-R_1^4}{4}$ |
| Step 2 | 195–240 | 化简：$I_z = \dfrac{\rho_0\pi(R_2^4-R_1^4)}{2}$ |
| Step 3 | 240–285 | 代入：$R_1=20, R_2=40$：$R_2^4-R_1^4 = 2560000-160000 = 2400000$ mm⁴ |
| Step 4 | 285–330 | $I_z = \dfrac{7.8\times10^{-6}\times\pi\times2400000}{2} \approx 0.02945\times\pi \approx 29.45\pi\times10^{-3}$ kg·mm² |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：圆环截面极惯性矩
  公式：I_z = ρ₀π(R₂⁴ − R₁⁴)/2
  数值：I_z ≈ 92.5×10⁻³ kg·mm²
  工程含义：比实心圆 I_solid = ρ₀πR₂⁴/2 轻 (R₁/R₂)⁴ = 6.25% 的质量，但惯性矩损失仅6.25%
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染圆环截面（z=0平面，圆环形区域，金色）
  - r 从 R₁ 扫到 R₂ 的动画（极坐标扫描，drawProgress驱动）
  - 积分元素 r³Δr 用高度条形表示（截面内径向分布）
  - 中心轴（z轴）用虚线标注
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 极惯性矩 = 质量对转轴距离平方的积分
✅ 圆环结构：材料利用率高，单位质量惯性矩比实心圆大
✅ 工程规律：增大外径 R₂ 比增大材料密度更有效（R₂⁴次方效应）
```

---

### IM02：铸造工件体积与质量计算

**文件名建议**：`Im02_CastingVolume.tsx`
**Composition ID**：`Ch10-IM02-CastingVolume`
**durationInFrames**：`540`

**工程背景**：
铸造工艺中，熔融金属注入砂型后形成的工件形状通常由曲面围成。精确计算工件体积是控制材料用量、预测重量、核算成本的基础。三重积分提供了通用计算方法。

**数学模型**：
工件由抛物面 $z=x^2+y^2$ 和平面 $z=4$ 围成的区域：
$$V = \iiint_\Omega dV = \int_0^{2\pi}\int_0^2\int_{r^2}^4 r\,dz\,dr\,d\theta = \int_0^{2\pi}\int_0^2(4-r^2)r\,dr\,d\theta$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例2 · 铸件体积精确计算
  形状：抛物面 z=x²+y² 与平面 z=4 围成的旋转体
  材料：铝合金，密度 2.7×10⁻³ g/mm³
  问题：求该铸件的体积 V 和质量 m
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **截面法思路**：固定 $z=c$ 切片，截面为圆盘 $x^2+y^2\leq c$，面积 $\pi c$
2. 📐 **柱坐标方案**：旋转体形状 → 柱坐标，$z$ 从 $r^2$ 积到 $4$
3. ⚖️ **积分次序**：先 $z$（消去 $z$ 变量），再 $r$，最后 $\theta$（旋转对称）
4. 🎯 **尺寸单位**：题目中 $x,y,z$ 单位均为 cm（实际工件尺寸需换算）

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 柱坐标换元，先对 $z$：$\int_{r^2}^4 dz = 4-r^2$ |
| Step 2 | 195–240 | 对 $r$：$\int_0^2(4-r^2)r\,dr=\int_0^2(4r-r^3)dr=[2r^2-\tfrac{r^4}{4}]_0^2=8-4=4$ |
| Step 3 | 240–285 | 对 $\theta$：$\int_0^{2\pi}4\,d\theta=8\pi$ |
| Step 4 | 285–330 | 体积 $V=8\pi\approx25.13$ cm³；质量 $m=\rho V=2.7\times25.13\approx67.85$ g |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：铸件参数
  体积：V = 8π ≈ 25.13 cm³
  质量：m = 2.7 × 8π ≈ 67.85 g
  计算技巧：先对 z 积分消去一维，利用旋转对称简化 θ 积分
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染抛物面 z=x²+y²（绿色，r∈[0,2]）
  - SurfaceMesh3D 渲染顶部平面 z=4（蓝色，r∈[0,2]）
  - 两曲面围成的内部空间填充半透明金属色（铸件形状）
  - 动画：从底部切片动画展示积分过程（z从0到4扫描）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 旋转体积分：优先柱坐标（θ积分直接贡献2π因子）
✅ 先对z积分（内层）消去z变量，得到截面面积函数
✅ 工程应用：CAD/CAM中体积计算的数学基础
```

---

### IM03：工件重心定位与装夹方案

**文件名建议**：`Im03_WorkpieceCOM.tsx`
**Composition ID**：`Ch10-IM03-WorkpieceCOM`
**durationInFrames**：`540`

**工程背景**：
精密加工中，工件的夹具设计需要知道重心位置。如果夹具安装点远离重心，则切削力会产生力矩，导致工件翻转或振动。通过三重积分计算不均匀材料工件的精确重心，是智能夹具设计的基础。

**数学模型**：
半球形工件，密度 $\rho(x,y,z)=z+1$（底部轻，顶部重），$\Omega: x^2+y^2+z^2\leq1, z\geq0$：
$$\bar{z} = \frac{\iiint_\Omega z(z+1)\,dV}{\iiint_\Omega (z+1)\,dV}$$

#### Stage 1（0–60帧）：题目展示
```
ExampleBox：
  标题：IM案例3 · 变密度半球工件重心计算
  工件：半径 R=1 的半球，密度 ρ(x,y,z) = z+1（顶部密度大）
  问题：重心高度 z̄ = ?（确定最优夹持高度）
```

#### Stage 2（60–150帧）：审题分析
1. 🏭 **工程意义**：夹具夹持点应接近重心高度，最小化力矩
2. 📐 **球坐标换元**：半球 + 含 z = ρcosφ，球坐标最优
3. ⚖️ **两个积分**：分别计算分子（z矩）和分母（总质量）
4. 🎯 **对称性**：密度 $\rho=z+1$ 关于 $z$ 轴对称，故 $\bar{x}=\bar{y}=0$，只需算 $\bar{z}$

#### Stage 3（150–330帧）：分步计算
| 步骤 | 帧区间 | 内容 |
|------|--------|------|
| Step 1 | 150–195 | 总质量 $M=\iiint(z+1)dV=\int_0^{2\pi}\int_0^{\pi/2}\int_0^1(\rho\cos\phi+1)\rho^2\sin\phi\,d\rho\,d\phi\,d\theta$ |
| Step 2 | 195–240 | 分离计算：$M=2\pi[\int_0^1\rho^3d\rho\cdot\int_0^{\pi/2}\cos\phi\sin\phi\,d\phi + \int_0^1\rho^2d\rho\cdot\int_0^{\pi/2}\sin\phi\,d\phi]=2\pi[\tfrac{1}{8}+\tfrac{1}{3}]=\dfrac{11\pi}{12}$ |
| Step 3 | 240–285 | 分子 $N=\iiint z(z+1)dV=2\pi[\int_0^1\rho^4d\rho\cdot\int_0^{\pi/2}\cos^2\phi\sin\phi\,d\phi+\int_0^1\rho^3d\rho\cdot\int_0^{\pi/2}\cos\phi\sin\phi\,d\phi]$ |
| Step 4 | 285–330 | $N=2\pi[\tfrac{1}{5}\cdot\tfrac{1}{3}+\tfrac{1}{4}\cdot\tfrac{1}{2}]=2\pi[\tfrac{1}{15}+\tfrac{1}{8}]=2\pi\cdot\tfrac{23}{120}=\dfrac{23\pi}{60}$；$\bar{z}=N/M=\dfrac{23\pi/60}{11\pi/12}=\dfrac{23}{55}\approx0.418$ |

#### Stage 4（330–390帧）：TheoremBox 结论
```
TheoremBox：
  标题：重心位置
  公式：z̄ = 23/55 ≈ 0.418（均匀半球重心为 3/8=0.375）
  物理解释：顶部密度更大，重心比均匀情况更高
  夹具建议：夹持高度设在 z ≈ 0.42R 处最稳定
```

#### Stage 5（390–480帧）：3D 可视化
```
CoordinateSystem3D（rotateY: 0→360）：
  - SurfaceMesh3D 渲染半球（颜色随 z 渐变：底部蓝色→顶部红色，表示密度分布）
  - z=z̄ 处绘制水平截面（金色圆盘，半透明）
  - 重心点 (0,0,z̄) 用金色大圆点高亮，标注坐标
  - 对比：均匀半球重心 z=3/8（白色虚线）
  - 旋转驱动：rotateY = interpolate(frame,[390,480],[0,360],clamp)
```

#### Stage 6（480–540帧）：总结
```
✅ 变密度重心 = 加权积分除以总质量
✅ 利用轴对称性：只需计算 z̄，x̄=ȳ=0 自动成立
✅ 工程价值：重心定位精度直接影响加工精度和夹具安全性
```
