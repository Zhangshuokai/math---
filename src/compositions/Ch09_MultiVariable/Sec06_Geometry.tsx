import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { VectorField } from "../../components/math/VectorField";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 半圆侧视图 + 切线 + 法线（Scene 4 核心可视化）
const HalfCircleWithTangentNormal: React.FC<{
  curveProgress?: number;
  pointOpacity?: number;
  tangentOpacity?: number;
  normalOpacity?: number;
}> = ({ curveProgress = 0, pointOpacity = 0, tangentOpacity = 0, normalOpacity = 0 }) => {
  const { toPixel } = useCoordContext();

  // 切点 (1, √3)（在半圆 y=√(4-x²) 上）
  const px0 = 1;
  const py0 = Math.sqrt(3);

  const pt = toPixel(px0, py0);

  // 切线斜率（球面法向量是 (x,y)，切线斜率=-x/y=-1/√3）
  const tanSlope = -px0 / py0; // ≈ -0.577
  const tanLen = 1.8;
  const ptTanLeft = toPixel(px0 - tanLen, py0 + tanSlope * (-tanLen));
  const ptTanRight = toPixel(px0 + tanLen, py0 + tanSlope * tanLen);

  // 法线方向（切线斜率的负倒数 = √3）
  const normSlope = py0 / px0; // = √3
  const normLen = 1.2;
  const ptNormEnd = toPixel(px0 + normLen / Math.sqrt(1 + normSlope * normSlope),
    py0 + normSlope * normLen / Math.sqrt(1 + normSlope * normSlope));

  return (
    <g>
      {/* 半圆曲线 y=√(4-x²) - 由 FunctionPlot 处理，这里额外标注 */}

      {/* 切点 */}
      {pointOpacity > 0.05 && (
        <g opacity={pointOpacity}>
          <circle cx={pt.px} cy={pt.py} r={7} fill={COLORS.highlight} />
          <text x={pt.px + 10} y={pt.py + 4} fill={COLORS.highlight} fontSize={16}>
            (1, √3)
          </text>
        </g>
      )}

      {/* 切线（黄色） */}
      {tangentOpacity > 0.05 && (
        <g opacity={tangentOpacity}>
          <line
            x1={ptTanLeft.px} y1={ptTanLeft.py}
            x2={ptTanRight.px} y2={ptTanRight.py}
            stroke={COLORS.vector}
            strokeWidth={2.5}
          />
          <text
            x={ptTanRight.px - 40}
            y={ptTanRight.py - 14}
            fill={COLORS.vector}
            fontSize={15}
          >
            切线
          </text>
          <text
            x={ptTanRight.px - 40}
            y={ptTanRight.py + 4}
            fill={COLORS.vector}
            fontSize={14}
            opacity={0.8}
          >
            斜率=-1/√3
          </text>
        </g>
      )}

      {/* 法线（红色箭头） */}
      {normalOpacity > 0.05 && (
        <g opacity={normalOpacity}>
          <defs>
            <marker id="arrow-normal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.highlight} />
            </marker>
          </defs>
          <line
            x1={pt.px}
            y1={pt.py}
            x2={ptNormEnd.px}
            y2={ptNormEnd.py}
            stroke={COLORS.highlight}
            strokeWidth={2.5}
            markerEnd="url(#arrow-normal)"
          />
          <text
            x={ptNormEnd.px + 8}
            y={ptNormEnd.py}
            fill={COLORS.highlight}
            fontSize={15}
          >
            法线
          </text>
          <text
            x={ptNormEnd.px + 8}
            y={ptNormEnd.py + 16}
            fill={COLORS.highlight}
            fontSize={14}
            opacity={0.8}
          >
            n=(1, √3)/2
          </text>
        </g>
      )}

      {/* 直角标记（切线⊥法线） */}
      {normalOpacity > 0.7 && tangentOpacity > 0.7 && (
        <g opacity={Math.min(normalOpacity, tangentOpacity)}>
          {(() => {
            // 画一个小正方形标记直角
            const size = 12;
            const tx = (ptTanRight.px - pt.px) / Math.sqrt((ptTanRight.px - pt.px) ** 2 + (ptTanRight.py - pt.py) ** 2);
            const ty = (ptTanRight.py - pt.py) / Math.sqrt((ptTanRight.px - pt.px) ** 2 + (ptTanRight.py - pt.py) ** 2);
            const nx = (ptNormEnd.px - pt.px) / Math.sqrt((ptNormEnd.px - pt.px) ** 2 + (ptNormEnd.py - pt.py) ** 2);
            const ny = (ptNormEnd.py - pt.py) / Math.sqrt((ptNormEnd.px - pt.px) ** 2 + (ptNormEnd.py - pt.py) ** 2);
            const sq = [
              `${pt.px + tx * size},${pt.py + ty * size}`,
              `${pt.px + tx * size + nx * size},${pt.py + ty * size + ny * size}`,
              `${pt.px + nx * size},${pt.py + ny * size}`,
            ].join(" ");
            return (
              <polyline
                points={sq}
                fill="none"
                stroke={COLORS.annotation}
                strokeWidth={1.5}
                opacity={0.6}
              />
            );
          })()}
        </g>
      )}
    </g>
  );
};

