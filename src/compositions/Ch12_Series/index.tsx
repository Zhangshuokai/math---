import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";

const Ch12SeriesIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const sections = [
    "§12.1 常数项级数的概念和性质",
    "§12.2 常数项级数的审敛法",
    "§12.3 幂级数",
    "§12.4 函数展开成幂级数",
    "§12.5 函数的幂级数展开式的应用",
    "§12.6 傅里叶级数",
    "§12.7 一般周期函数的傅里叶级数",
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      opacity,
      padding: "80px 120px",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 16 }}>第十二章</div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", marginBottom: 48 }}>无穷级数</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ color: COLORS.annotation, fontSize: 28, paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.primaryCurve}` }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Ch12SeriesIndex;
