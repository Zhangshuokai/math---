import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";

const Ch08VectorGeometryIndex: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const sections = [
    "§8.1 向量及其线性运算",
    "§8.2 数量积、向量积、混合积",
    "§8.3 曲面及其方程",
    "§8.4 空间曲线及其方程",
    "§8.5 平面及其方程",
    "§8.6 空间直线及其方程",
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      opacity,
      padding: "80px 120px",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 16 }}>第八章</div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", marginBottom: 48 }}>空间解析几何与向量代数</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ color: COLORS.annotation, fontSize: 28, paddingLeft: 24,
            borderLeft: `3px solid ${COLORS.primaryCurve}` }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Ch08VectorGeometryIndex;
