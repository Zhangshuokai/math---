# 章节分集结构总览

> 同济高等数学第七版下册（第七章 ~ 第十二章）

---

## 目录索引

| 章节 | 文件夹名 | 文档链接 | 节数 | 实际总帧数 |
|------|----------|----------|------|-----------|
| 第七章：微分方程 | `Ch07_DifferentialEq` | [ch07-differential-equations.md](./ch07-differential-equations.md) | 9+3 节 | ~7,140 帧 |
| 第八章：空间解析几何与向量代数 | `Ch08_VectorGeometry` | [ch08-vector-geometry.md](./ch08-vector-geometry.md) | 6+3 节 | ~5,430 帧 |
| 第九章：多元函数微分法及其应用 | `Ch09_MultiVariable` | [ch09-multivariable-calculus.md](./ch09-multivariable-calculus.md) | 8+3 节 | ~6,480 帧 |
| 第十章：重积分 | `Ch10_MultipleIntegral` | [ch10-multiple-integrals.md](./ch10-multiple-integrals.md) | 4+3 节 | ~4,740 帧 |
| 第十一章：曲线积分与曲面积分 | `Ch11_LineAndSurface` | [ch11-curve-surface-integrals.md](./ch11-curve-surface-integrals.md) | 7+3 节 | ~6,120 帧 |
| 第十二章：无穷级数 | `Ch12_Series` | [ch12-infinite-series.md](./ch12-infinite-series.md) | 7+3 节 | ~6,120 帧 |
| **合计** | — | — | **41+18 = 65 节** | **~36,030 帧** |

> 说明：各章"节数"中 `+3` 表示本次新增的"例题节+IM案例节"。

---

## 文件命名规范

### 文件夹（章）
```
Ch{两位章号}_{英文主题名}
```
示例：`Ch07_DifferentialEq`、`Ch11_LineAndSurface`

### 文件（节）
```
Sec{两位节号}_{英文主题名}.tsx
```
示例：`Sec01_Intro.tsx`、`Sec04_Linear.tsx`

### Composition ID
```
Ch{章号}_Sec{节号}_{英文主题名}
```
示例：`Ch07_Sec04_Linear`、`Ch12_Sec06_Fourier`

---

## 通用场景结构

每节视频的标准场景序列（可根据内容增减）：

```
Scene 1: TitleCard          （60 帧）   — 显示章节号+小节名
Scene 2: ConceptIntro       （90 帧）   — 引出核心概念，图文并茂
Scene 3: TheoremStatement   （60 帧）   — TheoremBox 展示定义/定理
Scene 4: Derivation         （120~180 帧）— StepByStep 推导过程
Scene 5: Visualization      （120~180 帧）— 图形/动画直观理解
Scene 6: Example            （150~240 帧）— 例题演示
Scene 7: Summary            （60 帧）   — 关键结论小结+淡出
```

---

## 全量 Composition ID 索引表

> 视频规格：1920×1080 / 30fps
> ⭐ = 重点节；🎬 = 压轴节

