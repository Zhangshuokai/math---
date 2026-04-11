import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { TitleCard } from '../../components/ui/TitleCard';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem } from '../../components/math/CoordinateSystem';
import { FunctionPlot } from '../../components/math/FunctionPlot';
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
const YELLOW = '#f1fa8c';
const ORANGE = '#ffb86c';
const CYAN = '#8be9fd';

// ─────────────────────────────────────────────────────────────────────────────
// sin(x) 的各阶泰勒近似
// T1(x) = x
// T3(x) = x - x³/6
// T5(x) = x - x³/6 + x⁵/120
// ─────────────────────────────────────────────────────────────────────────────
const sinT1 = (x: number): number => x;
const sinT3 = (x: number): number => x - Math.pow(x, 3) / 6;
const sinT5 = (x: number): number => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120;

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps {
  index: number;
  text: string;
  opacity: number;
  accentColor?: string;
}
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = ORANGE }) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      fontSize: 26,
      color: TEXT,
    }}
  >
    <span style={{ color: accentColor, fontWeight: 'bold', minWidth: 28 }}>{index}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

interface StepRowProps {
  label: string;
  content: React.ReactNode;
  note: string;
  opacity: number;
  accentColor?: string;
}
const StepRow: React.FC<StepRowProps> = ({ label, content, note, opacity, accentColor = ORANGE }) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '12px 20px',
      background: 'rgba(255,184,108,0.05)',
      borderRadius: 8,
      borderLeft: `3px solid ${accentColor}`,
    }}
  >
    <span style={{ color: accentColor, fontSize: 20, minWidth: 80, fontWeight: 'bold' }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 20, flex: 1 }}>{content}</span>
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Stage 1：标题卡（0–60帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage1: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 0, 30);
  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <TitleCard
        chapterNum="12"
        chapterTitle="无穷级数"
        sectionNum="IM-02"
        sectionTitle="数控插补泰勒近似 · 智能制造应用"
        opacity={1}
      />
      <div style={{ width: 900, marginTop: 8 }}>
        <ExampleBox
          exampleNum="工程背景"
          title="CNC数控插补算法"
          width={900}
          opacity={1}
          accentColor={ORANGE}
        >
          <div style={{ padding: '10px 0', fontSize: 22, color: TEXT, lineHeight: 1.8 }}>
            <div>
              CNC数控系统在插补圆弧轨迹时，需实时计算
              <strong style={{ color: ORANGE }}> sin/cos 三角函数</strong>。
            </div>
            <div>
              为避免复杂浮点运算，使用<strong style={{ color: GREEN }}>泰勒展开近似</strong>：
              在保证<strong style={{ color: ACCENT }}>纳米级精度</strong>的前提下大幅提高计算速度。
            </div>
            <div style={{ marginTop: 8, fontSize: 20, color: YELLOW }}>
              步进角 Δθ = 0.001 rad（约 0.057°），分析截断误差
            </div>
          </div>
        </ExampleBox>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 2：审题分析（60–150帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage2: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 60, 20);
  return (
    <div style={{ opacity: op, width: 980, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 工程分析</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <AnalysisItem
          index={1}
          opacity={fade(frame, 65, 15)}
          text={`插补步进角 ${math('\\Delta\\theta=0.001\\,\\text{rad}')}（约 ${math('0.057^\\circ')}），每控制周期更新一次`}
        />
        <AnalysisItem
          index={2}
          opacity={fade(frame, 85, 15)}
          text={`需要计算 ${math('\\sin(\\Delta\\theta)')} 和 ${math('\\cos(\\Delta\\theta)')} 的近似值`}
        />
        <AnalysisItem
          index={3}
          opacity={fade(frame, 105, 15)}
          text={`泰勒展开：${math('\\sin(x)=x-\\dfrac{x^3}{6}+\\dfrac{x^5}{120}-\\cdots')}（Maclaurin 级数）`}
        />
        <AnalysisItem
          index={4}
          opacity={fade(frame, 125, 15)}
          text={`分析保留几项时截断误差可达 <strong style='color:${GREEN}'>纳米级精度</strong>（工件加工要求）`}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 3：分步推导（150–330帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage3: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 150, 20);
  const step1Op = fade(frame, 155, 20);
  const step2Op = fade(frame, 200, 20);
  const step3Op = fade(frame, 245, 20);
  const step4Op = fade(frame, 290, 20);

  return (
    <div style={{ opacity: op, width: 1160, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
      <StepRow
        label="Step 1"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('\\sin(0.001)=0.001-\\dfrac{(0.001)^3}{6}+\\dfrac{(0.001)^5}{120}-\\cdots')
          }} />
        }
        note="泰勒展开代入"
        opacity={step1Op}
        accentColor={PURPLE}
      />
      <StepRow
        label="Step 2"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('=0.001\\underbrace{-1.667\\times10^{-10}}_{\\text{第2项}}+\\underbrace{8.3\\times10^{-18}}_{\\text{第3项}}')
          }} />
        }
        note="各项数值"
        opacity={step2Op}
        accentColor={ORANGE}
      />
      <StepRow
        label="Step 3"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('|R_2|\\leq\\dfrac{(0.001)^5}{120}\\approx 8.3\\times10^{-18}\\,\\text{m}\\;<\\text{亚纳米}')
          }} />
        }
        note="两项误差估计"
        opacity={step3Op}
        accentColor={GREEN}
      />
      <StepRow
        label="Step 4"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('\\therefore\\;\\sin(\\Delta\\theta)\\approx\\Delta\\theta,\\;\\text{误差}\\;1.67\\times10^{-10}\\;\\text{（仅需1项）}')
          }} />
        }
        note="最终结论"
        opacity={step4Op}
        accentColor={YELLOW}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 4：关键结论（330–390帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage4: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 330, 25);
  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
      <TheoremBox title="插补精度结论" width={960} opacity={1}>
        <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', fontSize: 30, color: FORMULA }}>
            <span dangerouslySetInnerHTML={{
              __html: math('\\sin(\\Delta\\theta)\\approx\\Delta\\theta,\\quad\\Delta\\theta=0.001\\,\\text{rad}', true)
            }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 26, color: YELLOW, marginTop: 8 }}>
            误差：
            <span dangerouslySetInnerHTML={{ __html: math('<2\\times10^{-10}\\,\\text{m}') }} />
            （亚纳米级）
          </div>
          <div style={{ textAlign: 'center', fontSize: 20, color: TEXT }}>
            步进角 0.001 rad 时，仅取一次项即满足工业 nm 精度要求
          </div>
        </div>
      </TheoremBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 5：Polanyi可视化（390–480帧）
