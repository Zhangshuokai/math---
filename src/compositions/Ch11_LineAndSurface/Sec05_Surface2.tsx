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

const Sec05Surface2: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 130, 25);
  const t4 = fade(frame, 160, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.5"
          sectionTitle="对坐标的曲面积分（第二类）"
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
            gap: 26,
            padding: "30px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 24, marginBottom: 10 }}>
              流量积分（第二类曲面积分）
            </div>
            <MathFormula
              latex="\iint_\Sigma P\,dy\,dz + Q\,dz\,dx + R\,dx\,dy"
              fontSize={46}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 8 }}>
              化为二重积分（取上侧，法向量与 z 轴正方向成锐角）
            </div>
            <MathFormula
              latex="\iint_\Sigma R\,dx\,dy = \pm\iint_D R(x,y,z(x,y))\,dA"
              fontSize={40}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 19, marginTop: 6 }}>
              取上侧时取 +，取下侧时取 −
            </div>
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 22, marginBottom: 8 }}>
              向量形式（流量）：F = (P, Q, R)，n 为单位法向量
            </div>
            <MathFormula
              latex="\iint_\Sigma \mathbf{F}\cdot\mathbf{n}\,dS = \iint_\Sigma P\,dydz+Q\,dzdx+R\,dxdy"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4, color: COLORS.annotation, fontSize: 20 }}>
            物理意义：单位时间内流体通过曲面 Σ 的流量（取决于方向）
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
          <TheoremBox title="两类曲面积分的关系" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                设 n = (cos α, cos β, cos γ) 为曲面单位法向量，则：
              </div>
              <div style={{ opacity: thm2 }}>
                <span style={{ color: COLORS.primaryCurve }}>第二类</span> = ∬_Σ (P cos α + Q cos β + R cos γ) dS = <span style={{ color: COLORS.highlight }}>第一类</span>
              </div>
              <div style={{ opacity: thm3 }}>
                改变曲面方向（取反侧），积分值<span style={{ color: COLORS.highlight }}>变号</span>
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              高斯公式（散度定理）将第二类曲面积分化为三重积分：
            </div>
            <MathFormula
              latex="\oiint_\Sigma P\,dydz+Q\,dzdx+R\,dxdy = \iiint_\Omega \left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)dV"
              fontSize={32}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec05Surface2;
