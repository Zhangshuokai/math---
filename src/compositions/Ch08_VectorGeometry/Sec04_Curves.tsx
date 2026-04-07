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

const Sec04Curves: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  // 螺旋线动画：在 SVG 中绘制 x-z 截面投影（x = cos θ, z = bθ）
  const helixProgress = interpolate(frame, [90, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const totalPoints = 200;
  const drawnCount = Math.floor(helixProgress * totalPoints);
  const helixPoints: string[] = [];
  for (let i = 0; i < drawnCount; i++) {
    const theta = (i / totalPoints) * 4 * Math.PI;
    const svgX = 200 + 80 * Math.cos(theta);
    const svgY = 200 - (theta / (4 * Math.PI)) * 300;
    helixPoints.push(`${svgX},${svgY}`);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.4"
          sectionTitle="空间曲线及其方程"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心公式 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 60,
            padding: "0 80px",
          }}
        >
          {/* 左侧：公式 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ opacity: t1 }}>
              <div style={{ color: COLORS.primaryCurve, fontSize: 24, marginBottom: 10 }}>
                空间曲线的参数方程
              </div>
              <MathFormula
                latex="\begin{cases} x = x(t) \\ y = y(t) \\ z = z(t) \end{cases}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>

            <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16 }}>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 8 }}>
                螺旋线（helix）参数方程
              </div>
              <MathFormula
                latex="\begin{cases} x = a\cos\theta \\ y = a\sin\theta \\ z = b\theta \end{cases}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>

            <div style={{ opacity: t3, color: COLORS.annotation, fontSize: 20 }}>
              投影到 xOz 平面（消去 y）：x = a cos(z/b)
            </div>

            <div style={{ opacity: t4, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 12 }}>
              <div style={{ color: COLORS.secondaryCurve, fontSize: 22, marginBottom: 6 }}>
                一般方程（两曲面交线）
              </div>
              <MathFormula
                latex="\begin{cases} F(x,y,z) = 0 \\ G(x,y,z) = 0 \end{cases}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 右侧：螺旋线 x-z 截面 SVG */}
          <div style={{ opacity: t2, flexShrink: 0 }}>
            <svg width={200} height={320} viewBox="0 0 400 360">
              {/* 坐标轴 */}
              <line x1="200" y1="10" x2="200" y2="350" stroke={COLORS.axis} strokeWidth="1.5" />
              <line x1="80" y1="200" x2="320" y2="200" stroke={COLORS.axis} strokeWidth="1.5" />
              <text x="310" y="195" fill={COLORS.axis} fontSize="18">x</text>
              <text x="205" y="20" fill={COLORS.axis} fontSize="18">z</text>
              {/* 螺旋线投影 */}
              {helixPoints.length > 1 && (
                <polyline
                  points={helixPoints.join(" ")}
                  fill="none"
                  stroke={COLORS.primaryCurve}
                  strokeWidth="2.5"
                />
              )}
              <text x="90" y="340" fill={COLORS.annotation} fontSize="14">x-z 平面投影</text>
            </svg>
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
            gap: 32,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="空间曲线在坐标面上的投影" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                投影到 xOy 面：消去 z，得 H(x,y) = 0（柱面与 xOy 面的交线）
              </div>
              <div style={{ opacity: thm2 }}>
                投影到 xOz 面：消去 y；投影到 yOz 面：消去 x
              </div>
              <div style={{ opacity: thm3 }}>
                螺旋线在 xOy 面投影：<span style={{ color: COLORS.primaryCurve }}>x² + y² = a²</span>（圆）
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              螺旋线：x = cos θ, y = sin θ, z = θ/(2π)
            </div>
            <MathFormula
              latex="x^2 + y^2 = 1 \quad (\text{xOy 面投影为单位圆})"
              fontSize={44}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec04Curves;
