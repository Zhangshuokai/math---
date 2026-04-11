import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem, useCoordContext } from '../../components/math/CoordinateSystem';
import { VectorField } from '../../components/math/VectorField';
import { Arrow } from '../../components/math/Arrow';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { SurfaceMesh3D } from '../../components/math/SurfaceMesh3D';
import { AnimatedVector3D } from '../../components/math/AnimatedVector3D';
import { withWatermark } from '../../components/ui/Watermark';

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (f: number, start: number, duration = 20): number =>
  interpolate(f, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
const RED = '#ff5555';
const YELLOW = '#f1fa8c';
const ORANGE = '#ffb86c';

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface StepRowProps {
  label: string;
  latex: string;
  note: string;
  opacity: number;
  accentColor?: string;
  displayMode?: boolean;
}
const StepRow: React.FC<StepRowProps> = ({
  label,
  latex,
  note,
  opacity,
  accentColor = ACCENT,
  displayMode = false,
}) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '12px 20px',
      background: 'rgba(97,218,251,0.06)',
      borderRadius: 8,
      borderLeft: `3px solid ${accentColor}`,
    }}
  >
    <span style={{ color: accentColor, fontSize: 20, minWidth: 80, fontWeight: 'bold' }}>{label}</span>
    <span
      style={{ color: FORMULA, fontSize: displayMode ? 18 : 20, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex, displayMode) }}
    />
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// 误差贡献条形图
interface ErrorBarProps {
  label: string;
  value: number;   // 百分比，0–100
  color: string;
  opacity: number;
  maxWidth?: number;
}
const ErrorBar: React.FC<ErrorBarProps> = ({ label, value, color, opacity, maxWidth = 400 }) => (
  <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
    <span style={{ color: TEXT, fontSize: 22, minWidth: 120 }}>{label}</span>
    <div
      style={{
        width: maxWidth,
        height: 28,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'none',
        }}
      />
    </div>
    <span style={{ color, fontSize: 22, fontWeight: 'bold', minWidth: 60 }}>{value}%</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2D 梯度场辅助组件（在 CoordinateSystem 上下文中使用）
// ─────────────────────────────────────────────────────────────────────────────

// 工作点标记（r=50→x=5, h=200→y=2）
const WorkPointDot: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(5, 2);
  return (
    <g opacity={opacity}>
      <circle cx={px} cy={py} r={10} fill={ORANGE} />
      <text x={px + 12} y={py - 12} fill={ORANGE} fontSize={14} fontWeight="bold">工作点(r=50,h=200)</text>
    </g>
  );
};

