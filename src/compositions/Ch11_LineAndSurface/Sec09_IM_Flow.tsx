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
const CYAN = "#8be9fd";

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps {
  index: number;
  text: string;
  opacity: number;
}
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity }) => (
  <div style={{ opacity, display: "flex", alignItems: "flex-start", gap: 12, fontSize: 26, color: TEXT }}>
    <span style={{ color: CYAN, fontWeight: "bold", minWidth: 28 }}>{index}.</span>
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
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = CYAN }) => (
  <div style={{
    opacity,
    display: "flex", alignItems: "center", gap: 20,
    padding: "12px 20px", background: "rgba(139,233,253,0.05)",
    borderRadius: 8, borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ color: accentColor, fontSize: 20, minWidth: 80, fontWeight: "bold" }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 20, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }} />
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：管道流量智能监控（哈根-泊肃叶流，曲面积分）
// ─────────────────────────────────────────────────────────────────────────────
const Ch11IMFlow: React.FC = () => {
  const frame = useCurrentFrame();

  // 6阶段时序（540帧）
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  const s1Op = fade(frame, 0, 30);
  const s2Op = fade(frame, 60, 20);
  const s3Op = fade(frame, 150, 20);
  const step1Op = fade(frame, 155, 20);
  const step2Op = fade(frame, 200, 20);
  const step3Op = fade(frame, 245, 20);
  const step4Op = fade(frame, 290, 20);
  const s4Op = fade(frame, 330, 25);
  const s5Op = fade(frame, 390, 30);
  const s6Op = fade(frame, 480, 25);

  // Stage 5：旋转摇摆展示截面流速剖面
  const rotY5 = interpolate(frame, [390, 480], [-Math.PI / 6, Math.PI / 6], clamp);

  // 流速采样点（单位：可视化坐标）
  // 截面在 xOy 平面，流速方向为 z 轴（管道轴向）
  // v(r) = 1 - r²，R=1
  const flowSamples = [
    { r: 0.0,  v: 1.00, c: RED    },  // 中心：最大流速
    { r: 0.4,  v: 0.84, c: ORANGE },  // r=0.4
    { r: 0.7,  v: 0.51, c: YELLOW },  // r=0.7
    { r: 0.9,  v: 0.19, c: GREEN  },  // r=0.9（接近边缘）
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* ── Stage 1: 标题 + 题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: CYAN, fontSize: 22, fontFamily: "monospace" }}>
              第十一章 · 曲线积分与曲面积分 · 智能制造案例
            </div>
            <div style={{ color: FORMULA, fontSize: 52, fontWeight: "bold" }}>
              管道流量智能监控
            </div>
            <div style={{ color: TEXT, fontSize: 28 }}>
              曲面积分的工业应用 · 哈根-泊肃叶（Poiseuille）流
            </div>
            <div style={{ color: CYAN, fontSize: 22, fontFamily: "monospace", marginTop: 8 }}>
              智能制造 · 液压/气动管道系统精确流量计算
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 2: 工程背景 + 3D 初览 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1680, display: "flex", gap: 50, alignItems: "flex-start" }}>
          {/* 左：题目说明 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ color: CYAN, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>
              📋 工程背景与数学建模
            </div>
            <ExampleBox exampleNum="案例" title="圆管截面流量计算"
              width={740} opacity={1} accentColor={CYAN}>
              <div style={{ padding: "8px 0", fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
                <div>
                  圆管截面半径 <span dangerouslySetInnerHTML={{ __html: math("R=1") }} />，
                  流速分布（Poiseuille剖面）：
                </div>
                <div style={{ textAlign: "center", margin: "10px 0", fontSize: 26 }}>
                  <span dangerouslySetInnerHTML={{ __html: math("v(x,y)=v_0\\bigl(1-x^2-y^2\\bigr)", true) }} />
                </div>
                <div>
                  体积流量：
                  <span dangerouslySetInnerHTML={{ __html: math("Q=\\iint_S v\\,dA") }} />
                </div>
              </div>
            </ExampleBox>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AnalysisItem index={1} opacity={fade(frame, 70, 15)}
                text={`抛物型剖面：中心 (0,0) 处流速最大&nbsp;${math("v_0")}，边缘 r=R=1 处为零`} />
              <AnalysisItem index={2} opacity={fade(frame, 90, 15)}
                text={`<strong style="color:${YELLOW}">Polanyi直觉</strong>：流速分布曲面 z=v(x,y) 是一个抛物面！`} />
              <AnalysisItem index={3} opacity={fade(frame, 110, 15)}
                text="体积流量 = 流速曲面下方的「体积」= 抛物体积（二重积分）" />
            </div>
          </div>

          {/* 右：3D 流速剖面可视化 */}
          <div style={{ width: 700, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CoordinateSystem3D center={[350, 300]} scale={120}
              xRange={[-1.3, 1.3]} yRange={[-1.3, 1.3]} zRange={[0, 1.3]}
              showGrid={true} width={700} height={520}
              rotationX={Math.PI / 5} rotationY={Math.PI / 4}
            >
              {/* 流速剖面曲面 z = 1 - r² = 1 - x² - y²（抛物面） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(u, _v) => Math.max(0, 1 - u * u)}
                uMin={0} uMax={1} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={CYAN} strokeWidth={1} opacity={0.60}
              />
              {/* 管壁圆周 */}
              <ParametricCurve3D
                x={(t) => Math.cos(t)} y={(t) => Math.sin(t)} z={(_t) => 0}
                tMin={0} tMax={2 * Math.PI} segments={40}
                color={ORANGE} strokeWidth={3}
              />
              {/* 中心轴流线（最大流速） */}
              <ParametricCurve3D
                x={(_t) => 0} y={(_t) => 0} z={(t) => t}
                tMin={0} tMax={1} segments={10}
                color={RED} strokeWidth={4}
              />
            </CoordinateSystem3D>
            <div style={{ color: TEXT, fontSize: 18, marginTop: 6, textAlign: "center" }}>
              <span style={{ color: CYAN }}>青色抛物面</span>：流速分布 v(r)&nbsp;|&nbsp;
              <span style={{ color: ORANGE }}>橙色圆</span>：管壁（r=1）&nbsp;|&nbsp;
              <span style={{ color: RED }}>红色轴线</span>：中心最大流速
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 3: 分步推导 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1160, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: CYAN, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>
            📐 哈根-泊肃叶流量推导（令 v₀=1）
          </div>

          <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.8, marginBottom: 8 }}>
            速度分布：
            <span dangerouslySetInnerHTML={{ __html: math("v(r) = 1-r^2,\\quad r=\\sqrt{x^2+y^2}\\leq 1") }} />
          </div>

          <StepRow label="Step 1"
            latex={"Q = \\iint_D (1-x^2-y^2)\\,dA"}
            note="曲面积分定义" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2"
            latex={"= \\int_0^{2\\pi}d\\theta\\int_0^1(1-r^2)\\cdot r\\,dr"}
            note="极坐标代换" opacity={step2Op} accentColor={CYAN} />
          <StepRow label="Step 3"
            latex={"= 2\\pi\\int_0^1(r-r^3)\\,dr = 2\\pi\\left[\\frac{r^2}{2}-\\frac{r^4}{4}\\right]_0^1"}
            note="计算径向积分" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="Step 4"
            latex={"= 2\\pi\\cdot\\frac{1}{4}=\\frac{\\pi}{2}"}
            note="体积流量 Q = π/2" opacity={step4Op} accentColor={YELLOW} />

          <div style={{
            opacity: fade(frame, 300, 20),
            padding: "12px 20px", background: "rgba(139,233,253,0.06)",
            borderRadius: 8, fontSize: 21, color: TEXT, lineHeight: 1.7, marginTop: 4,
          }}>
            💡 推广到一般 Poiseuille 流：
            <span dangerouslySetInnerHTML={{ __html: math(
              "Q = \\iint_D v_0\\left(1-\\frac{r^2}{R^2}\\right)dA = \\frac{\\pi v_0 R^2}{2}"
            ) }} />
            （流量与 R² 成正比！半径增大一倍，流量增大四倍）
          </div>
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="哈根-泊肃叶流量公式" width={900} opacity={1}>
            <div style={{ textAlign: "center", padding: "16px 0", fontSize: 34, color: FORMULA }}>
              <span dangerouslySetInnerHTML={{ __html: math("Q = \\dfrac{\\pi v_0 R^2}{2}", true) }} />
            </div>
            <div style={{ fontSize: 22, color: TEXT, textAlign: "center", marginTop: 8, lineHeight: 1.8 }}>
              v₀ = 管轴最大流速，R = 管道半径<br />
              等价于：截面平均流速 = v₀/2（抛物体积等于底面积 × 高度的一半）
            </div>
          </TheoremBox>
          <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
            {[
              { label: "R 加倍", effect: "Q 增大 4 倍", c: RED },
              { label: "v₀ 加倍", effect: "Q 增大 2 倍", c: ORANGE },
              { label: "黏度增大", effect: "v₀ 减小，Q 下降", c: PURPLE },
            ].map(({ label, effect, c }) => (
              <div key={label} style={{
                padding: "12px 20px", background: "rgba(139,233,253,0.05)",
                borderRadius: 8, borderLeft: `3px solid ${c}`, minWidth: 200,
              }}>
                <div style={{ color: c, fontSize: 18, fontWeight: "bold" }}>{label}</div>
                <div style={{ color: TEXT, fontSize: 16, marginTop: 4 }}>{effect}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage 5: 3D 旋转可视化 + 速度向量场 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: CYAN, fontSize: 26, fontWeight: "bold" }}>
            🌐 Polanyi 直觉：Poiseuille 流的抛物型流速剖面
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            <CoordinateSystem3D center={[410, 320]} scale={130}
              xRange={[-1.3, 1.3]} yRange={[-1.3, 1.3]} zRange={[0, 1.5]}
              showGrid={true} width={820} height={580}
              rotationX={Math.PI / 5} rotationY={rotY5}
            >
              {/* 抛物面流速剖面 */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(u, _v) => Math.max(0, 1 - u * u)}
                uMin={0} uMax={1} uSteps={12}
                vMin={0} vMax={2 * Math.PI} vSteps={28}
                color={CYAN} strokeWidth={1} opacity={0.55}
              />
              {/* 管壁圆周 */}
              <ParametricCurve3D
                x={(t) => Math.cos(t)} y={(t) => Math.sin(t)} z={(_t) => 0}
                tMin={0} tMax={2 * Math.PI} segments={40}
                color={ORANGE} strokeWidth={3}
              />
              {/* 四个方向的径向速度向量（从截面出发，沿z轴方向，长度=速度） */}
              {flowSamples.map(({ r, v, c }) => (
                <AnimatedVector3D key={r}
                  from={[r, 0, 0]}
                  to={[r, 0, v]}
                  color={c} strokeWidth={3} opacity={0.9}
                  label={r === 0 ? "v_max" : undefined}
                />
              ))}
              {/* 反方向也画（对称性） */}
              {flowSamples.slice(1).map(({ r, v, c }) => (
                <AnimatedVector3D key={`neg${r}`}
                  from={[-r, 0, 0]}
                  to={[-r, 0, v]}
                  color={c} strokeWidth={3} opacity={0.7}
                />
              ))}
              {/* y 轴方向 */}
              {flowSamples.slice(1).map(({ r, v, c }) => (
                <AnimatedVector3D key={`y${r}`}
                  from={[0, r, 0]}
                  to={[0, r, v]}
                  color={c} strokeWidth={2} opacity={0.6}
                />
              ))}
            </CoordinateSystem3D>

            {/* 右侧：流速对比说明 */}
            <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 16, paddingTop: 20 }}>
              <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold" }}>
                不同半径处的流速&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("v=1-r^2") }} />：
              </div>
              {flowSamples.map(({ r, v, c }) => (
                <div key={r} style={{
                  display: "flex", gap: 14, alignItems: "center",
                  padding: "10px 14px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 8, borderLeft: `4px solid ${c}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: c, fontSize: 17, fontWeight: "bold" }}>
                      r = {r.toFixed(1)}（{r === 0 ? "中心" : r < 0.5 ? "近中心" : r < 0.8 ? "中间" : "近边缘"}）
                    </div>
                    <div style={{ color: TEXT, fontSize: 15, marginTop: 2 }}>
                      {r === 0 ? "最大流速，不受管壁影响" : r < 0.5 ? "流速较大" : r < 0.8 ? "流速中等" : "受管壁粘滞阻力，接近零"}
                    </div>
                  </div>
                  <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold", minWidth: 60, textAlign: "right" }}>
                    {v.toFixed(2)}v₀
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 4, padding: "12px 16px",
                background: "rgba(139,233,253,0.08)", borderRadius: 8,
                fontSize: 18, color: TEXT, lineHeight: 1.6,
              }}>
                💡 流速剖面是<strong style={{ color: CYAN }}>抛物面</strong>，
                整个流量 = 抛物体的体积
                = <span dangerouslySetInnerHTML={{ __html: math("\\pi R^2 \\cdot v_0/2") }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 工程总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 950, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: CYAN, fontSize: 32, fontWeight: "bold" }}>💡 工程应用总结</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              `流量公式推广：${math("Q = \\iint_S \\vec{v}\\cdot\\hat{n}\\,dS")} 适用任意截面形状和速度分布`,
              `<strong style="color:${YELLOW}">Poiseuille 默会知识</strong>：管道流速永远是抛物型剖面——中心快、边缘慢，这是粘性流体的本质特征`,
              `工业流量计（电磁/超声/科氏力）本质上均在测量截面积分——物理量 × 面积`,
              `曲面积分是理解质量流量、热通量、电磁通量的统一数学框架`,
            ].map((text, i) => (
              <div key={i} style={{
                opacity: fade(frame, 487 + i * 12, 15),
                display: "flex", gap: 12, fontSize: 23, color: TEXT,
                padding: "10px 16px", background: "rgba(139,233,253,0.05)",
                borderRadius: 8, borderLeft: `3px solid ${CYAN}`,
              }}>
                <span style={{ color: CYAN, fontWeight: "bold" }}>▸</span>
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>
          <div style={{
            opacity: fade(frame, 533, 7),
            marginTop: 8, padding: "12px 20px",
            background: "rgba(139,233,253,0.08)", borderRadius: 10,
            fontSize: 22, color: CYAN, textAlign: "center",
          }}>
            智能制造 · 曲面积分 · Poiseuille 流量精确测量
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const WCh11IMFlow = withWatermark(Ch11IMFlow);
export default WCh11IMFlow;
