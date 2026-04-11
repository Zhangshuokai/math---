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
const ACCENT = COLORS.primaryCurve;     // 青色
const TEXT = COLORS.annotation;
const FORMULA = COLORS.formula;
const GREEN = COLORS.tertiaryCurve;     // 绿
const PINK = COLORS.secondaryCurve;     // 粉
const RED = COLORS.highlight;           // 红
const GOLD = COLORS.vector;             // 金色
const ORANGE = "#ff9500";               // 橙色

// ─────────────────────────────────────────────────────────────────────────────
// 四种阻尼比的阶跃响应函数（ωn = 2 rad/s，以便在 t∈[0,8] 内充分展示）
// ─────────────────────────────────────────────────────────────────────────────

// ζ=0（无阻尼）：x(t) = 1 - cos(ωn·t)
const resp_z0 = (t: number) => 1 - Math.cos(2 * t);

// ζ=0.5（欠阻尼）：ωd = ωn·√(1-ζ²) = 2·√0.75 ≈ 1.732
// x(t) = 1 - e^{-ζωnt}[cos(ωd·t) + (ζ/ωd)·sin(ωd·t)]
const resp_z05 = (t: number) => {
  const zeta = 0.5, wn = 2;
  const wd = wn * Math.sqrt(1 - zeta * zeta); // ≈ 1.732
  return 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / wd) * Math.sin(wd * t));
};

// ζ=1（临界阻尼）：x(t) = 1 - e^{-ωnt}(1 + ωn·t)
const resp_z1 = (t: number) => 1 - Math.exp(-2 * t) * (1 + 2 * t);

// ζ=2（过阻尼）：r1=(-ζ+√(ζ²-1))ωn, r2=(-ζ-√(ζ²-1))ωn
// ωn=2,ζ=2: r1=(-2+√3)*2≈-0.536, r2=(-2-√3)*2≈-7.464
// x(t)=1+A·e^{r1·t}+B·e^{r2·t}，由 x(0)=0,x'(0)=0 定 A≈-1.0774, B≈0.0774
const resp_z2 = (t: number) => {
  const A = -1.0774, B = 0.0774;
  const r1 = -0.536, r2 = -7.464;
  return 1 + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
};

// ζ=0.7（最优设计参考，仅在总结场景显示）
// ωd = 2·√(1-0.49) ≈ 1.428
const resp_z07 = (t: number) => {
  const zeta = 0.7, wn = 2;
  const wd = wn * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / wd) * Math.sin(wd * t));
};

// ─────────────────────────────────────────────────────────────────────────────
// 应用场景示意图（机器人/桥梁/机械）
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationsSVG: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={380} height={200} viewBox="0 0 380 200" style={{ opacity }}>
    {/* 机器人关节 */}
    <rect x={20} y={30} width={60} height={80} fill="none" stroke={ACCENT} strokeWidth={2} rx={4} />
    <line x1={50} y1={110} x2={50} y2={150} stroke={ACCENT} strokeWidth={3} />
    <circle cx={50} cy={110} r={10} fill={`${ACCENT}33`} stroke={ACCENT} strokeWidth={2} />
    <line x1={50} y1={150} x2={90} y2={180} stroke={ACCENT} strokeWidth={3} />
    <text x={20} y={196} fill={ACCENT} fontSize={13} fontFamily="sans-serif">机器人关节</text>

    {/* 桥梁 */}
    <line x1={140} y1={80} x2={240} y2={80} stroke={GREEN} strokeWidth={3} />
    <line x1={140} y1={80} x2={140} y2={130} stroke={GREEN} strokeWidth={2.5} />
    <line x1={190} y1={80} x2={190} y2={140} stroke={GREEN} strokeWidth={2} strokeDasharray="4,3" />
    <line x1={240} y1={80} x2={240} y2={130} stroke={GREEN} strokeWidth={2.5} />
    <rect x={125} y={130} width={130} height={16} fill={`${GREEN}22`} stroke={GREEN} strokeWidth={1.5} rx={2} />
    {/* 振动波示意 */}
    <path d="M 145 80 Q 157 68 168 80 Q 180 92 190 80 Q 202 68 212 80 Q 224 92 235 80"
      fill="none" stroke={RED} strokeWidth={1.5} opacity={0.7} />
    <text x={148} y={165} fill={GREEN} fontSize={13} fontFamily="sans-serif">桥梁振动</text>

    {/* 齿轮箱 */}
    <circle cx={320} cy={90} r={35} fill="none" stroke={GOLD} strokeWidth={2} />
    <circle cx={320} cy={90} r={18} fill="none" stroke={GOLD} strokeWidth={1.5} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = deg * Math.PI / 180;
      const x1 = 320 + 32 * Math.cos(r);
      const y1 = 90 + 32 * Math.sin(r);
      const x2 = 320 + 40 * Math.cos(r);
      const y2 = 90 + 40 * Math.sin(r);
      return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={3} />;
    })}
    <text x={290} y={152} fill={GOLD} fontSize={13} fontFamily="sans-serif">齿轮箱</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：振动分析与机械设计（540帧）
