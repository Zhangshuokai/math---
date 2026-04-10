import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { ExampleBox } from "../../components/ui/ExampleBox";
import { SolutionSteps, SolutionStep } from "../../components/ui/SolutionSteps";

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (frame: number, start: number, duration = 30): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const lerp = (frame: number, start: number, end: number, from = 0, to = 1): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─────────────────────────────────────────────────────────────────────────────
// 布局常量
// ─────────────────────────────────────────────────────────────────────────────
const W = 1920;
const H = 1080;
const LEFT_W = Math.round(W * 0.6);   // 1152px
const RIGHT_W = W - LEFT_W;            // 768px

// ─────────────────────────────────────────────────────────────────────────────
// 公共子组件：例题标题场景
// ─────────────────────────────────────────────────────────────────────────────
interface ExampleTitleSceneProps {
  exNum: number;
  title: string;
  subtitle?: string;
  opacity: number;
}
const ExampleTitleScene: React.FC<ExampleTitleSceneProps> = ({
  exNum, title, subtitle, opacity,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 32,
    }}
  >
    <div
      style={{
        color: COLORS.primaryCurve,
        fontSize: 28,
        letterSpacing: 4,
        fontFamily: "sans-serif",
      }}
    >
      第七章 · 微分方程
    </div>
    <div
      style={{
        padding: "28px 80px",
        border: `3px solid ${COLORS.primaryCurve}`,
        borderRadius: 16,
        backgroundColor: COLORS.theoremBg,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.vector,
          fontSize: 22,
          fontFamily: "sans-serif",
          marginBottom: 12,
          letterSpacing: 2,
        }}
      >
        例题 {exNum}
      </div>
      <div
        style={{
          color: COLORS.formula,
          fontSize: 48,
          fontWeight: "bold",
          fontFamily: "sans-serif",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            color: COLORS.annotation,
            fontSize: 26,
            fontFamily: "sans-serif",
            marginTop: 16,
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  </AbsoluteFill>
);

// ─────────────────────────────────────────────────────────────────────────────
// 例题1：可分离变量方程  dy/dx = 2xy,  y(0)=1
//   帧范围：0–479
//   Phase1 (0–89):    标题
//   Phase2 (90–209):  展示题目
//   Phase3 (210–389): 逐步解题（5步，每步36帧）
//   Phase4 (390–479): 绘制解曲线
// ─────────────────────────────────────────────────────────────────────────────
const EX1_STEPS: SolutionStep[] = [
  { label: "第1步", content: "\\frac{dy}{y} = 2x\\,dx \\quad \\text{（分离变量）}" },
  { label: "第2步", content: "\\int \\frac{dy}{y} = \\int 2x\\,dx \\implies \\ln|y| = x^2 + C_1" },
  { label: "第3步", content: "y = Ce^{x^2} \\quad \\text{（通解，} C = e^{C_1}\\text{）}" },
  { label: "第4步", content: "y(0)=1 \\implies C = 1" },
  { label: "第5步", content: "y = e^{x^2} \\quad \\text{（特解）}" },
];

const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  // Phase 判断
  const phase =
    frame < 90 ? 1 : frame < 210 ? 2 : frame < 390 ? 3 : 4;

  // Phase1
  const titleOpacity = fade(frame, 0, 30);

  // Phase2
  const problemOpacity = fade(frame, 90, 30);
  const icOpacity = fade(frame, 130, 25);

  // Phase3：步骤（每36帧出现一步）
  const stepsBodyOpacity = fade(frame, 210, 20);
  const currentStep =
    frame < 210 ? 0 :
    frame < 246 ? 1 :
    frame < 282 ? 2 :
    frame < 318 ? 3 :
    frame < 354 ? 4 : 5;

  // Phase4：曲线描绘
  const coordOpacity = fade(frame, 390, 25);
  const curveProgress = lerp(frame, 415, 470);
  const solutionLabelOpacity = fade(frame, 465, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Phase 1: 标题 ── */}
      {phase === 1 && (
        <ExampleTitleScene
          exNum={1}
          title="可分离变量方程"
          subtitle="dy/dx = 2xy,  y(0) = 1"
          opacity={titleOpacity}
        />
      )}

      {/* ── Phase 2: 展示题目 ── */}
      {phase === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            padding: "0 200px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, fontFamily: "sans-serif", opacity: problemOpacity }}>
            求解微分方程（可分离变量型）
          </div>
          <div style={{ opacity: problemOpacity }}>
            <ExampleBox exampleNum={1} title="可分离变量方程" width={900} accentColor={COLORS.primaryCurve}>
              <div style={{ padding: "12px 0" }}>
                <MathFormula
                  latex="\frac{dy}{dx} = 2xy"
                  fontSize={56}
                  color={COLORS.formula}
                />
              </div>
            </ExampleBox>
          </div>
          <div style={{ opacity: icOpacity }}>
            <div style={{ padding: "16px 40px", border: `1px solid ${COLORS.vector}44`, borderRadius: 8, backgroundColor: "rgba(255,215,0,0.06)" }}>
              <MathFormula
                latex="\text{初始条件：} y(0) = 1"
                fontSize={36}
                color={COLORS.vector}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 3: 逐步解题（左右分栏） ── */}
      {phase === 3 && (
        <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
          {/* 左侧：步骤区 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: LEFT_W,
              height: H,
              padding: "60px 60px 40px 80px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <div
                style={{
                  color: COLORS.primaryCurve,
                  fontSize: 26,
                  fontFamily: "sans-serif",
                  marginBottom: 24,
                  borderBottom: `1px solid ${COLORS.primaryCurve}44`,
                  paddingBottom: 12,
                }}
              >
                解题过程
              </div>
              <SolutionSteps
                steps={EX1_STEPS}
                currentStep={currentStep}
                width={LEFT_W - 140}
                opacity={1}
              />
            </div>
          </div>

          {/* 右侧：公式展示区 */}
          <div
            style={{
              position: "absolute",
              left: LEFT_W,
              top: 0,
              width: RIGHT_W,
              height: H,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              padding: "40px",
              boxSizing: "border-box",
              borderLeft: `1px solid ${COLORS.grid}`,
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <ExampleBox exampleNum={1} width={RIGHT_W - 80} accentColor={COLORS.primaryCurve}>
                <div style={{ padding: "8px 0" }}>
                  <MathFormula latex="\frac{dy}{dx} = 2xy,\quad y(0)=1" fontSize={30} color={COLORS.formula} />
                </div>
              </ExampleBox>
            </div>
            {currentStep >= 5 && (
              <div
                style={{
                  padding: "20px 36px",
                  border: `2px solid ${COLORS.highlight}`,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,107,107,0.1)",
                }}
              >
                <MathFormula latex="y = e^{x^2}" fontSize={52} color={COLORS.highlight} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 4: 绘制解曲线 ── */}
      {phase === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            opacity: coordOpacity,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, fontFamily: "sans-serif" }}>
            特解曲线：y = e^{"{x²}"}
          </div>
          <CoordinateSystem
            width={900}
            height={480}
            xRange={[-2, 2]}
            yRange={[0, 8]}
            opacity={1}
          >
            <FunctionPlot
              fn={(x) => Math.min(Math.exp(x * x), 8.5)}
              color={COLORS.primaryCurve}
              drawProgress={curveProgress}
              strokeWidth={3.5}
            />
          </CoordinateSystem>
          <div style={{ opacity: solutionLabelOpacity, fontSize: 24, color: COLORS.annotation, fontFamily: "sans-serif" }}>
            满足初始条件 y(0) = 1，过点 (0, 1)
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题2：一阶线性方程（积分因子法）  y' + y = eˣ
//   帧范围：480–959（局部帧 0–479）
//   Phase1 (0–89):    标题
//   Phase2 (90–209):  展示题目
//   Phase3 (210–389): 逐步解题（5步，每步36帧）
//   Phase4 (390–479): 绘制 C=0 特解曲线
// ─────────────────────────────────────────────────────────────────────────────
const EX2_STEPS: SolutionStep[] = [
  { label: "第1步", content: "\\text{标准形式：} P(x)=1,\\; Q(x)=e^x" },
  { label: "第2步", content: "\\mu = e^{\\int P\\,dx} = e^{\\int 1\\,dx} = e^x \\quad \\text{（积分因子）}" },
  { label: "第3步", content: "\\text{两边乘 } \\mu:\\; (y e^x)' = e^x \\cdot e^x = e^{2x}" },
  { label: "第4步", content: "y e^x = \\int e^{2x}\\,dx = \\frac{e^{2x}}{2} + C" },
  { label: "第5步", content: "y = \\frac{e^x}{2} + Ce^{-x} \\quad \\text{（通解）}" },
];

const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  // frame 已是局部帧（0–479）
  const phase =
    frame < 90 ? 1 : frame < 210 ? 2 : frame < 390 ? 3 : 4;

  const titleOpacity = fade(frame, 0, 30);

  const problemOpacity = fade(frame, 90, 30);
  const noteOpacity = fade(frame, 135, 25);

  const stepsBodyOpacity = fade(frame, 210, 20);
  const currentStep =
    frame < 210 ? 0 :
    frame < 246 ? 1 :
    frame < 282 ? 2 :
    frame < 318 ? 3 :
    frame < 354 ? 4 : 5;

  const coordOpacity = fade(frame, 390, 25);
  const curve0Progress = lerp(frame, 410, 465);
  const curve1Progress = lerp(frame, 435, 470);
  const legendOpacity = fade(frame, 465, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Phase 1: 标题 ── */}
      {phase === 1 && (
        <ExampleTitleScene
          exNum={2}
          title="一阶线性方程"
          subtitle="积分因子法：y' + y = eˣ"
          opacity={titleOpacity}
        />
      )}

      {/* ── Phase 2: 展示题目 ── */}
      {phase === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 44,
            padding: "0 200px",
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 28, fontFamily: "sans-serif", opacity: problemOpacity }}>
            一阶线性微分方程（积分因子法）
          </div>
          <div style={{ opacity: problemOpacity }}>
            <ExampleBox exampleNum={2} title="积分因子法" width={900} accentColor={COLORS.secondaryCurve}>
              <div style={{ padding: "12px 0" }}>
                <MathFormula latex="y' + y = e^x" fontSize={56} color={COLORS.formula} />
              </div>
            </ExampleBox>
          </div>
          <div
            style={{
              opacity: noteOpacity,
              padding: "16px 40px",
              border: `1px solid ${COLORS.secondaryCurve}44`,
              borderRadius: 8,
              backgroundColor: "rgba(255,121,198,0.06)",
            }}
          >
            <MathFormula
              latex="\text{标准形式：} y' + P(x)y = Q(x)"
              fontSize={32}
              color={COLORS.secondaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 3: 逐步解题 ── */}
      {phase === 3 && (
        <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
          {/* 左侧：步骤区 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: LEFT_W,
              height: H,
              padding: "60px 60px 40px 80px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <div
                style={{
                  color: COLORS.secondaryCurve,
                  fontSize: 26,
                  fontFamily: "sans-serif",
                  marginBottom: 24,
                  borderBottom: `1px solid ${COLORS.secondaryCurve}44`,
                  paddingBottom: 12,
                }}
              >
                解题过程
              </div>
              <SolutionSteps
                steps={EX2_STEPS}
                currentStep={currentStep}
                width={LEFT_W - 140}
                opacity={1}
              />
            </div>
          </div>

          {/* 右侧 */}
          <div
            style={{
              position: "absolute",
              left: LEFT_W,
              top: 0,
              width: RIGHT_W,
              height: H,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              padding: "40px",
              boxSizing: "border-box",
              borderLeft: `1px solid ${COLORS.grid}`,
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <ExampleBox exampleNum={2} width={RIGHT_W - 80} accentColor={COLORS.secondaryCurve}>
                <div style={{ padding: "8px 0" }}>
                  <MathFormula latex="y' + y = e^x" fontSize={30} color={COLORS.formula} />
                </div>
              </ExampleBox>
            </div>
            {currentStep >= 5 && (
              <div
                style={{
                  padding: "20px 36px",
                  border: `2px solid ${COLORS.secondaryCurve}`,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,121,198,0.1)",
                }}
              >
                <MathFormula latex="y = \frac{e^x}{2} + Ce^{-x}" fontSize={46} color={COLORS.secondaryCurve} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 4: 绘制解曲线 ── */}
      {phase === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            opacity: coordOpacity,
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 28, fontFamily: "sans-serif" }}>
            通解曲线族（不同 C 值）
          </div>
          <CoordinateSystem
            width={900}
            height={480}
            xRange={[-2, 2.5]}
            yRange={[-3, 6]}
            opacity={1}
          >
            {/* C=0: y = eˣ/2 */}
            <FunctionPlot
              fn={(x) => Math.exp(x) / 2}
              color={COLORS.secondaryCurve}
              drawProgress={curve0Progress}
              strokeWidth={3.5}
            />
            {/* C=1: y = eˣ/2 + e⁻ˣ */}
            <FunctionPlot
              fn={(x) => Math.exp(x) / 2 + Math.exp(-x)}
              color={COLORS.primaryCurve}
              drawProgress={curve1Progress}
              strokeWidth={2.5}
              opacity={0.75}
            />
            {/* C=-1: y = eˣ/2 - e⁻ˣ */}
            <FunctionPlot
              fn={(x) => Math.exp(x) / 2 - Math.exp(-x)}
              color={COLORS.tertiaryCurve}
              drawProgress={curve1Progress}
              strokeWidth={2.5}
              opacity={0.75}
            />
          </CoordinateSystem>
          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: legendOpacity,
              fontSize: 22,
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ color: COLORS.secondaryCurve }}>— C=0: y=e^x/2</div>
            <div style={{ color: COLORS.primaryCurve }}>— C=1: y=e^x/2+e^{"-x"}</div>
            <div style={{ color: COLORS.tertiaryCurve }}>— C=-1: y=e^x/2-e^{"-x"}</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 例题3：二阶常系数方程  y'' + 4y = 0（弹簧振动）
//   帧范围：960–1439（局部帧 0–479）
//   Phase1 (0–89):    标题
//   Phase2 (90–209):  展示题目和物理背景
//   Phase3 (210–389): 逐步解题（4步，每步45帧）
//   Phase4 (390–479): 动态绘制 y = cos(2x)
// ─────────────────────────────────────────────────────────────────────────────
const EX3_STEPS: SolutionStep[] = [
  { label: "第1步", content: "\\text{特征方程：} r^2 + 4 = 0" },
  { label: "第2步", content: "r^2 = -4 \\implies r = \\pm 2i \\quad \\text{（纯虚根）}" },
  { label: "第3步", content: "y = C_1\\cos 2x + C_2\\sin 2x \\quad \\text{（通解）}" },
  { label: "第4步", content: "\\omega = 2,\\quad T = \\frac{2\\pi}{\\omega} = \\pi \\quad \\text{（角频率·周期）}" },
];

const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  // frame 已是局部帧（0–479）
  const phase =
    frame < 90 ? 1 : frame < 210 ? 2 : frame < 390 ? 3 : 4;

  const titleOpacity = fade(frame, 0, 30);

  const problemOpacity = fade(frame, 90, 30);
  const bgOpacity = fade(frame, 135, 25);
  const infoOpacity = fade(frame, 165, 25);

  const stepsBodyOpacity = fade(frame, 210, 20);
  // 4步，每步45帧
  const currentStep =
    frame < 210 ? 0 :
    frame < 255 ? 1 :
    frame < 300 ? 2 :
    frame < 345 ? 3 : 4;

  const coordOpacity = fade(frame, 390, 25);
  const cosProgress = lerp(frame, 410, 470);
  const sinProgress = lerp(frame, 425, 475);
  const labelOpacity = fade(frame, 468, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Phase 1: 标题 ── */}
      {phase === 1 && (
        <ExampleTitleScene
          exNum={3}
          title="弹簧简谐振动"
          subtitle="二阶常系数方程：y'' + 4y = 0"
          opacity={titleOpacity}
        />
      )}

      {/* ── Phase 2: 题目与物理背景 ── */}
      {phase === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 36,
            padding: "0 160px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 28, fontFamily: "sans-serif", opacity: problemOpacity }}>
            弹簧质量系统的振动方程
          </div>
          <div style={{ opacity: problemOpacity }}>
            <ExampleBox exampleNum={3} title="弹簧振动方程" width={960} accentColor={COLORS.vector}>
              <div style={{ padding: "12px 0" }}>
                <MathFormula latex="y'' + 4y = 0" fontSize={56} color={COLORS.formula} />
              </div>
            </ExampleBox>
          </div>

          {/* 物理背景说明 */}
          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: bgOpacity,
            }}
          >
            <div
              style={{
                padding: "14px 28px",
                border: `1px solid ${COLORS.primaryCurve}44`,
                borderRadius: 8,
                backgroundColor: COLORS.theoremBg,
                textAlign: "center",
              }}
            >
              <MathFormula latex="my'' + ky = 0" fontSize={28} color={COLORS.primaryCurve} />
              <div style={{ color: COLORS.annotation, fontSize: 18, fontFamily: "sans-serif", marginTop: 8 }}>
                弹簧方程原型
              </div>
            </div>
            <div
              style={{
                padding: "14px 28px",
                border: `1px solid ${COLORS.secondaryCurve}44`,
                borderRadius: 8,
                backgroundColor: "rgba(255,121,198,0.07)",
                textAlign: "center",
              }}
            >
              <MathFormula latex="m=1,\; k=4" fontSize={28} color={COLORS.secondaryCurve} />
              <div style={{ color: COLORS.annotation, fontSize: 18, fontFamily: "sans-serif", marginTop: 8 }}>
                参数取值
              </div>
            </div>
          </div>

          <div
            style={{
              opacity: infoOpacity,
              color: COLORS.annotation,
              fontSize: 24,
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            其中 y 表示质点的位移，x 表示时间
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 3: 逐步解题 ── */}
      {phase === 3 && (
        <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
          {/* 左侧：步骤区 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: LEFT_W,
              height: H,
              padding: "60px 60px 40px 80px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <div
                style={{
                  color: COLORS.vector,
                  fontSize: 26,
                  fontFamily: "sans-serif",
                  marginBottom: 24,
                  borderBottom: `1px solid ${COLORS.vector}44`,
                  paddingBottom: 12,
                }}
              >
                解题过程（特征根法）
              </div>
              <SolutionSteps
                steps={EX3_STEPS}
                currentStep={currentStep}
                width={LEFT_W - 140}
                opacity={1}
              />
            </div>
          </div>

          {/* 右侧 */}
          <div
            style={{
              position: "absolute",
              left: LEFT_W,
              top: 0,
              width: RIGHT_W,
              height: H,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              padding: "40px",
              boxSizing: "border-box",
              borderLeft: `1px solid ${COLORS.grid}`,
            }}
          >
            <div style={{ opacity: stepsBodyOpacity }}>
              <ExampleBox exampleNum={3} width={RIGHT_W - 80} accentColor={COLORS.vector}>
                <div style={{ padding: "8px 0" }}>
                  <MathFormula latex="y'' + 4y = 0" fontSize={30} color={COLORS.formula} />
                </div>
              </ExampleBox>
            </div>

            {currentStep >= 2 && (
              <div
                style={{
                  padding: "14px 28px",
                  border: `1px solid ${COLORS.highlight}44`,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,107,107,0.08)",
                  textAlign: "center",
                }}
              >
                <MathFormula latex="r = \pm 2i" fontSize={38} color={COLORS.highlight} />
                <div style={{ color: COLORS.annotation, fontSize: 18, fontFamily: "sans-serif", marginTop: 6 }}>
                  纯虚根 → 周期振荡解
                </div>
              </div>
            )}

            {currentStep >= 3 && (
              <div
                style={{
                  padding: "18px 28px",
                  border: `2px solid ${COLORS.vector}`,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,215,0,0.08)",
                }}
              >
                <MathFormula latex="y = C_1\cos 2x + C_2\sin 2x" fontSize={32} color={COLORS.vector} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 4: 动态绘制振荡曲线 ── */}
      {phase === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            opacity: coordOpacity,
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 28, fontFamily: "sans-serif" }}>
            简谐振动解曲线（角频率 ω=2，周期 T=π）
          </div>
          <CoordinateSystem
            width={960}
            height={480}
            xRange={[0, 4 * Math.PI]}
            yRange={[-1.5, 1.5]}
            opacity={1}
          >
            {/* y = cos(2x): C₁=1, C₂=0 */}
            <FunctionPlot
              fn={(x) => Math.cos(2 * x)}
              color={COLORS.primaryCurve}
              drawProgress={cosProgress}
              strokeWidth={3.5}
            />
            {/* y = sin(2x): C₁=0, C₂=1 */}
            <FunctionPlot
              fn={(x) => Math.sin(2 * x)}
              color={COLORS.secondaryCurve}
              drawProgress={sinProgress}
              strokeWidth={2.5}
              opacity={0.8}
            />
          </CoordinateSystem>
          <div
            style={{
              display: "flex",
              gap: 48,
              opacity: labelOpacity,
              fontSize: 22,
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ color: COLORS.primaryCurve }}>— y = cos 2x（C₁=1, C₂=0）</div>
            <div style={{ color: COLORS.secondaryCurve }}>— y = sin 2x（C₁=0, C₂=1）</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 主组件：Sec10Examples（1440 帧）
// ─────────────────────────────────────────────────────────────────────────────
const Sec10Examples: React.FC = () => {
  const frame = useCurrentFrame();

  // 例题1：0–479
  // 例题2：480–959（局部帧 = frame - 480）
  // 例题3：960–1439（局部帧 = frame - 960）

  if (frame < 480) {
    return <Example1 frame={frame} />;
  } else if (frame < 960) {
    return <Example2 frame={frame - 480} />;
  } else {
    return <Example3 frame={frame - 960} />;
  }
};

export default Sec10Examples;