// 梯度方向箭头（8:1 比例方向可视化）
const GradArrow8to1: React.FC<{ opacity: number }> = ({ opacity }) => {
  // 在工作点处的梯度方向：r分量 ∝ 2πrh=20000π, h分量 ∝ πr²=2500π
  // 比例8:1，归一化后 (8,1)/√65 ≈ (0.99, 0.124)
  // 在显示坐标中放大到 length=1.5 units
  const len = 1.8;
  const mag = Math.sqrt(64 + 1); // √65
  const dx = (8 / mag) * len; // ≈1.77
  const dy = (1 / mag) * len; // ≈0.22
  const { toPixel } = useCoordContext();
  const fromPt = toPixel(5, 2);
  const toPt = toPixel(5 + dx, 2 + dy);
  return (
    <g opacity={opacity}>
      <defs>
        <marker id="grad-arrow-sensor" markerWidth="10" markerHeight="7"
          refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={RED} />
        </marker>
      </defs>
      <line
        x1={fromPt.px} y1={fromPt.py}
        x2={toPt.px} y2={toPt.py}
        stroke={RED} strokeWidth={5}
        markerEnd="url(#grad-arrow-sensor)"
      />
      <text
        x={toPt.px + 8} y={toPt.py - 8}
        fill={RED} fontSize={14} fontWeight="bold"
      >∇V(r方向为主)</text>
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：传感器测量误差传播分析（全微分 + 梯度场可视化）
// ─────────────────────────────────────────────────────────────────────────────
const Ch09IMSensor: React.FC = () => {
  const frame = useCurrentFrame();

  // 6 阶段时序（540帧）
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

  // Stage 5：3D 旋转（帧驱动）
  const rotateY = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI * 5 / 4], clamp);

  // Stage 5 内部动画序列
  const gradFieldOp = fade(frame, 395, 22);   // 梯度场出现
  const workPtOp = fade(frame, 418, 18);      // 工作点标记
  const gradArrowOp = fade(frame, 438, 18);   // 工作点梯度箭头
  const insightOp = fade(frame, 455, 18);     // Polanyi 注释

  // 梯度向量进度（3D）
  const gradProgress = interpolate(frame, [405, 445], [0, 1], clamp);

  // 工作点 (r=50, h=200) 在 3D 坐标（x=r/20, y=h/100, z = 0.08*x²*y 中）
  const workPt: [number, number, number] = [2.5, 2.0, 2.5];
  // 梯度方向（r分量为主，8:1比例）
  const gradScale = 0.9;
  const gMag = Math.sqrt(0.8 ** 2 + 0.1 ** 2);
  const gradEnd: [number, number, number] = [
    workPt[0] + (0.8 / gMag) * gradScale,
    workPt[1] + (0.1 / gMag) * gradScale,
    workPt[2],
  ];

  // 误差贡献
  const errBarOp = fade(frame, 350, 20);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 问题描述 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: PURPLE, fontSize: 24, fontFamily: 'monospace', marginBottom: 8 }}>
              第九章 · 智能制造应用案例 IM-02
            </div>
            <div style={{ color: FORMULA, fontSize: 44, fontWeight: 'bold' }}>
              传感器误差传播分析
            </div>
            <div style={{ color: TEXT, fontSize: 26, marginTop: 10 }}>
              全微分应用 · 质检系统精度配置 · 梯度场可视化
            </div>
          </div>
          <ExampleBox
            exampleNum="📋"
            title="问题描述"
            width={1060}
            opacity={1}
            accentColor={PURPLE}
          >
            <div style={{ padding: '10px 0', fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: PURPLE }}>工程背景：</strong>
                测量圆柱体半径 r 和高度 h 来计算体积&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('V=\\pi r^2 h') }} />，
                测量误差经全微分传播到体积误差。
              </div>
              <div>
                <strong style={{ color: ACCENT }}>已知参数：</strong>
                r = 50 mm，h = 200 mm，精度要求&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('|\\delta V/V|\\leq 0.5\\%') }} />
              </div>
              <div>
                <strong style={{ color: GREEN }}>目标：</strong>
                分析 r 和 h 的误差贡献比，理解<strong style={{ color: YELLOW }}>梯度场</strong>如何"一眼看出"哪个方向误差影响最大。
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>📋 数学分析</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                i: 1, delay: 65,
                text: `体积函数&nbsp;${math('V=\\pi r^2 h')}（r, h 的二元函数）`,
              },
              {
                i: 2, delay: 83,
                text: `全微分：${math('dV = \\frac{\\partial V}{\\partial r}\\,dr + \\frac{\\partial V}{\\partial h}\\,dh = 2\\pi rh\\,dr + \\pi r^2\\,dh')}`,
              },
              {
                i: 3, delay: 101,
                text: `相对误差：${math('|\\delta V/V|\\leq 2|\\delta r/r|+|\\delta h/h|')}（r 的系数为 <strong style="color:#ff5555">2</strong>，h 为 1）`,
              },
              {
                i: 4, delay: 119,
                text: `<span style="color:#f1fa8c">梯度场直觉：</span>
                  ${math('\\nabla V=(2\\pi rh,\\,\\pi r^2)')} ——在每个 (r,h) 点，箭头方向 = 体积增长最快方向`,
              },
            ].map(({ i, delay, text }) => (
              <div
                key={i}
                style={{
                  opacity: fade(frame, delay, 15),
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  fontSize: 24,
                  color: TEXT,
                }}
              >
                <span style={{ color: ACCENT, fontWeight: 'bold', minWidth: 28 }}>{i}.</span>
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage 3: 分步推导 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>📐 误差分析计算</div>
          <StepRow
            label="Step 1"
            latex={"\\frac{\\partial V}{\\partial r} = 2\\pi rh,\\quad \\frac{\\partial V}{\\partial h} = \\pi r^2"}
            note="偏导数"
            opacity={step1Op}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2"
            latex={"\\frac{|dV|}{V} \\leq 2\\frac{|dr|}{r} + \\frac{|dh|}{h}"}
            note="相对误差上界"
            opacity={step2Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3"
            latex={"\\delta r=0.1\\text{mm}:\\;2\\times\\frac{0.1}{50}=0.4\\%;\\quad\\delta h=0.2\\text{mm}:\\;\\frac{0.2}{200}=0.1\\%"}
            note="各传感器误差贡献"
            opacity={step3Op}
            accentColor={RED}
          />
          <StepRow
            label="Step 4"
            latex={"\\frac{|\\delta V|}{V}\\leq 0.4\\%+0.1\\%=0.5\\%\\;\\checkmark\\;\\text{（r 贡献 80%，h 贡献 20%）}"}
            note="达标"
            opacity={step4Op}
            accentColor={YELLOW}
          />
        </div>
      )}

      {/* ── Stage 4: 关键结论 + 误差贡献图 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <TheoremBox title="误差传播公式与传感器精度要求" width={1020} opacity={1}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <span
                style={{ fontSize: 32 }}
                dangerouslySetInnerHTML={{
                  __html: math('\\frac{|\\delta V|}{V} \\leq 2\\frac{|\\delta r|}{r} + \\frac{|\\delta h|}{h} \\leq 0.5\\%', true),
                }}
              />
              <div style={{ fontSize: 21, color: TEXT, marginTop: 12 }}>
                半径精度（δr ≤ 0.1 mm）是<strong style={{ color: RED }}>关键约束</strong>，精度要求为高度的 4 倍
              </div>
            </div>
          </TheoremBox>
          <div
            style={{
              opacity: errBarOp,
              width: 820,
              padding: '20px 30px',
              background: 'rgba(97,218,251,0.06)',
              borderRadius: 10,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 22, fontWeight: 'bold', marginBottom: 14 }}>
              误差贡献分布（在工作点 r=50, h=200 处）
            </div>
            <ErrorBar label="半径 r" value={80} color={RED} opacity={1} />
            <ErrorBar label="高度 h" value={20} color={GREEN} opacity={1} />
            <div style={{ fontSize: 18, color: TEXT, marginTop: 10, lineHeight: 1.7 }}>
              <span style={{ color: YELLOW }}>梯度分量比：</span>
              &nbsp;
              <span dangerouslySetInnerHTML={{
                __html: math('\\frac{\\partial V/\\partial r}{\\partial V/\\partial h}=\\frac{2\\pi rh}{\\pi r^2}=\\frac{2h}{r}=\\frac{2\\times200}{50}=8')
              }} />
              &nbsp;—— r 方向的误差灵敏度是 h 方向的 8 倍
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 5: 双可视化（梯度场 + 3D 曲面）── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ color: ACCENT, fontSize: 23, fontWeight: 'bold' }}>
            🔬 Polanyi 核心：梯度向量场"一眼看出"哪里误差影响最大
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>

            {/* 左侧：2D 梯度向量场（关键 Polanyi 场景） */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: ACCENT, fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
                ∇V(r,h) 梯度向量场（r-h 参数平面）
              </div>
              <CoordinateSystem
                width={560}
                height={500}
                xRange={[1, 8]}
                yRange={[0.5, 4]}
                showGrid
                gridStep={1}
                showLabels
                labelStep={2}
                opacity={gradFieldOp}
              >
                {/*
                  梯度场 ∇V：
                  Px ∝ ∂V/∂r = 2πrh = 2*(10x)*(100y) = 2000xy → 用 2*x*y
                  Py ∝ ∂V/∂h = πr²  = (10x)²          = 100x²  → 用 x*x
                  VectorField 内部会归一化，所以比例关系保留
                */}
                <VectorField
                  Px={(x, y) => 2 * x * y}
                  Py={(x, y) => x * x}
                  gridCount={9}
                  scale={0.28}
                  color={ACCENT}
                  opacity={gradFieldOp * 0.8}
                />
                {/* 工作点 (r=50→x=5, h=200→y=2) */}
                <WorkPointDot opacity={workPtOp} />
                {/* 工作点处的梯度方向箭头（8:1比例方向，主要指向r=x方向） */}
                <GradArrow8to1 opacity={gradArrowOp} />
                {/*
                  用 Arrow 额外标注等误差贡献对比：
                  等高线切线方向（垂直于梯度）——h 方向小箭头
                */}
              </CoordinateSystem>
              {/* 轴说明 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: TEXT, padding: '0 8px' }}>
                <span>横轴 x = r/10（半径，r∈[10,80] mm）</span>
                <span>纵轴 y = h/100（高度，h∈[50,400] mm）</span>
              </div>
              {/* Polanyi 说明框 */}
              <div
                style={{
                  opacity: insightOp,
                  padding: '12px 16px',
                  background: `${YELLOW}15`,
                  borderRadius: 8,
                  border: `1px dashed ${YELLOW}66`,
                  fontSize: 16,
                  color: YELLOW,
                  lineHeight: 1.75,
                  maxWidth: 560,
                }}
              >
                💡 <strong>梯度场默会知识：</strong><br />
                箭头越长 = 体积对该点更敏感；箭头方向 = 增大 V 最有效的方向。<br />
                在工作点处，红色大箭头指向 r 方向（几乎水平）——<br />
                "一眼看出"半径误差的影响远大于高度误差，这就是梯度场的全域感知能力。
              </div>
            </div>

            {/* 右侧：3D 体积曲面 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: ACCENT, fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
                3D 曲面 V=πr²h（帧驱动旋转）
              </div>
              <CoordinateSystem3D
                width={540}
                height={500}
                center={[270, 400]}
                scale={55}
                xRange={[0.5, 5]}
                yRange={[0.3, 4]}
                zRange={[0, 5]}
                rotationY={rotateY}
                rotationX={Math.PI / 6}
              >
                {/*
                  V = π * r² * h
                  坐标映射：x = r/20（r∈[20,80] → x∈[1,4]），
                             y = h/100（h∈[50,350] → y∈[0.5,3.5]）
                             z = 0.08 * x² * y
                */}
                <SurfaceMesh3D
                  x={(u, _v) => u}
                  y={(_u, v) => v}
                  z={(u, v) => 0.08 * u * u * v}
                  uMin={1.0} uMax={4.0} uSteps={12}
                  vMin={0.5} vMax={3.5} vSteps={12}
                  color={ACCENT}
                  strokeWidth={0.8}
                  opacity={0.4}
                />
                {/* 梯度向量（主要指向 r 方向） */}
                <AnimatedVector3D
                  from={workPt}
                  to={gradEnd}
                  color={RED}
                  strokeWidth={5}
                  drawProgress={gradProgress}
                  label="∇V"
                  opacity={gradProgress > 0 ? 1 : 0}
                />
              </CoordinateSystem3D>
              {/* 图例 */}
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                {[
                  { color: ACCENT, label: '体积曲面 V=πr²h' },
                  { color: RED, label: '梯度 ∇V（r方向为主）' },
                  { color: ORANGE, label: '工作点(r=50,h=200)' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: TEXT }}>
                    <div style={{ width: 18, height: 4, background: color, borderRadius: 2 }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>📝 传感器误差分析总结</div>
          <div
            style={{
              background: 'rgba(97,218,251,0.07)',
              borderRadius: 12,
              padding: '26px 32px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.85 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: PURPLE }}>① 全微分误差传播：</span>
                <span dangerouslySetInnerHTML={{ __html: math('|\\delta V/V|\\leq 2|\\delta r/r|+|\\delta h/h|') }} />
                &nbsp;— 偏导系数反映各变量误差权重
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: RED }}>② 半径精度是关键：</span>
                r 方向梯度分量比 h 方向大 8 倍（2h/r=8）；贡献率 80%；需选用高精度半径传感器
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: YELLOW }}>③ 梯度场 Polanyi 直觉：</span>
                梯度向量场让人"一眼看出"哪里是峰值、哪个变量影响大——<br />
                &nbsp;&nbsp;这种<strong>全域感知</strong>能力是梯度从"单点斜率"到"全场可视化"的升华，是多元微分最核心的默会知识
              </div>
              <div>
                <span style={{ color: ORANGE }}>④ 工程推广：</span>
                任意多元测量系统（温度、压力、流速等）均可用全微分 + 梯度场分析误差传播，
                梯度场可视化直接指导各传感器精度分配决策
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
const WCh09IMSensor = withWatermark(Ch09IMSensor);
export default WCh09IMSensor;
