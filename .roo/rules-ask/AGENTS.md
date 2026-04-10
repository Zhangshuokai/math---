# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 项目背景说明（易误解的上下文）

### 项目定位
这是一个**视频动画生成**项目，不是 Web 应用。每个"组件"渲染为视频帧，不在浏览器中实时交互。用户通过 Remotion Studio（`npm start`）预览，用 `npm run build` 渲染导出 mp4。

### 教学内容范围
**仅覆盖同济高等数学第七版下册**（第七章～第十二章），不包含上册（第一～六章）：
- 第七章：微分方程
- 第八章：空间解析几何与向量代数
- 第九章：多元函数微分法及其应用
- 第十章：重积分
- 第十一章：曲线积分与曲面积分
- 第十二章：无穷级数

### 文件组织的反直觉点
- `src/compositions/` 下的每个文件夹是一章，每个 `.tsx` 文件是一节视频（不是 React 页面）
- `index.tsx`（每章内）是"章节目录"动画，不是路由入口
- `src/index.ts` 只有一行：`registerRoot(RemotionRoot)`，入口由 Remotion CLI 管理
- `docs/` 下有完整的章节内容规划文档，是理解项目教学意图的主要参考

### 两套文档对照
- [`docs/chapters/README.md`](../../docs/chapters/README.md)：全量 Composition ID 索引，含帧数/时长
- [`docs/chapters/ch07-*.md`](../../docs/chapters/) ～ `ch12-*.md`：各章详细内容规划
- [`docs/architecture.md`](../../docs/architecture.md)：技术架构说明

### 动画工具的设计意图
- [`animationUtils.ts`](../../src/utils/animationUtils.ts) 中的 `fade()` 是最常用函数：从某帧开始持续 N 帧渐入，与 CSS transition 无关
- [`useExampleTimeline`](../../src/hooks/useExampleTimeline.ts) Hook 专为"例题讲解"结构设计，分为标题/例题/动画/总结四阶段
- [`mathUtils.ts`](../../src/utils/mathUtils.ts) 中的函数生成 SVG path 字符串，供坐标系组件内部使用
