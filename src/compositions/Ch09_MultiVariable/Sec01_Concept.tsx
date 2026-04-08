import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { Arrow } from "../../components/math/Arrow";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 定义域圆形区域（填充+边界）
const DomainCircle: React.FC<{
  borderProgress?: number;
  fillOpacity?: number;
}> = ({ borderProgress = 0, fillOpacity = 0 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(2, 0);
  const pxR = Math.abs(edge.px - center.px);
  const circumference = 2 * Math.PI * pxR;
  const dashOffset = circumference * (1 - borderProgress);

  return (
    <g>
      {/* 填充区域 */}
      <circle
        cx={center.px}
        cy={center.py}
        r={pxR}
        fill={COLORS.primaryCurve}
        opacity={fillOpacity * 0.2}
      />
      {/* 边界圆 */}
      <circle
        cx={center.px}
        cy={center.py}
        r={pxR}
        fill="none"
        stroke={COLORS.primaryCurve}
        strokeWidth={3}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={dashOffset}
      />
      {/* 关键标注点 */}
      {borderProgress > 0.5 && (
        <g opacity={(borderProgress - 0.5) * 2}>
          {/* 原点 */}
          <circle cx={center.px} cy={center.py} r={5} fill={COLORS.highlight} />
          <text x={center.px + 8} y={center.py - 8} fill={COLORS.highlight} fontSize={16}>O(0,0)</text>
          {/* 圆上一点 (√2, √2) */}
          {(() => {
            const p = toPixel(Math.sqrt(2), Math.sqrt(2));
            return (
              <>
                <circle cx={p.px} cy={p.py} r={5} fill={COLORS.vector} />
                <text x={p.px + 8} y={p.py - 8} fill={COLORS.vector} fontSize={15}>
                  (√2, √2)
                </text>
              </>
            );
          })()}
          {/* 半径标注 */}
          {(() => {
            const mid = toPixel(1, 0);
            return (
              <>
                <line
                  x1={center.px} y1={center.py}
                  x2={edge.px} y2={edge.py}
                  stroke={COLORS.annotation} strokeWidth={1.5} strokeDasharray="4,3"
                />
                <text x={mid.px} y={mid.py - 12} fill={COLORS.annotation} fontSize={15} textAnchor="middle">R=2</text>
              </>
            );
          })()}
        </g>
      )}
    </g>
  );
};

// 等值线（同心圆 x²+y²=C）
const ContourLines: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const radii = [0.6, 1.0, 1.5, 2.0, 2.5];
  const colors = [COLORS.primaryCurve, COLORS.tertiaryCurve, COLORS.vector, COLORS.secondaryCurve, COLORS.highlight];
  return (
    <g opacity={opacity}>
      {radii.map((r, i) => {
        const edge = toPixel(r, 0);
        const pxR = Math.abs(edge.px - center.px);
        return (
          <circle
            key={r}
            cx={center.px}
            cy={center.py}
            r={pxR}
            fill="none"
            stroke={colors[i]}
            strokeWidth={2}
            opacity={0.75}
          />
        );
      })}
      {/* 标注 C 值 */}
      {radii.map((r, i) => {
        const p = toPixel(r + 0.1, 0.1);
        return (
          <text key={`lbl-${r}`} x={p.px + 4} y={p.py - 4} fill={colors[i]} fontSize={13} opacity={0.85}>
            C={+(r * r).toFixed(2)}
          </text>
        );
      })}
    </g>
  );
};

