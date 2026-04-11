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
// 傅里叶方波近似函数
// f_N(x) = (4/π) * Σ_{k=0}^{N-1} sin((2k+1)x)/(2k+1)
// ─────────────────────────────────────────────────────────────────────────────
const squareApprox = (x: number, terms: number): number => {
  let sum = 0;
  for (let k = 0; k < terms; k++) {
    sum += Math.sin((2 * k + 1) * x) / (2 * k + 1);
  }
  return (4 / Math.PI) * sum;
};

// ─────────────────────────────────────────────────────────────────────────────
// 共用子组件
// ─────────────────────────────────────────────────────────────────────────────
interface AnalysisItemProps {
  index: number;
  text: string;
  opacity: number;
  accentColor?: string;
}
const AnalysisItem: React.FC<AnalysisItemProps> = ({ index, text, opacity, accentColor = CYAN }) => (
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
const StepRow: React.FC<StepRowProps> = ({ label, content, note, opacity, accentColor = CYAN }) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '12px 20px',
      background: 'rgba(139,233,253,0.05)',
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
// Stage 1：标题卡 + 方波信号展示（0–60帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage1: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 0, 30);
  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <TitleCard
        chapterNum="12"
        chapterTitle="无穷级数"
        sectionNum="IM-01"
        sectionTitle="PLC信号低通滤波 · 傅里叶级数分析"
        opacity={1}
      />
      <div style={{ width: 860, marginTop: 8 }}>
        <ExampleBox
          exampleNum="工程背景"
          title="工业PLC信号滤波"
          width={860}
          opacity={1}
          accentColor={CYAN}
        >
          <div style={{ padding: '10px 0', fontSize: 22, color: TEXT, lineHeight: 1.8 }}>
            <div>
              工业PLC采集的传感器信号（开关量/脉冲量）常含<strong style={{ color: ORANGE }}>高频噪声</strong>。
            </div>
            <div>
              通过<strong style={{ color: CYAN }}>傅里叶级数分解</strong>，保留低频谐波（主信号），截断高频谐波（噪声），实现<strong style={{ color: GREEN }}>低通滤波</strong>。
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
      <div style={{ color: CYAN, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 工程分析</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <AnalysisItem
          index={1}
          opacity={fade(frame, 65, 15)}
          text={`工业方波信号（开关量）：${math('f(x)=\\text{sign}(\\sin x)\\in\\{-1,+1\\}')}`}
        />
        <AnalysisItem
          index={2}
          opacity={fade(frame, 83, 15)}
          text={`傅里叶展开：${math('f(x)=\\dfrac{4}{\\pi}\\left[\\sin x+\\dfrac{\\sin 3x}{3}+\\dfrac{\\sin 5x}{5}+\\cdots\\right]')}`}
        />
        <AnalysisItem
          index={3}
          opacity={fade(frame, 101, 15)}
          text={`截断至第 k 项 = 保留前 k 个奇次谐波 → <strong style='color:${GREEN}'>低通滤波</strong>`}
        />
        <AnalysisItem
          index={4}
          opacity={fade(frame, 119, 15)}
          text={`谐波频率越高对波形<strong style='color:${ORANGE}'>"锐利度"</strong>贡献越大；滤除后信号变<strong style='color:${GREEN}'>光滑</strong>`}
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
    <div style={{ opacity: op, width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ color: CYAN, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 傅里叶分解</div>
      <StepRow
        label="Step 1"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('f(x)=\\dfrac{4}{\\pi}\\sum_{k=0}^{\\infty}\\dfrac{\\sin((2k+1)x)}{2k+1}')
          }} />
        }
        note="方波傅里叶展开式"
        opacity={step1Op}
        accentColor={PURPLE}
      />
      <StepRow
        label="Step 2"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('f_1(x)=\\dfrac{4}{\\pi}\\sin(x)\\approx 1.273\\sin(x)')
          }} />
        }
        note="保留基频（k=0）"
        opacity={step2Op}
        accentColor={CYAN}
      />
      <StepRow
        label="Step 3"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('f_3=\\dfrac{4}{\\pi}\\!\\left(\\sin x+\\dfrac{\\sin 3x}{3}+\\dfrac{\\sin 5x}{5}\\right)')
          }} />
        }
        note="前3谐波（k=0,1,2）"
        opacity={step3Op}
        accentColor={GREEN}
      />
      <StepRow
        label="Step 4"
        content={
          <span dangerouslySetInnerHTML={{
            __html: math('\\text{截断}k=4:\\;\\text{余项}<\\dfrac{4}{9\\pi}<0.142,\\;\\text{实际取}5\\text{–}10\\text{项}')
          }} />
        }
        note="工程精度估计"
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
      <TheoremBox title="低通滤波原理" width={940} opacity={1}>
        <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', fontSize: 28, color: FORMULA }}>
            <span dangerouslySetInnerHTML={{ __html: math('f(x)\\approx\\dfrac{4}{\\pi}\\sum_{k=0}^{N-1}\\dfrac{\\sin((2k+1)x)}{2k+1}', true) }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 24, color: YELLOW, marginTop: 8 }}>
            低通滤波：保留前 N 项谐波，
            <span dangerouslySetInnerHTML={{ __html: math('\\text{SNR}\\propto N') }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 20, color: TEXT }}>
            N 越大，逼近越精确，信噪比越高；工业场景通常取 N = 5~10
          </div>
        </div>
      </TheoremBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 5：Polanyi双面板可视化（390–480帧）