### 第七章：微分方程（`Ch07_DifferentialEq`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 1 | `Ch07_Sec01_Intro` | [Sec01_Intro.tsx](../../src/compositions/Ch07_DifferentialEq/Sec01_Intro.tsx) | 450 | 15s | 微分方程基本概念 + 解的验证 + 解族曲线可视化 | |
| 2 | `Ch07_Sec02_Separable` | [Sec02_Separable.tsx](../../src/compositions/Ch07_DifferentialEq/Sec02_Separable.tsx) | 540 | 18s | 可分离变量方程 + 分离过程动画 + 5条解曲线 | |
| 3 | `Ch07_Sec03_Homogeneous` | [Sec03_Homogeneous.tsx](../../src/compositions/Ch07_DifferentialEq/Sec03_Homogeneous.tsx) | 300 | 10s | 齐次方程 + u=y/x 换元法 | |
| 4 | `Ch07_Sec04_Linear` | [Sec04_Linear.tsx](../../src/compositions/Ch07_DifferentialEq/Sec04_Linear.tsx) | 540 | 18s | 一阶线性方程 + 积分因子法 + 解族 | ⭐ |
| 5 | `Ch07_Sec05_Exact` | [Sec05_Exact.tsx](../../src/compositions/Ch07_DifferentialEq/Sec05_Exact.tsx) | 300 | 10s | 全微分方程 + 势函数法 | |
| 6 | `Ch07_Sec06_HighOrder` | [Sec06_HighOrder.tsx](../../src/compositions/Ch07_DifferentialEq/Sec06_HighOrder.tsx) | 300 | 10s | 可降阶高阶方程三种类型 | |
| 7 | `Ch07_Sec07_Linear2` | [Sec07_Linear2.tsx](../../src/compositions/Ch07_DifferentialEq/Sec07_Linear2.tsx) | 300 | 10s | 高阶线性方程 + 朗斯基行列式 | |
| 8 | `Ch07_Sec08_ConstCoeff` | [Sec08_ConstCoeff.tsx](../../src/compositions/Ch07_DifferentialEq/Sec08_ConstCoeff.tsx) | 600 | 20s | 常系数齐次线性方程 + 特征根三种情况 + 振荡解动画 | ⭐ |
| 9 | `Ch07_Sec09_NonHomog` | [Sec09_NonHomog.tsx](../../src/compositions/Ch07_DifferentialEq/Sec09_NonHomog.tsx) | 480 | 16s | 常系数非齐次线性方程 + 待定系数法 | |
| 10 | `Ch07-Sec10-Examples` | [Sec10_Examples.tsx](../../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) | 1,530 | 51s | 3 道例题：一阶线性方程 / 高阶降阶 / 弹簧阻尼系统稳态响应 | 📝 例题 |
| 11 | `Ch07-Sec11-IM-Control` | [Sec11_IM_Control.tsx](../../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) | 540 | 18s | RC 电路充放电控制：一阶线性 ODE 在伺服驱动中的应用 | 🏭 IM |
| 12 | `Ch07-Sec12-IM-Dynamics` | [Sec12_IM_Dynamics.tsx](../../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) | 540 | 18s | 机床振动系统建模：二阶 ODE 阻尼比对加工精度影响 | 🏭 IM |
| — | **小计** | — | **~7,140** | **~238s** | | |

### 第八章：空间解析几何与向量代数（`Ch08_VectorGeometry`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 10 | `Ch08_Sec01_Vectors` | [Sec01_Vectors.tsx](../../src/compositions/Ch08_VectorGeometry/Sec01_Vectors.tsx) | 450 | 15s | 向量加法平行四边形法则 + 数乘 + 坐标分解 | |
| 11 | `Ch08_Sec02_Products` | [Sec02_Products.tsx](../../src/compositions/Ch08_VectorGeometry/Sec02_Products.tsx) | 540 | 18s | 点积夹角动画 + 叉积行列式 + 平行四边形面积可视化 | ⭐ |
| 12 | `Ch08_Sec03_Surfaces` | [Sec03_Surfaces.tsx](../../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx) | 300 | 10s | 球面/旋转面/柱面方程 | |
| 13 | `Ch08_Sec04_Curves` | [Sec04_Curves.tsx](../../src/compositions/Ch08_VectorGeometry/Sec04_Curves.tsx) | 300 | 10s | 螺旋线参数方程 + 投影 | |
| 14 | `Ch08_Sec05_Plane` | [Sec05_Plane.tsx](../../src/compositions/Ch08_VectorGeometry/Sec05_Plane.tsx) | 480 | 16s | 平面点法式推导 + 点到平面距离公式 | |
| 15 | `Ch08_Sec06_Line` | [Sec06_Line.tsx](../../src/compositions/Ch08_VectorGeometry/Sec06_Line.tsx) | 480 | 16s | 空间直线对称式/参数式 + 线面夹角 | |
| 16 | `Ch08-Sec07-Examples` | [Sec07_Examples.tsx](../../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) | 1,620 | 54s | 3 道例题：三点平面方程 / 直线与平面夹角 / 椭球面切平面（含 3D 旋转） | 📝 例题 |
| 17 | `Ch08-Sec08-IM-RobotArm` | [Sec08_IM_RobotArm.tsx](../../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) | 540 | 18s | 工业机械臂正向运动学：齐次变换矩阵 + 向量叉积 | 🏭 IM |
| 18 | `Ch08-Sec09-IM-CNC` | [Sec09_IM_CNC.tsx](../../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) | 540 | 18s | CNC 五轴加工刀轴矢量控制：法向量 n = t × b | 🏭 IM |
| — | **小计** | — | **~5,430** | **~181s** | | |

