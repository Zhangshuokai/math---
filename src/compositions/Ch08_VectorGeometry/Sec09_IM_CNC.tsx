import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
import { AnimatedVector3D } from '../../components/math/AnimatedVector3D';
import { SurfaceMesh3D } from '../../components/math/SurfaceMesh3D';
import { ParametricCurve3D } from '../../components/math/ParametricCurve3D';
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
const ORANGE = '#ff9500';
const GOLD = '#ffd700';

// ─────────────────────────────────────────────────────────────────────────────
// 子组件：分析列表
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
          fontSize: 26,
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
// 子组件：步骤行
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────────────────────────────────────
const Ch08IMCNC: React.FC = () => {
  const frame = useCurrentFrame();

  // 6阶段时序（540帧）
  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 330 ? 3 : frame < 390 ? 4 : frame < 480 ? 5 : 6;

  // 透明度
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

  // ── Stage 5 动画 ──────────────────────────────────────────────────────────
  // Phase A（390-440）：曲面 + P₀处法向量和切向量（原内容保留）
  // Phase B（440-480）：刀具路径 ParametricCurve3D + 切线向量场
  const phaseB = frame >= 440 && scene === 5;

  // 坐标系旋转（整个 Stage 5 缓慢旋转）
  const rotateY = interpolate(frame, [390, 480], [Math.PI / 6, Math.PI / 6 + Math.PI * 2 / 3], clamp);

  // Phase A：法向量 + 切向量绘制进度
  const normalProgress = interpolate(frame, [400, 435], [0, 1], clamp);
  const txProgress     = interpolate(frame, [432, 452], [0, 1], clamp);
  const tyProgress     = interpolate(frame, [449, 468], [0, 1], clamp);

  // Phase B：刀具路径绘制进度（ParametricCurve3D drawProgress）
  const toolPathProgress = interpolate(frame, [440, 468], [0, 1], clamp);
  // 切线向量场（在路径上4个点处依次显示）
  const tan1Op = fade(frame, 448, 12);
  const tan2Op = fade(frame, 455, 12);
  const tan3Op = fade(frame, 461, 12);
  const tan4Op = fade(frame, 467, 12);

  // Phase B 说明文字
  const phaseBTipOp = fade(frame, 444, 16);

  // 曲面 z = x²/4 + y²/9，点 P₀=(2,3,2)
  // 偏导：∂f/∂x=x/2=1，∂f/∂y=2y/9=2/3
  // 切向量：Tx=(1,0,1)，Ty=(0,1,2/3)
  // 法向量：n=(-1,-2/3,1)，|n|=sqrt(22/9)≈1.562
  // n_hat≈(-0.640,-0.427,0.640)
  const P0: [number,number,number] = [2, 3, 2];
  const normLen = 1.2;
  const nRaw = [-1, -2/3, 1];
  const nMag = Math.sqrt(nRaw[0]**2 + nRaw[1]**2 + nRaw[2]**2);
  const nHat: [number,number,number] = [
    nRaw[0]/nMag * normLen,
    nRaw[1]/nMag * normLen,
    nRaw[2]/nMag * normLen,
  ];
  const normalEnd: [number,number,number] = [P0[0]+nHat[0], P0[1]+nHat[1], P0[2]+nHat[2]];
  const txEnd: [number,number,number] = [P0[0]+1.0, P0[1]+0, P0[2]+1.0];
  const tyEnd: [number,number,number] = [P0[0]+0, P0[1]+1.0, P0[2]+2/3];

  // ── 刀具路径：y=1.5，x从-2到3，z=x²/4+0.25（沿椭圆抛物面等y截面移动）──
  // 切线向量场：在路径上4点处显示切向量（体现切线随曲面弯曲而变化的Polanyi直觉）
  // 点1: t=-1.5，P=(-1.5,1.5,0.8125)，T=(1,0,-1.5/2)=(1,0,-0.75)，scale=0.5
  // 点2: t=0，P=(0,1.5,0.25)，T=(1,0,0)，scale=0.5
  // 点3: t=1.5，P=(1.5,1.5,0.8125)，T=(1,0,0.75)，scale=0.5
  // 点4: t=3，P=(3,1.5,2.5)，T=(1,0,1.5)，scale=0.5（归一化后）
  const SCALE_T = 0.6;
  const norm2d = (tx: number, tz: number) => Math.sqrt(tx*tx + tz*tz);
  const tanPoints: Array<{
    from: [number,number,number];
    to: [number,number,number];
  }> = [
    {
      from: [-1.5, 1.5, 0.8125],
      to: [
        -1.5 + (1/norm2d(1,-0.75))*SCALE_T,
        1.5,
        0.8125 + (-0.75/norm2d(1,-0.75))*SCALE_T,
      ],
    },
    {
      from: [0, 1.5, 0.25],
      to: [0 + SCALE_T, 1.5, 0.25 + 0],
    },
    {
      from: [1.5, 1.5, 0.8125],
      to: [
        1.5 + (1/norm2d(1, 0.75))*SCALE_T,
        1.5,
        0.8125 + (0.75/norm2d(1,0.75))*SCALE_T,
      ],
    },
    {
      from: [3, 1.5, 2.5],
      to: [
        3 + (1/norm2d(1,1.5))*SCALE_T,
        1.5,
        2.5 + (1.5/norm2d(1,1.5))*SCALE_T,
      ],
    },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: PURPLE, fontSize: 26, fontFamily: 'monospace', marginBottom: 8 }}>
              第八章 · 智能制造应用案例 IM-02
            </div>
            <div style={{ color: FORMULA, fontSize: 48, fontWeight: 'bold' }}>
              五轴 CNC 刀轴定向
            </div>
            <div style={{ color: TEXT, fontSize: 30, marginTop: 12 }}>
              曲面法向量计算 · 刀具路径切线向量场
            </div>
          </div>
          <div
            style={{
              width: 980,
              background: 'rgba(189,147,249,0.1)',
              border: `1px solid ${PURPLE}44`,
              borderRadius: 8,
              padding: '16px 24px',
              fontSize: 24,
              color: TEXT,
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: PURPLE, fontWeight: 'bold' }}>🏭 工程背景：</span>
            五轴 CNC 加工中，刀具沿<strong style={{ color: ACCENT }}>法向量方向</strong>切削。
            <strong style={{ color: GOLD }}>关键直觉</strong>：
            刀具沿路径移动时，切线向量和法向量随曲面曲率连续变化——
            这正是五轴机床比三轴机床优越的本质。
          </div>
        </div>
      )}

      {/* ── Stage 2: 数学模型 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 数学模型</div>
          <AnalysisList
            frame={frame}
            startFrame={65}
            items={[
              `加工曲面：${math('z=x^2/4+y^2/9')}（椭圆抛物面）`,
              `待加工点：${math('P_0=(2,3,2)')}（验证：${math('4/4+9/9=2')} ✓）`,
              `切向量：${math('\\vec{T}_x=(1,0,\\partial f/\\partial x)=(1,0,1)')}，${math('\\vec{T}_y=(0,1,\\partial f/\\partial y)=(0,1,2/3)')}`,
              `法向量 = ${math('\\vec{T}_x\\times\\vec{T}_y')}（刀轴方向）；路径切线场体现五轴优势`,
            ]}
          />
        </div>
      )}

      {/* ── Stage 3: 分步计算 ── */}
      {scene === 3 && (
        <div style={{ opacity: s3Op, width: 1120, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ color: ACCENT, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 分步计算</div>
          <StepRow
            label="Step 1"
            latex={"\\left.\\frac{\\partial f}{\\partial x}\\right|_{P_0}=1,\\quad\\left.\\frac{\\partial f}{\\partial y}\\right|_{P_0}=\\frac{2}{3}"}
            note="求偏导"
            opacity={step1Op}
            accentColor={PURPLE}
          />
          <StepRow
            label="Step 2"
            latex={"\\vec{T}_x=(1,\\,0,\\,1),\\quad\\vec{T}_y=\\left(0,\\,1,\\,\\dfrac{2}{3}\\right)"}
            note="切向量"
            opacity={step2Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3"
            latex={"\\vec{n}=\\vec{T}_x\\times\\vec{T}_y=\\left(-1,\\,-\\dfrac{2}{3},\\,1\\right)"}
            note="叉积法向量"
            opacity={step3Op}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 4"
            latex={"\\hat{n}\\approx(-0.640,\\,-0.427,\\,0.640)"}
            note="归一化刀轴"
            opacity={step4Op}
            accentColor={RED}
          />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="刀轴方向（归一化法向量）" width={980} opacity={1}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <span
                style={{ fontSize: 40 }}
                dangerouslySetInnerHTML={{
                  __html: math('\\hat{n}\\approx(-0.640,\\;-0.427,\\;0.640)', true),
                }}
              />
              <div style={{ fontSize: 24, color: TEXT, marginTop: 16, lineHeight: 1.8 }}>
                <span>法向量 </span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{n}=(-1,-2/3,1)') }} />
                <span>，模长 </span>
                <span dangerouslySetInnerHTML={{ __html: math('|\\vec{n}|=\\sqrt{22/9}\\approx 1.562') }} />
              </div>
            </div>
          </TheoremBox>
          <ExampleBox exampleNum="💡" title="A/C 轴旋转角度" width={980} opacity={1} accentColor={PURPLE}>
            <div style={{ padding: '10px 0', fontSize: 24, color: TEXT, lineHeight: 1.7 }}>
              C 轴（绕Z）：
              <span dangerouslySetInnerHTML={{ __html: math('\\varphi_C=\\arctan(-0.427/-0.640)\\approx213.7°') }} />
              <br />
              A 轴（绕X）：
              <span dangerouslySetInnerHTML={{ __html: math('\\varphi_A=\\arccos(0.640)\\approx50.2°') }} />
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 5: 3D 可视化（Phase A：P₀处向量 + Phase B：刀具路径切线向量场）── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 24, fontWeight: 'bold' }}>
            {phaseB
              ? '🔑 Polanyi 直觉：刀具路径切线向量场（五轴联动的核心）'
              : '🎯 3D 可视化：椭圆抛物面与 P₀ 处法向量'}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              width={870}
              height={580}
              center={[430, 490]}
              scale={54}
              xRange={[-3, 5]}
              yRange={[-1, 5]}
              zRange={[0, 4]}
              rotationY={rotateY}
              rotationX={Math.PI / 6}
            >
              {/* 椭圆抛物面 z = x²/4 + y²/9 */}
              <SurfaceMesh3D
                x={(u, _v) => u}
                y={(_u, v) => v}
                z={(u, v) => u * u / 4 + v * v / 9}
                uMin={-3}
                uMax={3}
                uSteps={12}
                vMin={-3}
                vMax={3}
                vSteps={12}
                color={ACCENT}
                strokeWidth={0.8}
                opacity={0.45}
              />

              {/* Phase A: P₀处切向量和法向量 */}
              {/* 切向量 Tx */}
              <AnimatedVector3D
                from={P0} to={txEnd}
                color={ACCENT}
                strokeWidth={3}
                drawProgress={txProgress}
                label="Tₓ"
                opacity={txProgress > 0 ? 0.9 : 0}
              />
              {/* 切向量 Ty */}
              <AnimatedVector3D
                from={P0} to={tyEnd}
                color={GREEN}
                strokeWidth={3}
                drawProgress={tyProgress}
                label="Tᵧ"
                opacity={tyProgress > 0 ? 0.9 : 0}
              />
              {/* 法向量 n̂ */}
              <AnimatedVector3D
                from={P0} to={normalEnd}
                color={RED}
                strokeWidth={4}
                drawProgress={normalProgress}
                label="n̂"
                opacity={normalProgress > 0 ? 1 : 0}
              />

              {/* Phase B: 刀具路径（ParametricCurve3D）沿等y截面移动 */}
              {phaseB && (
                <ParametricCurve3D
                  x={(t) => t}
                  y={(_t) => 1.5}
                  z={(t) => t * t / 4 + 0.25}
                  tMin={-2}
                  tMax={3}
                  segments={40}
                  color={ORANGE}
                  strokeWidth={3}
                  drawProgress={toolPathProgress}
                  opacity={1}
                />
              )}

              {/* Phase B: 切线向量场（4点处切向量，体现曲线方向随曲率变化）*/}
              {phaseB && tanPoints.map((pt, i) => {
                const opArr = [tan1Op, tan2Op, tan3Op, tan4Op];
                return (
                  <AnimatedVector3D
                    key={i}
                    from={pt.from}
                    to={pt.to}
                    color={GOLD}
                    strokeWidth={2.5}
                    drawProgress={1}
                    label={`T${i+1}`}
                    opacity={opArr[i]}
                  />
                );
              })}
            </CoordinateSystem3D>

            {/* 图例 + 说明 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40, minWidth: 230 }}>
              {!phaseB && [
                { color: ACCENT, label: '曲面 z=x²/4+y²/9' },
                { color: ACCENT, label: '切向量 Tₓ=(1,0,1)' },
                { color: GREEN,  label: '切向量 Tᵧ=(0,1,2/3)' },
                { color: RED,    label: '法向量 n̂（刀轴方向）' },
                { color: YELLOW, label: 'P₀(2,3,2)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}

              {phaseB && [
                { color: ACCENT,  label: '椭圆抛物面' },
                { color: ORANGE,  label: '刀具路径（等y截面）' },
                { color: GOLD,    label: '切线向量（随x变化）' },
                { color: RED,     label: 'P₀处法向量 n̂' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 20, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}

              {phaseB && (
                <div
                  style={{
                    opacity: phaseBTipOp,
                    marginTop: 18,
                    background: 'rgba(255,149,0,0.1)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 18,
                    color: TEXT,
                    lineHeight: 1.75,
                    border: `1px solid ${ORANGE}44`,
                  }}
                >
                  <div style={{ color: ORANGE, fontWeight: 'bold', marginBottom: 6 }}>
                    切线向量场：
                  </div>
                  <div>
                    切线方向 = (1, 0, x/2)
                    <br />
                    随 x 增大，z 分量增大
                    <br />
                    → 刀具越来越倾斜
                  </div>
                  <div style={{ marginTop: 8, color: ACCENT, fontSize: 17 }}>
                    五轴：实时跟随切线<br />
                    三轴：固定刀轴方向<br />
                    → 五轴精度更高
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 五轴联动应用总结</div>
          <div
            style={{
              background: 'rgba(97,218,251,0.08)',
              borderRadius: 12,
              padding: '28px 32px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 25, color: TEXT, lineHeight: 1.9 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: PURPLE }}>① 曲面法向量：</span>
                <span dangerouslySetInnerHTML={{ __html: math('\\vec{n}=(-f_x,\\,-f_y,\\,1)') }} />
                （曲面 z=f(x,y) 通用）
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: ACCENT }}>② 刀具路径切线场：</span>
                路径参数 t 处的切线向量{' '}
                <span dangerouslySetInnerHTML={{ __html: math("\\vec{T}(t)=(x'(t),y'(t),z'(t))") }} />
                随曲面弯曲变化
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: GREEN }}>③ 五轴优势：</span>
                刀轴实时跟随法向量 →{' '}
                <strong style={{ color: GREEN }}>切削力垂直于曲面</strong> → μm级精度
              </div>
              <div>
                <span style={{ color: RED }}>④ A/C 轴实时解算：</span>
                数控系统将{' '}
                <span dangerouslySetInnerHTML={{ __html: math('\\hat{n}') }} />
                转换为 A 轴俯仰角和 C 轴旋转角
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
const WCh08IMCNC = withWatermark(Ch08IMCNC);
export default WCh08IMCNC;
