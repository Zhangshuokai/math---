import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem, useCoordContext } from '../../components/math/CoordinateSystem';
import { VectorField } from '../../components/math/VectorField';
import { Arrow } from '../../components/math/Arrow';
import { FunctionPlot } from '../../components/math/FunctionPlot';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { SurfaceMesh3D } from '../../components/math/SurfaceMesh3D';
import { Plane3D } from '../../components/math/Plane3D';
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
  polanyi?: string; // 默会知识注释
}
const StepRow: React.FC<StepRowProps> = ({ label, latex, note, opacity, accentColor = ACCENT, polanyi }) => (
  <div style={{ opacity, display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '10px 20px',
        background: 'rgba(97,218,251,0.06)',
        borderRadius: 8,
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <span style={{ color: accentColor, fontSize: 19, minWidth: 76, fontWeight: 'bold' }}>{label}</span>
      <span
        style={{ color: FORMULA, fontSize: 19, flex: 1 }}
        dangerouslySetInnerHTML={{ __html: math(latex) }}
      />
      <span style={{ color: TEXT, fontSize: 16, opacity: 0.75, minWidth: 160, textAlign: 'right' }}>{note}</span>
    </div>
    {polanyi && (
      <div
        style={{
          marginLeft: 24,
          padding: '6px 14px',
          background: `${YELLOW}15`,
          borderLeft: `2px dashed ${YELLOW}88`,
          borderRadius: 4,
          fontSize: 15,
          color: YELLOW,
          opacity: 0.9,
        }}
      >
        💡 默会知识：{polanyi}
      </div>
    )}
  </div>
);

interface AnalysisListProps {
  items: string[];
  frame: number;
  startFrame: number;
  perItem?: number;
}
const AnalysisList: React.FC<AnalysisListProps> = ({ items, frame, startFrame, perItem = 18 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          opacity: fade(frame, startFrame + i * perItem, 15),
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          fontSize: 25,
          color: TEXT,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 'bold', minWidth: 28 }}>{i + 1}.</span>
        <span dangerouslySetInnerHTML={{ __html: item }} />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2D SVG 辅助组件（使用 CoordinateSystem 上下文）
// ─────────────────────────────────────────────────────────────────────────────

// 椭圆等高线组件（用于 h(x,y) = 3.75 - (x-0.5)² - 2(y-0.5)²）
// 等高线 h=c 对应椭圆 (x-0.5)²+2(y-0.5)²=R²，x半轴=R, y半轴=R/√2
interface ContourEllipseProps { R: number; color: string; opacity: number; strokeWidth?: number }
const ContourEllipse: React.FC<ContourEllipseProps> = ({ R, color, opacity, strokeWidth = 1.8 }) => {
  const { toPixel } = useCoordContext();
  const cx = 0.5; const cy = 0.5; // 椭圆中心
  const { px: pcx, py: pcy } = toPixel(cx, cy);
  const { px: pRight } = toPixel(cx + R, cy);
  const { py: pTop } = toPixel(cx, cy + R / Math.SQRT2);
  const rx = Math.abs(pRight - pcx);
  const ry = Math.abs(pTop - pcy);
  if (R <= 0 || rx <= 0 || ry <= 0) return null;
  return (
    <ellipse cx={pcx} cy={pcy} rx={rx} ry={ry}
      stroke={color} strokeWidth={strokeWidth} fill="none" opacity={opacity} />
  );
};

// 等高线上中心点标记（峰值）
const PeakDot: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(0.5, 0.5);
  return <circle cx={px} cy={py} r={6} fill={YELLOW} opacity={opacity} />;
};

// 点标记
interface DotProps { x: number; y: number; color: string; r?: number; label?: string; labelDx?: number; labelDy?: number }
const Dot: React.FC<DotProps> = ({ x, y, color, r = 6, label, labelDx = 10, labelDy = -10 }) => {
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(x, y);
  return (
    <g>
      <circle cx={px} cy={py} r={r} fill={color} />
      {label && <text x={px + labelDx} y={py + labelDy} fill={color} fontSize={14} fontWeight="bold">{label}</text>}
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题1：气象站温度场的偏导数（全局帧 0–539）
// T(x,y) = 100 - 2x² - 3y² + xy，在 P(1,2) 处分析偏导数
// ─────────────────────────────────────────────────────────────────────────────
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame; // localFrame

  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 197, 20);
  const step3Op = fade(lf, 244, 20);
  const s4Op = fade(lf, 330, 25);
  const s5Op = fade(lf, 390, 30);
  const s6Op = fade(lf, 480, 25);

  // 3D 旋转（帧驱动，不用 CSS animation）
  const rotY = interpolate(lf, [390, 480], [Math.PI / 4, Math.PI * 5 / 4], clamp);

  // T_vis(x,y) = (24 - 2x² - 3y² + xy) / 4，将 T∈[76,100] 映射至 [0,6]
  const Tvis = (u: number, v: number) => (24 - 2 * u * u - 3 * v * v + u * v) / 4;
  // P 点 T_vis(1,2) = (24-2-12+2)/4 = 3
  const P_pt: [number, number, number] = [1, 2, 3];
  const ptProgress = interpolate(lf, [400, 430], [0, 1], clamp);

  return (
    <>
      {/* Stage 1: 标题 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: PURPLE, fontSize: 24, fontFamily: 'monospace' }}>第九章 · 例题1 / 3</div>
          <ExampleBox exampleNum="例1" title="气象温度场的偏导数" width={1020} opacity={1}>
            <div style={{ padding: '10px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                气象站在某区域测得地面温度分布：
                <span dangerouslySetInnerHTML={{ __html: math('T(x,y)=100-2x^2-3y^2+xy') }} />
                （°C，x 为东向/km，y 为北向/km）
              </div>
              <div style={{ marginTop: 8 }}>
                在位置 <span dangerouslySetInnerHTML={{ __html: math('P(1,2)') }} /> 处：
                向东（x 方向）和向北（y 方向）各走 1km，温度分别如何变化？
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题分析 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={lf}
            startFrame={65}
            items={[
              `温度场&nbsp;${math('T(x,y)=100-2x^2-3y^2+xy')}：在 P(1,2) 处，${math('T(1,2)=100-2-12+2=')}88°C`,
              `偏导数 ${math('\\partial T/\\partial x')}：<strong style="color:#61dafb">固定 y=2 不变</strong>，只让 x 变化，看 T 变化的斜率`,
              `偏导数 ${math('\\partial T/\\partial y')}：<strong style="color:#50fa7b">固定 x=1 不变</strong>，只让 y 变化，看 T 变化的斜率`,
              `<span style="color:#f1fa8c">空间直觉</span>：在 3D 温度曲面上，沿 x 方向"切一刀"，截面曲线的斜率就是 ${math('\\partial T/\\partial x')}`,
            ]}
          />
        </div>
      )}

      {/* Stage 3: 分步计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow
            label="Step 1"
            latex={"\\frac{\\partial T}{\\partial x} = -4x + y \\xrightarrow{(1,2)} -4+2 = -2 \\;\\text{°C/km}"}
            note="y视为常数"
            opacity={step1Op}
            accentColor={RED}
            polanyi="把 y 固定就是'临时冻结'北向，让 x 自由变——偏导数将多元微分降为单变量微分"
          />
          <StepRow
            label="Step 2"
            latex={"\\frac{\\partial T}{\\partial y} = -6y + x \\xrightarrow{(1,2)} -12+1 = -11 \\;\\text{°C/km}"}
            note="x视为常数"
            opacity={step2Op}
            accentColor={GREEN}
            polanyi="北向梯度更陡（−11 vs −2）：向北走升温曲面坡度更大，是偏导数绝对值的直接体现"
          />
          <StepRow
            label="Step 3"
            latex={"\\text{物理解释：从 P 点向东走 1km 降温 2°C；向北走 1km 降温 11°C}"}
            note="偏导 = 方向变化率"
            opacity={step3Op}
            accentColor={YELLOW}
          />
        </div>
      )}

      {/* Stage 4: 定理框 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="偏导数的计算法则（Polanyi 核心）" width={1000} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <span
                style={{ fontSize: 32 }}
                dangerouslySetInnerHTML={{
                  __html: math('\\frac{\\partial T}{\\partial x}\\bigg|_P = -2,\\quad \\frac{\\partial T}{\\partial y}\\bigg|_P = -11', true),
                }}
              />
              <div style={{ fontSize: 22, color: TEXT, marginTop: 16, lineHeight: 1.8 }}>
                <span style={{ color: YELLOW }}>核心直觉：</span>偏导数
                <span dangerouslySetInnerHTML={{ __html: math('\\partial f/\\partial x') }} />
                是"固定 y 后对 x 的普通导数"——
                <br />就像在 3D 曲面上沿 x 方向"切一刀"，看那条截线在该点的斜率
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 3D 可视化（核心 Polanyi 场景） */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold' }}>
            🎯 3D 可视化：温度曲面与两个偏导截面
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              width={860}
              height={560}
              center={[430, 430]}
              scale={62}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 7]}
              rotationY={rotY}
              rotationX={Math.PI / 6}
            >
              {/* 主温度曲面 */}
              <SurfaceMesh3D
                x={(u, _v) => u}
                y={(_u, v) => v}
                z={(u, v) => Math.max(0, Tvis(u, v))}
                uMin={-2} uMax={2} uSteps={16}
                vMin={-2} vMax={2} vSteps={16}
                color={ACCENT}
                strokeWidth={0.6}
                opacity={0.35}
              />
              {/* 红色截面（固定 y=2，x 变化）—— ∂T/∂x 方向 */}
              <SurfaceMesh3D
                x={(u, _v) => u}
                y={(_u, _v) => 2}
                z={(u, _v) => Math.max(0, Tvis(u, 2))}
                uMin={-2} uMax={2} uSteps={18}
                vMin={0} vMax={0.04} vSteps={1}
                color={RED}
                strokeWidth={3}
                opacity={0.9}
              />
              {/* 绿色截面（固定 x=1，y 变化）—— ∂T/∂y 方向 */}
              <SurfaceMesh3D
                x={(_u, _v) => 1}
                y={(_u, v) => v}
                z={(_u, v) => Math.max(0, Tvis(1, v))}
                uMin={0} uMax={0.04} uSteps={1}
                vMin={-2} vMax={2} vSteps={18}
                color={GREEN}
                strokeWidth={3}
                opacity={0.9}
              />
              {/* 切平面 y=2（半透明红色平面） */}
              <Plane3D
                corners={[[-2, 2, 0], [2, 2, 0], [2, 2, 6.5], [-2, 2, 6.5]]}
                color={RED}
                opacity={0.12}
              />
              {/* 切平面 x=1（半透明绿色平面） */}
              <Plane3D
                corners={[[1, -2, 0], [1, 2, 0], [1, 2, 6.5], [1, -2, 6.5]]}
                color={GREEN}
                opacity={0.12}
              />
              {/* 点 P */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={P_pt}
                color={ORANGE}
                strokeWidth={2}
                drawProgress={ptProgress}
                label="P(1,2)"
                opacity={ptProgress > 0 ? 0.8 : 0}
              />
            </CoordinateSystem3D>
            {/* 图例 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 50, minWidth: 220 }}>
              <div style={{ fontSize: 20, color: ACCENT, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: ACCENT, label: '温度曲面 T(x,y)' },
                { color: RED, label: '红截面：固定 y=2（∂T/∂x = −2）' },
                { color: GREEN, label: '绿截面：固定 x=1（∂T/∂y = −11）' },
                { color: ORANGE, label: '点 P(1,2,T=88°C)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: TEXT }}>
                  <div style={{ width: 22, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  background: `${YELLOW}15`,
                  borderRadius: 8,
                  border: `1px dashed ${YELLOW}66`,
                  fontSize: 17,
                  color: YELLOW,
                  lineHeight: 1.7,
                }}
              >
                💡 两平面切出两条曲线，<br />各自切线斜率 = 对应偏导数
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>📝 例题1 总结</div>
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
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: RED }}>① x 方向偏导：</span>固定 y=2，从 P 向东每 km 降温 2°C
                <span dangerouslySetInnerHTML={{ __html: math('\\;(\\partial T/\\partial x = -2)') }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>② y 方向偏导：</span>固定 x=1，从 P 向北每 km 降温 11°C
                <span dangerouslySetInnerHTML={{ __html: math('\\;(\\partial T/\\partial y = -11)') }} />
              </div>
              <div>
                <span style={{ color: YELLOW }}>③ 默会知识：</span>
                "固定某方向，切一刀，看截面斜率"——偏导数的空间操作直觉，比代数计算更根本
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2：登山路线优化——梯度方向（全局帧 540–1079）
// h(x,y) = 3 − x² − 2y² + x + 2y = 3.75 − (x−0.5)² − 2(y−0.5)²
// 在 A(0,0) 处，哪个方向上升最快？
// ─────────────────────────────────────────────────────────────────────────────
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - 540;

  const scene = lf < 60 ? 1 : lf < 150 ? 2 : lf < 330 ? 3 : lf < 390 ? 4 : lf < 480 ? 5 : 6;

  const s1Op = fade(lf, 0, 30);
  const s2Op = fade(lf, 60, 20);
  const s3Op = fade(lf, 150, 20);
  const step1Op = fade(lf, 150, 20);
  const step2Op = fade(lf, 200, 20);
  const step3Op = fade(lf, 250, 20);
  const s4Op = fade(lf, 330, 25);
  const s5Op = fade(lf, 390, 30);
  const s6Op = fade(lf, 480, 25);

  // Scene 5 等高线淡入 + 梯度箭头绘制
  const contourOp1 = fade(lf, 395, 18);
  const contourOp2 = fade(lf, 408, 18);
  const contourOp3 = fade(lf, 421, 18);
  const contourOp4 = fade(lf, 434, 18);
  const gradFieldOp = fade(lf, 445, 20);
  const arrowOp = fade(lf, 458, 18);

  return (
    <>
      {/* Stage 1 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: PURPLE, fontSize: 24, fontFamily: 'monospace' }}>第九章 · 例题2 / 3</div>
          <ExampleBox exampleNum="例2" title="登山路线优化——梯度最速上升方向" width={1020} opacity={1}>
            <div style={{ padding: '10px 0', fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              <div>
                山地地形高度：
                <span dangerouslySetInnerHTML={{ __html: math('h(x,y)=3-x^2-2y^2+x+2y') }} />
                （米，基点相对高度）
              </div>
              <div style={{ marginTop: 8 }}>
                登山者在位置 <span dangerouslySetInnerHTML={{ __html: math('A(0,0)') }} /> 处，
                <strong style={{ color: ORANGE }}>哪个方向上山坡度最大（最速上升）？</strong>
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={lf}
            startFrame={65}
            items={[
              `地形函数完全平方：${math('h=3.75-(x-0.5)^2-2(y-0.5)^2')}，峰顶在 (0.5, 0.5)`,
              `梯度 ${math('\\nabla h=(\\partial h/\\partial x,\\,\\partial h/\\partial y)')} 的方向 = 最速上升方向`,
              `<strong style="color:#61dafb">核心直觉：</strong>梯度垂直于等高线，指向函数增长最快的方向`,
              `从 A(0,0) 到峰顶，梯度会告诉登山者"往哪走最快爬坡"`,
            ]}
          />
        </div>
      )}

      {/* Stage 3: 计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow
            label="Step 1"
            latex={"\\nabla h = \\left(\\frac{\\partial h}{\\partial x},\\frac{\\partial h}{\\partial y}\\right) = (-2x+1,\\; -4y+2)"}
            note="求梯度分量"
            opacity={step1Op}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2"
            latex={"\\nabla h\\big|_{A(0,0)} = (1,\\; 2)\\quad\\longrightarrow\\quad |\\nabla h|=\\sqrt{1^2+2^2}=\\sqrt{5}\\approx 2.24"}
            note="在 A 处代入"
            opacity={step2Op}
            accentColor={ORANGE}
            polanyi={'梯度 (1,2) 指向右上方约 63.4°，这就是"爬坡最陡"的方向——不是计算出来的感觉，是空间直觉'}
          />
          <StepRow
            label="Step 3"
            latex={"\\text{最速上升单位方向：}\\hat{g}=\\frac{(1,2)}{\\sqrt{5}}\\approx(0.447,\\;0.894),\\quad\\text{角度}\\approx 63.4°"}
            note="单位梯度向量"
            opacity={step3Op}
            accentColor={GREEN}
            polanyi="最大方向导数值 = |∇h| = √5 ≈ 2.24 m/m，即该方向每走 1m 升高 2.24m"
          />
        </div>
      )}

      {/* Stage 4: 定理框 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="梯度方向 = 最速上升方向（Polanyi 核心直觉）" width={1020} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <span
                style={{ fontSize: 32 }}
                dangerouslySetInnerHTML={{
                  __html: math('\\nabla h\\big|_A = (1,2),\\quad |\\nabla h|=\\sqrt{5}\\approx 2.24\\,\\text{m/m}', true),
                }}
              />
              <div style={{ fontSize: 21, color: TEXT, marginTop: 16, lineHeight: 1.8 }}>
                <span style={{ color: YELLOW }}>最核心的默会知识：</span>梯度方向<strong>永远垂直于等高线</strong><br />
                等高线是"同等高度的轮廓"，梯度是"爬出该轮廓最快的方向"——<br />
                这种垂直关系是几何感知，不是代数推导
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 2D 可视化（等高线 + 梯度场）*/}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold' }}>
            🗺️ 2D 可视化：等高线 + 梯度向量场（Polanyi 场景）
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            {/* 2D 坐标系 */}
            <CoordinateSystem
              width={660}
              height={580}
              xRange={[-1.5, 2.2]}
              yRange={[-1.2, 2.5]}
              showGrid
              gridStep={0.5}
              showLabels
              labelStep={1}
            >
              {/* 等高线（椭圆族）：h=c 对应 R²=3.75−c */}
              <ContourEllipse R={Math.sqrt(3.75 - 0)} color={ACCENT} opacity={contourOp1 * 0.5} strokeWidth={1.5} />
              <ContourEllipse R={Math.sqrt(3.75 - 1)} color={ACCENT} opacity={contourOp2 * 0.65} strokeWidth={1.5} />
              <ContourEllipse R={Math.sqrt(3.75 - 2)} color={ACCENT} opacity={contourOp3 * 0.8} strokeWidth={1.8} />
              <ContourEllipse R={Math.sqrt(3.75 - 3)} color={YELLOW} opacity={contourOp4 * 0.95} strokeWidth={2} />
              {/* 峰顶标记 */}
              <PeakDot opacity={contourOp4} />
              {/* 梯度向量场 */}
              <VectorField
                Px={(x, _y) => 1 - 2 * x}
                Py={(_x, y) => 2 - 4 * y}
                gridCount={9}
                scale={0.22}
                color={GREEN}
                opacity={gradFieldOp * 0.75}
              />
              {/* A(0,0) 处的梯度向量（特别标注） */}
              <Arrow
                fromX={0} fromY={0}
                toX={0.72} toY={1.44}
                color={ORANGE}
                strokeWidth={5}
                opacity={arrowOp}
                label="∇h=(1,2)"
              />
              {/* A 点标记 */}
              <Dot x={0} y={0} color={ORANGE} r={7} label="A(0,0)" labelDx={10} labelDy={-14} />
            </CoordinateSystem>

            {/* 说明面板 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 30, minWidth: 240 }}>
              <div style={{ fontSize: 20, color: ACCENT, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: ACCENT, label: 'h=0,1,2 等高线（椭圆）' },
                { color: YELLOW, label: 'h=3 等高线（过A点附近）' },
                { color: GREEN, label: '梯度向量场 ∇h(x,y)' },
                { color: ORANGE, label: '∇h|_A=(1,2)：最速上升' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: TEXT }}>
                  <div style={{ width: 22, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  padding: '14px 16px',
                  background: `${ORANGE}15`,
                  borderRadius: 8,
                  border: `1px dashed ${ORANGE}66`,
                  fontSize: 16,
                  color: ORANGE,
                  lineHeight: 1.75,
                }}
              >
                💡 观察：橙色箭头（梯度）<br />垂直于黄色等高线——<br />这是默会知识的视觉确认
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>📝 例题2 总结</div>
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
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ORANGE }}>① A(0,0) 处梯度：</span>
                <span dangerouslySetInnerHTML={{ __html: math('\\nabla h=(1,2)') }} />，
                最速上升方向角约 63.4°（偏向 y 轴）
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>② 梯度场直觉：</span>
                梯度向量场让人"一眼看出"哪里是峰值（箭头向中心汇聚）——全域感知
              </div>
              <div>
                <span style={{ color: YELLOW }}>③ 默会知识：</span>
                梯度垂直等高线——这不是代数定理的结论，而是"爬出等高曲线的方向"的几何直觉
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3：生产成本最优分配——拉格朗日乘数法（全局帧 1080–1619）
// P(x,y) = 5x+8y−x²−y²−xy，约束 x+y=6（千件/月），求最大利润
// ─────────────────────────────────────────────────────────────────────────────

// 用于例题3 Scene 5：约束线上的移动点
const MovePoint: React.FC<{ t: number; color: string }> = ({ t, color }) => {
  // t∈[0,1]，x从0到6，y=6-x
  const x = t * 6;
  const y = 6 - x;
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(x, y);
  return <circle cx={px} cy={py} r={9} fill={color} opacity={1} />;
};

// 利润文字（在坐标系外部显示，不需要 context）
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

  // Scene 5 动画
  const contourFadeOp = fade(lf, 395, 20);
  const constraintOp = fade(lf, 415, 18);
  // 点沿约束线移动（lf 430→460）
  const pointT = interpolate(lf, [430, 460], [0, 1], clamp); // 0→x=0(0,6) 到 1→x=6(6,0)
  // 梯度箭头（lf 462→480）
  const gradOp = fade(lf, 462, 16);

  // 当前点和利润（用于显示）
  const ptX = pointT * 6;
  const ptY = 6 - ptX;
  const currentP = 5 * ptX + 8 * ptY - ptX * ptX - ptY * ptY - ptX * ptY;
  // 最优点：x*=1.5, y*=4.5, P*=14.25
  // 验证：在约束线上 P = 12 + 3x - x²，最大在 x=1.5

  return (
    <>
      {/* Stage 1 */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: PURPLE, fontSize: 24, fontFamily: 'monospace' }}>第九章 · 例题3 / 3</div>
          <ExampleBox exampleNum="例3" title="供应链利润优化——拉格朗日乘数法" width={1060} opacity={1}>
            <div style={{ padding: '10px 0', fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: ORANGE }}>工程背景：</strong>
                工厂生产 A、B 两种产品，产量 x、y（千件/月），
                总利润 <span dangerouslySetInnerHTML={{ __html: math('P(x,y)=5x+8y-x^2-y^2-xy') }} />
              </div>
              <div style={{ marginTop: 6 }}>
                <strong style={{ color: ACCENT }}>约束条件：</strong>总产能限制
                <span dangerouslySetInnerHTML={{ __html: math('x+y=6') }} />（千件/月）
              </div>
              <div style={{ marginTop: 6 }}>
                <strong style={{ color: GREEN }}>目标：</strong>在约束下求最大利润，以及最优产量分配 (x*, y*)
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* Stage 2: 审题 */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>📋 审题分析</div>
          <AnalysisList
            frame={lf}
            startFrame={65}
            items={[
              '约束条件 x+y=6 限制我们只能在一条直线上移动',
              `拉格朗日函数：${math('L(x,y,\\lambda)=P+\\lambda(6-x-y)')}`,
              `<strong style="color:#61dafb">核心直觉：</strong>极值点处 ${math('\\nabla P')} 与 ${math('\\nabla g')} 方向平行（g=x+y−6）`,
              '若两梯度不平行，则沿约束线移动可增大 P——极值点正是"无法再增大"之处',
            ]}
          />
        </div>
      )}

      {/* Stage 3: 计算 */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow
            label="Step 1"
            latex={"\\frac{\\partial L}{\\partial x}=5-2x-y-\\lambda=0,\\quad \\frac{\\partial L}{\\partial y}=8-2y-x-\\lambda=0"}
            note="令各偏导为零"
            opacity={step1Op}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2"
            latex={"\\text{两式相减：}(8-2y-x)-(5-2x-y)=0\\Rightarrow 3+x-y=0\\Rightarrow y=x+3"}
            note="消去 λ"
            opacity={step2Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3"
            latex={"x+y=6,\\;y=x+3\\;\\Rightarrow\\;x+x+3=6\\;\\Rightarrow\\;x^*=1.5,\\;y^*=4.5"}
            note="联立约束"
            opacity={step3Op}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 4"
            latex={"P^*=5(1.5)+8(4.5)-(1.5)^2-(4.5)^2-(1.5)(4.5)=7.5+36-2.25-20.25-6.75=14.25\\text{ 万}"}
            note="代入求最大利润"
            opacity={step4Op}
            accentColor={YELLOW}
            polanyi="λ=−2.5 是约束的边际价值：若产能增加 1 千件，利润增加 |λ|=2.5 万元"
          />
        </div>
      )}

      {/* Stage 4: 定理框 */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="拉格朗日乘数法核心（梯度平行直觉）" width={1020} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <span
                style={{ fontSize: 32 }}
                dangerouslySetInnerHTML={{
                  __html: math('x^*=1.5,\\;y^*=4.5,\\quad P^*=14.25\\text{ 万元}', true),
                }}
              />
              <div style={{ fontSize: 21, color: TEXT, marginTop: 16, lineHeight: 1.8 }}>
                <span style={{ color: YELLOW }}>默会知识：</span>
                在极值点 (1.5, 4.5) 处，
                <span dangerouslySetInnerHTML={{ __html: math('\\nabla P=(-2.5,-2.5)') }} />
                &nbsp;与&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('\\nabla g=(1,1)') }} />
                平行（均沿45°方向）<br />
                "两梯度平行"说明约束线在此与 P 等高线<strong>相切</strong>——再移动只会降低 P
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* Stage 5: 2D 可视化（等高线 + 约束线 + 梯度平行） */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold' }}>
            📊 2D 可视化：利润等高线 × 约束线 × 梯度平行（Polanyi 场景）
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            {/* 2D 坐标系：x=b（产品A产量），y=h（产品B产量） */}
            <CoordinateSystem
              width={620}
              height={580}
              xRange={[0, 6.5]}
              yRange={[0, 6.5]}
              showGrid
              gridStep={1}
              showLabels
              labelStep={1}
            >
              {/* 等高线 P=c：上下两支，y=[(8-x)±√(64+4x-3x²-4c)]/2 */}
              {/* P=4（外圈） */}
              <FunctionPlot
                fn={(x) => { const d = 48 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) + Math.sqrt(d)) / 2; }}
                color={ACCENT} strokeWidth={1.5} opacity={contourFadeOp * 0.45} xMin={0} xMax={6.5}
              />
              <FunctionPlot
                fn={(x) => { const d = 48 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) - Math.sqrt(d)) / 2; }}
                color={ACCENT} strokeWidth={1.5} opacity={contourFadeOp * 0.45} xMin={0} xMax={6.5}
              />
              {/* P=8 */}
              <FunctionPlot
                fn={(x) => { const d = 32 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) + Math.sqrt(d)) / 2; }}
                color={ACCENT} strokeWidth={1.8} opacity={contourFadeOp * 0.6} xMin={0} xMax={6.5}
              />
              <FunctionPlot
                fn={(x) => { const d = 32 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) - Math.sqrt(d)) / 2; }}
                color={ACCENT} strokeWidth={1.8} opacity={contourFadeOp * 0.6} xMin={0} xMax={6.5}
              />
              {/* P=12（靠近最优） */}
              <FunctionPlot
                fn={(x) => { const d = 16 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) + Math.sqrt(d)) / 2; }}
                color={PURPLE} strokeWidth={2} opacity={contourFadeOp * 0.8} xMin={0} xMax={6.5}
              />
              <FunctionPlot
                fn={(x) => { const d = 16 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) - Math.sqrt(d)) / 2; }}
                color={PURPLE} strokeWidth={2} opacity={contourFadeOp * 0.8} xMin={0} xMax={6.5}
              />
              {/* P=14（切线等高线） */}
              <FunctionPlot
                fn={(x) => { const d = 8 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) + Math.sqrt(d)) / 2; }}
                color={YELLOW} strokeWidth={2.5} opacity={contourFadeOp * 0.95} xMin={0} xMax={6.5}
              />
              <FunctionPlot
                fn={(x) => { const d = 8 + 4*x - 3*x*x; return d < 0 ? NaN : ((8-x) - Math.sqrt(d)) / 2; }}
                color={YELLOW} strokeWidth={2.5} opacity={contourFadeOp * 0.95} xMin={0} xMax={6.5}
              />
              {/* 约束线 x+y=6 */}
              <FunctionPlot
                fn={(x) => 6 - x}
                color={RED} strokeWidth={3} opacity={constraintOp} xMin={0} xMax={6}
              />
              {/* 移动点 */}
              <MovePoint t={pointT} color={ORANGE} />
              {/* 最优点梯度箭头 */}
              {/* ∇P at (1.5,4.5) = (-2.5,-2.5)，归一化后 * 0.5 = (-0.35,-0.35) */}
              <Arrow fromX={1.5} fromY={4.5} toX={1.5-0.45} toY={4.5-0.45}
                color={RED} strokeWidth={4} opacity={gradOp} label="∇P" />
              {/* ∇g = (1,1)，归一化后 * 0.5 */}
              <Arrow fromX={1.5} fromY={4.5} toX={1.5+0.35} toY={4.5+0.35}
                color={GREEN} strokeWidth={4} opacity={gradOp} label="∇g" />
              {/* 最优点 */}
              <Dot x={1.5} y={4.5} color={ORANGE} r={8} label="(1.5,4.5)" labelDx={10} labelDy={-14} />
            </CoordinateSystem>

            {/* 说明面板 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 20, minWidth: 240 }}>
              <div style={{ fontSize: 20, color: ACCENT, fontWeight: 'bold', marginBottom: 4 }}>图例</div>
              {[
                { color: ACCENT, label: 'P=4, 8 等高线' },
                { color: PURPLE, label: 'P=12 等高线' },
                { color: YELLOW, label: 'P=14（与约束相切）' },
                { color: RED, label: '约束线 x+y=6' },
                { color: ORANGE, label: '移动点 → 最优(1.5,4.5)' },
                { color: RED, label: '∇P（利润梯度）' },
                { color: GREEN, label: '∇g（约束梯度）' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              {/* 实时利润显示 */}
              <div
                style={{
                  marginTop: 12,
                  padding: '12px 16px',
                  background: `${ORANGE}20`,
                  borderRadius: 8,
                  border: `1px solid ${ORANGE}55`,
                  fontSize: 18,
                  color: ORANGE,
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: TEXT, fontSize: 15, marginBottom: 4 }}>当前位置：</div>
                <div>x={ptX.toFixed(1)}, y={ptY.toFixed(1)}</div>
                <div style={{ color: YELLOW, fontWeight: 'bold' }}>P ≈ {currentP.toFixed(2)}</div>
              </div>
              <div
                style={{
                  padding: '12px 16px',
                  background: `${YELLOW}15`,
                  borderRadius: 8,
                  border: `1px dashed ${YELLOW}66`,
                  fontSize: 15,
                  color: YELLOW,
                  lineHeight: 1.75,
                }}
              >
                💡 等高线与约束线相切处，<br />
                两梯度平行（均指 45°方向）—— <br />
                这就是拉格朗日条件的几何意义
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: 总结 */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>📝 例题3 总结</div>
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
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ORANGE }}>① 最优方案：</span>
                A产品 x*=1.5 千件，B产品 y*=4.5 千件，最大利润 P*=14.25 万元
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>② 拉格朗日乘数λ=−2.5：</span>
                产能每增加 1 千件，最大利润增加 2.5 万元（边际价值）
              </div>
              <div>
                <span style={{ color: YELLOW }}>③ 默会知识：</span>
                极值点处"两梯度平行"是几何直觉：等高线在此与约束线相切，
                沿约束线移动无法再增大函数值
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（1620 帧，3 题各 540 帧）
// ─────────────────────────────────────────────────────────────────────────────
const Ch09Examples: React.FC = () => {
  const frame = useCurrentFrame();

  const exampleIndex = frame < 540 ? 1 : frame < 1080 ? 2 : 3;

  const progress = interpolate(frame, [0, 1620], [0, 100], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>
      {/* 顶部题号栏 */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 60px',
          zIndex: 10,
        }}
      >
        <div style={{ color: PURPLE, fontSize: 21, fontFamily: 'monospace' }}>
          Ch09 · 多元函数微分法 · 深化案例（Polanyi）
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: exampleIndex === n ? ACCENT : 'rgba(97,218,251,0.15)',
                border: `2px solid ${ACCENT}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: exampleIndex === n ? BG : ACCENT,
                fontSize: 17,
                fontWeight: 'bold',
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* 例题内容 */}
      <div style={{ marginTop: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {exampleIndex === 1 && <Example1 frame={frame} />}
        {exampleIndex === 2 && <Example2 frame={frame} />}
        {exampleIndex === 3 && <Example3 frame={frame} />}
      </div>

      {/* 底部进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'rgba(97,218,251,0.12)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: ACCENT,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 命名导出（供 Root.tsx 的 withWatermark 使用）
// ─────────────────────────────────────────────────────────────────────────────
export { Ch09Examples as Sec09Examples };

// ─────────────────────────────────────────────────────────────────────────────
// Watermark HOC（模块顶层定义）— 默认导出
// ─────────────────────────────────────────────────────────────────────────────
const WCh09Examples = withWatermark(Ch09Examples);
export default WCh09Examples;