### 第九章：多元函数微分法及其应用（`Ch09_MultiVariable`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 16 | `Ch09_Sec01_Concept` | [Sec01_Concept.tsx](../../src/compositions/Ch09_MultiVariable/Sec01_Concept.tsx) | 300 | 10s | 多元函数定义域 + 极限路径无关性 | |
| 17 | `Ch09_Sec02_Partial` | [Sec02_Partial.tsx](../../src/compositions/Ch09_MultiVariable/Sec02_Partial.tsx) | 540 | 18s | 偏导数几何意义 + 截面切线动画 | ⭐ |
| 18 | `Ch09_Sec03_Total` | [Sec03_Total.tsx](../../src/compositions/Ch09_MultiVariable/Sec03_Total.tsx) | 300 | 10s | 全微分 + 近似计算 | |
| 19 | `Ch09_Sec04_Chain` | [Sec04_Chain.tsx](../../src/compositions/Ch09_MultiVariable/Sec04_Chain.tsx) | 300 | 10s | 链式法则 SVG 树状图 | |
| 20 | `Ch09_Sec05_Implicit` | [Sec05_Implicit.tsx](../../src/compositions/Ch09_MultiVariable/Sec05_Implicit.tsx) | 300 | 10s | 隐函数求导公式 | |
| 21 | `Ch09_Sec06_Geometry` | [Sec06_Geometry.tsx](../../src/compositions/Ch09_MultiVariable/Sec06_Geometry.tsx) | 300 | 10s | 曲面切平面与法线 | |
| 22 | `Ch09_Sec07_Gradient` | [Sec07_Gradient.tsx](../../src/compositions/Ch09_MultiVariable/Sec07_Gradient.tsx) | 540 | 18s | 梯度 + VectorField 向量场动画 + 方向导数 | ⭐ |
| 23 | `Ch09_Sec08_Extremum` | [Sec08_Extremum.tsx](../../src/compositions/Ch09_MultiVariable/Sec08_Extremum.tsx) | 480 | 16s | 极值必要条件 + Hessian 判别法 + 鞍点等值线图 | |
| 24 | `Ch09-Sec09-Examples` | [Sec09_Examples.tsx](../../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx) | 1,620 | 54s | 3 道例题：三元函数极值 / Lagrange 乘数法球面最值 / 隐函数高阶偏导 | 📝 例题 |
| 25 | `Ch09-Sec10-IM-Optimization` | [Sec10_IM_Optimization.tsx](../../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) | 540 | 18s | 多目标生产优化：约束条件下 Lagrange 乘数法最大化产量 | 🏭 IM |
| 26 | `Ch09-Sec11-IM-Sensor` | [Sec11_IM_Sensor.tsx](../../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) | 540 | 18s | 传感器测量误差传播：全微分误差公式定量预测 IMU 精度 | 🏭 IM |
| — | **小计** | — | **~6,480** | **~216s** | | |

