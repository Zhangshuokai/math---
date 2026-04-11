# 开发会话总结文档（2026-04-11）

> 同济高等数学第七版下册 Remotion 动画教学项目 · 3D 旋转矩阵修复 + Polanyi 默会知识深化总结

---

## 目录

1. [会话概览](#1-会话概览)
2. [关键问题诊断](#2-关键问题诊断)
3. [技术改进详情：3D 旋转矩阵重构](#3-技术改进详情3d-旋转矩阵重构)
4. [各章节内容深化改进](#4-各章节内容深化改进)
5. [质量检查结果](#5-质量检查结果)
6. [Polanyi 默会知识可视化总结](#6-polanyi-默会知识可视化总结)
7. [遗留问题与后续建议](#7-遗留问题与后续建议)
8. [文件变更清单](#8-文件变更清单)

---

## 1. 会话概览

| 项目 | 内容 |
|------|------|
| **日期** | 2026-04-11 |
| **子任务数** | 12（ST1–ST12） |
| **核心目标** | 修复 3D 旋转渲染 Bug + 深化所有章节的 Polanyi 默会知识可视化 |
| **完成度** | ✅ 全部 12 个子任务完成 |
| **TypeScript 编译** | ✅ 0 错误 |
| **Composition 总数** | 65（维持不变，更新 durationInFrames 6 处） |

### 本轮工作重点

前序会话（20260410）已完成 65 个 Composition 注册与基础内容。本轮重点：

1. **根治 3D 旋转 Bug**：发现并修复 `CoordinateSystem3D.tsx` 等轴测投影无旋转参数、18+ 个文件 CSS `rotateY()` "纸片翻转"问题
2. **内容质量深化**：将 18 个例题/IM 文件内容升级为更贴近工程直觉的 Polanyi 默会知识可视化版本
3. **规范性修复**：消除 2 处双重 `withWatermark` 包裹（P1 级别 Bug）

---

## 2. 关键问题诊断

### 2.1 BUG-001/002：CoordinateSystem3D 等轴测投影无旋转参数（P0）

**现象**：所有使用 [`CoordinateSystem3D`](../src/components/math/CoordinateSystem3D.tsx) 的组件，传入 `rotationY` prop 后 3D 坐标系外观完全不变化。

**根因**：原 `toISO()` 函数使用硬编码的等轴测常量（`COS30`、`SIN30`），将 3D 点映射到 2D 时完全忽略旋转参数：

```ts
// ❌ 原实现（伪代码）：硬编码等轴测，旋转参数被忽略
function toISO(x: number, y: number, z: number): [number, number] {
  return [
    cx + (x - z) * COS30 * scale,
    cy - y * scale + (x + z) * SIN30 * scale,
  ];
}
```

**影响范围**：全部 3D 旋转场景均表现为静态等轴测图，无法从多视角理解空间关系。

### 2.2 BUG-003：18+ 个文件使用 CSS rotateY() 包裹整个 SVG（P0）

**现象**：组件在 Remotion 服务端按帧渲染时，整个 SVG 元素绕 Y 轴翻转，产生"纸片翻转"效果——轴标签、公式均随 SVG 一起镜像翻转，空间感完全丧失。

**根因**：开发者误将前端 CSS transform 当作 3D 旋转手段，而非对 3D 点坐标进行矩阵变换后再投影。

**影响文件**：Ch07（3个）、Ch08（3个）、Ch09（3个）、Ch10（3个）、Ch11（3个）、Ch12（3个），共 18+ 个文件。

### 2.3 BUG-004：双重 withWatermark 包裹（P1）

**现象**：`Ch07-Sec10-Examples` 和 `Ch08-Sec07-Examples` 的水印在渲染视频中出现两次（叠加显示）。

**根因**：文件内部已调用 `withWatermark()` 导出，[`Root.tsx`](../src/Root.tsx) 顶层又再次包裹，形成双重嵌套。

---

## 3. 技术改进详情：3D 旋转矩阵重构

### 3.1 核心修复：makeToISO() 函数

在 [`CoordinateSystem3D.tsx`](../src/components/math/CoordinateSystem3D.tsx) 中新增 `rotationX`（默认 π/6）和 `rotationY`（默认 π/4）props，实现真实旋转矩阵投影：

```ts
// ✅ 新实现：先应用 Ry·Rx 旋转矩阵，再做正交投影
function makeToISO(
  rotationX: number,
  rotationY: number,
  cx: number,
  cy: number,
  scale: number
) {
  const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
  const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);

  return (x: number, y: number, z: number): [number, number] => {
    // Step 1: 绕 Y 轴旋转（Ry）
    const x1 =  x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;

    // Step 2: 绕 X 轴旋转（Rx）
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;   // z2 用于深度，暂不使用

    // Step 3: 正交投影到 2D 屏幕
    return [cx + x1 * scale, cy - y2 * scale];
  };
}
```

### 3.2 调用方式（Composition 侧）

```tsx
// 帧驱动旋转，传递给 CoordinateSystem3D
const frame = useCurrentFrame();
const rotateY = interpolate(frame, [sceneStart, sceneStart + 90], [0, Math.PI * 2], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

<CoordinateSystem3D
  rotationX={Math.PI / 6}
  rotationY={rotateY}
  width={500}
  height={400}
  scale={80}
/>
```

### 3.3 CSS rotateY 批量清除

将 18+ 个文件中的模式：

```tsx
// ❌ 错误：CSS 包裹整个 SVG 产生"纸片翻转"
<div style={{ transform: `rotateY(${rotateY}deg)` }}>
  <CoordinateSystem3D ... />
</div>
```

全部替换为：

```tsx
// ✅ 正确：旋转角度作为 prop 传入，内部矩阵变换
<CoordinateSystem3D rotationY={rotateY * Math.PI / 180} ... />
```

---

## 4. 各章节内容深化改进

### 4.1 第七章：微分方程（ST4）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) | 1,530 → 1,620 | 3 例题替换为 **RC 电路充电曲线族**（τ 参数族）/ **弹簧衰减振动包络线**（e^{-ζt} 可视化）/ **强迫共振频率响应曲线**（共振峰突出显示） |
| [`Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) | 540（不变） | PID 控制器框图动画 + P/PI/PID 三种阶跃响应对比曲线 |
| [`Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) | 540（不变） | 四种阻尼比（ζ=0/0.5/1/2）阶跃响应曲线族，欠阻尼/临界/过阻尼直觉对比 |

**Polanyi 改进**：RC 充电曲线族让学生直觉感知时间常数 τ 对响应速度的影响；共振频率响应曲线使学生"看见"共振峰，将抽象的强迫振动方程与物理直觉关联。

### 4.2 第八章：空间解析几何与向量代数（ST5）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec01_Vectors.tsx`](../src/compositions/Ch08_VectorGeometry/Sec01_Vectors.tsx) | 450 → 510 | 完整重写为 3D：[`CoordinateSystem3D`](../src/components/math/CoordinateSystem3D.tsx) + [`AnimatedVector3D`](../src/components/math/AnimatedVector3D.tsx)，展示**分量分解路径**、**平行四边形加法**、**叉积右手法则** |
| [`Sec03_Surfaces.tsx`](../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx) | 480 → 540 | 完整重写为 3D：[`SurfaceMesh3D`](../src/components/math/SurfaceMesh3D.tsx)，球面从赤道向两极生长动画、圆柱母线扫出过程、旋转曲面参数化 |
| [`Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) | 1,620（不变） | 3 例题更新为**飞机降落跑道平面**（叉积法向量垂直性）/ **机械臂路径直线**（多视角直线观察）/ **激光切割位置关系** |
| [`Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) | 540（不变） | 关节链 `AnimatedVector3D` 正运动学直觉，末端执行器轨迹可视化 |
| [`Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) | 540（不变） | 刀具路径切线向量场可视化，法向量与进给方向垂直性直觉 |

### 4.3 第九章：多元函数微分法（ST6）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx) | 1,620（不变） | 3 例题重构为**气象温度场偏导**（截面切面可视化）/ **登山梯度场**（等高线+梯度箭头）/ **供应链拉格朗日**（约束线扫描+梯度平行动画） |
| [`Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) | 540（不变） | 矩形梁结构轻量化约束优化（W=bh²/6 vs b+h=30），可视化最优截面比例 |
| [`Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) | 540（不变） | 全域梯度向量场可视化（[`VectorField`](../src/components/math/VectorField.tsx) 组件），误差传播方向直觉 |

**Polanyi 改进**：登山梯度场案例将抽象的"梯度方向"转化为"最陡上坡方向"的身体直觉；拉格朗日梯度平行动画让约束优化条件从代数等式变为可见的几何关系。

### 4.4 第十章：重积分（ST7）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec03_Triple.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec03_Triple.tsx) | 480 → 540 | 完整重写为 3D：柱坐标 Jacobian 微元对比（矩形 vs 扇形）、球坐标三类等坐标面（r/θ/φ）、球体体积推导 |
| [`Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx) | 1,620（不变） | 3 例题增强：**极坐标网格动画**（直觉解释面积元 r·dr·dθ 中 r 的来源）/ **抛物面+平面切片动画** / **旋转体 `SurfaceMesh3D`** |
| [`Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) | 540（不变） | 非均匀密度颜色热图 + 质心平衡点直觉（杠杆原理类比） |
| [`Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) | 540（不变） | 毛坯-成品三色曲面（灰/蓝/红半透明去除区域），体积积分的"减法"直觉 |

### 4.5 第十一章：曲线积分与曲面积分（ST8）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec04_Surface1.tsx`](../src/compositions/Ch11_LineAndSurface/Sec04_Surface1.tsx) | 480 → 540 | 完整重写为 3D：面积拉伸因子可视化、**三色分区球面**（极点无拉伸→赤道极度拉伸，颜色编码直觉） |
| [`Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx) | 1,620（不变） | 3 例题替换为**输电线螺旋线质量**（线密度积分）/ **飞行器变力做功**（力-切线夹角 Polanyi）/ **竖直电场球面通量**（顶/侧/斜三种贡献对比） |
| [`Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) | 540（不变） | Poiseuille 管流速剖面曲面 + 四个径向向量流速分布对比 |
| [`Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) | 540（不变） | 改为 Gauss 定理/静电场，封闭球面电场线 16 条径向向量旋转展示 |

**Polanyi 改进**：飞行器做功例题中，力与速度夹角的动态变化让"做功=力·位移·cosθ"从公式变为可感知的物理过程；三色分区球面直觉化曲面积分中"参数化扭曲"的含义。

### 4.6 第十二章：无穷级数（ST9）

| 文件 | 帧数变化 | 主要改进内容 |
|------|---------|------------|
| [`Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx) | 1,440 → 1,620 | 3 例题替换为 **p 级数部分和收敛双面板柱形动画**（视觉区分收敛/发散）/ **e^x Taylor 逼近多曲线渐现族**（阶数递增直觉）/ **方波 Fourier 分解**（时域 [`FourierSeries`](../src/components/math/FourierSeries.tsx) + 频域频谱图） |
| [`Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) | 540（不变） | 时域-频域双面板展示 + 音频均衡器滑块直觉 |
| [`Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) | 540（不变） | sin 近似多次多项式有效范围条形图（ARM Cortex-M 工程数据：精度 vs 计算量权衡） |

**Polanyi 改进**：方波 Fourier 分解将"无穷级数叠加"从抽象求和变为听觉可感知的谐波；Taylor 多曲线渐现族让"逼近精度随阶数增加"的过程可视化为曲线族收敛动画。

---

## 5. 质量检查结果

### 5.1 ST10 全面检查结果

| 检查项 | 结果 | 说明 |
|--------|------|------|
| TypeScript 编译 | ✅ 0 错误 | 全部 65 个文件通过编译 |
| Root.tsx Composition 注册 | ✅ 65 个全部注册 | 6 个关键 `durationInFrames` 均已更新 |
| CSS rotateY 残留检测 | ✅ 无残留 | 18+ 个文件全部清除 |
| 禁用 API 检测 | ✅ 无违规 | `useEffect`/`setTimeout`/`CSS animation` 均未使用 |
| 关键 3D 文件内容验证 | ✅ 通过 | 6 个关键文件均包含预期的 3D 组件调用 |
| 双重水印检测 | ⚠️ 发现 2 处 P1 问题 | Ch07-Sec10、Ch08-Sec07（已在 ST11 修复） |

### 5.2 ST11 双重水印修复

| 文件 | 修复内容 |
|------|---------|
| [`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx)（Ch07） | 删除文件内 `withWatermark` 调用，改为 `export default Ch07Examples` |
| [`Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx)（Ch08） | 删除文件内 `withWatermark` 调用，改为 `export default Ch08Examples` |

**修复后规范状态**：两文件的水印统一由 [`Root.tsx`](../src/Root.tsx) 顶层 `withWatermark(...)` 负责，符合 AGENTS.md 规范。修复后编译 0 错误，水印无叠加。

---

## 6. Polanyi 默会知识可视化总结

> 本轮参照 Polanyi 默会知识理论（"我们所知道的多于我们所能言说的"），在各章例题和 IM 案例中系统性引入以下可视化策略：

### 6.1 实现的默会知识可视化清单

| 策略 | 章节 | 具体实现 |
|------|------|---------|
| **多视角渐变** | Ch08、Ch10、Ch11 | 3D 旋转动画让观看者从不同方向理解空间关系，突破单一视角限制 |
| **过程显化** | Ch07、Ch09、Ch12 | RC 充电曲线族生长动画、Taylor 逼近曲线族渐现，让收敛/响应"过程"可见 |
| **坐标轴方向感** | Ch08、Ch10 | 球坐标/柱坐标等坐标面动画，建立 (r,θ,φ) 坐标系的空间方向直觉 |
| **截面切割** | Ch09、Ch10 | 温度场截面动画、抛物面+平面切片，将 3D 函数降维理解 |
| **颜色渐变编码** | Ch10、Ch11 | 密度热图、球面面积拉伸三色分区，将抽象量映射为颜色直觉 |
| **力学类比** | Ch07、Ch11 | 弹簧振动包络线、飞行器变力做功夹角变化，关联物理直觉 |
| **频域直觉** | Ch12 | 方波 Fourier 时域+频域双面板，建立频谱可视化直觉 |

### 6.2 各章核心默会知识突破点

- **Ch07**：阻尼比 ζ 从数字变为"振动衰减速度感"（曲线族对比）
- **Ch08**：叉积 `a×b` 从行列式计算变为"右手法则空间方向感"（3D AnimatedVector3D）
- **Ch09**：梯度从偏导数公式变为"最陡上坡路径"（等高线+梯度箭头）
- **Ch10**：极坐标面积元 `r dr dθ` 中的 `r` 从 Jacobian 推导变为"扇形网格扭曲感"（极坐标网格动画）
- **Ch11**：曲面积分的面积拉伸因子从公式变为"球面参数化扭曲程度"（三色球面）
- **Ch12**：Fourier 级数从系数公式变为"谐波叠加声音直觉"（时域波形渐近）

---

## 7. 遗留问题与后续建议

### 7.1 当前 P2 级别问题（规范性，不影响渲染）

| 问题 | 描述 | 建议优先级 |
|------|------|-----------|
| 部分文件局部定义 `fade()` | 约 10+ 个文件在文件内局部重复定义 `fade()` 函数，而非从 [`animationUtils.ts`](../src/utils/animationUtils.ts) 导入 | P2（可逐步统一） |
| Ch07 Sec01–Sec09 无 3D 场景 | 基础概念节仍为 2D，与 3D 体系存在视觉风格落差 | P2（需整体改版） |
| Root.tsx 行数膨胀 | 65 个 Composition 注册导致 Root.tsx 超过 500 行，可考虑按章分组到子 Root 文件 | P3（架构优化） |

### 7.2 后续可继续改进方向

1. **交互式参数调节**：利用 Remotion Input Props 让教师在渲染时传入不同参数（如阻尼比、收敛半径），生成定制化教学视频
2. **声音同步**：为关键帧添加提示音效（Remotion 支持 `<Audio>` 组件），增强 Fourier 章节的听觉-视觉联觉
3. **习题动画**：在每章末添加习题引导节，学生可观看"错误解法"动画并对照正确解法
4. **性能优化**：`SurfaceMesh3D` 在高密度网格（>50×50）时渲染较慢，可引入 LOD（Level of Detail）机制

---

## 8. 文件变更清单

### 8.1 核心组件修改

| 文件 | 变更类型 | 变更内容 |
|------|---------|---------|
| [`src/components/math/CoordinateSystem3D.tsx`](../src/components/math/CoordinateSystem3D.tsx) | 重构 | 新增 `rotationX`/`rotationY` props；实现 `makeToISO()` 旋转矩阵投影函数；移除硬编码等轴测常量 |

### 8.2 durationInFrames 变更汇总

| Composition ID | 源文件 | 变更前 | 变更后 | 变化 |
|----------------|--------|--------|--------|------|
| `Ch07-Sec10-Examples` | [`Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) | 1,530 | 1,620 | +90 帧 |
| `Ch08-Sec01-Vectors` | [`Sec01_Vectors.tsx`](../src/compositions/Ch08_VectorGeometry/Sec01_Vectors.tsx) | 450 | 510 | +60 帧 |
| `Ch08-Sec03-Surfaces` | [`Sec03_Surfaces.tsx`](../src/compositions/Ch08_VectorGeometry/Sec03_Surfaces.tsx) | 480 | 540 | +60 帧 |
| `Ch10-Sec03-Triple` | [`Sec03_Triple.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec03_Triple.tsx) | 480 | 540 | +60 帧 |
| `Ch11-Sec04-Surface1` | [`Sec04_Surface1.tsx`](../src/compositions/Ch11_LineAndSurface/Sec04_Surface1.tsx) | 480 | 540 | +60 帧 |
| `Ch12-Sec08-Examples` | [`Sec08_Examples.tsx`](../src/compositions/Ch12_Series/Sec08_Examples.tsx) | 1,440 | 1,620 | +180 帧 |

### 8.3 内容深化（帧数不变）文件清单

| 文件 | 帧数 | 变更内容摘要 |
|------|------|------------|
| [`Ch07/Sec11_IM_Control.tsx`](../src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx) | 540 | PID 框图 + 三种响应对比 |
| [`Ch07/Sec12_IM_Dynamics.tsx`](../src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx) | 540 | 四种阻尼比阶跃响应曲线族 |
| [`Ch08/Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) | 1,620 | 工程例题替换 + 双重水印修复 |
| [`Ch08/Sec08_IM_RobotArm.tsx`](../src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx) | 540 | 关节链正运动学直觉 |
| [`Ch08/Sec09_IM_CNC.tsx`](../src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx) | 540 | 刀具路径切线向量场 |
| [`Ch09/Sec09_Examples.tsx`](../src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx) | 1,620 | 气象/登山/供应链例题重构 |
| [`Ch09/Sec10_IM_Optimization.tsx`](../src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx) | 540 | 矩形梁约束优化可视化 |
| [`Ch09/Sec11_IM_Sensor.tsx`](../src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx) | 540 | 全域梯度向量场 |
| [`Ch10/Sec05_Examples.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx) | 1,620 | 极坐标网格 + 旋转体 3D 增强 |
| [`Ch10/Sec06_IM_Mass.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx) | 540 | 密度热图 + 质心平衡直觉 |
| [`Ch10/Sec07_IM_CNC.tsx`](../src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx) | 540 | 毛坯-成品三色曲面 |
| [`Ch11/Sec08_Examples.tsx`](../src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx) | 1,620 | 螺旋线/做功/球面通量例题替换 |
| [`Ch11/Sec09_IM_Flow.tsx`](../src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx) | 540 | Poiseuille 管流剖面 |
| [`Ch11/Sec10_IM_Field.tsx`](../src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx) | 540 | Gauss 定理静电场 16 矢量旋转 |
| [`Ch12/Sec09_IM_Signal.tsx`](../src/compositions/Ch12_Series/Sec09_IM_Signal.tsx) | 540 | 时域-频域双面板 + 均衡器直觉 |
| [`Ch12/Sec10_IM_Approx.tsx`](../src/compositions/Ch12_Series/Sec10_IM_Approx.tsx) | 540 | sin 近似工程数据条形图 |

### 8.4 水印规范修复

| 文件 | 修复内容 |
|------|---------|
| [`Ch07/Sec10_Examples.tsx`](../src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx) | 删除文件内 `withWatermark`，改为 `export default Ch07Examples` |
| [`Ch08/Sec07_Examples.tsx`](../src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx) | 删除文件内 `withWatermark`，改为 `export default Ch08Examples` |

---

*文档生成时间：2026-04-11 · 由 Documentation Writer 模式自动整理*
