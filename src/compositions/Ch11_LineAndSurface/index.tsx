import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";

const Ch11LineAndSurfaceIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const sections = [
    "§11.1 对弧长的曲线积分",
    "§11.2 对坐标的曲线积分",
    "§11.3 格林公式及其应用",
    "§11.4 对面积的曲面积分",
    "§11.5 对坐标的曲面积分",
    "§11.6 高斯公式",
    "§11.7 斯托克斯公式",
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      opacity,
      padding: "80px 120px",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 16 }}>第十一章</div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", marginBottom: 48 }}>曲线积分与曲面积分</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ color: COLORS.annotation, fontSize: 28, paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.primaryCurve}` }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Ch11LineAndSurfaceIndex;
