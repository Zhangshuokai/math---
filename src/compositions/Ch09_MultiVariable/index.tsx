import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";

const Ch09MultiVariableIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const sections = [
    "§9.1 多元函数的基本概念",
    "§9.2 偏导数",
    "§9.3 全微分",
    "§9.4 多元复合函数的求导法则",
    "§9.5 隐函数的求导公式",
    "§9.6 多元函数微分学的几何应用",
    "§9.7 方向导数与梯度",
    "§9.8 多元函数的极值及其求法",
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      opacity,
      padding: "80px 120px",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 16 }}>第九章</div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", marginBottom: 48 }}>多元函数微分法及其应用</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ color: COLORS.annotation, fontSize: 28, paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.primaryCurve}` }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Ch09MultiVariableIndex;
