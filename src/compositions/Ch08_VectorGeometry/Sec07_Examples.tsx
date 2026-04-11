import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { AnimatedVector3D } from '../../components/math/AnimatedVector3D';
import { ParametricCurve3D } from '../../components/math/ParametricCurve3D';
import { Plane3D } from '../../components/math/Plane3D';
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
const GREEN = '#50fa7b';
const GOLD = '#ffd700';
const RED = '#ff5555';
const PINK = '#ff79c6';
const ORANGE = '#ff9500';

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisListProps {
  items: string[];
  frame: number;
  startFrame: number;
  perItem?: number;
}

const AnalysisList: React.FC<AnalysisListProps> = ({
  items, frame, startFrame, perItem = 18,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          opacity: fade(frame, startFrame + i * perItem, 15),
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          fontSize: 27,
          color: TEXT,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 'bold', minWidth: 28 }}>{i + 1}.</span>
        <span dangerouslySetInnerHTML={{ __html: item }} />
      </div>
    ))}
  </div>
);

interface StepRowProps {
  label: string;
  latex: string;
  note: string;
  opacity: number;
  accentColor?: string;
}

const StepRow: React.FC<StepRowProps> = ({
  label, latex, note, opacity, accentColor = ACCENT,
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
    <span style={{ color: accentColor, fontSize: 20, minWidth: 90, fontWeight: 'bold' }}>{label}</span>
    <span
      style={{ color: FORMULA, fontSize: 21, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }}
    />
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

interface SummaryBoxProps {
  items: string[];
  opacity: number;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ items, opacity }) => (
  <div
    style={{
      opacity,
      background: 'rgba(97,218,251,0.08)',
      borderRadius: 12,
      padding: '24px 32px',
      width: 920,
    }}
  >
    {items.map((item, i) => (
      <div
        key={i}
        style={{ fontSize: 25, color: TEXT, lineHeight: 2, display: 'flex', gap: 12 }}
      >
        <span style={{ color: ACCENT, minWidth: 28 }}>{'①②③④'[i]}</span>
        <span dangerouslySetInnerHTML={{ __html: item }} />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 例题1：飞机降落跑道平面方程（全局帧 0–539）
// A(1,2,3), B(4,1,2), C(2,3,5) → n=(-1,-7,4) → x+7y-4z=3
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

  // Stage 5 动画：帧驱动旋转
  const rotateY = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI / 4 + Math.PI], clamp);
  // 向量绘制进度（分阶段出现，体现 Polanyi 叉积直觉）
  const abProgress = interpolate(frame, [395, 420], [0, 1], clamp);
  const acProgress = interpolate(frame, [415, 440], [0, 1], clamp);
  const nProgress  = interpolate(frame, [440, 468], [0, 1], clamp);
  const planeOp    = fade(frame, 425, 20);

  // A(1,2,3) → B(4,1,2) → C(2,3,5)
  // n = AB×AC = (-1,-7,4)，缩0.25显示：(-0.25,-1.75,1.0)，从A出发
  const A: [number,number,number] = [1, 2, 3];
  const B: [number,number,number] = [4, 1, 2];
  const C: [number,number,number] = [2, 3, 5];
  // n 从 A 出发，end = A + 0.25*n
  const nEnd: [number,number,number] = [0.75, 0.25, 4.0];
  // 平面四角（过A,B,C+s*AB+t*AC 的平行四边形）：A, B, B+AC-A=(5,2,4), C
  const planeCorners: [[number,number,number],[number,number,number],[number,number,number],[number,number,number]] = [
    [1, 2, 3], [4, 1, 2], [5, 2, 4], [2, 3, 5],
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* Stage 1: 题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ORANGE, fontSize: 22, fontFamily: 'monospace', marginBottom: 4 }}>
            ✈️ 例题 1 · 航空导航应用背景
          </div>
          <ExampleBox exampleNum={1} title="飞机降落跑道平面方程" width={980} opacity={1}>
            <div style={{ padding: '16px 0', fontSize: 26, color: TEXT, lineHeight: 1.95 }}>
              <p>
                机场跑道地面上三个定位点：
                <span dangerouslySetInnerHTML={{ __html: math('A(1,2,3)') }} />、
                <span dangerouslySetInnerHTML={{ __html: math('B(4,1,2)') }} />、
                <span dangerouslySetInnerHTML={{ __html: math('C(2,3,5)') }} />
              </p>
              <p>
                求过三点的<strong style={{ color: ACCENT }}>跑道平面方程</strong>，
                并用法向量验证其唯一性。
              </p>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 940, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={frame}
            startFrame={65}
            items={[
              `已知三点，先求两方向向量 ${math('\\vec{AB},\\vec{AC}')}`,
              `法向量 ${math('\\vec{n}=\\vec{AB}\\times\\vec{AC}')}（垂直于跑道平面）`,
              `用点法式写方程：${math('\\vec{n}\\cdot\\overrightarrow{AP}=0')}`,
              '3D可视化：验证法向量确实垂直于AB和AC',
            ]}
          />
        </div>
      )}

      {/* Stage 3: 分步推导 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步推导</div>
          <StepRow
            label="Step 1"
            latex={"\\vec{AB}=(3,-1,-1),\\quad\\vec{AC}=(1,1,2)"}
            note="方向向量"
            opacity={step1Op}
          />
          <StepRow
            label="Step 2"
            latex={"\\vec{n}=\\vec{AB}\\times\\vec{AC}=\\begin{vmatrix}\\vec{i}&\\vec{j}&\\vec{k}\\\\3&-1&-1\\\\1&1&2\\end{vmatrix}"}
            note="叉积行列式"
            opacity={step2Op}
          />
          <StepRow
            label="Step 3"
            latex={"\\vec{n}=\\vec{i}(-2+1)-\\vec{j}(6+1)+\\vec{k}(3+1)=(-1,-7,4)"}
            note="展开"
            opacity={step3Op}
          />
          <StepRow
            label="Step 4"
            latex={"-(x-1)-7(y-2)+4(z-3)=0\\;\\Rightarrow\\;x+7y-4z=3"}
            note="点法式"
            opacity={step4Op}
          />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="跑道平面方程" width={820} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <span
                style={{ fontSize: 46 }}
                dangerouslySetInnerHTML={{ __html: math('x + 7y - 4z = 3', true) }}
              />
              <div style={{ fontSize: 24, color: TEXT, marginTop: 14, lineHeight: 1.8 }}>
                <span>法向量 </span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{n}=(-1,-7,4)') }} />
                <span>；可验证 A、B、C 均在平面上</span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 可视化（Polanyi：叉积垂直性直觉）*/}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold' }}>
            🎯 3D 可视化：叉积法向量垂直于 AB 和 AC
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <CoordinateSystem3D
              width={860}
              height={560}
              center={[340, 400]}
              scale={52}
              xRange={[-1, 7]}
              yRange={[-1, 5]}
              zRange={[0, 6.5]}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 平面（跑道面）*/}
              <Plane3D
                corners={planeCorners}
                color={PINK}
                fillOpacity={0.15}
                strokeOpacity={0.7}
                opacity={planeOp}
              />
              {/* AB 向量（蓝色，从A出发）*/}
              <AnimatedVector3D
                from={A} to={B}
                color={ACCENT}
                strokeWidth={3}
                drawProgress={abProgress}
                label="AB"
                opacity={1}
              />
              {/* AC 向量（绿色，从A出发）*/}
              <AnimatedVector3D
                from={A} to={C}
                color={GREEN}
                strokeWidth={3}
                drawProgress={acProgress}
                label="AC"
                opacity={1}
              />
              {/* 法向量 n（红色，从A出发，缩比1/4）*/}
              <AnimatedVector3D
                from={A} to={nEnd}
                color={RED}
                strokeWidth={4}
                drawProgress={nProgress}
                label="n"
                opacity={nProgress > 0 ? 1 : 0}
              />
              {/* 三点标记 */}
              <AnimatedVector3D from={[0,0,0]} to={A} color={GOLD} strokeWidth={1.5} label="A" opacity={0.6} />
              <AnimatedVector3D from={[0,0,0]} to={B} color={GOLD} strokeWidth={1.5} label="B" opacity={0.6} />
              <AnimatedVector3D from={[0,0,0]} to={C} color={GOLD} strokeWidth={1.5} label="C" opacity={0.6} />
            </CoordinateSystem3D>
            {/* 图例 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 50, minWidth: 210 }}>
              {[
                { color: ACCENT, label: 'AB=(3,-1,-1)' },
                { color: GREEN,  label: 'AC=(1,1,2)' },
                { color: RED,    label: 'n=AB×AC（法向量）' },
                { color: PINK,   label: '跑道平面 x+7y-4z=3' },
                { color: GOLD,   label: '三定位点 A、B、C' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, fontSize: 19, color: TEXT, lineHeight: 1.7, opacity: 0.85 }}>
                🔑 旋转坐标系<br />
                从多角度确认<br />
                n⊥AB，n⊥AC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 方法总结</div>
          <SummaryBox
            opacity={1}
            items={[
              `求两方向向量 ${math('\\vec{AB}=(3,-1,-1),\\;\\vec{AC}=(1,1,2)')}`,
              `叉积 ${math('\\vec{n}=\\vec{AB}\\times\\vec{AC}=(-1,-7,4)')} 即为法向量`,
              `点法式：${math('-(x-1)-7(y-2)+4(z-3)=0')}`,
              `化简得跑道平面方程 ${math('x+7y-4z=3')}（A、B、C 验证 ✓）`,
            ]}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2：机械臂运动路径直线方程（全局帧 540–1079，本地帧 = frame - 540）
// A(1,2,3) → B(3,4,5)，方向(1,1,1)，对称式 (x-1)/1=(y-2)/1=(z-3)/1
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
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

  // Stage 5：多角度旋转展示直线（Polanyi：正视/侧视/俯视三维直线方向直觉）
  const rotateY = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI / 4 + Math.PI * 4 / 3], clamp);
  const lineProgress = interpolate(frame, [395, 450], [0, 1], clamp);
  const dirProgress  = interpolate(frame, [445, 470], [0, 1], clamp);

  // A(1,2,3), B(3,4,5), direction (1,1,1) per unit
  const ptA: [number,number,number] = [1, 2, 3];
  const ptB: [number,number,number] = [3, 4, 5];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* Stage 1: 题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: GREEN, fontSize: 22, fontFamily: 'monospace', marginBottom: 4 }}>
            🤖 例题 2 · 机械臂运动路径
          </div>
          <ExampleBox exampleNum={2} title="机械臂末端运动直线方程" width={1020} opacity={1}>
            <div style={{ padding: '16px 0', fontSize: 26, color: TEXT, lineHeight: 1.95 }}>
              <p>
                机械臂末端从点{' '}
                <span dangerouslySetInnerHTML={{ __html: math('A(1,2,3)') }} />{' '}
                沿直线运动到点{' '}
                <span dangerouslySetInnerHTML={{ __html: math('B(3,4,5)') }} />
              </p>
              <p>
                求运动路径的<strong style={{ color: ACCENT }}>直线方程</strong>（对称式和参数式）。
              </p>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 940, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={frame}
            startFrame={65}
            items={[
              `已知过直线上两点，方向向量 ${math('\\vec{AB}=B-A=(2,2,2)')}`,
              `化简方向向量：${math('(2,2,2)=2(1,1,1)')}，方向余弦相等`,
              '过点A、方向(1,1,1)写直线方程（对称式）',
              '参数式：令对称式各分量等于参数 t',
            ]}
          />
        </div>
      )}

      {/* Stage 3: 分步推导 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步推导</div>
          <StepRow
            label="Step 1"
            latex={"\\vec{AB}=B-A=(3-1,\\,4-2,\\,5-3)=(2,2,2)"}
            note="方向向量"
            opacity={step1Op}
          />
          <StepRow
            label="Step 2"
            latex={"\\vec{v}=(1,1,1)\\;\\text{（化简，方向余弦均等）}"}
            note="单位化方向"
            opacity={step2Op}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 3"
            latex={"\\frac{x-1}{1}=\\frac{y-2}{1}=\\frac{z-3}{1}"}
            note="对称式"
            opacity={step3Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 4"
            latex={"x=1+t,\\quad y=2+t,\\quad z=3+t\\quad(t\\in\\mathbb{R})"}
            note="参数式"
            opacity={step4Op}
            accentColor={GOLD}
          />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <TheoremBox title="机械臂运动路径方程" width={900} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div
                style={{ fontSize: 38 }}
                dangerouslySetInnerHTML={{ __html: math('\\dfrac{x-1}{1}=\\dfrac{y-2}{1}=\\dfrac{z-3}{1}', true) }}
              />
              <div style={{ fontSize: 23, color: TEXT, marginTop: 12, lineHeight: 1.8 }}>
                方向向量{' '}
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{v}=(1,1,1)') }} />
                {' '}（45° 对角线方向，方向余弦均为{' '}
                <span dangerouslySetInnerHTML={{ __html: math('1/\\sqrt{3}') }} />）
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 可视化（Polanyi：多视角建立直线方向直觉）*/}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold' }}>
            🎯 3D 可视化：多视角观察直线方向
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <CoordinateSystem3D
              width={860}
              height={560}
              center={[350, 400]}
              scale={55}
              xRange={[-1, 6]}
              yRange={[-1, 6]}
              zRange={[0, 7]}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 直线 x=1+t, y=2+t, z=3+t，t∈[-2,3] */}
              <ParametricCurve3D
                x={(t) => 1 + t}
                y={(t) => 2 + t}
                z={(t) => 3 + t}
                tMin={-2}
                tMax={3}
                segments={30}
                color={ACCENT}
                strokeWidth={3}
                drawProgress={lineProgress}
                opacity={1}
              />
              {/* 方向向量（金色，从A出发）*/}
              <AnimatedVector3D
                from={ptA}
                to={[2, 3, 4]}
                color={GOLD}
                strokeWidth={3}
                drawProgress={dirProgress}
                label="v=(1,1,1)"
                opacity={dirProgress > 0 ? 1 : 0}
              />
              {/* A点标记 */}
              <AnimatedVector3D from={[0,0,0]} to={ptA} color={GREEN} strokeWidth={1.5} label="A" opacity={0.7} />
              {/* B点标记 */}
              <AnimatedVector3D from={[0,0,0]} to={ptB} color={PINK} strokeWidth={1.5} label="B" opacity={0.7} />
            </CoordinateSystem3D>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 50, minWidth: 220 }}>
              {[
                { color: ACCENT, label: '运动路径直线 L' },
                { color: GOLD,   label: '方向向量 v=(1,1,1)' },
                { color: GREEN,  label: '起点 A(1,2,3)' },
                { color: PINK,   label: '终点 B(3,4,5)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, fontSize: 18, color: TEXT, lineHeight: 1.75, opacity: 0.85 }}>
                🔑 旋转坐标系：<br />
                正视角→侧视角→俯视角<br />
                建立"空间直线方向"直觉
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 方法总结</div>
          <SummaryBox
            opacity={1}
            items={[
              `由两点求方向向量：${math('\\vec{AB}=(2,2,2)')}，化简为 ${math('(1,1,1)')}`,
              `对称式：${math('\\tfrac{x-1}{1}=\\tfrac{y-2}{1}=\\tfrac{z-3}{1}')}（各分量均等时最简洁）`,
              `参数式：${math('x=1+t,\\;y=2+t,\\;z=3+t')}（适合代入计算交点）`,
              '方向余弦均为 1/√3，直线与三坐标轴夹角相等（对角线方向）',
            ]}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3：激光切割——直线与平面的位置关系（全局帧 1080–1619，本地帧 = frame - 1080）
// 直线过P(1,0,2)，方向v=(1,1,-1)；平面2x+y+z=5，法向量n=(2,1,1)
// v·n=2≠0 → 相交；t=0.5，交点(1.5,0.5,1.5)
// ─────────────────────────────────────────────────────────────────────────────
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
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

  // Stage 5 动画
  const rotateY = interpolate(frame, [390, 480], [Math.PI / 6, Math.PI / 6 + Math.PI * 2 / 3], clamp);
  const planeOp     = fade(frame, 392, 22);
  const lineProgress = interpolate(frame, [406, 448], [0, 1], clamp);
  const vProgress   = interpolate(frame, [440, 462], [0, 1], clamp);
  const nProgress   = interpolate(frame, [454, 476], [0, 1], clamp);

  // P(1,0,2), v=(1,1,-1), n=(2,1,1)
  // 平面 2x+y+z=5 角点：(2.5,0,0),(0,5,0),(-1,5,2),(1.5,0,2)
  const planeCorners: [[number,number,number],[number,number,number],[number,number,number],[number,number,number]] = [
    [2.5, 0, 0], [0, 5, 0], [-1, 5, 2], [1.5, 0, 2],
  ];
  const P0: [number,number,number] = [1, 0, 2];
  // v 方向向量从 P0 出发，end = P0 + 0.9*v
  const vEnd: [number,number,number] = [1.9, 0.9, 1.1];
  // n 法向量从交点 P=(1.5,0.5,1.5) 出发，end = P + 0.7*n_hat
  // n=(2,1,1), |n|=√6≈2.449, n_hat≈(0.816,0.408,0.408), 0.7*n_hat≈(0.571,0.286,0.286)
  const intersect: [number,number,number] = [1.5, 0.5, 1.5];
  const nEnd: [number,number,number] = [2.071, 0.786, 1.786];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* Stage 1: 题目 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: RED, fontSize: 22, fontFamily: 'monospace', marginBottom: 4 }}>
            🔆 例题 3 · 激光切割机器应用背景
          </div>
          <ExampleBox exampleNum={3} title="激光光束与板材的位置关系" width={1060} opacity={1}>
            <div style={{ padding: '16px 0', fontSize: 26, color: TEXT, lineHeight: 1.95 }}>
              <p>
                激光光束：过点{' '}
                <span dangerouslySetInnerHTML={{ __html: math('P(1,0,2)') }} />，
                方向向量{' '}
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{v}=(1,1,-1)') }} />
              </p>
              <p>
                板材所在平面：
                <span dangerouslySetInnerHTML={{ __html: math('2x+y+z=5') }} />
                （法向量{' '}
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{n}=(2,1,1)') }} />）
              </p>
              <p>
                判断光束与板材的<strong style={{ color: ACCENT }}>位置关系</strong>，若相交求<strong style={{ color: GOLD }}>交点坐标</strong>。
              </p>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 960, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={frame}
            startFrame={65}
            items={[
              `判断关系：计算 ${math('\\vec{v}\\cdot\\vec{n}')}`,
              `${math('\\vec{v}\\cdot\\vec{n}=0')}：直线平行于平面（或在平面内）`,
              `${math('\\vec{v}\\cdot\\vec{n}\\neq 0')}：直线与平面相交`,
              '若相交：参数化直线代入平面方程，求参数 t',
            ]}
          />
        </div>
      )}

      {/* Stage 3: 分步推导 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步推导</div>
          <StepRow
            label="Step 1"
            latex={"\\vec{v}\\cdot\\vec{n}=(1,1,-1)\\cdot(2,1,1)=2+1-1=2\\neq 0"}
            note="→ 直线相交平面"
            opacity={step1Op}
          />
          <StepRow
            label="Step 2"
            latex={"\\text{参数式：}x=1+t,\\;y=t,\\;z=2-t"}
            note="过P沿v方向"
            opacity={step2Op}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 3"
            latex={"2(1+t)+t+(2-t)=5\\;\\Rightarrow\\;4+2t=5\\;\\Rightarrow\\;t=\\dfrac{1}{2}"}
            note="代入平面方程"
            opacity={step3Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 4"
            latex={"t=\\tfrac{1}{2}:\\quad P^*=\\left(\\tfrac{3}{2},\\,\\tfrac{1}{2},\\,\\tfrac{3}{2}\\right)"}
            note="交点坐标"
            opacity={step4Op}
            accentColor={GOLD}
          />
        </div>
      )}

      {/* Stage 4: 关键结论 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <TheoremBox title="位置关系判断准则" width={1000} opacity={1}>
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: TEXT }}>
                <span style={{ color: ACCENT, minWidth: 48 }}>①</span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{v}\\cdot\\vec{n}=0') }} />
                <span style={{ marginLeft: 8 }}>→ 直线平行（或在）平面</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: TEXT }}>
                <span style={{ color: RED, minWidth: 48 }}>②</span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{v}\\cdot\\vec{n}\\neq 0') }} />
                <span style={{ marginLeft: 8 }}>→ 直线与平面相交</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: GOLD }}>
                <span style={{ minWidth: 48 }}>本题：</span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{v}\\cdot\\vec{n}=2\\neq 0') }} />
                <span style={{ marginLeft: 8 }}>→ 交点{' '}
                  <span dangerouslySetInnerHTML={{ __html: math('P^*(\\tfrac{3}{2},\\tfrac{1}{2},\\tfrac{3}{2})') }} />
                </span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 可视化（Polanyi：v·n角度判断位置关系）*/}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold' }}>
            🎯 3D 可视化：方向向量 v 与法向量 n 夹角
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <CoordinateSystem3D
              width={860}
              height={560}
              center={[380, 420]}
              scale={55}
              xRange={[-2, 4]}
              yRange={[-1, 6]}
              zRange={[0, 4.5]}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 板材平面 2x+y+z=5 */}
              <Plane3D
                corners={planeCorners}
                color={PINK}
                fillOpacity={0.18}
                strokeOpacity={0.75}
                opacity={planeOp}
              />
              {/* 激光光束（直线）*/}
              <ParametricCurve3D
                x={(t) => 1 + t}
                y={(t) => t}
                z={(t) => 2 - t}
                tMin={-2}
                tMax={3}
                segments={30}
                color={GOLD}
                strokeWidth={3}
                drawProgress={lineProgress}
                opacity={1}
              />
              {/* 方向向量 v（蓝色）*/}
              <AnimatedVector3D
                from={P0} to={vEnd}
                color={ACCENT}
                strokeWidth={3}
                drawProgress={vProgress}
                label="v"
                opacity={vProgress > 0 ? 1 : 0}
              />
              {/* 法向量 n（红色，从交点出发）*/}
              <AnimatedVector3D
                from={intersect} to={nEnd}
                color={RED}
                strokeWidth={3}
                drawProgress={nProgress}
                label="n"
                opacity={nProgress > 0 ? 1 : 0}
              />
              {/* 交点标记 */}
              <AnimatedVector3D
                from={[0,0,0]} to={intersect}
                color={GOLD}
                strokeWidth={1.5}
                label="P*"
                opacity={nProgress > 0 ? 0.7 : 0}
              />
            </CoordinateSystem3D>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 50, minWidth: 230 }}>
              {[
                { color: GOLD,  label: '激光光束（直线）' },
                { color: ACCENT, label: '方向向量 v=(1,1,-1)' },
                { color: RED,   label: '法向量 n=(2,1,1)' },
                { color: PINK,  label: '板材平面 2x+y+z=5' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, fontSize: 18, color: TEXT, lineHeight: 1.75, opacity: 0.85 }}>
                🔑 <span style={{ color: RED }}>v·n≠0</span>：<br />
                方向向量与法向量<br />
                不垂直 → 直线相交<br />
                <br />
                <span dangerouslySetInnerHTML={{ __html: math('\\sin\\alpha=\\dfrac{|\\vec{v}\\cdot\\vec{n}|}{|\\vec{v}||\\vec{n}|}=\\dfrac{2}{\\sqrt{18}}') }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 位置关系总结</div>
          <SummaryBox
            opacity={1}
            items={[
              `判断法则：计算 ${math('\\vec{v}\\cdot\\vec{n}')}，等于零则平行/在内，不等于零则相交`,
              `本题 ${math('\\vec{v}\\cdot\\vec{n}=2\\neq 0')}，故激光光束相交板材`,
              `交点参数 ${math('t=1/2')}，交点坐标 ${math('P^*(3/2,\\,1/2,\\,3/2)')}`,
              `夹角 ${math('\\sin\\alpha=2/\\sqrt{18}=\\sqrt{2}/3\\approx0.471')}，即 ${math('\\alpha\\approx28.1°')}`,
            ]}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：三道例题顺序播放，总帧数 = 1620
// ─────────────────────────────────────────────────────────────────────────────
const Ch08Examples: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 540) return <Example1 frame={frame} />;
  if (frame < 1080) return <Example2 frame={frame - 540} />;
  return <Example3 frame={frame - 1080} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Watermark HOC（模块顶层定义）
// ─────────────────────────────────────────────────────────────────────────────
const WCh08Examples = withWatermark(Ch08Examples);
export default WCh08Examples;
