import React from "react";
import { COLORS } from "../../constants/colorTheme";

export interface TheoremBoxProps {
  title: string;
  children: React.ReactNode;
  opacity?: number;
  width?: number | string;
}

export const TheoremBox: React.FC<TheoremBoxProps> = ({
  title,
  children,
  opacity = 1,
  width = 800,
}) => {
  return (
    <div style={{
      width,
      border: `2px solid ${COLORS.theoremBorder}`,
      borderRadius: 8,
      backgroundColor: COLORS.theoremBg,
      padding: "20px 24px",
      opacity,
    }}>
      <div style={{
        color: COLORS.primaryCurve,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
        letterSpacing: 1,
      }}>
        【{title}】
      </div>
      <div style={{ color: COLORS.formula }}>
        {children}
      </div>
    </div>
  );
};
