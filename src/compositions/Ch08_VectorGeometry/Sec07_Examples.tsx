import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../../constants/colorTheme';
import { MathFormula } from '../../components/math/MathFormula';
import { ExampleBox } from '../../components/ui/ExampleBox';
import { SolutionSteps, SolutionStep } from '../../components/ui/SolutionSteps';
import {
  CoordinateSystem3D,
  useCoordContext3D,
} from '../../components/math/CoordinateSystem3D';
import { AnimatedVector3D } from '../../components/math/AnimatedVector3D';
import { ParametricCurve3D } from '../../components/math/ParametricCurve3D';
import { Plane3D } from '../../components/math/Plane3D';

// ─── 动画辅助函数 ──────────────────────────────────────────────────────────────

const lerp = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ─── 三维空间点组件（必须定义在模块级别以使用 Hook）────────────────────────────

interface PointInSpaceProps {
  pos: [number, number, number];
  label?: string;
  color?: string;
  opacity?: number;
}

const PointInSpace: React.FC<PointInSpaceProps> = ({
  pos,
  label,
  color = COLORS.vector,
  opacity = 1,
}) => {
  const { toISO } = useCoordContext3D();
  const { svgX, svgY } = toISO(pos[0], pos[1], pos[2]);
  return (
    <g opacity={opacity}>
      <circle cx={svgX} cy={svgY} r={7} fill={color} />
      {label && (
        <text
          x={svgX + 10}
          y={svgY - 10}
          fill={color}
          fontSize={18}
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 例题1 常量：三点确定平面（A(1,0,0), B(0,2,0), C(0,0,3)，平面 6x+3y+2z=6）
// ═══════════════════════════════════════════════════════════════════════════

const ex1Steps: SolutionStep[] = [
  {
    label: '步骤1',
    content: '\\vec{AB} = (-1,2,0),\\ \\vec{AC} = (-1,0,3)',
  },
  {
    label: '步骤2',
    content:
      '\\mathbf{n} = \\vec{AB}\\times\\vec{AC} = \\begin{vmatrix}\\mathbf{i}&\\mathbf{j}&\\mathbf{k}\\\\-1&2&0\\\\-1&0&3\\end{vmatrix}',
  },
  { label: '步骤3', content: '\\mathbf{n} = (6,\\ 3,\\ 2)' },
  { label: '步骤4', content: '6(x-1)+3y+2z=0' },
  { label: '步骤5', content: '6x+3y+2z=6' },
];

// 四角点均在平面 6x+3y+2z=6 上
// A(1,0,0): 6=6✓  C(0,0,3): 6=6✓  mid(0.5,1,0): 3+3=6✓  B(0,2,0): 6=6✓
const ex1PlaneCorners: [
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number]
] = [
  [0, 0, 3],
  [1, 0, 0],
  [0.5, 1, 0],
  [0, 2, 0],
];

const ex1A: [number, number, number] = [1, 0, 0];
const ex1B: [number, number, number] = [0, 2, 0];
const ex1C: [number, number, number] = [0, 0, 3];

// 法向量 n=(6,3,2)，|n|=7，从 A(1,0,0) 出发缩放至长度≈1.5
// to = A + n*(1.5/7) ≈ (1+1.286, 0.643, 0.429)
const ex1NormalFrom: [number, number, number] = [1, 0, 0];
const ex1NormalTo: [number, number, number] = [2.29, 0.64, 0.43];

// ═══════════════════════════════════════════════════════════════════════════
// 例题2 常量：螺旋线切线（r(t)=(cost,sint,t)，t=π/2）
// ═══════════════════════════════════════════════════════════════════════════

const ex2Steps: SolutionStep[] = [
  {
    label: '步骤1',
    content: "r'(t) = (-\\sin t,\\ \\cos t,\\ 1)",
  },
  {
    label: '步骤2',
    content: "r'\\!\\left(\\tfrac{\\pi}{2}\\right) = (-1,\\ 0,\\ 1)",
  },
  {
    label: '步骤3',
    content:
      'r\\!\\left(\\tfrac{\\pi}{2}\\right) = \\left(0,\\ 1,\\ \\tfrac{\\pi}{2}\\right)',
  },
  {
    label: '步骤4',
    content: 'x = -s,\\ y = 1,\\ z = \\dfrac{\\pi}{2} + s',
  },
];

// 切点：t=π/2 → (cos(π/2), sin(π/2), π/2)，可视化z = t*3/(2π) = 0.75
const ex2ContactPt: [number, number, number] = [0, 1, 0.75];
// 切线方向（可视化空间）：(-sin(π/2), cos(π/2), 3/(2π)) = (-1, 0, 0.477)，缩放1.5
const ex2TangentTo: [number, number, number] = [-1.5, 1, 1.47];
// 反向切线（展示切线为双向直线）
const ex2TangentBack: [number, number, number] = [1.5, 1, 0.04];

// ═══════════════════════════════════════════════════════════════════════════
// 例题3 常量：两平面夹角（π₁:2x-y+z=3, π₂:x+y+2z=5）
// ═══════════════════════════════════════════════════════════════════════════

const ex3Steps: SolutionStep[] = [
  {
    label: '步骤1',
    content: '\\mathbf{n_1} = (2,-1,1),\\ \\mathbf{n_2} = (1,1,2)',
  },
  {
    label: '步骤2',
    content:
      '\\cos\\theta = \\dfrac{|\\mathbf{n_1}\\cdot\\mathbf{n_2}|}{|\\mathbf{n_1}|\\,|\\mathbf{n_2}|} = \\dfrac{|2-1+2|}{\\sqrt{6}\\cdot\\sqrt{6}} = \\dfrac{3}{6} = \\dfrac{1}{2}',
  },
  { label: '步骤3', content: '\\theta = 60°\\ (\\pi/3)' },
  {
    label: '步骤4',
    content:
      '\\mathbf{s} = \\mathbf{n_1}\\times\\mathbf{n_2} = (-3,-3,3)\\ \\Rightarrow\\ (-1,-1,1)',
  },
];

// 平面1 (2x-y+z=3) 角点：均在平面上
// (0,0,3):0-0+3=3✓  (1.5,0,0):3-0+0=3✓  (3,3,0):6-3+0=3✓  (1.5,3,3):3-3+3=3✓
const ex3Plane1Corners: [
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number]
] = [
  [0, 0, 3],
  [1.5, 0, 0],
  [3, 3, 0],
  [1.5, 3, 3],
];

// 平面2 (x+y+2z=5) 角点：均在平面上
// (0,0,2.5):0+0+5=5✓  (4,0,0.5):4+0+1=5✓  (4,4,-1.5):4+4-3=5✓  (0,4,0.5):0+4+1=5✓
const ex3Plane2Corners: [
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number]
] = [
  [0, 0, 2.5],
  [4, 0, 0.5],
  [4, 4, -1.5],
  [0, 4, 0.5],
];

// 法向量 n1=(2,-1,1), n2=(1,1,2)，从原点出发，缩放0.8
const ex3Origin: [number, number, number] = [0, 0, 0];
const ex3N1To: [number, number, number] = [1.6, -0.8, 0.8];
const ex3N2To: [number, number, number] = [0.8, 0.8, 1.6];
// 交线方向向量 s=(-1,-1,1)，缩放0.8
const ex3STo: [number, number, number] = [-0.8, -0.8, 0.8];

// ═══════════════════════════════════════════════════════════════════════════
// 例题1 场景（全局帧 0–479）
// ═══════════════════════════════════════════════════════════════════════════

const Example1Scene: React.FC = () => {
  const frame = useCurrentFrame();

  const phase =
    frame < 90 ? 'title' :
    frame < 210 ? 'setup' :
    frame < 390 ? 'animate' : 'summary';

  // 标题阶段
  const titleOp = lerp(frame, 0, 40);

  // 题目展示阶段
  const setupBoxOp = lerp(frame, 90, 122);
  const setupPtsOp = lerp(frame, 145, 182);

  // 动画阶段（全局帧，clamped 后在 summary 中保持最大值）
  const ptsFadeOp = lerp(frame, 210, 255);
  const abProgress = lerp(frame, 270, 330);
  const acProgress = lerp(frame, 305, 365);
  const normalProgress = lerp(frame, 335, 390);
  const planeOp = lerp(frame, 330, 430);

  const ex1Step =
    frame >= 370 ? 5 :
    frame >= 350 ? 4 :
    frame >= 330 ? 3 :
    frame >= 300 ? 2 :
    frame >= 270 ? 1 : 0;

  // 总结阶段
  const summaryOp = lerp(frame, 390, 425);

  return (
    <AbsoluteFill>
      {/* ── 标题 ── */}
      {phase === 'title' && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 54,
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            例题1：三点确定平面
          </div>
          <div
            style={{
              color: COLORS.annotation,
              fontSize: 28,
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            已知三点 A(1,0,0)、B(0,2,0)、C(0,0,3)，求平面方程
          </div>
        </AbsoluteFill>
      )}

      {/* ── 题目展示 ── */}
      {phase === 'setup' && (
        <AbsoluteFill
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 50,
            gap: 36,
          }}
        >
          <div style={{ opacity: setupBoxOp }}>
            <ExampleBox
              exampleNum={1}
              title="三点确定平面"
              width={1000}
              accentColor={COLORS.primaryCurve}
            >
              <div
                style={{
                  fontSize: 26,
                  color: COLORS.formula,
                  fontFamily: 'sans-serif',
                  lineHeight: 1.8,
                }}
              >
                已知三点&nbsp;
                <span style={{ color: COLORS.primaryCurve }}>A(1, 0, 0)</span>、
                <span style={{ color: COLORS.secondaryCurve }}>B(0, 2, 0)</span>、
                <span style={{ color: COLORS.tertiaryCurve }}>C(0, 0, 3)</span>
                ，求平面方程。
              </div>
            </ExampleBox>
          </div>
          <div style={{ opacity: setupPtsOp }}>
            <CoordinateSystem3D
              center={[440, 300]}
              scale={70}
              xRange={[0, 4]}
              yRange={[0, 4]}
              zRange={[0, 4]}
              width={880}
              height={540}
            >
              <PointInSpace pos={ex1A} label="A" color={COLORS.primaryCurve} />
              <PointInSpace pos={ex1B} label="B" color={COLORS.secondaryCurve} />
              <PointInSpace pos={ex1C} label="C" color={COLORS.tertiaryCurve} />
            </CoordinateSystem3D>
          </div>
        </AbsoluteFill>
      )}

      {/* ── 动画 + 解题步骤 ── */}
      {phase === 'animate' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[620, 520]}
              scale={80}
              xRange={[0, 4]}
              yRange={[0, 4]}
              zRange={[0, 4]}
              width={1100}
              height={1040}
            >
              <PointInSpace pos={ex1A} label="A" color={COLORS.primaryCurve} opacity={ptsFadeOp} />
              <PointInSpace pos={ex1B} label="B" color={COLORS.secondaryCurve} opacity={ptsFadeOp} />
              <PointInSpace pos={ex1C} label="C" color={COLORS.tertiaryCurve} opacity={ptsFadeOp} />
              <AnimatedVector3D
                from={ex1A}
                to={ex1B}
                color={COLORS.vector}
                drawProgress={abProgress}
                label="AB"
                strokeWidth={2.5}
              />
              <AnimatedVector3D
                from={ex1A}
                to={ex1C}
                color={COLORS.highlight}
                drawProgress={acProgress}
                label="AC"
                strokeWidth={2.5}
              />
              <AnimatedVector3D
                from={ex1NormalFrom}
                to={ex1NormalTo}
                color="#ff9500"
                drawProgress={normalProgress}
                label="n"
                strokeWidth={3}
              />
              <Plane3D
                corners={ex1PlaneCorners}
                color={COLORS.secondaryCurve}
                fillOpacity={0.25}
                opacity={planeOp}
              />
            </CoordinateSystem3D>
          </div>
          <div style={{ position: 'absolute', right: 60, top: 100, width: 740 }}>
            <div
              style={{
                color: COLORS.primaryCurve,
                fontSize: 24,
                fontFamily: 'sans-serif',
                marginBottom: 16,
                fontWeight: 'bold',
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={ex1Steps} currentStep={ex1Step} width={740} />
          </div>
        </>
      )}

      {/* ── 总结 ── */}
      {phase === 'summary' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[620, 520]}
              scale={80}
              xRange={[0, 4]}
              yRange={[0, 4]}
              zRange={[0, 4]}
              width={1100}
              height={1040}
            >
              <PointInSpace pos={ex1A} label="A" color={COLORS.primaryCurve} />
              <PointInSpace pos={ex1B} label="B" color={COLORS.secondaryCurve} />
              <PointInSpace pos={ex1C} label="C" color={COLORS.tertiaryCurve} />
              <AnimatedVector3D
                from={ex1NormalFrom}
                to={ex1NormalTo}
                color="#ff9500"
                drawProgress={1}
                label="n"
                strokeWidth={3}
              />
              <Plane3D
                corners={ex1PlaneCorners}
                color={COLORS.secondaryCurve}
                fillOpacity={0.3}
                opacity={planeOp}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: 0,
              bottom: 0,
              width: 760,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: summaryOp,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                fontSize: 30,
                fontFamily: 'sans-serif',
                marginBottom: 28,
              }}
            >
              平面方程为：
            </div>
            <MathFormula
              latex="6x + 3y + 2z = 6"
              fontSize={72}
              color={COLORS.formula}
            />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 例题2 场景（全局帧 480–959）
