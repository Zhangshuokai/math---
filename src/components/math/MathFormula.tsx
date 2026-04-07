import React, { useRef, useEffect } from "react";
import katex from "katex";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(latex, ref.current, {
        displayMode,
        throwOnError: false,
        output: "html",
        trust: true,
      });
    }
  }, [latex, displayMode]);

  return (
    <div
      ref={ref}
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
