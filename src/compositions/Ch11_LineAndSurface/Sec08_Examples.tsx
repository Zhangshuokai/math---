import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { ExampleBox } from "../../components/ui/ExampleBox";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";
import { ParametricCurve3D } from "../../components/math/ParametricCurve3D";
import { AnimatedVector3D } from "../../components/math/AnimatedVector3D";
import { withWatermark } from "../../components/ui/Watermark";

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (f: number, start: number, duration = 20): number =>
  interpolate(f, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const math = (latex: string, display = false): string =>
  katex.renderToString(latex, { throwOnError: false, displayMode: display });

// ─────────────────────────────────────────────────────────────────────────────
// 颜色常量
// ─────────────────────────────────────────────────────────────────────────────
const BG = COLORS.background;
const ACCENT = COLORS.primaryCurve ?? "#61dafb";
const TEXT = COLORS.annotation ?? "#94a3b8";
const FORMULA = COLORS.formula ?? "#f8f8f2";
const PURPLE = "#bd93f9";
const GREEN = "#50fa7b";
const YELLOW = "#f1fa8c";
const ORANGE = "#ffb86c";
const RED = "#ff5555";

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps {
  index: number;
  text: string;
  opacity: number;
  accentColor?: string;
}
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = ACCENT }) => (
  <div style={{ opacity, display: "flex", alignItems: "flex-start", gap: 12, fontSize: 24, color: TEXT }}>
    <span style={{ color: accentColor, fontWeight: "bold", minWidth: 28 }}>{index}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

interface StepRowProps {
  label: string;
  latex: string;
  note: string;
  opacity: number;
  accentColor?: string;
}
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = ACCENT }) => (
  <div style={{
    opacity,
    display: "flex", alignItems: "center", gap: 20,
    padding: "10px 18px", background: "rgba(97,218,251,0.06)",
    borderRadius: 8, borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ color: accentColor, fontSize: 18, minWidth: 80, fontWeight: "bold" }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 18, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }} />
    <span style={{ color: TEXT, fontSize: 15, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 例题1（全局帧 0–539）：输电线质量（第一类曲线积分，螺旋线）
// ─────────────────────────────────────────────────────────────────────────────
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  const s1Op = fade(frame, 0, 30);
  const s2Op = fade(frame, 60, 20);
  const s3Op = fade(frame, 150, 20);
  const step1Op = fade(frame, 155, 20);
  const step2Op = fade(frame, 200, 20);
  const step3Op = fade(frame, 245, 20);
  const step4Op = fade(frame, 290, 20);
  const s4Op = fade(frame, 330, 25);
  const s6Op = fade(frame, 480, 25);

  // Scene 5：螺旋线描绘进度 + 旋转
  const drawProg = interpolate(frame, [390, 450], [0, 1], clamp);
  const rotY5 = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI * 9 / 4], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Stage 1: 展示题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold", fontFamily: "monospace" }}>
            第十一章 · 曲线积分与曲面积分 · 例题 1 / 3
          </div>
          <ExampleBox exampleNum="例1" title="输电线的总质量（第一类曲线积分）"
            width={1060} opacity={1} accentColor={ACCENT}>
            <div style={{ padding: "12px 0", fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: FORMULA }}>工程背景：</strong>
                一根输电线沿空间螺旋线架设：
              </div>
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                <span dangerouslySetInnerHTML={{ __html: math(
                  "L:\\; x=\\cos t,\\; y=\\sin t,\\; z=t,\\quad t\\in[0,2\\pi]"
                ) }} />
              </div>
              <div>
                线密度（每米质量）为&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("\\rho(x,y,z)=\\sqrt{x^2+y^2+1}") }} />
                &nbsp;kg/m，求输电线总质量&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("M = \\int_L \\rho\\,ds") }} />。
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 审题分析</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AnalysisItem index={1} opacity={fade(frame, 65, 15)}
              text={`第一类曲线积分：对<strong style="color:${YELLOW}">弧长</strong>积分，与方向无关`} />
            <AnalysisItem index={2} opacity={fade(frame, 85, 15)}
              text={`螺旋线满足&nbsp;${math("x^2+y^2=\\cos^2t+\\sin^2t=1")}，故密度&nbsp;${math("\\rho=\\sqrt{1+1}=\\sqrt{2}")}&nbsp;为常数`} />
            <AnalysisItem index={3} opacity={fade(frame, 105, 15)}
              text={`弧长元素：${math("ds = \\sqrt{\\dot{x}^2+\\dot{y}^2+\\dot{z}^2}\\,dt = \\sqrt{\\sin^2t+\\cos^2t+1}\\,dt=\\sqrt{2}\\,dt")}`} />
            <AnalysisItem index={4} opacity={fade(frame, 125, 15)}
              text="因此被积函数和弧长元素均为常数，只需直接计算定积分" />
          </div>
        </div>
      )}

      {/* Stage 3: 分步计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1100, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1" latex={"x=\\cos t,\\;y=\\sin t,\\;z=t,\\;t\\in[0,2\\pi]"}
            note="参数化螺旋线" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2" latex={"ds=\\sqrt{(-\\sin t)^2+(\\cos t)^2+1^2}\\,dt=\\sqrt{2}\\,dt"}
            note="弧长元素" opacity={step2Op} accentColor={ACCENT} />
          <StepRow label="Step 3" latex={"\\rho = \\sqrt{\\cos^2t+\\sin^2t+1}=\\sqrt{2}"}
            note="密度为常数" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="Step 4" latex={"M=\\int_0^{2\\pi}\\sqrt{2}\\cdot\\sqrt{2}\\,dt=2\\int_0^{2\\pi}dt=4\\pi"}
            note="最终结果 M = 4π kg" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="例1 计算结果" width={900} opacity={1}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 36, color: FORMULA }}>
                <span dangerouslySetInnerHTML={{ __html: math("M = \\int_L \\rho\\,ds = 4\\pi \\approx 12.57 \\text{ kg}", true) }} />
              </div>
              <div style={{ color: TEXT, fontSize: 22, marginTop: 16 }}>
                螺旋线总长 <span dangerouslySetInnerHTML={{ __html: math("L=2\\sqrt{2}\\pi\\approx8.89\\text{ m}") }} />，
                线密度均匀 <span dangerouslySetInnerHTML={{ __html: math("\\rho=\\sqrt{2}\\text{ kg/m}") }} />，
                乘积恰好为 <span dangerouslySetInnerHTML={{ __html: math("4\\pi") }} />
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 螺旋线旋转展示 */}
      {scene === 5 && (
        <div style={{ opacity: fade(frame, 390, 25), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            🌐 Polanyi 直觉：螺旋线弧长 = 旋转半径 × 垂直上升的"合速度"
          </div>
          <CoordinateSystem3D center={[420, 330]} scale={75}
            xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]} zRange={[0, 7]}
            showGrid={true} width={840} height={560}
            rotationX={Math.PI / 6} rotationY={rotY5}
          >
            {/* 螺旋线：逐渐描绘 */}
            <ParametricCurve3D
              x={(t) => Math.cos(t)} y={(t) => Math.sin(t)} z={(t) => t}
              tMin={0} tMax={2 * Math.PI} segments={80}
              color={ACCENT} strokeWidth={4}
              drawProgress={drawProg}
            />
            {/* 圆柱面轮廓（辅助理解螺旋结构） */}
            <ParametricCurve3D
              x={(t) => Math.cos(t)} y={(t) => Math.sin(t)} z={(_t) => 0}
              tMin={0} tMax={2 * Math.PI} segments={40}
              color={PURPLE} strokeWidth={2}
            />
            {/* 中心轴 */}
            <ParametricCurve3D
              x={(_t) => 0} y={(_t) => 0} z={(t) => t}
              tMin={0} tMax={2 * Math.PI} segments={10}
              color={YELLOW} strokeWidth={2}
            />
          </CoordinateSystem3D>
          <div style={{ fontSize: 19, color: TEXT, textAlign: "center" }}>
            <span style={{ color: ACCENT }}>蓝色螺旋线</span>：输电线路径（逐渐描绘）&nbsp;|&nbsp;
            <span style={{ color: YELLOW }}>黄色轴</span>：z轴（垂直提升）
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>💡 总结：第一类曲线积分</div>
          {[
            `弧长元素 ${math("ds=|\\mathbf{r}'(t)|\\,dt")} 与切线方向无关，只与<strong style="color:${YELLOW}">速率</strong>有关`,
            `螺旋线特殊性：水平速率&nbsp;${math("1")} 与垂直速率&nbsp;${math("1")} 合成为&nbsp;${math("\\sqrt{2}")}，密度也是&nbsp;${math("\\sqrt{2}")}`,
            "第一类曲线积分 = 沿路径的\u201c加权弧长\u201d，是最自然的线积分形式",
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(frame, 487 + i * 14, 15),
              display: "flex", gap: 12, fontSize: 24, color: TEXT,
              padding: "10px 16px", background: "rgba(97,218,251,0.05)",
              borderRadius: 8, borderLeft: `3px solid ${ACCENT}`,
            }}>
              <span style={{ color: ACCENT, fontWeight: "bold" }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2（全局帧 540–1079）：飞行器变力做功（第二类曲线积分，Polanyi核心）
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 540;  // 局部帧
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 155, 20);
  const step2Op = fade(lf, 200, 20);
  const step3Op = fade(lf, 245, 20);
  const step4Op = fade(lf, 290, 20);
  const s4Op = fade(lf, 330, 25);
  const s6Op = fade(lf, 480, 25);

  // Scene 5：路径 + 力向量展示（全局帧 930–1020 旋转）
  const rotY5 = interpolate(frame, [930, 1020], [Math.PI / 4, Math.PI * 9 / 4], clamp);

  // 采样点处的力向量 F = (y, -x, z) = (t, -t, t²)
  const pts = [
    { t: 0.2, c: GREEN },
    { t: 0.4, c: YELLOW },
    { t: 0.6, c: ORANGE },
    { t: 0.8, c: RED },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Stage 1: 展示题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ color: GREEN, fontSize: 26, fontWeight: "bold", fontFamily: "monospace" }}>
            第十一章 · 曲线积分与曲面积分 · 例题 2 / 3
          </div>
          <ExampleBox exampleNum="例2" title="飞行器在力场中做的功（第二类曲线积分）"
            width={1060} opacity={1} accentColor={GREEN}>
            <div style={{ padding: "12px 0", fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: FORMULA }}>工程背景：</strong>
                飞行器在力场&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("\\vec{F}=(y,\\,-x,\\,z)") }} />
                &nbsp;中运动，路径为：
              </div>
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                <span dangerouslySetInnerHTML={{ __html: math(
                  "L:\\; x=t,\\; y=t,\\; z=t^2,\\quad t\\in[0,1]"
                ) }} />
              </div>
              <div>
                求力对飞行器做的功：&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("W = \\int_L P\\,dx+Q\\,dy+R\\,dz") }} />。
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: GREEN, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 审题分析</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AnalysisItem index={1} opacity={fade(lf, 65, 15)} accentColor={GREEN}
              text={`第二类曲线积分：${math("\\int_L\\vec{F}\\cdot d\\vec{r}")} 是<strong style="color:${YELLOW}">力沿路径做的功</strong>`} />
            <AnalysisItem index={2} opacity={fade(lf, 85, 15)} accentColor={GREEN}
              text={`路径参数化：令&nbsp;${math("x=t,\\;y=t,\\;z=t^2")}，则&nbsp;${math("dx=dt,\\;dy=dt,\\;dz=2t\\,dt")}`} />
            <AnalysisItem index={3} opacity={fade(lf, 105, 15)} accentColor={GREEN}
              text={`力的分量：${math("P=y=t,\\;Q=-x=-t,\\;R=z=t^2")}（注意 P+Q=0，大量抵消）`} />
            <AnalysisItem index={4} opacity={fade(lf, 125, 15)} accentColor={GREEN}
              text={`<strong style="color:${ORANGE}">Polanyi直觉</strong>：在每个点处，力向量与切线方向的点积 = 该点对做功的贡献`} />
          </div>
        </div>
      )}

      {/* Stage 3: 分步计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: GREEN, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1" latex={"dx=dt,\\;dy=dt,\\;dz=2t\\,dt"}
            note="微分替换" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2"
            latex={"W=\\int_0^1[t\\cdot dt+(-t)\\cdot dt+t^2\\cdot 2t\\,dt]"}
            note="代入 P,Q,R" opacity={step2Op} accentColor={GREEN} />
          <StepRow label="Step 3" latex={"=\\int_0^1[(t-t)+2t^3]\\,dt=\\int_0^1 2t^3\\,dt"}
            note="P dx + Q dy 相消！" opacity={step3Op} accentColor={ACCENT} />
          <StepRow label="Step 4" latex={"=\\left[\\frac{t^4}{2}\\right]_0^1=\\frac{1}{2}"}
            note="最终结果 W = 1/2 J" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="例2 计算结果" width={900} opacity={1}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 36, color: FORMULA }}>
                <span dangerouslySetInnerHTML={{ __html: math("W = \\frac{1}{2} \\text{ J}", true) }} />
              </div>
              <div style={{ color: TEXT, fontSize: 20, marginTop: 16, lineHeight: 1.7 }}>
                关键发现：x 分量和 y 分量的做功完全抵消（<span dangerouslySetInnerHTML={{ __html: math("P\\,dx+Q\\,dy=0") }} />），
                <br />
                总功仅来自 z 方向：<span dangerouslySetInnerHTML={{ __html: math("\\int_0^1 2t^3\\,dt = 1/2") }} />
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 路径 + 力向量旋转展示 */}
      {scene === 5 && (
        <div style={{ opacity: fade(lf, 390, 25), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: GREEN, fontSize: 24, fontWeight: "bold" }}>
            🌐 Polanyi：力向量与路径切线的夹角决定做功
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            <CoordinateSystem3D center={[400, 320]} scale={250}
              xRange={[-0.2, 1.2]} yRange={[-0.2, 1.2]} zRange={[0, 1.2]}
              showGrid={true} width={800} height={560}
              rotationX={Math.PI / 6} rotationY={rotY5}
            >
              {/* 路径曲线 L: (t, t, t²) */}
              <ParametricCurve3D
                x={(t) => t} y={(t) => t} z={(t) => t * t}
                tMin={0} tMax={1} segments={40}
                color={GREEN} strokeWidth={4}
              />
              {/* 在采样点显示力向量 F=(y,-x,z)=(t,-t,t²) */}
              {pts.map(({ t, c }) => {
                const scale = 0.18;
                return (
                  <AnimatedVector3D key={t}
                    from={[t, t, t * t]}
                    to={[t + scale * t, t + scale * (-t), t * t + scale * t * t]}
                    color={c} strokeWidth={3}
                    label={t === 0.5 ? "F" : undefined}
                  />
                );
              })}
            </CoordinateSystem3D>

            {/* 右侧：夹角直觉说明 */}
            <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 16, paddingTop: 30 }}>
              <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold", lineHeight: 1.7 }}>
                <strong style={{ color: GREEN }}>第二类曲线积分</strong>直觉：
              </div>
              {[
                { c: GREEN,  note: "力与切线同向 → 做功多（正功）" },
                { c: YELLOW, note: "力与切线垂直 → 做功为零" },
                { c: RED,    note: "力与切线反向 → 做功为负" },
              ].map(({ c, note }) => (
                <div key={note} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: "10px 14px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 8, borderLeft: `4px solid ${c}`,
                }}>
                  <span style={{ color: c, fontWeight: "bold", fontSize: 20 }}>▶</span>
                  <span style={{ color: TEXT, fontSize: 18 }}>{note}</span>
                </div>
              ))}
              <div style={{
                marginTop: 8, padding: "12px 16px",
                background: "rgba(80,250,123,0.08)", borderRadius: 8,
                fontSize: 18, color: TEXT, lineHeight: 1.6,
              }}>
                本题：x-y 分量的力与路径切线恰好<strong style={{ color: ORANGE }}>垂直抵消</strong>，
                只有 z 方向贡献做功
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: GREEN, fontSize: 32, fontWeight: "bold" }}>💡 总结：第二类曲线积分</div>
          {[
            `核心：${math("\\int_L\\vec{F}\\cdot d\\vec{r}=\\int_a^b\\vec{F}(\\mathbf{r}(t))\\cdot\\mathbf{r}'(t)\\,dt")} — 力·速度沿路径积分`,
            `Polanyi 直觉：每点的做功贡献 = 力向量与路径切线的<strong style="color:${YELLOW}">点积</strong>`,
            "对称性技巧：x-y 方向的力可能相互抵消，仔细观察可大幅简化计算",
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(lf, 487 + i * 14, 15),
              display: "flex", gap: 12, fontSize: 24, color: TEXT,
              padding: "10px 16px", background: "rgba(80,250,123,0.05)",
              borderRadius: 8, borderLeft: `3px solid ${GREEN}`,
            }}>
              <span style={{ color: GREEN, fontWeight: "bold" }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3（全局帧 1080–1619）：电场穿过球面的通量（曲面积分，法向量直觉）
// ─────────────────────────────────────────────────────────────────────────────
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 1080;  // 局部帧
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 155, 20);
  const step2Op = fade(lf, 200, 20);
  const step3Op = fade(lf, 245, 20);
  const step4Op = fade(lf, 290, 20);
  const s4Op = fade(lf, 330, 25);
  const s6Op = fade(lf, 480, 25);

  // Scene 5：球面 + 电场向量 + 法向量展示（全局帧 1470–1560 旋转）
  const rotY5 = interpolate(frame, [1470, 1560], [Math.PI / 4, Math.PI * 9 / 4], clamp);

  // 球面采样点：在上半球面几个位置展示电场 E=(0,0,E0) 和法向量 n
  // 球面 x²+y²+(z-1)²=1，参数化：x=sin(φ)cos(θ), y=sin(φ)sin(θ), z=1+cos(φ), φ∈[0,π/2]
  const E0 = 0.25; // 电场强度（可视化）
  const sampleVectors = [
    // 球顶 (0,0,2): 法向量=(0,0,1) 与 E 同向 → 最大通量
    { from: [0, 0, 1.8] as [number, number, number], E_to: [0, 0, 1.8 + E0] as [number, number, number], n_to: [0, 0, 2.1] as [number, number, number], c: GREEN },
    // 侧面 (1,0,1): 法向量=(1,0,0) 与 E 垂直 → 零通量
    { from: [0.9, 0, 0.9] as [number, number, number], E_to: [0.9, 0, 0.9 + E0] as [number, number, number], n_to: [1.2, 0, 0.9] as [number, number, number], c: YELLOW },
    // 另一侧 (-1,0,1)
    { from: [-0.9, 0, 0.9] as [number, number, number], E_to: [-0.9, 0, 0.9 + E0] as [number, number, number], n_to: [-1.2, 0, 0.9] as [number, number, number], c: YELLOW },
    // 斜面 (0.7,0,1.7): 法向量有分量 → 部分通量
    { from: [0.65, 0, 1.6] as [number, number, number], E_to: [0.65, 0, 1.6 + E0] as [number, number, number], n_to: [0.9, 0, 1.8] as [number, number, number], c: ORANGE },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Stage 1: 展示题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ color: ORANGE, fontSize: 26, fontWeight: "bold", fontFamily: "monospace" }}>
            第十一章 · 曲线积分与曲面积分 · 例题 3 / 3
          </div>
          <ExampleBox exampleNum="例3" title="均匀电场穿过球面的电通量（第二类曲面积分）"
            width={1060} opacity={1} accentColor={ORANGE}>
            <div style={{ padding: "12px 0", fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: FORMULA }}>工程背景：</strong>
                均匀竖直电场&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("\\vec{E}=(0,0,E_0)") }} />
                &nbsp;穿过球面 S 的上半部分：
              </div>
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                <span dangerouslySetInnerHTML={{ __html: math(
                  "S:\\; x^2+y^2+(z-1)^2=1\\text{ 的上半部分（}z\\geq1\\text{）}"
                ) }} />
              </div>
              <div>
                求电通量（穿过曲面的电场量）：&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("\\Phi=\\iint_S\\vec{E}\\cdot d\\vec{S}") }} />。
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 审题分析</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AnalysisItem index={1} opacity={fade(lf, 65, 15)} accentColor={ORANGE}
              text={`第二类曲面积分：${math("\\iint_S\\vec{E}\\cdot d\\vec{S}=\\iint_S E_z\\,dA")}（因为 E 只有 z 分量）`} />
            <AnalysisItem index={2} opacity={fade(lf, 85, 15)} accentColor={ORANGE}
              text={`上半球面表达式：${math("z=1+\\sqrt{1-x^2-y^2}")}，取<strong style="color:${GREEN}">外法线（上）</strong>方向`} />
            <AnalysisItem index={3} opacity={fade(lf, 105, 15)} accentColor={ORANGE}
              text={`向量面积元素：${math("d\\vec{S}=(-z_x,-z_y,1)\\,dA")}，${math("\\vec{E}\\cdot d\\vec{S}=E_0\\cdot 1\\cdot dA=E_0\\,dA")}`} />
            <AnalysisItem index={4} opacity={fade(lf, 125, 15)} accentColor={ORANGE}
              text={`<strong style="color:${YELLOW}">Polanyi直觉</strong>：只有法向量的 z 分量与电场 E 有点积，竖直电场只看"天花板效果"`} />
          </div>
        </div>
      )}

      {/* Stage 3: 分步计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: ORANGE, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1" latex={"z=1+\\sqrt{1-x^2-y^2},\\; z_x=\\frac{-x}{\\sqrt{1-x^2-y^2}},\\; z_y=\\frac{-y}{\\sqrt{1-x^2-y^2}}"}
            note="上半球面参数" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2"
            latex={"d\\vec{S}=\\left(\\frac{x}{\\sqrt{1-r^2}},\\frac{y}{\\sqrt{1-r^2}},1\\right)dA"}
            note="向量面积元素（上法线）" opacity={step2Op} accentColor={ORANGE} />
          <StepRow label="Step 3"
            latex={"\\vec{E}\\cdot d\\vec{S}=(0,0,E_0)\\cdot\\left(\\cdot,\\cdot,1\\right)dA=E_0\\,dA"}
            note="点积只剩 z 分量" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="Step 4"
            latex={"\\Phi=E_0\\iint_D dA=E_0\\cdot\\pi\\cdot 1^2=\\pi E_0"}
            note="D 为单位圆盘" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="例3 计算结果" width={900} opacity={1}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 36, color: FORMULA }}>
                <span dangerouslySetInnerHTML={{ __html: math("\\Phi = \\pi E_0", true) }} />
              </div>
              <div style={{ color: TEXT, fontSize: 20, marginTop: 16, lineHeight: 1.7 }}>
                竖直电场穿过上半球面的通量等于&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("E_0 \\times \\pi r^2") }} />
                <br />
                ——即电场乘以<strong style={{ color: YELLOW }}>投影圆面积</strong>（与球面弯曲形状无关！）
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 球面 + 电场向量 + 法向量展示 */}
      {scene === 5 && (
        <div style={{ opacity: fade(lf, 390, 25), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ORANGE, fontSize: 24, fontWeight: "bold" }}>
            🌐 Polanyi：法向量方向决定电通量的正负
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            <CoordinateSystem3D center={[400, 320]} scale={200}
              xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]} zRange={[0, 2.3]}
              showGrid={true} width={800} height={560}
              rotationX={Math.PI / 6} rotationY={rotY5}
            >
              {/* 上半球面 S */}
              <SurfaceMesh3D
                x={(u, v) => Math.sin(u) * Math.cos(v)}
                y={(u, v) => Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 1 + Math.cos(u)}
                uMin={0} uMax={Math.PI / 2} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={ORANGE} strokeWidth={1} opacity={0.5}
              />
              {/* 电场向量（竖直向上，青色） */}
              {sampleVectors.map(({ from, E_to }, i) => (
                <AnimatedVector3D key={`e${i}`}
                  from={from} to={E_to}
                  color={ACCENT} strokeWidth={2} opacity={0.85}
                  label={i === 0 ? "E" : undefined}
                />
              ))}
              {/* 法向量（外法线，各色） */}
              {sampleVectors.map(({ from, n_to, c }, i) => (
                <AnimatedVector3D key={`n${i}`}
                  from={from} to={n_to}
                  color={c} strokeWidth={2.5} opacity={0.9}
                  label={i === 0 ? "n" : undefined}
                />
              ))}
            </CoordinateSystem3D>

            {/* 右侧说明 */}
            <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 14, paddingTop: 20 }}>
              <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold" }}>法向量方向与通量：</div>
              {[
                { c: GREEN,  pos: "球顶（φ=0°）",  angle: "θ=0°",  flux: "最大通量 E₀·dA" },
                { c: YELLOW, pos: "球侧（φ=90°）", angle: "θ=90°", flux: "零通量（垂直）" },
                { c: ORANGE, pos: "斜面（φ=45°）", angle: "θ=45°", flux: "部分通量 E₀cos45°·dA" },
              ].map(({ c, pos, angle, flux }) => (
                <div key={pos} style={{
                  display: "flex", flexDirection: "column", gap: 4,
                  padding: "10px 14px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 8, borderLeft: `4px solid ${c}`,
                }}>
                  <div style={{ color: c, fontSize: 17, fontWeight: "bold" }}>{pos}（{angle}）</div>
                  <div style={{ color: TEXT, fontSize: 16 }}>{flux}</div>
                </div>
              ))}
              <div style={{
                marginTop: 8, padding: "12px 16px",
                background: "rgba(255,184,108,0.08)", borderRadius: 8,
                fontSize: 18, color: TEXT, lineHeight: 1.6,
              }}>
                <strong style={{ color: ACCENT }}>竖直电场</strong>穿过任何曲面，
                总通量 = E₀ × <strong style={{ color: YELLOW }}>水平投影面积</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: "bold" }}>💡 总结：第二类曲面积分</div>
          {[
            `核心：${math("\\iint_S\\vec{F}\\cdot d\\vec{S}=\\iint_D[F_x(-z_x)+F_y(-z_y)+F_z]\\,dA")} — 化为平面积分`,
            `法向量方向（内/外法线）决定积分<strong style="color:${YELLOW}">正负号</strong>，物理上对应"穿出"还是"穿入"`,
            `<strong style="color:${ORANGE}">投影等效</strong>：竖直均匀场穿过任意曲面的通量等于 E₀ × 水平投影面积（Gauss定理预兆）`,
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(lf, 487 + i * 14, 15),
              display: "flex", gap: 12, fontSize: 24, color: TEXT,
              padding: "10px 16px", background: "rgba(255,184,108,0.05)",
              borderRadius: 8, borderLeft: `3px solid ${ORANGE}`,
            }}>
              <span style={{ color: ORANGE, fontWeight: "bold" }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 顶层组件：把三道例题串联（1620 帧）
// ─────────────────────────────────────────────────────────────────────────────
const Ch11Sec08Examples: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 540)  return <Example1 frame={frame} />;
  if (frame < 1080) return <Example2 frame={frame} />;
  return <Example3 frame={frame} />;
};

const WCh11Sec08Examples = withWatermark(Ch11Sec08Examples);
export default WCh11Sec08Examples;
