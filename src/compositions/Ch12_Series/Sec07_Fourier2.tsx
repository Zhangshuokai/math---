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

// 奇延拓后的正弦级数示意（方波类型）
const OddExtension: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  return (
    <CoordinateSystem
      width={820}
      height={300}
      xRange={[-4.5, 4.5]}
      yRange={[-1.5, 1.5]}
      opacity={opacity}
    >
      {/* 奇延拓方波 */}
      <FunctionPlot
        fn={(x) => {
          const t = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          return t < Math.PI ? 1 : -1;
        }}
        color={COLORS.secondaryCurve}
        drawProgress={1}
        strokeWidth={2.5}
        opacity={0.6}
      />
      <FourierSeries terms={5} drawProgress={1} color={COLORS.primaryCurve} />
    </CoordinateSystem>
  );
};

// 偶延拓后的余弦级数示意（三角波类型）
const EvenExtension: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  // 偶延拓：三角波 f(x)=x 在 [0,π] 偶延拓
  const evenTriangle = (x: number): number => {
    const t = Math.abs(((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    return t <= Math.PI ? (Math.PI / 2 - Math.abs(t - Math.PI / 2)) / (Math.PI / 2) : 0;
  };
  // 余弦级数逼近（仅偶函数）
  const cosineApprox = (x: number): number => {
    let sum = Math.PI / 4;
    for (let k = 1; k <= 5; k++) {
      sum += (2 / Math.PI) * (Math.cos((2 * k - 1) * x) / Math.pow(2 * k - 1, 2)) * (k % 2 === 1 ? -1 : 1);
    }
    return sum;
  };
  return (
    <CoordinateSystem
      width={820}
      height={300}
      xRange={[-4.5, 4.5]}
      yRange={[-0.3, 1.3]}
      opacity={opacity}
    >
      <FunctionPlot fn={evenTriangle} color={COLORS.vector} drawProgress={1} strokeWidth={2.5} opacity={0.6} />
      <FunctionPlot fn={cosineApprox} color={COLORS.tertiaryCurve} drawProgress={1} strokeWidth={2.5} />
    </CoordinateSystem>
  );
};

const Sec07Fourier2: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 周期 2l 的傅里叶级数
  const s2Title = fade(frame, 60, 20);
  const s2Formula1 = fade(frame, 78, 20);
  const s2Formula2 = fade(frame, 108, 20);
  const s2Formula3 = fade(frame, 138, 20);
  const s2Series = fade(frame, 160, 18);

  // Scene 3: 正弦级数（奇延拓）
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 25);
  const s3Formula = fade(frame, 252, 20);

  // Scene 4: 余弦级数（偶延拓）
  const s4Title = fade(frame, 300, 20);
  const s4CoordOp = fade(frame, 315, 25);
  const s4Formula = fade(frame, 360, 20);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.7"
          sectionTitle="一般周期函数的傅里叶级数"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 周期 2l 公式 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 18, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            周期为 2l 的傅里叶级数
          </div>
          <div style={{ opacity: s2Formula1 }}>
            <MathFormula
              latex="a_n = \frac{1}{l}\int_{-l}^{l} f(x)\cos\frac{n\pi x}{l}\,\mathrm{d}x"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Formula2 }}>
            <MathFormula
              latex="b_n = \frac{1}{l}\int_{-l}^{l} f(x)\sin\frac{n\pi x}{l}\,\mathrm{d}x"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Formula3 }}>
            <MathFormula
              latex="f(x) \sim \frac{a_0}{2} + \sum_{n=1}^\infty\left(a_n\cos\frac{n\pi x}{l}+b_n\sin\frac{n\pi x}{l}\right)"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Series, color: COLORS.annotation, fontSize: 20 }}>
            当 l = π 时退化为标准周期 2π 的傅里叶级数
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 正弦级数（奇延拓） */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 24, opacity: s3Title }}>
            奇延拓 → 正弦级数（只含 sin 项）
          </div>
          <OddExtension opacity={s3CoordOp} />
          <div style={{ display: "flex", gap: 30, opacity: s3CoordOp }}>
            <span style={{ color: COLORS.secondaryCurve, fontSize: 18 }}>— 奇延拓函数</span>
            <span style={{ color: COLORS.primaryCurve, fontSize: 18 }}>— 正弦级数逼近（5 项）</span>
          </div>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="b_n = \frac{2}{l}\int_0^l f(x)\sin\frac{n\pi x}{l}\,\mathrm{d}x,\;\; a_n = 0"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 余弦级数（偶延拓） */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
          <div style={{ color: COLORS.vector, fontSize: 24, opacity: s4Title }}>
            偶延拓 → 余弦级数（只含 cos 项）
          </div>
          <EvenExtension opacity={s4CoordOp} />
          <div style={{ display: "flex", gap: 30, opacity: s4CoordOp }}>
            <span style={{ color: COLORS.vector, fontSize: 18 }}>— 偶延拓三角波</span>
            <span style={{ color: COLORS.tertiaryCurve, fontSize: 18 }}>— 余弦级数逼近（5 项）</span>
          </div>
          <div style={{ opacity: s4Formula }}>
            <MathFormula
              latex="a_n = \frac{2}{l}\int_0^l f(x)\cos\frac{n\pi x}{l}\,\mathrm{d}x,\;\; b_n = 0"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="一般周期傅里叶级数总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>周期 2l</span>：系数公式中用 nπx/l 代替 nx</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>奇延拓</span>：得正弦级数，aₙ=0，bₙ = 2/l ∫₀ˡ f(x)sin(nπx/l)dx</div>
              <div>• <span style={{ color: COLORS.vector }}>偶延拓</span>：得余弦级数，bₙ=0，aₙ = 2/l ∫₀ˡ f(x)cos(nπx/l)dx</div>
              <div>• <span style={{ color: COLORS.highlight }}>应用</span>：定义在 [0,l] 上的函数可按需选择奇/偶延拓</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec07Fourier2;
