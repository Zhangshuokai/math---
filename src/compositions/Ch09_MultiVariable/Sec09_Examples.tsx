import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { CoordinateSystem3D, useCoordContext3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";
import { AnimatedVector3D } from "../../components/math/AnimatedVector3D";
import { Plane3D } from "../../components/math/Plane3D";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { ExampleBox } from "../../components/ui/ExampleBox";
import { SolutionSteps, SolutionStep } from "../../components/ui/SolutionSteps";
import { MathFormula } from "../../components/math/MathFormula";

// ============================================================
// 工具函数
// ============================================================
const fade = (frame: number, start: number, duration = 30): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, start: number, duration = 30): number =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ============================================================
// 局部 Helper 组件（必须在模块顶层定义）
// ============================================================

// 3D空间中的点标注
const PointInSpace3D: React.FC<{
  pos: [number, number, number];
  label?: string;
  color?: string;
  opacity?: number;
}> = ({ pos, label, color = "#ffd700", opacity = 1 }) => {
  const { toISO } = useCoordContext3D();
  const { svgX: sx, svgY: sy } = toISO(pos[0], pos[1], pos[2]);
  return (
    <g opacity={opacity}>
      <circle cx={sx} cy={sy} r={7} fill={color} />
      <circle cx={sx} cy={sy} r={10} fill={color} fillOpacity={0.3} />
      {label && (
        <text
          x={sx + 12}
          y={sy - 12}
          fill={color}
          fontSize={16}
          fontFamily="serif"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

// 2D坐标系中的点标注
const PointIn2D: React.FC<{
  mx: number;
  my: number;
  label?: string;
  color?: string;
  opacity?: number;
}> = ({ mx, my, label, color = "#ffd700", opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const { px, py } = toPixel(mx, my);
  return (
    <g opacity={opacity}>
      <circle cx={px} cy={py} r={7} fill={color} />
      <circle cx={px} cy={py} r={11} fill={color} fillOpacity={0.3} />
      {label && (
        <text
          x={px + 10}
          y={py - 10}
          fill={color}
          fontSize={14}
          fontFamily="serif"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

// ============================================================
// 例题1：抛物面 z = x²+y² 在点(1,1,2)处的切平面和法线
// 局部帧：0-479
// ============================================================
const Example1: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // 阶段1：标题 (0-89)
  const titleOpacity = f < 60
    ? fade(f, 0, 30)
    : fade(f, 0, 30) * fadeOut(f, 60, 29);

  // 阶段2：题目展示 (90-209)
  const exampleOpacity = f < 180
    ? fade(f, 90, 30)
    : fade(f, 90, 30) * fadeOut(f, 180, 29);

  // 阶段3：3D动画 (210-389)
  // 抛物面：210-290帧逐渐出现
  const surfaceOpacity = interpolate(f, [210, 280], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 切点：290帧出现
  const pointOpacity = fade(f, 290, 25);
  // 切平面：330帧出现
  const planeOpacity = fade(f, 330, 30);
  // 法线向量：380帧开始绘制
  const normalProgress = interpolate(f, [380, 430], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3D场景整体：210起显示，390前开始淡出
  const scene3DOpacity = f < 210
    ? 0
    : f < 370
    ? fade(f, 210, 20)
    : f < 389
    ? 1
    : 0;

  // 右侧解题步骤：根据3D动画进度显示
  let currentStep1 = 0;
  if (f >= 215) currentStep1 = 1;
  if (f >= 245) currentStep1 = 2;
  if (f >= 275) currentStep1 = 3;
  if (f >= 305) currentStep1 = 4;
  if (f >= 340) currentStep1 = 5;
  if (f >= 365) currentStep1 = 6;

  const stepsOpacity3D = f >= 210 && f < 395 ? fade(f, 210, 25) : f >= 395 ? fadeOut(f, 395, 20) : 0;

  // 阶段4：总结 (390-479)
  const summaryOpacity = fade(f, 395, 35);

  const steps1: SolutionStep[] = [
    { label: "步骤1", content: "\\text{令 } F(x,y,z) = x^2 + y^2 - z = 0", isLatex: true },
    { label: "步骤2", content: "F_x = 2x,\\quad F_y = 2y,\\quad F_z = -1", isLatex: true },
    { label: "步骤3", content: "\\text{在}(1,1,2)\\text{处：}F_x=2,\\ F_y=2,\\ F_z=-1", isLatex: true },
    { label: "步骤4", content: "\\text{切平面：}2(x-1)+2(y-1)-(z-2)=0", isLatex: true },
    { label: "步骤5", content: "\\Rightarrow\\ 2x+2y-z=2", isLatex: true },
    { label: "步骤6", content: "\\text{法线：}\\dfrac{x-1}{2}=\\dfrac{y-1}{2}=\\dfrac{z-2}{-1}", isLatex: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* 阶段1：标题 */}
      {f < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 54,
              fontFamily: "serif",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            例题1：曲面的切平面与法线
          </div>
        </div>
      )}

      {/* 阶段2：题目展示 */}
      {f >= 90 && f < 210 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: exampleOpacity,
          }}
        >
          <ExampleBox exampleNum={1} title="曲面的切平面与法线" width={960}>
            <div style={{ color: "#ffffff", fontSize: 26, fontFamily: "serif", lineHeight: 2 }}>
              求曲面{" "}
              <MathFormula latex="z = x^2 + y^2" fontSize={26} color={COLORS.primaryCurve} displayMode={false} />
              {" "}在点{" "}
              <MathFormula latex="(1,\,1,\,2)" fontSize={26} color={COLORS.vector} displayMode={false} />
              {" "}处的切平面方程和法线方程。
            </div>
          </ExampleBox>
        </div>
      )}

      {/* 阶段3：3D 场景 + 解题步骤 */}
      {f >= 210 && f < 390 && (
        <>
          {/* 左侧 3D 坐标系 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 900,
              height: 1080,
              opacity: scene3DOpacity,
            }}
          >
            <CoordinateSystem3D
              center={[450, 700]}
              scale={75}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 5]}
              width={900}
              height={1080}
            >
              {/* 抛物面 z = x²+y²（截断到4.5） */}
              <SurfaceMesh3D
                x={(u, _v) => u}
                y={(_u, v) => v}
                z={(u, v) => Math.min(u * u + v * v, 4.5)}
                uMin={-2}
                uMax={2}
                vMin={-2}
                vMax={2}
                uSteps={8}
                vSteps={8}
                color={COLORS.primaryCurve}
                strokeWidth={1}
                opacity={surfaceOpacity}
              />

              {/* 切点 (1, 1, 2) */}
              {f >= 290 && (
                <PointInSpace3D
                  pos={[1, 1, 2]}
                  label="(1,1,2)"
                  color={COLORS.highlight}
                  opacity={pointOpacity}
                />
              )}

              {/* 切平面 z = 2x+2y-2（角点均满足该方程） */}
              {f >= 330 && (
                <Plane3D
                  corners={[
                    [-0.5, -0.5, -4],
                    [2.5, -0.5, 2],
                    [2.5, 2.5, 8],
                    [-0.5, 2.5, 2],
                  ]}
                  color={COLORS.secondaryCurve}
                  fillOpacity={0.22}
                  strokeOpacity={0.85}
                  strokeWidth={2}
                  opacity={planeOpacity}
                />
              )}

              {/* 法线方向向量，方向 ∝ (2,2,-1) */}
              {f >= 380 && (
                <AnimatedVector3D
                  from={[1, 1, 2]}
                  to={[1.53, 1.53, 1.67]}
                  color={COLORS.vector}
                  strokeWidth={3}
                  drawProgress={normalProgress}
                  label="n"
                  labelOffset={[10, -12]}
                />
              )}
            </CoordinateSystem3D>
          </div>

          {/* 右侧解题步骤 */}
          <div
            style={{
              position: "absolute",
              left: 920,
              top: 160,
              width: 940,
              opacity: stepsOpacity3D,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                fontSize: 28,
                fontFamily: "serif",
                fontWeight: "bold",
                marginBottom: 24,
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={steps1} currentStep={currentStep1} width={920} />
          </div>
        </>
      )}

      {/* 阶段4：总结 */}
      {f >= 390 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            opacity: summaryOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 40,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            例题1 结论
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>切平面方程：</span>
              <MathFormula
                latex="2x + 2y - z = 2"
                fontSize={34}
                color={COLORS.secondaryCurve}
                displayMode={false}
              />
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>法线方程：</span>
              <MathFormula
                latex="\dfrac{x-1}{2}=\dfrac{y-1}{2}=\dfrac{z-2}{-1}"
                fontSize={32}
                color={COLORS.vector}
                displayMode={false}
              />
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================
// 例题2：求 f(x,y) = x²+y²-xy-x-y 的极值
// 局部帧：0-479（调用时传入 frame-480）
// ============================================================
const Example2: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // 阶段1：标题 (0-89)
  const titleOpacity = f < 60
    ? fade(f, 0, 30)
    : fade(f, 0, 30) * fadeOut(f, 60, 29);

  // 阶段2：题目展示 (90-209)
  const exampleOpacity = f < 180
    ? fade(f, 90, 30)
    : fade(f, 90, 30) * fadeOut(f, 180, 29);

  // 阶段3：2D 动画 + 解题 (210-389)
  // f=0 等高线（上支）：210-270帧
  const c0UpperProgress = interpolate(f, [210, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // f=0 等高线（下支）：230-290帧
  const c0LowerProgress = interpolate(f, [230, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // f=-0.5 等高线：265-325帧
  const cHalfUpperProgress = interpolate(f, [265, 325], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cHalfLowerProgress = interpolate(f, [280, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 极值点：335帧出现
  const pointOpacity2 = fade(f, 335, 25);

  // 2D场景整体透明度
  const scene2DOpacity = f < 210
    ? 0
    : f < 380
    ? fade(f, 210, 20)
    : fadeOut(f, 380, 20);

  const stepsOpacity2D = scene2DOpacity;

  // 解题步骤显示进度
  let currentStep2 = 0;
  if (f >= 215) currentStep2 = 1;
  if (f >= 248) currentStep2 = 2;
  if (f >= 280) currentStep2 = 3;
  if (f >= 310) currentStep2 = 4;
  if (f >= 340) currentStep2 = 5;
  if (f >= 365) currentStep2 = 6;

  // 阶段4：总结 (390-479)
  const summaryOpacity = fade(f, 395, 35);

  const steps2: SolutionStep[] = [
    { label: "步骤1", content: "f_x = 2x - y - 1 = 0", isLatex: true },
    { label: "步骤2", content: "f_y = 2y - x - 1 = 0", isLatex: true },
    { label: "步骤3", content: "\\text{联立解得唯一驻点：}(1,\\ 1)", isLatex: true },
    {
      label: "步骤4",
      content: "A = f_{xx} = 2,\\quad B = f_{xy} = -1,\\quad C = f_{yy} = 2",
      isLatex: true,
    },
    {
      label: "步骤5",
      content: "B^2 - AC = 1 - 4 = -3 < 0,\\quad A = 2 > 0",
      isLatex: true,
    },
    {
      label: "步骤6",
      content: "(1,1)\\text{ 是极小值点，极小值 } f(1,1) = -1",
      isLatex: true,
    },
  ];

  // f(x,y) = x²+y²-xy-x-y 等高线 f=c 的 y 解（关于 x 的函数）
  // y² - y(x+1) + (x²-x-c) = 0
  // discriminant = (x+1)² - 4(x²-x-c) = -3x²+6x+1+4c

  const makeContourUpper = (c: number) => (x: number): number => {
    const disc = -3 * x * x + 6 * x + 1 + 4 * c;
    if (disc < 0) return NaN;
    return ((x + 1) + Math.sqrt(disc)) / 2;
  };

  const makeContourLower = (c: number) => (x: number): number => {
    const disc = -3 * x * x + 6 * x + 1 + 4 * c;
    if (disc < 0) return NaN;
    return ((x + 1) - Math.sqrt(disc)) / 2;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* 阶段1：标题 */}
      {f < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 54,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            例题2：二元函数的极值
          </div>
        </div>
      )}

      {/* 阶段2：题目展示 */}
      {f >= 90 && f < 210 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: exampleOpacity,
          }}
        >
          <ExampleBox exampleNum={2} title="二元函数的极值" width={960}>
            <div style={{ color: "#ffffff", fontSize: 26, fontFamily: "serif", lineHeight: 2 }}>
              求函数{" "}
              <MathFormula
                latex="f(x,y) = x^2 + y^2 - xy - x - y"
                fontSize={26}
                color={COLORS.primaryCurve}
                displayMode={false}
              />
              {" "}的极值。
            </div>
          </ExampleBox>
        </div>
      )}

      {/* 阶段3：2D 等高线 + 解题步骤 */}
      {f >= 210 && f < 390 && (
        <>
          {/* 左侧 2D 坐标系 */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 90,
              width: 860,
              height: 860,
              opacity: scene2DOpacity,
            }}
          >
            <CoordinateSystem
              width={860}
              height={820}
              xRange={[-1, 3]}
              yRange={[-1, 3]}
              showGrid={true}
              gridStep={1}
              showLabels={true}
            >
              {/* f = 0 等高线上支：disc = -3x²+6x+1 >= 0，x∈[-0.15, 2.15] */}
              <FunctionPlot
                fn={makeContourUpper(0)}
                color={COLORS.primaryCurve}
                strokeWidth={2.5}
                drawProgress={c0UpperProgress}
                xMin={-0.15}
                xMax={2.15}
                opacity={0.85}
              />
              {/* f = 0 等高线下支 */}
              <FunctionPlot
                fn={makeContourLower(0)}
                color={COLORS.primaryCurve}
                strokeWidth={2.5}
                drawProgress={c0LowerProgress}
                xMin={-0.15}
                xMax={2.15}
                opacity={0.85}
              />

              {/* f = -0.5 等高线：disc = -3x²+6x >= 0，x∈[0, 2] */}
              <FunctionPlot
                fn={makeContourUpper(-0.5)}
                color={COLORS.tertiaryCurve}
                strokeWidth={2}
                drawProgress={cHalfUpperProgress}
                xMin={0.01}
                xMax={1.99}
                opacity={0.8}
              />
              <FunctionPlot
                fn={makeContourLower(-0.5)}
                color={COLORS.tertiaryCurve}
                strokeWidth={2}
                drawProgress={cHalfLowerProgress}
                xMin={0.01}
                xMax={1.99}
                opacity={0.8}
              />

              {/* 极小值点 (1, 1) */}
              {f >= 335 && (
                <PointIn2D
                  mx={1}
                  my={1}
                  label="极小值点(1,1)"
                  color={COLORS.highlight}
                  opacity={pointOpacity2}
                />
              )}

              {/* 标注等高线 */}
              {f >= 270 && (
                <text x={720} y={80} fill={COLORS.primaryCurve} fontSize={15} opacity={c0UpperProgress}>
                  f = 0
                </text>
              )}
              {f >= 310 && (
                <text x={720} y={110} fill={COLORS.tertiaryCurve} fontSize={15} opacity={cHalfUpperProgress}>
                  f = -0.5
                </text>
              )}
            </CoordinateSystem>
          </div>

          {/* 右侧解题步骤 */}
          <div
            style={{
              position: "absolute",
              left: 920,
              top: 160,
              width: 940,
              opacity: stepsOpacity2D,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                fontSize: 28,
                fontFamily: "serif",
                fontWeight: "bold",
                marginBottom: 24,
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={steps2} currentStep={currentStep2} width={920} />
          </div>
        </>
      )}

      {/* 阶段4：总结 */}
      {f >= 390 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            opacity: summaryOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 40,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            例题2 结论
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>极小值点：</span>
              <MathFormula
                latex="(1,\ 1)"
                fontSize={34}
                color={COLORS.vector}
                displayMode={false}
              />
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>极小值：</span>
              <MathFormula
                latex="f(1,\ 1) = -1"
                fontSize={34}
                color={COLORS.highlight}
                displayMode={false}
              />
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================
// 例题3：隐函数定理——椭圆切线
// 局部帧：0-479（调用时传入 frame-960）
// ============================================================
const Example3: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // 预计算常量
  const PX0 = Math.sqrt(2);       // ≈ 1.414
  const PY0 = Math.sqrt(2) / 2;   // ≈ 0.707
  const SQRT2 = Math.sqrt(2);     // ≈ 1.414

  // 阶段1：标题 (0-89)
  const titleOpacity = f < 60
    ? fade(f, 0, 30)
    : fade(f, 0, 30) * fadeOut(f, 60, 29);

  // 阶段2：题目展示 (90-209)
  const exampleOpacity = f < 180
    ? fade(f, 90, 30)
    : fade(f, 90, 30) * fadeOut(f, 180, 29);

  // 阶段3：2D 动画 + 解题 (210-389)
  // 椭圆上半部分：210-290帧
  const ellipseTopProgress = interpolate(f, [210, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 椭圆下半部分：240-320帧
  const ellipseBotProgress = interpolate(f, [240, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 切点：290帧出现
  const pointOpacity3 = fade(f, 290, 25);
  // 切线：320-375帧绘制
  const tangentProgress = interpolate(f, [320, 380], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2D场景透明度
  const scene2DOpacity = f < 210
    ? 0
    : f < 380
    ? fade(f, 210, 20)
    : fadeOut(f, 380, 20);

  const stepsOpacity3D = scene2DOpacity;

  // 解题步骤
  let currentStep3 = 0;
  if (f >= 215) currentStep3 = 1;
  if (f >= 255) currentStep3 = 2;
  if (f >= 295) currentStep3 = 3;
  if (f >= 330) currentStep3 = 4;
  if (f >= 365) currentStep3 = 5;

  // 阶段4：总结 (390-479)
  const summaryOpacity = fade(f, 395, 35);

  // 椭圆 x²/4+y²=1 的参数化
  const ellipseTop = (x: number): number => Math.sqrt(Math.max(0, 1 - x * x / 4));
  const ellipseBot = (x: number): number => -Math.sqrt(Math.max(0, 1 - x * x / 4));

  // 切线方程：y = -x/2 + √2（斜率=-1/2，过点(√2, √2/2)）
  const tangentLine = (x: number): number => -x / 2 + SQRT2;

  const steps3: SolutionStep[] = [
    {
      label: "步骤1",
      content: "\\text{令 } F(x,y) = \\dfrac{x^2}{4} + y^2 - 1",
      isLatex: true,
    },
    {
      label: "步骤2",
      content: "F_x = \\dfrac{x}{2},\\quad F_y = 2y",
      isLatex: true,
    },
    {
      label: "步骤3",
      content: "\\dfrac{dy}{dx} = -\\dfrac{F_x}{F_y} = -\\dfrac{x/2}{2y} = -\\dfrac{x}{4y}",
      isLatex: true,
    },
    {
      label: "步骤4",
      content:
        "\\text{代入}\\left(\\sqrt{2},\\,\\dfrac{\\sqrt{2}}{2}\\right):\\quad" +
        "\\dfrac{dy}{dx} = -\\dfrac{\\sqrt{2}}{4 \\cdot \\frac{\\sqrt{2}}{2}} = -\\dfrac{1}{2}",
      isLatex: true,
    },
    {
      label: "步骤5",
      content:
        "\\text{切线：} y - \\dfrac{\\sqrt{2}}{2} = -\\dfrac{1}{2}\\!\\left(x - \\sqrt{2}\\right)" +
        "\\;\\Rightarrow\\; x + 2y = 2\\sqrt{2}",
      isLatex: true,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* 阶段1：标题 */}
      {f < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 50,
              fontFamily: "serif",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            例题3：隐函数的导数<br />——椭圆切线
          </div>
        </div>
      )}

      {/* 阶段2：题目展示 */}
      {f >= 90 && f < 210 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: exampleOpacity,
          }}
        >
          <ExampleBox exampleNum={3} title="隐函数定理与椭圆切线" width={960}>
            <div style={{ color: "#ffffff", fontSize: 26, fontFamily: "serif", lineHeight: 2 }}>
              已知椭圆方程{" "}
              <MathFormula
                latex="\dfrac{x^2}{4} + y^2 = 1"
                fontSize={26}
                color={COLORS.primaryCurve}
                displayMode={false}
              />
              ，在点{" "}
              <MathFormula
                latex="\left(\sqrt{2},\;\dfrac{\sqrt{2}}{2}\right)"
                fontSize={26}
                color={COLORS.vector}
                displayMode={false}
              />
              {" "}处，求{" "}
              <MathFormula
                latex="\dfrac{dy}{dx}"
                fontSize={26}
                color={COLORS.highlight}
                displayMode={false}
              />
              {" "}及切线方程。
            </div>
          </ExampleBox>
        </div>
      )}

      {/* 阶段3：2D 椭圆 + 解题步骤 */}
      {f >= 210 && f < 390 && (
        <>
          {/* 左侧 2D 坐标系 */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 90,
              width: 860,
              height: 860,
              opacity: scene2DOpacity,
            }}
          >
            <CoordinateSystem
              width={860}
              height={820}
              xRange={[-3, 3]}
              yRange={[-2, 2]}
              showGrid={true}
              gridStep={1}
              showLabels={true}
            >
              {/* 椭圆上半部分 y = √(1 - x²/4) */}
              <FunctionPlot
                fn={ellipseTop}
                color={COLORS.primaryCurve}
                strokeWidth={3}
                drawProgress={ellipseTopProgress}
                xMin={-2}
                xMax={2}
              />
              {/* 椭圆下半部分 y = -√(1 - x²/4) */}
              <FunctionPlot
                fn={ellipseBot}
                color={COLORS.secondaryCurve}
                strokeWidth={3}
                drawProgress={ellipseBotProgress}
                xMin={-2}
                xMax={2}
              />

              {/* 切线 y = -x/2 + √2 */}
              {f >= 320 && (
                <FunctionPlot
                  fn={tangentLine}
                  color={COLORS.vector}
                  strokeWidth={2.5}
                  drawProgress={tangentProgress}
                  xMin={-0.8}
                  xMax={2.8}
                  opacity={0.9}
                />
              )}

              {/* 切点 (√2, √2/2) */}
              {f >= 290 && (
                <PointIn2D
                  mx={PX0}
                  my={PY0}
                  label={`(√2, √2/2)`}
                  color={COLORS.highlight}
                  opacity={pointOpacity3}
                />
              )}

              {/* 标注椭圆方程 */}
              {f >= 260 && (
                <text
                  x={30}
                  y={50}
                  fill={COLORS.primaryCurve}
                  fontSize={18}
                  opacity={ellipseTopProgress}
                  fontFamily="serif"
                >
                  x²/4 + y² = 1
                </text>
              )}
            </CoordinateSystem>
          </div>

          {/* 右侧解题步骤 */}
          <div
            style={{
              position: "absolute",
              left: 920,
              top: 160,
              width: 940,
              opacity: stepsOpacity3D,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                fontSize: 28,
                fontFamily: "serif",
                fontWeight: "bold",
                marginBottom: 24,
              }}
            >
              解题过程
            </div>
            <SolutionSteps steps={steps3} currentStep={currentStep3} width={920} />
          </div>
        </>
      )}

      {/* 阶段4：总结 */}
      {f >= 390 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            opacity: summaryOpacity,
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 40,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            例题3 结论
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>切线斜率：</span>
              <MathFormula
                latex="\dfrac{dy}{dx}\bigg|_{\left(\sqrt{2},\,\frac{\sqrt{2}}{2}\right)} = -\dfrac{1}{2}"
                fontSize={32}
                color={COLORS.vector}
                displayMode={false}
              />
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.annotation }}>切线方程：</span>
              <MathFormula
                latex="x + 2y = 2\sqrt{2}"
                fontSize={36}
                color={COLORS.highlight}
                displayMode={false}
              />
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================
// 主组件：Sec09Examples
// 总帧数：3 × 480 = 1440
// ============================================================
export const Sec09Examples: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 480) {
    return <Example1 frame={frame} />;
  } else if (frame < 960) {
    return <Example2 frame={frame - 480} />;
  } else {
    return <Example3 frame={frame - 960} />;
  }
};
