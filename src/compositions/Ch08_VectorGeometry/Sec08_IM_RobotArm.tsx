import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import katex from 'katex';
import { COLORS } from '../../constants/colorTheme';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { TheoremBox } from '../../components/ui/TheoremBox';
import { CoordinateSystem3D } from '../../components/math/CoordinateSystem3D';
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
const ORANGE = '#ff9500';
const GREEN = '#50fa7b';
const RED = '#ff5555';
const GOLD = '#ffd700';
const PURPLE = '#bd93f9';

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
      style={{ color: FORMULA, fontSize: 22, flex: 1 }}
      dangerouslySetInnerHTML={{ __html: math(latex) }}
    />
    <span style={{ color: TEXT, fontSize: 17, opacity: 0.75 }}>{note}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 机械臂静态可视化（绘制三连杆，基于固定关节角度）
// ─────────────────────────────────────────────────────────────────────────────
interface StaticRobotArmProps {
  progress1: number;
  progress2: number;
  progress3: number;
  endProgress: number;
}

// 固定关节角（单位：弧度）
const THETA1_RAD = 30 * Math.PI / 180;
const THETA2_RAD = 75 * Math.PI / 180;
const THETA3_RAD = 55 * Math.PI / 180;

const P0_STATIC: [number,number,number] = [0, 0, 0];
const P1_STATIC: [number,number,number] = [
  5 * Math.cos(THETA1_RAD), 5 * Math.sin(THETA1_RAD), 0,
]; // ≈ (4.330, 2.500, 0)
const P2_STATIC: [number,number,number] = [
  P1_STATIC[0] + 3 * Math.cos(THETA2_RAD),
  P1_STATIC[1] + 3 * Math.sin(THETA2_RAD), 0,
]; // ≈ (5.106, 5.398, 0)
const P3_STATIC: [number,number,number] = [
  P2_STATIC[0] + 2 * Math.cos(THETA3_RAD),
  P2_STATIC[1] + 2 * Math.sin(THETA3_RAD), 0,
]; // ≈ (6.253, 7.036, 0)

