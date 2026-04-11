import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { SurfaceMesh3D } from '../../components/math/SurfaceMesh3D';
import { AnimatedVector3D } from '../../components/math/AnimatedVector3D';
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
const RED = '#ff5555';

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps { index: number; text: string; opacity: number; accentColor?: string }
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = ORANGE }) => (
  <div style={{ opacity, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 24, color: TEXT }}>
    <span style={{ color: accentColor, fontWeight: 'bold', minWidth: 28 }}>{index}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

interface StepRowProps { label: string; latex: string; note: string; opacity: number; accentColor?: string }
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = ORANGE }) => (
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
// 密度颜色可视化 SVG（Stage 5 左侧）
// 矩形板 [0,2]×[0,2]，密度 ρ=xy
// 质心位于 (4/3, 4/3) ≈ (1.33, 1.33)
// ─────────────────────────────────────────────────────────────────────────────
const DensityMapViz: React.FC<{ plateOp: number; gradOp: number; centroidOp: number; labelOp: number }> = ({
  plateOp, gradOp, centroidOp, labelOp,
}) => {
  const W = 540;
  const H = 520;
  // 板在 SVG 中的位置：左下角 (80, 440)，右上角 (480, 80)
  const LPAD = 80, BOT = 440;
  const SZ = 360; // 板的像素尺寸（对应物理 [0,2]×[0,2]）
  const SC = SZ / 2; // 像素/单位

  // 质心 (4/3, 4/3)
  const cx_phys = 4 / 3;
  const cy_phys = 4 / 3;
  const cx_svg = LPAD + cx_phys * SC;
  const cy_svg = BOT - cy_phys * SC;

  // 密度格子（20×20 网格，颜色编码 ρ=xy）
  const N = 10; // 网格数
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const xMid = (i + 0.5) * (2 / N);
      const yMid = (j + 0.5) * (2 / N);
      const density = xMid * yMid; // 0 to 4
      const alpha = density / 4;   // 0 to 1
      const svgX = LPAD + i * SC / N * 2;
      const svgY = BOT - (j + 1) * SC / N * 2;
      const cellW = SC * 2 / N;
      cells.push(
        <rect key={`${i}-${j}`}
          x={svgX} y={svgY} width={cellW} height={cellW}
          fill={ORANGE} opacity={alpha * 0.72}
        />
      );
    }
  }

  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="densityGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.05" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* 轴 */}
      <g opacity={plateOp}>
        <line x1={LPAD - 10} y1={BOT} x2={LPAD + SZ + 30} y2={BOT} stroke={FORMULA} strokeWidth={2} />
        <line x1={LPAD} y1={BOT + 10} x2={LPAD} y2={BOT - SZ - 30} stroke={FORMULA} strokeWidth={2} />
        <text x={LPAD + SZ + 36} y={BOT + 5} fill={FORMULA} fontSize={22} fontStyle="italic">x</text>
        <text x={LPAD - 16} y={BOT - SZ - 36} fill={FORMULA} fontSize={22} fontStyle="italic">y</text>
        <text x={LPAD - 24} y={BOT + 18} fill={TEXT} fontSize={18}>0</text>
        <text x={LPAD + SZ - 4} y={BOT + 18} fill={TEXT} fontSize={18}>2</text>
        <text x={LPAD - 24} y={BOT - SZ + 5} fill={TEXT} fontSize={18}>2</text>

        {/* 板轮廓 */}
        <rect x={LPAD} y={BOT - SZ} width={SZ} height={SZ}
          fill="none" stroke={FORMULA} strokeWidth={2} />
      </g>

      {/* 密度颜色格子 */}
      <g opacity={gradOp}>
        {cells}
        {/* 颜色说明 */}
        <rect x={LPAD + SZ + 18} y={BOT - SZ} width={22} height={SZ}
          fill="url(#densityGrad)" />
        <text x={LPAD + SZ + 44} y={BOT - SZ} fill={ORANGE} fontSize={17}>高密度</text>
        <text x={LPAD + SZ + 44} y={BOT + 3} fill={ACCENT} fontSize={17}>低密度</text>
        <text x={LPAD + SZ + 44} y={BOT - SZ / 2} fill={TEXT} fontSize={16}>ρ=xy</text>
      </g>

      {/* 质心标记 */}
      <g opacity={centroidOp}>
        <circle cx={cx_svg} cy={cy_svg} r={10} fill={RED} opacity={0.9} />
        <circle cx={cx_svg} cy={cy_svg} r={10} fill="none" stroke={FORMULA} strokeWidth={2} />
        {/* 虚线到轴 */}
        <line x1={cx_svg} y1={cy_svg} x2={cx_svg} y2={BOT} stroke={RED} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.6} />
        <line x1={cx_svg} y1={cy_svg} x2={LPAD} y2={cy_svg} stroke={RED} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.6} />
        {/* 坐标值 */}
        <text x={cx_svg - 4} y={BOT + 18} fill={RED} fontSize={18} textAnchor="middle">4/3</text>
        <text x={LPAD - 38} y={cy_svg + 6} fill={RED} fontSize={18}>4/3</text>
      </g>

      {/* 文字说明 */}
      <g opacity={labelOp}>
        <line x1={cx_svg + 12} y1={cy_svg - 8} x2={cx_svg + 80} y2={cy_svg - 70} stroke={RED} strokeWidth={1.5} strokeDasharray="4,3" />
        <rect x={cx_svg + 82} y={cy_svg - 120} width={220} height={58} rx={6} fill="#1e1e3a" stroke={RED} strokeWidth={1.5} />
        <text x={cx_svg + 94} y={cy_svg - 94} fill={RED} fontSize={19} fontWeight="bold">质心 (4/3, 4/3)</text>
        <text x={cx_svg + 94} y={cy_svg - 71} fill={TEXT} fontSize={16}>偏向右上角（高密度区）</text>
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：非均匀密度板质心计算
// 板：D = [0,2]×[0,2]，密度 ρ(x,y) = xy
// 质量：M = 4，质心：(x̄, ȳ) = (4/3, 4/3)
// ─────────────────────────────────────────────────────────────────────────────
const Ch10IMMass: React.FC = () => {
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

  // Stage 5：密度图渐入 + 3D 密度景观旋转
  const plateOp = interpolate(frame, [395, 420], [0, 1], clamp);
  const gradOp = interpolate(frame, [420, 450], [0, 1], clamp);
  const centroidOp = interpolate(frame, [450, 465], [0, 1], clamp);
  const labelOp = interpolate(frame, [465, 478], [0, 1], clamp);

  const rotateYDeg = interpolate(frame, [390, 480], [20, 380], clamp);
  const rotateY = rotateYDeg * Math.PI / 180;
  const surfOp = interpolate(frame, [405, 430], [0, 0.65], clamp);

  // 质心向量动画
  const vecProgress = interpolate(frame, [455, 475], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: ORANGE, fontSize: 26, fontFamily: 'monospace', marginBottom: 8 }}>
              第十章 · 智能制造应用案例 IM-01
            </div>
            <div style={{ color: FORMULA, fontSize: 48, fontWeight: 'bold' }}>非均匀材料的质量中心</div>
            <div style={{ color: TEXT, fontSize: 30, marginTop: 10 }}>
              密度分布 · 二重积分 · 质心公式
            </div>
          </div>
          <ExampleBox exampleNum="🔧" title="工程问题" width={1060} opacity={1} accentColor={ORANGE}>
            <div style={{ padding: '10px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: ORANGE }}>工程背景：</strong>
                一块金属板（铸造梯度合金），由于冷却不均匀，密度随位置变化：
              </div>
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('\\rho(x,y) = xy\\;\\text{（kg/m}^2\\text{）}') }} style={{ color: FORMULA, fontSize: 24 }} />
              </div>
              <div>
                <strong style={{ color: ACCENT }}>板的区域：</strong>
                正方形&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('D: 0\\leq x\\leq 2,\\; 0\\leq y\\leq 2') }} />（单位：m）
              </div>
              <div>
                <strong style={{ color: GREEN }}>目标：</strong>
                计算板的总质量 M 和质心坐标 <span dangerouslySetInnerHTML={{ __html: math('(\\bar{x},\\bar{y})') }} />，
                以确定安装支撑点位置
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold', marginBottom: 6 }}>📋 建模分析</div>
          <AnalysisItem index={1} opacity={fade(frame, 65, 15)} accentColor={ORANGE}
            text={`总质量：${math('M = \\iint_D\\rho(x,y)\\,dA = \\iint_D xy\\,dA')}（密度关于 x, y 均为线性增长）`} />
          <AnalysisItem index={2} opacity={fade(frame, 83, 15)} accentColor={PURPLE}
            text={`质心公式：${math('\\bar{x} = \\dfrac{1}{M}\\iint_D x\\cdot\\rho\\,dA')},&nbsp;${math('\\bar{y} = \\dfrac{1}{M}\\iint_D y\\cdot\\rho\\,dA')}`} />
          <AnalysisItem index={3} opacity={fade(frame, 101, 15)} accentColor={ACCENT}
            text={`密度 ρ=xy 关于 x, y 对称，由积分对称性得 ${math('\\bar{x}=\\bar{y}')}（只算一个）`} />
          <AnalysisItem index={4} opacity={fade(frame, 119, 15)} accentColor={GREEN}
            text="物理直觉：右上角 (2,2) 密度最大，质心偏向右上，不在几何中心 (1,1)" />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1"
            latex={"M = \\int_0^2\\int_0^2 xy\\,dx\\,dy = \\int_0^2 y\\left[\\frac{x^2}{2}\\right]_0^2\\!dy = \\int_0^2 2y\\,dy = \\left[y^2\\right]_0^2 = 4"}
            note="总质量 M=4 kg" opacity={step1Op} accentColor={ORANGE} />
          <StepRow label="Step 2"
            latex={"\\iint_D x\\cdot xy\\,dA = \\int_0^2\\int_0^2 x^2y\\,dx\\,dy = \\int_0^2 y\\!\\left[\\frac{x^3}{3}\\right]_0^2\\!dy = \\int_0^2\\frac{8y}{3}\\,dy = \\frac{16}{3}"}
            note="x 方向矩" opacity={step2Op} accentColor={PURPLE} />
          <StepRow label="Step 3"
            latex={"\\bar{x} = \\frac{1}{M}\\iint_D x\\cdot\\rho\\,dA = \\frac{16/3}{4} = \\frac{4}{3}"}
            note="由对称性 ȳ = 4/3" opacity={step3Op} accentColor={ACCENT} />
          <StepRow label="结果"
            latex={"\\bar{x} = \\bar{y} = \\frac{4}{3} \\approx 1.33\\,\\text{m}\\quad\\Rightarrow\\quad\\text{质心}\\left(\\frac{4}{3},\\,\\frac{4}{3}\\right)\\text{，偏向右上角}"}
            note="安装支撑点位置" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="质心计算结果" width={960} opacity={1}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ textAlign: 'center', fontSize: 40, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('\\bar{x} = \\bar{y} = \\dfrac{4}{3}', true) }} />
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', background: `${ORANGE}0f`, borderRadius: 8, fontSize: 20, color: TEXT, maxWidth: 380 }}>
                  <div style={{ color: ORANGE, fontWeight: 'bold', marginBottom: 6 }}>物理意义</div>
                  <div>在 (4/3, 4/3) 处支撑板，板保持平衡</div>
                  <div style={{ marginTop: 6 }}>比几何中心 (1,1) 偏向右上</div>
                  <div style={{ color: RED, marginTop: 6 }}>因为右上角密度最大（ρ=4），"拉力"最强</div>
                </div>
                <div style={{ padding: '14px 20px', background: `${PURPLE}0f`, borderRadius: 8, fontSize: 20, color: TEXT, maxWidth: 380 }}>
                  <div style={{ color: PURPLE, fontWeight: 'bold', marginBottom: 6 }}>工程意义</div>
                  <div>质量中心就是重心（匀重力场）</div>
                  <div style={{ marginTop: 6 }}>支撑点 ≠ 几何中心，偏移 = 1/3 m</div>
                  <div style={{ color: GREEN, marginTop: 6 }}>不均匀材料必须用积分精确计算</div>
                </div>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 密度可视化 + 3D 密度景观 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 36, padding: '30px 60px' }}>
          {/* 左侧：2D 密度颜色图 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ color: ORANGE, fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
              密度分布 ρ(x,y)=xy
            </div>
            <DensityMapViz plateOp={plateOp} gradOp={gradOp} centroidOp={centroidOp} labelOp={labelOp} />
          </div>

          {/* 右侧：3D 密度景观 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ color: ORANGE, fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
              密度曲面 z=xy（3D 景观）
            </div>
            <CoordinateSystem3D
              center={[330, 290]}
              scale={65}
              xRange={[-0.3, 2.5]} yRange={[-0.3, 2.5]} zRange={[0, 4.5]}
              showGrid width={660} height={520}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 密度曲面 z = xy */}
              <SurfaceMesh3D
                x={(u, _v) => u} y={(_u, v) => v} z={(u, v) => u * v}
                uMin={0} uMax={2} uSteps={10}
                vMin={0} vMax={2} vSteps={10}
                color={ORANGE} strokeWidth={1} opacity={surfOp}
              />
              {/* 底部正方形区域 */}
              <SurfaceMesh3D
                x={(u, _v) => u} y={(_u, v) => v} z={(_u, _v) => 0}
                uMin={0} uMax={2} uSteps={4}
                vMin={0} vMax={2} vSteps={4}
                color={ACCENT} strokeWidth={0.8} opacity={surfOp * 0.35}
              />
              {/* 质心位置向量（从底部到曲面） */}
              <AnimatedVector3D
                from={[4 / 3, 4 / 3, 0]}
                to={[4 / 3, 4 / 3, 4 / 3 * 4 / 3]}
                color={RED} strokeWidth={3}
                drawProgress={vecProgress}
                label="质心"
                opacity={vecProgress > 0.1 ? 1 : 0}
              />
            </CoordinateSystem3D>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { color: ORANGE, label: '密度曲面 z=xy' },
                { color: ACCENT, label: '正方形板 D' },
                { color: RED, label: '质心竖轴 (4/3, 4/3)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 1020, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold' }}>📝 工程应用总结</div>
          <div style={{ background: `${ORANGE}08`, borderRadius: 12, padding: '28px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ORANGE }}>① 质心是加权平均位置：</span>
                密度大的区域权重大，把质心"拉"向自己
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: PURPLE }}>② 平衡点直觉：</span>
                如果在质心处用单点支撑，板保持水平平衡；在任何其他点支撑都会倾斜
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>③ 对称性利用：</span>
                ρ(x,y)=xy 关于 x↔y 对称，直接得&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('\\bar{x}=\\bar{y}') }} />，节省一半计算量
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ACCENT }}>④ 3D 密度景观：</span>
                密度曲面 z=xy 在 (2,2) 处最高（z=4），在原点处最低（z=0）
              </div>
              <div>
                <span style={{ color: RED }}>⑤ 工程决策依据：</span>
                计算质心坐标&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('(\\bar{x},\\bar{y})=(4/3, 4/3)') }} />
                &nbsp;确定安装位置，避免结构失衡
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
const WCh10IMMass = withWatermark(Ch10IMMass);
export default WCh10IMMass;
