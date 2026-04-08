import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 收敛区间数轴动画
const ConvergenceInterval: React.FC<{ R: number; showEndpoints?: boolean; opacity?: number }> = ({
  R,
  showEndpoints = false,
  opacity = 1,
}) => {
  const w = 700;
  const cx = w / 2;
  const cy = 60;
  const scale = 120;
  return (
    <svg width={w} height={120} opacity={opacity}>
      {/* 数轴 */}
      <line x1={30} y1={cy} x2={w - 30} y2={cy} stroke={COLORS.axis} strokeWidth={2} />
      {/* 收敛区间 */}
      <line x1={cx - R * scale} y1={cy} x2={cx + R * scale} y2={cy}
        stroke={COLORS.primaryCurve} strokeWidth={8} strokeLinecap="round" />
      {/* -R 端点 */}
      <circle cx={cx - R * scale} cy={cy} r={8}
        fill={showEndpoints ? COLORS.highlight : COLORS.background}
        stroke={COLORS.primaryCurve} strokeWidth={2.5} />
      {/* R 端点 */}
      <circle cx={cx + R * scale} cy={cy} r={8}
        fill={showEndpoints ? COLORS.highlight : COLORS.background}
        stroke={COLORS.primaryCurve} strokeWidth={2.5} />
      {/* 标注 */}
      <text x={cx - R * scale} y={cy + 28} textAnchor="middle" fill={COLORS.annotation} fontSize={18}>-R</text>
      <text x={cx + R * scale} y={cy + 28} textAnchor="middle" fill={COLORS.annotation} fontSize={18}>R</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill={COLORS.annotation} fontSize={16}>0</text>
      <circle cx={cx} cy={cy} r={4} fill={COLORS.axis} />
      {/* 收敛区间标签 */}
      <text x={cx} y={cy - 20} textAnchor="middle" fill={COLORS.primaryCurve} fontSize={18}>收敛区间 (-R, R)</text>
    </svg>
  );
};

const Sec03Power: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 收敛半径
  const s2Title = fade(frame, 60, 20);
  const s2IntervalOp = fade(frame, 78, 25);
  const s2Abel = fade(frame, 112, 20);
  const s2Def = fade(frame, 148, 20);

  // Scene 3: 收敛半径公式
  const s3Title = fade(frame, 180, 20);
  const s3Formula1 = fade(frame, 198, 20);
  const s3Formula2 = fade(frame, 232, 20);
  const s3Example = fade(frame, 260, 20);
  const s3ExResult = fade(frame, 278, 18);

  // Scene 4: 逐项求导/积分
  const s4Title = fade(frame, 300, 20);
  const s4Diff = fade(frame, 318, 20);
  const s4Int = fade(frame, 348, 20);
  const s4Note = fade(frame, 378, 18);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  const R = interpolate(frame, [78, 140], [0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.3"
          sectionTitle="幂级数"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 收敛半径 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            收敛半径 R：幂级数的收敛区间为 (-R, R)
          </div>
          <ConvergenceInterval R={R} opacity={s2IntervalOp} />
          <div style={{ opacity: s2Abel }}>
            <MathFormula
              latex="\text{阿贝尔定理：若}x=x_0\text{处收敛，则}|x|<|x_0|\text{处绝对收敛}"
              fontSize={28}
              color={COLORS.annotation}
            />
          </div>
          <div style={{ opacity: s2Def, color: COLORS.annotation, fontSize: 20, textAlign: "center" }}>
            端点 x = ±R 处需单独验证（可能收敛也可能发散）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 收敛半径公式 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>收敛半径计算公式</div>
          <div style={{ opacity: s3Formula1 }}>
            <MathFormula
              latex="R = \lim_{n\to\infty}\left|\frac{a_n}{a_{n+1}}\right| \quad \text{（比值法）}"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Formula2 }}>
            <MathFormula
              latex="R = \frac{1}{\displaystyle\limsup_{n\to\infty}\sqrt[n]{|a_n|}} \quad \text{（柯西-阿达马公式）}"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Example }}>
            <MathFormula
              latex="\text{例：}\sum n x^n,\;\; R = \lim\left|\frac{a_n}{a_{n+1}}\right| = \lim\frac{n}{n+1} = 1"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3ExResult, color: COLORS.primaryCurve, fontSize: 22 }}>
            收敛区间 (-1, 1)，端点需单独验证
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 逐项求导/积分 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>幂级数的分析性质</div>
          <div style={{ opacity: s4Diff }}>
            <MathFormula
              latex="\left(\sum_{n=0}^\infty a_n x^n\right)' = \sum_{n=1}^\infty n a_n x^{n-1},\;\;|x|<R"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Int }}>
            <MathFormula
              latex="\int_0^x\!\sum_{n=0}^\infty a_n t^n\,\mathrm{d}t = \sum_{n=0}^\infty \frac{a_n}{n+1}x^{n+1},\;\;|x|<R"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Note, color: COLORS.annotation, fontSize: 20, textAlign: "center" }}>
            逐项求导/积分后收敛半径不变（端点处收敛性可能改变）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="幂级数总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>收敛区间</span>：(-R, R)；收敛域需验证端点</div>
              <div>• <span style={{ color: COLORS.vector }}>收敛半径</span>：R = lim|aₙ/aₙ₊₁|（或柯西-阿达马公式）</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>分析性</span>：幂级数在收敛区间内可逐项微分、积分</div>
              <div>• <span style={{ color: COLORS.highlight }}>应用</span>：利用已知级数逐项求导/积分求新展开式</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Power;
