import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { ExampleBox } from "../../components/ui/ExampleBox";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";

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
const ACCENT = COLORS.primaryCurve;
const TEXT = COLORS.annotation;
const FORMULA = COLORS.formula;
const ORANGE = "#ff9500";
const GREEN = COLORS.tertiaryCurve;
const PINK = COLORS.secondaryCurve;

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件：步骤行（含 Polanyi 默会知识提示）
// ─────────────────────────────────────────────────────────────────────────────
interface StepRowProps {
  label: string;
  latex: string;
  note: string;
  opacity: number;
  insight?: string;
}
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, insight }) => (
  <div style={{ opacity, display: "flex", flexDirection: "column", gap: 5 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 20,
      padding: "12px 20px", background: "rgba(97,218,251,0.06)",
      borderRadius: 8, borderLeft: `3px solid ${ACCENT}`,
    }}>
      <span style={{ color: ACCENT, fontSize: 20, minWidth: 80, fontWeight: "bold" }}>{label}</span>
      <span
        style={{ color: FORMULA, fontSize: 23, flex: 1 }}
        dangerouslySetInnerHTML={{ __html: math(latex) }}
      />
      <span style={{ color: TEXT, fontSize: 18, opacity: 0.7 }}>{note}</span>
    </div>
    {insight && (
      <div style={{
        marginLeft: 100, padding: "7px 14px",
        background: "rgba(255,149,0,0.08)", borderLeft: `2px solid ${ORANGE}`,
        borderRadius: 4, fontSize: 17, color: ORANGE,
      }}>
        💡 {insight}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RC电路示意图（纯 SVG，无 useEffect）
// ─────────────────────────────────────────────────────────────────────────────
const RCCircuitSVG: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={400} height={220} viewBox="0 0 400 220" style={{ opacity }}>
    {/* 电路外框矩形 */}
    <rect x={40} y={30} width={320} height={160} fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} rx={6} />
    {/* 电源 E（左边竖线+长短线） */}
    <line x1={40} y1={70} x2={40} y2={150} stroke={ACCENT} strokeWidth={3} />
    <line x1={26} y1={90} x2={54} y2={90} stroke={ACCENT} strokeWidth={3} />
    <line x1={30} y1={106} x2={50} y2={106} stroke={ACCENT} strokeWidth={2} />
    <text x={10} y={122} fill={ACCENT} fontSize={18} fontFamily="serif" fontWeight="bold">E</text>
    {/* 开关 K（上边，断开状态） */}
    <circle cx={130} cy={30} r={5} fill={ACCENT} />
    <line x1={130} y1={30} x2={158} y2={14} stroke={ACCENT} strokeWidth={2} />
    <circle cx={178} cy={30} r={5} fill={ACCENT} />
    <text x={136} y={12} fill={TEXT} fontSize={14} fontFamily="sans-serif">K</text>
    {/* 电阻 R（上边中段，矩形表示） */}
    <rect x={210} y={16} width={72} height={26} fill="none" stroke={ORANGE} strokeWidth={2.5} rx={4} />
    <text x={234} y={35} fill={ORANGE} fontSize={17} fontFamily="serif" fontWeight="bold">R</text>
    {/* 电容 C（右边，两平行线） */}
    <line x1={360} y1={58} x2={360} y2={95} stroke={ACCENT} strokeWidth={2.5} />
    <line x1={335} y1={95} x2={385} y2={95} stroke={ACCENT} strokeWidth={3} />
    <line x1={335} y1={108} x2={385} y2={108} stroke={ACCENT} strokeWidth={3} />
    <line x1={360} y1={108} x2={360} y2={150} stroke={ACCENT} strokeWidth={2.5} />
    <text x={390} y={106} fill={GREEN} fontSize={18} fontFamily="serif" fontWeight="bold">C</text>
    {/* u_C 标注 */}
    <text x={305} y={115} fill={GREEN} fontSize={13} fontFamily="sans-serif">u_C(t)</text>
    {/* 电流方向 */}
    <text x={204} y={26} fill={TEXT} fontSize={12} fontFamily="sans-serif">→ i</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// 弹簧-质量-阻尼示意图（纯 SVG）
// ─────────────────────────────────────────────────────────────────────────────
const SpringMassSVG: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={400} height={220} viewBox="0 0 400 220" style={{ opacity }}>
    {/* 天花板 */}
    <rect x={30} y={10} width={340} height={12} fill={`${ACCENT}25`} stroke={ACCENT} strokeWidth={1.5} />
    {/* 弹簧（锯齿折线） */}
    <polyline
      points="110,22 100,38 120,52 100,66 120,80 100,94 120,108 110,122"
      fill="none" stroke={ORANGE} strokeWidth={2.5} strokeLinejoin="round"
    />
    <text x={52} y={68} fill={ORANGE} fontSize={14} fontFamily="sans-serif">k=4 N/m</text>
    {/* 阻尼器 */}
    <line x1={270} y1={22} x2={270} y2={68} stroke={PINK} strokeWidth={2.5} />
    <rect x={246} y={68} width={48} height={34} fill="none" stroke={PINK} strokeWidth={2} rx={3} />
    <line x1={256} y1={85} x2={256} y2={85} stroke={PINK} strokeWidth={8} strokeLinecap="square" />
    <line x1={270} y1={102} x2={270} y2={122} stroke={PINK} strokeWidth={2.5} />
    <text x={306} y={88} fill={PINK} fontSize={13} fontFamily="sans-serif">c=2</text>
    <text x={306} y={102} fill={PINK} fontSize={11} fontFamily="sans-serif">N·s/m</text>
    {/* 质量块 */}
    <rect x={70} y={122} width={240} height={46} fill="rgba(97,218,251,0.12)" stroke={ACCENT} strokeWidth={2.5} rx={5} />
    <text x={138} y={151} fill={FORMULA} fontSize={19} fontFamily="sans-serif" fontWeight="bold">m = 1 kg</text>
    {/* 位移标注 */}
    <text x={322} y={150} fill={GREEN} fontSize={18} fontFamily="sans-serif">x(t)</text>
    <line x1={312} y1={145} x2={318} y2={145} stroke={GREEN} strokeWidth={2} />
    <polygon points="318,141 326,145 318,149" fill={GREEN} />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// 例题1：RC电路充电过程（帧 0–539）
// 可分离变量方程 RC·du_C/dt = E - u_C，R=1,C=1,E=10
// ─────────────────────────────────────────────────────────────────────────────
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  const step1Op = fade(frame, 150, 20);
  const step2Op = fade(frame, 197, 20);
  const step3Op = fade(frame, 244, 20);
  const step4Op = fade(frame, 291, 20);
  const conclusionOp = fade(frame, 330, 25);
  const plotOp = fade(frame, 390, 30);
  const drawProg = interpolate(frame, [402, 472], [0, 1], clamp);
  const tauOp = interpolate(frame, [440, 465], [0, 1], clamp);
  const summaryOp = fade(frame, 480, 25);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Scene 1: 题目 + 电路示意图 */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{
            color: ACCENT, fontSize: 34, fontWeight: "bold", letterSpacing: 2,
            borderBottom: `2px solid ${ACCENT}55`, paddingBottom: 10,
          }}>
            例题 1 · RC电路充电过程（可分离变量）
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <ExampleBox exampleNum={1} title="可分离变量方程" width={720} opacity={1}>
              <div style={{ padding: "14px 0", fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
                <p>
                  <strong style={{ color: ACCENT }}>物理背景：</strong>
                  电容从零开始充电，电压 <span dangerouslySetInnerHTML={{ __html: math("u_C") }} /> 满足：
                </p>
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                  <span dangerouslySetInnerHTML={{ __html: math("RC\\frac{du_C}{dt} = E - u_C", true) }} />
                </div>
                <p>
                  已知 <span dangerouslySetInnerHTML={{ __html: math("R=1\\,\\Omega,\\;C=1\\,\\text{F},\\;E=10\\,\\text{V}") }} />，
                  初值 <span dangerouslySetInnerHTML={{ __html: math("u_C(0)=0") }} />，
                  求 <span dangerouslySetInnerHTML={{ __html: math("u_C(t)") }} />。
                </p>
              </div>
            </ExampleBox>
            <RCCircuitSVG opacity={1} />
          </div>
        </div>
      )}

      {/* Scene 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, 60, 20), width: 1000, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 审题分析</div>
          {[
            {
              t: "代入 R=1, C=1, E=10，方程变为：",
              f: "\\frac{du_C}{dt} = 10 - u_C",
            },
            {
              t: "可分离变量形式：",
              f: "\\frac{du_C}{10 - u_C} = dt",
            },
            {
              t: "物理意义：充电速率随电容电压升高而减小（差值越小，速率越慢）",
              f: "",
            },
            {
              t: "解族特征：不同RC值对应不同充电速度，时间常数τ=RC决定快慢",
              f: "",
            },
          ].map(({ t, f }, i) => (
            <div
              key={i}
              style={{
                opacity: fade(frame, 66 + i * 20, 15),
                display: "flex", alignItems: "flex-start", gap: 12,
                fontSize: 23, color: TEXT,
              }}
            >
              <span style={{ color: ACCENT, fontWeight: "bold", minWidth: 28 }}>{i + 1}.</span>
              <span>
                {t}
                {f && <span dangerouslySetInnerHTML={{ __html: math(f) }} />}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Scene 3: 分步求解 */}
      {scene === 3 && (
        <div style={{ width: 1100, display: "flex", flexDirection: "column", gap: 15 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 分步求解（可分离变量法）</div>
          <StepRow
            label="Step 1"
            latex={"\\frac{du_C}{10 - u_C} = dt"}
            note="分离变量"
            opacity={step1Op}
            insight="左边仅含 u_C，右边仅含 t——满足可分离变量条件"
          />
          <StepRow
            label="Step 2"
            latex={"-\\ln|10 - u_C| = t + C_1"}
            note="两边积分"
            opacity={step2Op}
            insight="令 v=10-u_C，∫dv/v = ln|v|；右边 ∫dt = t"
          />
          <StepRow
            label="Step 3"
            latex={"10 - u_C = A\\,e^{-t}\\quad(A>0)"}
            note="指数化整理"
            opacity={step3Op}
          />
          <StepRow
            label="代入初值"
            latex={"u_C(0)=0 \\Rightarrow A=10 \\Rightarrow \\boxed{u_C(t)=10(1-e^{-t})\\,\\text{V}}"}
            note="特解"
            opacity={step4Op}
            insight="时间常数 τ=RC=1s；t=τ 时充至63.2%；t=5τ 时充至99.3%"
          />
        </div>
      )}

      {/* Scene 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: conclusionOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="RC充电方程通解" width={960} opacity={1}>
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <span
                style={{ fontSize: 40 }}
                dangerouslySetInnerHTML={{ __html: math("u_C(t) = E\\bigl(1 - e^{-t/RC}\\bigr) = 10(1-e^{-t})\\;\\text{V}", true) }}
              />
              <div style={{ marginTop: 20, display: "flex", gap: 36, justifyContent: "center", fontSize: 20, color: TEXT }}>
                <span>📌 时间常数 <span dangerouslySetInnerHTML={{ __html: math("\\tau=RC=1\\text{s}") }} /></span>
                <span>📌 <span dangerouslySetInnerHTML={{ __html: math("t=\\tau") }} /> → 充至 <strong style={{ color: ACCENT }}>63.2%</strong></span>
                <span>📌 <span dangerouslySetInnerHTML={{ __html: math("t=5\\tau") }} /> → 充至 <strong style={{ color: ACCENT }}>99.3%</strong></span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Scene 5: 解族可视化（不同RC值） */}
      {scene === 5 && (
        <div style={{ opacity: plotOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            📈 解族展示：不同 RC 值的充电曲线
          </div>
          <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 12, padding: 6 }}>
            <CoordinateSystem width={820} height={430} xRange={[0, 6]} yRange={[0, 12]} showGrid showLabels>
              {/* RC=0.5 快速充电 */}
              <FunctionPlot
                fn={(t) => 10 * (1 - Math.exp(-t / 0.5))}
                color={GREEN} strokeWidth={2.5} drawProgress={drawProg}
              />
              {/* RC=1.0 基准 */}
              <FunctionPlot
                fn={(t) => 10 * (1 - Math.exp(-t / 1.0))}
                color={ACCENT} strokeWidth={3} drawProgress={drawProg}
              />
              {/* RC=2.0 慢速 */}
              <FunctionPlot
                fn={(t) => 10 * (1 - Math.exp(-t / 2.0))}
                color={ORANGE} strokeWidth={2.5} drawProgress={drawProg}
              />
            </CoordinateSystem>
          </div>
          <div style={{ display: "flex", gap: 36, fontSize: 19, color: TEXT, opacity: tauOp }}>
            {[
              { label: "RC=0.5（快）", color: GREEN },
              { label: "RC=1.0（基准τ=1s）", color: ACCENT },
              { label: "RC=2.0（慢）", color: ORANGE },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 3, background: color, borderRadius: 2 }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: ORANGE, opacity: tauOp }}>
            💡 Polanyi默会知识：τ 越大，曲线越"平缓"——这是RC充电的形状直觉，是工程师设计延时电路的基础
          </div>
        </div>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: summaryOp, width: 920, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>✅ 小结</div>
          <div style={{ fontSize: 24, color: TEXT, lineHeight: 2.1, textAlign: "center" }}>
            <p>
              可分离变量方程解法：<strong style={{ color: ACCENT }}>分离 → 两边积分 → 整理 → 代初值</strong>
            </p>
            <p>
              时间常数 <span dangerouslySetInnerHTML={{ __html: math("\\tau = RC") }} /> 决定充电速度
            </p>
            <p>
              解族直觉：RC 越大，指数衰减越慢，充电曲线越平缓
            </p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2：弹簧-质量系统自由振动（帧 540–1079）
// 方程：ẍ + 2ẋ + 4x = 0，初值 x(0)=1, ẋ(0)=0
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 540;
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 197, 20);
  const step3Op = fade(lf, 244, 20);
  const step4Op = fade(lf, 291, 20);
  const conclusionOp = fade(lf, 330, 25);
  const plotOp = fade(lf, 390, 30);
  const drawProg = interpolate(lf, [402, 472], [0, 1], clamp);
  const envOp = interpolate(lf, [440, 465], [0, 1], clamp);
  const summaryOp = fade(lf, 480, 25);

  // 特解 x(t) = e^{-t}(cos(√3·t) + sin(√3·t)/√3)
  const sqrt3 = Math.sqrt(3);
  const xSol = (t: number) =>
    Math.exp(-t) * (Math.cos(sqrt3 * t) + Math.sin(sqrt3 * t) / sqrt3);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Scene 1: 题目 + 弹簧示意图 */}
      {scene === 1 && (
        <div style={{ opacity: fade(lf, 0, 30), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{
            color: ACCENT, fontSize: 34, fontWeight: "bold", letterSpacing: 2,
            borderBottom: `2px solid ${ACCENT}55`, paddingBottom: 10,
          }}>
            例题 2 · 弹簧-质量系统自由振动
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <ExampleBox exampleNum={2} title="二阶线性常系数齐次方程" width={700} opacity={1}>
              <div style={{ padding: "14px 0", fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
                <p>
                  <strong style={{ color: ACCENT }}>系统参数：</strong>
                  m=1 kg，k=4 N/m，c=2 N·s/m
                </p>
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                  <span dangerouslySetInnerHTML={{ __html: math("\\ddot{x} + 2\\dot{x} + 4x = 0", true) }} />
                </div>
                <p>
                  初值：<span dangerouslySetInnerHTML={{ __html: math("x(0)=1,\\;\\dot{x}(0)=0") }} />，求运动方程。
                </p>
              </div>
            </ExampleBox>
            <SpringMassSVG opacity={1} />
          </div>
        </div>
      )}

      {/* Scene 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: fade(lf, 60, 20), width: 1000, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 审题分析</div>
          {[
            { t: "特征方程：", f: "r^2 + 2r + 4 = 0" },
            { t: "判别式：", f: "\\Delta = 4 - 16 = -12 < 0" },
            { t: "结论：共轭复根，系统做衰减振动（欠阻尼），阻尼比ζ=c/(2√mk)=0.5<1", f: "" },
            { t: "Polanyi核心：实部α决定衰减速率，虚部β决定振动频率", f: "" },
          ].map(({ t, f }, i) => (
            <div
              key={i}
              style={{
                opacity: fade(lf, 66 + i * 20, 15),
                display: "flex", alignItems: "flex-start", gap: 12,
                fontSize: 23, color: TEXT,
              }}
            >
              <span style={{ color: ACCENT, fontWeight: "bold", minWidth: 28 }}>{i + 1}.</span>
              <span>
                {t}
                {f && <span dangerouslySetInnerHTML={{ __html: math(f) }} />}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Scene 3: 分步求解 */}
      {scene === 3 && (
        <div style={{ width: 1150, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 特征根法求解</div>
          <StepRow
            label="Step 1"
            latex={"r^2 + 2r + 4 = 0"}
            note="写出特征方程"
            opacity={step1Op}
          />
          <StepRow
            label="Step 2"
            latex={"r = \\frac{-2 \\pm \\sqrt{4-16}}{2} = -1 \\pm \\sqrt{3}\\,i"}
            note="共轭复根"
            opacity={step2Op}
            insight="α=-1 → 衰减速率；β=√3 → 振动角频率 ωd=√3 rad/s"
          />
          <StepRow
            label="Step 3"
            latex={"x = e^{-t}\\bigl(C_1\\cos\\sqrt{3}\\,t + C_2\\sin\\sqrt{3}\\,t\\bigr)"}
            note="通解"
            opacity={step3Op}
          />
          <StepRow
            label="Step 4"
            latex={"x(0)=1\\Rightarrow C_1=1;\\quad \\dot{x}(0)=0\\Rightarrow C_2=\\tfrac{1}{\\sqrt{3}}"}
            note="代入初值"
            opacity={step4Op}
          />
        </div>
      )}

      {/* Scene 4: 复平面图 + 结论框 */}
      {scene === 4 && (
        <div style={{ opacity: conclusionOp, display: "flex", gap: 44, alignItems: "center", justifyContent: "center" }}>
          {/* 复平面示意 */}
          <svg width={260} height={260} viewBox="-130 -130 260 260">
            <line x1={-115} y1={0} x2={115} y2={0} stroke={ACCENT} strokeWidth={1.5} />
            <line x1={0} y1={110} x2={0} y2={-110} stroke={ACCENT} strokeWidth={1.5} />
            <text x={102} y={-5} fill={ACCENT} fontSize={13} fontFamily="sans-serif">Re</text>
            <text x={5} y={-100} fill={ACCENT} fontSize={13} fontFamily="sans-serif">Im</text>
            {/* -1±√3i 在复平面上（缩放：1单位=40px） */}
            <circle cx={-40} cy={-69} r={7} fill={ORANGE} />
            <circle cx={-40} cy={69} r={7} fill={ORANGE} />
            {/* 虚部标注虚线 */}
            <line x1={-40} y1={0} x2={-40} y2={-69} stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4,3" />
            <line x1={0} y1={0} x2={-40} y2={0} stroke={GREEN} strokeWidth={1.5} strokeDasharray="4,3" />
            <text x={-35} y={-75} fill={ORANGE} fontSize={11} fontFamily="sans-serif">-1+√3i</text>
            <text x={-35} y={82} fill={ORANGE} fontSize={11} fontFamily="sans-serif">-1-√3i</text>
            <text x={-38} y={13} fill={GREEN} fontSize={11} fontFamily="sans-serif">α=-1</text>
            <text x={6} y={-36} fill={PINK} fontSize={11} fontFamily="sans-serif">β=√3</text>
          </svg>
          <TheoremBox title="特解（欠阻尼衰减振动）" width={620} opacity={1}>
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <span
                style={{ fontSize: 28 }}
                dangerouslySetInnerHTML={{ __html: math("x(t)=e^{-t}\\!\\left(\\cos\\sqrt{3}\\,t+\\dfrac{\\sin\\sqrt{3}\\,t}{\\sqrt{3}}\\right)", true) }}
              />
              <div style={{ marginTop: 16, fontSize: 19, color: TEXT, display: "flex", gap: 20, justifyContent: "center" }}>
                <span>🔵 实部 α=-1 → <strong style={{ color: GREEN }}>衰减速率</strong></span>
                <span>🟠 虚部 β=√3 → <strong style={{ color: ORANGE }}>振动频率</strong></span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Scene 5: 衰减振动 + 包络线 */}
      {scene === 5 && (
        <div style={{ opacity: plotOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            📈 衰减振动：包络线 ±e⁻ᵗ 约束振幅（Polanyi 默会知识）
          </div>
          <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 12, padding: 6 }}>
            <CoordinateSystem width={820} height={430} xRange={[0, 7]} yRange={[-1.3, 1.4]} showGrid showLabels>
              {/* 上包络线 +e^{-t} */}
              <FunctionPlot
                fn={(t) => Math.exp(-t)}
                color={ORANGE} strokeWidth={2} drawProgress={envOp} opacity={0.8}
              />
              {/* 下包络线 -e^{-t} */}
              <FunctionPlot
                fn={(t) => -Math.exp(-t)}
                color={ORANGE} strokeWidth={2} drawProgress={envOp} opacity={0.8}
              />
              {/* 振动曲线 x(t) */}
              <FunctionPlot
                fn={xSol}
                color={ACCENT} strokeWidth={3} drawProgress={drawProg}
              />
            </CoordinateSystem>
          </div>
          <div style={{ display: "flex", gap: 36, fontSize: 19, color: TEXT, opacity: envOp }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 3, background: ACCENT, borderRadius: 2 }} />
              <span>振动曲线 x(t)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 3, background: ORANGE, borderRadius: 2, opacity: 0.8 }} />
              <span>包络线 ±e⁻ᵗ（渐进揭示）</span>
            </div>
          </div>
          <div style={{ fontSize: 18, color: ORANGE, opacity: envOp }}>
            💡 包络线像"笼子"约束振幅，随时间缩小——实部 α=-1 决定收缩速度
          </div>
        </div>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: summaryOp, width: 920, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>✅ 小结</div>
          <div style={{ fontSize: 24, color: TEXT, lineHeight: 2.1, textAlign: "center" }}>
            <p>
              特征根虚部 <span dangerouslySetInnerHTML={{ __html: math("\\beta") }} /> 决定振动频率，
              实部 <span dangerouslySetInnerHTML={{ __html: math("\\alpha") }} /> 决定衰减速率
            </p>
            <p>这是线性系统分析的核心直觉，是工程设计的基础</p>
            <p>
              包络线 <span dangerouslySetInnerHTML={{ __html: math("\\pm e^{\\alpha t}") }} /> 像"笼子"
              约束着振动幅度，无限趋近平衡位置
            </p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3：强迫振动与共振（帧 1080–1619）
// 方程：ẍ + 2ẋ + 4x = 3cos(ωt)，待定系数法
// ─────────────────────────────────────────────────────────────────────────────
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 1080;
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 197, 20);
  const step3Op = fade(lf, 244, 20);
  const conclusionOp = fade(lf, 330, 25);
  const plotOp = fade(lf, 390, 30);
  const drawProg = interpolate(lf, [402, 472], [0, 1], clamp);
  const resonanceOp = interpolate(lf, [445, 468], [0, 1], clamp);
  const summaryOp = fade(lf, 480, 25);

  // 频率响应振幅 A(ω) = 3 / √((4-ω²)² + 4ω²)
  const ampA = (omega: number): number => {
    const denom = Math.sqrt(
      (4 - omega * omega) * (4 - omega * omega) + 4 * omega * omega
    );
    if (denom < 0.05) return 3.2;
    return Math.min(3.2, 3 / denom);
  };

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* Scene 1: 题目 */}
      {scene === 1 && (
        <div style={{ opacity: fade(lf, 0, 30), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{
            color: ACCENT, fontSize: 34, fontWeight: "bold", letterSpacing: 2,
            borderBottom: `2px solid ${ACCENT}55`, paddingBottom: 10,
          }}>
            例题 3 · 强迫振动与共振（待定系数法）
          </div>
          <ExampleBox exampleNum={3} title="常系数非齐次方程" width={1000} opacity={1}>
            <div style={{ padding: "14px 0", fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <p>
                <strong style={{ color: ACCENT }}>背景：</strong>
                例2的弹簧系统受到周期外力{" "}
                <span dangerouslySetInnerHTML={{ __html: math("F(t)=3\\cos(\\omega t)") }} />{" "}
                作用，方程变为：
              </p>
              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <span dangerouslySetInnerHTML={{ __html: math("\\ddot{x}+2\\dot{x}+4x=3\\cos(\\omega t)", true) }} />
              </div>
              <p>
                当 <span dangerouslySetInnerHTML={{ __html: math("\\omega=\\sqrt{3}") }} />（接近系统固有频率{" "}
                <span dangerouslySetInnerHTML={{ __html: math("\\omega_0=2\\text{ rad/s}") }} />）时，会发生什么？
              </p>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Scene 2: 分析思路 */}
      {scene === 2 && (
        <div style={{ opacity: fade(lf, 60, 20), width: 1000, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>📋 分析思路</div>
          {[
            { t: "通解=齐次通解+非齐次特解（叠加原理）", f: "" },
            { t: "待定系数法：由右端 cos(ωt) 设特解为", f: "x^*=A\\cos(\\omega t)+B\\sin(\\omega t)" },
            { t: "系统固有频率：", f: "\\omega_0=\\sqrt{k/m}=\\sqrt{4}=2\\text{ rad/s}" },
            { t: "共振预告：当ω→2时，振幅分母→0，振幅急剧增大！", f: "" },
          ].map(({ t, f }, i) => (
            <div
              key={i}
              style={{
                opacity: fade(lf, 66 + i * 20, 15),
                display: "flex", alignItems: "flex-start", gap: 12,
                fontSize: 23, color: TEXT,
              }}
            >
              <span style={{ color: ACCENT, fontWeight: "bold", minWidth: 28 }}>{i + 1}.</span>
              <span>
                {t}
                {f && <span dangerouslySetInnerHTML={{ __html: math(f) }} />}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Scene 3: 待定系数法 */}
      {scene === 3 && (
        <div style={{ width: 1150, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>📐 待定系数法</div>
          <StepRow
            label="Step 1"
            latex={"x^*=A\\cos(\\omega t)+B\\sin(\\omega t)"}
            note="设特解形式"
            opacity={step1Op}
          />
          <StepRow
            label="Step 2"
            latex={"(4-\\omega^2)A+2\\omega B=3,\\quad -2\\omega A+(4-\\omega^2)B=0"}
            note="代入方程联立"
            opacity={step2Op}
          />
          <StepRow
            label="Step 3"
            latex={"A=\\frac{3(4-\\omega^2)}{(4-\\omega^2)^2+4\\omega^2},\\quad B=\\frac{6\\omega}{(4-\\omega^2)^2+4\\omega^2}"}
            note="求解A, B"
            opacity={step3Op}
            insight="ω→2 时，分母(4-ω²)²+4ω²→16，但ω=2时分母=16，A=0，B=3/4——接近但不等于共振"
          />
          <div style={{ opacity: interpolate(lf, [282, 310], [0, 1], clamp), padding: "10px 20px", background: "rgba(255,107,107,0.12)", borderLeft: `3px solid ${COLORS.highlight}`, borderRadius: 6 }}>
            <span style={{ color: COLORS.highlight, fontSize: 19 }}>
              ⚠️ 无阻尼时（c=0）：当 ω=ω₀ 时分母=0，振幅趋于无穷——这是纯共振（工程中需要避免）
            </span>
          </div>
        </div>
      )}

      {/* Scene 4: 结论 */}
      {scene === 4 && (
        <div style={{ opacity: conclusionOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <TheoremBox title="频率响应振幅公式" width={980} opacity={1}>
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <span
                style={{ fontSize: 36 }}
                dangerouslySetInnerHTML={{ __html: math("A(\\omega)=\\frac{3}{\\sqrt{(4-\\omega^2)^2+4\\omega^2}}", true) }}
              />
              <div style={{ marginTop: 20, fontSize: 20, color: TEXT, display: "flex", gap: 32, justifyContent: "center" }}>
                <span>⚠️ <span dangerouslySetInnerHTML={{ __html: math("\\omega\\to 2") }} /> 时振幅极大增大</span>
                <span>🔴 共振频率 <span dangerouslySetInnerHTML={{ __html: math("\\omega_r\\approx\\omega_0=2\\text{ rad/s}") }} /></span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Scene 5: 频率响应曲线（帧驱动描绘） */}
      {scene === 5 && (
        <div style={{ opacity: plotOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            📈 频率响应曲线 A(ω)：从左向右描绘，共振峰逐渐揭示
          </div>
          <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 12, padding: 6 }}>
            <CoordinateSystem width={820} height={430} xRange={[0, 4]} yRange={[0, 3.4]} showGrid showLabels>
              <FunctionPlot
                fn={ampA}
                color={ACCENT} strokeWidth={3} drawProgress={drawProg}
              />
            </CoordinateSystem>
          </div>
          <div style={{ fontSize: 19, color: TEXT }}>
            横轴：驱动频率 ω（rad/s），纵轴：稳态振幅 A(ω)
          </div>
          <div style={{ fontSize: 18, color: ORANGE, opacity: resonanceOp }}>
            ⚠️ 共振峰在{" "}
            <span dangerouslySetInnerHTML={{ __html: math("\\omega\\approx 2\\text{ rad/s}") }} />{" "}
            附近——驱动频率=固有频率时，振幅急剧增大！
          </div>
        </div>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: summaryOp, width: 940, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>✅ 小结</div>
          <div style={{ fontSize: 24, color: TEXT, lineHeight: 2.1, textAlign: "center" }}>
            <p>共振是工程中最危险的现象之一</p>
            <p>驱动频率接近固有频率 → 振幅极大增大（有阻尼时有限但很大）</p>
            <p>
              <strong style={{ color: ACCENT }}>工程应用：</strong>
              桥梁、发动机、高层建筑必须在设计时避开共振频率
            </p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：Ch07Examples（总帧数 1620 = 3×540）
// ─────────────────────────────────────────────────────────────────────────────
export const Ch07Examples: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG }}>
      {frame < 540 && <Example1 frame={frame} />}
      {frame >= 540 && frame < 1080 && <Example2 frame={frame} />}
      {frame >= 1080 && <Example3 frame={frame} />}
    </AbsoluteFill>
  );
};

export default Ch07Examples;
