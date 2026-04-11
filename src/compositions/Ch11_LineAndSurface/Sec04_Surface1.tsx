import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";
// withWatermark 由 Root.tsx 统一包裹，此文件直接导出原始组件

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (frame: number, start: number, duration = 25) =>
  interpolate(frame, [start, start + duration], [0, 1], {
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

// 场景边界（共 540 帧）
const T = { s1: 0, s2: 60, s3: 150, s4: 270, s5: 390, s6: 480, end: 540 };

// ─────────────────────────────────────────────────────────────────────────────
// 子组件：推导步骤行
// ─────────────────────────────────────────────────────────────────────────────
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
    padding: "10px 20px", background: "rgba(97,218,251,0.06)",
    borderRadius: 8, borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ color: accentColor, fontSize: 18, minWidth: 140, fontWeight: "bold" }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 18, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }} />
    <span style={{ color: TEXT, fontSize: 15, opacity: 0.75, minWidth: 120, textAlign: "right" }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：第一类曲面积分（540帧）
// ─────────────────────────────────────────────────────────────────────────────
const Ch11Sec04Surface1: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = frame < T.s2 ? 1
    : frame < T.s3 ? 2
    : frame < T.s4 ? 3
    : frame < T.s5 ? 4
    : frame < T.s6 ? 5
    : 6;

  // Scene 2：球面缓慢旋转展示
  const rotY2 = interpolate(frame, [T.s2, T.s3], [Math.PI / 4, Math.PI * 5 / 4], clamp);

  // Scene 5：完整一圈旋转展示面积拉伸
  const rotY5 = interpolate(frame, [T.s5, T.s6], [Math.PI / 4, Math.PI * 9 / 4], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>

      {/* ── Scene 1: 标题卡 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="§ 11.4"
          sectionTitle="第一类曲面积分（对面积的积分）"
          opacity={fade(frame, 0, 30)}
        />
      )}

      {/* ── Scene 2: 概念引入 + 3D 球面展示 ── */}
      {scene === 2 && (
        <div style={{
          opacity: fade(frame, T.s2, 20),
          width: 1680, display: "flex", gap: 50, alignItems: "center",
        }}>
          {/* 左：文字定义 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>📐 定义</div>

            <div style={{ fontSize: 26, color: FORMULA, lineHeight: 1.8 }}>
              第一类曲面积分：
            </div>
            <div style={{ textAlign: "center", fontSize: 32, margin: "4px 0" }}>
              <span dangerouslySetInnerHTML={{ __html: math("\\iint_S f(x,y,z)\\,dS", true) }} />
            </div>
            <div style={{ color: TEXT, fontSize: 22, lineHeight: 1.7 }}>
              其中 <span dangerouslySetInnerHTML={{ __html: math("dS") }} /> 是曲面 S 上的<strong style={{ color: YELLOW }}>面积元素</strong>，
              与曲面的法向量方向<strong style={{ color: ORANGE }}>无关</strong>（标量积分）
            </div>

            <div style={{
              padding: "16px 20px", background: "rgba(97,218,251,0.08)",
              borderRadius: 10, borderLeft: `4px solid ${ACCENT}`,
              marginTop: 8,
            }}>
              <div style={{ color: ACCENT, fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
                💡 物理意义
              </div>
              <div style={{ color: TEXT, fontSize: 22, lineHeight: 1.8 }}>
                若 <span dangerouslySetInnerHTML={{ __html: math("f(x,y,z)") }} /> 是曲面上的
                <strong style={{ color: YELLOW }}>面密度分布</strong>（kg/m²），<br />
                则第一类曲面积分给出曲面的
                <strong style={{ color: GREEN }}>总质量</strong>（kg）。
              </div>
            </div>
          </div>

          {/* 右：3D 上半球面展示（旋转） */}
          <div style={{ width: 720, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CoordinateSystem3D
              center={[360, 300]}
              scale={95}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 2.5]}
              showGrid={true}
              width={720}
              height={520}
              rotationX={Math.PI / 6}
              rotationY={rotY2}
            >
              {/* 上半球面 z = sqrt(4 - x² - y²)，参数化为球坐标 */}
              <SurfaceMesh3D
                x={(u, v) => 2 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 2 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 2 * Math.cos(u)}
                uMin={0} uMax={Math.PI / 2} uSteps={14}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={ACCENT}
                strokeWidth={1.2}
                opacity={0.65}
              />
            </CoordinateSystem3D>
            <div style={{ color: TEXT, fontSize: 18, marginTop: 6, textAlign: "center" }}>
              上半球面&nbsp;
              <span dangerouslySetInnerHTML={{ __html: math("z=\\sqrt{4-x^2-y^2}") }} />
              &nbsp;（旋转展示立体结构）
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 3: 面积元素 dS 公式 + Polanyi 直觉 ── */}
      {scene === 3 && (
        <div style={{
          opacity: fade(frame, T.s3, 20),
          width: 1680, display: "flex", gap: 50, alignItems: "flex-start",
        }}>
          {/* 左：定理 + Polanyi 解释 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ color: PURPLE, fontSize: 32, fontWeight: "bold" }}>📏 面积元素 dS</div>

            <TheoremBox title="面积元素计算公式" width={720} opacity={1}>
              <div style={{ textAlign: "center", padding: "16px 0", fontSize: 26, color: FORMULA }}>
                <span dangerouslySetInnerHTML={{ __html: math(
                  "dS = \\sqrt{1+\\left(\\frac{\\partial z}{\\partial x}\\right)^2+\\left(\\frac{\\partial z}{\\partial y}\\right)^2}\\,dA",
                  true
                ) }} />
              </div>
              <div style={{ color: TEXT, fontSize: 20, textAlign: "center" }}>
                其中 <span dangerouslySetInnerHTML={{ __html: math("dA = dx\\,dy") }} /> 是 xy 平面上的投影面积元素
              </div>
            </TheoremBox>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
              {[
                { delay: 20, text: `为什么有<strong style="color:${YELLOW}">根号</strong>？因为曲面是"倾斜"的，斜面面积 > 投影面积`, c: YELLOW },
                { delay: 55, text: `水平平面（${math("z=c")}）时，偏导为零，<strong style="color:${GREEN}">dS = dA</strong>（无拉伸）`, c: GREEN },
                { delay: 90, text: `曲面越"陡"（偏导越大），${math("dS")} 比 ${math("dA")} 大越多，如球赤道处`, c: ORANGE },
              ].map(({ delay, text, c }, i) => (
                <div key={i} style={{
                  opacity: fade(frame, T.s3 + delay, 20),
                  display: "flex", gap: 12, fontSize: 22, color: TEXT,
                  padding: "10px 16px", background: "rgba(97,218,251,0.04)",
                  borderRadius: 8, borderLeft: `3px solid ${c}`,
                }}>
                  <span style={{ color: c, fontWeight: "bold" }}>▸</span>
                  <span dangerouslySetInnerHTML={{ __html: text }} />
                </div>
              ))}
            </div>
          </div>

          {/* 右：3D 展示曲面 dS 与投影 dA 的对比 */}
          <div style={{ width: 700, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CoordinateSystem3D
              center={[350, 300]}
              scale={90}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 2.5]}
              showGrid={true}
              width={700}
              height={520}
              rotationX={Math.PI / 5}
              rotationY={Math.PI * 0.75}
            >
              {/* 上半球面（青色，dS） */}
              <SurfaceMesh3D
                x={(u, v) => 2 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 2 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 2 * Math.cos(u)}
                uMin={0} uMax={Math.PI / 2} uSteps={12}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={ACCENT}
                strokeWidth={1}
                opacity={0.5}
              />
              {/* xy 平面投影圆盘（黄色，dA） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(_u, _v) => 0}
                uMin={0} uMax={2} uSteps={8}
                vMin={0} vMax={2 * Math.PI} vSteps={16}
                color={YELLOW}
                strokeWidth={1}
                opacity={0.4}
              />
            </CoordinateSystem3D>
            <div style={{ color: TEXT, fontSize: 18, marginTop: 6, textAlign: "center" }}>
              <span style={{ color: ACCENT }}>●</span> 球面（dS）&nbsp;&nbsp;
              <span style={{ color: YELLOW }}>●</span> 投影圆盘（dA）
              &nbsp;—— dS &gt; dA
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 4: 分步计算上半球面面积 ── */}
      {scene === 4 && (
        <div style={{ opacity: fade(frame, T.s4, 20), width: 1400, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: "bold", marginBottom: 4 }}>
            📐 例：计算上半球面&nbsp;
            <span dangerouslySetInnerHTML={{ __html: math("z=\\sqrt{4-x^2-y^2}") }} />
            &nbsp;的面积
          </div>

          <StepRow
            label="Step 1 偏导数"
            latex={"\\frac{\\partial z}{\\partial x}=\\frac{-x}{\\sqrt{4-x^2-y^2}},\\quad \\frac{\\partial z}{\\partial y}=\\frac{-y}{\\sqrt{4-x^2-y^2}}"}
            note="链式求导"
            opacity={fade(frame, T.s4 + 5, 20)}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2 根号内"
            latex={"1+\\frac{x^2}{4-x^2-y^2}+\\frac{y^2}{4-x^2-y^2}=\\frac{4}{4-x^2-y^2}"}
            note="通分化简"
            opacity={fade(frame, T.s4 + 35, 20)}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3 面积元素"
            latex={"dS = \\frac{2}{\\sqrt{4-x^2-y^2}}\\,dA = \\frac{2}{\\sqrt{4-r^2}}\\,r\\,dr\\,d\\theta"}
            note="极坐标代换 x²+y²=r²"
            opacity={fade(frame, T.s4 + 65, 20)}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 4 积分"
            latex={"\\iint_S dS = \\int_0^{2\\pi}d\\theta\\int_0^2\\frac{2r}{\\sqrt{4-r^2}}\\,dr"}
            note="投影区域 D：r∈[0,2]"
            opacity={fade(frame, T.s4 + 95, 20)}
            accentColor={ORANGE}
          />
          <StepRow
            label="Step 5 结果"
            latex={"= 2\\pi \\cdot \\left[-2\\sqrt{4-r^2}\\right]_0^2 = 2\\pi\\cdot[0-(-4)] = 8\\pi"}
            note="令 u = 4−r²"
            opacity={fade(frame, T.s4 + 105, 20)}
            accentColor={YELLOW}
          />

          <div style={{
            opacity: fade(frame, T.s4 + 110, 20),
            marginTop: 8, padding: "14px 24px",
            background: "rgba(97,218,251,0.10)", borderRadius: 10,
            border: `1px solid ${ACCENT}`,
          }}>
            <div style={{ color: ACCENT, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>
              ✅ 上半球面（半径=2）面积 = &nbsp;
              <span dangerouslySetInnerHTML={{ __html: math("8\\pi") }} />
              &nbsp;（球面积公式 4πR² = 16π 的一半 = 8π，吻合 ✓）
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 5: 3D 可视化——面积拉伸分布展示 ── */}
      {scene === 5 && (
        <div style={{
          opacity: fade(frame, T.s5, 25),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        }}>
          <div style={{ color: ORANGE, fontSize: 28, fontWeight: "bold" }}>
            🌐 Polanyi 直觉：球面不同位置的"面积拉伸比"&nbsp;
            <span dangerouslySetInnerHTML={{ __html: math("dS/dA") }} />
          </div>

          <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
            {/* 3D 旋转球面，颜色按纬度区分 */}
            <CoordinateSystem3D
              center={[390, 310]}
              scale={95}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 2.5]}
              showGrid={false}
              width={780}
              height={580}
              rotationX={Math.PI / 6}
              rotationY={rotY5}
            >
              {/* 极点区域 φ ∈ [0, π/6]  → 绿色（拉伸小） */}
              <SurfaceMesh3D
                x={(u, v) => 2 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 2 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 2 * Math.cos(u)}
                uMin={0} uMax={Math.PI / 6} uSteps={5}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={GREEN}
                strokeWidth={1.5}
                opacity={0.85}
              />
              {/* 中间区域 φ ∈ [π/6, π/3] → 黄色 */}
              <SurfaceMesh3D
                x={(u, v) => 2 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 2 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 2 * Math.cos(u)}
                uMin={Math.PI / 6} uMax={Math.PI / 3} uSteps={5}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={YELLOW}
                strokeWidth={1.5}
                opacity={0.85}
              />
              {/* 赤道区域 φ ∈ [π/3, π/2] → 红色（拉伸大） */}
              <SurfaceMesh3D
                x={(u, v) => 2 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 2 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 2 * Math.cos(u)}
                uMin={Math.PI / 3} uMax={Math.PI / 2} uSteps={6}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={RED}
                strokeWidth={1.5}
                opacity={0.85}
              />
            </CoordinateSystem3D>

            {/* 右侧说明面板 */}
            <div style={{ width: 440, display: "flex", flexDirection: "column", gap: 18, paddingTop: 30 }}>
              <div style={{ color: FORMULA, fontSize: 22, fontWeight: "bold" }}>
                面积拉伸比&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math("\\dfrac{dS}{dA}=\\dfrac{2}{\\sqrt{4-r^2}}") }} />：
              </div>

              {[
                { c: GREEN,  label: "极点附近（φ ≈ 0°）",  ratio: "dS/dA ≈ 1.00", note: "曲面几乎水平，无拉伸" },
                { c: YELLOW, label: "中间带（φ ≈ 30°）",  ratio: "dS/dA ≈ 1.15", note: "轻微倾斜，略有拉伸" },
                { c: RED,    label: "赤道区（φ → 90°）", ratio: "dS/dA → ∞",    note: "曲面近乎垂直，强烈拉伸" },
              ].map(({ c, label, ratio, note }) => (
                <div key={label} style={{
                  display: "flex", gap: 14, alignItems: "center",
                  padding: "12px 16px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 8, borderLeft: `4px solid ${c}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: c, fontSize: 18, fontWeight: "bold" }}>{label}</div>
                    <div style={{ color: TEXT, fontSize: 16, marginTop: 2 }}>{note}</div>
                  </div>
                  <div style={{ color: FORMULA, fontSize: 20, fontWeight: "bold", minWidth: 90, textAlign: "right" }}>{ratio}</div>
                </div>
              ))}

              <div style={{
                marginTop: 8, padding: "12px 16px",
                background: "rgba(97,218,251,0.08)", borderRadius: 8,
                fontSize: 19, color: TEXT, lineHeight: 1.6,
              }}>
                💡 球面积分时，赤道附近的
                <strong style={{ color: RED }}>"面积补偿"</strong>
                非常大，贡献了大量积分值
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: fade(frame, T.s6, 25), width: 1060, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 34, fontWeight: "bold" }}>💡 核心总结</div>

          {[
            {
              c: ACCENT, delay: 5,
              text: `第一类曲面积分将曲面 S 上的函数值对<strong style="color:${YELLOW}">面积</strong>积分，是标量积分`,
            },
            {
              c: GREEN, delay: 18,
              text: `计算公式：投影到 xy 平面，引入<strong style="color:${ORANGE}">拉伸因子</strong>&nbsp;`
                + math("\\sqrt{1+f_x^2+f_y^2}")
                + "&nbsp;（面积补偿）",
            },
            {
              c: PURPLE, delay: 33,
              text: `Polanyi 直觉：曲面"倾斜"得越厉害，dS 比 dA 大越多，积分必须<strong style="color:${PURPLE}">补偿</strong>这个差距`,
            },
            {
              c: YELLOW, delay: 48,
              text: `上半球面面积&nbsp;` + math("8\\pi")
                + `&nbsp;= 球面积公式&nbsp;` + math("4\\pi R^2")
                + `&nbsp;在 R=2 时的一半 ✓`,
            },
          ].map(({ c, delay, text }, i) => (
            <div key={i} style={{
              opacity: fade(frame, T.s6 + delay, 15),
              display: "flex", gap: 12, fontSize: 23, color: TEXT,
              padding: "12px 16px", background: "rgba(97,218,251,0.05)",
              borderRadius: 8, borderLeft: `3px solid ${c}`,
            }}>
              <span style={{ color: c, fontWeight: "bold" }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}

    </AbsoluteFill>
  );
};

export default Ch11Sec04Surface1;
