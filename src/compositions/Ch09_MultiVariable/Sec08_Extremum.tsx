import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 同心椭圆等值线（f = x² + y² 类函数的水平截面）
const ContourEllipses: React.FC<{
  cx?: number; cy?: number;
  scaleX?: number; scaleY?: number;
  color?: string;
  isMax?: boolean; // 极大值时等值线向外递减
  opacity?: number;
}> = ({ cx = 0, cy = 0, scaleX = 1, scaleY = 1, color = COLORS.primaryCurve, isMax = false, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(cx, cy);
  const radii = [0.4, 0.8, 1.2, 1.6];
  return (
    <g opacity={opacity}>
      {radii.map((r, i) => {
        const pEdgeX = toPixel(cx + r * scaleX, cy);
        const pEdgeY = toPixel(cx, cy + r * scaleY);
        const rxPx = Math.abs(pEdgeX.px - center.px);
        const ryPx = Math.abs(pEdgeY.py - center.py);
        // 极大值：越靠外越深（数值越小），极小值：越靠外越浅
        const strokeOp = isMax ? 0.9 - i * 0.15 : 0.3 + i * 0.17;
        return (
          <ellipse
            key={r}
            cx={center.px}
            cy={center.py}
            rx={rxPx}
            ry={ryPx}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            opacity={strokeOp}
          />
        );
      })}
      {/* 极值点标注 */}
      <circle cx={center.px} cy={center.py} r={5} fill={COLORS.highlight} />
    </g>
  );
};

// 鞍点等值线（双曲线形）
const SaddleContours: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  // 画几条双曲线形轮廓（f = x² - y² = c）
  const levels = [-1.5, -0.8, 0, 0.8, 1.5];
  return (
    <g opacity={opacity}>
      {levels.map((c) => {
        // 生成 x 值，对应 y² = x² - c
        const points: string[] = [];
        for (let xi = -2.5; xi <= 2.5; xi += 0.08) {
          const y2 = xi * xi - c;
          if (y2 >= 0) {
            const y = Math.sqrt(y2);
            const p1 = toPixel(xi, y);
            const p2 = toPixel(xi, -y);
            if (points.length === 0) {
              points.push(`M ${p1.px},${p1.py}`);
            } else {
              points.push(`L ${p1.px},${p1.py}`);
            }
          }
        }
        const pathStr = points.join(" ");
        return (
          <path
            key={c}
            d={pathStr}
            fill="none"
            stroke={c === 0 ? COLORS.highlight : COLORS.secondaryCurve}
            strokeWidth={c === 0 ? 2 : 1.2}
            opacity={c === 0 ? 1 : 0.5}
          />
        );
      })}
      {/* 鞍点标注 */}
      {(() => {
        const p = toPixel(0, 0);
        return <circle cx={p.px} cy={p.py} r={6} fill={COLORS.highlight} />;
      })()}
    </g>
  );
};