const StaticRobotArm: React.FC<StaticRobotArmProps> = ({
  progress1, progress2, progress3, endProgress,
}) => (
  <>
    {/* 连杆1：橙色 */}
    <AnimatedVector3D
      from={P0_STATIC} to={P1_STATIC}
      color={ORANGE} strokeWidth={5}
      drawProgress={progress1} label="d₁=500mm"
      opacity={progress1 > 0 ? 1 : 0}
    />
    {/* 连杆2：蓝色 */}
    <AnimatedVector3D
      from={P1_STATIC} to={P2_STATIC}
      color={ACCENT} strokeWidth={4}
      drawProgress={progress2} label="d₂=300mm"
      opacity={progress2 > 0 ? 1 : 0}
    />
    {/* 连杆3：绿色 */}
    <AnimatedVector3D
      from={P2_STATIC} to={P3_STATIC}
      color={GREEN} strokeWidth={4}
      drawProgress={progress3} label="d₃=200mm"
      opacity={progress3 > 0 ? 1 : 0}
    />
    {/* 末端标注 */}
    <AnimatedVector3D
      from={[5.5, 6, 1]} to={P3_STATIC}
      color={RED} strokeWidth={2}
      drawProgress={endProgress} label="P_end"
      opacity={endProgress > 0 ? 1 : 0}
    />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// 机械臂动态可视化（θ₁ 驱动级联，体现正运动学 Polanyi 直觉）
// θ₁ 变化 → P1、P2、P3 均随之变化
// ─────────────────────────────────────────────────────────────────────────────
interface DynamicRobotArmProps {
  theta1: number;   // 关节1绝对角（弧度），从30°→90°
  opacity: number;
}

const DynamicRobotArm: React.FC<DynamicRobotArmProps> = ({ theta1, opacity }) => {
  // 关节2、3角度保持与关节1的相对角度不变（体现Polanyi：关节2随关节1转动）
  const theta2 = theta1 + 45 * Math.PI / 180; // 相对关节1 +45°
  const theta3 = theta1 + 25 * Math.PI / 180; // 相对关节1 +25°（= 原累计55°时差值）

  const p0: [number,number,number] = [0, 0, 0];
  const p1: [number,number,number] = [
    5 * Math.cos(theta1), 5 * Math.sin(theta1), 0,
  ];
  const p2: [number,number,number] = [
    p1[0] + 3 * Math.cos(theta2),
    p1[1] + 3 * Math.sin(theta2), 0,
  ];
  const p3: [number,number,number] = [
    p2[0] + 2 * Math.cos(theta3),
    p2[1] + 2 * Math.sin(theta3), 0,
  ];

  return (
    <>
      {/* 连杆1 */}
      <AnimatedVector3D
        from={p0} to={p1}
        color={ORANGE} strokeWidth={5}
        drawProgress={1} label=""
        opacity={opacity}
      />
      {/* 连杆2（关节2的坐标系随关节1整体旋转——Polanyi核心）*/}
      <AnimatedVector3D
        from={p1} to={p2}
        color={ACCENT} strokeWidth={4}
        drawProgress={1} label=""
        opacity={opacity}
      />
      {/* 连杆3 */}
      <AnimatedVector3D
        from={p2} to={p3}
        color={GREEN} strokeWidth={4}
        drawProgress={1} label=""
        opacity={opacity}
      />
      {/* 末端轨迹点（紫色）*/}
      <AnimatedVector3D
        from={[0,0,0]} to={p3}
        color={PURPLE} strokeWidth={1.5}
        drawProgress={1} label="P"
        opacity={opacity * 0.7}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────────────────────────────────────
const Ch08IMRobotArm: React.FC = () => {
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

  // ── Stage 5 动画设计 ──────────────────────────────────────────────────────
  // Phase A（390-440）：静态手臂逐段绘制 + 坐标系慢转
  // Phase B（440-480）：关节1旋转级联演示（Polanyi核心）
  const phaseB = frame >= 440 && scene === 5;

  // Phase A：旋转展示（给学生从侧面/俯视看清结构）
  const rotateY_A = interpolate(frame, [390, 440], [Math.PI / 6, Math.PI / 6 + Math.PI * 0.8], clamp);
  // Phase B：固定角度，聚焦关节级联运动
  const rotateY_B = Math.PI / 5;
  const effectiveRotateY = phaseB ? rotateY_B : rotateY_A;

  // Phase A 连杆绘制进度
  const progress1  = interpolate(frame, [395, 415], [0, 1], clamp);
  const progress2  = interpolate(frame, [415, 432], [0, 1], clamp);
  const progress3  = interpolate(frame, [432, 442], [0, 1], clamp);
  const endProgress = interpolate(frame, [440, 450], [0, 1], clamp);

  // Phase B：θ₁ 从 30° → 90°（Polanyi：关节1转动，后续关节跟随）
  const theta1 = interpolate(
    frame,
    [440, 478],
    [30 * Math.PI / 180, 90 * Math.PI / 180],
    clamp,
  );
  const phaseBOp = fade(frame, 440, 12);

  // Phase B 文字提示透明度
  const polanyiTipOp = fade(frame, 448, 16);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: 'center', alignItems: 'center' }}>

      {/* ── Stage 1: 标题 + 工程背景 ── */}
      {scene === 1 && (
        <div style={{ opacity: s1Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: ORANGE, fontSize: 26, fontFamily: 'monospace', marginBottom: 8 }}>
              第八章 · 智能制造应用案例 IM-01
            </div>
            <div style={{ color: FORMULA, fontSize: 52, fontWeight: 'bold' }}>
              工业机器人运动学
            </div>
            <div style={{ color: TEXT, fontSize: 32, marginTop: 12 }}>
              向量链式叠加 · 正运动学计算
            </div>
          </div>
          <div
            style={{
              width: 940,
              background: 'rgba(255,149,0,0.1)',
              border: `1px solid ${ORANGE}44`,
              borderRadius: 8,
              padding: '16px 24px',
              fontSize: 24,
              color: TEXT,
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: ORANGE, fontWeight: 'bold' }}>🏭 工程背景：</span>
            KUKA/ABB 工业机械臂通过关节角度控制末端执行器位置。
            <strong style={{ color: ACCENT }}>关键直觉</strong>：
            关节1旋转时，关节2、3的坐标系随之整体旋转——
            这是机器人运动学中最难理解的默会知识点。
          </div>
        </div>
      )}

      {/* ── Stage 2: 审题分析 ── */}
      {scene === 2 && (
        <div style={{ opacity: s2Op, width: 980, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>📋 模型参数</div>
          <AnalysisList
            frame={frame}
            startFrame={65}
            items={[
              `三连杆：${math('d_1=500\\text{ mm},\\;d_2=300\\text{ mm},\\;d_3=200\\text{ mm}')}`,
              `初始关节角：${math('\\theta_1=30°,\\;\\theta_2=45°\\text{（相对）},\\;\\theta_3=-20°\\text{（相对）}')}`,
              `累计角度：${math('\\theta_1^{acc}=30°,\\;\\theta_2^{acc}=75°,\\;\\theta_3^{acc}=55°')}`,
              `末端位置 = 各向量分量累加：${math('P_{end}=\\vec{d}_1+\\vec{d}_2+\\vec{d}_3')}`,
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
            latex={"\\vec{d}_1=500(\\cos30°,\\sin30°,0)=(433,250,0)\\text{ mm}"}
            note="θ_acc=30°"
            opacity={step1Op}
            accentColor={ORANGE}
          />
          <StepRow
            label="Step 2"
            latex={"\\vec{d}_2=300(\\cos75°,\\sin75°,0)\\approx(78,290,0)\\text{ mm}"}
            note="θ_acc=75°"
            opacity={step2Op}
            accentColor={ACCENT}
          />
          <StepRow
            label="Step 3"
            latex={"\\vec{d}_3=200(\\cos55°,\\sin55°,0)\\approx(115,164,0)\\text{ mm}"}
            note="θ_acc=55°"
            opacity={step3Op}
            accentColor={GREEN}
          />
          <StepRow
            label="Step 4"
            latex={"P_{end}=(433+78+115,\\;250+290+164,\\;0)\\approx(626,\\;704,\\;0)\\text{ mm}"}
            note="向量叠加"
            opacity={step4Op}
            accentColor={RED}
          />
        </div>
      )}

      {/* ── Stage 4: 关键结论 ── */}
      {scene === 4 && (
        <div style={{ opacity: s4Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <TheoremBox title="末端位置" width={920} opacity={1}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <span
                style={{ fontSize: 40 }}
                dangerouslySetInnerHTML={{
                  __html: math('P_{end}\\approx(626,\\;704,\\;0)\\text{ mm}', true),
                }}
              />
              <div style={{ fontSize: 24, color: TEXT, marginTop: 16, lineHeight: 1.8 }}>
                工作半径{' '}
                <span dangerouslySetInnerHTML={{ __html: math('r=\\sqrt{626^2+704^2}\\approx941\\text{ mm}') }} />
                <span style={{ marginLeft: 20, color: ORANGE }}>总杆长 = 1000 mm</span>
              </div>
            </div>
          </TheoremBox>
          <ExampleBox exampleNum="💡" title="正运动学" width={920} opacity={1} accentColor={ORANGE}>
            <div style={{ padding: '10px 0', fontSize: 24, color: TEXT, lineHeight: 1.7 }}>
              正运动学（FK）：已知各关节角 → 计算末端位置
              <br />
              真实六轴机器人使用 DH 参数矩阵：{' '}
              <span dangerouslySetInnerHTML={{ __html: math('T_{end}=T_1\\cdot T_2\\cdots T_6') }} />
            </div>
          </ExampleBox>
        </div>
      )}

      {/* ── Stage 5: 3D 可视化（Phase A：绘制 + Phase B：关节旋转级联 Polanyi）── */}
      {scene === 5 && (
        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: ACCENT, fontSize: 26, fontWeight: 'bold' }}>
            {phaseB
              ? '🔑 Polanyi 直觉：关节1转动 → 后续关节坐标系随之旋转'
              : '🤖 3D 可视化：三连杆机械臂工作空间'}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CoordinateSystem3D
              width={840}
              height={560}
              center={[200, 470]}
              scale={44}
              xRange={[0, 9]}
              yRange={[0, 9]}
              zRange={[0, 3]}
              rotationY={effectiveRotateY}
              rotationX={Math.PI / 6}
            >
              {/* Phase A: 静态手臂（逐段绘制）*/}
              {!phaseB && (
                <StaticRobotArm
                  progress1={progress1}
                  progress2={progress2}
                  progress3={progress3}
                  endProgress={endProgress}
                />
              )}
              {/* Phase B: 动态手臂（θ₁驱动级联）*/}
              {phaseB && (
                <DynamicRobotArm
                  theta1={theta1}
                  opacity={phaseBOp}
                />
              )}
            </CoordinateSystem3D>

            {/* 图例 + Polanyi说明 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40, minWidth: 240 }}>
              {[
                { color: ORANGE, label: '连杆1 (500mm, θ₁)' },
                { color: ACCENT, label: '连杆2 (300mm, θ₂)' },
                { color: GREEN,  label: '连杆3 (200mm, θ₃)' },
                { color: RED,    label: '末端 P_end' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: TEXT }}>
                  <div style={{ width: 24, height: 4, background: color, borderRadius: 2 }} />
                  <span>{label}</span>
                </div>
              ))}

              {/* Phase B Polanyi 说明 */}
              {phaseB && (
                <div
                  style={{
                    opacity: polanyiTipOp,
                    marginTop: 20,
                    background: 'rgba(255,149,0,0.1)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 19,
                    color: TEXT,
                    lineHeight: 1.75,
                    border: `1px solid ${ORANGE}44`,
                  }}
                >
                  <div style={{ color: ORANGE, fontWeight: 'bold', marginBottom: 6 }}>
                    关节级联直觉：
                  </div>
                  <div>
                    θ₁：{Math.round(theta1 * 180 / Math.PI)}°{' '}
                    （30°→90°）
                  </div>
                  <div style={{ marginTop: 4 }}>
                    关节2 坐标系跟随<br />
                    关节1 整体旋转
                  </div>
                  <div style={{ marginTop: 8, color: PURPLE, fontSize: 18 }}>
                    这就是"正运动学"的<br />
                    默会直觉核心
                  </div>
                </div>
              )}

              {/* Phase A 说明 */}
              {!phaseB && (
                <div style={{ marginTop: 16, fontSize: 19, color: TEXT, lineHeight: 1.7, opacity: 0.85 }}>
                  旋转坐标系观察<br />
                  三连杆在XY平面<br />
                  的工作空间分布
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Stage 6: 总结 ── */}
      {scene === 6 && (
        <div style={{ opacity: s6Op, width: 980, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 'bold' }}>📝 工程应用总结</div>
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
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: ORANGE }}>① 正运动学：</span>
                <span dangerouslySetInnerHTML={{ __html: math('P_{end}=\\sum_{i=1}^{3}l_i(\\cos\\theta_i^{acc},\\sin\\theta_i^{acc},0)') }} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: PURPLE }}>② Polanyi 核心：</span>
                关节1转动 θ₁ 时，后续关节的坐标系{' '}
                <strong style={{ color: ACCENT }}>整体随之旋转</strong>，
                相对角度保持不变
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: ACCENT }}>③ 六轴臂推广：</span>
                <span dangerouslySetInnerHTML={{ __html: math('T_{end}=T_1\\cdot T_2\\cdot T_3\\cdots T_6') }} />
                （4×4 齐次变换矩阵连乘）
              </div>
              <div>
                <span style={{ color: RED }}>④ 向量代数基础：</span>
                叉积用于力矩和雅可比矩阵；点积用于关节角限位判断
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
const WCh08IMRobotArm = withWatermark(Ch08IMRobotArm);
export default WCh08IMRobotArm;