// ─────────────────────────────────────────────────────────────────────────────
const T = { s1: 0, s2: 60, s3: 150, s4: 330, s5: 390, s6: 480, end: 540 };

export const Ch07IM02Dynamics: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // Stage 3：四种阻尼比分析（每步约45帧）
  const z0Op = fade(frame, T.s3, 20);
  const z05Op = fade(frame, T.s3 + 45, 20);
  const z1Op = fade(frame, T.s3 + 90, 20);
  const z2Op = fade(frame, T.s3 + 135, 20);

  // Stage 4
  const conclusionOp = fade(frame, T.s4, 25);

  // Stage 5：4条曲线（同时描绘，略有时差）
  const plotOp = fade(frame, T.s5, 25);
  const drawProgZ0 = interpolate(frame, [T.s5 + 5, T.s6 - 15], [0, 1], clamp);
  const drawProgZ05 = interpolate(frame, [T.s5 + 10, T.s6 - 12], [0, 1], clamp);
  const drawProgZ1 = interpolate(frame, [T.s5 + 8, T.s6 - 18], [0, 1], clamp);
  const drawProgZ2 = interpolate(frame, [T.s5 + 15, T.s6 - 8], [0, 1], clamp);
  const legendOp = interpolate(frame, [T.s5 + 45, T.s5 + 72], [0, 1], clamp);
  const insightOp = interpolate(frame, [T.s5 + 60, T.s5 + 88], [0, 1], clamp);

  // Stage 6
  const summaryOp = fade(frame, T.s6, 25);
  const optDrawProg = interpolate(frame, [T.s6 + 5, T.s6 + 45], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* ── Stage 1: 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{
            color: ACCENT, fontSize: 34, fontWeight: "bold", letterSpacing: 2,
            borderBottom: `2px solid ${ACCENT}55`, paddingBottom: 12,
          }}>
            🏭 工业应用 · 振动分析与机械系统设计
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "flex-start", width: 1100 }}>
            <div style={{
              flex: 1, background: "rgba(97,218,251,0.06)", borderRadius: 10,
              border: `1px solid ${ACCENT}33`, padding: "20px 24px",
              fontSize: 22, color: TEXT, lineHeight: 2.0,
            }}>
              <p><strong style={{ color: ACCENT }}>振动无处不在：</strong>机器人关节、桥梁共振、汽车悬挂、齿轮箱</p>
              <p><strong style={{ color: ACCENT }}>核心参数：</strong>阻尼比 ζ（zeta）决定系统振动行为</p>
              <p><strong style={{ color: ACCENT }}>数学工具：</strong>二阶 ODE 的特征根决定响应形状</p>
              <p><strong style={{ color: GOLD }}>设计目标：</strong>找到最优阻尼比，快速稳定且无振荡</p>
              <p style={{ color: ORANGE, fontSize: 20 }}>💡 Polanyi目标：建立"不同ζ→不同响应形状"的直觉</p>
            </div>
            <ApplicationsSVG opacity={1} />
          </div>
        </div>
      )}

      {/* ── Stage 2: 传递函数 ── */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, T.s2, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>📐 标准二阶系统传递函数</div>
          <div style={{
            background: "rgba(97,218,251,0.08)", border: `2px solid ${ACCENT}55`,
            borderRadius: 12, padding: "28px 40px", textAlign: "center",
          }}>
            <span
              style={{ fontSize: 42 }}
              dangerouslySetInnerHTML={{ __html: math(
                "G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}", true
              ) }}
            />
          </div>
          <div style={{ width: 960, display: "flex", flexDirection: "column", gap: 14, fontSize: 21, color: TEXT }}>
            {[
              { sym: "\\omega_n", desc: "固有频率（Natural Frequency）：系统无阻尼时的振动频率", c: ACCENT },
              { sym: "\\zeta", desc: "阻尼比（Damping Ratio）：决定振动衰减程度，是最重要的设计参数", c: GOLD },
              { sym: "r = -\\zeta\\omega_n \\pm \\omega_n\\sqrt{\\zeta^2-1}", desc: "特征根公式：ζ的大小决定根的类型（实/复/重）", c: GREEN },
            ].map(({ sym, desc, c }, i) => (
              <div
                key={i}
                style={{
                  opacity: fade(frame, T.s2 + 15 + i * 25, 18),
                  display: "flex", gap: 16, alignItems: "flex-start",
                  padding: "10px 16px",
                  background: `${c}10`, borderLeft: `3px solid ${c}`, borderRadius: 6,
                }}
              >
                <span
                  style={{ color: c, fontSize: 20, minWidth: 160 }}
                  dangerouslySetInnerHTML={{ __html: math(sym) }}
                />
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage 3: 四种阻尼比分析 ── */}
      {scene === 3 && (
        <div style={{ width: 1100, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>
            📊 四种阻尼比：截然不同的系统行为
          </div>

          {/* ζ=0：无阻尼 */}
          <div style={{
            opacity: z0Op,
            padding: "12px 20px",
            background: `${RED}12`, borderLeft: `4px solid ${RED}`, borderRadius: 8,
            display: "flex", gap: 20, alignItems: "center",
          }}>
            <span style={{ color: RED, fontSize: 24, fontWeight: "bold", minWidth: 70 }}>
              ζ=0
            </span>
            <span
              style={{ color: FORMULA, fontSize: 22, minWidth: 220 }}
              dangerouslySetInnerHTML={{ __html: math("x(t)=1-\\cos(\\omega_n t)") }}
            />
            <span style={{ color: TEXT, fontSize: 19 }}>
              ⚠️ 无阻尼：永久振荡，永不稳定——工程中极危险（共振场景）
            </span>
          </div>

          {/* ζ=0.5：欠阻尼 */}
          <div style={{
            opacity: z05Op,
            padding: "12px 20px",
            background: `#ff950012`, borderLeft: `4px solid #ff9500`, borderRadius: 8,
            display: "flex", gap: 20, alignItems: "center",
          }}>
            <span style={{ color: "#ff9500", fontSize: 24, fontWeight: "bold", minWidth: 70 }}>
              ζ=0.5
            </span>
            <span
              style={{ color: FORMULA, fontSize: 21, minWidth: 220 }}
              dangerouslySetInnerHTML={{ __html: math("x(t)=1-e^{-\\zeta\\omega_n t}(\\cos\\omega_d t+\\ldots)") }}
            />
            <span style={{ color: TEXT, fontSize: 19 }}>
              欠阻尼：衰减振荡（超调后稳定），响应快但有超调量
            </span>
          </div>

          {/* ζ=1：临界阻尼 */}
          <div style={{
            opacity: z1Op,
            padding: "12px 20px",
            background: `${GREEN}12`, borderLeft: `4px solid ${GREEN}`, borderRadius: 8,
            display: "flex", gap: 20, alignItems: "center",
          }}>
            <span style={{ color: GREEN, fontSize: 24, fontWeight: "bold", minWidth: 70 }}>
              ζ=1
            </span>
            <span
              style={{ color: FORMULA, fontSize: 22, minWidth: 220 }}
              dangerouslySetInnerHTML={{ __html: math("x(t)=1-e^{-\\omega_n t}(1+\\omega_n t)") }}
            />
            <span style={{ color: TEXT, fontSize: 19 }}>
              ✅ 临界阻尼：无超调的最快响应，特征根为重实根
            </span>
          </div>

          {/* ζ=2：过阻尼 */}
          <div style={{
            opacity: z2Op,
            padding: "12px 20px",
            background: `${ACCENT}10`, borderLeft: `4px solid ${ACCENT}88`, borderRadius: 8,
            display: "flex", gap: 20, alignItems: "center",
          }}>
            <span style={{ color: `${ACCENT}bb`, fontSize: 24, fontWeight: "bold", minWidth: 70 }}>
              ζ=2
            </span>
            <span
              style={{ color: FORMULA, fontSize: 22, minWidth: 220 }}
              dangerouslySetInnerHTML={{ __html: math("x(t)=1+Ae^{r_1 t}+Be^{r_2 t}") }}
            />
            <span style={{ color: TEXT, fontSize: 19 }}>
              过阻尼：无超调但响应缓慢，两个不同负实特征根
            </span>
          </div>
        </div>
      )}

      {/* ── Stage 4: 结论表格 ── */}
      {scene === 4 && (
        <div style={{ opacity: conclusionOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <TheoremBox title="阻尼比 ζ 与系统响应对照表" width={1060} opacity={1}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 20, color: TEXT }}>
                <thead>
                  <tr style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}55` }}>
                    <th style={{ padding: "8px 14px", textAlign: "left" }}>阻尼状态</th>
                    <th style={{ padding: "8px 14px", textAlign: "center" }}>条件</th>
                    <th style={{ padding: "8px 14px", textAlign: "left" }}>特征根</th>
                    <th style={{ padding: "8px 14px", textAlign: "left" }}>响应特征</th>
                    <th style={{ padding: "8px 14px", textAlign: "left" }}>工程场景</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      state: "无阻尼", cond: "ζ=0", root: "±jωn", resp: "永久振荡",
                      app: "共振（危险）", color: RED, bold: false,
                    },
                    {
                      state: "欠阻尼", cond: "0<ζ<1", root: "α±jωd", resp: "衰减振荡",
                      app: "弹簧秤、仪器", color: "#ff9500", bold: false,
                    },
                    {
                      state: "临界阻尼 ★", cond: "ζ=1", root: "重实根 -ωn", resp: "最快无超调",
                      app: "门缓冲器", color: GREEN, bold: true,
                    },
                    {
                      state: "过阻尼", cond: "ζ>1", root: "两不同负实根", resp: "缓慢单调",
                      app: "机床主轴减振", color: `${ACCENT}bb`, bold: false,
                    },
                  ].map(({ state, cond, root, resp, app, color, bold }, i) => (
                    <tr
                      key={i}
                      style={{
                        opacity: fade(frame, T.s4 + 5 + i * 14, 12),
                        background: bold ? `${GREEN}10` : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px 14px", color, fontWeight: bold ? "bold" : "normal" }}>{state}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span dangerouslySetInnerHTML={{ __html: math(cond) }} />
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 17 }}>{root}</td>
                      <td style={{ padding: "10px 14px", color: bold ? GREEN : TEXT, fontWeight: bold ? "bold" : "normal" }}>{resp}</td>
                      <td style={{ padding: "10px 14px" }}>{app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 4条阶跃响应曲线族 ── */}
      {scene === 5 && (
        <div style={{ opacity: plotOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: "bold" }}>
            📈 阶跃响应曲线族（ωn=2 rad/s，不同 ζ）
          </div>
          <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 12, padding: 6 }}>
            <CoordinateSystem
              width={840}
              height={400}
              xRange={[0, 8]}
              yRange={[0, 2.3]}
              showGrid
              showLabels
            >
              {/* 设定值 y=1 参考线 */}
              <FunctionPlot fn={() => 1} color={`${FORMULA}40`} strokeWidth={1.5} opacity={0.5} />
              {/* ζ=0 无阻尼（红色）*/}
              <FunctionPlot
                fn={resp_z0}
                color={RED} strokeWidth={2.5} drawProgress={drawProgZ0}
              />
              {/* ζ=0.5 欠阻尼（橙色）*/}
              <FunctionPlot
                fn={resp_z05}
                color={"#ff9500"} strokeWidth={2.5} drawProgress={drawProgZ05}
              />
              {/* ζ=1 临界阻尼（绿色）*/}
              <FunctionPlot
                fn={resp_z1}
                color={GREEN} strokeWidth={3} drawProgress={drawProgZ1}
              />
              {/* ζ=2 过阻尼（青色半透明）*/}
              <FunctionPlot
                fn={resp_z2}
                color={ACCENT} strokeWidth={2.5} drawProgress={drawProgZ2} opacity={0.7}
              />
            </CoordinateSystem>
          </div>

          {/* 图例 */}
          <div style={{ display: "flex", gap: 28, fontSize: 18, color: TEXT, opacity: legendOp }}>
            {[
              { label: "ζ=0（永久振荡）", color: RED },
              { label: "ζ=0.5（欠阻尼）", color: "#ff9500" },
              { label: "ζ=1（临界，最优）", color: GREEN },
              { label: "ζ=2（过阻尼，慢）", color: ACCENT },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 24, height: 3, background: color, borderRadius: 2 }} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Polanyi 默会知识提示 */}
          <div style={{ fontSize: 17, color: "#ff9500", opacity: insightOp, textAlign: "center" }}>
            💡 形状直觉：ζ从0到2，曲线从"永久振荡"→"衰减振荡"→"最快单调"→"缓慢单调"
          </div>
          <div style={{ fontSize: 17, color: GREEN, opacity: insightOp }}>
            ✅ 工程黄金法则：<span dangerouslySetInnerHTML={{ __html: math("\\zeta\\approx 0.7") }} /> 是最优设计点（快速稳定，超调量约5%可接受）
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 + ζ=0.7 对比 ── */}
      {scene === 6 && (
        <div style={{ opacity: summaryOp, width: 1060, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>✅ 工程设计总结</div>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", width: "100%" }}>
            {/* 左：文字总结 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, fontSize: 20, color: TEXT }}>
              {[
                {
                  icon: "⚙️", text: "减振器设计：ζ≈0.7（黄金比例）",
                  sub: "超调量≈5%，调节时间最短，综合性能最优",
                  color: GREEN,
                },
                {
                  icon: "🏗️", text: "桥梁/建筑：需要有一定阻尼（ζ>0.05）",
                  sub: "防止共振，风洞试验验证阻尼效果",
                  color: "#ff9500",
                },
                {
                  icon: "🤖", text: "机器人关节：根据精度要求选ζ",
                  sub: "高精度场合选 ζ=1（无超调），快速场合选 ζ=0.7",
                  color: ACCENT,
                },
                {
                  icon: "🔧", text: "被动减振：增大阻尼 c = 2ζ√(mk)",
                  sub: "主动减振：用PID控制器实时调整阻尼力",
                  color: GOLD,
                },
              ].map(({ icon, text, sub, color }, i) => (
                <div
                  key={i}
                  style={{
                    opacity: fade(frame, T.s6 + 5 + i * 12, 12),
                    padding: "10px 14px",
                    background: `${color}10`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ color, fontWeight: "bold" }}>{icon} {text}</div>
                  <div style={{ fontSize: 17, marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* 右：ζ=0.7 最优响应曲线 */}
            <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: GOLD, fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                最优设计：ζ=0.7 的阶跃响应
              </div>
              <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 10, padding: 4 }}>
                <CoordinateSystem
                  width={370}
                  height={220}
                  xRange={[0, 8]}
                  yRange={[0, 1.4]}
                  showGrid
                  showLabels
                >
                  <FunctionPlot fn={() => 1} color={`${FORMULA}40`} strokeWidth={1} opacity={0.4} />
                  <FunctionPlot fn={resp_z07} color={GOLD} strokeWidth={3} drawProgress={optDrawProg} />
                  <FunctionPlot fn={resp_z1} color={GREEN} strokeWidth={2} opacity={0.5} drawProgress={optDrawProg} />
                </CoordinateSystem>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 15, color: TEXT, opacity: optDrawProg }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 2, background: GOLD }} />
                  <span>ζ=0.7（最优）</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 2, background: GREEN, opacity: 0.5 }} />
                  <span>ζ=1（临界）</span>
                </div>
              </div>
              <div style={{ fontSize: 15, color: GOLD, textAlign: "center", opacity: optDrawProg }}>
                ζ=0.7 比 ζ=1 更快到达设定值，超调仅≈5%
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// 模块顶层：withWatermark 包裹（Root.tsx 直接 import 默认导出）
const WCh07IM02Dynamics = withWatermark(Ch07IM02Dynamics);
export default WCh07IM02Dynamics;
