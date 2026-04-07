import React from "react";
import { COLORS } from "../../constants/colorTheme";

export interface StepByStepProps {
  steps: string[];
  currentStep: number; // 当前显示到第几步（0-indexed，显示 0..currentStep）
  stepHeight?: number;
}

export const StepByStep: React.FC<StepByStepProps> = ({
  steps,
  currentStep,
  stepHeight = 60,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {steps.slice(0, currentStep + 1).map((step, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: i === currentStep ? 1 : 0.5,
          minHeight: stepHeight,
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: "50%",
            backgroundColor: i === currentStep ? COLORS.primaryCurve : COLORS.axis,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.background,
            fontWeight: "bold",
            flexShrink: 0,
          }}>
            {i + 1}
          </div>
          <div style={{ color: COLORS.formula, fontSize: 24 }}>{step}</div>
        </div>
      ))}
    </div>
  );
};
