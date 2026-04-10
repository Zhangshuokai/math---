import React from 'react';
import { MathFormula } from '../math/MathFormula';

export interface SolutionStep {
  label?: string;    // 步骤标签，如 "第1步" 或 "解："
  content: string;   // LaTeX 公式或普通文字
  isLatex?: boolean; // 是否渲染为KaTeX，默认 true
}

export interface SolutionStepsProps {
  steps: SolutionStep[];
  currentStep: number;  // 显示前 currentStep 个步骤（1-indexed）
  width?: number;       // 默认 700
  opacity?: number;     // 默认 1
}

export const SolutionSteps: React.FC<SolutionStepsProps> = ({
  steps,
  currentStep,
  width = 700,
  opacity = 1,
}) => {
  const visibleSteps = steps.slice(0, currentStep);

  return (
    <div
      style={{
        width,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {visibleSteps.map((step, i) => {
        const isLatest = i === visibleSteps.length - 1;
        return (
          <div key={i}>
            {/* 步骤内容行 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '12px 16px',
                backgroundColor: isLatest
                  ? 'rgba(97, 218, 251, 0.08)'
                  : 'transparent',
                borderRadius: isLatest ? 6 : 0,
                borderLeft: isLatest
                  ? '3px solid #61dafb'
                  : '3px solid rgba(97, 218, 251, 0.2)',
              }}
            >
              {/* 步骤标签 */}
              {step.label && (
                <span
                  style={{
                    color: isLatest ? '#61dafb' : 'rgba(97, 218, 251, 0.6)',
                    fontSize: 18,
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    paddingTop: 2,
                    minWidth: 60,
                    flexShrink: 0,
                  }}
                >
                  {step.label}
                </span>
              )}

              {/* 步骤内容：LaTeX 或纯文字 */}
              <div style={{ flex: 1 }}>
                {step.isLatex !== false ? (
                  <MathFormula
                    latex={step.content}
                    fontSize={26}
                    color={isLatest ? '#ffffff' : 'rgba(255,255,255,0.65)'}
                    displayMode={false}
                  />
                ) : (
                  <span
                    style={{
                      color: isLatest ? '#ffffff' : 'rgba(255,255,255,0.65)',
                      fontSize: 22,
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {step.content}
                  </span>
                )}
              </div>
            </div>

            {/* 步骤分隔线（最后一步不显示） */}
            {i < visibleSteps.length - 1 && (
              <div
                style={{
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  margin: '0 16px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
