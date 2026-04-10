import React from 'react';

export interface ExampleBoxProps {
  exampleNum: number | string;  // 例题编号，如 1 或 "1.1"
  title?: string;               // 例题小标题（可选）
  children: React.ReactNode;    // 题目内容（可以包含 MathFormula）
  width?: number;               // 默认 800
  opacity?: number;             // 默认 1
  accentColor?: string;         // 标题栏颜色，默认 '#61dafb'
}

export const ExampleBox: React.FC<ExampleBoxProps> = ({
  exampleNum,
  title,
  children,
  width = 800,
  opacity = 1,
  accentColor = '#61dafb',
}) => {
  return (
    <div
      style={{
        width,
        opacity,
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${accentColor}44`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 标题栏：左侧4px颜色竖条 + 标题文字 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: `${accentColor}22`,
          borderLeft: `4px solid ${accentColor}`,
          padding: '10px 18px',
          gap: 12,
        }}
      >
        <span
          style={{
            color: accentColor,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            letterSpacing: 1,
          }}
        >
          例题 {exampleNum}
        </span>
        {title && (
          <span
            style={{
              color: accentColor,
              fontSize: 18,
              fontFamily: 'sans-serif',
              opacity: 0.85,
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div
        style={{
          padding: '16px 22px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderLeft: '4px solid transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};
