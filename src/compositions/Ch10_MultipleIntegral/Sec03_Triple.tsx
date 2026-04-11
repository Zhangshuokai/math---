import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (f: number, start: number, duration = 25): number =>
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

// ─────────────────────────────────────────────────────────────────────────────
// 步骤行组件
// ─────────────────────────────────────────────────────────────────────────────
interface StepRowProps {
  label: string;
  latex: string;
  note: string;
  opacity: number;
  accentColor?: string;
}
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = ACCENT }) => (
  <div
    style={{
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "12px 18px",
      background: `${accentColor}0d`,
      borderRadius: 8,
      borderLeft: `3px solid ${accentColor}`,
    }}
  >
    <span style={{ color: accentColor, fontSize: 18, minWidth: 70, fontWeight: "bold" }}>{label}</span>
    <span
      style={{ color: FORMULA, fontSize: 20, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }}
    />
    <span style={{ color: TEXT, fontSize: 16, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（540 帧）
// ─────────────────────────────────────────────────────────────────────────────
const Sec03Triple: React.FC = () => {
  const frame = useCurrentFrame();

  // 6 个场景时序
  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : frame < 480 ? 5
    : 6;

  // ── Scene 1 ──
  const s1Op = fade(frame, 0, 30);

  // ── Scene 2：三重积分概念 (60-150) ──
  const s2Title = fade(frame, 60, 20);
  const s2Def = fade(frame, 82, 22);
  const s2Geo = fade(frame, 108, 22);
  const rotY2 = interpolate(frame, [70, 150], [Math.PI / 4, Math.PI / 4 + Math.PI], clamp);

  // ── Scene 3：柱坐标 + Jacobian (150-270) ──
  const s3Thm = fade(frame, 150, 22);
  const s3Viz = fade(frame, 195, 25);
  const s3Note = fade(frame, 215, 20);
  const rotY3 = interpolate(frame, [200, 270], [0.2, 0.2 + Math.PI * 1.5], clamp);

  // ── Scene 4：球坐标 (270-390) ──
  const s4Thm = fade(frame, 270, 22);
  const s4Viz = fade(frame, 325, 25);
  const s4Note = fade(frame, 348, 20);
  const rotY4 = interpolate(frame, [330, 390], [0, Math.PI * 2], clamp);

  // ── Scene 5：球体体积 (390-480) ──
  const s5Title = fade(frame, 390, 20);
  const s5S1 = fade(frame, 410, 20);
  const s5S2 = fade(frame, 432, 20);
  const s5S3 = fade(frame, 452, 20);
  const s5Result = fade(frame, 462, 20);
  const rotY5 = interpolate(frame, [390, 480], [Math.PI / 6, Math.PI / 6 + Math.PI * 2], clamp);

  // ── Scene 6：总结 (480-540) ──
  const s6Op = fade(frame, 480, 28);

  return (
    <AbsoluteFill style={{ background: BG }}>

      {/* ── Scene 1：标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十"
          chapterTitle="重积分"
          sectionNum="10.3"
          sectionTitle="三重积分与柱球坐标"
          opacity={s1Op}
        />
      )}

      {/* ── Scene 2：三重积分概念 ── */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "50px 80px", gap: 50 }}>
          {/* 左侧文字 */}
          <div style={{ flex: "0 0 780px", display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold", opacity: s2Title }}>
              三重积分：体上的积分
            </div>
            <div style={{ opacity: s2Def, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.8 }}>
                将二重积分推广：积分区域从平面域 D 扩展到空间体 Ω，面积微元 dσ 变为体积微元 dV
              </div>
              <div
                style={{ color: FORMULA, fontSize: 26, textAlign: "center", margin: "10px 0" }}
                dangerouslySetInnerHTML={{ __html: math("\\iiint_\\Omega f(x,y,z)\\,dV = \\lim_{\\lambda\\to 0}\\sum_i f(\\xi_i,\\eta_i,\\zeta_i)\\Delta V_i", true) }}
              />
            </div>
            <div style={{
              opacity: s2Geo, padding: "14px 20px",
              background: `${ACCENT}0f`, borderRadius: 10, border: `1px solid ${ACCENT}33`,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ color: ACCENT, fontSize: 22, fontWeight: "bold" }}>物理直觉</div>
              <div style={{ color: TEXT, fontSize: 21, lineHeight: 1.8 }}>
                f = 1 时，∭Ω dV = Ω 的<strong style={{ color: ACCENT }}>体积</strong><br />
                f = ρ(x,y,z) 时，∭Ω ρ dV = Ω 的<strong style={{ color: ORANGE }}>质量</strong><br />
                右图：球体 x²+y²+z²≤1 作为积分区域 Ω
              </div>
            </div>
          </div>
          {/* 右侧 3D 球面 */}
          <div style={{ opacity: s2Geo }}>
            <CoordinateSystem3D
              center={[340, 310]}
              scale={110}
              xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]} zRange={[-1.5, 1.5]}
              width={680} height={600}
              showGrid
              rotationX={Math.PI / 6}
              rotationY={rotY2}
            >
              {/* 球面 ρ=1 */}
              <SurfaceMesh3D
                x={(u, v) => Math.sin(u) * Math.cos(v)}
                y={(u, v) => Math.sin(u) * Math.sin(v)}
                z={(u, _v) => Math.cos(u)}
                uMin={0} uMax={Math.PI} uSteps={12}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={ACCENT} strokeWidth={0.8} opacity={0.4}
              />
              {/* 赤道圆盘（半透明填充感）*/}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(_u, _v) => 0}
                uMin={0} uMax={1} uSteps={6}
                vMin={0} vMax={2 * Math.PI} vSteps={18}
                color={PURPLE} strokeWidth={0.6} opacity={0.2}
              />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3：柱坐标 + Jacobian 直觉 ── */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "40px 70px", gap: 40 }}>
          {/* 左侧：公式 + Jacobian 说明 */}
          <div style={{ flex: "0 0 730px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ opacity: s3Thm }}>
              <TheoremBox title="柱坐标变换" width={700} opacity={1}>
                <div style={{ fontSize: 20, color: TEXT, lineHeight: 2 }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: math("x = r\\cos\\theta,\\quad y = r\\sin\\theta,\\quad z = z") }}
                    style={{ color: FORMULA }}
                  />
                  <div
                    style={{ color: ORANGE, fontSize: 28, textAlign: "center", margin: "10px 0", fontWeight: "bold" }}
                    dangerouslySetInnerHTML={{ __html: math("dV = r\\,dr\\,d\\theta\\,dz") }}
                  />
                  <div style={{ color: TEXT, fontSize: 18 }}>
                    Jacobi 行列式：
                    <span dangerouslySetInnerHTML={{ __html: math("\\frac{\\partial(x,y,z)}{\\partial(r,\\theta,z)} = r") }} style={{ color: ORANGE }} />
                  </div>
                </div>
              </TheoremBox>
            </div>
            <div style={{ opacity: s3Note, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: ORANGE, fontSize: 22, fontWeight: "bold" }}>🔑 Polanyi 默会直觉：为什么有 r？</div>
              <div style={{
                padding: "14px 18px", background: `${ORANGE}0d`, borderRadius: 10, border: `1px solid ${ORANGE}33`,
                fontSize: 20, color: TEXT, lineHeight: 1.85,
              }}>
                右图展示<strong style={{ color: GREEN }}>内楔形（r 小）</strong>和<strong style={{ color: ACCENT }}>外楔形（r 大）</strong>：<br />
                两者 <span dangerouslySetInnerHTML={{ __html: math("\\Delta r") }} /> 和 <span dangerouslySetInnerHTML={{ __html: math("\\Delta\\theta") }} /> 完全相同，<br />
                但弧段长度 <span dangerouslySetInnerHTML={{ __html: math("r\\cdot\\Delta\\theta") }} style={{ color: ORANGE }} /> 差异悬殊！<br />
                <strong style={{ color: ORANGE }}>外楔形面积 ≫ 内楔形面积</strong>——这正是 r 因子的来源
              </div>
              <div style={{ fontSize: 18, color: TEXT, padding: "8px 14px", background: `${ACCENT}08`, borderRadius: 8 }}>
                <span style={{ color: ACCENT }}>适用场景：</span>积分区域关于 z 轴对称（圆柱面、圆锥面等）
              </div>
            </div>
          </div>
          {/* 右侧：3D 柱坐标 Jacobian 可视化 */}
          <div style={{ opacity: s3Viz }}>
            <CoordinateSystem3D
              center={[330, 290]}
              scale={75}
              xRange={[-2.5, 2.5]} yRange={[-2.5, 2.5]} zRange={[0, 3]}
              width={670} height={580}
              showGrid
              rotationX={Math.PI / 5}
              rotationY={rotY3}
            >
              {/* 外圆柱面（背景参考）*/}
              <SurfaceMesh3D
                x={(_u, v) => 2 * Math.cos(v)}
                y={(_u, v) => 2 * Math.sin(v)}
                z={(u, _v) => u * 2.5}
                uMin={0} uMax={1} uSteps={4}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={TEXT} strokeWidth={0.5} opacity={0.15}
              />
              {/* 小楔形外弧面（r≈0.55，绿色） */}
              <SurfaceMesh3D
                x={(_u, v) => 0.55 * Math.cos(v)}
                y={(_u, v) => 0.55 * Math.sin(v)}
                z={(u, _v) => u * 1.2}
                uMin={0} uMax={1} uSteps={3}
                vMin={0} vMax={Math.PI / 5} vSteps={6}
                color={GREEN} strokeWidth={2.5} opacity={0.9}
              />
              {/* 小楔形底面 */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(_u, _v) => 0}
                uMin={0.38} uMax={0.72} uSteps={2}
                vMin={0} vMax={Math.PI / 5} vSteps={5}
                color={GREEN} strokeWidth={1.8} opacity={0.75}
              />
              {/* 大楔形外弧面（r≈1.55，蓝色） */}
              <SurfaceMesh3D
                x={(_u, v) => 1.55 * Math.cos(v)}
                y={(_u, v) => 1.55 * Math.sin(v)}
                z={(u, _v) => u * 1.2}
                uMin={0} uMax={1} uSteps={3}
                vMin={0} vMax={Math.PI / 5} vSteps={6}
                color={ACCENT} strokeWidth={2.5} opacity={0.9}
              />
              {/* 大楔形底面 */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(u, v) => u * Math.sin(v)}
                z={(_u, _v) => 0}
                uMin={1.38} uMax={1.72} uSteps={2}
                vMin={0} vMax={Math.PI / 5} vSteps={5}
                color={ACCENT} strokeWidth={1.8} opacity={0.75}
              />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4：球坐标 ── */}
      {scene === 4 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "40px 70px", gap: 40 }}>
          {/* 左侧：公式 */}
          <div style={{ flex: "0 0 730px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ opacity: s4Thm }}>
              <TheoremBox title="球坐标变换" width={700} opacity={1}>
                <div style={{ fontSize: 20, color: TEXT, lineHeight: 2.1 }}>
                  <div dangerouslySetInnerHTML={{ __html: math("x = \\rho\\sin\\varphi\\cos\\theta") }} style={{ color: FORMULA }} />
                  <div dangerouslySetInnerHTML={{ __html: math("y = \\rho\\sin\\varphi\\sin\\theta") }} style={{ color: FORMULA }} />
                  <div dangerouslySetInnerHTML={{ __html: math("z = \\rho\\cos\\varphi") }} style={{ color: FORMULA }} />
                  <div
                    style={{ color: PURPLE, fontSize: 26, textAlign: "center", margin: "10px 0", fontWeight: "bold" }}
                    dangerouslySetInnerHTML={{ __html: math("dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta") }}
                  />
                </div>
              </TheoremBox>
            </div>
            <div style={{ opacity: s4Note, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: PURPLE, fontSize: 22, fontWeight: "bold" }}>🔑 Polanyi 默会直觉：ρ²sinφ 的来源</div>
              <div style={{
                padding: "14px 18px", background: `${PURPLE}0d`, borderRadius: 10, border: `1px solid ${PURPLE}33`,
                fontSize: 20, color: TEXT, lineHeight: 1.85,
              }}>
                球坐标微元三边长度：<br />
                径向边：<span dangerouslySetInnerHTML={{ __html: math("\\Delta\\rho") }} style={{ color: ACCENT }} /><br />
                纬向弧：<span dangerouslySetInnerHTML={{ __html: math("\\rho\\cdot\\Delta\\varphi") }} style={{ color: ORANGE }} />（ρ越大，弧越长）<br />
                经向弧：<span dangerouslySetInnerHTML={{ __html: math("\\rho\\sin\\varphi\\cdot\\Delta\\theta") }} style={{ color: PURPLE }} />（还受 sinφ 约束）<br />
                <strong style={{ color: PURPLE }}>三边之积 = ρ²sinφ · dρ dφ dθ</strong>
              </div>
              <div style={{ fontSize: 18, color: TEXT, padding: "8px 14px", background: `${PURPLE}08`, borderRadius: 8 }}>
                <span style={{ color: PURPLE }}>适用场景：</span>球形区域，或被积函数含 x²+y²+z²
              </div>
            </div>
          </div>
          {/* 右侧：3D 球坐标网格 */}
          <div style={{ opacity: s4Viz }}>
            <CoordinateSystem3D
              center={[330, 290]}
              scale={100}
              xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]} zRange={[-1.5, 1.5]}
              width={670} height={580}
              showGrid
              rotationX={Math.PI / 6}
              rotationY={rotY4}
            >
              {/* 完整球面 ρ=1 */}
              <SurfaceMesh3D
                x={(u, v) => Math.sin(u) * Math.cos(v)}
                y={(u, v) => Math.sin(u) * Math.sin(v)}
                z={(u, _v) => Math.cos(u)}
                uMin={0} uMax={Math.PI} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={PURPLE} strokeWidth={0.7} opacity={0.3}
              />
              {/* 锥面 φ=π/4（ρ从0到1，θ从0到2π） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.sin(Math.PI / 4) * Math.cos(v)}
                y={(u, v) => u * Math.sin(Math.PI / 4) * Math.sin(v)}
                z={(u, _v) => u * Math.cos(Math.PI / 4)}
                uMin={0} uMax={1} uSteps={4}
                vMin={0} vMax={2 * Math.PI} vSteps={18}
                color={ORANGE} strokeWidth={1} opacity={0.45}
              />
              {/* 半平面 θ=0（扇形截面） */}
              <SurfaceMesh3D
                x={(u, v) => v * Math.sin(u)}
                y={(_u, _v) => 0}
                z={(u, v) => v * Math.cos(u)}
                uMin={0} uMax={Math.PI} uSteps={8}
                vMin={0} vMax={1} vSteps={4}
                color={ACCENT} strokeWidth={1} opacity={0.35}
              />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5：球体体积计算 ── */}
      {scene === 5 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "40px 70px", gap: 50 }}>
          {/* 左侧：推导步骤 */}
          <div style={{ flex: "0 0 820px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: ACCENT, fontSize: 30, fontWeight: "bold", opacity: s5Title }}>
              应用：球体体积
            </div>
            <div style={{ opacity: s5Title, fontSize: 20, color: TEXT }}>
              计算球体 x²+y²+z² ≤ R² 的体积，用球坐标：<br />
              ρ ∈ [0,R]，φ ∈ [0,π]，θ ∈ [0,2π]
            </div>
            <StepRow
              label="Step 1"
              latex={"V = \\int_0^{2\\pi}d\\theta\\int_0^\\pi\\sin\\varphi\\,d\\varphi\\int_0^R \\rho^2\\,d\\rho"}
              note="球坐标代入 dV=ρ²sinφ dρ dφ dθ"
              opacity={s5S1}
              accentColor={ACCENT}
            />
            <StepRow
              label="Step 2"
              latex={"= 2\\pi \\cdot \\left[-\\cos\\varphi\\right]_0^\\pi \\cdot \\left[\\frac{\\rho^3}{3}\\right]_0^R"}
              note="三个积分可分离计算"
              opacity={s5S2}
              accentColor={PURPLE}
            />
            <StepRow
              label="Step 3"
              latex={"= 2\\pi \\cdot 2 \\cdot \\frac{R^3}{3}"}
              note="φ 积分 = 2，ρ 积分 = R³/3"
              opacity={s5S3}
              accentColor={GREEN}
            />
            <div style={{
              opacity: s5Result,
              padding: "16px 24px", borderRadius: 12,
              background: `${YELLOW}12`, border: `2px solid ${YELLOW}66`,
              textAlign: "center",
            }}>
              <div
                style={{ color: YELLOW, fontSize: 42 }}
                dangerouslySetInnerHTML={{ __html: math("V = \\dfrac{4}{3}\\pi R^3", true) }}
              />
              <div style={{ color: TEXT, fontSize: 18, marginTop: 8 }}>
                球坐标将三重积分分解为三个<strong style={{ color: YELLOW }}>可分离</strong>的一维积分
              </div>
            </div>
          </div>
          {/* 右侧：旋转球面 */}
          <div style={{ opacity: s5Title }}>
            <CoordinateSystem3D
              center={[290, 290]}
              scale={95}
              xRange={[-1.5, 1.5]} yRange={[-1.5, 1.5]} zRange={[-1.5, 1.5]}
              width={580} height={580}
              showGrid
              rotationX={Math.PI / 6}
              rotationY={rotY5}
            >
              <SurfaceMesh3D
                x={(u, v) => Math.sin(u) * Math.cos(v)}
                y={(u, v) => Math.sin(u) * Math.sin(v)}
                z={(u, _v) => Math.cos(u)}
                uMin={0} uMax={Math.PI} uSteps={14}
                vMin={0} vMax={2 * Math.PI} vSteps={22}
                color={ACCENT} strokeWidth={0.8} opacity={0.42}
              />
              {/* 内圆以显示积分区域感 */}
              <SurfaceMesh3D
                x={(u, v) => 0.5 * Math.sin(u) * Math.cos(v)}
                y={(u, v) => 0.5 * Math.sin(u) * Math.sin(v)}
                z={(u, _v) => 0.5 * Math.cos(u)}
                uMin={0} uMax={Math.PI} uSteps={6}
                vMin={0} vMax={2 * Math.PI} vSteps={12}
                color={PURPLE} strokeWidth={0.6} opacity={0.2}
              />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 6：总结 ── */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "60px 120px" }}>
          <div style={{ opacity: s6Op, width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ color: ACCENT, fontSize: 38, fontWeight: "bold", textAlign: "center", marginBottom: 12 }}>
              📝 本节总结
            </div>
            {[
              { c: ACCENT, t: "三重积分推广二重积分：积分区域从平面 D → 空间体 Ω，dσ → dV" },
              { c: ORANGE, t: "柱坐标：dV = r dr dθ dz；r 是 Jacobian——切向弧段 rΔθ 比 Δθ 更宽" },
              { c: PURPLE, t: "球坐标：dV = ρ²sinφ dρ dφ dθ；两方向各拉伸一次，积成 ρ²sinφ" },
              { c: GREEN, t: "坐标选择：看积分区域形状 + 被积函数对称性（圆柱选柱，球形选球）" },
              { c: YELLOW, t: "球体体积 V = 4πR³/3：三变量分离，三个独立一维积分的乘积" },
            ].map(({ c, t }, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 22px", borderRadius: 10,
                background: `${c}0e`, borderLeft: `4px solid ${c}`,
              }}>
                <span style={{ color: c, fontSize: 20, minWidth: 20, marginTop: 2 }}>•</span>
                <span style={{ color: TEXT, fontSize: 22, lineHeight: 1.65 }}>{t}</span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};

export default Sec03Triple;
