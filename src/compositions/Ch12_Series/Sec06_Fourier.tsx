import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FourierSeries } from "../../components/math/FourierSeries";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 方波函数
const squareWave = (x: number): number => {
  const t = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return t < Math.PI ? 1 : -1;
};

// 当前项数标签
const TermsLabel: React.FC<{ terms: number; opacity?: number }> = ({ terms, opacity = 1 }) => {
  const oddTerms = 2 * terms - 1;
  return (
    <div style={{
      position: "absolute",
      top: 12,
      right: 16,
      background: "rgba(0,0,0,0.5)",
      padding: "6px 14px",
      borderRadius: 8,
      border: `1px solid ${COLORS.primaryCurve}`,
      opacity,
    }}>
      <span style={{ color: COLORS.primaryCurve, fontSize: 18, fontFamily: "monospace" }}>
        n = {oddTerms} 项
      </span>
    </div>
  );
};

const Sec06Fourier: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 420 ? 3
    : frame < 480 ? 4
    : frame < 540 ? 5
    : 6;

  const s1Op = fade(frame, 0);

  // Scene 2: 傅里叶系数公式
  const s2Title = fade(frame, 60, 20);
  const s2a0 = fade(frame, 78, 20);
  const s2an = fade(frame, 108, 20);
  const s2bn = fade(frame, 138, 20);
  const s2Series = fade(frame, 160, 18);

  // Scene 3: 180-420 傅里叶级数收敛动画（核心）
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 25);
  // 从 frame 180 到 420，terms 从 1 增加到 11（对应奇数项 1,3,5,7,9,11,13,15,17,19,21）
  const termsFloat = interpolate(frame, [200, 415], [1, 11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentTerms = Math.max(1, Math.floor(termsFloat));
  const drawProgress = interpolate(frame, [200 + (currentTerms - 1) * 19, 200 + currentTerms * 19], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 4: 吉布斯现象
  const s4Title = fade(frame, 420, 20);
  const s4CoordOp = fade(frame, 435, 20);
  const s4Gibbs = fade(frame, 455, 20);

  // Scene 5: 狄利克雷定理
  const s5Title = fade(frame, 480, 20);
  const s5Cond1 = fade(frame, 498, 20);
  const s5Cond2 = fade(frame, 518, 18);

  // Scene 6: 总结
  const s6Op = fade(frame, 540, 30);

  const oddTerms = 2 * currentTerms - 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.6"
          sectionTitle="傅里叶级数"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 傅里叶系数公式 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>傅里叶系数公式</div>
          <div style={{ opacity: s2a0 }}>
            <MathFormula
              latex="a_0 = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\,\mathrm{d}x"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2an }}>
            <MathFormula
              latex="a_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos(nx)\,\mathrm{d}x,\;\; n=1,2,3,\ldots"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2bn }}>
            <MathFormula
              latex="b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,\mathrm{d}x,\;\; n=1,2,3,\ldots"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Series }}>
            <MathFormula
              latex="f(x) \sim \frac{a_0}{2} + \sum_{n=1}^\infty (a_n\cos nx + b_n\sin nx)"
              fontSize={30}
              color={COLORS.vector}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 傅里叶级数收敛动画 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10, position: "relative" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 24, opacity: s3Title }}>
            方波函数的傅里叶级数逼近
          </div>
          <TermsLabel terms={currentTerms} opacity={s3CoordOp} />
          <CoordinateSystem
            width={1000}
            height={480}
            xRange={[-4.5, 4.5]}
            yRange={[-1.8, 1.8]}
            opacity={s3CoordOp}
          >
            {/* 真实方波 */}
            <FunctionPlot
              fn={squareWave}
              color={COLORS.annotation}
              drawProgress={1}
              strokeWidth={2}
              opacity={0.4}
            />
            {/* 傅里叶级数逼近 */}
            <FourierSeries
              terms={currentTerms}
              drawProgress={drawProgress}
              color={COLORS.primaryCurve}
            />
          </CoordinateSystem>
          <div style={{ opacity: s3CoordOp }}>
            <MathFormula
              latex={`f(x) \\approx \\frac{4}{\\pi}\\sum_{k=1}^{${currentTerms}}\\frac{\\sin((2k-1)x)}{2k-1}`}
              fontSize={24}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 吉布斯现象 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.highlight, fontSize: 24, opacity: s4Title }}>
            吉布斯现象：不连续点附近约 9% 的超射永远存在
          </div>
          <CoordinateSystem
            width={900}
            height={420}
            xRange={[-2, 2]}
            yRange={[-1.5, 1.5]}
            opacity={s4CoordOp}
          >
            <FunctionPlot fn={squareWave} color={COLORS.annotation} drawProgress={1} strokeWidth={2} opacity={0.4} />
            <FourierSeries terms={11} drawProgress={1} color={COLORS.primaryCurve} />
          </CoordinateSystem>
          <div style={{ opacity: s4Gibbs, color: COLORS.highlight, fontSize: 20, textAlign: "center" }}>
            即使项数趋于∞，不连续点两侧仍有约 8.9% 的超射幅度（吉布斯现象）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 狄利克雷定理 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s5Title }}>狄利克雷收敛定理</div>
          <div style={{ opacity: s5Cond1, color: COLORS.annotation, fontSize: 22, textAlign: "center", lineHeight: 1.8 }}>
            若 f(x) 在 [-π, π] 上满足狄利克雷条件（分段单调，有限个间断点），则傅里叶级数收敛：
          </div>
          <div style={{ opacity: s5Cond2 }}>
            <MathFormula
              latex={"\frac{a_0}{2}+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx) = \begin{cases}f(x) & \text{连续点}\\[6pt]\dfrac{f(x^-)+f(x^+)}{2} & \text{间断点}\end{cases}"}
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="傅里叶级数总结" opacity={s6Op} width={980}>
            <div style={{ fontSize: 21, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>傅里叶系数</span>：aₙ = 1/π∫f(x)cos(nx)dx，bₙ = 1/π∫f(x)sin(nx)dx</div>
              <div>• <span style={{ color: COLORS.vector }}>方波展开</span>：f(x) = (4/π)∑sin((2k-1)x)/(2k-1)（仅含奇数项）</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>狄利克雷定理</span>：满足条件时，间断点处收敛到左右极限的平均值</div>
              <div>• <span style={{ color: COLORS.highlight }}>吉布斯现象</span>：不连续点附近存在约 9% 的超射，不消失</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec06Fourier;