// 左：时域信号 f(t)=sin(t)+0.5sin(3t)+0.3sin(5t) 逐步合成
// 右：频谱图——各频率成分的幅度柱形图
// ─────────────────────────────────────────────────────────────────────────────
const Stage5: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 390, 30);

  // 三个频率分量逐步叠加
  const comp1Op = fade(frame, 393, 12); // sin(t)
  const comp2Op = fade(frame, 408, 12); // + 0.5sin(3t)
  const comp3Op = fade(frame, 423, 12); // + 0.3sin(5t)
  const specOp  = fade(frame, 438, 15); // 频谱图出现
  const arrowOp = fade(frame, 452, 12); // "翻译"箭头

  // 三个时域信号函数
  const f1   = (x: number) => Math.sin(x);
  const f12  = (x: number) => Math.sin(x) + 0.5 * Math.sin(3 * x);
  const f123 = (x: number) => Math.sin(x) + 0.5 * Math.sin(3 * x) + 0.3 * Math.sin(5 * x);

  // 频谱 SVG 参数
  const SPW = 340, SPH = 300;
  const spL = 48, spR = 16, spT = 18, spB = 36;
  const spPlotW = SPW - spL - spR;
  const spPlotH = SPH - spT - spB;
  const freqs = [
    { n: 1, amp: 1.0,  label: 'f₁',  color: PURPLE },
    { n: 3, amp: 0.5,  label: '3f₁', color: GREEN  },
    { n: 5, amp: 0.3,  label: '5f₁', color: YELLOW },
  ];
  const ampMax = 1.15;
  const bStep = spPlotW / (freqs.length + 1);
  const bW = bStep * 0.55;

  // 当前显示哪些频谱柱
  const specBarsShown = comp1Op > 0.5 ? (comp2Op > 0.5 ? (comp3Op > 0.5 ? 3 : 2) : 1) : 0;

  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ color: CYAN, fontSize: 22, fontWeight: 'bold' }}>
        🎚 Polanyi核心：时域信号（左）与频域频谱（右）是同一信号的两种语言
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* 左：时域信号（CoordinateSystem + FunctionPlot）*/}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 16, color: CYAN, fontWeight: 'bold' }}>
            时域：f(t) = sin(t) + 0.5sin(3t) + 0.3sin(5t)
          </div>
          <div style={{ width: 540, height: 310 }}>
            <CoordinateSystem width={540} height={310}
              xRange={[-Math.PI, Math.PI]} yRange={[-1.9, 1.9]}
              showGrid={true} gridStep={Math.PI / 2}>
              {/* 基频 sin(t) */}
              {comp1Op > 0.02 && <FunctionPlot fn={f1}   color={PURPLE} strokeWidth={2}   opacity={comp1Op * 0.7} />}
              {/* 加上三次谐波 */}
              {comp2Op > 0.02 && <FunctionPlot fn={f12}  color={GREEN}  strokeWidth={2.5} opacity={comp2Op * 0.75} />}
              {/* 加上五次谐波（合成信号） */}
              {comp3Op > 0.02 && <FunctionPlot fn={f123} color={CYAN}   strokeWidth={3}   opacity={comp3Op} />}
            </CoordinateSystem>
          </div>
          {/* 图例 */}
          <div style={{ display: 'flex', gap: 16, fontSize: 15, color: TEXT }}>
            {comp1Op > 0.1 && <span><span style={{ color: PURPLE }}>──</span> sin(t)</span>}
            {comp2Op > 0.1 && <span><span style={{ color: GREEN }}>──</span> +0.5sin(3t)</span>}
            {comp3Op > 0.1 && <span><span style={{ color: CYAN }}>──</span> 合成信号</span>}
          </div>
        </div>

        {/* 中间：翻译箭头 */}
        <div style={{ opacity: arrowOp, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: 310, gap: 8, paddingTop: 30 }}>
          <div style={{ color: YELLOW, fontSize: 28 }}>⟺</div>
          <div style={{ color: YELLOW, fontSize: 14, fontWeight: 'bold', textAlign: 'center', maxWidth: 60 }}>
            Fourier<br/>变换
          </div>
        </div>

        {/* 右：频谱图（SVG）*/}
        <div style={{ opacity: specOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 16, color: ORANGE, fontWeight: 'bold' }}>
            频域：各频率分量幅度
          </div>
          <svg width={SPW} height={SPH} style={{ background: 'rgba(255,184,108,0.04)', borderRadius: 8 }}>
            {/* 坐标轴 */}
            <line x1={spL} y1={spT} x2={spL} y2={spT + spPlotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
            <line x1={spL} y1={spT + spPlotH} x2={spL + spPlotW} y2={spT + spPlotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
            {/* Y轴刻度 */}
            {[0.3, 0.6, 0.9].map(v => {
              const py = spT + spPlotH - (v / ampMax) * spPlotH;
              return (
                <g key={v}>
                  <line x1={spL} y1={py} x2={spL + spPlotW} y2={py} stroke={TEXT} strokeWidth={0.5} opacity={0.2} strokeDasharray="4,3" />
                  <text x={spL - 5} y={py + 4} textAnchor="end" fontSize={10} fill={TEXT} opacity={0.6}>{v.toFixed(1)}</text>
                </g>
              );
            })}
            {/* 频谱柱形 */}
            {freqs.slice(0, specBarsShown).map(({ n, amp, label, color }, idx) => {
              const bh = (amp / ampMax) * spPlotH;
              const bx = spL + (idx + 0.75) * bStep;
              const by = spT + spPlotH - bh;
              return (
                <g key={n}>
                  <rect x={bx} y={by} width={bW} height={bh} fill={color} opacity={0.85} rx={3} />
                  <text x={bx + bW / 2} y={by - 6} textAnchor="middle" fontSize={12} fill={color} fontWeight="bold">
                    {amp.toFixed(1)}
                  </text>
                  <text x={bx + bW / 2} y={spT + spPlotH + 18} textAnchor="middle" fontSize={13} fill={TEXT} opacity={0.75}>{label}</text>
                </g>
              );
            })}
            {/* X轴标注 */}
            <text x={spL + spPlotW / 2} y={spT + spPlotH + 33} textAnchor="middle" fontSize={11} fill={TEXT} opacity={0.55}>频率</text>
          </svg>
          {/* 说明 */}
          {specBarsShown >= 3 && (
            <div style={{ fontSize: 14, color: TEXT, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
              频谱图是信号的"DNA"：<br />
              3根柱子 = 3个频率成分<br />
              <span style={{ color: ORANGE }}>音频均衡器（EQ）</span>正是在此调节各频率幅度
            </div>
          )}
        </div>
      </div>
      <div style={{ fontSize: 19, color: TEXT, textAlign: 'center', maxWidth: 920, marginTop: 4 }}>
        左图逐步叠加谐波，右图对应频谱柱逐一出现——这就是Fourier变换的Polanyi直觉
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 6：总结（480–540帧）
// ─────────────────────────────────────────────────────────────────────────────
const Stage6: React.FC<{ frame: number }> = ({ frame }) => {
  const op = fade(frame, 480, 25);

  // 也展示一个 2D 对比图
  const plotOp = fade(frame, 495, 20);

  return (
    <div style={{ opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ color: CYAN, fontSize: 30, fontWeight: 'bold' }}>💡 工程总结：PLC信号滤波配置</div>
      <div style={{ opacity: plotOp, width: 800, height: 280 }}>
        <CoordinateSystem
          width={800}
          height={280}
          xRange={[-Math.PI, Math.PI]}
          yRange={[-1.5, 1.5]}
          showGrid={true}
        >
          {/* 方波 N=1 */}
          <FunctionPlot fn={(x) => squareApprox(x, 1)} color={PURPLE} strokeWidth={2} opacity={0.7} />
          {/* 方波 N=5 */}
          <FunctionPlot fn={(x) => squareApprox(x, 5)} color={GREEN} strokeWidth={2} opacity={0.8} />
          {/* 方波 N=15 */}
          <FunctionPlot fn={(x) => squareApprox(x, 15)} color={CYAN} strokeWidth={2.5} opacity={0.9} />
        </CoordinateSystem>
      </div>
      <div style={{ display: 'flex', gap: 24, fontSize: 20, color: TEXT }}>
        <span><span style={{ color: PURPLE }}>──</span> N=1（基频）</span>
        <span><span style={{ color: GREEN }}>──</span> N=5（5阶）</span>
        <span><span style={{ color: CYAN }}>──</span> N=15（15阶）</span>
      </div>
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          `数字滤波器阶数 N 越高，截止频率越精确，但<strong style='color:${ORANGE}'>计算量增大</strong>`,
          `PLC 实时控制（1–10 ms周期）通常取 N=5~10，满足精度与实时性平衡`,
          `Gibbs 现象：在不连续点处永远存在约 9% 的过冲（无法消除，只能用加权平滑）`,
        ].map((text, i) => (
          <div
            key={i}
            style={{
              opacity: fade(frame, 500 + i * 12, 14),
              fontSize: 22,
              color: TEXT,
              paddingLeft: 16,
              borderLeft: `3px solid ${CYAN}`,
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
const Sec09_IM_Signal: React.FC = () => {
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

const WSec09_IM_Signal = withWatermark(Sec09_IM_Signal);
export default WSec09_IM_Signal;
