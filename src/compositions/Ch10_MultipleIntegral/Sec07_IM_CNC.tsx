import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { SurfaceMesh3D } from '../../components/math/SurfaceMesh3D';
import { withWatermark } from '../../components/ui/Watermark';

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (f: number, start: number, duration = 20): number =>
  interpolate(f, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const math = (latex: string, display = false): string =>
  katex.renderToString(latex, { throwOnError: false, displayMode: display });

// ─────────────────────────────────────────────────────────────────────────────
// 颜色常量
// ─────────────────────────────────────────────────────────────────────────────
const BG = COLORS.background;
const ACCENT = COLORS.primaryCurve ?? '#61dafb';
const TEXT = COLORS.annotation ?? '#94a3b8';
const FORMULA = COLORS.formula ?? '#f8f8f2';
const PURPLE = '#bd93f9';
const GREEN = '#50fa7b';
const YELLOW = '#f1fa8c';
const ORANGE = '#ffb86c';
const CYAN = '#8be9fd';
const GRAY = '#8899aa';
const RED = '#ff5555';

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps { index: number; text: string; opacity: number; accentColor?: string }
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = CYAN }) => (
  <div style={{ opacity, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 24, color: TEXT }}>
    <span style={{ color: accentColor, fontWeight: 'bold', minWidth: 28 }}>{index}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

interface StepRowProps { label: string; latex: string; note: string; opacity: number; accentColor?: string }
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = CYAN }) => (
  <div style={{
    opacity, display: 'flex', alignItems: 'center', gap: 16,
    padding: '11px 18px', background: `${accentColor}0d`, borderRadius: 8, borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ color: accentColor, fontSize: 19, minWidth: 76, fontWeight: 'bold' }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 19, flex: 1 }} dangerouslySetInnerHTML={{ __html: math(latex) }} />
    <span style={{ color: TEXT, fontSize: 16, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：数控铣削加工材料去除量计算
// 毛坯面：z = 4-r²（上方抛物面，灰色）
// 成品面：z = r²（下方抛物面，蓝色）
// 去除体积：V = ∫₀^(2π)∫₀^√2 r(4-2r²)dr dθ = 4π
// ─────────────────────────────────────────────────────────────────────────────
const Ch10IMCNC: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  const s1Op = fade(frame, 0, 30);
  const s2Op = fade(frame, 60, 20);
  const s3Op = fade(frame, 150, 20);
  const step1Op = fade(frame, 150, 20);
  const step2Op = fade(frame, 195, 20);
  const step3Op = fade(frame, 240, 20);
  const step4Op = fade(frame, 285, 20);
  const s4Op = fade(frame, 330, 25);
  const s5Op = fade(frame, 390, 30);
  const s6Op = fade(frame, 480, 25);

  // Stage 5：旋转 + 渐入动画
  const rotateYDeg = interpolate(frame, [390, 480], [15, 375], clamp);
  const rotateY = rotateYDeg * Math.PI / 180;

  // 三个表面分步渐入
  const blankSurfOp = interpolate(frame, [395, 418], [0, 0.50], clamp);   // 毛坯（灰）
  const finishedSurfOp = interpolate(frame, [415, 438], [0, 0.55], clamp); // 成品（蓝）
  const removedOp = interpolate(frame, [435, 460], [0, 0.38], clamp);     // 去除区域（红）

  const SQRT2 = Math.sqrt(2);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: CYAN, fontSize: 26, fontFamily: 'monospace', marginBottom: 8 }}>
              第十章 · 智能制造应用案例 IM-02
            </div>
            <div style={{ color: FORMULA, fontSize: 48, fontWeight: 'bold' }}>数控铣削材料去除量计算</div>
            <div style={{ color: TEXT, fontSize: 30, marginTop: 10 }}>
              三重积分 · 柱坐标 · 两曲面围成体积
            </div>
          </div>
          <ExampleBox exampleNum="🏭" title="工程问题" width={1080} opacity={1} accentColor={CYAN}>
            <div style={{ padding: '10px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: CYAN }}>工程背景：</strong>
                数控铣床加工一个碗形零件，刀具路径使毛坯上、下两个抛物面形状的曲面被去除。
              </div>
              <div>
                <strong style={{ color: GRAY }}>毛坯上表面（灰）：</strong>
                <span dangerouslySetInnerHTML={{ __html: math('z = 4-x^2-y^2') }} />
              </div>
              <div>
                <strong style={{ color: ACCENT }}>成品下表面（蓝）：</strong>
                <span dangerouslySetInnerHTML={{ __html: math('z = x^2+y^2') }} />
              </div>
              <div>
                <strong style={{ color: RED }}>去除材料（红区域）：</strong>
                两曲面之间的体积即为被铣削的材料，用三重积分计算：
                <span dangerouslySetInnerHTML={{ __html: math('V_{\\text{去除}} = \\iiint_\\Omega dV') }} />
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 建模分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: CYAN, fontSize: 32, fontWeight: 'bold', marginBottom: 6 }}>📋 建模分析</div>
          <AnalysisItem index={1} opacity={fade(frame, 65, 15)} accentColor={CYAN}
            text={`两曲面交线：${math('4-r^2=r^2 \\Rightarrow r=\\sqrt{2}')}，交线圆在 z=2 处`} />
          <AnalysisItem index={2} opacity={fade(frame, 83, 15)} accentColor={ACCENT}
            text={`柱坐标：${math('dV=r\\,dr\\,d\\theta\\,dz')}；z 范围：${math('r^2 \\leq z \\leq 4-r^2')}；r 范围：${math('0\\leq r\\leq\\sqrt{2}')}`} />
          <AnalysisItem index={3} opacity={fade(frame, 101, 15)} accentColor={ORANGE}
            text={`先对 z 积分：${math('\\int_{r^2}^{4-r^2}dz = 4-2r^2')}（上下曲面高度差），随 r 增大而减小`} />
          <AnalysisItem index={4} opacity={fade(frame, 119, 15)} accentColor={GREEN}
            text={`结构对称：θ 从 0 到 2π，积分得 2π；加工体积确定后乘材料密度得去除质量`} />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: CYAN, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算（柱坐标）</div>
          <StepRow label="Step 1"
            latex={"V = \\int_0^{2\\pi}d\\theta\\int_0^{\\sqrt{2}}r\\,dr\\int_{r^2}^{4-r^2}dz"}
            note="柱坐标三重积分" opacity={step1Op} accentColor={CYAN} />
          <StepRow label="Step 2"
            latex={"= 2\\pi\\int_0^{\\sqrt{2}}r(4-2r^2)\\,dr = 2\\pi\\int_0^{\\sqrt{2}}(4r-2r^3)\\,dr"}
            note="先积 z，θ 积得 2π" opacity={step2Op} accentColor={ACCENT} />
          <StepRow label="Step 3"
            latex={"= 2\\pi\\left[2r^2-\\frac{r^4}{2}\\right]_0^{\\sqrt{2}} = 2\\pi(4-2) = 4\\pi"}
            note="代入 r=√2" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="结果"
            latex={"V_{\\text{去除}} = 4\\pi \\approx 12.57\\,\\text{cm}^3,\\quad m = 7.8\\times 12.57 \\approx 98\\,\\text{g}\\;(\\text{钢})"}
            note="密度×体积=质量" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="材料去除量" width={960} opacity={1}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ textAlign: 'center', fontSize: 40, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('V = 4\\pi \\approx 12.57\\,\\text{cm}^3', true) }} />
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', background: `${GRAY}14`, borderRadius: 8, fontSize: 20, color: TEXT, maxWidth: 360, borderLeft: `3px solid ${GRAY}` }}>
                  <div style={{ color: GRAY, fontWeight: 'bold', marginBottom: 6 }}>毛坯上表面</div>
                  <span dangerouslySetInnerHTML={{ __html: math('z = 4-x^2-y^2') }} />
                  <div style={{ color: TEXT, marginTop: 4 }}>加工前零件顶面形状</div>
                </div>
                <div style={{ padding: '14px 20px', background: `${ACCENT}10`, borderRadius: 8, fontSize: 20, color: TEXT, maxWidth: 360, borderLeft: `3px solid ${ACCENT}` }}>
                  <div style={{ color: ACCENT, fontWeight: 'bold', marginBottom: 6 }}>成品下表面</div>
                  <span dangerouslySetInnerHTML={{ __html: math('z = x^2+y^2') }} />
                  <div style={{ color: TEXT, marginTop: 4 }}>铣削完成后的底面形状</div>
                </div>
              </div>
              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 20, color: TEXT }}>
                去除质量（钢 ρ=7.8 g/cm³）：
                <span style={{ color: YELLOW }} dangerouslySetInnerHTML={{ __html: math('\\approx 98\\,\\text{g}') }} />
                →用于估算成本和刀具寿命
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 3D 可视化（毛坯灰 / 成品蓝 / 去除红） ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: CYAN, fontSize: 28, fontWeight: 'bold' }}>
            🌐 3D 可视化：毛坯面 vs 成品面 vs 去除区域
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              center={[380, 310]}
              scale={65}
              xRange={[-2.5, 2.5]} yRange={[-2.5, 2.5]} zRange={[0, 4.5]}
              showGrid width={760} height={580}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* ① 毛坯上表面：z=4-r²（灰色） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)} y={(u, v) => u * Math.sin(v)} z={(u, _v) => 4 - u * u}
                uMin={0} uMax={SQRT2} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={GRAY} strokeWidth={1} opacity={blankSurfOp}
              />
              {/* ② 成品下表面：z=r²（蓝色） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)} y={(u, v) => u * Math.sin(v)} z={(u, _v) => u * u}
                uMin={0} uMax={SQRT2} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={ACCENT} strokeWidth={1} opacity={finishedSurfOp}
              />
              {/* ③ 去除区域侧壁（圆柱面 r=√2，z从r²=2到4-r²=2，退化为一圈线）
                  用半径稍大于√2的圆柱壁暗示材料去除边界 */}
              <SurfaceMesh3D
                x={(_u, v) => SQRT2 * Math.cos(v)} y={(_u, v) => SQRT2 * Math.sin(v)} z={(u, _v) => u * u + (2 - u * u) * u}
                uMin={0} uMax={SQRT2} uSteps={8}
                vMin={0} vMax={2 * Math.PI} vSteps={28}
                color={RED} strokeWidth={1.5} opacity={removedOp}
              />
              {/* ③b 中间填充体（去除区域体积感） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)} y={(u, v) => u * Math.sin(v)} z={(u, _v) => (u * u + 4 - u * u) / 2}
                uMin={0} uMax={SQRT2} uSteps={8}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={RED} strokeWidth={0.6} opacity={removedOp * 0.4}
              />
              {/* ④ 交线圆：r=√2，z=2 */}
              <SurfaceMesh3D
                x={(_u, v) => SQRT2 * Math.cos(v)} y={(_u, v) => SQRT2 * Math.sin(v)} z={(_u, _v) => 2}
                uMin={0} uMax={1} uSteps={1}
                vMin={0} vMax={2 * Math.PI} vSteps={32}
                color={YELLOW} strokeWidth={2.5} opacity={0.9}
              />
            </CoordinateSystem3D>

            {/* 图例 + 说明 */}
            <div style={{ width: 310, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 40 }}>
              <div style={{ fontSize: 21, color: CYAN, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: GRAY, label: '毛坯上表面 z=4-r²（灰）' },
                { color: ACCENT, label: '成品下表面 z=r²（蓝）' },
                { color: RED, label: '被去除材料区域（红）' },
                { color: YELLOW, label: '交线圆 r=√2, z=2' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: TEXT }}>
                  <div style={{ width: 22, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}

              <div style={{ marginTop: 12, padding: '14px 16px', background: `${RED}0f`, borderRadius: 8, border: `1px solid ${RED}33`, fontSize: 19, color: TEXT, lineHeight: 1.75 }}>
                <div style={{ color: RED, fontWeight: 'bold', marginBottom: 6 }}>Polanyi 直觉</div>
                <div>红色区域 = 被铣掉的材料</div>
                <div style={{ marginTop: 6 }}>任意点 (r,θ)，铣削深度 = <span dangerouslySetInnerHTML={{ __html: math('(4-r^2)-r^2 = 4-2r^2') }} /></div>
                <div style={{ marginTop: 6, color: ORANGE }}>轴心处（r=0）最深（4单位）</div>
                <div style={{ color: GRAY }}>边缘（r=√2）处深度=0（两面相切）</div>
              </div>

              <div style={{ padding: '12px 16px', background: `${CYAN}0a`, borderRadius: 8, fontSize: 18, color: TEXT, lineHeight: 1.7 }}>
                <div style={{ color: CYAN, marginBottom: 4, fontWeight: 'bold' }}>工程流程</div>
                <div>建立曲面方程</div>
                <div>→ 柱坐标三重积分</div>
                <div>→ 去除体积 = 4π cm³</div>
                <div>→ × 材料密度 = 质量</div>
                <div style={{ color: YELLOW, marginTop: 6 }}>→ 估算成本与刀具寿命</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 1020, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: CYAN, fontSize: 32, fontWeight: 'bold' }}>📝 工程应用总结</div>
          <div style={{ background: `${CYAN}08`, borderRadius: 12, padding: '28px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: CYAN }}>① 柱坐标优势：</span>
                旋转对称铸件/铣件，θ 积分直接得 2π，大幅简化计算
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ORANGE }}>② 积分顺序选择：</span>
                先对 z 积分（上下面之差 4-2r²），立即消去 z，降为二重积分
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: RED }}>③ 去除量可视化：</span>
                毛坯面（灰）与成品面（蓝）之间的体积 = 红色区域 = 被铣削材料
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>④ 物理直觉：</span>
                铣削深度 4-2r² 在轴心（r=0）最大（=4），边缘（r=√2）为零——体现曲面相交的几何意义
              </div>
              <div>
                <span style={{ color: PURPLE }}>⑤ 扩展到复杂形状：</span>
                若曲面由 CAD 建模，同一框架（数值三重积分）仍适用，原理不变
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Watermark HOC（模块顶层定义）
// ─────────────────────────────────────────────────────────────────────────────
const WCh10IMCNC = withWatermark(Ch10IMCNC);
export default WCh10IMCNC;
