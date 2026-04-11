import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { ExampleBox } from "../../components/ui/ExampleBox";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";
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
const MAGENTA = "#ff79c6";

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
    <span style={{ color: MAGENTA, fontWeight: "bold", minWidth: 28 }}>{index}.</span>
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
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = MAGENTA }) => (
  <div style={{
    opacity,
    display: "flex", alignItems: "center", gap: 20,
    padding: "12px 20px", background: "rgba(255,121,198,0.05)",
    borderRadius: 8, borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ color: accentColor, fontSize: 20, minWidth: 80, fontWeight: "bold" }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 20, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }} />
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 生成球面上均匀分布的采样点（用于电场线方向）
// ─────────────────────────────────────────────────────────────────────────────
function sphereSamples(R: number, outward: boolean): Array<{
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}> {
  const dirs: Array<[number, number, number]> = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 0, -1], [0, 1, -1],
  ];
  return dirs.map(([x, y, z]) => {
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len, ny = y / len, nz = z / len;
    const from: [number, number, number] = [nx * R * 0.9, ny * R * 0.9, nz * R * 0.9];
    const to: [number, number, number] = outward
      ? [nx * R * 1.55, ny * R * 1.55, nz * R * 1.55]   // 向外（正电荷）
      : [nx * R * 0.35, ny * R * 0.35, nz * R * 0.35];  // 向内（负电荷）
    const isTop = nz > 0.3;
    const isBottom = nz < -0.3;
    const color = isTop ? ORANGE : isBottom ? PURPLE : ACCENT;
    return { from, to, color };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：Gauss定理——电场通量与封闭曲面（540帧）
// ─────────────────────────────────────────────────────────────────────────────
const Ch11IMField: React.FC = () => {
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

  // Stage 5：完整旋转展示球面与电场线
  const rotY5 = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI * 9 / 4], clamp);

  // Stage 5：电场线渐现（前60帧向外场，后30帧加入向内场对比）
  const drawProg = interpolate(frame, [395, 450], [0, 1], clamp);

  const R = 0.8;  // 球面半径（可视化单位）
  const outwardVectors = sphereSamples(R, true);

  // 点电荷的"无源场"情形：额外几条"穿入再穿出"的场线（用于概念对比）
  const noSourcePairs: Array<{
    from: [number, number, number];
    to: [number, number, number];
  }> = [
    { from: [-1.5, 0, 0.2], to: [1.5, 0, 0.2] },
    { from: [-1.5, 0, -0.2], to: [1.5, 0, -0.2] },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* ── Stage 1: 标题 + 题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: MAGENTA, fontSize: 22, fontFamily: "monospace" }}>
              第十一章 · 曲线积分与曲面积分 · 智能制造案例
            </div>
            <div style={{ color: FORMULA, fontSize: 48, fontWeight: "bold" }}>
              Gauss 定理与静电场通量
            </div>
            <div style={{ color: TEXT, fontSize: 28 }}>
              曲面积分的物理本质 · Maxwell 方程的直觉
            </div>
            <div style={{ color: MAGENTA, fontSize: 22, fontFamily: "monospace", marginTop: 8 }}>
              芯片封装 · ESD防护 · 天线设计 · EMC 分析
            </div>
          </div>
          <ExampleBox exampleNum="案例" title="点电荷产生的电场穿过球面的通量"
            width={1060} opacity={1} accentColor={MAGENTA}>
            <div style={{ padding: "8px 0", fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div>
                点电荷 q 位于原点，电场：
                <span style={{ color: FORMULA, marginLeft: 8 }}>
                  <span dangerouslySetInnerHTML={{ __html: math("\\vec{E}=\\dfrac{q}{4\\pi\\varepsilon_0 r^2}\\hat{r}") }} />
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                以原点为中心，半径 R 的球面 S，求电通量：
                <span style={{ color: FORMULA, marginLeft: 8 }}>
                  <span dangerouslySetInnerHTML={{ __html: math("\\Phi=\\oiint_S\\vec{E}\\cdot d\\vec{S}") }} />
                </span>
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: MAGENTA, fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>
            📋 Gauss 定理的物理直觉
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AnalysisItem index={1} opacity={fade(frame, 65, 15)}
              text={`电通量定义：${math("\\Phi=\\oiint_S\\vec{E}\\cdot d\\vec{S}")} = 单位时间内穿过曲面的"电场量"`} />
            <AnalysisItem index={2} opacity={fade(frame, 85, 15)}
              text={`<strong style="color:${YELLOW}">关键直觉</strong>：内部有正电荷 → 场线向外穿出 → 净通量为正`} />
            <AnalysisItem index={3} opacity={fade(frame, 105, 15)}
              text={`内部无电荷 → 场线穿入 = 穿出 → <strong style="color:${GREEN}">净通量为零</strong>`} />
            <AnalysisItem index={4} opacity={fade(frame, 125, 15)}
              text={`<strong style="color:${MAGENTA}">Gauss 定理</strong>（散度定理）：${math("\\oiint_S\\vec{E}\\cdot d\\vec{S}=\\dfrac{q_{enc}}{\\varepsilon_0}")} ← 仅取决于内部总电荷！`} />
          </div>
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1160, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: MAGENTA, fontSize: 30, fontWeight: "bold", marginBottom: 4 }}>
            📐 点电荷球面通量计算
          </div>
          <StepRow label="Step 1"
            latex={"\\text{球面 S 上各点：} r=R,\\quad |\\vec{E}|=\\frac{q}{4\\pi\\varepsilon_0 R^2}\\text{（均匀）}"}
            note="利用球面对称性" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2"
            latex={"\\hat{r}\\parallel d\\vec{S}\\text{（径向）},\\quad\\vec{E}\\cdot d\\vec{S}=|\\vec{E}||d\\vec{S}|=\\frac{q}{4\\pi\\varepsilon_0 R^2}dS"}
            note="外法线与 E 同向" opacity={step2Op} accentColor={MAGENTA} />
          <StepRow label="Step 3"
            latex={"\\Phi=\\frac{q}{4\\pi\\varepsilon_0 R^2}\\oiint_S dS=\\frac{q}{4\\pi\\varepsilon_0 R^2}\\cdot 4\\pi R^2"}
            note="球面积 = 4πR²" opacity={step3Op} accentColor={ACCENT} />
          <StepRow label="Step 4"
            latex={"\\Phi=\\frac{q}{\\varepsilon_0}"}
            note="R 消去！结果与球面大小无关" opacity={step4Op} accentColor={YELLOW} />

          <div style={{
            opacity: fade(frame, 300, 20),
            padding: "14px 20px", background: "rgba(255,121,198,0.06)",
            borderRadius: 8, fontSize: 21, color: TEXT, lineHeight: 1.7, marginTop: 4,
          }}>
            🌟 深刻结论：无论球面多大，包围同一电荷 q 的球面通量<strong style={{ color: YELLOW }}>恒为 q/ε₀</strong>。
            这是 Gauss 定理的精髓，也是 Maxwell 方程的基础！
          </div>
        </div>
      )}

      {/* ── Stage 4: 关键定理 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <TheoremBox title="Gauss 定理（静电场形式）" width={980} opacity={1}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 34, color: FORMULA }}>
                <span dangerouslySetInnerHTML={{ __html: math(
                  "\\oiint_S \\vec{E}\\cdot d\\vec{S} = \\frac{q_{\\text{enc}}}{\\varepsilon_0}",
                  true
                ) }} />
              </div>
              <div style={{ color: TEXT, fontSize: 21, marginTop: 18, lineHeight: 1.8 }}>
                封闭曲面的电通量 = 内部总电荷 / ε₀
              </div>
            </div>
          </TheoremBox>

          <div style={{ display: "flex", gap: 30, marginTop: 4 }}>
            {[
              { label: "内部 q > 0（正电荷）", desc: "Φ > 0，净通量向外",     c: RED    },
              { label: "内部 q = 0（无电荷）",  desc: "Φ = 0，出入完全相消",   c: GREEN  },
              { label: "内部 q < 0（负电荷）", desc: "Φ < 0，净通量向内",     c: PURPLE },
            ].map(({ label, desc, c }) => (
              <div key={label} style={{
                padding: "12px 18px", background: "rgba(255,255,255,0.04)",
                borderRadius: 8, borderLeft: `3px solid ${c}`, minWidth: 260,
              }}>
                <div style={{ color: c, fontSize: 18, fontWeight: "bold" }}>{label}</div>
                <div style={{ color: TEXT, fontSize: 16, marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage 5: 3D 可视化 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ color: MAGENTA, fontSize: 24, fontWeight: "bold" }}>
            🌐 Polanyi 直觉：电场线穿出封闭球面 = 内部有正电荷
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CoordinateSystem3D center={[410, 320]} scale={260}
                xRange={[-1.8, 1.8]} yRange={[-1.8, 1.8]} zRange={[-1.8, 1.8]}
                showGrid={false} width={820} height={570}
                rotationX={Math.PI / 6} rotationY={rotY5}
              >
                {/* 封闭球面 */}
                <SurfaceMesh3D
                  x={(u, v) => R * Math.sin(u) * Math.cos(v)}
                  y={(u, v) => R * Math.sin(u) * Math.sin(v)}
                  z={(u, _v) => R * Math.cos(u)}
                  uMin={0} uMax={Math.PI} uSteps={10}
                  vMin={0} vMax={2 * Math.PI} vSteps={20}
                  color={MAGENTA} strokeWidth={1} opacity={0.30}
                />
                {/* 径向向外的电场线（正电荷在内部） */}
                {outwardVectors.map(({ from, to, color }, i) => (
                  <AnimatedVector3D key={i}
                    from={from} to={to}
                    color={color} strokeWidth={2.5}
                    drawProgress={drawProg}
                    opacity={0.90}
                    label={i === 4 ? "E" : undefined}
                  />
                ))}
              </CoordinateSystem3D>
              <div style={{ textAlign: "center", color: TEXT, fontSize: 17 }}>
                <span style={{ color: MAGENTA }}>粉色球面</span>：封闭曲面 S&nbsp;&nbsp;|&nbsp;&nbsp;
                <span style={{ color: ORANGE }}>向外场线</span>：来自内部正电荷 +q
              </div>
            </div>

            {/* 右侧说明面板 */}
            <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 16, paddingTop: 20 }}>
              <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold", lineHeight: 1.7 }}>
                三种情形对比：
              </div>

              {[
                {
                  c: RED, title: "内部有正电荷 +q",
                  desc: "所有场线从内向外穿出，净通量 = q/ε₀ > 0",
                  icon: "✦",
                },
                {
                  c: GREEN, title: "内部无电荷",
                  desc: "穿入场线 = 穿出场线，净通量 = 0",
                  icon: "○",
                },
                {
                  c: PURPLE, title: "内部有负电荷 -q",
                  desc: "所有场线向内穿入，净通量 = -q/ε₀ < 0",
                  icon: "✧",
                },
              ].map(({ c, title, desc, icon }) => (
                <div key={title} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "12px 14px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 8, borderLeft: `4px solid ${c}`,
                }}>
                  <span style={{ color: c, fontSize: 22, minWidth: 28 }}>{icon}</span>
                  <div>
                    <div style={{ color: c, fontSize: 18, fontWeight: "bold" }}>{title}</div>
                    <div style={{ color: TEXT, fontSize: 15, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: 4, padding: "12px 16px",
                background: "rgba(255,121,198,0.08)", borderRadius: 8,
                fontSize: 18, color: TEXT, lineHeight: 1.6,
              }}>
                💡 <strong style={{ color: MAGENTA }}>Gauss 定理</strong>告诉我们：
                只需测量球面上的电通量，
                就能<strong style={{ color: YELLOW }}>不进入球内</strong>地知道内部总电荷量
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 工程总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 950, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: MAGENTA, fontSize: 32, fontWeight: "bold" }}>💡 工程应用总结</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              `Maxwell方程一：${math("\\nabla\\cdot\\vec{E}=\\rho/\\varepsilon_0")} ← Gauss定理的微分形式（散度）`,
              `<strong style="color:${YELLOW}">默会知识</strong>："看球面外的电通量"等价于"知道球内总电荷"——不穿透就能探测内部`,
              `工程应用：ESD（静电放电）防护设计中，通过测量封装外的电场强度反推内部电荷积累`,
              `Gauss 定理：将难计算的封闭曲面积分化为<strong style="color:${ORANGE}">简单体积积分</strong>（散度定理）`,
            ].map((text, i) => (
              <div key={i} style={{
                opacity: fade(frame, 487 + i * 12, 15),
                display: "flex", gap: 12, fontSize: 23, color: TEXT,
                padding: "10px 16px", background: "rgba(255,121,198,0.05)",
                borderRadius: 8, borderLeft: `3px solid ${MAGENTA}`,
              }}>
                <span style={{ color: MAGENTA, fontWeight: "bold" }}>▸</span>
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>
          <div style={{
            opacity: fade(frame, 533, 7),
            marginTop: 8, padding: "12px 20px",
            background: "rgba(255,121,198,0.08)", borderRadius: 10,
            fontSize: 22, color: MAGENTA, textAlign: "center",
          }}>
            智能制造 · 曲面积分 · Gauss 定理 · Maxwell 方程
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const WCh11IMField = withWatermark(Ch11IMField);
export default WCh11IMField;
