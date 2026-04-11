import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem } from '../../components/math/CoordinateSystem';
import { FunctionPlot } from '../../components/math/FunctionPlot';
import { FourierSeries } from '../../components/math/FourierSeries';
import { withWatermark } from '../../components/ui/Watermark';

// ─── 工具函数 ─────────────────────────────────────────────────────────────────
const fade = (f: number, start: number, dur = 20): number =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const math = (s: string, d = false): string =>
  katex.renderToString(s, { throwOnError: false, displayMode: d });

// ─── 颜色常量 ─────────────────────────────────────────────────────────────────
const BG     = COLORS.background;
const ACCENT = COLORS.primaryCurve ?? '#61dafb';
const TEXT   = COLORS.annotation ?? '#94a3b8';
const FORMULA = COLORS.formula ?? '#f8f8f2';
const PURPLE = '#bd93f9';
const GREEN  = '#50fa7b';
const YELLOW = '#f1fa8c';
const ORANGE = '#ffb86c';
const RED    = '#ff5555';

// ─── 共用子组件 ───────────────────────────────────────────────────────────────
const AItem: React.FC<{
  i: number; text: string; op: number; color?: string;
}> = ({ i, text, op, color = ACCENT }) => (
  <div style={{ opacity: op, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 26, color: TEXT }}>
    <span style={{ color, fontWeight: 'bold', minWidth: 28 }}>{i}.</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

const SRow: React.FC<{
  label: string; content: React.ReactNode; note: string; op: number; color?: string;
}> = ({ label, content, note, op, color = ACCENT }) => (
  <div style={{
    opacity: op, display: 'flex', alignItems: 'center', gap: 20,
    padding: '12px 20px', background: 'rgba(97,218,251,0.06)',
    borderRadius: 8, borderLeft: `3px solid ${color}`,
  }}>
    <span style={{ color, fontSize: 20, minWidth: 100, fontWeight: 'bold' }}>{label}</span>
    <span style={{ color: FORMULA, fontSize: 20, flex: 1 }}>{content}</span>
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 例题1（帧 0–539，540帧）
// p级数收敛性判断：调和级数（发散）vs Basel问题（收敛=π²/6）
// ─────────────────────────────────────────────────────────────────────────────
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // Scene 5：逐列显示柱形图（帧395→473，共20列）
  const PI2_6 = Math.PI * Math.PI / 6; // ≈ 1.6449
  const N_BARS = 20;
  const barsShown = Math.min(
    N_BARS,
    Math.floor(interpolate(frame, [395, 473], [0, N_BARS + 0.5], clamp))
  );

  const getInvSqSum = (N: number): number => {
    let s = 0; for (let k = 1; k <= N; k++) s += 1 / (k * k); return s;
  };
  const getHarmSum = (N: number): number => {
    let s = 0; for (let k = 1; k <= N; k++) s += 1 / k; return s;
  };

  // SVG bar chart 参数
  const PW = 490, PH = 280;
  const pL = 52, pR = 22, pT = 20, pB = 36;
  const plotW = PW - pL - pR, plotH = PH - pT - pB;
  const bStep = plotW / N_BARS;
  const bW = bStep * 0.66;
  const yPx = (v: number, yMax: number) =>
    pT + plotH - Math.min(Math.max(v, 0), yMax) / yMax * plotH;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Scene 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十二章 · 无穷级数 · 例题 1 / 3
          </div>
          <ExampleBox exampleNum="例1" title="p级数收敛性判断（Basel问题）"
            width={1080} opacity={1} accentColor={ACCENT}>
            <div style={{ padding: '12px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>判断以下两个级数是否收敛，并分析边界条件：</div>
              <div style={{ display: 'flex', gap: 60, justifyContent: 'center', margin: '18px 0' }}>
                <span>
                  <span style={{ color: RED, fontWeight: 'bold' }}>问题1（发散）：</span>
                  <span dangerouslySetInnerHTML={{ __html: math('\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n}', true) }} />
                </span>
                <span>
                  <span style={{ color: ACCENT, fontWeight: 'bold' }}>问题2（收敛）：</span>
                  <span dangerouslySetInnerHTML={{ __html: math('\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^2}', true) }} />
                </span>
              </div>
              <div style={{ fontSize: 19, color: TEXT, opacity: 0.85, marginTop: 6 }}>
                🔗 工程背景：幂律网络（如互联网路由）的总连接数是否有界，取决于指数p的值
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Scene 2: 背景与方法 ── */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, 60, 20), width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📜 历史背景与积分判别法</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AItem i={1} op={fade(frame, 65, 15)} color={ACCENT}
              text={`<strong>p级数定义</strong>：${math('\\sum_{n=1}^\\infty \\frac{1}{n^p}')}，p的大小决定收敛性（p=1 是临界点）`} />
            <AItem i={2} op={fade(frame, 83, 15)} color={YELLOW}
              text={`<strong style='color:${YELLOW}'>Basel问题</strong>（1650年）：${math('\\sum_{n=1}^\\infty \\frac{1}{n^2}=?')}`
                + `，Euler（1735年）首次证明 ${math('=\\dfrac{\\pi^2}{6}')}`} />
            <AItem i={3} op={fade(frame, 101, 15)} color={GREEN}
              text={`<strong>积分判别法</strong>：${math('f(x)\\geq 0')} 单调递减时，${math('\\sum_{n=1}^\\infty f(n)')} 与 ${math('\\int_1^{\\infty}f(x)\\,dx')} 同敛散`} />
            <AItem i={4} op={fade(frame, 119, 15)} color={ORANGE}
              text={`核心直觉：${math('\\int_1^\\infty \\frac{1}{x}dx=\\infty')}（面积无限）vs `
                + `${math('\\int_1^\\infty \\frac{1}{x^2}dx=1')}（面积有限）`} />
          </div>
        </div>
      )}

      {/* ── Scene 3: 分步推导 ── */}
      {scene === 3 && (
        <div style={{ opacity: fade(frame, 150, 20), width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 积分判别法应用</div>
          <SRow label="Step 1" color={PURPLE} op={fade(frame, 155, 20)} note="满足单调递减条件"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('f(x)=\\tfrac{1}{x^p}\\geq 0\\text{ 且单调递减}\\;(x\\geq 1)，\\text{满足积分判别法条件}') }} />} />
          <SRow label="Step 2（p=1）" color={RED} op={fade(frame, 200, 20)} note="调和级数 → 发散"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('\\int_1^\\infty\\!\\frac{1}{x}\\,dx=\\ln x\\Big|_1^\\infty=+\\infty\\;\\Longrightarrow\\;\\sum\\frac{1}{n}\\;\\textbf{发散}') }} />} />
          <SRow label="Step 3（p=2）" color={ACCENT} op={fade(frame, 245, 20)} note="Basel级数 → 收敛"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('\\int_1^\\infty\\!\\frac{1}{x^2}\\,dx=\\!\\left[-\\frac{1}{x}\\right]_1^\\infty=0-(-1)=1<\\infty\\;\\Longrightarrow\\;\\sum\\frac{1}{n^2}\\;\\textbf{收敛}') }} />} />
          <SRow label="Step 4（一般p）" color={GREEN} op={fade(frame, 290, 20)} note="p=1是临界值"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('\\int_1^\\infty x^{-p}dx=\\begin{cases}\\dfrac{1}{p-1}&p>1\\\\+\\infty&p\\leq 1\\end{cases}\\;\\Longrightarrow\\;p>1\\text{收敛，}p\\leq 1\\text{发散}') }} />} />
        </div>
      )}

      {/* ── Scene 4: 定理框 ── */}
      {scene === 4 && (
        <div style={{ opacity: fade(frame, 330, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="p级数审敛定理" width={980} opacity={1}>
            <div style={{ textAlign: 'center', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontSize: 38, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('\\sum_{n=1}^{\\infty}\\frac{1}{n^p}\\;\\begin{cases}\\text{收敛，}\\sum\\frac{1}{n^2}=\\dfrac{\\pi^2}{6}&p>1\\\\[8pt]\\text{发散（调和级数）}&p\\leq 1\\end{cases}', true) }} />
              <div style={{ fontSize: 22, color: YELLOW }}>
                临界值 p=1 是分界线 —— "趋零不够快"导致发散
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Scene 5: Polanyi可视化——部分和逼近/发散的动态过程 ── */}
      {scene === 5 && (
        <div style={{ opacity: fade(frame, 390, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold' }}>
            📊 Polanyi直觉：部分和"逼近"是动态过程，不是静态极限
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

            {/* 左面板：1/n² 收敛 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 18, color: ACCENT, fontWeight: 'bold', textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: math('S_N=\\sum_{n=1}^{N}\\tfrac{1}{n^2}') }} />
                {' '}收敛 →{' '}
                <span style={{ color: YELLOW }} dangerouslySetInnerHTML={{ __html: math('\\pi^2/6\\approx1.645') }} />
              </div>
              <svg width={PW} height={PH} style={{ background: 'rgba(97,218,251,0.04)', borderRadius: 8 }}>
                {/* Y轴 */}
                <line x1={pL} y1={pT} x2={pL} y2={pT + plotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                {/* X轴 */}
                <line x1={pL} y1={pT + plotH} x2={pL + plotW} y2={pT + plotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                {/* 网格线 */}
                {[0.5, 1.0, 1.5].map(v => {
                  const py = yPx(v, 2.0);
                  return (
                    <g key={v}>
                      <line x1={pL} y1={py} x2={pL + plotW} y2={py} stroke={TEXT} strokeWidth={0.5} opacity={0.22} strokeDasharray="4,3" />
                      <text x={pL - 5} y={py + 4} textAnchor="end" fontSize={11} fill={TEXT} opacity={0.6}>{v.toFixed(1)}</text>
                    </g>
                  );
                })}
                {/* 极限虚线 π²/6 */}
                {(() => {
                  const ly = yPx(PI2_6, 2.0);
                  return (
                    <g>
                      <line x1={pL} y1={ly} x2={pL + plotW} y2={ly} stroke={YELLOW} strokeWidth={2.5} strokeDasharray="9,5" />
                      <text x={pL + plotW + 4} y={ly + 4} fontSize={12} fill={YELLOW} fontWeight="bold">π²/6</text>
                    </g>
                  );
                })()}
                {/* 柱形（逐列显示）*/}
                {Array.from({ length: barsShown }, (_, i) => {
                  const n = i + 1;
                  const sv = getInvSqSum(n);
                  const bh = Math.min(sv / 2.0, 1) * plotH;
                  const bx = pL + i * bStep + bStep * 0.17;
                  const by = pT + plotH - bh;
                  return <rect key={n} x={bx} y={by} width={bW} height={bh} fill={ACCENT} opacity={0.82} rx={2} />;
                })}
                {/* X轴标签 */}
                {[5, 10, 15, 20].map(n => (
                  <text key={n} x={pL + (n - 0.5) * bStep} y={pT + plotH + 22} textAnchor="middle" fontSize={11} fill={TEXT} opacity={0.6}>N={n}</text>
                ))}
              </svg>
            </div>

            {/* 右面板：1/n 发散 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 18, color: RED, fontWeight: 'bold', textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: math('S_N=\\sum_{n=1}^{N}\\tfrac{1}{n}') }} />
                {' '}无上界 → ∞
              </div>
              <svg width={PW} height={PH} style={{ background: 'rgba(255,85,85,0.04)', borderRadius: 8 }}>
                <line x1={pL} y1={pT} x2={pL} y2={pT + plotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                <line x1={pL} y1={pT + plotH} x2={pL + plotW} y2={pT + plotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                {[1.0, 2.0, 3.0].map(v => {
                  const py = yPx(v, 3.8);
                  return (
                    <g key={v}>
                      <line x1={pL} y1={py} x2={pL + plotW} y2={py} stroke={TEXT} strokeWidth={0.5} opacity={0.22} strokeDasharray="4,3" />
                      <text x={pL - 5} y={py + 4} textAnchor="end" fontSize={11} fill={TEXT} opacity={0.6}>{v.toFixed(1)}</text>
                    </g>
                  );
                })}
                {Array.from({ length: barsShown }, (_, i) => {
                  const n = i + 1;
                  const sv = Math.min(getHarmSum(n), 3.8);
                  const bh = (sv / 3.8) * plotH;
                  const bx = pL + i * bStep + bStep * 0.17;
                  const by = pT + plotH - bh;
                  const over = getHarmSum(n) >= 3.8;
                  return (
                    <g key={n}>
                      <rect x={bx} y={by} width={bW} height={bh} fill={RED} opacity={0.8} rx={2} />
                      {over && <text x={bx + bW / 2} y={pT + 8} textAnchor="middle" fontSize={9} fill={RED} opacity={0.9}>↑</text>}
                    </g>
                  );
                })}
                {barsShown >= 13 && (
                  <text x={pL + plotW * 0.58} y={pT + 26} textAnchor="middle" fontSize={14} fill={RED} opacity={0.9} fontWeight="bold">无上界！→ ∞</text>
                )}
                {[5, 10, 15, 20].map(n => (
                  <text key={n} x={pL + (n - 0.5) * bStep} y={pT + plotH + 22} textAnchor="middle" fontSize={11} fill={TEXT} opacity={0.6}>N={n}</text>
                ))}
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 20, color: TEXT, marginTop: 4, textAlign: 'center' }}>
            <span style={{ color: ACCENT }}>1/n²</span>：部分和稳定趋近 π²/6（"逼近"过程可见）；
            <span style={{ color: RED }}> 1/n</span>：部分和无限增长（"发散"过程可见）
          </div>
        </div>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: fade(frame, 480, 25), width: 940, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>💡 小结：p级数收敛判断</div>
          {[
            `p级数 ${math('\\sum 1/n^p')}：p=1 是<strong style='color:${ORANGE}'>收敛/发散临界点</strong>`,
            `积分判别法：面积有限（${math('\\int_1^\\infty f dx<\\infty')}）⟺ 级数收敛`,
            `Basel问题（p=2）：答案 ${math('\\pi^2/6')} 展示级数与 π 的深层联系`,
            `工程意义：幂律分布（PageRank、社交网络）总量是否有界依赖指数是否 >1`,
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(frame, 484 + i * 12, 14), display: 'flex', alignItems: 'flex-start',
              gap: 12, fontSize: 23, color: TEXT, paddingLeft: 16, borderLeft: `3px solid ${ACCENT}`,
            }}>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2（帧 540–1079，540帧）
// e^x 的Taylor展开逼近精度：多项式逼近的"拥抱"直觉
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // Taylor多项式
  const exFn  = (x: number) => Math.exp(x);
  const p1Fn  = (x: number) => 1 + x;
  const p2Fn  = (x: number) => 1 + x + x * x / 2;
  const p3Fn  = (x: number) => 1 + x + x * x / 2 + Math.pow(x, 3) / 6;
  const p4Fn  = (x: number) => 1 + x + x * x / 2 + Math.pow(x, 3) / 6 + Math.pow(x, 4) / 24;

  // Scene 5：曲线逐步出现
  const p1Op = fade(frame, 400, 12);
  const p2Op = fade(frame, 415, 12);
  const p3Op = fade(frame, 430, 12);
  const p4Op = fade(frame, 445, 12);
  const annoOp = fade(frame, 458, 14);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Scene 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: GREEN, fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十二章 · 无穷级数 · 例题 2 / 3
          </div>
          <ExampleBox exampleNum="例2" title="Taylor展开的逼近精度分析" width={1080} opacity={1} accentColor={GREEN}>
            <div style={{ padding: '12px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>用泰勒多项式 <span dangerouslySetInnerHTML={{ __html: math('P_n(x)') }} /> 逼近 <span dangerouslySetInnerHTML={{ __html: math('e^x') }} />，分析不同次数的逼近误差：</div>
              <div style={{ textAlign: 'center', fontSize: 28, margin: '14px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('e^x=\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}=1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots', true) }} />
              </div>
              <div style={{ fontSize: 20, color: TEXT, opacity: 0.85 }}>
                🔧 工程背景：计算机中 e^x 的浮点实现实际上就是有限项多项式逼近
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Scene 2: 背景分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, 60, 20), width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: GREEN, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AItem i={1} op={fade(frame, 65, 15)} color={GREEN}
              text={`泰勒级数：${math('e^x=\\sum_{n=0}^\\infty\\frac{x^n}{n!}')}，收敛半径 ${math('R=+\\infty')}（在整个实数轴绝对收敛）`} />
            <AItem i={2} op={fade(frame, 83, 15)} color={YELLOW}
              text={`在 ${math('x=1')} 处：${math('P_1(1)=2,\\;P_2(1)=2.5,\\;P_3(1)=2.667,\\;P_4(1)=2.708,\\;e\\approx 2.718')}`} />
            <AItem i={3} op={fade(frame, 101, 15)} color={ACCENT}
              text={`拉格朗日余项：${math('|R_n(x)|\\leq\\dfrac{e^{|x|}}{(n+1)!}|x|^{n+1}')}，n增大时迅速趋零`} />
            <AItem i={4} op={fade(frame, 119, 15)} color={ORANGE}
              text={`Polanyi直觉：更高次多项式在更大 x 范围内"<strong style='color:${ORANGE}'>拥抱</strong>"原函数 e^x`} />
          </div>
        </div>
      )}

      {/* ── Scene 3: 分步推导 ── */}
      {scene === 3 && (
        <div style={{ opacity: fade(frame, 150, 20), width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: GREEN, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 各次多项式在 x=1 处逼近</div>
          <SRow label="P₁(x)=1+x" color={PURPLE} op={fade(frame, 155, 20)} note="线性，P₁(1)=2"
            content={<span dangerouslySetInnerHTML={{ __html: math('e^x\\approx 1+x,\\quad P_1(1)=2,\\quad\\text{误差}=e-2\\approx 0.718') }} />} />
          <SRow label="P₂=P₁+x²/2" color={ACCENT} op={fade(frame, 200, 20)} note="二次，P₂(1)=2.5"
            content={<span dangerouslySetInnerHTML={{ __html: math('P_2(1)=1+1+\\tfrac{1}{2}=2.5,\\quad\\text{误差}\\approx 0.218') }} />} />
          <SRow label="P₃=P₂+x³/6" color={GREEN} op={fade(frame, 245, 20)} note="三次，P₃(1)≈2.667"
            content={<span dangerouslySetInnerHTML={{ __html: math('P_3(1)=2.5+\\tfrac{1}{6}\\approx 2.667,\\quad\\text{误差}\\approx 0.051') }} />} />
          <SRow label="P₄=P₃+x⁴/24" color={ORANGE} op={fade(frame, 290, 20)} note="四次，P₄(1)≈2.708"
            content={<span dangerouslySetInnerHTML={{ __html: math('P_4(1)=2.667+\\tfrac{1}{24}\\approx 2.708,\\quad\\text{误差}\\approx 0.010') }} />} />
        </div>
      )}

      {/* ── Scene 4: 定理框——余项公式 ── */}
      {scene === 4 && (
        <div style={{ opacity: fade(frame, 330, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="e^x 泰勒展开余项" width={980} opacity={1}>
            <div style={{ textAlign: 'center', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontSize: 34, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('R_n(x)=\\frac{e^\\xi}{(n+1)!}x^{n+1},\\quad\\xi\\in(0,x)', true) }} />
              <div style={{ fontSize: 24, color: YELLOW }}>
                次数每增加1，余项多一个因子{' '}
                <span dangerouslySetInnerHTML={{ __html: math('\\dfrac{x}{n+1}') }} />
                {' '}——次数越高，误差越快趋零
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Scene 5: Polanyi可视化——FunctionPlot曲线族逐步出现 ── */}
      {scene === 5 && (
        <div style={{ opacity: fade(frame, 390, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ color: GREEN, fontSize: 24, fontWeight: 'bold' }}>
            📈 Polanyi直觉：次数越高，多项式"拥抱"e^x 的范围越大
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            {/* 左：多曲线图 */}
            <div style={{ width: 640, height: 380 }}>
              <CoordinateSystem width={640} height={380}
                xRange={[-1.5, 2.5]} yRange={[-0.5, 9]}
                showGrid={true} gridStep={1} showLabels={true}>
                {/* e^x 真实函数（白色，始终可见）*/}
                <FunctionPlot fn={exFn} color="white" strokeWidth={3.5} opacity={0.95} />
                {/* P1 线性 */}
                {p1Op > 0.02 && <FunctionPlot fn={p1Fn} color={PURPLE} strokeWidth={2.5} opacity={p1Op * 0.9} />}
                {/* P2 二次 */}
                {p2Op > 0.02 && <FunctionPlot fn={p2Fn} color={ACCENT} strokeWidth={2.5} opacity={p2Op * 0.9} />}
                {/* P3 三次 */}
                {p3Op > 0.02 && <FunctionPlot fn={p3Fn} color={GREEN} strokeWidth={2.5} opacity={p3Op * 0.9} />}
                {/* P4 四次 */}
                {p4Op > 0.02 && <FunctionPlot fn={p4Fn} color={ORANGE} strokeWidth={2.5} opacity={p4Op * 0.9} />}
              </CoordinateSystem>
            </div>
            {/* 右：图例+注解 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24, width: 320 }}>
              <div style={{ color: 'white', fontSize: 18 }}>─── <span dangerouslySetInnerHTML={{ __html: math('e^x') }} /> 真实函数</div>
              {p1Op > 0.05 && <div style={{ color: PURPLE, fontSize: 18, opacity: p1Op }}>─── P₁=1+x（线性）</div>}
              {p2Op > 0.05 && <div style={{ color: ACCENT, fontSize: 18, opacity: p2Op }}>─── P₂（二次）</div>}
              {p3Op > 0.05 && <div style={{ color: GREEN, fontSize: 18, opacity: p3Op }}>─── P₃（三次）</div>}
              {p4Op > 0.05 && <div style={{ color: ORANGE, fontSize: 18, opacity: p4Op }}>─── P₄（四次）</div>}
              <div style={{ opacity: annoOp, marginTop: 12, padding: '12px 16px',
                background: 'rgba(80,250,123,0.08)', borderRadius: 8, borderLeft: `3px solid ${GREEN}` }}>
                <div style={{ color: GREEN, fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>在 x=2 处的误差：</div>
                <div style={{ color: TEXT, fontSize: 15, lineHeight: 1.7 }}>
                  P₁误差 ≈ 4.39<br />
                  P₂误差 ≈ 2.39<br />
                  P₃误差 ≈ 1.06<br />
                  P₄误差 ≈ <strong style={{ color: GREEN }}>0.39</strong>
                </div>
              </div>
            </div>
          </div>
          <div style={{ opacity: annoOp, fontSize: 20, color: TEXT, textAlign: 'center' }}>
            每条曲线在原点附近与 e^x 重合，但在 x 增大后逐渐分离 ——
            <span style={{ color: ORANGE }}> 更高次多项式"拥抱"更长</span>
          </div>
        </div>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: fade(frame, 480, 25), width: 940, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ color: GREEN, fontSize: 30, fontWeight: 'bold' }}>💡 小结：Taylor展开的逼近直觉</div>
          {[
            `e^x 在 ${math('(-\\infty,+\\infty)')} 绝对收敛，各次多项式逼近误差随 n 增大<strong style='color:${GREEN}'>迅速趋零</strong>`,
            `余项 ${math('|R_n|\\sim\\frac{|x|^{n+1}}{(n+1)!}')} 中阶乘增长比指数更快，保证收敛`,
            `工程应用：计算机浮点库（IEEE 754）用10~15项Taylor展开计算 e^x，精度达机器误差`,
            `直觉：同样的"次数预算"，在 x 越大处需要越多项才能保持精度`,
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(frame, 484 + i * 12, 14), display: 'flex', alignItems: 'flex-start',
              gap: 12, fontSize: 23, color: TEXT, paddingLeft: 16, borderLeft: `3px solid ${GREEN}`,
            }}>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3（帧 1080–1619，540帧）
// 方波的Fourier级数展开——时域与频域的双重语言
// ─────────────────────────────────────────────────────────────────────────────
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // Scene 5：FourierSeries项数从1增加到7
  const currentTerms = Math.min(7, Math.max(1,
    Math.floor(interpolate(frame, [393, 474], [1, 7.5], clamp))
  ));

  // 频谱：奇次谐波 n=1,3,5,7,9,11,13（对应terms=1~7）
  // 方波Fourier系数：在 n 为奇数时幅度 = 4/(nπ)
  const oddFreqs = [1, 3, 5, 7, 9, 11, 13];
  const ampMax = 4 / Math.PI; // ≈ 1.273（第1项幅度）

  // 频谱 SVG 参数
  const SPW = 360, SPH = 300;
  const spL = 50, spR = 16, spT = 20, spB = 36;
  const spPlotW = SPW - spL - spR;
  const spPlotH = SPH - spT - spB;
  const freqBarW = spPlotW / (oddFreqs.length + 1) * 0.65;
  const freqBarStep = spPlotW / (oddFreqs.length + 1);
  const freqColors = [ACCENT, GREEN, YELLOW, ORANGE, PURPLE, '#ff79c6', RED];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Scene 1: 展示题目 ── */}
      {scene === 1 && (
        <div style={{ opacity: fade(frame, 0, 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ color: ORANGE, fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
            第十二章 · 无穷级数 · 例题 3 / 3
          </div>
          <ExampleBox exampleNum="例3" title="方波的Fourier级数展开" width={1080} opacity={1} accentColor={ORANGE}>
            <div style={{ padding: '12px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>将方波函数 <span dangerouslySetInnerHTML={{ __html: math('f(x)=\\mathrm{sign}(\\sin x)\\in\\{-1,+1\\}') }} />（周期 2π）展开为Fourier级数：</div>
              <div style={{ textAlign: 'center', fontSize: 28, margin: '14px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: math('f(x)=\\frac{4}{\\pi}\\!\\left(\\sin x+\\frac{\\sin 3x}{3}+\\frac{\\sin 5x}{5}+\\cdots\\right)', true) }} />
              </div>
              <div style={{ fontSize: 19, color: TEXT, opacity: 0.85 }}>
                📡 工程背景：数字通信中方波是由奇次谐波叠加而成，这是信号处理的核心概念
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Scene 2: 背景 ── */}
      {scene === 2 && (
        <div style={{ opacity: fade(frame, 60, 20), width: 1000, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ORANGE, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 Fourier级数基本思想</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AItem i={1} op={fade(frame, 65, 15)} color={ORANGE}
              text={`任何<strong>周期函数</strong>可分解为正弦余弦的叠加：${math('f(x)=\\frac{a_0}{2}+\\sum_{n=1}^\\infty(a_n\\cos nx+b_n\\sin nx)')}`} />
            <AItem i={2} op={fade(frame, 83, 15)} color={YELLOW}
              text={`方波是<strong style='color:${YELLOW}'>奇函数</strong>，所以 ${math('a_n=0')}，只含正弦项（奇次谐波）`} />
            <AItem i={3} op={fade(frame, 101, 15)} color={GREEN}
              text={`<strong>Gibbs现象</strong>：在跳变点处，无论取多少项，逼近总有约 9% 的过冲，这是Fourier级数的固有特性`} />
            <AItem i={4} op={fade(frame, 119, 15)} color={ACCENT}
              text={`Polanyi直觉：时域（波形）和频域（频谱）是<strong style='color:${ACCENT}'>同一信号的两种语言</strong>，Fourier级数就是翻译`} />
          </div>
        </div>
      )}

      {/* ── Scene 3: 分步推导 ── */}
      {scene === 3 && (
        <div style={{ opacity: fade(frame, 150, 20), width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 Fourier系数计算</div>
          <SRow label="Step 1" color={PURPLE} op={fade(frame, 155, 20)} note="奇函数性质"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('f(x)\\text{是奇函数}\\Rightarrow a_n=0,\\;b_n=\\frac{2}{\\pi}\\int_0^\\pi f(x)\\sin(nx)\\,dx') }} />} />
          <SRow label="Step 2" color={ORANGE} op={fade(frame, 200, 20)} note="积分计算"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('b_n=\\frac{2}{\\pi}\\!\\int_0^\\pi\\!\\sin(nx)\\,dx=\\frac{2}{n\\pi}[1-\\cos(n\\pi)]') }} />} />
          <SRow label="Step 3" color={GREEN} op={fade(frame, 245, 20)} note="奇偶分析"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('\\cos(n\\pi)=(-1)^n\\Rightarrow b_n=\\begin{cases}\\dfrac{4}{n\\pi}&n\\text{ 为奇数}\\\\0&n\\text{ 为偶数}\\end{cases}') }} />} />
          <SRow label="Step 4" color={YELLOW} op={fade(frame, 290, 20)} note="前几项系数"
            content={<span dangerouslySetInnerHTML={{ __html:
              math('b_1=\\tfrac{4}{\\pi}\\approx 1.27,\\;b_3=\\tfrac{4}{3\\pi}\\approx 0.42,\\;b_5=\\tfrac{4}{5\\pi}\\approx 0.25') }} />} />
        </div>
      )}

      {/* ── Scene 4: 定理框 ── */}
      {scene === 4 && (
        <div style={{ opacity: fade(frame, 330, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="方波Fourier级数" width={980} opacity={1}>
            <div style={{ textAlign: 'center', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontSize: 34, color: FORMULA }}
                dangerouslySetInnerHTML={{ __html: math('f(x)=\\frac{4}{\\pi}\\sum_{k=1}^{\\infty}\\frac{\\sin(2k-1)x}{2k-1}', true) }} />
              <div style={{ display: 'flex', gap: 40, justifyContent: 'center', fontSize: 21, color: TEXT }}>
                <span><span style={{ color: ACCENT }}>只有奇次谐波</span>（偶数项 b_n=0）</span>
                <span><span style={{ color: YELLOW }}>幅度衰减</span> ~ 1/n</span>
                <span><span style={{ color: RED }}>Gibbs过冲</span> ≈ 9%</span>
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Scene 5: Polanyi可视化——时域波形 + 频谱双面板 ── */}
      {scene === 5 && (
        <div style={{ opacity: fade(frame, 390, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ color: ORANGE, fontSize: 22, fontWeight: 'bold' }}>
            🔊 Polanyi核心：时域（波形）与频域（频谱）——同一信号的两种语言
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {/* 左面板：时域波形（FourierSeries） */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 17, color: ACCENT, fontWeight: 'bold' }}>
                时域：{currentTerms} 项叠加
                {currentTerms >= 5 && <span style={{ color: YELLOW }}> (Gibbs现象可见)</span>}
              </div>
              <div style={{ width: 520, height: 310 }}>
                <CoordinateSystem width={520} height={310}
                  xRange={[-Math.PI, Math.PI]} yRange={[-1.6, 1.6]}
                  showGrid={true} gridStep={Math.PI / 2}>
                  <FourierSeries
                    terms={currentTerms}
                    coefficients="square"
                    color={ACCENT}
                  />
                </CoordinateSystem>
              </div>
            </div>

            {/* 右面板：频谱 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 17, color: ORANGE, fontWeight: 'bold' }}>
                频域：各谐波幅度（频谱图）
              </div>
              <svg width={SPW} height={SPH} style={{ background: 'rgba(255,184,108,0.04)', borderRadius: 8 }}>
                {/* Y轴 */}
                <line x1={spL} y1={spT} x2={spL} y2={spT + spPlotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                {/* X轴 */}
                <line x1={spL} y1={spT + spPlotH} x2={spL + spPlotW} y2={spT + spPlotH} stroke={TEXT} strokeWidth={1.5} opacity={0.45} />
                {/* Y轴刻度 */}
                {[0.4, 0.8, 1.2].map(v => {
                  const py = spT + spPlotH - (v / 1.4) * spPlotH;
                  return (
                    <g key={v}>
                      <line x1={spL} y1={py} x2={spL + spPlotW} y2={py} stroke={TEXT} strokeWidth={0.5} opacity={0.2} strokeDasharray="4,3" />
                      <text x={spL - 5} y={py + 4} textAnchor="end" fontSize={10} fill={TEXT} opacity={0.6}>{v.toFixed(1)}</text>
                    </g>
                  );
                })}
                {/* 频谱柱形 */}
                {oddFreqs.map((freq, idx) => {
                  const amp = 4 / (freq * Math.PI);
                  const bh = (amp / 1.4) * spPlotH;
                  const bx = spL + (idx + 0.5) * freqBarStep + freqBarStep * 0.175;
                  const by = spT + spPlotH - bh;
                  const visible = idx < currentTerms;
                  if (!visible) return null;
                  return (
                    <g key={freq}>
                      <rect x={bx} y={by} width={freqBarW} height={bh}
                        fill={freqColors[idx % freqColors.length]} opacity={0.85} rx={2} />
                      <text x={bx + freqBarW / 2} y={by - 5} textAnchor="middle" fontSize={11}
                        fill={freqColors[idx % freqColors.length]} opacity={0.9}>
                        {amp.toFixed(2)}
                      </text>
                      <text x={bx + freqBarW / 2} y={spT + spPlotH + 18} textAnchor="middle" fontSize={12}
                        fill={TEXT} opacity={0.7}>n={freq}</text>
                    </g>
                  );
                })}
                {/* 标题 */}
                <text x={spL + spPlotW / 2} y={spT + spPlotH + 34} textAnchor="middle" fontSize={11} fill={TEXT} opacity={0.6}>
                  频率（仅奇次谐波）
                </text>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 19, color: TEXT, textAlign: 'center', maxWidth: 920 }}>
            频谱图（右）是时域信号（左）的"DNA"——只看频谱就知道信号是方波，幅度按 1/n 衰减
          </div>
        </div>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: fade(frame, 480, 25), width: 940, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ color: ORANGE, fontSize: 30, fontWeight: 'bold' }}>💡 小结：Fourier级数与信号分解</div>
          {[
            `方波由<strong style='color:${ACCENT}'>无穷多奇次谐波</strong>叠加，幅度按 ${math('4/(n\\pi)')} 衰减`,
            `<strong>Gibbs现象</strong>：跳变点处约 9% 过冲无法消除，只能用加权（Fejér求和）改善`,
            `时域与频域是互补视角：时域看形状，频域看成分 —— 音频均衡器（EQ）在频域调节`,
            `Fourier级数是将"复杂→简单的叠加"的分解哲学，贯穿信号处理、量子力学、图像压缩`,
          ].map((text, i) => (
            <div key={i} style={{
              opacity: fade(frame, 484 + i * 12, 14), display: 'flex', alignItems: 'flex-start',
              gap: 12, fontSize: 23, color: TEXT, paddingLeft: 16, borderLeft: `3px solid ${ORANGE}`,
            }}>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（共1620帧，3道例题各540帧）
// ─────────────────────────────────────────────────────────────────────────────
const Sec08_Examples: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 540)  return <Example1 frame={frame} />;
  if (frame < 1080) return <Example2 frame={frame - 540} />;
  return <Example3 frame={frame - 1080} />;
};

const WSec08_Examples = withWatermark(Sec08_Examples);
export default WSec08_Examples;
