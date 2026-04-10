# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 调试关键注意事项

### Remotion 渲染环境的静默失败
- **KaTeX 用了 useEffect**：公式不显示但无报错，因为服务端渲染不执行副作用。检查是否用了 `useEffect` 触发 KaTeX 渲染，应改为 [`MathFormula`](../../src/components/math/MathFormula.tsx) 组件（同步渲染）
- **withWatermark 写在 JSX 内**：导致每帧重新创建组件，表现为画面闪烁或性能下降。检查 [`Root.tsx`](../../src/Root.tsx) 中是否在 `<Composition component={...}>` 内 inline 调用 `withWatermark()`
- **Composition ID 用了下划线**：Remotion Studio 中找不到节，或渲染时报 "composition not found"。Composition ID 必须用连字符，如 `Ch07-Sec01-Intro`

### 预览/渲染问题排查
- **Remotion Studio 启动**：`npm start`（= `npx remotion studio`），入口点为 [`src/index.ts`](../../src/index.ts)
- **帧不渲染**：先检查 `useCurrentFrame()` 是否在 Composition 内使用（必须在 `<Composition>` 包裹的组件树内）
- **公式乱码/错位**：确认 `import "katex/dist/katex.min.css"` 已在 [`MathFormula.tsx`](../../src/components/math/MathFormula.tsx) 中引入，缺少 CSS 会导致上下标、分数定位全部失效
- **场景不切换**：检查 `scene` 的帧边界计算是否与 `durationInFrames` 匹配，避免最后几帧无内容

### 常见 TypeScript 编译错误
- 无 `tsconfig.json` 自定义路径别名，所有导入均为相对路径（`../../constants/colorTheme`）
- 无 lint 脚本，TypeScript 错误通过 `npx tsc --noEmit` 检查

### 颜色/尺寸不符合预期
直接在组件中搜索硬编码颜色值（如 `#1a1a2e`、`#61dafb`）——这些值应从 [`COLORS`](../../src/constants/colorTheme.ts) 常量读取，硬编码可能导致主题不一致
