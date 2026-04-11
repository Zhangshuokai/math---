import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { MathFormula } from "../../components/math/MathFormula";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { COLORS } from "../../constants/colorTheme";
import { CoordinateSystem3D, useCoordContext3D } from "../../components/math/CoordinateSystem3D";

const fade = (frame: number, start: number, dur = 30) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec04Curves: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);

  // 螺旋线动画（3D 等轴测投影）
  const s2Draw = interpolate(frame, [90, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 3: 180-270
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  // Scene 4: 270-390（参数方程完整展示）
  const s4In = fade(frame, 270, 30);
  const eq1Op = fade(frame, 290, 20);
  const eq2Op = fade(frame, 310, 20);
  const eq3Op = fade(frame, 330, 20);
  const projDraw = interpolate(frame, [350, 385], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // y-z 平面投影：绘制 y=sin(t), z=t/(2π)，N 个点
  const yzPoints: string[] = [];
  const yzN = 120;
  const yzDrawn = Math.floor(projDraw * yzN);
  for (let i = 0; i < yzDrawn; i++) {
    const tt = (i / yzN) * 4 * Math.PI;
    const svgY_yz = 160 + 70 * Math.sin(tt);
    const svgZ_yz = 20 + (tt / (4 * Math.PI)) * 280;
    yzPoints.push(`${svgY_yz},${svgZ_yz}`);
  }

  // Scene 5: 390-480（切线向量与弧长）
  const s5In = fade(frame, 390, 30);
  const tanOp = fade(frame, 410, 20);
  const arcOp = fade(frame, 440, 20);

  // 局部子组件：在 CoordinateSystem3D 上下文内绘制螺旋线
  const HelixCurve3D: React.FC<{ drawProgress: number; a?: number; b?: number; turns?: number }> = ({
    drawProgress, a = 1, b = 0.3, turns = 2
  }) => {
    const { toISO } = useCoordContext3D();
    const N = 120;
    const totalAngle = turns * 2 * Math.PI;
    const visibleN = Math.floor(N * drawProgress);

    const points = Array.from({ length: visibleN + 1 }, (_, i) => {
      const t = (i / N) * totalAngle;
      return toISO(a * Math.cos(t), a * Math.sin(t), b * t);
    });

    if (points.length < 2) return null;
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.svgX} ${p.svgY}`).join(' ');

    return <path d={d} stroke="#60A5FA" strokeWidth={2.5} fill="none" />;
  };

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
                latex={"\begin{cases} x = x(t) \\ y = y(t) \\ z = z(t) \end{cases}"}
                fontSize={40}
                color={COLORS.formula}
              />
            </div>

            <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16 }}>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 8 }}>
                螺旋线（helix）参数方程
              </div>
              <MathFormula
                latex={"\begin{cases} x = a\cos\theta \\ y = a\sin\theta \\ z = b\theta \end{cases}"}
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
                latex={"\begin{cases} F(x,y,z) = 0 \\ G(x,y,z) = 0 \end{cases}"}
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 右侧：3D 螺旋线（等轴测投影） */}
          <div style={{ opacity: t2, flexShrink: 0 }}>
            <CoordinateSystem3D
              center={[190, 300]}
              scale={55}
              xRange={[-1.5, 1.5]}
              yRange={[-1.5, 1.5]}
              zRange={[0, 4]}
              width={380}
              height={380}
            >
              <HelixCurve3D drawProgress={s2Draw} a={1} b={0.3} turns={2} />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：投影定理总结 180-270 */}
      <Sequence from={180} durationInFrames={90}>
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

      {/* 场景4：参数方程完整展示 270-390 */}
      <Sequence from={270} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 50,
            padding: "0 80px",
            opacity: s4In,
          }}
        >
          {/* 左侧：参数方程与投影公式 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
            <TheoremBox title="螺旋线参数方程" opacity={eq1Op} width={520}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ opacity: eq1Op }}>
                  <MathFormula
                    latex="x = a\cos t"
                    fontSize={34}
                    color={COLORS.primaryCurve}
                  />
                </div>
                <div style={{ opacity: eq2Op }}>
                  <MathFormula
                    latex="y = a\sin t"
                    fontSize={34}
                    color={COLORS.secondaryCurve}
                  />
                </div>
                <div style={{ opacity: eq3Op }}>
                  <MathFormula
                    latex="z = bt \quad (t \in \mathbb{R})"
                    fontSize={34}
                    color={COLORS.highlight}
                  />
                </div>
              </div>
            </TheoremBox>

            <div style={{ opacity: eq2Op, paddingLeft: 8 }}>
              <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>
                xOy 平面投影（消去 z）：
              </div>
              <MathFormula
                latex="x^2 + y^2 = a^2 \quad \text{（单位圆）}"
                fontSize={32}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 右侧：y-z 平面投影 SVG */}
          <div style={{ opacity: eq3Op, flexShrink: 0 }}>
            <svg width={200} height={320} viewBox="0 0 360 360">
              {/* 坐标轴 */}
              <line x1="160" y1="10" x2="160" y2="350" stroke={COLORS.axis} strokeWidth="1.5" />
              <line x1="20" y1="180" x2="340" y2="180" stroke={COLORS.axis} strokeWidth="1.5" />
              <text x="328" y="175" fill={COLORS.axis} fontSize="16">y</text>
              <text x="166" y="20" fill={COLORS.axis} fontSize="16">z</text>
              {/* y-z 平面投影曲线 */}
              {yzPoints.length > 1 && (
                <polyline
                  points={yzPoints.join(" ")}
                  fill="none"
                  stroke={COLORS.secondaryCurve}
                  strokeWidth="2.5"
                />
              )}
              <text x="30" y="348" fill={COLORS.annotation} fontSize="13">y-z 平面投影</text>
            </svg>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景5：切线向量与弧长 390-480 */}
      <Sequence from={390} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 36,
            padding: "0 100px",
            opacity: s5In,
          }}
        >
          <div style={{ opacity: tanOp, width: "100%" }}>
            <TheoremBox title="切线向量" opacity={tanOp} width={960}>
              <div style={{ fontSize: 22, color: COLORS.formula, lineHeight: 1.8 }}>
                <div>
                  螺旋线 <span style={{ color: COLORS.primaryCurve }}>r⃗(t) = (a cos t, a sin t, bt)</span> 的切线向量：
                </div>
                <div style={{ marginTop: 8 }}>
                  <MathFormula
                    latex="\vec{r}'(t) = (-a\sin t,\; a\cos t,\; b)"
                    fontSize={36}
                    color={COLORS.highlight}
                  />
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{ opacity: arcOp, textAlign: "center" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 14 }}>
              弧长公式
            </div>
            <MathFormula
              latex="L = \int_0^{2\pi} |\vec{r}'(t)|\,\mathrm{d}t = \int_0^{2\pi} \sqrt{a^2 + b^2}\,\mathrm{d}t = 2\pi\sqrt{a^2+b^2}"
              fontSize={34}
              color={COLORS.formula}
            />
            <div style={{ marginTop: 16 }}>
              <MathFormula
                latex="|\vec{r}'(t)| = \sqrt{a^2\sin^2 t + a^2\cos^2 t + b^2} = \sqrt{a^2+b^2} \;\text{（常数）}"
                fontSize={26}
                color={COLORS.annotation}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec04Curves;
