import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { Arrow } from "../../components/math/Arrow";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 虚线辅助线（在 CoordinateSystem 内使用）
const DashedLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; opacity?: number;
}> = ({ x1, y1, x2, y2, color = COLORS.annotation, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const p1 = toPixel(x1, y1);
  const p2 = toPixel(x2, y2);
  return (
    <line
      x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py}
      stroke={color} strokeWidth={1.5} strokeDasharray="6,4" opacity={opacity}
    />
  );
};

// 标注点
const Dot: React.FC<{ x: number; y: number; color?: string; opacity?: number }> = ({
  x, y, color = COLORS.highlight, opacity = 1,
}) => {
  const { toPixel } = useCoordContext();
  const p = toPixel(x, y);
  return <circle cx={p.px} cy={p.py} r={5} fill={color} opacity={opacity} />;
};

// 平行四边形填充
const Parallelogram: React.FC<{
  ax: number; ay: number; bx: number; by: number; opacity?: number;
}> = ({ ax, ay, bx, by, opacity = 0.25 }) => {
  const { toPixel } = useCoordContext();
  const o = toPixel(0, 0);
  const pa = toPixel(ax, ay);
  const pb = toPixel(bx, by);
  const pab = toPixel(ax + bx, ay + by);
  const d = `M ${o.px},${o.py} L ${pa.px},${pa.py} L ${pab.px},${pab.py} L ${pb.px},${pb.py} Z`;
  return <path d={d} fill={COLORS.vector} opacity={opacity} />;
};