// ═══════════════════════════════════════════════════════════════════════════

const Example2Scene: React.FC = () => {
  const frame = useCurrentFrame();

  const phase =
    frame < 570 ? 'title' :
    frame < 690 ? 'setup' :
    frame < 870 ? 'animate' : 'summary';

  // 标题
  const titleOp = lerp(frame, 480, 520);

  // 题目展示
  const setupBoxOp = lerp(frame, 570, 602);

  // 动画阶段
  const helixProgress = lerp(frame, 690, 780);
  const contactPtOp = lerp(frame, 780, 815);
  const tangentProgress = lerp(frame, 830, 870);

  const ex2Step =
    frame >= 838 ? 4 :
    frame >= 805 ? 3 :
    frame >= 762 ? 2 :
    frame >= 722 ? 1 : 0;

  // 总结
  const summaryOp = lerp(frame, 870, 905);

  return (
    <AbsoluteFill>
      {/* ── 标题 ── */}
      {phase === 'title' && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              color: COLORS.secondaryCurve,
              fontSize: 54,
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            例题2：空间曲线的切线
          </div>
          <div
            style={{
              color: COLORS.annotation,
              fontSize: 28,
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            螺旋线 r(t) = (cos t, sin t, t) 在 t = π/2 处的切线方程
          </div>
        </AbsoluteFill>
      )}

      {/* ── 题目展示 ── */}
      {phase === 'setup' && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <div style={{ opacity: setupBoxOp }}>
            <ExampleBox
              exampleNum={2}
              title="空间曲线的切线"
              width={1100}
              accentColor={COLORS.secondaryCurve}
            >
              <div
                style={{
                  fontSize: 24,
                  color: COLORS.formula,
                  fontFamily: 'sans-serif',
                  lineHeight: 2,
                }}
              >
                求螺旋线&nbsp;
                <MathFormula
                  latex="r(t) = (\cos t,\ \sin t,\ t)"
                  fontSize={28}
                  color={COLORS.secondaryCurve}
                  displayMode={false}
                />
                &nbsp;在&nbsp;
                <span style={{ color: COLORS.vector }}>t = π/2</span>
                &nbsp;处的切线方程。
              </div>
            </ExampleBox>
          </div>
        </AbsoluteFill>
      )}

      {/* ── 动画 + 解题步骤 ── */}
      {phase === 'animate' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[600, 500]}
              scale={70}
              xRange={[-2, 2]}
              yRange={[-2, 2]}
              zRange={[0, 4]}
              width={1100}
              height={1000}
            >
              <ParametricCurve3D
                x={(t) => Math.cos(t)}
                y={(t) => Math.sin(t)}
                z={(t) => (t * 3) / (2 * Math.PI)}
                tMin={0}
                tMax={2 * Math.PI}
                segments={120}
                color={COLORS.primaryCurve}
                drawProgress={helixProgress}
                strokeWidth={2.5}
              />
              <PointInSpace
                pos={ex2ContactPt}
                label="P"
                color={COLORS.vector}
                opacity={contactPtOp}
              />
              <AnimatedVector3D
                from={ex2ContactPt}
                to={ex2TangentTo}
                color={COLORS.highlight}
                drawProgress={tangentProgress}
                label="r'"
                strokeWidth={3}
              />
            </CoordinateSystem3D>
          </div>
          <div style={{ position: 'absolute', right: 60, top: 100, width: 740 }}>
            <div
              style={{
                color: COLORS.secondaryCurve,
                fontSize: 24,
                fontFamily: 'sans-serif',
                marginBottom: 16,
                fontWeight: 'bold',
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={ex2Steps} currentStep={ex2Step} width={740} />
          </div>
        </>
      )}

      {/* ── 总结 ── */}
      {phase === 'summary' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[600, 500]}
              scale={70}
              xRange={[-2, 2]}
              yRange={[-2, 2]}
              zRange={[0, 4]}
              width={1100}
              height={1000}
            >
              <ParametricCurve3D
                x={(t) => Math.cos(t)}
                y={(t) => Math.sin(t)}
                z={(t) => (t * 3) / (2 * Math.PI)}
                tMin={0}
                tMax={2 * Math.PI}
                segments={120}
                color={COLORS.primaryCurve}
                drawProgress={1}
                strokeWidth={2.5}
              />
              <PointInSpace pos={ex2ContactPt} label="P" color={COLORS.vector} />
              <AnimatedVector3D
                from={ex2ContactPt}
                to={ex2TangentTo}
                color={COLORS.highlight}
                drawProgress={1}
                label="r'"
                strokeWidth={3}
              />
              <AnimatedVector3D
                from={ex2ContactPt}
                to={ex2TangentBack}
                color={COLORS.highlight}
                drawProgress={1}
                strokeWidth={2}
                opacity={0.6}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: 0,
              bottom: 0,
              width: 760,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: summaryOp,
            }}
          >
            <div
              style={{
                color: COLORS.secondaryCurve,
                fontSize: 30,
                fontFamily: 'sans-serif',
                marginBottom: 28,
              }}
            >
              切线参数方程：
            </div>
            <MathFormula
              latex="x = -s,\quad y = 1,\quad z = \dfrac{\pi}{2} + s"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 例题3 场景（全局帧 960–1439）