// 2D多曲线：sin(x)精确值 vs P3/P5/P7/P9，展示"有效范围随阶数扩大"
// 右侧：水平条形图——每阶多项式的有效范围（误差<0.001）
// ─────────────────────────────────────────────────────────────────────────────
const Stage5: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 390, 30);

  // 各阶逐步出现
  const p3Op = fade(frame, 395, 14);
  const p5Op = fade(frame, 415, 14);
  const p7Op = fade(frame, 435, 14);
  const p9Op = fade(frame, 455, 14);
  const rangeOp = fade(frame, 458, 15);

  // sin(x) 更高阶Taylor展开（更宽的x范围 [-π, π]）
  const sinT3x = (x: number) => x - Math.pow(x, 3) / 6;
  const sinT5x = (x: number) => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120;
  const sinT7x = (x: number) => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120 - Math.pow(x, 7) / 5040;
  const sinT9x = (x: number) => x - Math.pow(x, 3) / 6 + Math.pow(x, 5) / 120
    - Math.pow(x, 7) / 5040 + Math.pow(x, 9) / 362880;

  // 有效范围数据（|sin(x)-Pn(x)| < 0.001 的近似临界值）
  const rangeData = [
    { label: 'P₃', range: 0.67, color: PURPLE,  note: '≈0.67 rad' },
    { label: 'P₅', range: 1.26, color: GREEN,   note: '≈1.26 rad' },
    { label: 'P₇', range: 1.96, color: YELLOW,  note: '≈1.96 rad' },
    { label: 'P₉', range: 2.68, color: ORANGE,  note: '≈2.68 rad' },
  ];
  const maxRange = Math.PI + 0.1; // π ≈ 3.14

  // 有效范围条形图 SVG 参数
  const RW = 340, RH = 250;
  const rL = 55, rR = 65, rT = 18, rB = 35;
  const rPlotW = RW - rL - rR;
  const rPlotH = RH - rT - rB;
  const rowH = rPlotH / rangeData.length;

  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ color: ORANGE, fontSize: 22, fontWeight: 'bold' }}>
        📐 Polanyi直觉：次数越高，多项式在更大范围内"拥抱"sin(x)
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* 左：2D曲线对比（宽x范围）*/}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 16, color: '#ff5555', fontWeight: 'bold' }}>
            sin(x) 精确值 vs 各阶 Taylor 多项式（x ∈ [-π, π]）
          </div>
          <div style={{ width: 560, height: 340 }}>
            <CoordinateSystem width={560} height={340}
              xRange={[-Math.PI, Math.PI]} yRange={[-1.6, 1.6]}
              showGrid={true} gridStep={Math.PI / 4} showLabels={true}>
              {/* sin(x) 真实函数 */}
              <FunctionPlot fn={Math.sin} color="white" strokeWidth={3.5} opacity={0.95} />
              {/* P3 */}
              {p3Op > 0.02 && <FunctionPlot fn={sinT3x} color={PURPLE} strokeWidth={2.5} opacity={p3Op * 0.9} />}
              {/* P5 */}
              {p5Op > 0.02 && <FunctionPlot fn={sinT5x} color={GREEN}  strokeWidth={2.5} opacity={p5Op * 0.9} />}
              {/* P7 */}
              {p7Op > 0.02 && <FunctionPlot fn={sinT7x} color={YELLOW} strokeWidth={2.5} opacity={p7Op * 0.9} />}
              {/* P9 */}
              {p9Op > 0.02 && <FunctionPlot fn={sinT9x} color={ORANGE} strokeWidth={2.5} opacity={p9Op * 0.9} />}
            </CoordinateSystem>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: TEXT }}>
            <span><span style={{ color: 'white' }}>──</span> sin(x) 精确</span>
            {p3Op > 0.1 && <span><span style={{ color: PURPLE }}>──</span> P₃</span>}
            {p5Op > 0.1 && <span><span style={{ color: GREEN }}>──</span> P₅</span>}
            {p7Op > 0.1 && <span><span style={{ color: YELLOW }}>──</span> P₇</span>}
            {p9Op > 0.1 && <span><span style={{ color: ORANGE }}>──</span> P₉</span>}
          </div>
        </div>

        {/* 右：有效范围条形图 */}
        <div style={{ opacity: rangeOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 16, color: ORANGE, fontWeight: 'bold', textAlign: 'center' }}>
            有效范围（误差 &lt; 0.001）<br />
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 'normal' }}>随多项式阶数增大而扩展</span>
          </div>
          <svg width={RW} height={RH} style={{ background: 'rgba(255,184,108,0.04)', borderRadius: 8 }}>
            {/* X轴（中心线）*/}
            <line x1={rL} y1={rT + rPlotH} x2={rL + rPlotW} y2={rT + rPlotH}
              stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
            {/* π参考线 */}
            {(() => {
              const px = rL + (Math.PI / maxRange) * rPlotW;
              return (
                <g>
                  <line x1={px} y1={rT} x2={px} y2={rT + rPlotH}
                    stroke={YELLOW} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
                  <text x={px} y={rT - 4} textAnchor="middle" fontSize={11} fill={YELLOW} opacity={0.8}>π</text>
                </g>
              );
            })()}
            {/* 每行：有效范围水平条 */}
            {rangeData.map(({ label, range, color, note }, idx) => {
              const y = rT + idx * rowH + rowH * 0.2;
              const barH2 = rowH * 0.55;
              const barW = (range / maxRange) * rPlotW;
              return (
                <g key={label}>
                  {/* 背景行 */}
                  <rect x={rL} y={y} width={rPlotW} height={barH2}
                    fill={color} opacity={0.08} rx={3} />
                  {/* 有效范围条 */}
                  <rect x={rL} y={y} width={barW} height={barH2}
                    fill={color} opacity={0.85} rx={3} />
                  {/* 标签 */}
                  <text x={rL - 6} y={y + barH2 / 2 + 5} textAnchor="end" fontSize={14}
                    fill={color} fontWeight="bold">{label}</text>
                  {/* 数值 */}
                  <text x={rL + barW + 6} y={y + barH2 / 2 + 5} fontSize={12}
                    fill={color} opacity={0.9}>{note}</text>
                </g>
              );
            })}
            {/* X轴刻度 */}
            {[0, 1, 2, 3].map(v => {
              const px = rL + (v / maxRange) * rPlotW;
              return (
                <g key={v}>
                  <line x1={px} y1={rT + rPlotH} x2={px} y2={rT + rPlotH + 5}
                    stroke={TEXT} strokeWidth={1} opacity={0.45} />
                  <text x={px} y={rT + rPlotH + 18} textAnchor="middle" fontSize={11}
                    fill={TEXT} opacity={0.6}>{v}</text>
                </g>
              );
            })}
            <text x={rL + rPlotW / 2} y={rT + rPlotH + 32} textAnchor="middle" fontSize={11}
              fill={TEXT} opacity={0.5}>有效范围（rad）</text>
          </svg>
          {/* ARM 工程注释 */}
          <div style={{ fontSize: 13, color: TEXT, maxWidth: 340, lineHeight: 1.6,
            padding: '10px 14px', background: 'rgba(255,184,108,0.08)', borderRadius: 8,
            borderLeft: `3px solid ${ORANGE}` }}>
            <span style={{ color: ORANGE, fontWeight: 'bold' }}>ARM Cortex-M 实际数据：</span><br />
            浮点库用 P₇（7次多项式）计算 sin，在{' '}
            <span dangerouslySetInnerHTML={{ __html: 'x ∈ [-π/4, π/4]' }} />
            {' '}内误差小于机器精度（约 2×10⁻⁷）
          </div>
        </div>
      </div>
      <div style={{ fontSize: 18, color: TEXT, textAlign: 'center', maxWidth: 960 }}>
        P₃在 x≈0.7 处开始偏离 sin(x)；P₉几乎在整个[-π,π]范围内精确 ——{' '}
        <span style={{ color: ORANGE }}>这就是"用多少项才够用"的工程直觉</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 6：总结（480–540帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage6: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 480, 25);
  const plotOp = fade(frame, 495, 20);

  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold' }}>💡 工程总结：泰勒近似在嵌入式控制器中的应用</div>
      <div style={{ opacity: plotOp, width: 800, height: 280 }}>
        <CoordinateSystem
          width={800}
          height={280}
          xRange={[-0.5, 0.5]}
          yRange={[-0.6, 0.6]}
          showGrid={true}
        >
          {/* 精确 sin(x) */}
          <FunctionPlot fn={(x) => Math.sin(x)} color="#ff5555" strokeWidth={3} opacity={0.9} />
          {/* T1 */}
          <FunctionPlot fn={sinT1} color={YELLOW} strokeWidth={2} opacity={0.8} />
          {/* T3 */}
          <FunctionPlot fn={sinT3} color={GREEN} strokeWidth={2} opacity={0.8} />
          {/* T5 */}
          <FunctionPlot fn={sinT5} color={CYAN} strokeWidth={2} opacity={0.8} />
        </CoordinateSystem>
      </div>
      <div style={{ display: 'flex', gap: 20, fontSize: 20, color: TEXT }}>
        <span><span style={{ color: '#ff5555' }}>──</span> 精确 sin(x)</span>
        <span><span style={{ color: YELLOW }}>──</span> T₁</span>
        <span><span style={{ color: GREEN }}>──</span> T₃</span>
        <span><span style={{ color: CYAN }}>──</span> T₅</span>
      </div>
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          `<strong style='color:${ORANGE}'>CORDIC 算法</strong>：另一种嵌入式三角函数实现，仅用移位/加法，与泰勒法各有优势`,
          `步进角越小（精度越高），泰勒展开所需项数越少；Δθ≤0.01 rad 时取1项已足够`,
          `嵌入式工程准则：先确定精度需求（如 1 nm），再倒推所需泰勒阶数（避免过度计算）`,
        ].map((text, i) => (
          <div
            key={i}
            style={{
              opacity: fade(frame, 500 + i * 12, 14),
              fontSize: 22,
              color: TEXT,
              paddingLeft: 16,
              borderLeft: `3px solid ${ORANGE}`,
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（540帧，6阶段）
// ─────────────────────────────────────────────────────────────────────────────
const Sec10_IM_Approx: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>
      {scene === 1 && <Stage1 frame={frame} />}
      {scene === 2 && <Stage2 frame={frame} />}
      {scene === 3 && <Stage3 frame={frame} />}
      {scene === 4 && <Stage4 frame={frame} />}
      {scene === 5 && <Stage5 frame={frame} />}
      {scene === 6 && <Stage6 frame={frame} />}
    </AbsoluteFill>
  );
};

const WSec10_IM_Approx = withWatermark(Sec10_IM_Approx);
export default WSec10_IM_Approx;
