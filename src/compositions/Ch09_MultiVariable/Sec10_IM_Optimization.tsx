import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem, useCoordContext } from '../../components/math/CoordinateSystem';
import { FunctionPlot } from '../../components/math/FunctionPlot';
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
  polanyi?: string;
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
      <span style={{ color: accentColor, fontSize: 19, minWidth: 80, fontWeight: 'bold' }}>{label}</span>
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

// ─────────────────────────────────────────────────────────────────────────────
// 2D 辅助 SVG 组件（在 CoordinateSystem 上下文中使用）
// ─────────────────────────────────────────────────────────────────────────────

// 最优点标记
const OptimalDot: React.FC<{ b: number; h: number; color: string; label: string; opacity: number }> = (
  { b, h, color, label, opacity }
) => {
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(b, h);
  return (
    <g opacity={opacity}>
      <circle cx={px} cy={py} r={10} fill={color} />
      <text x={px + 12} y={py - 12} fill={color} fontSize={14} fontWeight="bold">{label}</text>
    </g>
  );
};

// 约束双曲线上移动的点（W = bh²/6 等高线扫描用）
const ScanPoint: React.FC<{ b: number; color: string }> = ({ b, color }) => {
  const { toPixel } = useCoordContext();
  const h = 30 - b; // 约束 b+h=30
  const { px, py } = toPixel(b, h);
  return <circle cx={px} cy={py} r={8} fill={color} opacity={1} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：结构轻量化优化（矩形梁截面模量最大化）
// ─────────────────────────────────────────────────────────────────────────────
// 问题：矩形梁宽 b，高 h，约束 b+h=30cm，最大化截面模量 W=bh²/6
// 最优：b*=10, h*=20, W_max=10·400/6≈666.7 cm³
// ─────────────────────────────────────────────────────────────────────────────
const Ch09IMOptimization: React.FC = () => {
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
  const rotY = interpolate(frame, [390, 480], [Math.PI / 4, Math.PI * 5 / 4], clamp);

  // Scene 5 内动画
  const contoursOp = fade(frame, 395, 20);
  const constraintOp = fade(frame, 415, 18);
  // 点沿约束线 b+h=30 从 (2,28) → (28,2) 扫描
  const scanB = interpolate(frame, [430, 458], [2, 28], clamp);
  // 梯度箭头（帧 462–480）
  const gradOp = fade(frame, 462, 16);

  // 最优点处的截面模量（用于旁注）
  const scanW = scanB * (30 - scanB) * (30 - scanB) / 6;

  // 3D 曲面：W = bh²/6，坐标映射 x=b/10, y=h/10, z=W/300
  const Wscale = (b: number, h: number) => {
    if (b <= 0 || h <= 0) return 0;
    return b * h * h / 6 / 300;
  };
  // 最优点 3D 坐标：b=10→x=1, h=20→y=2, W=666.7→z=2.22
  const optPt: [number, number, number] = [1.0, 2.0, 2.22];
  const optProgress = interpolate(frame, [405, 440], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: ORANGE, fontSize: 24, fontFamily: 'monospace', marginBottom: 8 }}>
              第九章 · 智能制造应用案例 IM-01
            </div>
            <div style={{ color: FORMULA, fontSize: 46, fontWeight: 'bold' }}>
              结构轻量化优化
            </div>
            <div style={{ color: TEXT, fontSize: 28, marginTop: 10 }}>
              矩形梁截面模量最大化 · 拉格朗日乘数法
            </div>
          </div>
          <ExampleBox
            exampleNum="📐"
            title="工程问题描述"
            width={1060}
            opacity={1}
            accentColor={ORANGE}
          >
            <div style={{ padding: '10px 0', fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <div>
                <strong style={{ color: ORANGE }}>设计目标：</strong>
                矩形截面梁（宽 b cm，高 h cm），要求总尺寸固定：
                <span dangerouslySetInnerHTML={{ __html: math('b+h=30\\text{ cm}') }} />
              </div>
              <div style={{ marginTop: 6 }}>
                <strong style={{ color: ACCENT }}>优化目标：</strong>
                最大化截面模量&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('W=\\dfrac{bh^2}{6}') }} />
                （截面模量越大 = 梁的抗弯能力越强）
              </div>
              <div style={{ marginTop: 6 }}>
                <strong style={{ color: GREEN }}>工程意义：</strong>
                在相同用材量（b+h 固定）下，什么样的矩形截面最抗弯？
                这是结构优化中的经典问题。
              </div>
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 2: 数学建模 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>📋 数学建模</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                delay: 65,
                text: `目标函数：${math('\\max\\; W(b,h)=\\dfrac{bh^2}{6}')}，约束：${math('g(b,h)=b+h-30=0')}`,
              },
              {
                delay: 83,
                text: `拉格朗日函数：${math('L=\\dfrac{bh^2}{6}-\\lambda(b+h-30)')}`,
              },
              {
                delay: 101,
                text: `<strong style="color:#61dafb">核心直觉：</strong>最优点处&nbsp;${math('\\nabla W \\parallel \\nabla g')}，即等值线与约束线相切`,
              },
              {
                delay: 119,
                text: `<span style="color:#f1fa8c">几何视角：</span>约束线 b+h=30 在最优点"恰好切到"最高的 W 等值线`,
              },
            ].map(({ delay, text }, i) => (
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
                <span style={{ color: ACCENT, fontWeight: 'bold', minWidth: 28 }}>{i + 1}.</span>
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1140, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>📐 拉格朗日法推导</div>
          <StepRow
            label="Step 1"
            latex={"\\frac{\\partial L}{\\partial b}=\\frac{h^2}{6}-\\lambda=0\\;\\Rightarrow\\;\\lambda=\\frac{h^2}{6}"}
            note="对 b 偏导"
            opacity={step1Op}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2"
            latex={"\\frac{\\partial L}{\\partial h}=\\frac{2bh}{6}-\\lambda=\\frac{bh}{3}-\\lambda=0\\;\\Rightarrow\\;\\lambda=\\frac{bh}{3}"}
            note="对 h 偏导"
            opacity={step2Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3"
            latex={"\\frac{h^2}{6}=\\frac{bh}{3}\\;\\Rightarrow\\;h=2b\\quad\\text{（最优高宽比）}"}
            note="消去 λ"
            opacity={step3Op}
            accentColor={GREEN}
            polanyi="h=2b 是一个纯几何比例关系——最优矩形截面的高是宽的 2 倍，与材料、载荷无关"
          />
          <StepRow
            label="Step 4"
            latex={"b^*=10,\\;h^*=20,\\;W_{\\max}=\\frac{10\\cdot 400}{6}\\approx 666.7\\;\\text{cm}^3"}
            note="代入 b+h=30"
            opacity={step4Op}
            accentColor={YELLOW}
            polanyi="λ=400/6≈66.7：约束每松动 1cm，最优 W 增加约 66.7 cm³（边际价值直觉）"
          />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="最优矩形截面（结构轻量化定理）" width={1020} opacity={1}>
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 60, fontSize: 36, marginBottom: 16 }}>
                <span>
                  <span style={{ color: PURPLE }}>b* = </span>
                  <span style={{ color: FORMULA }}>10 cm</span>
                </span>
                <span>
                  <span style={{ color: ACCENT }}>h* = </span>
                  <span style={{ color: FORMULA }}>20 cm</span>
                </span>
              </div>
              <div style={{ fontSize: 38 }}>
                <span style={{ color: GREEN }}>W* ≈ </span>
                <span style={{ color: FORMULA }}>666.7 cm³</span>
              </div>
              <div style={{ fontSize: 21, color: TEXT, marginTop: 16, lineHeight: 1.85 }}>
                <span style={{ color: YELLOW }}>默会知识：</span>最优截面 h = 2b（高是宽的两倍）<br />
                这是约束优化的几何直觉——在约束线上，等值线恰好在此与约束线相切，
                <span dangerouslySetInnerHTML={{ __html: math('\\nabla W = \\lambda\\nabla g') }} />
                &nbsp;（两梯度平行）
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Stage 5: 双可视化（2D 等高线 + 3D 曲面） ── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold' }}>
            🔩 可视化：W 等高线 × 约束线 × 梯度平行（Polanyi 场景）
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>

            {/* 2D 等高线图 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: TEXT, fontSize: 17, textAlign: 'center' }}>
                b-h 平面（W 等值线 + 约束线）
              </div>
              <CoordinateSystem
                width={560}
                height={520}
                xRange={[0, 30]}
                yRange={[0, 30]}
                showGrid
                gridStep={5}
                showLabels
                labelStep={10}
              >
                {/* W = c 等高线：h = √(6c/b)，c 取不同值 */}
                <FunctionPlot
                  fn={(b) => b <= 0 ? NaN : Math.sqrt(6 * 100 / b)}
                  color={ACCENT} strokeWidth={1.5} opacity={contoursOp * 0.45} xMin={0.3} xMax={29}
                />
                <FunctionPlot
                  fn={(b) => b <= 0 ? NaN : Math.sqrt(6 * 250 / b)}
                  color={ACCENT} strokeWidth={1.8} opacity={contoursOp * 0.6} xMin={0.3} xMax={29}
                />
                <FunctionPlot
                  fn={(b) => b <= 0 ? NaN : Math.sqrt(6 * 450 / b)}
                  color={PURPLE} strokeWidth={2} opacity={contoursOp * 0.75} xMin={0.3} xMax={29}
                />
                <FunctionPlot
                  fn={(b) => b <= 0 ? NaN : Math.sqrt(6 * 600 / b)}
                  color={PURPLE} strokeWidth={2.2} opacity={contoursOp * 0.88} xMin={0.3} xMax={29}
                />
                {/* W=666.7（最优等高线，与约束线相切） */}
                <FunctionPlot
                  fn={(b) => b <= 0 ? NaN : Math.sqrt(6 * 666.7 / b)}
                  color={YELLOW} strokeWidth={2.8} opacity={contoursOp * 0.95} xMin={0.3} xMax={29}
                />
                {/* 约束线 b+h=30 */}
                <FunctionPlot
                  fn={(b) => 30 - b}
                  color={RED} strokeWidth={3} opacity={constraintOp} xMin={0} xMax={29.5}
                />
                {/* 移动点沿约束线扫描 */}
                <ScanPoint b={scanB} color={ORANGE} />
                {/* 最优点梯度箭头（在 b=10, h=20 处） */}
                {/* ∇W=(h²/6, 2bh/6)=(66.7,66.7) → 方向(1,1)，显示长度 4cm */}
                <Arrow fromX={10} fromY={20} toX={12.8} toY={22.8}
                  color={GREEN} strokeWidth={4} opacity={gradOp} label="∇W" />
                {/* ∇g=(1,1) → 同方向，但长度稍短避免遮挡 */}
                <Arrow fromX={10} fromY={20} toX={11.6} toY={21.6}
                  color={RED} strokeWidth={4} opacity={gradOp} label="∇g" />
                {/* 最优点标记 */}
                <OptimalDot b={10} h={20} color={ORANGE} label="(10,20)" opacity={constraintOp} />
              </CoordinateSystem>
              {/* 实时 W 值 */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: ORANGE,
                  background: `${ORANGE}18`,
                  borderRadius: 6,
                  padding: '6px 12px',
                }}
              >
                <span style={{ color: TEXT }}>当前 b={scanB.toFixed(1)}, h={(30 - scanB).toFixed(1)} → </span>
                W = {scanW.toFixed(1)} cm³
              </div>
            </div>

            {/* 3D W 曲面 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: TEXT, fontSize: 17, textAlign: 'center' }}>
                3D 曲面 W=bh²/6（帧驱动旋转）
              </div>
              <CoordinateSystem3D
                width={560}
                height={520}
                center={[280, 400]}
                scale={58}
                xRange={[0, 4]}
                yRange={[0, 4]}
                zRange={[0, 4]}
                rotationY={rotY}
                rotationX={Math.PI / 6}
              >
                {/* W 曲面（坐标缩放：x=b/10, y=h/10, z=W/300） */}
                <SurfaceMesh3D
                  x={(u, _v) => u}
                  y={(_u, v) => v}
                  z={(u, v) => Wscale(u * 10, v * 10)}
                  uMin={0.1} uMax={3.0} uSteps={12}
                  vMin={0.1} vMax={3.0} vSteps={12}
                  color={ACCENT}
                  strokeWidth={0.7}
                  opacity={0.38}
                />
                {/* 约束面 b+h=30 → x+y=3 在 3D 空间中为一斜面 */}
                <SurfaceMesh3D
                  x={(u, _v) => u}
                  y={(_u, _v) => 3 - _v * 0}
                  z={(_u, _v) => 0}
                  uMin={0} uMax={0.02} uSteps={1}
                  vMin={0} vMax={0.02} vSteps={1}
                  color="transparent"
                  opacity={0}
                />
                {/* 约束线上的轨迹曲线（b+h=30，b从1到29） */}
                <SurfaceMesh3D
                  x={(u, _v) => u}
                  y={(_u, _v) => 3 - _u}
                  z={(u, _v) => Wscale(u * 10, (3 - u) * 10)}
                  uMin={0.1} uMax={2.9} uSteps={20}
                  vMin={0} vMax={0.02} vSteps={1}
                  color={RED}
                  strokeWidth={3}
                  opacity={0.9}
                />
                {/* 最优点标注 */}
                <AnimatedVector3D
                  from={[0, 0, 0]}
                  to={optPt}
                  color={ORANGE}
                  strokeWidth={3}
                  drawProgress={optProgress}
                  label="W*"
                  opacity={optProgress > 0 ? 1 : 0}
                />
              </CoordinateSystem3D>
              {/* 图例 */}
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { color: ACCENT, label: 'W 曲面' },
                  { color: RED, label: '约束线轨迹' },
                  { color: ORANGE, label: '最优点 W*=666.7' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: TEXT }}>
                    <div style={{ width: 18, height: 4, background: color, borderRadius: 2 }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 说明面板 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40, minWidth: 180 }}>
              <div style={{ fontSize: 18, color: ACCENT, fontWeight: 'bold', marginBottom: 4 }}>图例（2D）</div>
              {[
                { color: ACCENT, label: 'W=100,250 等值线' },
                { color: PURPLE, label: 'W=450,600 等值线' },
                { color: YELLOW, label: 'W=666.7（最优）' },
                { color: RED, label: '约束线 b+h=30' },
                { color: GREEN, label: '∇W（梯度方向）' },
                { color: RED, label: '∇g（约束梯度）' },
                { color: ORANGE, label: '移动点 / 最优点' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: TEXT }}>
                  <div style={{ width: 18, height: 3, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 12,
                  padding: '12px 14px',
                  background: `${YELLOW}15`,
                  borderRadius: 8,
                  border: `1px dashed ${YELLOW}66`,
                  fontSize: 15,
                  color: YELLOW,
                  lineHeight: 1.7,
                }}
              >
                💡 黄色等值线与红色<br />约束线在(10,20)相切—<br />两梯度平行，这就是<br />拉格朗日条件的全部
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold' }}>📝 结构轻量化优化总结</div>
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
                <span style={{ color: ORANGE }}>① 最优截面比例：</span>
                h* = 2b*（高是宽的两倍）——与约束值和目标函数的具体系数无关，是纯比例关系
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: GREEN }}>② 梯度平行条件：</span>
                在(10,20)处&nbsp;
                <span dangerouslySetInnerHTML={{ __html: math('\\nabla W=(66.7,66.7)=\\lambda\\cdot(1,1)=\\lambda\\nabla g') }} />
                &nbsp;——两梯度指向同一方向（45°）
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: YELLOW }}>③ Polanyi 默会知识：</span>
                "约束线与等值线相切"不是代数结果，而是几何感知——拉格朗日乘数法将代数条件转化为这一视觉直觉
              </div>
              <div>
                <span style={{ color: PURPLE }}>④ 工程推广：</span>
                对 T 型梁、I 型梁，相同框架适用，只需修改目标函数；拉格朗日方法对任意约束形式均有效
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
const WCh09IMOptimization = withWatermark(Ch09IMOptimization);
export default WCh09IMOptimization;
