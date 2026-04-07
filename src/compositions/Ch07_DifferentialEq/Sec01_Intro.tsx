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

const Sec01Intro: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–60 标题淡入 ──────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 30);

  // ── Scene 2: 60–150 微分方程定义 ─────────────────────────────────────────
  const eqOpacity = fade(frame, 60, 30);
  const defOpacity = fade(frame, 95, 30);
  const highlightOpacity = fade(frame, 125, 25);

  // ── Scene 3: 150–270 验证通解 ────────────────────────────────────────────
  const v1Opacity = fade(frame, 150, 25);
  const v2Opacity = fade(frame, 180, 25);
  const v3Opacity = fade(frame, 210, 25);
  const v4Opacity = fade(frame, 240, 25);

  // ── Scene 4: 270–390 解族曲线 ────────────────────────────────────────────
  const coordOpacity = fade(frame, 270, 30);
  const curve1Progress = interpolate(frame, [305, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const curve2Progress = interpolate(frame, [330, 385], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const legendOpacity = fade(frame, 360, 25);

  // ── Scene 5: 390–450 总结 ────────────────────────────────────────────────
  const summaryOpacity = fade(frame, 390, 30);

  const scene = frame < 60 ? 1 : frame < 150 ? 2 : frame < 270 ? 3 : frame < 390 ? 4 : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.1"
          sectionTitle="微分方程基本概念"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 方程定义 ── */}
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
          {/* 主方程 */}
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
              latex="y'' - y = 0"
              fontSize={72}
              color={COLORS.formula}
            />
          </div>

          {/* 说明文字 */}
          <div
            style={{
              opacity: defOpacity,
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                color: COLORS.annotation,
                fontSize: 32,
                marginBottom: 12,
              }}
            >
              <span style={{ color: COLORS.highlight }}>微分方程</span>
              ：含有未知函数及其导数（或微分）的方程
            </div>
          </div>

          {/* 高亮标注 */}
          <div
            style={{
              opacity: highlightOpacity,
              display: "flex",
              gap: 60,
              fontSize: 26,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                padding: "8px 20px",
                border: `1px solid ${COLORS.primaryCurve}`,
                borderRadius: 8,
              }}
            >
              y — 未知函数
            </div>
            <div
              style={{
                color: COLORS.secondaryCurve,
                padding: "8px 20px",
                border: `1px solid ${COLORS.secondaryCurve}`,
                borderRadius: 8,
              }}
            >
              y'' — 二阶导数
            </div>
            <div
              style={{
                color: COLORS.highlight,
                padding: "8px 20px",
                border: `1px solid ${COLORS.highlight}`,
                borderRadius: 8,
              }}
            >
              阶数 = 2
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 验证通解 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 140px",
          }}
        >
          <div
            style={{
              color: COLORS.primaryCurve,
              fontSize: 30,
              marginBottom: 8,
              opacity: v1Opacity,
            }}
          >
            验证：y = C₁eˣ + C₂e⁻ˣ 是方程的通解
          </div>

          <div style={{ opacity: v1Opacity }}>
            <MathFormula
              latex="y = C_1 e^x + C_2 e^{-x}"
              fontSize={42}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: v2Opacity }}>
            <MathFormula
              latex="y' = C_1 e^x - C_2 e^{-x}"
              fontSize={42}
              color={COLORS.annotation}
            />
          </div>

          <div style={{ opacity: v3Opacity }}>
            <MathFormula
              latex="y'' = C_1 e^x + C_2 e^{-x}"
              fontSize={42}
              color={COLORS.annotation}
            />
          </div>

          <div
            style={{
              opacity: v4Opacity,
              borderTop: `2px solid ${COLORS.primaryCurve}`,
              paddingTop: 20,
              width: "100%",
            }}
          >
            <MathFormula
              latex="y'' - y = \bigl(C_1 e^x + C_2 e^{-x}\bigr) - \bigl(C_1 e^x + C_2 e^{-x}\bigr) = 0 \quad \checkmark"
              fontSize={36}
              color={COLORS.highlight}
            />
          </div>

          <div
            style={{
              opacity: v4Opacity,
              color: COLORS.annotation,
              fontSize: 26,
              marginTop: 8,
            }}
          >
            含两个任意常数 C₁、C₂，是二阶方程的
            <span style={{ color: COLORS.primaryCurve }}> 通解</span>
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
            gap: 20,
          }}
        >
          <div
            style={{
              color: COLORS.formula,
              fontSize: 28,
              opacity: coordOpacity,
              marginBottom: 8,
            }}
          >
            解族：不同 C₁、C₂ 对应不同曲线
          </div>

          <CoordinateSystem
            width={900}
            height={440}
            xRange={[-2.5, 2.5]}
            yRange={[-1, 9]}
            opacity={coordOpacity}
          >
            {/* y = eˣ (C₁=1, C₂=0) */}
            <FunctionPlot
              fn={(x) => Math.min(Math.exp(x), 10)}
              color={COLORS.primaryCurve}
              drawProgress={curve1Progress}
              strokeWidth={3}
            />
            {/* y = e⁻ˣ (C₁=0, C₂=1) */}
            <FunctionPlot
              fn={(x) => Math.min(Math.exp(-x), 10)}
              color={COLORS.secondaryCurve}
              drawProgress={curve2Progress}
              strokeWidth={3}
            />
            {/* y = cosh(x) = eˣ/2 + e⁻ˣ/2 (C₁=C₂=0.5) */}
            <FunctionPlot
              fn={(x) => Math.min((Math.exp(x) + Math.exp(-x)) / 2, 10)}
              color={COLORS.tertiaryCurve}
              drawProgress={curve2Progress}
              strokeWidth={2.5}
              opacity={0.8}
            />
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: legendOpacity,
              fontSize: 22,
            }}
          >
            <div style={{ color: COLORS.primaryCurve }}>
              — C₁=1, C₂=0: y=eˣ
            </div>
            <div style={{ color: COLORS.secondaryCurve }}>
              — C₁=0, C₂=1: y=e⁻ˣ
            </div>
            <div style={{ color: COLORS.tertiaryCurve }}>
              — C₁=C₂=½: y=cosh x
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 总结 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 120px",
          }}
        >
          <TheoremBox
            title="微分方程基本概念小结"
            opacity={summaryOpacity}
            width={960}
          >
            <div
              style={{ fontSize: 26, lineHeight: 2.2, color: COLORS.formula }}
            >
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>微分方程</span>
                ：含未知函数及其导数的方程
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>阶</span>
                ：方程中最高阶导数的阶次
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>通解</span>
                ：含 n 个独立任意常数的解（n = 方程阶数）
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>特解</span>
                ：由初始条件确定任意常数的解
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Intro;
