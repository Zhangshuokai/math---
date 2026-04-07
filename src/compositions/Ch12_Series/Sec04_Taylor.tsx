import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// eˣ 的泰勒多项式逼近
const TaylorApprox: React.FC<{ degree: number; drawProgress: number }> = ({ degree, drawProgress }) => {
  const colors = [COLORS.highlight, COLORS.secondaryCurve, COLORS.tertiaryCurve, COLORS.vector, "#c792ea", "#89ddff"];
  const fns: ((x: number) => number)[] = [
    (x) => 1,
    (x) => 1 + x,
    (x) => 1 + x + x * x / 2,
    (x) => 1 + x + x * x / 2 + x * x * x / 6,
    (x) => 1 + x + x * x / 2 + x * x * x / 6 + Math.pow(x, 4) / 24,
    (x) => 1 + x + x * x / 2 + x * x * x / 6 + Math.pow(x, 4) / 24 + Math.pow(x, 5) / 120,
  ];

  return (
    <>
      {fns.slice(0, degree).map((fn, i) => (
        <FunctionPlot
          key={i}
          fn={fn}
          color={colors[i % colors.length]}
          drawProgress={i === degree - 1 ? drawProgress : 1}
          strokeWidth={i === degree - 1 ? 3 : 1.5}
          opacity={i === degree - 1 ? 1 : 0.4}
        />
      ))}
    </>
  );
};

// sin(x) 的泰勒多项式（奇次项）
const SinTaylorApprox: React.FC<{ degree: number; drawProgress: number }> = ({ degree, drawProgress }) => {
  const colors = [COLORS.highlight, COLORS.secondaryCurve, COLORS.tertiaryCurve, COLORS.vector];
  const fns: ((x: number) => number)[] = [
    (x) => x,
    (x) => x - Math.pow(x, 3) / 6,
    (x) => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120,
    (x) => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120 - Math.pow(x, 7) / 5040,
  ];
  return (
    <>
      {fns.slice(0, degree).map((fn, i) => (
        <FunctionPlot
          key={i}
          fn={fn}
          color={colors[i % colors.length]}
          drawProgress={i === degree - 1 ? drawProgress : 1}
          strokeWidth={i === degree - 1 ? 3 : 1.5}
          opacity={i === degree - 1 ? 1 : 0.4}
        />
      ))}
    </>
  );
};

const Sec04Taylor: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : frame < 480 ? 5
    : 6;

  const s1Op = fade(frame, 0);

  // Scene 2: 泰勒公式回顾
  const s2Title = fade(frame, 60, 20);
  const s2Formula = fade(frame, 78, 20);
  const s2Series = fade(frame, 112, 20);

  // Scene 3: eˣ 展开动画
  const s3Title = fade(frame, 150, 20);
  const s3CoordOp = fade(frame, 165, 20);
  const degree = Math.min(6, Math.round(interpolate(frame, [175, 285], [1, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const drawProg = interpolate(frame, [175 + (degree - 1) * 18, 175 + degree * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Formula = fade(frame, 282, 18);

  // Scene 4: sin x 展开
  const s4Title = fade(frame, 300, 20);
  const s4CoordOp = fade(frame, 315, 20);
  const sinDegree = Math.min(4, Math.round(interpolate(frame, [325, 382], [1, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const sinDrawProg = interpolate(frame, [325 + (sinDegree - 1) * 14, 325 + sinDegree * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scene 5: ln(1+x)
  const s5Title = fade(frame, 390, 20);
  const s5Method = fade(frame, 408, 20);
  const s5Formula = fade(frame, 440, 20);

  // Scene 6: 总结
  const s6Op = fade(frame, 480, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.4"
          sectionTitle="函数展开成幂级数"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 泰勒公式回顾 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>泰勒公式与泰勒级数</div>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="f(x) = \sum_{n=0}^N \frac{f^{(n)}(x_0)}{n!}(x-x_0)^n + R_N(x)"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Series }}>
            <MathFormula
              latex="\text{泰勒级数：}\;f(x) = \sum_{n=0}^\infty \frac{f^{(n)}(x_0)}{n!}(x-x_0)^n"
              fontSize={32}
              color={COLORS.vector}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: eˣ 展开动画 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s3Title }}>
            eˣ 的麦克劳林展开（阶次：{degree}）
          </div>
          <CoordinateSystem
            width={820}
            height={420}
            xRange={[-3, 3]}
            yRange={[-0.5, 8]}
            opacity={s3CoordOp}
          >
            {/* 真实 eˣ */}
            <FunctionPlot fn={(x) => Math.exp(x)} color={COLORS.primaryCurve} drawProgress={1} strokeWidth={3} />
            {/* 逼近多项式 */}
            <TaylorApprox degree={degree} drawProgress={drawProg} />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="e^x = \sum_{n=0}^\infty \frac{x^n}{n!} = 1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots,\;\;x\in(-\infty,+\infty)"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: sin x */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            sin x 的麦克劳林展开（奇次多项式逼近）
          </div>
          <CoordinateSystem
            width={820}
            height={380}
            xRange={[-5, 5]}
            yRange={[-2.5, 2.5]}
            opacity={s4CoordOp}
          >
            <FunctionPlot fn={Math.sin} color={COLORS.secondaryCurve} drawProgress={1} strokeWidth={3} />
            <SinTaylorApprox degree={sinDegree} drawProgress={sinDrawProg} />
          </CoordinateSystem>
          <div style={{ opacity: s4CoordOp }}>
            <MathFormula
              latex="\sin x = x - \frac{x^3}{3!}+\frac{x^5}{5!}-\cdots = \sum_{n=0}^\infty\frac{(-1)^n x^{2n+1}}{(2n+1)!}"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: ln(1+x) */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s5Title }}>
            ln(1+x) 的展开（间接法：利用 1/(1+x) 逐项积分）
          </div>
          <div style={{ opacity: s5Method }}>
            <MathFormula
              latex="\frac{1}{1+x} = \sum_{n=0}^\infty (-x)^n = 1-x+x^2-x^3+\cdots"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Formula }}>
            <MathFormula
              latex="\ln(1+x) = \int_0^x\!\frac{\mathrm{d}t}{1+t} = x - \frac{x^2}{2}+\frac{x^3}{3}-\cdots = \sum_{n=1}^\infty\frac{(-1)^{n-1}x^n}{n},\;\;x\in(-1,1]"
              fontSize={26}
              color={COLORS.vector}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="常用泰勒展开式总结" opacity={s6Op} width={980}>
            <div style={{ fontSize: 20, lineHeight: 2.0, color: COLORS.formula }}>
              <div>• eˣ = 1 + x + x²/2! + x³/3! + ...（x ∈ (-∞,+∞)）</div>
              <div>• sin x = x − x³/3! + x⁵/5! − ...（x ∈ (-∞,+∞)）</div>
              <div>• cos x = 1 − x²/2! + x⁴/4! − ...（x ∈ (-∞,+∞)）</div>
              <div>• ln(1+x) = x − x²/2 + x³/3 − ...（x ∈ (-1,1]）</div>
              <div>• 1/(1-x) = 1+x+x²+...（|x| &lt; 1）</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec04Taylor;