const Sec08Extremum: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-150 极值定义（等值线俯视图）
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 75, 25);
  const s2MaxOp = fade(frame, 95, 20);
  const s2MinOp = fade(frame, 115, 20);
  const s2SaddleOp = fade(frame, 130, 20);
  const s2LegendOp = fade(frame, 138, 12);

  // Scene 3: 150-270 必要条件（驻点）
  const s3Title = fade(frame, 150, 20);
  const s3Nec = fade(frame, 168, 20);
  const s3Eq = fade(frame, 195, 20);
  const s3Stat = fade(frame, 225, 20);
  const s3Note = fade(frame, 252, 18);

  // Scene 4: 270-390 充分条件（Hessian 判别法）
  const s4Title = fade(frame, 270, 20);
  const s4ABC = fade(frame, 288, 18);
  const s4Cond1 = fade(frame, 308, 18);
  const s4Cond2 = fade(frame, 326, 18);
  const s4Cond3 = fade(frame, 344, 18);
  const s4Cond4 = fade(frame, 362, 18);
  const s4HessianOp = fade(frame, 375, 15);

  // Scene 5: 390-480 例题
  const s5Title = fade(frame, 390, 20);
  const s5Func = fade(frame, 408, 18);
  const s5StatPoint = fade(frame, 428, 18);
  const s5Solve = fade(frame, 446, 18);
  const s5Hessian = fade(frame, 460, 18);
  const s5Result = fade(frame, 472, 15);

  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法"
          sectionNum="9.8"
          sectionTitle="多元函数的极值"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 极值定义（等值线俯视图） */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            极值的直观展示（等值线俯视图）
          </div>

          <CoordinateSystem
            width={900}
            height={440}
            xRange={[-5, 5]}
            yRange={[-3, 3]}
            showGrid={false}
            opacity={s2CoordOp}
          >
            {/* 极大值（左侧，同心圆，颜色由深到浅向外） */}
            <ContourEllipses
              cx={-3} cy={0}
              scaleX={1.2} scaleY={0.9}
              color={COLORS.primaryCurve}
              isMax={true}
              opacity={s2MaxOp}
            />
            {/* 极小值（中间，同心圆，颜色由浅到深向外）*/}
            <ContourEllipses
              cx={0.5} cy={0.5}
              scaleX={0.9} scaleY={1.1}
              color={COLORS.secondaryCurve}
              isMax={false}
              opacity={s2MinOp}
            />
            {/* 鞍点（右侧）*/}
            {s2SaddleOp > 0.05 && (
              <g opacity={s2SaddleOp} transform="translate(270, 0)">
                <SaddleContours opacity={1} />
              </g>
            )}
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 48, opacity: s2LegendOp, fontSize: 22 }}>
            <div style={{ color: COLORS.primaryCurve }}>● 极大值（"山峰"）</div>
            <div style={{ color: COLORS.secondaryCurve }}>● 极小值（"山谷"）</div>
            <div style={{ color: COLORS.highlight }}>● 鞍点（非极值）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 必要条件 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: s3Title }}>
            极值的必要条件：驻点
          </div>

          <div style={{ opacity: s3Nec, color: COLORS.annotation, fontSize: 24, textAlign: "center" }}>
            若 f(x,y) 在点 (x₀,y₀) 取极值，且偏导数存在，则：
          </div>

          <div style={{
            opacity: s3Eq,
            padding: "16px 32px",
            border: `2px solid ${COLORS.primaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(97,218,251,0.08)",
          }}>
            <MathFormula
              latex="f_x(x_0,\,y_0) = 0, \quad f_y(x_0,\,y_0) = 0"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s3Stat, display: "flex", gap: 20, alignItems: "center", fontSize: 24 }}>
            <div style={{ color: COLORS.vector }}>满足上述条件的点称为</div>
            <div style={{
              color: COLORS.highlight,
              fontWeight: "bold",
              padding: "4px 16px",
              border: `2px solid ${COLORS.highlight}`,
              borderRadius: 6,
            }}>
              驻点
            </div>
          </div>

          <div style={{ opacity: s3Note, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            注意：驻点不一定是极值点（可能是鞍点）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 充分条件（Hessian 判别法） */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 18,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 28, opacity: s4Title }}>
            极值充分条件（Hessian 矩阵判别法）
          </div>

          <div style={{ opacity: s4ABC }}>
            <MathFormula
              latex="A = f_{xx},\; B = f_{xy},\; C = f_{yy} \;\text{（在驻点处取值）}"
              fontSize={32}
              color={COLORS.annotation}
            />
          </div>

          <div style={{
            opacity: s4HessianOp,
            padding: "8px 24px",
            border: `1px solid ${COLORS.annotation}`,
            borderRadius: 8,
          }}>
            <MathFormula
              latex="\Delta = AC - B^2"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
            {[
              { cond: "Δ > 0，A > 0", result: "极小值", color: COLORS.primaryCurve, op: s4Cond1 },
              { cond: "Δ > 0，A < 0", result: "极大值", color: COLORS.secondaryCurve, op: s4Cond2 },
              { cond: "Δ < 0", result: "鞍点（非极值）", color: COLORS.highlight, op: s4Cond3 },
              { cond: "Δ = 0", result: "需要进一步讨论", color: COLORS.annotation, op: s4Cond4 },
            ].map(({ cond, result, color, op }) => (
              <div
                key={cond}
                style={{
                  opacity: op,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "8px 20px",
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ color: COLORS.annotation, fontSize: 22, width: 180 }}>{cond}</div>
                <div style={{ color: COLORS.annotation, fontSize: 20 }}>→</div>
                <div style={{ color, fontSize: 22, fontWeight: "bold" }}>{result}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 例题 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 18,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 28, opacity: s5Title }}>
            例题：求 f(x,y) = x²+y²−2x−4y+6 的极值
          </div>

          <div style={{ opacity: s5Func }}>
            <MathFormula
              latex="f(x,y) = x^2+y^2-2x-4y+6"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ width: "100%", opacity: s5StatPoint }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>令偏导数为零，求驻点：</div>
            <MathFormula
              latex="f_x = 2x-2=0,\quad f_y = 2y-4=0 \;\Rightarrow\; (x_0,y_0)=(1,2)"
              fontSize={30}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s5Solve }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>计算 Hessian 矩阵元素：</div>
            <MathFormula
              latex="A = f_{xx}=2,\quad B = f_{xy}=0,\quad C = f_{yy}=2"
              fontSize={30}
              color={COLORS.annotation}
            />
          </div>

          <div style={{ width: "100%", opacity: s5Hessian }}>
            <MathFormula
              latex="\Delta = AC - B^2 = 4 - 0 = 4 > 0,\quad A = 2 > 0"
              fontSize={30}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{
            opacity: s5Result,
            padding: "12px 28px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 8,
          }}>
            <MathFormula
              latex="f(1,2) = 1+4-2-8+6 = 1 \;\text{（极小值）}"
              fontSize={36}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec08Extremum;
