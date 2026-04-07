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

// 比较审敛法柱状对比图
const ComparisonBars: React.FC<{ barCount: number; opacity?: number }> = ({ barCount, opacity = 1 }) => {
  const bars: React.ReactNode[] = [];
  const baseX = 80;
  const baseY = 280;
  const barW = 40;
  const gap = 20;
  for (let n = 1; n <= barCount; n++) {
    const an = 1 / (n * n); // 收敛级数 ∑1/n²
    const bn = 1 / n;       // 发散级数 ∑1/n（作为上界）
    const scale = 180;
    const x = baseX + (n - 1) * (barW + gap);
    bars.push(
      <g key={n}>
        {/* bn（上界，粉色） */}
        <rect x={x} y={baseY - bn * scale} width={barW * 0.45} height={bn * scale}
          fill={COLORS.secondaryCurve} opacity={0.5} />
        {/* an（被比较，蓝色） */}
        <rect x={x + barW * 0.55} y={baseY - an * scale} width={barW * 0.45} height={an * scale}
          fill={COLORS.primaryCurve} opacity={0.7} />
      </g>
    );
  }
  return (
    <svg width={700} height={320} opacity={opacity}>
      <line x1={60} y1={baseY} x2={660} y2={baseY} stroke={COLORS.axis} strokeWidth={2} />
      {bars}
      <text x={150} y={baseY + 25} fill={COLORS.secondaryCurve} fontSize={16}>bₙ = 1/n（发散级数）</text>
      <text x={380} y={baseY + 25} fill={COLORS.primaryCurve} fontSize={16}>aₙ = 1/n² (≤bₙ)</text>
    </svg>
  );
};

const Sec02Tests: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : frame < 480 ? 5
    : 6;

  const s1Op = fade(frame, 0);

  // Scene 2: 比较审敛法
  const s2Title = fade(frame, 60, 20);
  const barCount = Math.round(interpolate(frame, [78, 160], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const s2Formula = fade(frame, 148, 20);

  // Scene 3: 比值审敛法
  const s3Title = fade(frame, 180, 20);
  const s3Formula = fade(frame, 198, 20);
  const s3Cases = fade(frame, 228, 20);
  const s3Example = fade(frame, 260, 20);
  const s3Result = fade(frame, 280, 20);

  // Scene 4: 莱布尼茨定理
  const s4Title = fade(frame, 300, 20);
  const s4Cond = fade(frame, 318, 20);
  const s4Formula = fade(frame, 348, 20);
  const s4Example = fade(frame, 370, 18);

  // Scene 5: 绝对收敛与条件收敛
  const s5Title = fade(frame, 390, 20);
  const s5Def1 = fade(frame, 408, 20);
  const s5Def2 = fade(frame, 435, 20);
  const s5Note = fade(frame, 460, 18);

  // Scene 6: 总结
  const s6Op = fade(frame, 480, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.2"
          sectionTitle="常数项级数审敛法"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 比较审敛法 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            比较审敛法：aₙ ≤ bₙ，若 ∑bₙ 收敛则 ∑aₙ 收敛
          </div>
          <ComparisonBars barCount={barCount} opacity={1} />
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="0 \leq a_n \leq b_n:\;\; \sum b_n\text{ 收敛}\Rightarrow\sum a_n\text{ 收敛};\;\;\sum a_n\text{ 发散}\Rightarrow\sum b_n\text{ 发散}"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 比值审敛法 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>比值审敛法（达朗贝尔判别法）</div>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\rho = \lim_{n\to\infty}\frac{a_{n+1}}{a_n}"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Cases, color: COLORS.annotation, fontSize: 22, textAlign: "center", lineHeight: 2 }}>
            ρ &lt; 1 → 绝对收敛；ρ &gt; 1 → 发散；ρ = 1 → 判别法失效
          </div>
          <div style={{ opacity: s3Example }}>
            <MathFormula
              latex="\text{例：}\sum\frac{n!}{n^n},\;\rho = \lim\frac{(n+1)!/(n+1)^{n+1}}{n!/n^n} = \lim\left(\frac{n}{n+1}\right)^n = \frac{1}{e}"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Result, padding: "8px 20px", border: `1px solid ${COLORS.primaryCurve}`, borderRadius: 8 }}>
            <span style={{ color: COLORS.primaryCurve, fontSize: 22 }}>ρ = 1/e &lt; 1，收敛</span>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 莱布尼茨定理 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            莱布尼茨定理（交错级数）
          </div>
          <div style={{ opacity: s4Cond, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            交错级数 ∑(-1)^(n-1) uₙ（uₙ &gt; 0），若满足：
          </div>
          <div style={{ opacity: s4Formula }}>
            <MathFormula
              latex="u_1 \geq u_2 \geq u_3 \geq \cdots \geq 0 \;\;\text{且}\;\; \lim_{n\to\infty} u_n = 0"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Formula }}>
            <MathFormula
              latex="\Rightarrow\; \sum_{n=1}^\infty (-1)^{n-1}u_n \;\text{收敛}"
              fontSize={32}
              color={COLORS.secondaryCurve}
            />
          </div>
          <div style={{ opacity: s4Example, color: COLORS.annotation, fontSize: 20 }}>
            例：∑(-1)^(n-1)/n = 1-1/2+1/3-... = ln 2（条件收敛）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 绝对收敛与条件收敛 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s5Title }}>绝对收敛与条件收敛</div>
          <div style={{ opacity: s5Def1 }}>
            <MathFormula
              latex="\text{绝对收敛：}\sum|u_n|\text{ 收敛}\;\Rightarrow\;\sum u_n\text{ 收敛}"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Def2 }}>
            <MathFormula
              latex="\text{条件收敛：}\sum u_n\text{ 收敛，但}\sum|u_n|\text{ 发散}"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Note, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            绝对收敛 → 条件收敛（反之不成立）<br />
            绝对收敛级数可任意重排而不改变和
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="审敛法总结" opacity={s6Op} width={980}>
            <div style={{ fontSize: 21, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>比较审敛法</span>：0≤aₙ≤bₙ，∑bₙ收敛⇒∑aₙ收敛（极限比较也可用）</div>
              <div>• <span style={{ color: COLORS.vector }}>比值审敛法</span>：ρ=lim|a_(n+1)/aₙ|，ρ&lt;1收敛，ρ&gt;1发散</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>莱布尼茨定理</span>：单调递减趋零的交错级数收敛</div>
              <div>• <span style={{ color: COLORS.highlight }}>绝对收敛</span>：∑|uₙ|收敛⇒∑uₙ绝对收敛（更强）</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Tests;