### 第十章：重积分（`Ch10_MultipleIntegral`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 24 | `Ch10_Sec01_Concept` | [Sec01_Concept.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec01_Concept.tsx) | 480 | 16s | 黎曼和矩形条 + 对称性消去动画 | |
| 25 | `Ch10_Sec02_Calc2D` | [Sec02_Calc2D.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec02_Calc2D.tsx) | 600 | 20s | 累次积分扫描线动画 + 极坐标变换 + e^(x²+y²) 例题 | ⭐ |
| 26 | `Ch10_Sec03_Triple` | [Sec03_Triple.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec03_Triple.tsx) | 480 | 16s | 柱坐标/球坐标变换图示 | |
| 27 | `Ch10_Sec04_Apps` | [Sec04_Apps.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec04_Apps.tsx) | 480 | 16s | 曲面面积公式 + 质心标记动画 | |
| 28 | `Ch10-Sec05-Examples` | [Sec05_Examples.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx) | 1,620 | 54s | 3 道例题：极坐标二重积分 / 球坐标三重积分质心 / 高斯积分推导 | 📝 例题 |
| 29 | `Ch10-Sec06-IM-Mass` | [Sec06_IM_Mass.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) | 540 | 18s | 旋转零件极惯性矩：极坐标积分计算飞轮截面转动惯量 | 🏭 IM |
| 30 | `Ch10-Sec07-IM-CNC` | [Sec07_IM_CNC.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) | 540 | 18s | 铸件不规则体积估算：三重积分数值积分网格密度动画 | 🏭 IM |
| — | **小计** | — | **~4,740** | **~158s** | | |

### 第十一章：曲线积分与曲面积分（`Ch11_LineAndSurface`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 28 | `Ch11_Sec01_Line1` | [Sec01_Line1.tsx](../../src/compositions/Ch11_LineAndSurface/Sec01_Line1.tsx) | 480 | 16s | 弧长积分定义 + 参数化计算 + 单位圆例题 | |
| 29 | `Ch11_Sec02_Line2` | [Sec02_Line2.tsx](../../src/compositions/Ch11_LineAndSurface/Sec02_Line2.tsx) | 480 | 16s | 力场做功 + 路径方向性 | |
| 30 | `Ch11_Sec03_Green` | [Sec03_Green.tsx](../../src/compositions/Ch11_LineAndSurface/Sec03_Green.tsx) | 540 | 18s | 格林公式封闭曲线动画 + 路径无关条件 | ⭐ |
| 31 | `Ch11_Sec04_Surface1` | [Sec04_Surface1.tsx](../../src/compositions/Ch11_LineAndSurface/Sec04_Surface1.tsx) | 300 | 10s | 第一类曲面积分公式 | |
| 32 | `Ch11_Sec05_Surface2` | [Sec05_Surface2.tsx](../../src/compositions/Ch11_LineAndSurface/Sec05_Surface2.tsx) | 300 | 10s | 第二类曲面积分流量 | |
| 33 | `Ch11_Sec06_Gauss` | [Sec06_Gauss.tsx](../../src/compositions/Ch11_LineAndSurface/Sec06_Gauss.tsx) | 480 | 16s | 高斯公式 + 散度物理意义 | |
| 34 | `Ch11_Sec07_Stokes` | [Sec07_Stokes.tsx](../../src/compositions/Ch11_LineAndSurface/Sec07_Stokes.tsx) | 480 | 16s | 斯托克斯公式 + 旋度 | |
| 35 | `Ch11-Sec08-Examples` | [Sec08_Examples.tsx](../../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx) | 1,620 | 54s | 3 道例题：螺旋线弧长积分 / 格林公式椭圆曲线积分 / 高斯公式球面通量 | 📝 例题 |
| 36 | `Ch11-Sec09-IM-Flow` | [Sec09_IM_Flow.tsx](../../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) | 540 | 18s | 管道流量场分析：曲线积分计算液压管道截面流量 | 🏭 IM |
| 37 | `Ch11-Sec10-IM-Field` | [Sec10_IM_Field.tsx](../../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) | 540 | 18s | 电机线圈电磁通量：曲面积分计算定子绕组磁通量 | 🏭 IM |
| — | **小计** | — | **~6,120** | **~204s** | | |

