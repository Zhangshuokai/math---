import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
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
const ACCENT = COLORS.primaryCurve;
const TEXT = COLORS.annotation;
const FORMULA = COLORS.formula;
const ORANGE = "#ff9500";
const GREEN = COLORS.tertiaryCurve;
const PINK = COLORS.secondaryCurve;

// ─────────────────────────────────────────────────────────────────────────────
// PID 控制系统框图（SVG）
// ─────────────────────────────────────────────────────────────────────────────
interface BlockDiagramProps {
  opacity: number;
  showPIDLabel: boolean;
  showFeedback: boolean;
}
const PIDBlockDiagram: React.FC<BlockDiagramProps> = ({ opacity, showPIDLabel, showFeedback }) => {
  const axColor = ACCENT;
  const boxFill = "rgba(97,218,251,0.08)";
  const boxStroke = ACCENT;
  const arrowColor = FORMULA;

  return (
    <svg width={820} height={200} viewBox="0 0 820 200" style={{ opacity }}>
      {/* ─── r(t) → Σ ─── */}
      <text x={18} y={98} fill={FORMULA} fontSize={20} fontFamily="sans-serif" fontWeight="bold">r(t)</text>
      <line x1={68} y1={93} x2={100} y2={93} stroke={arrowColor} strokeWidth={2} />
      <polygon points="100,88 112,93 100,98" fill={arrowColor} />

      {/* 比较器圆 Σ */}
      <circle cx={130} cy={93} r={22} fill="none" stroke={axColor} strokeWidth={2} />
      <text x={121} y={99} fill={axColor} fontSize={20} fontFamily="sans-serif">Σ</text>
      <text x={104} y={74} fill={GREEN} fontSize={13} fontFamily="sans-serif">+</text>
      <text x={104} y={118} fill={PINK} fontSize={13} fontFamily="sans-serif">−</text>

      {/* e(t) 标注 */}
      <text x={157} y={82} fill={GREEN} fontSize={14} fontFamily="sans-serif">e(t)</text>

      {/* Σ → PID 箭头 */}
      <line x1={152} y1={93} x2={200} y2={93} stroke={arrowColor} strokeWidth={2} />
      <polygon points="200,88 212,93 200,98" fill={arrowColor} />

      {/* PID 控制器框 */}
      <rect x={212} y={68} width={140} height={50} fill={boxFill} stroke={boxStroke} strokeWidth={2} rx={6} />
      <text x={249} y={99} fill={FORMULA} fontSize={20} fontFamily="sans-serif" fontWeight="bold">PID</text>
      {showPIDLabel && (
        <text x={214} y={132} fill={ORANGE} fontSize={13} fontFamily="sans-serif">Kp+Ki/s+Kd·s</text>
      )}

      {/* PID → 被控对象 */}
      <line x1={352} y1={93} x2={400} y2={93} stroke={arrowColor} strokeWidth={2} />
      <polygon points="400,88 412,93 400,98" fill={arrowColor} />
      <text x={358} y={82} fill={TEXT} fontSize={13} fontFamily="sans-serif">u(t)</text>

      {/* 被控对象 G(s) */}
      <rect x={412} y={68} width={130} height={50} fill={boxFill} stroke={`${ACCENT}88`} strokeWidth={2} rx={6} />
      <text x={430} y={95} fill={FORMULA} fontSize={17} fontFamily="sans-serif">被控对象</text>
      <text x={450} y={114} fill={`${ACCENT}aa`} fontSize={14} fontFamily="sans-serif">G(s)</text>

      {/* G(s) → y(t) */}
      <line x1={542} y1={93} x2={610} y2={93} stroke={arrowColor} strokeWidth={2} />
      <polygon points="610,88 622,93 610,98" fill={arrowColor} />
      <text x={625} y={98} fill={FORMULA} fontSize={20} fontFamily="sans-serif" fontWeight="bold">y(t)</text>

      {/* 反馈线 */}
      {showFeedback && (
        <g>
          <line x1={616} y1={93} x2={616} y2={158} stroke={PINK} strokeWidth={2} />
          <line x1={616} y1={158} x2={130} y2={158} stroke={PINK} strokeWidth={2} />
          <line x1={130} y1={158} x2={130} y2={115} stroke={PINK} strokeWidth={2} />
          <polygon points="125,115 130,103 135,115" fill={PINK} />
          <text x={350} y={178} fill={PINK} fontSize={14} fontFamily="sans-serif">反馈（测量值）</text>
        </g>
      )}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// P/I/D 各项说明行
// ─────────────────────────────────────────────────────────────────────────────
interface PIDTermRowProps {
  term: string;
  latex: string;
  role: string;
  color: string;
  opacity: number;
}
const PIDTermRow: React.FC<PIDTermRowProps> = ({ term, latex, role, color, opacity }) => (
  <div style={{
    opacity,
    display: "flex", alignItems: "center", gap: 20,
    padding: "14px 22px", borderRadius: 8,
    background: `${color}12`, borderLeft: `4px solid ${color}`,
  }}>
    <span style={{ color, fontSize: 28, fontWeight: "bold", minWidth: 50 }}>{term}</span>
    <span
      style={{ color: FORMULA, fontSize: 24, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }}
    />
    <span style={{ color: TEXT, fontSize: 19, opacity: 0.85, maxWidth: 340 }}>{role}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：PID控制器的数学基础（540帧，6场景）
// ─────────────────────────────────────────────────────────────────────────────
const T = { s1: 0, s2: 60, s3: 150, s4: 330, s5: 390, s6: 480, end: 540 };

export const Ch07IM01Control: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // Stage 3 步骤可见性（每50帧一项）
  const pidTitleOp = fade(frame, T.s3, 20);
  const pTermOp = fade(frame, T.s3 + 10, 20);
  const iTermOp = fade(frame, T.s3 + 55, 20);
  const dTermOp = fade(frame, T.s3 + 100, 20);
  const totalOp = fade(frame, T.s3 + 145, 20);

  // Stage 4
  const conclusionOp = fade(frame, T.s4, 25);

  // Stage 5: 响应曲线
  const plotOp = fade(frame, T.s5, 30);
  const drawProgP = interpolate(frame, [T.s5 + 10, T.s6 - 15], [0, 1], clamp);
  const drawProgPI = interpolate(frame, [T.s5 + 20, T.s6 - 10], [0, 1], clamp);
  const drawProgPID = interpolate(frame, [T.s5 + 5, T.s6 - 20], [0, 1], clamp);
  const legendOp = interpolate(frame, [T.s5 + 50, T.s5 + 80], [0, 1], clamp);

  // Stage 6
  const summaryOp = fade(frame, T.s6, 25);

  // 三种控制器的阶跃响应（简化模型，用于教学对比）
  // P控制：有稳态误差，收敛到0.8（不能到1）
  const pResp = (t: number) => 0.8 * (1 - Math.exp(-1.2 * t));
  // PI控制：消除稳态误差，有轻微振荡，最终到达1
  const piResp = (t: number) =>
    1 - Math.exp(-0.7 * t) * (Math.cos(0.9 * t) + (0.7 / 0.9) * Math.sin(0.9 * t));
  // PID控制：快速、无超调（临界阻尼特性）
  const pidResp = (t: number) => 1 - Math.exp(-1.8 * t) * (1 + 1.8 * t);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* ── Stage 1: 工程背景 + 标题 ── */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{
            color: ACCENT, fontSize: 34, fontWeight: "bold", letterSpacing: 2,
            borderBottom: `2px solid ${ACCENT}55`, paddingBottom: 12,
          }}>
            🏭 工业应用 · PID 控制器的数学基础
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start", width: 1100 }}>
            {/* 左：文字背景 */}
            <div style={{
              flex: 1, background: "rgba(97,218,251,0.06)", borderRadius: 10,
              border: `1px solid ${ACCENT}33`, padding: "22px 26px",
              fontSize: 22, color: TEXT, lineHeight: 2,
            }}>
              <p><strong style={{ color: ACCENT }}>应用场景：</strong>温度控制、速度控制、机器人位置控制</p>
              <p><strong style={{ color: ACCENT }}>核心问题：</strong>如何让系统输出快速、无误差地跟踪给定值？</p>
              <p><strong style={{ color: ACCENT }}>数学工具：</strong>一阶微积分方程（ODE）分析系统响应</p>
              <p><strong style={{ color: ORANGE }}>Polanyi 直觉目标：</strong>建立P/PI/PID三者响应曲线的形状感知</p>
            </div>
            {/* 右：简单PID应用图 */}
            <div style={{
              width: 360, background: "rgba(30,41,59,0.5)", borderRadius: 10,
              border: `1px solid ${ACCENT}33`, padding: 16,
            }}>
              <div style={{ color: ACCENT, fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
                典型 PID 工业应用
              </div>
              {[
                { icon: "🌡️", app: "温度控制炉（热电偶反馈）" },
                { icon: "⚙️", app: "电机速度调速（编码器反馈）" },
                { icon: "🤖", app: "机器人关节位置控制" },
                { icon: "🏗️", app: "工业压力/流量调节器" },
              ].map(({ icon, app }, i) => (
                <div
                  key={i}
                  style={{
                    opacity: fade(frame, 8 + i * 12, 12),
                    display: "flex", gap: 10, alignItems: "center",
                    fontSize: 18, color: TEXT, marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 2: 控制系统框图 ── */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, T.s2, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>📊 PID 控制系统框图</div>
          <div style={{ background: "rgba(30,41,59,0.5)", borderRadius: 12, padding: "24px 32px", border: `1px solid ${ACCENT}33` }}>
            <PIDBlockDiagram
              opacity={1}
              showPIDLabel={frame > T.s2 + 40}
              showFeedback={frame > T.s2 + 20}
            />
          </div>
          <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 12, fontSize: 20, color: TEXT }}>
            <div style={{ opacity: fade(frame, T.s2 + 22, 15) }}>
              <span style={{ color: GREEN, fontWeight: "bold" }}>r(t)</span>：给定值（设定点），
              <span style={{ color: GREEN, fontWeight: "bold" }}> e(t)=r(t)-y(t)</span>：误差信号
            </div>
            <div style={{ opacity: fade(frame, T.s2 + 40, 15) }}>
              <span style={{ color: ACCENT, fontWeight: "bold" }}>PID</span>：根据误差产生控制量 u(t)；
              <span style={{ color: `${ACCENT}aa` }}> G(s)</span>：被控对象（热炉/电机等）
            </div>
            <div style={{ opacity: fade(frame, T.s2 + 58, 15) }}>
              <span style={{ color: PINK, fontWeight: "bold" }}>反馈</span>：将输出 y(t) 测量后返回，实现闭环控制
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 3: PID数学公式（逐步显示） ── */}
      {scene === 3 && (
        <div style={{ width: 1100, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ opacity: pidTitleOp, color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>
            📐 PID 控制律（微分方程的应用）
          </div>
          {/* P 项 */}
          <PIDTermRow
            term="P"
            latex={"K_p\\,e(t)"}
            role="比例项：误差越大，纠正越强。响应快但有稳态误差"
            color={GREEN}
            opacity={pTermOp}
          />
          {/* I 项 */}
          <PIDTermRow
            term="I"
            latex={"K_i\\int_0^t e(\\tau)\\,d\\tau"}
            role="积分项：累积历史误差，消除稳态误差。对应 ∫e dt"
            color={ORANGE}
            opacity={iTermOp}
          />
          {/* D 项 */}
          <PIDTermRow
            term="D"
            latex={"K_d\\,\\frac{de}{dt}"}
            role="微分项：预测误差变化趋势，抑制振荡。对应导数"
            color={PINK}
            opacity={dTermOp}
          />
          {/* 总控制律 */}
          <div style={{
            opacity: totalOp,
            padding: "16px 22px",
            background: "rgba(97,218,251,0.10)",
            border: `2px solid ${ACCENT}66`, borderRadius: 10,
          }}>
            <div style={{ color: ACCENT, fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              ▶ 完整 PID 控制律：
            </div>
            <span
              style={{ fontSize: 30, color: FORMULA }}
              dangerouslySetInnerHTML={{ __html: math(
                "u(t) = K_p e(t) + K_i\\int_0^t e(\\tau)\\,d\\tau + K_d\\frac{de}{dt}", true
              ) }}
            />
          </div>
        </div>
      )}

      {/* ── Stage 4: 结论框 ── */}
      {scene === 4 && (
        <div style={{ opacity: conclusionOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <TheoremBox title="PID 三项与微分方程的对应" width={1000} opacity={1}>
            <div style={{ padding: "12px 0", fontSize: 20, color: TEXT, lineHeight: 2 }}>
              <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: GREEN, fontSize: 24, fontWeight: "bold" }}>P 项</div>
                  <div>代数项，即时响应误差</div>
                  <div>→ 影响系统增益</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: ORANGE, fontSize: 24, fontWeight: "bold" }}>I 项</div>
                  <div>积分项 ∫e dt，消除稳态误差</div>
                  <div>→ 对应 ODE 中的积分算子</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: PINK, fontSize: 24, fontWeight: "bold" }}>D 项</div>
                  <div>微分项 de/dt，预测趋势</div>
                  <div>→ 对应 ODE 中的微分算子</div>
                </div>
              </div>
            </div>
          </TheoremBox>
          <div style={{ fontSize: 20, color: ORANGE, textAlign: "center" }}>
            💡 PID 的三项恰好对应微分方程中的"微分-代数-积分"三种算子——这是微分方程最重要的工程应用之一
          </div>
        </div>
      )}

      {/* ── Stage 5: 三种控制器响应对比曲线 ── */}
      {scene === 5 && (
        <div style={{ opacity: plotOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            📈 Polanyi 默会知识：三种控制器的阶跃响应对比
          </div>
          <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 12, padding: 6 }}>
            <CoordinateSystem
              width={840}
              height={420}
              xRange={[0, 6]}
              yRange={[0, 1.3]}
              showGrid
              showLabels
            >
              {/* 设定值水平线 y=1 */}
              <FunctionPlot fn={() => 1} color={`${FORMULA}55`} strokeWidth={1.5} opacity={0.6} />
              {/* P 控制：有稳态误差，停在0.8 */}
              <FunctionPlot
                fn={pResp}
                color={GREEN} strokeWidth={2.5} drawProgress={drawProgP}
              />
              {/* PI 控制：振荡后达到1.0 */}
              <FunctionPlot
                fn={(t) => Math.max(0, piResp(t))}
                color={ORANGE} strokeWidth={2.5} drawProgress={drawProgPI}
              />
              {/* PID 控制：快速无超调到达1.0 */}
              <FunctionPlot
                fn={pidResp}
                color={ACCENT} strokeWidth={3} drawProgress={drawProgPID}
              />
            </CoordinateSystem>
          </div>

          {/* 图例 */}
          <div style={{ display: "flex", gap: 36, fontSize: 19, color: TEXT, opacity: legendOp }}>
            {[
              { label: "纯P控制：快速但有稳态误差（停在0.8）", color: GREEN },
              { label: "PI控制：消除稳态误差，有轻微振荡", color: ORANGE },
              { label: "PID控制：快速、无振荡、无稳态误差", color: ACCENT },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 3, background: color, borderRadius: 2 }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: ORANGE, opacity: legendOp }}>
            💡 视觉直觉：看曲线形状就能判断控制器类型——这是工程师的"默会知识"
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: summaryOp, width: 1000, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>✅ 工程总结</div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📏", text: "P控制（比例）：最简单，有稳态误差；Kp越大，响应越快但越振荡" },
              { icon: "📐", text: "PI控制（比例+积分）：消除稳态误差，Ki增大加快误差消除但引入振荡" },
              { icon: "📊", text: "PID控制（全三项）：性能最好，Kd预测趋势，抑制振荡；整定是工程核心技能" },
              { icon: "⚙️", text: "Ziegler-Nichols法：实验找临界增益Ku→自动整定Kp/Ki/Kd的经验法则" },
            ].map(({ icon, text }, i) => (
              <div
                key={i}
                style={{
                  opacity: fade(frame, T.s6 + 5 + i * 13, 12),
                  display: "flex", gap: 12, alignItems: "flex-start",
                  fontSize: 21, color: TEXT,
                  padding: "10px 16px", background: "rgba(97,218,251,0.05)",
                  borderRadius: 6, borderLeft: `2px solid ${ACCENT}44`,
                }}
              >
                <span style={{ fontSize: 24 }}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// 模块顶层：withWatermark 包裹（Root.tsx 直接 import 默认导出）
const WCh07IM01Control = withWatermark(Ch07IM01Control);
export default WCh07IM01Control;
