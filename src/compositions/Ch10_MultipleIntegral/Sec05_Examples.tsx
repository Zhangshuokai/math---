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
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = ACCENT }) => (
  <div style={{ opacity, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 24, color: TEXT }}>
    <span style={{ color: accentColor, fontWeight: 'bold', minWidth: 28 }}>{index}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

interface StepRowProps { label: string; latex: string; note: string; opacity: number; accentColor?: string }
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = ACCENT }) => (
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
// 极坐标网格 SVG（用于 Example 1 Stage 5）
// 展示：四分之一圆盘上的极坐标网格，标注 dA = r dr dθ
// ─────────────────────────────────────────────────────────────────────────────
const PolarGridViz: React.FC<{ gridOp: number; cellOp: number; labelOp: number }> = ({ gridOp, cellOp, labelOp }) => {
  const W = 720;
  const H = 560;
  const cx = 110;   // 极点 x
  const cy = H - 80; // 极点 y（底部）
  const SC = 210;    // 每单位 px

  // 四分之一圆盘背景
  const qCircle = `M ${cx},${cy} L ${cx + 2 * SC},${cy} A ${2 * SC},${2 * SC} 0 0,0 ${cx},${cy - 2 * SC} Z`;

  // 同心弧 r=0.5,1,1.5,2
  const radii = [0.5, 1, 1.5, 2];

  // 放射线 θ=0,π/6,π/3,π/2
  const thetas = [0, Math.PI / 6, Math.PI / 3, Math.PI / 2];

  // 高亮单元格：r ∈ [1, 1.5], θ ∈ [π/6, π/3]
  const r1 = 1, r2 = 1.5, t1 = Math.PI / 6, t2 = Math.PI / 3;
  const r1s = r1 * SC, r2s = r2 * SC;
  const cellPath = [
    `M ${cx + r1s * Math.cos(t1)},${cy - r1s * Math.sin(t1)}`,
    `L ${cx + r2s * Math.cos(t1)},${cy - r2s * Math.sin(t1)}`,
    `A ${r2s},${r2s} 0 0,0 ${cx + r2s * Math.cos(t2)},${cy - r2s * Math.sin(t2)}`,
    `L ${cx + r1s * Math.cos(t2)},${cy - r1s * Math.sin(t2)}`,
    `A ${r1s},${r1s} 0 0,1 ${cx + r1s * Math.cos(t1)},${cy - r1s * Math.sin(t1)}`,
    'Z',
  ].join(' ');

  // 单元格中心坐标（用于标注）
  const rMid = (r1 + r2) / 2 * SC;
  const tMid = (t1 + t2) / 2;
  const cellCx = cx + rMid * Math.cos(tMid);
  const cellCy = cy - rMid * Math.sin(tMid);

  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      {/* 四分之一圆盘背景 */}
      <g opacity={gridOp}>
        <path d={qCircle} fill={ACCENT} opacity={0.08} />
        <path d={qCircle} fill="none" stroke={ACCENT} strokeWidth={2.5} />

        {/* 同心弧 */}
        {radii.map(r => {
          const rs = r * SC;
          return (
            <g key={r}>
              <path
                d={`M ${cx + rs},${cy} A ${rs},${rs} 0 0,0 ${cx},${cy - rs}`}
                fill="none" stroke={ACCENT}
                strokeWidth={r === 2 ? 2 : 1}
                strokeDasharray={r < 2 ? '5,4' : ''}
                opacity={0.65}
              />
              {/* r 标注 */}
              <text x={cx + rs + 6} y={cy + 20} fill={ACCENT} fontSize={16} opacity={0.9}>
                r={r}
              </text>
            </g>
          );
        })}

        {/* 放射线 */}
        {thetas.map(theta => (
          <line key={theta}
            x1={cx} y1={cy}
            x2={cx + 2 * SC * Math.cos(theta)}
            y2={cy - 2 * SC * Math.sin(theta)}
            stroke={ACCENT}
            strokeWidth={theta === 0 || theta === Math.PI / 2 ? 2 : 1}
            strokeDasharray={theta > 0 && theta < Math.PI / 2 ? '5,4' : ''}
            opacity={0.65}
          />
        ))}

        {/* 轴标注 */}
        <text x={cx + 2 * SC + 12} y={cy + 5} fill={FORMULA} fontSize={20}>x</text>
        <text x={cx - 20} y={cy - 2 * SC - 10} fill={FORMULA} fontSize={20}>y</text>
        <text x={cx - 35} y={cy + 20} fill={FORMULA} fontSize={18}>O</text>
      </g>

      {/* 高亮单元格 */}
      <g opacity={cellOp}>
        <path d={cellPath} fill={ORANGE} opacity={0.38} />
        <path d={cellPath} fill="none" stroke={ORANGE} strokeWidth={2.5} />
        {/* Δr 标注 */}
        <line
          x1={cx + r1s * Math.cos(t1)} y1={cy - r1s * Math.sin(t1)}
          x2={cx + r2s * Math.cos(t1)} y2={cy - r2s * Math.sin(t1)}
          stroke={YELLOW} strokeWidth={2.5}
        />
        <text x={cx + (r1s + r2s) / 2 * Math.cos(t1) - 30} y={cy - (r1s + r2s) / 2 * Math.sin(t1)} fill={YELLOW} fontSize={17}>Δr</text>
        {/* 弧长标注 */}
        <text x={cx + r2s * Math.cos(tMid) + 6} y={cy - r2s * Math.sin(tMid)} fill={ORANGE} fontSize={18}>r·Δθ</text>
      </g>

      {/* dA 说明标注 */}
      <g opacity={labelOp}>
        <line x1={cellCx} y1={cellCy} x2={cellCx + 130} y2={cellCy - 80} stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4,3" />
        <rect x={cellCx + 132} y={cellCy - 130} width={280} height={56} rx={6} fill="#1e1e3a" stroke={ORANGE} strokeWidth={1.5} />
        <text x={cellCx + 145} y={cellCy - 106} fill={ORANGE} fontSize={20} fontWeight="bold">
          dA = r · dr · dθ
        </text>
        <text x={cellCx + 145} y={cellCy - 82} fill={TEXT} fontSize={16}>
          ← 面积元素，不是 dr dθ！
        </text>
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Example 1（全局帧 0–539）：水坝截面面积 — 极坐标二重积分
// D: x²+y²≤4, x≥0, y≥0（四分之一圆盘）
// ∬_D dA = ∫₀^(π/2) ∫₀^2 r dr dθ = π
// ─────────────────────────────────────────────────────────────────────────────
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
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

  // Stage 5：极坐标网格动画
  const gridOp = interpolate(frame, [395, 425], [0, 1], clamp);
  const cellOp = interpolate(frame, [430, 455], [0, 1], clamp);
  const labelOp = interpolate(frame, [455, 475], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十章 · 重积分 · 例题 1 / 3
          </div>
          <ExampleBox exampleNum="例1" title="水坝截面面积（极坐标）" width={1020} opacity={1} accentColor={ACCENT}>
            <div style={{ padding: '12px 0', fontSize: 24, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: ACCENT }}>工程背景：</strong>
                某水坝截面形状为四分之一圆盘，区域为
              </div>
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('D:\\; x^2+y^2\\leq 4,\\; x\\geq 0,\\; y\\geq 0') }} />
                &nbsp;（单位：m）
              </div>
              <div>用极坐标计算截面面积：</div>
              <div style={{ textAlign: 'center', fontSize: 28, margin: '12px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('A = \\iint_D dA', true) }} />
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 6 }}>📋 审题分析</div>
          <AnalysisItem index={1} opacity={fade(frame, 65, 15)} accentColor={ACCENT}
            text="积分区域 D 是以原点为圆心、半径 2 的<strong style='color:#61dafb'>四分之一圆盘</strong>，高度对称，适合极坐标" />
          <AnalysisItem index={2} opacity={fade(frame, 83, 15)} accentColor={PURPLE}
            text={`极坐标变换：${math('x=r\\cos\\theta')},&nbsp;${math('y=r\\sin\\theta')},&nbsp;面积元 ${math('dA = r\\,dr\\,d\\theta')}（注意 r！）`} />
          <AnalysisItem index={3} opacity={fade(frame, 101, 15)} accentColor={GREEN}
            text={`积分范围：${math('r\\in[0,2]')},&nbsp;${math('\\theta\\in[0,\\pi/2]')}（第一象限，x≥0,y≥0）`} />
          <AnalysisItem index={4} opacity={fade(frame, 119, 15)} accentColor={YELLOW}
            text="被积函数 f=1（只求面积），乘上面积元 dA = r dr dθ，积分极为简洁" />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1100, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1"
            latex={"A = \\iint_D dA = \\int_0^{\\pi/2}d\\theta\\int_0^2 r\\,dr"}
            note="极坐标变换，dA = r dr dθ" opacity={step1Op} accentColor={ACCENT} />
          <StepRow label="Step 2"
            latex={"= \\int_0^{\\pi/2}d\\theta \\cdot \\left[\\frac{r^2}{2}\\right]_0^2 = \\int_0^{\\pi/2} 2\\,d\\theta"}
            note="先对 r 积分" opacity={step2Op} accentColor={PURPLE} />
          <StepRow label="Step 3"
            latex={"= 2 \\cdot \\frac{\\pi}{2} = \\pi"}
            note="再对 θ 积分" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="验证"
            latex={"\\text{半径 }R=2\\text{ 整圆面积}=\\pi R^2=4\\pi\\text{，四分之一} = \\pi\\checkmark"}
            note="与几何结果吻合" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="例1 计算结果" width={900} opacity={1}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('A = \\pi \\approx 3.14\\,\\text{m}^2', true) }} />
              <div style={{ fontSize: 22, color: TEXT, marginTop: 16 }}>
                极坐标积分：
                <span dangerouslySetInnerHTML={{ __html: math('\\int_0^{\\pi/2}\\!d\\theta \\int_0^2 r\\,dr') }} />
                &nbsp;= 分离变量 → 两个独立积分相乘
              </div>
              <div style={{ marginTop: 14, padding: '12px 24px', background: `${ACCENT}0f`, borderRadius: 8 }}>
                <div style={{ color: ORANGE, fontSize: 22, fontWeight: 'bold' }}>核心要点：</div>
                <div style={{ color: TEXT, fontSize: 20, marginTop: 6 }}>
                  面积元素 dA = <span style={{ color: ORANGE }} dangerouslySetInnerHTML={{ __html: math('r') }} /> dr dθ，
                  其中 r 是 Jacobian——极坐标的"拉伸因子"
                </div>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 极坐标网格 Polanyi 可视化 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold' }}>
            🔍 Polanyi 直觉：极坐标网格为何面积元 = r dr dθ？
          </div>
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            <PolarGridViz gridOp={gridOp} cellOp={cellOp} labelOp={labelOp} />
            <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ opacity: gridOp, fontSize: 22, color: TEXT, lineHeight: 1.8 }}>
                <span style={{ color: ACCENT, fontWeight: 'bold' }}>极坐标网格</span>覆盖四分之一圆盘：<br />
                圆弧线（r=const）<br />
                放射线（θ=const）
              </div>
              <div style={{ opacity: cellOp, padding: '12px 16px', background: `${ORANGE}0f`, borderRadius: 8, border: `1px solid ${ORANGE}44` }}>
                <div style={{ color: ORANGE, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>一个网格单元</div>
                <div style={{ fontSize: 19, color: TEXT, lineHeight: 1.8 }}>
                  径向边长：Δr<br />
                  切向弧长：<span style={{ color: ORANGE }} dangerouslySetInnerHTML={{ __html: math('r\\cdot\\Delta\\theta') }} /><br />
                  单元面积：
                  <span style={{ color: ORANGE }} dangerouslySetInnerHTML={{ __html: math('r\\cdot\\Delta r\\cdot\\Delta\\theta') }} />
                </div>
              </div>
              <div style={{ opacity: labelOp, padding: '12px 16px', background: `${PURPLE}0f`, borderRadius: 8, border: `1px solid ${PURPLE}44`, fontSize: 19, color: TEXT, lineHeight: 1.7 }}>
                <span style={{ color: PURPLE, fontWeight: 'bold' }}>关键直觉：</span><br />
                靠近原点时 r 小，弧段短，格子小<br />
                远离原点时 r 大，弧段长，格子大<br />
                → 积分需要 r 来"补偿"这个拉伸
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 极坐标变换总结</div>
          <div style={{ background: `${ACCENT}0a`, borderRadius: 12, padding: '28px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}><span style={{ color: ACCENT }}>① 适用条件：</span>区域为圆/扇形，或被积函数含 x²+y²</div>
              <div style={{ marginBottom: 10 }}><span style={{ color: GREEN }}>② 关键变换：</span>
                <span dangerouslySetInnerHTML={{ __html: math('dA = r\\,dr\\,d\\theta') }} />（r 是 Jacobian，切向弧长 rΔθ 的贡献）
              </div>
              <div style={{ marginBottom: 10 }}><span style={{ color: ORANGE }}>③ 本题要点：</span>f=1（求面积），两重积分直接分离，结果 = π = 半圆面积 πR²/2 的一半</div>
              <div><span style={{ color: YELLOW }}>④ Polanyi 直觉：</span>极坐标网格小格面积 = r·Δr·Δθ，r 越大格子越大，这正是 Jacobian 的几何含义</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Example 2（全局帧 540–1079）：抛物面与平面围成固体的质量
// Ω: z=x²+y²（下）到 z=4（上），ρ=1
// 柱坐标：M = ∫₀^(2π) ∫₀^2 r(4-r²) dr dθ = 8π
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 540;
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 195, 20);
  const step3Op = fade(lf, 240, 20);
  const step4Op = fade(lf, 285, 20);
  const s4Op = fade(lf, 330, 25);
  const s5Op = fade(lf, 390, 30);
  const s6Op = fade(lf, 480, 25);

  // Stage 5：3D 可视化 + 切片动画（全局帧 930-1020）
  const rotateYDeg = interpolate(frame, [930, 1020], [20, 380], clamp);
  const rotateY = rotateYDeg * Math.PI / 180;

  // 竖直切片线动画：从 z=r² 延伸到 z=4（在 r=1, θ=0 处）
  const sliceProgress = interpolate(frame, [940, 970], [0, 1], clamp);
  const topSurfOp = interpolate(frame, [395 + 540, 420 + 540], [0, 0.45], clamp);
  const botSurfOp = interpolate(frame, [415 + 540, 440 + 540], [0, 0.4], clamp);

  const SQRT2 = Math.sqrt(2);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: PURPLE, fontSize: 26, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十章 · 重积分 · 例题 2 / 3
          </div>
          <ExampleBox exampleNum="例2" title="曲面围成固体质量（柱坐标）" width={1040} opacity={1} accentColor={PURPLE}>
            <div style={{ padding: '12px 0', fontSize: 24, color: TEXT, lineHeight: 1.9 }}>
              <div>均匀固体（密度 ρ=1）由以下两曲面围成：</div>
              <div style={{ margin: '8px 0' }}>
                下方：<span dangerouslySetInnerHTML={{ __html: math('z = x^2+y^2') }} />（旋转抛物面），
                上方：<span dangerouslySetInnerHTML={{ __html: math('z = 4') }} />（水平面）
              </div>
              <div>求固体质量：</div>
              <div style={{ textAlign: 'center', fontSize: 28, margin: '12px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('M = \\iiint_\\Omega\\rho\\,dV = \\iiint_\\Omega dV', true) }} />
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: PURPLE, fontSize: 32, fontWeight: 'bold', marginBottom: 6 }}>📋 审题分析</div>
          <AnalysisItem index={1} opacity={fade(lf, 65, 15)} accentColor={PURPLE}
            text={`两曲面交线：令 ${math('z=x^2+y^2=4')}，得 ${math('x^2+y^2=4')}（半径2圆柱的截面）`} />
          <AnalysisItem index={2} opacity={fade(lf, 83, 15)} accentColor={ACCENT}
            text={`柱坐标：${math('x=r\\cos\\theta')},&nbsp;${math('y=r\\sin\\theta')},&nbsp;z=z,&nbsp;体积元 ${math('dV=r\\,dr\\,d\\theta\\,dz')}`} />
          <AnalysisItem index={3} opacity={fade(lf, 101, 15)} accentColor={ORANGE}
            text={`z 的范围：从 ${math('z=r^2')}（抛物面）到 ${math('z=4')}（平面）；r 从 0 到 2；θ 全圆`} />
          <AnalysisItem index={4} opacity={fade(lf, 119, 15)} accentColor={GREEN}
            text="积分顺序：先对 z 积分（最简单），上下曲面之差 = 4-r²，然后再对 r 和 θ" />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: PURPLE, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow label="Step 1"
            latex={"M = \\int_0^{2\\pi}d\\theta\\int_0^2 r\\,dr\\int_{r^2}^4 dz"}
            note="柱坐标，z 从 r² 到 4" opacity={step1Op} accentColor={PURPLE} />
          <StepRow label="Step 2"
            latex={"= 2\\pi\\int_0^2 r(4-r^2)\\,dr = 2\\pi\\int_0^2 (4r-r^3)\\,dr"}
            note="先对 z 积分，θ 积分得 2π" opacity={step2Op} accentColor={ACCENT} />
          <StepRow label="Step 3"
            latex={"= 2\\pi\\left[2r^2 - \\frac{r^4}{4}\\right]_0^2 = 2\\pi(8-4) = 8\\pi"}
            note="Newton-Leibniz 公式" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="结果"
            latex={"M = 8\\pi \\approx 25.1\\text{ kg（密度}\\rho=1\\text{ kg/m}^3\\text{）}"}
            note="最终质量" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="例2 计算结果" width={900} opacity={1}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 40, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('M = 8\\pi', true) }} />
              <div style={{ fontSize: 22, color: TEXT, marginTop: 14, lineHeight: 1.7 }}>
                柱坐标将三重积分化简为二重积分：<br />
                先积 z（上下曲面之差），再积 r 和 θ
              </div>
              <div style={{ marginTop: 14, padding: '12px 24px', background: `${PURPLE}10`, borderRadius: 8, textAlign: 'left' }}>
                <span style={{ color: ORANGE, fontWeight: 'bold' }}>Polanyi 切片直觉：</span>
                <span style={{ color: TEXT, fontSize: 20 }}> 固定 (x,y)，z 从 x²+y² 积到 4，这根"竖直线段"就是 z 方向的一薄层——高度因 (x,y) 位置而异！</span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 3D 切片可视化 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: PURPLE, fontSize: 28, fontWeight: 'bold' }}>
            🌐 3D 可视化：两曲面围成区域 + z 方向切片
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              center={[380, 320]}
              scale={65}
              xRange={[-2.5, 2.5]} yRange={[-2.5, 2.5]} zRange={[0, 4.5]}
              showGrid width={760} height={580}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 上方平面 z=4（蓝色） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)} y={(u, v) => u * Math.sin(v)} z={(_u, _v) => 4}
                uMin={0} uMax={2} uSteps={8}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={ACCENT} strokeWidth={0.9} opacity={topSurfOp}
              />
              {/* 下方抛物面 z=r²（紫色） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)} y={(u, v) => u * Math.sin(v)} z={(u, _v) => u * u}
                uMin={0} uMax={2} uSteps={10}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={PURPLE} strokeWidth={0.9} opacity={botSurfOp}
              />
              {/* 交线圆（r=2，z=4） */}
              <SurfaceMesh3D
                x={(_u, v) => 2 * Math.cos(v)} y={(_u, v) => 2 * Math.sin(v)} z={(_u, _v) => 4}
                uMin={0} uMax={1} uSteps={1}
                vMin={0} vMax={2 * Math.PI} vSteps={32}
                color={YELLOW} strokeWidth={2} opacity={0.85}
              />
              {/* 竖直切片线：r=1, θ=0，z 从 1 到 4 */}
              <AnimatedVector3D
                from={[1, 0, 1]} to={[1, 0, 4]}
                color={ORANGE} strokeWidth={3.5}
                drawProgress={sliceProgress}
                label="z: r²→4"
                opacity={sliceProgress > 0.05 ? 1 : 0}
              />
            </CoordinateSystem3D>
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 50 }}>
              <div style={{ fontSize: 21, color: PURPLE, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: ACCENT, label: '上方平面 z=4' },
                { color: PURPLE, label: '下方抛物面 z=r²' },
                { color: YELLOW, label: '交线圆 r=2, z=4' },
                { color: ORANGE, label: '切片线（z 方向积分）' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: TEXT }}>
                  <div style={{ width: 22, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '12px 14px', background: `${ORANGE}0f`, borderRadius: 8, border: `1px solid ${ORANGE}33`, fontSize: 18, color: TEXT, lineHeight: 1.7 }}>
                <div style={{ color: ORANGE, marginBottom: 6, fontWeight: 'bold' }}>切片直觉：</div>
                <div>固定 r=1，z 从 r²=1 积到 4</div>
                <div>橙色竖线长度 = 4-r²=3</div>
                <div style={{ color: PURPLE, marginTop: 6 }}>不同 r 处高度不同</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: PURPLE, fontSize: 32, fontWeight: 'bold' }}>📝 三重积分方法总结</div>
          <div style={{ background: `${PURPLE}09`, borderRadius: 12, padding: '28px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}><span style={{ color: PURPLE }}>① 柱坐标优势：</span>旋转体（轴对称形状）用柱坐标，θ 积分立即得 2π</div>
              <div style={{ marginBottom: 10 }}><span style={{ color: ACCENT }}>② 积分顺序：</span>先 z（消去一个变量），再 r，最后 θ——每步降一维</div>
              <div style={{ marginBottom: 10 }}><span style={{ color: ORANGE }}>③ 切片直觉：</span>固定 (r,θ)，z 从抛物面 r² 积到平面 4，竖向"切片"高度 = 4-r²</div>
              <div><span style={{ color: GREEN }}>④ 结果验证：</span>V = 8π，体积有限，符合两曲面之间封闭区域的几何预期</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Example 3（全局帧 1080–1619）：三角形绕 y 轴旋转体体积
// 三角形：(0,0),(2,0),(0,3)；绕 y 轴旋转
// V = π∫₀³(2-2y/3)² dy = 4π（Pappus 定理验证：2π·(2/3)·3 = 4π）
// ─────────────────────────────────────────────────────────────────────────────
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 1080;
  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 195, 20);
  const step3Op = fade(lf, 240, 20);
  const step4Op = fade(lf, 285, 20);
  const s4Op = fade(lf, 330, 25);
  const s5Op = fade(lf, 390, 30);
  const s6Op = fade(lf, 480, 25);

  // Stage 5：旋转体 3D 展示（全局帧 1470-1560）
  const rotateYDeg = interpolate(frame, [1470, 1560], [10, 190], clamp);
  const rotateY = rotateYDeg * Math.PI / 180;
  const surfOp = interpolate(frame, [1475, 1505], [0, 0.55], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: ORANGE, fontSize: 26, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十章 · 重积分 · 例题 3 / 3
          </div>
          <ExampleBox exampleNum="例3" title="旋转体体积（两种方法）" width={1040} opacity={1} accentColor={ORANGE}>
            <div style={{ padding: '12px 0', fontSize: 24, color: TEXT, lineHeight: 1.9 }}>
              <div>直角三角形顶点：(0,0),&nbsp;(2,0),&nbsp;(0,3)，绕 <strong style={{ color: ORANGE }}>y 轴</strong>旋转一周</div>
              <div style={{ margin: '8px 0' }}>
                斜边方程：
                <span dangerouslySetInnerHTML={{ __html: math('\\dfrac{x}{2}+\\dfrac{y}{3}=1\\;\\Rightarrow\\;x=2-\\dfrac{2y}{3}') }} />
              </div>
              <div>方法一：直接用二重积分<br />方法二：Pappus 定理（质心公式）</div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 1020, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold', marginBottom: 6 }}>📋 审题分析</div>
          <AnalysisItem index={1} opacity={fade(lf, 65, 15)} accentColor={ORANGE}
            text={`旋转体体积（绕 y 轴）= ${math('\\pi\\int_0^3 x^2(y)\\,dy')}，截面为半径 x(y) 的圆`} />
          <AnalysisItem index={2} opacity={fade(lf, 83, 15)} accentColor={PURPLE}
            text={`斜边上 x(y) = ${math('2-\\frac{2y}{3}')}，代入得截面面积 ${math('\\pi\\left(2-\\frac{2y}{3}\\right)^2')}`} />
          <AnalysisItem index={3} opacity={fade(lf, 101, 15)} accentColor={GREEN}
            text={`Pappus 定理：${math('V = 2\\pi\\bar{x}\\cdot S')}，三角形面积 S=3，质心横坐标 ${math('\\bar{x}=2/3')}`} />
          <AnalysisItem index={4} opacity={fade(lf, 119, 15)} accentColor={ACCENT}
            text="两种方法结果相同（互为验证），Pappus 定理将 3D 问题简化为 2D 计算" />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 方法一：圆盘法</div>
          <StepRow label="Step 1"
            latex={"V = \\pi\\int_0^3 x^2(y)\\,dy = \\pi\\int_0^3\\left(2-\\frac{2y}{3}\\right)^2\\!dy"}
            note="圆盘法（截面积 πx²）" opacity={step1Op} accentColor={ORANGE} />
          <StepRow label="Step 2"
            latex={"= \\pi\\int_0^3\\left(4-\\frac{8y}{3}+\\frac{4y^2}{9}\\right)dy"}
            note="展开平方项" opacity={step2Op} accentColor={ACCENT} />
          <StepRow label="Step 3"
            latex={"= \\pi\\left[4y-\\frac{4y^2}{3}+\\frac{4y^3}{27}\\right]_0^3 = \\pi(12-12+4)"}
            note="Newton-Leibniz 公式" opacity={step3Op} accentColor={GREEN} />
          <StepRow label="结果"
            latex={"V = 4\\pi \\approx 12.57\\,\\text{（验证：Pappus：}2\\pi\\cdot\\tfrac{2}{3}\\cdot 3=4\\pi\\checkmark\\text{）}"}
            note="两种方法吻合" opacity={step4Op} accentColor={YELLOW} />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="例3 计算结果" width={940} opacity={1}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 40, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('V = 4\\pi', true) }} />
              <div style={{ display: 'flex', gap: 36, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
                <div style={{ padding: '14px 20px', background: `${ORANGE}0f`, borderRadius: 8, fontSize: 20, color: TEXT }}>
                  <div style={{ color: ORANGE, fontWeight: 'bold', marginBottom: 6 }}>圆盘法</div>
                  <span dangerouslySetInnerHTML={{ __html: math('\\pi\\int_0^3\\left(2-\\tfrac{2y}{3}\\right)^2\\!dy = 4\\pi') }} />
                </div>
                <div style={{ padding: '14px 20px', background: `${PURPLE}0f`, borderRadius: 8, fontSize: 20, color: TEXT }}>
                  <div style={{ color: PURPLE, fontWeight: 'bold', marginBottom: 6 }}>Pappus 定理</div>
                  <span dangerouslySetInnerHTML={{ __html: math('2\\pi\\cdot\\bar{x}\\cdot S = 2\\pi\\cdot\\tfrac{2}{3}\\cdot 3 = 4\\pi') }} />
                </div>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 3D 旋转体可视化 ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ORANGE, fontSize: 28, fontWeight: 'bold' }}>
            🌐 3D 可视化：三角形绕 y 轴旋转形成的圆锥体
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              center={[360, 310]}
              scale={72}
              xRange={[-2.5, 2.5]} yRange={[-0.5, 3.5]} zRange={[-2.5, 2.5]}
              showGrid width={720} height={600}
              rotationY={rotateY}
              rotationX={Math.PI / 8}
            >
              {/* 旋转锥面：绕 y 轴，y∈[0,3]，x(y)=2-2y/3 */}
              {/* 参数化：u=y, v=θ，x(y,θ) = (2-2y/3)cosθ，z(y,θ) = (2-2y/3)sinθ */}
              <SurfaceMesh3D
                x={(u, v) => (2 - 2 * u / 3) * Math.cos(v)}
                y={(u, _v) => u}
                z={(u, v) => (2 - 2 * u / 3) * Math.sin(v)}
                uMin={0} uMax={3} uSteps={12}
                vMin={0} vMax={2 * Math.PI} vSteps={24}
                color={ORANGE} strokeWidth={0.9} opacity={surfOp}
              />
              {/* 底部圆盘（y=0，半径2） */}
              <SurfaceMesh3D
                x={(u, v) => u * Math.cos(v)}
                y={(_u, _v) => 0}
                z={(u, v) => u * Math.sin(v)}
                uMin={0} uMax={2} uSteps={6}
                vMin={0} vMax={2 * Math.PI} vSteps={20}
                color={RED} strokeWidth={0.7} opacity={surfOp * 0.7}
              />
            </CoordinateSystem3D>
            <div style={{ width: 310, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 40 }}>
              <div style={{ fontSize: 21, color: ORANGE, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: ORANGE, label: '旋转锥面 x=2-2y/3 绕 y 轴' },
                { color: RED, label: '底部圆盘（y=0，半径 2）' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: TEXT }}>
                  <div style={{ width: 22, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '14px 16px', background: `${ORANGE}0f`, borderRadius: 8, border: `1px solid ${ORANGE}33`, fontSize: 19, color: TEXT, lineHeight: 1.75 }}>
                <div style={{ color: ORANGE, fontWeight: 'bold', marginBottom: 6 }}>旋转体形状</div>
                <div>斜边绕 y 轴旋转形成<br />圆锥侧面</div>
                <div style={{ marginTop: 6 }}>底圆半径：2（y=0处）</div>
                <div>锥顶：(0,3,0)</div>
                <div style={{ marginTop: 8, color: YELLOW }}>V = 4π（圆锥公式 πR²H/3 验证）</div>
              </div>
              <div style={{ padding: '12px 16px', background: `${PURPLE}0f`, borderRadius: 8, fontSize: 18, color: TEXT, lineHeight: 1.7 }}>
                <span style={{ color: PURPLE }}>Pappus 直觉：</span><br />
                三角形质心绕轴旋转一圈的<br />
                路径长 × 面积 = 体积<br />
                <span dangerouslySetInnerHTML={{ __html: math('2\\pi \\cdot \\bar{x} \\cdot S') }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold' }}>📝 旋转体体积总结</div>
          <div style={{ background: `${ORANGE}08`, borderRadius: 12, padding: '28px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}><span style={{ color: ORANGE }}>① 圆盘法：</span>
                <span dangerouslySetInnerHTML={{ __html: math('V = \\pi\\int_a^b x^2(y)\\,dy') }} />，每一高度 y 处截面面积为 πx²(y)
              </div>
              <div style={{ marginBottom: 10 }}><span style={{ color: PURPLE }}>② Pappus 定理：</span>
                <span dangerouslySetInnerHTML={{ __html: math('V = 2\\pi\\bar{x}\\cdot S') }} />，质心到轴距离 × 面积 × 2π
              </div>
              <div style={{ marginBottom: 10 }}><span style={{ color: GREEN }}>③ 两种方法互验：</span>圆盘法精确，Pappus 定理快速，得到同样的 4π</div>
              <div><span style={{ color: ACCENT }}>④ 3D 直觉：</span>旋转体是三角形"扫过"一圈形成的圆锥，截面半径随 y 线性减小</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（路由到 3 道例题）
// ─────────────────────────────────────────────────────────────────────────────
const Ch10Examples: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 540) return <Example1 frame={frame} />;
  if (frame < 1080) return <Example2 frame={frame} />;
  return <Example3 frame={frame} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Watermark HOC（模块顶层定义）
// ─────────────────────────────────────────────────────────────────────────────
const WCh10Examples = withWatermark(Ch10Examples);
export default WCh10Examples;