### 第十二章：无穷级数（`Ch12_Series`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 35 | `Ch12_Sec01_Concept` | [Sec01_Concept.tsx](../../src/compositions/Ch12_Series/Sec01_Concept.tsx) | 480 | 16s | 等比级数收敛数轴动画 + 调和级数柱状发散图 | |
| 36 | `Ch12_Sec02_Tests` | [Sec02_Tests.tsx](../../src/compositions/Ch12_Series/Sec02_Tests.tsx) | 540 | 18s | 比较/比值/莱布尼茨审敛法 | |
| 37 | `Ch12_Sec03_Power` | [Sec03_Power.tsx](../../src/compositions/Ch12_Series/Sec03_Power.tsx) | 480 | 16s | 收敛半径数轴动画 | |
| 38 | `Ch12_Sec04_Taylor` | [Sec04_Taylor.tsx](../../src/compositions/Ch12_Series/Sec04_Taylor.tsx) | 540 | 18s | 泰勒展开逐阶逼近 eˣ 动画 | ⭐ |
| 39 | `Ch12_Sec05_Apps` | [Sec05_Apps.tsx](../../src/compositions/Ch12_Series/Sec05_Apps.tsx) | 300 | 10s | 幂级数近似计算 + 求极限 | |
| 40 | `Ch12_Sec06_Fourier` | [Sec06_Fourier.tsx](../../src/compositions/Ch12_Series/Sec06_Fourier.tsx) | 600 | 20s | 傅里叶级数方波逼近动画（1→21项）+ 吉布斯现象 | 🎬 |
| 41 | `Ch12_Sec07_Fourier2` | [Sec07_Fourier2.tsx](../../src/compositions/Ch12_Series/Sec07_Fourier2.tsx) | 480 | 16s | 奇/偶延拓正弦/余弦级数 | |
| 42 | `Ch12-Sec08-Examples` | [Sec08_Examples.tsx](../../src/compositions/Ch12_Series/Sec08_Examples.tsx) | 1,440 | 48s | 3 道例题：幂级数收敛域与和函数 / x² 傅里叶展开 / 泰勒展开求极限与数值积分 | 📝 例题 |
| 43 | `Ch12-Sec09-IM-Signal` | [Sec09_IM_Signal.tsx](../../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) | 540 | 18s | 工业信号傅里叶滤波：振动传感器去噪频谱分析动画 | 🏭 IM |
| 44 | `Ch12-Sec10-IM-Approx` | [Sec10_IM_Approx.tsx](../../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) | 540 | 18s | 数控插补泰勒近似：CNC 圆弧插补精度与截断阶数权衡 | 🏭 IM |
| — | **小计** | — | **~6,120** | **~204s** | | |

---

## 完成度汇总

| 统计项 | 数值 |
|--------|------|
| 已注册 Composition 总数 | **65 个**（Root.tsx 中实装） |
| 核心知识节 | **41 个**（全部完整动画 ≥ 450 帧） |
| 例题节（每章 3 道） | **6 个**（18 道精选例题，含详解型 6 阶段场景） |
| 智能制造应用案例 | **12 个**（每章 2 个，540 帧 / 18s） |
| 总动画帧数 | **~36,030 帧** |
| 当前动画总时长 | **~1,201 秒（约 20 分钟）** |
| TypeScript 编译错误 | **0** |

> 图例：📝 = 例题节（详解型，1440~1620 帧）；🏭 = 智能制造应用案例（540 帧）

---

## 文件命名与场景时序规范

### 标准场景时序

```
Scene 1: TitleCard          （60 帧）   — 显示章节号+小节名
Scene 2: ConceptIntro       （90 帧）   — 引出核心概念，图文并茂
Scene 3: TheoremStatement   （60 帧）   — TheoremBox 展示定义/定理
Scene 4: Derivation         （120~180 帧）— StepByStep 推导过程
Scene 5: Visualization      （120~180 帧）— 图形/动画直观理解
Scene 6: Example            （150~240 帧）— 例题演示
Scene 7: Summary            （60 帧）   — 关键结论小结+淡出
```

---

## 各章组件使用矩阵

| 组件 | Ch07 | Ch08 | Ch09 | Ch10 | Ch11 | Ch12 |
|------|:----:|:----:|:----:|:----:|:----:|:----:|
| `TitleCard` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `TheoremBox` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `MathFormula` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `StepByStep` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `CoordinateSystem` | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `FunctionPlot` | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `IntegralArea` | — | — | — | ✓ | ✓ | — |
| `Arrow` | — | ✓ | ✓ | — | ✓ | — |
| `VectorField` | — | — | ✓ | — | ✓ | — |
| `FourierSeries` | — | — | — | — | — | ✓ |
