import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 椭圆组件（在坐标系内通过 SVG ellipse 绘制）
const EllipseInCoord: React.FC<{
  cx: number; cy: number;
  rx: number; ry: number;
  color: string;
  strokeWidth?: number;
  opacity?: number;
  dashProgress?: number; // 0~1 控制描边动画
}> = ({ cx, cy, rx, ry, color, strokeWidth = 2.5, opacity = 1, dashProgress = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(cx, cy);
  const edgeX = toPixel(cx + rx, cy);
  const edgeY = toPixel(cx, cy + ry);
  const pxRx = Math.abs(edgeX.px - center.px);
  const pxRy = Math.abs(edgeY.py - center.py);
  const circumference = Math.PI * (3 * (pxRx + pxRy) - Math.sqrt((3 * pxRx + pxRy) * (pxRx + 3 * pxRy)));
  const dashOffset = circumference * (1 - dashProgress);
  return (
    <ellipse
      cx={center.px}
      cy={center.py}
      rx={pxRx}
      ry={pxRy}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      strokeDasharray={`${circumference}`}
      strokeDashoffset={dashOffset}
    />
  );
};

// 圆形组件（用于球面截面示意）
const CircleInCoord: React.FC<{
  cx: number; cy: number; r: number;
  color: string; strokeWidth?: number; opacity?: number; dashProgress?: number;
}> = ({ cx, cy, r, color, strokeWidth = 2.5, opacity = 1, dashProgress = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(cx, cy);
  const edge = toPixel(cx + r, cy);
  const pxR = Math.abs(edge.px - center.px);
  const circumference = 2 * Math.PI * pxR;
  const dashOffset = circumference * (1 - dashProgress);
  return (
    <circle
      cx={center.px}
      cy={center.py}
      r={pxR}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      strokeDasharray={`${circumference}`}
      strokeDashoffset={dashOffset}
    />
  );
};

// 旋转曲面示意：y=f(x) 绕 x 轴旋转
const RotationSurface: React.FC<{ opacity?: number; drawProgress?: number }> = ({
  opacity = 1, drawProgress = 1,
}) => {
  const { toPixel } = useCoordContext();
  // 绘制母线 y = sqrt(x+2) (x从-1到3)
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = -1 + (i / 60) * 4;
    const y = Math.sqrt(Math.max(0, x + 2));
    points.push({ x, y });
  }
  const cutoff = Math.floor(points.length * drawProgress);
  const visible = points.slice(0, Math.max(1, cutoff));
  const pathData = visible
    .map((p, i) => {
      const { px, py } = toPixel(p.x, p.y);
      return `${i === 0 ? "M" : "L"} ${px},${py}`;
    })
    .join(" ");

  // 对称轴下方（y = -sqrt(x+2)）
  const pathDataMirror = visible
    .map((p, i) => {
      const { px, py } = toPixel(p.x, -p.y);
      return `${i === 0 ? "M" : "L"} ${px},${py}`;
    })
    .join(" ");

  // x轴标记
  const xAxisPt = toPixel(3, 0);
  const xAxisStart = toPixel(-1, 0);

  return (
    <g opacity={opacity}>
      {/* 母线（上方） */}
      <path d={pathData} fill="none" stroke={COLORS.primaryCurve} strokeWidth={3} />
      {/* 旋转后的下方曲线（虚线） */}
      <path d={pathDataMirror} fill="none" stroke={COLORS.primaryCurve} strokeWidth={2} strokeDasharray="6,4" />
      {/* 绕轴示意：圆形截面 */}
      {drawProgress > 0.7 && (() => {
        const p = toPixel(1, 0);
        const edge = toPixel(1, Math.sqrt(3));
        const r = Math.abs(edge.py - p.py);
        return (
          <ellipse
            cx={p.px} cy={p.py}
            rx={r * 0.35} ry={r}
            fill="none"
            stroke={COLORS.highlight}
            strokeWidth={2}
            opacity={(drawProgress - 0.7) / 0.3}
            strokeDasharray="5,3"
          />
        );
      })()}
      {/* 旋转方向箭头 */}
      {drawProgress > 0.85 && (
        <text
          x={toPixel(2.2, 1.4).px}
          y={toPixel(2.2, 1.4).py}
          fill={COLORS.highlight}
          fontSize={22}
          opacity={(drawProgress - 0.85) / 0.15}
        >
          ↻ 绕 x 轴旋转
        </text>
      )}
    </g>
  );
};

const Sec03Surfaces: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-80 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 80-180 球面方程
  const s2Title = fade(frame, 80, 20);
  const s2Thm = fade(frame, 100, 25);
  const s2CircleOp = fade(frame, 130, 20);
  const s2CircleDraw = interpolate(frame, [140, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2Note = fade(frame, 155, 20);

  // Scene 3: 180-290 柱面方程
  const s3Title = fade(frame, 180, 20);
  const s3Eq = fade(frame, 200, 20);
  const s3Ellipse1 = interpolate(frame, [220, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Ellipse1Op = fade(frame, 220, 20);
  const s3Ellipse2 = interpolate(frame, [245, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Ellipse2Op = fade(frame, 245, 20);
  const s3Ellipse3 = interpolate(frame, [265, 285], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Ellipse3Op = fade(frame, 265, 20);

  // Scene 4: 290-380 二次曲面2D截面可视化
  const s4Title = fade(frame, 290, 20);
  const s4CoordOp = fade(frame, 305, 20);
  const s4Curve1 = interpolate(frame, [315, 340], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve1Op = fade(frame, 315, 15);
  const s4Curve2 = interpolate(frame, [338, 358], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve2Op = fade(frame, 338, 15);
  const s4Curve3 = interpolate(frame, [355, 372], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve3Op = fade(frame, 355, 15);
  const s4Curve4 = interpolate(frame, [368, 378], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve4Op = fade(frame, 368, 12);
  const s4LegendOp = fade(frame, 372, 8);

  // Scene 5: 380-480 旋转曲面
  const s5Title = fade(frame, 380, 20);
  const s5Eq = fade(frame, 400, 20);
  const s5CoordOp = fade(frame, 415, 20);
  const s5Draw = interpolate(frame, [430, 475], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.3"
          sectionTitle="曲面及其方程"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 球面方程 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            padding: "0 80px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>
            球面：到定点等距的点的集合
          </div>

          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="球面方程" opacity={1} width={960}>
              <div style={{ fontSize: 24, lineHeight: 2.2, color: COLORS.formula }}>
                <div>
                  圆心 <span style={{ color: COLORS.primaryCurve }}>(a, b, c)</span>，半径{" "}
                  <span style={{ color: COLORS.highlight }}>R</span> 的球面：
                </div>
                <MathFormula
                  latex="(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2"
                  fontSize={46}
                  color={COLORS.formula}
                />
                <div style={{ marginTop: 8 }}>
                  过原点的标准球面：
                  <span style={{ color: COLORS.secondaryCurve }}>  x² + y² + z² = R²</span>
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{ opacity: s2CircleOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20 }}>
              球面的 z=0 截面：以原点为圆心、R 为半径的圆
            </div>
            <CoordinateSystem
              width={400}
              height={300}
              xRange={[-3, 3]}
              yRange={[-3, 3]}
              showGrid={false}
              opacity={s2CircleOp}
            >
              <CircleInCoord cx={0} cy={0} r={2} color={COLORS.primaryCurve} dashProgress={s2CircleDraw} />
              {/* R 标注 */}
              {s2CircleDraw > 0.3 && (() => {
                return null; // 使用 text 在坐标系外标注即可
              })()}
            </CoordinateSystem>
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 20 }}>
            截面 z=k 为圆：x² + y² = R² − k²（当 |k| &lt; R 时有圆截面）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 柱面方程 + 椭圆截面动画 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ color: COLORS.highlight, fontSize: 28, opacity: s3Title }}>
            柱面：准线 F(x,y)=0，母线平行 z 轴
          </div>

          <div style={{ opacity: s3Eq }}>
            <MathFormula
              latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad \text{（椭圆柱面）}"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ color: COLORS.annotation, fontSize: 20, opacity: s3Eq }}>
            不论 z 取何值，截面都是同样的椭圆——这就是柱面的特征
          </div>

          {/* 三个椭圆截面依次绘制，模拟不同高度的截面 */}
          <CoordinateSystem
            width={700}
            height={360}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            showGrid={false}
            opacity={s3Eq}
          >
            {/* z = 0 截面（蓝色） */}
            <EllipseInCoord
              cx={0} cy={0} rx={2} ry={1.2}
              color={COLORS.primaryCurve}
              opacity={s3Ellipse1Op}
              dashProgress={s3Ellipse1}
            />
            {/* z = 1 截面（绿色，偏移示意） */}
            <EllipseInCoord
              cx={0.3} cy={0.5} rx={2} ry={1.2}
              color={COLORS.tertiaryCurve}
              opacity={s3Ellipse2Op}
              dashProgress={s3Ellipse2}
            />
            {/* z = 2 截面（品红色，再偏移） */}
            <EllipseInCoord
              cx={0.6} cy={1.0} rx={2} ry={1.2}
              color={COLORS.secondaryCurve}
              opacity={s3Ellipse3Op}
              dashProgress={s3Ellipse3}
            />
            {/* 连接三个椭圆的虚线（左侧、右侧母线） */}
            {s3Ellipse3Op > 0.5 && (
              <g opacity={s3Ellipse3Op}>
                <line
                  x1={300 - 200} y1={180 - 60}
                  x2={300 + 60 - 200} y2={180 - 160 - 60}
                  stroke={COLORS.annotation} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5}
                />
                <line
                  x1={300 + 200} y1={180 - 60}
                  x2={300 + 60 + 200} y2={180 - 160 - 60}
                  stroke={COLORS.annotation} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5}
                />
              </g>
            )}
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 32, opacity: s3Ellipse3Op, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>— z=0 截面</div>
            <div style={{ color: COLORS.tertiaryCurve }}>— z=1 截面</div>
            <div style={{ color: COLORS.secondaryCurve }}>— z=2 截面</div>
            <div style={{ color: COLORS.annotation }}>（各截面形状相同）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 二次曲面2D截面可视化 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            常见二次曲面的截面投影（XY平面 / X轴截线）
          </div>

          <CoordinateSystem
            width={860}
            height={440}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            opacity={s4CoordOp}
          >
            {/* 椭球面 XY 截面（椭圆，蓝色） */}
            <EllipseInCoord
              cx={0} cy={0} rx={2.2} ry={1.4}
              color={COLORS.primaryCurve}
              opacity={s4Curve1Op}
              dashProgress={s4Curve1}
            />

            {/* 单叶双曲面 XY 截面（椭圆，更大，绿色） */}
            <EllipseInCoord
              cx={0} cy={0} rx={2.6} ry={1.8}
              color={COLORS.tertiaryCurve}
              strokeWidth={2}
              opacity={s4Curve2Op}
              dashProgress={s4Curve2}
            />

            {/* 马鞍面 z=x² （向上抛物线，黄色） */}
            <FunctionPlot
              fn={(x) => x * x * 0.7}
              color={COLORS.vector}
              strokeWidth={2.5}
              drawProgress={s4Curve3}
              opacity={s4Curve3Op}
            />

            {/* z=-y²（向下抛物线，红色） */}
            <FunctionPlot
              fn={(x) => -(x * x) * 0.7}
              color={COLORS.highlight}
              strokeWidth={2.5}
              drawProgress={s4Curve4}
              opacity={s4Curve4Op}
            />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 32, opacity: s4LegendOp, fontSize: 19, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ color: COLORS.primaryCurve }}>— 椭球面 XY截面（椭圆）</div>
            <div style={{ color: COLORS.tertiaryCurve }}>— 单叶双曲面 XY截面</div>
            <div style={{ color: COLORS.vector }}>— 马鞍面 z=x²（向上）</div>
            <div style={{ color: COLORS.highlight }}>— z=−x²（向下）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 旋转曲面生成原理 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            padding: "0 80px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 28, opacity: s5Title }}>
            旋转曲面：曲线 y = f(x) 绕 x 轴旋转
          </div>

          <div style={{ opacity: s5Eq }}>
            <MathFormula
              latex="y^2 + z^2 = [f(x)]^2"
              fontSize={56}
              color={COLORS.formula}
            />
          </div>

          <div style={{ color: COLORS.annotation, fontSize: 21, opacity: s5Eq, textAlign: "center" }}>
            规律：绕哪根轴，该轴变量不变；
            其余两变量替换为 <span style={{ color: COLORS.highlight }}>√(u²+v²)</span>
          </div>

          <CoordinateSystem
            width={700}
            height={360}
            xRange={[-1.5, 3.5]}
            yRange={[-2.5, 2.5]}
            opacity={s5CoordOp}
          >
            <RotationSurface opacity={s5CoordOp} drawProgress={s5Draw} />
          </CoordinateSystem>

          <div style={{ opacity: s5Note, color: COLORS.annotation, fontSize: 20 }}>
            示例：y = √(x+2) 绕 x 轴旋转 → 旋转抛物面  y² + z² = x + 2
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Surfaces;
