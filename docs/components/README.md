# 组件库设计总览

> 同济高数下册 Remotion 动画项目 — 组件目录

---

## 组件分类索引

| 文档 | 涵盖组件 | 说明 |
|------|----------|------|
| [base-components.md](./base-components.md) | `MathFormula`、`CoordinateSystem`、`CoordinateSystem3D`、`FunctionPlot`、`IntegralArea`、`Arrow`、`Vector3D`、`VectorField` | 基础渲染原子组件，无业务逻辑 |
| [layout-components.md](./layout-components.md) | `TitleCard`、`TheoremBox`、`StepByStep` | 教学布局组件，控制信息呈现结构 |
| [special-components.md](./special-components.md) | `FourierSeries`、`SurfaceIntegral`、`DiffEqSolution`、`PartialDerivative` | 专题可视化组件，为特定章节定制 |
| [hooks.md](./hooks.md) | `useCoordinateTransform`、`useDrawProgress`、`useSpringValue`、`useStaggeredEntrance` | 自定义 Hooks，封装动画与坐标逻辑 |

---

## 组件依赖关系图

```mermaid
graph TD
    subgraph Hooks
        UCT[useCoordinateTransform]
        UDP[useDrawProgress]
        USV[useSpringValue]
        USE[useStaggeredEntrance]
    end

    subgraph Base 基础组件
        MF[MathFormula]
        CS[CoordinateSystem]
        CS3[CoordinateSystem3D]
        FP[FunctionPlot]
        IA[IntegralArea]
        AR[Arrow]
        V3[Vector3D]
        VF[VectorField]
    end

    subgraph Layout 布局组件
        TC[TitleCard]
        TB[TheoremBox]
        SBS[StepByStep]
    end

    subgraph Special 专题组件
        FS[FourierSeries]
        SI[SurfaceIntegral]
        DES[DiffEqSolution]
        PD[PartialDerivative]
    end

    UCT --> FP
    UCT --> IA
    UCT --> AR
    UCT --> VF
    UDP --> FP
    UDP --> AR
    USV --> TC
    USV --> TB
    USE --> SBS

    CS -->|Context 提供 UCT| FP
    CS -->|Context 提供 UCT| IA
    CS -->|Context 提供 UCT| AR
    CS -->|Context 提供 UCT| VF
    CS3 -->|3D 投影矩阵| V3

    MF --> SBS
    MF --> TB
    CS --> DES
    CS --> PD
    CS --> FS
    FP --> DES
    FP --> FS
    V3 --> SI
```

---

## 设计原则

### 1. 原子化
每个基础组件只负责**单一视觉职责**：`MathFormula` 只渲染公式，`FunctionPlot` 只绘制曲线，不内嵌布局逻辑。

### 2. 坐标系解耦
`CoordinateSystem` 通过 **React Context** 向子组件注入坐标变换函数，子组件（`FunctionPlot`、`IntegralArea`、`Arrow`）无需接收 `xRange`/`yRange` 参数——当它们被放在 `CoordinateSystem` 内部时，自动感知坐标范围。

```jsx
// 正确用法：子组件自动继承坐标系
<CoordinateSystem xRange={[-5, 5]} yRange={[-3, 3]}>
  <FunctionPlot fn={Math.sin} color="#61dafb" drawProgress={0.7} />
  <IntegralArea fn={Math.sin} a={0} b={Math.PI} />
  <Arrow from={[0, 0]} to={[2, 1]} />
</CoordinateSystem>
```

### 3. 动画进度参数化
所有涉及入场动画的组件均通过**归一化进度值 [0, 1]** 控制显示状态，而非直接使用帧号。帧号到进度的转换由外层 Composition 或 Hook 完成：

```typescript
// Composition 中的典型用法
const frame = useCurrentFrame();
const drawProgress = interpolate(frame, [120, 200], [0, 1], {
  extrapolateRight: "clamp",
});
return <FunctionPlot fn={Math.sin} drawProgress={drawProgress} />;
```

### 4. 颜色统一
所有颜色参数默认值引用 `src/constants/colors.ts` 中的 `COLORS` 常量，保证视觉风格一致。

### 5. 纯 SVG 渲染
所有图形组件（坐标系、曲线、箭头）均输出 **SVG 元素**，不使用 Canvas 或 WebGL，确保 Remotion 服务端渲染（SSR）兼容性。

---

## 文件位置速查

```
src/components/
├── base/
│   ├── MathFormula.tsx
│   ├── CoordinateSystem.tsx
│   ├── CoordinateSystem3D.tsx
│   ├── FunctionPlot.tsx
│   ├── IntegralArea.tsx
│   ├── Arrow.tsx
│   ├── Vector3D.tsx
│   └── VectorField.tsx
├── layout/
│   ├── TitleCard.tsx
│   ├── TheoremBox.tsx
│   └── StepByStep.tsx
└── special/
    ├── FourierSeries.tsx
    ├── SurfaceIntegral.tsx
    ├── DiffEqSolution.tsx
    └── PartialDerivative.tsx
```