// ═══════════════════════════════════════════════════════════════════════════

const Example3Scene: React.FC = () => {
  const frame = useCurrentFrame();

  const phase =
    frame < 1050 ? 'title' :
    frame < 1170 ? 'setup' :
    frame < 1350 ? 'animate' : 'summary';

  // 标题
  const titleOp = lerp(frame, 960, 1000);

  // 题目展示
  const setupBoxOp = lerp(frame, 1050, 1082);

  // 动画阶段
  const plane1Op = lerp(frame, 1170, 1230);
  const plane2Op = lerp(frame, 1205, 1265);
  const n1Progress = lerp(frame, 1260, 1315);
  const n2Progress = lerp(frame, 1280, 1335);
  const sProgress = lerp(frame, 1320, 1370);

  const ex3Step =
    frame >= 1340 ? 4 :
    frame >= 1312 ? 3 :
    frame >= 1272 ? 2 :
    frame >= 1218 ? 1 : 0;

  // 总结
  const summaryOp = lerp(frame, 1350, 1385);

  return (
    <AbsoluteFill>
      {/* ── 标题 ── */}
      {phase === 'title' && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              color: COLORS.tertiaryCurve,
              fontSize: 54,
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            例题3：两平面的位置关系
          </div>
          <div
            style={{
              color: COLORS.annotation,
              fontSize: 28,
              fontFamily: 'sans-serif',
              opacity: titleOp,
            }}
          >
            求两平面夹角及交线方向向量
          </div>
        </AbsoluteFill>
      )}

      {/* ── 题目展示 ── */}
      {phase === 'setup' && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 36,
          }}
        >
          <div style={{ opacity: setupBoxOp }}>
            <ExampleBox
              exampleNum={3}
              title="两平面的位置关系"
              width={1100}
              accentColor={COLORS.tertiaryCurve}
            >
              <div
                style={{
                  fontSize: 26,
                  color: COLORS.formula,
                  fontFamily: 'sans-serif',
                  lineHeight: 2,
                }}
              >
                <div>
                  平面 π₁:&nbsp;
                  <MathFormula
                    latex="2x - y + z = 3"
                    fontSize={30}
                    color={COLORS.primaryCurve}
                    displayMode={false}
                  />
                </div>
                <div>
                  平面 π₂:&nbsp;
                  <MathFormula
                    latex="x + y + 2z = 5"
                    fontSize={30}
                    color={COLORS.secondaryCurve}
                    displayMode={false}
                  />
                </div>
                <div>求两平面的夹角，及交线方向向量。</div>
              </div>
            </ExampleBox>
          </div>
        </AbsoluteFill>
      )}

      {/* ── 动画 + 解题步骤 ── */}
      {phase === 'animate' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[600, 500]}
              scale={60}
              xRange={[0, 4]}
              yRange={[0, 4]}
              zRange={[-2, 3]}
              width={1100}
              height={1000}
            >
              <Plane3D
                corners={ex3Plane1Corners}
                color={COLORS.primaryCurve}
                fillOpacity={0.2}
                opacity={plane1Op}
              />
              <Plane3D
                corners={ex3Plane2Corners}
                color={COLORS.secondaryCurve}
                fillOpacity={0.2}
                opacity={plane2Op}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3N1To}
                color={COLORS.primaryCurve}
                drawProgress={n1Progress}
                label="n₁"
                strokeWidth={3}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3N2To}
                color={COLORS.secondaryCurve}
                drawProgress={n2Progress}
                label="n₂"
                strokeWidth={3}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3STo}
                color={COLORS.vector}
                drawProgress={sProgress}
                label="s"
                strokeWidth={3}
              />
            </CoordinateSystem3D>
          </div>
          <div style={{ position: 'absolute', right: 60, top: 100, width: 740 }}>
            <div
              style={{
                color: COLORS.tertiaryCurve,
                fontSize: 24,
                fontFamily: 'sans-serif',
                marginBottom: 16,
                fontWeight: 'bold',
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={ex3Steps} currentStep={ex3Step} width={740} />
          </div>
        </>
      )}

      {/* ── 总结 ── */}
      {phase === 'summary' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CoordinateSystem3D
              center={[600, 500]}
              scale={60}
              xRange={[0, 4]}
              yRange={[0, 4]}
              zRange={[-2, 3]}
              width={1100}
              height={1000}
            >
              <Plane3D
                corners={ex3Plane1Corners}
                color={COLORS.primaryCurve}
                fillOpacity={0.25}
                opacity={1}
              />
              <Plane3D
                corners={ex3Plane2Corners}
                color={COLORS.secondaryCurve}
                fillOpacity={0.25}
                opacity={1}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3N1To}
                color={COLORS.primaryCurve}
                drawProgress={1}
                label="n₁"
                strokeWidth={3}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3N2To}
                color={COLORS.secondaryCurve}
                drawProgress={1}
                label="n₂"
                strokeWidth={3}
              />
              <AnimatedVector3D
                from={ex3Origin}
                to={ex3STo}
                color={COLORS.vector}
                drawProgress={1}
                label="s"
                strokeWidth={3}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 60,
              top: 0,
              bottom: 0,
              width: 760,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 36,
              opacity: summaryOp,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: COLORS.tertiaryCurve,
                  fontSize: 28,
                  fontFamily: 'sans-serif',
                  marginBottom: 16,
                }}
              >
                两平面夹角
              </div>
              <MathFormula
                latex="\theta = 60°\quad \left(\dfrac{\pi}{3}\right)"
                fontSize={60}
                color={COLORS.formula}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: COLORS.tertiaryCurve,
                  fontSize: 28,
                  fontFamily: 'sans-serif',
                  marginBottom: 16,
                }}
              >
                交线方向向量
              </div>
              <MathFormula
                latex="\mathbf{s} = (-1,\,-1,\,1)"
                fontSize={60}
                color={COLORS.formula}
              />
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 主组件（1440 帧 = 3 × 480）
// ═══════════════════════════════════════════════════════════════════════════

const Sec07Examples: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {frame < 480 && <Example1Scene />}
      {frame >= 480 && frame < 960 && <Example2Scene />}
      {frame >= 960 && <Example3Scene />}
    </AbsoluteFill>
  );
};

export default Sec07Examples;
