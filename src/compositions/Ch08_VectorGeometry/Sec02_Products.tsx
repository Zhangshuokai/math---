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

// 平行四边形填充（在 CoordinateSystem 内）
const ParallelogramFill: React.FC<{
  ax: number; ay: number; bx: number; by: number;
  fillColor?: string; fillOpacity?: number;
}> = ({ ax, ay, bx, by, fillColor = COLORS.secondaryCurve, fillOpacity = 0.3 }) => {
  const { toPixel } = useCoordContext();
  const o = toPixel(0, 0);
  const pa = toPixel(ax, ay);
  const pb = toPixel(bx, by);
  const pab = toPixel(ax + bx, ay + by);
  const d = `M ${o.px},${o.py} L ${pa.px},${pa.py} L ${pab.px},${pab.py} L ${pb.px},${pb.py} Z`;
  return <path d={d} fill={fillColor} opacity={fillOpacity} stroke={fillColor} strokeWidth={1} />;
};

// 角度弧线
const AngleArc: React.FC<{
  cx: number; cy: number; r: number;
  startAngle: number; endAngle: number;
  color?: string; opacity?: number;
}> = ({ cx, cy, r, startAngle, endAngle, color = COLORS.highlight, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(cx, cy);
  // 注意：SVG y轴向下，数学坐标y轴向上，所以需要翻转角度
  // 在像素坐标中，角度从x轴正方向逆时针为正（但SVG是顺时针）
  // 数学角 → SVG角：svgAngle = -mathAngle
  const svgStart = -startAngle * (Math.PI / 180);
  const svgEnd = -endAngle * (Math.PI / 180);

  // 使用 toPixel 估算像素半径（取近似）
  const p1 = toPixel(cx + r * Math.cos(startAngle * Math.PI / 180),
    cy + r * Math.sin(startAngle * Math.PI / 180));
  const p2 = toPixel(cx + r * Math.cos(endAngle * Math.PI / 180),
    cy + r * Math.sin(endAngle * Math.PI / 180));
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = startAngle < endAngle ? 0 : 1; // SVG y轴朝下

  const d = `M ${p1.px},${p1.py} A ${Math.abs(p1.px - center.px) * 1.5},${Math.abs(p1.py - center.py) * 1.5} 0 ${largeArc} ${sweep} ${p2.px},${p2.py}`;
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={2} opacity={opacity} />
  );
};

// 投影虚线
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

