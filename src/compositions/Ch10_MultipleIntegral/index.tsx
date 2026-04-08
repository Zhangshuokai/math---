import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";

const Ch10MultipleIntegralIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const sections = [
    "§10.1 二重积分的概念与性质",
    "§10.2 二重积分的计算法",
    "§10.3 三重积分",
    "§10.4 重积分的应用",
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      opacity,
      padding: "80px 120px",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 16 }}>第十章</div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", marginBottom: 48 }}>重积分</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ color: COLORS.annotation, fontSize: 28, paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.primaryCurve}` }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Ch10MultipleIntegralIndex;
