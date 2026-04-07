import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 解曲线颜色
const CURVE_COLORS = [
  "#ff6b6b", // C = -2
  "#ff79c6", // C = -1
  "#61dafb", // C = 0.5
  "#50fa7b", // C = 1
  "#ffd700", // C = 2
];

const Sec02Separable: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–60 标题 ────────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 30);

  // ── Scene 2: 60–150 展示方程 ─────────────────────────────────────────────
  const eqOpacity = fade(frame, 60, 30);
  const annOpacity = fade(frame, 95, 30);

  // ── Scene 3: 150–300 分离变量步骤 ────────────────────────────────────────
  const step1Opacity = fade(frame, 150, 25);
  const step2Opacity = fade(frame, 187, 25);
  const step3Opacity = fade(frame, 224, 25);
  const step4Opacity = fade(frame, 261, 25);

  // ── Scene 4: 300–450 解族曲线 ────────────────────────────────────────────
  const coordOpacity = fade(frame, 300, 30);
  // 5 条曲线错开绘制
  const curveProgress = [
    interpolate(frame, [330, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [345, 395], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [360, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [375, 425], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [390, 440], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ];
  const legendOpacity = fade(frame, 420, 25);

  // ── Scene 5: 450–540 总结 ─────────────────────────────────────────────────
  const summaryOpacity = fade(frame, 450, 30);
  const highlightOpacity = fade(frame, 490, 30);

  const scene =
    frame < 60 ? 1 : frame < 150 ? 2 : frame < 300 ? 3 : frame < 450 ? 4 : 5;

  // 解曲线函数工厂 y = C·e^(x²)，限制幅值避免溢出
  const makeODE2fn = (C: number) => (x: number) => {
    const val = C * Math.exp(x * x);
    return Math.max(-12, Math.min(12, val));
  };

  const cValues = [-2, -1, 0.5, 1, 2];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.2"
          sectionTitle="可分离变量的微分方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 展示方程 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 48,
            padding: "0 120px",
          }}
        >
          <div
            style={{
              opacity: eqOpacity,
              padding: "24px 60px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
            }}
          >
            <MathFormula
              latex="\frac{dy}{dx} = 2xy"
              fontSize={72}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: annOpacity, textAlign: "center" }}>
            <div
              style={{
                color: COLORS.annotation,
                fontSize: 30,
                marginBottom: 20,
              }}
            >
              这是一个{" "}
              <span style={{ color: COLORS.highlight }}>可分离变量</span>
              {" "}的微分方程
            </div>
            <div style={{ color: COLORS.annotation, fontSize: 26 }}>
              特征：方程可以写成{" "}
              <span style={{ color: COLORS.primaryCurve }}>f(y) dy = g(x) dx</span>{" "}
              的形式
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 分离变量步骤 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 140px",
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 28,
              marginBottom: 12,
              opacity: step1Opacity,
            }}
          >
            分离变量法求解 dy/dx = 2xy
          </div>

          {/* 步骤 1：分离 */}
          <div
            style={{
              opacity: step1Opacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: COLORS.primaryCurve,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.background,
                fontWeight: "bold",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <div
                style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}
              >
                分离变量
              </div>
              <MathFormula
                latex="\frac{dy}{y} = 2x\,dx"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 步骤 2：两边积分 */}
          <div
            style={{
              opacity: step2Opacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: COLORS.primaryCurve,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.background,
                fontWeight: "bold",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <div
                style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}
              >
                两边积分
              </div>
              <MathFormula
                latex="\int \frac{dy}{y} = \int 2x\,dx"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 步骤 3：积分结果 */}
          <div
            style={{
              opacity: step3Opacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: COLORS.primaryCurve,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.background,
                fontWeight: "bold",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <div
                style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}
              >
                计算积分
              </div>
              <MathFormula
                latex="\ln|y| = x^2 + C_1"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 步骤 4：通解 */}
          <div
            style={{
              opacity: step4Opacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: COLORS.highlight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.background,
                fontWeight: "bold",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              4
            </div>
            <div>
              <div
                style={{ color: COLORS.highlight, fontSize: 20, marginBottom: 4 }}
              >
                通解（令 C = ±e^C₁）
              </div>
              <MathFormula
                latex="y = C e^{x^2} \quad (C \neq 0)"
                fontSize={44}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 解族曲线 ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              color: COLORS.formula,
              fontSize: 28,
              opacity: coordOpacity,
              marginBottom: 4,
            }}
          >
            解族：y = Ce^(x²)，不同 C 值对应的曲线
          </div>

          <CoordinateSystem
            width={900}
            height={430}
            xRange={[-1.5, 1.5]}
            yRange={[-10, 10]}
            opacity={coordOpacity}
          >
            {cValues.map((C, i) => (
              <FunctionPlot
                key={C}
                fn={makeODE2fn(C)}
                color={CURVE_COLORS[i]}
                drawProgress={curveProgress[i]}
                strokeWidth={2.5}
              />
            ))}
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 24,
              opacity: legendOpacity,
              fontSize: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {cValues.map((C, i) => (
              <div key={C} style={{ color: CURVE_COLORS[i] }}>
                — C = {C}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 总结 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: highlightOpacity }}>
            <MathFormula
              latex="y = C e^{x^2}"
              fontSize={60}
              color={COLORS.highlight}
            />
          </div>

          <TheoremBox
            title="可分离变量法"
            opacity={summaryOpacity}
            width={960}
          >
            <div
              style={{ fontSize: 26, lineHeight: 2.0, color: COLORS.formula }}
            >
              <div>
                1. 将方程变形为{" "}
                <span style={{ color: COLORS.primaryCurve }}>
                  f(y)dy = g(x)dx
                </span>{" "}
                的形式
              </div>
              <div>2. 两边分别对各自的变量积分</div>
              <div>
                3. 解出 y，得到含任意常数{" "}
                <span style={{ color: COLORS.primaryCurve }}>C</span>{" "}
                的通解
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Separable;
