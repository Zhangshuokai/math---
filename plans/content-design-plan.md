# 内容设计总索引

> **波兰尼原则（Polanyi）**：隐性知识显性化——每一章的设计遵循"由具体到抽象、由已知到未知、由直觉到形式"的认知路径，让学生在看到公式之前已经建立直觉模型。

## 文件结构

| 文件 | 内容 |
|------|------|
| [`plans/ch07-examples-im.md`](ch07-examples-im.md) | 第七章 微分方程：3例题 + 3 IM案例 |
| [`plans/ch08-examples-im.md`](ch08-examples-im.md) | 第八章 空间解析几何与向量代数：3例题 + 3 IM案例 |
| [`plans/ch09-examples-im.md`](ch09-examples-im.md) | 第九章 多元函数微分法：3例题 + 3 IM案例 |
| [`plans/ch10-examples-im.md`](ch10-examples-im.md) | 第十章 重积分：3例题 + 3 IM案例 |
| [`plans/ch11-examples-im.md`](ch11-examples-im.md) | 第十一章 曲线积分与曲面积分：3例题 + 3 IM案例 |
| [`plans/ch12-examples-im.md`](ch12-examples-im.md) | 第十二章 无穷级数：3例题 + 3 IM案例 |

## 通用动画时序规范

```
const T = { s1: 0, s2: 60, s3: 150, s4: 330, s5: 390, s6: 480, end: 540 };
```

| Stage | 帧范围 | 时长 | 内容 | 组件 |
|-------|--------|------|------|------|
| S1 | 0–60 | 2s | 展示题目，淡入 | ExampleBox |
| S2 | 60–150 | 3s | 审题分析，拆解条件 | 文字逐条 fade in |
| S3 | 150–330 | 6s | 分步计算（≤4步，各45帧） | StepByStep / SolutionSteps |
| S4 | 330–390 | 2s | 最终结论高亮 | TheoremBox |
| S5 | 390–480 | 3s | 3D旋转可视化 | CoordinateSystem3D 系列 |
| S6 | 480–540 | 2s | 总结淡出 | 文字 |

> 无3D场景：省略S5，总帧数改为 **450帧**（`durationInFrames={450}`）

## 3D旋转强制写法

```ts
const rotateY = interpolate(
  frame, [390, 480], [0, 360],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
```

## Composition ID 命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 例题 | `Ch{XX}-Ex{YY}-{Name}` | `Ch07-Ex01-Separable` |
| IM案例 | `Ch{XX}-IM{YY}-{Name}` | `Ch07-IM01-RCCircuit` |

## 整体覆盖矩阵

| 章节 | 例题数 | IM案例数 | 含3D场景 |
|------|--------|---------|---------|
| Ch07 微分方程 | 3 | 3 | IM案例全部，Ex02/Ex03 |
| Ch08 向量几何 | 3 | 3 | 全部 |
| Ch09 多元函数 | 3 | 3 | Ex02/Ex03，IM全部 |
| Ch10 重积分 | 3 | 3 | Ex01/Ex02/Ex03，IM全部 |
| Ch11 曲线曲面 | 3 | 3 | Ex03，IM全部 |
| Ch12 无穷级数 | 3 | 3 | Ex03，IM03 |