const Sec06Geometry: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-80 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 80-180 切平面方程
  const s2Title = fade(frame, 80, 20);
  const s2Thm = fade(frame, 100, 25);
  const s2Eq = fade(frame, 138, 20);
  const s2Note = fade(frame, 162, 18);

  // Scene 3: 180-290 法线方向向量
  const s3Title = fade(frame, 180, 20);
  const s3Normal = fade(frame, 200, 20);
  const s3CoordOp = fade(frame, 220, 20);
  const s3FieldOp = fade(frame, 240, 30);
  const s3LabelOp = fade(frame, 268, 20);

  // Scene 4: 290-380 半球面侧视图可视化
  const s4Title = fade(frame, 290, 20);
  const s4CoordOp = fade(frame, 305, 20);
  const s4CurveProg = interpolate(frame, [318, 348], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4CurveOp = fade(frame, 318, 15);
  const s4PointOp = fade(frame, 350, 15);
  const s4TangentOp = fade(frame, 358, 15);
  const s4NormalOp = fade(frame, 366, 14);

  // Scene 5: 380-480 梯度与法向量关系
  const s5Title = fade(frame, 380, 20);
  const s5Text1 = fade(frame, 400, 20);
  const s5Formula = fade(frame, 428, 20);
  const s5CoordOp = fade(frame, 445, 20);
  const s5FieldOp = fade(frame, 458, 22);

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
          sectionNum="9.6"
          sectionTitle="多元函数微分学的几何应用"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 切平面方程 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>
            曲面 F(x,y,z)=0 在点 (x₀,y₀,z₀) 处的切平面
          </div>

          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="切平面方程" opacity={1} width={960}>
              <div style={{ fontSize: 23, lineHeight: 2.1, color: COLORS.formula }}>
                <div>
                  法向量为梯度：
                  <span style={{ color: COLORS.highlight }}> n = ∇F = (F_x, F_y, F_z)</span>
                </div>
                <div>
                  切平面过点 <span style={{ color: COLORS.primaryCurve }}>(x₀, y₀, z₀)</span>，
                  法向量为 n：
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{
            opacity: s2Eq,
            padding: "14px 30px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 10,
            backgroundColor: "rgba(255,107,107,0.08)",
          }}>
            <MathFormula
              latex="F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0"
              fontSize={46}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 21 }}>
            法线方程：
            <span style={{ color: COLORS.secondaryCurve }}>
              &nbsp;(x−x₀)/F_x = (y−y₀)/F_y = (z−z₀)/F_z
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 法线方向向量（2D向量场示意） */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>
            法向量 n = (F_x, F_y) = ∇F 垂直于等值线
          </div>

          <div style={{ opacity: s3Normal }}>
            <MathFormula
              latex="\vec{n} = (F_x,\,F_y,\,F_z)\bigg|_{(x_0,y_0,z_0)}"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          {/* 以 f=x²+y² 的梯度场展示法向量方向 */}
          <CoordinateSystem
            width={720}
            height={370}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            showGrid={false}
            opacity={s3CoordOp}
          >
            {/* 等值线（同心圆代表曲面水平截面） */}
            {s3CoordOp > 0.3 && (() => {
              const circleData = [0.8, 1.4, 2.0, 2.6];
              return (
                <g opacity={s3CoordOp * 0.6}>
                  {circleData.map((r, i) => {
                    // 使用 React 自定义方式在 SVG 内绘制圆，但需要 toPixel
                    // 这里直接硬编码像素（坐标系 xRange[-3,3], 720x370，原点在中心）
                    const cx = 720 / 2;
                    const cy = 370 / 2;
                    const pxPerUnit = (720 / 2) / 3; // ≈ 120px/unit
                    return (
                      <circle
                        key={r}
                        cx={cx} cy={cy}
                        r={r * pxPerUnit}
                        fill="none"
                        stroke={COLORS.primaryCurve}
                        strokeWidth={1.5}
                        opacity={0.5}
                      />
                    );
                  })}
                </g>
              );
            })()}

            {/* 梯度向量场 grad f = (2x, 2y)（箭头垂直于等值圆） */}
            <VectorField
              Px={(x, _y) => 2 * x}
              Py={(_x, y) => 2 * y}
              gridCount={7}
              scale={0.2}
              color={COLORS.vector}
              opacity={s3FieldOp * 0.9}
            />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 40, opacity: s3LabelOp, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>— 等值线（法平面截面）</div>
            <div style={{ color: COLORS.vector }}>→ 法向量 n = ∇F</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 半球面侧视图 + 切线 + 法线 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 24, opacity: s4Title }}>
            以球面 z=√(R²−x²−y²) 侧视图（半圆）为例：切线与法线
          </div>

          <CoordinateSystem
            width={780}
            height={420}
            xRange={[-3, 3]}
            yRange={[0, 3]}
            opacity={s4CoordOp}
          >
            {/* 半圆曲线 y=√(4-x²) */}
            <FunctionPlot
              fn={(x) => Math.sqrt(Math.max(0, 4 - x * x))}
              color={COLORS.primaryCurve}
              strokeWidth={3}
              drawProgress={s4CurveProg}
              opacity={s4CurveOp}
              xMin={-2}
              xMax={2}
            />

            {/* 切点、切线、法线 */}
            <HalfCircleWithTangentNormal
              curveProgress={s4CurveProg}
              pointOpacity={s4PointOp}
              tangentOpacity={s4TangentOp}
              normalOpacity={s4NormalOp}
            />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 32, opacity: s4TangentOp, fontSize: 19 }}>
            <div style={{ color: COLORS.primaryCurve }}>— 半球面侧视（y=√(4-x²)）</div>
            <div style={{ color: COLORS.highlight }}>● 切点 (1, √3)</div>
            <div style={{ color: COLORS.vector }}>— 切线（斜率-1/√3）</div>
            <div style={{ color: COLORS.highlight }}>→ 法线方向 n</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 梯度与法向量关系 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 28, opacity: s5Title }}>
            梯度即曲面法向量：∇F ⊥ 切平面
          </div>

          <div style={{ opacity: s5Text1, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            曲面 F(x,y,z)=0 上任一切向量 <span style={{ color: COLORS.primaryCurve }}>v</span> 满足：
            <br />
            F(P(t)) = 0 &rarr; 对 t 求导 &rarr;
            <span style={{ color: COLORS.highlight }}> ∇F · v = 0</span>
          </div>

          <div style={{
            opacity: s5Formula,
            padding: "14px 28px",
            border: `2px solid ${COLORS.tertiaryCurve}`,
            borderRadius: 10,
            backgroundColor: "rgba(80,250,123,0.08)",
          }}>
            <MathFormula
              latex="\nabla F = \left(\frac{\partial F}{\partial x},\;\frac{\partial F}{\partial y},\;\frac{\partial F}{\partial z}\right) \perp \text{切平面}"
              fontSize={36}
              color={COLORS.tertiaryCurve}
            />
          </div>

          {/* 梯度向量场展示 */}
          <CoordinateSystem
            width={660}
            height={320}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            showGrid={false}
            opacity={s5CoordOp}
          >
            {/* 等值线（同心圆） */}
            {s5CoordOp > 0.1 && (
              <g opacity={s5CoordOp * 0.55}>
                {[0.8, 1.5, 2.2].map((r) => (
                  <circle
                    key={r}
                    cx={330} cy={160}
                    r={r * (330 / 3)}
                    fill="none"
                    stroke={COLORS.secondaryCurve}
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            )}
            {/* 梯度向量场（箭头垂直于等值圆向外） */}
            <VectorField
              Px={(x, _y) => x}
              Py={(_x, y) => y}
              gridCount={6}
              scale={0.35}
              color={COLORS.tertiaryCurve}
              opacity={s5FieldOp}
            />
          </CoordinateSystem>

          <div style={{ opacity: s5FieldOp, color: COLORS.annotation, fontSize: 20, textAlign: "center" }}>
            梯度方向 = 函数值增长最快方向 = 曲面法向量方向
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec06Geometry;
