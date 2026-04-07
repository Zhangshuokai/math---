# 章节分集结构总览

> 同济高等数学第七版下册（第七章 ~ 第十二章）

---

## 目录索引

| 章节 | 文件夹名 | 文档链接 | 节数 | 实际总帧数 |
|------|----------|----------|------|-----------|
| 第七章：微分方程 | `Ch07_DifferentialEq` | [ch07-differential-equations.md](./ch07-differential-equations.md) | 9 节 | 3,810 帧 |
| 第八章：空间解析几何与向量代数 | `Ch08_VectorGeometry` | [ch08-vector-geometry.md](./ch08-vector-geometry.md) | 6 节 | 2,550 帧 |
| 第九章：多元函数微分法及其应用 | `Ch09_MultiVariable` | [ch09-multivariable-calculus.md](./ch09-multivariable-calculus.md) | 8 节 | 3,060 帧 |
| 第十章：重积分 | `Ch10_MultipleIntegral` | [ch10-multiple-integrals.md](./ch10-multiple-integrals.md) | 4 节 | 2,040 帧 |
| 第十一章：曲线积分与曲面积分 | `Ch11_LineAndSurface` | [ch11-curve-surface-integrals.md](./ch11-curve-surface-integrals.md) | 7 节 | 3,060 帧 |
| 第十二章：无穷级数 | `Ch12_Series` | [ch12-infinite-series.md](./ch12-infinite-series.md) | 7 节 | 3,420 帧 |
| **合计** | — | — | **41 节** | **17,940 帧** |

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
| — | **小计** | — | **3,810** | **127s** | | |

### 第八章：空间解析几何与向量代数（`Ch08_VectorGeometry`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 10 | `Ch08_Sec01_Vectors` | [Sec01_Vectors.tsx](../../src/compositions/Ch08_VectorGeometry/Sec01_Vectors.tsx) | 450 | 15s | 向量加法平行四边形法则 + 数乘 + 坐标分解 | |
| 11 | `Ch08_Sec02_Products` | [Sec02_Products.tsx](../../src/compositions/Ch08_VectorGeometry/Sec02_Products.tsx) | 540 | 18s | 点积夹角动画 + 叉积行列式 + 平行四边形面积可视化 | ⭐ |
| 12 | `Ch08_Sec03_Surfaces` | [Sec03_Surfaces.tsx](../../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx) | 300 | 10s | 球面/旋转面/柱面方程 | |
| 13 | `Ch08_Sec04_Curves` | [Sec04_Curves.tsx](../../src/compositions/Ch08_VectorGeometry/Sec04_Curves.tsx) | 300 | 10s | 螺旋线参数方程 + 投影 | |
| 14 | `Ch08_Sec05_Plane` | [Sec05_Plane.tsx](../../src/compositions/Ch08_VectorGeometry/Sec05_Plane.tsx) | 480 | 16s | 平面点法式推导 + 点到平面距离公式 | |
| 15 | `Ch08_Sec06_Line` | [Sec06_Line.tsx](../../src/compositions/Ch08_VectorGeometry/Sec06_Line.tsx) | 480 | 16s | 空间直线对称式/参数式 + 线面夹角 | |
| — | **小计** | — | **2,550** | **85s** | | |

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
| — | **小计** | — | **3,060** | **102s** | | |

### 第十章：重积分（`Ch10_MultipleIntegral`）

| # | Composition ID | 源文件 | 帧数 | 时长 | 内容概要 | 标注 |
|---|----------------|--------|------|------|---------|------|
| 24 | `Ch10_Sec01_Concept` | [Sec01_Concept.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec01_Concept.tsx) | 480 | 16s | 黎曼和矩形条 + 对称性消去动画 | |
| 25 | `Ch10_Sec02_Calc2D` | [Sec02_Calc2D.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec02_Calc2D.tsx) | 600 | 20s | 累次积分扫描线动画 + 极坐标变换 + e^(x²+y²) 例题 | ⭐ |
| 26 | `Ch10_Sec03_Triple` | [Sec03_Triple.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec03_Triple.tsx) | 480 | 16s | 柱坐标/球坐标变换图示 | |
| 27 | `Ch10_Sec04_Apps` | [Sec04_Apps.tsx](../../src/compositions/Ch10_MultipleIntegral/Sec04_Apps.tsx) | 480 | 16s | 曲面面积公式 + 质心标记动画 | |
| — | **小计** | — | **2,040** | **68s** | | |

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
| — | **小计** | — | **3,060** | **102s** | | |

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
| — | **小计** | — | **3,420** | **114s** | | |

---

## 完成度汇总

| 统计项 | 数值 |
|--------|------|
| 已注册 Composition 总数 | **41 个**（Root.tsx 中实装） |
| 完整动画（≥450 帧） | **26 个** |
| 基础动画（300 帧） | **15 个** |
| 总动画帧数 | **17,940 帧** |
| 当前动画总时长 | **598 秒（约 10 分钟）** |
| 预计最终教学视频内容 | **~350 分钟**（含旁白/习题扩展） |

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