const Sec01Vectors: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180 向量加法（平行四边形）
  const coordOpacity2 = fade(frame, 60, 25);
  const vecAOpacity = fade(frame, 80, 25);
  const vecBOpacity = fade(frame, 105, 25);
  const dashOpacity = fade(frame, 130, 25);
  const vecSumOpacity = fade(frame, 150, 25);
  const label2Opacity = fade(frame, 155, 20);

  // Scene 3: 180-300 数乘向量
  const coordOpacity3 = fade(frame, 180, 25);
  const origVecOpacity = fade(frame, 200, 25);
  const scaledVecOpacity = fade(frame, 230, 25);
  const scaleLabel = fade(frame, 260, 25);

  // Scene 4: 300-390 向量分解
  const coordOpacity4 = fade(frame, 300, 25);
  const decompVecOpacity = fade(frame, 320, 25);
  const projXOpacity = fade(frame, 340, 20);
  const projYOpacity = fade(frame, 360, 20);
  const decompFormulaOpacity = fade(frame, 370, 20);

  // Scene 5: 390-450 定理框
  const theoremOpacity = fade(frame, 390, 30);

  const scene = frame < 60 ? 1 : frame < 180 ? 2 : frame < 300 ? 3 : frame < 390 ? 4 : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.1"
          sectionTitle="向量及其线性运算"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 向量加法（平行四边形法则） */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 28, opacity: coordOpacity2, marginBottom: 4 }}>
            平行四边形法则：<span style={{ color: COLORS.highlight }}>a⃗ + b⃗</span>
          </div>

          <CoordinateSystem
            width={800}
            height={500}
            xRange={[-0.5, 5.5]}
            yRange={[-0.5, 6]}
            opacity={coordOpacity2}
          >
            {/* 平行四边形填充 */}
            <Parallelogram ax={3} ay={2} bx={1} by={3} opacity={dashOpacity * 0.3} />

            {/* 辅助虚线 */}
            <DashedLine x1={3} y1={2} x2={4} y2={5} color={COLORS.primaryCurve} opacity={dashOpacity * 0.7} />
            <DashedLine x1={1} y1={3} x2={4} y2={5} color={COLORS.vector} opacity={dashOpacity * 0.7} />

            {/* 向量 a */}
            <Arrow fromX={0} fromY={0} toX={3} toY={2} color={COLORS.primaryCurve} label="a" opacity={vecAOpacity} />
            {/* 向量 b */}
            <Arrow fromX={0} fromY={0} toX={1} toY={3} color={COLORS.vector} label="b" opacity={vecBOpacity} />
            {/* 合向量 a+b */}
            <Arrow fromX={0} fromY={0} toX={4} toY={5} color={COLORS.highlight} label="a+b" opacity={vecSumOpacity} />

            {/* 终点标记 */}
            <Dot x={3} y={2} color={COLORS.primaryCurve} opacity={vecAOpacity} />
            <Dot x={1} y={3} color={COLORS.vector} opacity={vecBOpacity} />
            <Dot x={4} y={5} color={COLORS.highlight} opacity={vecSumOpacity} />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 48, opacity: label2Opacity, fontSize: 24 }}>
            <div style={{ color: COLORS.primaryCurve }}>a⃗ = (3, 2)</div>
            <div style={{ color: COLORS.vector }}>b⃗ = (1, 3)</div>
            <div style={{ color: COLORS.highlight }}>a⃗+b⃗ = (4, 5)</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 数乘向量 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 30, opacity: coordOpacity3 }}>
            数乘向量：方向不变，长度变为 <span style={{ color: COLORS.secondaryCurve }}>λ</span> 倍
          </div>

          <CoordinateSystem
            width={800}
            height={480}
            xRange={[-0.5, 7]}
            yRange={[-0.5, 5]}
            opacity={coordOpacity3}
          >
            {/* 原向量 a */}
            <Arrow fromX={0} fromY={0} toX={3} toY={2} color={COLORS.primaryCurve} label="a" opacity={origVecOpacity} />
            {/* 2a */}
            <Arrow fromX={0} fromY={0} toX={6} toY={4} color={COLORS.secondaryCurve} label="2a" opacity={scaledVecOpacity} />

            <Dot x={3} y={2} color={COLORS.primaryCurve} opacity={origVecOpacity} />
            <Dot x={6} y={4} color={COLORS.secondaryCurve} opacity={scaledVecOpacity} />
          </CoordinateSystem>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", opacity: scaleLabel }}>
            <MathFormula
              latex="\vec{a} = (3,\,2), \quad 2\vec{a} = (6,\,4)"
              fontSize={36}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 24, marginTop: 4 }}>
              |2a⃗| = 2|a⃗|，方向相同
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 向量分解到坐标轴 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 28, opacity: coordOpacity4 }}>
            向量按坐标轴分解：<span style={{ color: COLORS.primaryCurve }}>a⃗ = aₓ<b>i</b> + aᵧ<b>j</b></span>
          </div>

          <CoordinateSystem
            width={800}
            height={480}
            xRange={[-0.5, 5]}
            yRange={[-0.5, 4]}
            opacity={coordOpacity4}
          >
            {/* 向量 a */}
            <Arrow fromX={0} fromY={0} toX={3} toY={2} color={COLORS.primaryCurve} label="a" opacity={decompVecOpacity} />

            {/* x 分量投影虚线 */}
            <DashedLine x1={0} y1={0} x2={3} y2={0} color={COLORS.highlight} opacity={projXOpacity} />
            <DashedLine x1={3} y1={0} x2={3} y2={2} color={COLORS.highlight} opacity={projXOpacity} />
            <Arrow fromX={0} fromY={0} toX={3} toY={0} color={COLORS.highlight} label="aₓi" opacity={projXOpacity} />

            {/* y 分量投影虚线 */}
            <DashedLine x1={0} y1={0} x2={0} y2={2} color={COLORS.secondaryCurve} opacity={projYOpacity} />
            <DashedLine x1={0} y1={2} x2={3} y2={2} color={COLORS.secondaryCurve} opacity={projYOpacity} />
            <Arrow fromX={0} fromY={0} toX={0} toY={2} color={COLORS.secondaryCurve} label="aᵧj" opacity={projYOpacity} />

            <Dot x={3} y={2} color={COLORS.primaryCurve} opacity={decompVecOpacity} />
          </CoordinateSystem>

          <div style={{ opacity: decompFormulaOpacity }}>
            <MathFormula
              latex="\vec{a} = (3, 2) = 3\,\vec{i} + 2\,\vec{j}"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 定理框 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 100px",
          }}
        >
          <TheoremBox title="向量线性运算规律" opacity={theoremOpacity} width={960}>
            <div style={{ fontSize: 26, lineHeight: 2.4, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>加法交换律</span>：
                <span style={{ marginLeft: 8 }}>a⃗ + b⃗ = b⃗ + a⃗</span>
              </div>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>加法结合律</span>：
                <span style={{ marginLeft: 8 }}>(a⃗ + b⃗) + c⃗ = a⃗ + (b⃗ + c⃗)</span>
              </div>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>数乘分配律</span>：
                <span style={{ marginLeft: 8 }}>λ(a⃗ + b⃗) = λa⃗ + λb⃗</span>
              </div>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>模长公式</span>：
                <span style={{ marginLeft: 8 }}>|a⃗| = √(aₓ² + aᵧ² + aᵤ²)</span>
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Vectors;