const Sec02Products: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180 数量积（点积）
  const coord2Opacity = fade(frame, 60, 25);
  const vecA2Opacity = fade(frame, 80, 20);
  const vecB2Opacity = fade(frame, 100, 20);
  const angleOpacity = fade(frame, 120, 20);
  const projOpacity = fade(frame, 140, 20);
  const dotFormulaOpacity = fade(frame, 155, 20);

  // Scene 3: 180-300 向量积（叉积）
  const crossTitle = fade(frame, 180, 20);
  const crossDet = fade(frame, 205, 20);
  const rightHand = fade(frame, 240, 20);
  const crossArea = fade(frame, 270, 20);

  // Scene 4: 300-420 平行四边形面积可视化
  const coord4Opacity = fade(frame, 300, 25);
  const para4Opacity = fade(frame, 330, 25);
  const area4Label = fade(frame, 370, 25);
  const areaValue = fade(frame, 395, 20);

  // Scene 5: 420-480 混合积
  const mixedTitle = fade(frame, 420, 20);
  const mixedFormula = fade(frame, 445, 20);
  const mixedGeo = fade(frame, 465, 20);

  // Scene 6: 480-540 总结
  const summaryOpacity = fade(frame, 480, 30);

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 420 ? 4
    : frame < 480 ? 5
    : 6;

  // 向量 a=(3,1), b=(1,3) 的夹角
  const ax = 3, ay = 1, bx = 1, by = 3;
  const dotProd = ax * bx + ay * by; // = 6
  const lenA = Math.sqrt(ax * ax + ay * ay);
  const lenB = Math.sqrt(bx * bx + by * by);
  const cosTheta = dotProd / (lenA * lenB);
  const thetaDeg = Math.acos(cosTheta) * 180 / Math.PI; // ≈53.13°

  // 叉积模 = |ax*by - ay*bx| = |9-1| = 8
  const crossMag = Math.abs(ax * by - ay * bx);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.2"
          sectionTitle="数量积·向量积·混合积"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 数量积（点积） */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: coord2Opacity, marginBottom: 4 }}>
            数量积：a⃗·b⃗ = |a||b|cos θ
          </div>

          <CoordinateSystem
            width={800}
            height={420}
            xRange={[-0.5, 4.5]}
            yRange={[-0.5, 4.5]}
            opacity={coord2Opacity}
          >
            {/* 投影虚线 */}
            <DashedLine
              x1={bx} y1={by}
              x2={bx * (ax * bx + ay * by) / (lenA * lenA)}
              y2={by * (ax * bx + ay * by) / (lenA * lenA)}
              color={COLORS.highlight} opacity={projOpacity}
            />

            {/* 角度弧线 (简化：画一小段标注) */}
            <AngleArc cx={0} cy={0} r={0.6}
              startAngle={0} endAngle={thetaDeg}
              color={COLORS.highlight} opacity={angleOpacity}
            />

            {/* 向量 a */}
            <Arrow fromX={0} fromY={0} toX={ax} toY={ay} color={COLORS.primaryCurve} label="a" opacity={vecA2Opacity} />
            {/* 向量 b */}
            <Arrow fromX={0} fromY={0} toX={bx} toY={by} color={COLORS.vector} label="b" opacity={vecB2Opacity} />
          </CoordinateSystem>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", opacity: dotFormulaOpacity }}>
            <MathFormula
              latex="\vec{a}\cdot\vec{b} = |\vec{a}||\vec{b}|\cos\theta = 3\times1 + 1\times3 = 6"
              fontSize={34}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 22 }}>
              θ ≈ {thetaDeg.toFixed(1)}°，cos θ ≈ {cosTheta.toFixed(3)}
            </div>
            <div style={{ color: COLORS.highlight, fontSize: 22, opacity: projOpacity }}>
              几何意义：a⃗ 在 b⃗ 方向的投影 × |b⃗|
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 向量积（叉积） */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 32, opacity: crossTitle }}>
            向量积：a⃗ × b⃗
          </div>

          <div style={{ opacity: crossDet }}>
            <MathFormula
              latex={"\vec{a}\times\vec{b} = \begin{vmatrix}\vec{i} & \vec{j} & \vec{k}\\ a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\end{vmatrix}"}
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{
            opacity: rightHand,
            display: "flex",
            gap: 48,
            alignItems: "center",
          }}>
            <div style={{
              padding: "12px 24px",
              border: `2px solid ${COLORS.vector}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,215,0,0.1)",
            }}>
              <div style={{ color: COLORS.vector, fontSize: 22, textAlign: "center", marginBottom: 6 }}>
                右手法则
              </div>
              <div style={{ color: COLORS.annotation, fontSize: 20 }}>
                四指从 a⃗ 转向 b⃗，<br />大拇指方向 = a⃗×b⃗ 方向
              </div>
            </div>
            <div style={{ opacity: crossArea }}>
              <MathFormula
                latex="|\vec{a}\times\vec{b}| = |\vec{a}||\vec{b}|\sin\theta"
                fontSize={36}
                color={COLORS.formula}
              />
              <div style={{ color: COLORS.highlight, fontSize: 20, marginTop: 8, textAlign: "center" }}>
                = 以 a⃗、b⃗ 为邻边的平行四边形面积
              </div>
            </div>
          </div>

          <div style={{ opacity: crossArea, marginTop: 8 }}>
            <MathFormula
              latex="\vec{a}\times\vec{b} = -\vec{b}\times\vec{a} \quad(\text{反交换律})"
              fontSize={32}
              color={COLORS.annotation}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 平行四边形面积可视化 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 28, opacity: coord4Opacity }}>
            平行四边形面积 = |a⃗ × b⃗|
          </div>

          <CoordinateSystem
            width={800}
            height={460}
            xRange={[-0.5, 5.5]}
            yRange={[-0.5, 5.5]}
            opacity={coord4Opacity}
          >
            {/* 平行四边形填充 */}
            <ParallelogramFill
              ax={ax} ay={ay} bx={bx} by={by}
              fillColor={COLORS.secondaryCurve}
              fillOpacity={para4Opacity * 0.35}
            />

            {/* 向量 a 和 b */}
            <Arrow fromX={0} fromY={0} toX={ax} toY={ay} color={COLORS.primaryCurve} label="a=(3,1)" opacity={coord4Opacity} />
            <Arrow fromX={0} fromY={0} toX={bx} toY={by} color={COLORS.vector} label="b=(1,3)" opacity={coord4Opacity} />
            {/* 补充边 */}
            <Arrow fromX={ax} fromY={ay} toX={ax + bx} toY={ay + by} color={COLORS.vector} opacity={para4Opacity * 0.7} />
            <Arrow fromX={bx} fromY={by} toX={ax + bx} toY={ay + by} color={COLORS.primaryCurve} opacity={para4Opacity * 0.7} />
          </CoordinateSystem>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", opacity: area4Label }}>
            <MathFormula
              latex="S = |a_1 b_2 - a_2 b_1| = |3\times3 - 1\times1| = 8"
              fontSize={36}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.secondaryCurve, fontSize: 28, opacity: areaValue, fontWeight: "bold" }}>
              面积 = {crossMag} （平方单位）
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 混合积 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 32, opacity: mixedTitle }}>
            混合积与四面体体积
          </div>

          <div style={{ opacity: mixedFormula }}>
            <MathFormula
              latex={"[\,\vec{a}\;\vec{b}\;\vec{c}\,] = \vec{a}\cdot(\vec{b}\times\vec{c}) = \begin{vmatrix}a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\\ c_1 & c_2 & c_3\end{vmatrix}"}
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: mixedGeo, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: COLORS.annotation, fontSize: 26, textAlign: "center" }}>
              几何意义：以 a⃗、b⃗、c⃗ 为棱的<span style={{ color: COLORS.tertiaryCurve }}> 平行六面体体积</span>
            </div>
            <MathFormula
              latex="V_{\text{平行六面体}} = |\,[\,\vec{a}\;\vec{b}\;\vec{c}\,]\,|, \quad V_{\text{四面体}} = \frac{1}{6}|\,[\,\vec{a}\;\vec{b}\;\vec{c}\,]\,|"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          <TheoremBox title="三种积的对比总结" opacity={summaryOpacity} width={1000}>
            <div style={{ fontSize: 24, lineHeight: 2.3, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>数量积</span>：
                a⃗·b⃗ = |a||b|cos θ，结果为<span style={{ color: COLORS.highlight }}>标量</span>，
                满足交换律 a⃗·b⃗ = b⃗·a⃗
              </div>
              <div>
                • <span style={{ color: COLORS.secondaryCurve }}>向量积</span>：
                |a⃗×b⃗| = |a||b|sin θ，结果为<span style={{ color: COLORS.highlight }}>向量</span>，
                反交换律 a⃗×b⃗ = −b⃗×a⃗
              </div>
              <div>
                • <span style={{ color: COLORS.tertiaryCurve }}>混合积</span>：
                [a⃗ b⃗ c⃗] = a⃗·(b⃗×c⃗)，结果为<span style={{ color: COLORS.highlight }}>标量</span>，
                轮换不变
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Products;