const Sec01Concept: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-80 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 80-180 多元函数定义
  const s2Title = fade(frame, 80, 20);
  const s2Def = fade(frame, 100, 20);
  const s2Thm = fade(frame, 125, 25);
  const s2Note = fade(frame, 155, 20);

  // Scene 3: 180-290 定义域可视化
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const s3BorderProg = interpolate(frame, [210, 255], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3FillOp = interpolate(frame, [255, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Label = fade(frame, 265, 20);

  // Scene 4: 290-380 极限方向
  const s4Title = fade(frame, 290, 20);
  const s4CoordOp = fade(frame, 305, 20);
  const s4Arrow1 = fade(frame, 320, 20);
  const s4Arrow2 = fade(frame, 338, 20);
  const s4Arrow3 = fade(frame, 356, 20);
  const s4Arrow4 = fade(frame, 368, 12);
  const s4Note = fade(frame, 364, 16);

  // Scene 5: 380-480 连续性+等值线
  const s5Title = fade(frame, 380, 20);
  const s5Text = fade(frame, 400, 20);
  const s5CoordOp = fade(frame, 415, 20);
  const s5ContourOp = interpolate(frame, [430, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s5Note = fade(frame, 460, 20);

  const scene = frame < 80 ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法及其应用"
          sectionNum="9.1"
          sectionTitle="多元函数的概念"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 多元函数定义 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>
            多元函数：多个自变量决定一个因变量
          </div>

          <div style={{ opacity: s2Def }}>
            <MathFormula
              latex="z = f(x,\,y), \quad (x,y) \in D \subset \mathbb{R}^2"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="二元函数的定义域" opacity={1} width={960}>
              <div style={{ fontSize: 23, lineHeight: 2.1, color: COLORS.formula }}>
                <div>
                  使表达式有意义的点集{" "}
                  <span style={{ color: COLORS.primaryCurve }}>(x,y) ∈ ℝ²</span> 构成定义域 D
                </div>
                <div style={{ marginTop: 4 }}>
                  例：<span style={{ color: COLORS.secondaryCurve }}>z = √(4 − x² − y²)</span>
                  &nbsp;的定义域：<span style={{ color: COLORS.highlight }}>x² + y² ≤ 4</span>（闭圆盘）
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            类比一元函数：<span style={{ color: COLORS.primaryCurve }}>y = f(x)</span>，
            x ∈ I ⊂ ℝ &nbsp;&nbsp;→&nbsp;&nbsp;
            多元：<span style={{ color: COLORS.secondaryCurve }}>z = f(x,y)</span>，
            (x,y) ∈ D ⊂ ℝ²
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 定义域可视化 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s3Title }}>
            定义域可视化：圆形区域 x² + y² ≤ 4
          </div>

          <CoordinateSystem
            width={780}
            height={450}
            xRange={[-3.5, 3.5]}
            yRange={[-3.5, 3.5]}
            opacity={s3CoordOp}
          >
            <DomainCircle borderProgress={s3BorderProg} fillOpacity={s3FillOp} />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 40, opacity: s3Label, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>— 边界圆 x²+y²=4</div>
            <div style={{ color: COLORS.primaryCurve, opacity: 0.5 }}>■ 内部区域（定义域）</div>
            <div style={{ color: COLORS.highlight }}>● 圆心 O</div>
            <div style={{ color: COLORS.vector }}>● 边界上的点</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 极限方向 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>
            二元极限：从<b>任意方向</b>趋近，极限值相同
          </div>

          <CoordinateSystem
            width={760}
            height={420}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            opacity={s4CoordOp}
          >
            {/* 极限点 (0,0) */}
            {s4CoordOp > 0.3 && (() => {
              const { toPixel } = { toPixel: (x: number, y: number) => ({ px: 0, py: 0 }) };
              return null;
            })()}

            {/* 从上方向下的箭头 */}
            <Arrow fromX={0} fromY={2.5} toX={0} toY={0.2}
              color={COLORS.primaryCurve} opacity={s4Arrow1} label="y轴方向" />

            {/* 从右向左 */}
            <Arrow fromX={2.5} fromY={0} toX={0.2} toY={0}
              color={COLORS.secondaryCurve} opacity={s4Arrow2} label="x轴方向" />

            {/* 斜线方向 y=x */}
            <Arrow fromX={2} fromY={2} toX={0.2} toY={0.2}
              color={COLORS.vector} opacity={s4Arrow3} label="y=x" />

            {/* 另一斜线 y=-x */}
            <Arrow fromX={2} fromY={-2} toX={0.2} toY={-0.2}
              color={COLORS.tertiaryCurve} opacity={s4Arrow4} label="y=-x" />

            {/* 原点标记 */}
            {s4Arrow1 > 0.5 && (() => {
              return (
                <g opacity={s4Arrow1}>
                  {/* 原点需要用 SVG 坐标 */}
                </g>
              );
            })()}
          </CoordinateSystem>

          <div style={{ opacity: s4Note, color: COLORS.annotation, fontSize: 21, textAlign: "center" }}>
            若沿不同路径趋近 (0,0) 时极限值不同，则极限<span style={{ color: COLORS.highlight }}> 不存在</span>
            <br />
            例：<span style={{ color: COLORS.secondaryCurve }}>lim f(x,kx) = k/(1+k²)</span>，随 k 变化而不同
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 连续性 + 等值线 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 26, opacity: s5Title }}>
            连续性：等值线光滑连续过渡（以 f = x²+y² 为例）
          </div>

          <div style={{ opacity: s5Text }}>
            <MathFormula
              latex="\lim_{(x,y)\to(x_0,y_0)} f(x,y) = f(x_0,y_0) \;\Rightarrow\; \text{连续}"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <CoordinateSystem
            width={760}
            height={380}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            showGrid={false}
            opacity={s5CoordOp}
          >
            <ContourLines opacity={s5ContourOp} />
          </CoordinateSystem>

          <div style={{ opacity: s5Note, color: COLORS.annotation, fontSize: 20, textAlign: "center" }}>
            等值线 f(x,y) = C 为同心圆，曲线光滑连续 &rarr; 函数连续
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Concept;
