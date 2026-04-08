import React from "react";
import katex from "katex";
// KaTeX CSS 必须引入，否则下标/上标/分数等定位全部失效
import "katex/dist/katex.min.css";

export interface MathFormulaProps {
  latex: string;
  displayMode?: boolean;
  color?: string;
  fontSize?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  displayMode = true,
  color = "#ffffff",
  fontSize = 48,
  opacity = 1,
  style,
}) => {
  // 同步渲染：Remotion 服务端按帧渲染时不执行 useEffect，
  // 必须使用 renderToString + dangerouslySetInnerHTML 才能正确显示公式。
  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: "html",
      trust: true,
    });
  } catch {
    html = latex;
  }

  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        color,
        fontSize,
        opacity,
        lineHeight: 1.4,
        ...style,
      }}
    />
  );
};
