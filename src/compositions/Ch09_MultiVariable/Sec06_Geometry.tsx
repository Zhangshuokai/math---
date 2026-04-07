import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { MathFormula } from "../../components/math/MathFormula";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { COLORS } from "../../constants/colorTheme";

const fade = (frame: number, start: number, dur = 30) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec06Geometry: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法及其应用"
          sectionNum="9.6"
          sectionTitle="多元函数微分学的几何应用"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心公式 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 22,
            padding: "30px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 24, marginBottom: 8 }}>
              空间曲线切线（参数方程 x=x(t), y=y(t), z=z(t)）
            </div>
            <MathFormula
              latex="\frac{x - x_0}{x'(t_0)} = \frac{y - y_0}{y'(t_0)} = \frac{z - z_0}{z'(t_0)}"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14, width: "100%" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
              法平面（切线的法向量即为切向量 T = (x', y', z')）：
            </div>
            <MathFormula
              latex="x'(t_0)(x-x_0) + y'(t_0)(y-y_0) + z'(t_0)(z-z_0) = 0"
              fontSize={38}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 8 }}>
              曲面 F(x,y,z)=0 的切平面（法向量 n = ∇F）
            </div>
            <MathFormula
              latex="F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0"
              fontSize={42}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 12, width: "100%" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
              法线方程：
            </div>
            <MathFormula
              latex="\frac{x-x_0}{F_x} = \frac{y-y_0}{F_y} = \frac{z-z_0}{F_z}"
              fontSize={40}
              color={COLORS.tertiaryCurve}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：总结 180-300 */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="几何应用总结" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                <span style={{ color: COLORS.primaryCurve }}>曲线切线</span>：
                方向向量 T = (x'(t₀), y'(t₀), z'(t₀))
              </div>
              <div style={{ opacity: thm2 }}>
                <span style={{ color: COLORS.highlight }}>曲面切平面</span>：
                法向量 n = (F_x, F_y, F_z)|₍ₓ₀,ᵧ₀,ᵤ₀₎
              </div>
              <div style={{ opacity: thm3 }}>
                特别地，z = f(x,y) 的切平面：
                <span style={{ color: COLORS.secondaryCurve }}> z − z₀ = f_x(x−x₀) + f_y(y−y₀)</span>
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              曲面 z = x² + y² 在 (1,1,2) 处的切平面：
            </div>
            <MathFormula
              latex="2(x-1) + 2(y-1) - (z-2) = 0 \;\Rightarrow\; z = 2x+2y-2"
              fontSize={42}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec06Geometry;
