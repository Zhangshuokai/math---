import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 圆形（描边动画）+ 切线
const CircleWithTangent: React.FC<{
  circleProgress?: number;
  tangentOpacity?: number;
  pointOpacity?: number;
  slopeOpacity?: number;
}> = ({ circleProgress = 0, tangentOpacity = 0, pointOpacity = 0, slopeOpacity = 0 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(2, 0);
  const pxR = Math.abs(edge.px - center.px);
  const circumference = 2 * Math.PI * pxR;
  const dashOffset = circumference * (1 - circleProgress);

  // 切点 (1, √3)
  const px1 = 1;
  const py1 = Math.sqrt(3);
  const pt = toPixel(px1, py1);

  // 切线斜率 dy/dx = -x/y = -1/√3
  // 切线方程：y - √3 = (-1/√3)(x - 1)
  // 延伸: x 从 -0.5 到 2.8
  const slope = -px1 / py1; // ≈ -0.577
  const tangentLen = 2.0;
  const ptLeft = toPixel(px1 - tangentLen, py1 - slope * (-tangentLen));
  const ptRight = toPixel(px1 + tangentLen, py1 + slope * tangentLen);

  // 法线方向（与切线垂直，斜率 = √3）
  const normalSlope = py1 / px1; // = √3 ≈ 1.732
  const normalLen = 1.2;
  const ptNormalEnd = toPixel(px1 + normalLen, py1 + normalSlope * normalLen);

  return (
    <g>
      {/* 圆 x²+y²=4（描边动画） */}
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

      {/* 切点 (1, √3) */}
      {pointOpacity > 0.05 && (
        <g opacity={pointOpacity}>
          <circle cx={pt.px} cy={pt.py} r={7} fill={COLORS.highlight} />
          <text x={pt.px + 10} y={pt.py - 10} fill={COLORS.highlight} fontSize={16}>
            (1, √3)
          </text>
        </g>
      )}

      {/* 切线（黄色） */}
      {tangentOpacity > 0.05 && (
        <g opacity={tangentOpacity}>
          <line
            x1={ptLeft.px} y1={ptLeft.py}
            x2={ptRight.px} y2={ptRight.py}
            stroke={COLORS.vector}
            strokeWidth={2.5}
          />
          <text
            x={(ptLeft.px + ptRight.px) / 2 + 10}
            y={(ptLeft.py + ptRight.py) / 2 - 18}
            fill={COLORS.vector}
            fontSize={16}
          >
            切线
          </text>
        </g>
      )}

      {/* 斜率标注 */}
      {slopeOpacity > 0.05 && (
        <g opacity={slopeOpacity}>
          <text x={pt.px + 60} y={pt.py + 40} fill={COLORS.secondaryCurve} fontSize={18}>
            dy/dx = -1/√3
          </text>
        </g>
      )}
    </g>
  );
};

const Sec05Implicit: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-80 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 80-180 隐函数定理
  const s2Title = fade(frame, 80, 20);
  const s2Thm = fade(frame, 100, 25);
  const s2Formula = fade(frame, 140, 20);
  const s2Note = fade(frame, 162, 18);

  // Scene 3: 180-290 推导过程
  const s3Title = fade(frame, 180, 20);
  const s3Step1 = fade(frame, 200, 20);
  const s3Step2 = fade(frame, 228, 20);
  const s3Step3 = fade(frame, 258, 20);

  // Scene 4: 290-380 坐标系可视化（圆 + 切线）
  const s4Title = fade(frame, 290, 20);
  const s4CoordOp = fade(frame, 305, 20);
  const s4CircleProg = interpolate(frame, [315, 355], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4PointOp = fade(frame, 355, 15);
  const s4TangentOp = fade(frame, 362, 15);
  const s4SlopeOp = fade(frame, 370, 10);

  // Scene 5: 380-480 二元隐函数推广
  const s5Title = fade(frame, 380, 20);
  const s5Intro = fade(frame, 400, 20);
  const s5Formula1 = fade(frame, 425, 20);
  const s5Formula2 = fade(frame, 448, 20);
  const s5Note = fade(frame, 462, 18);

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
          sectionNum="9.5"
          sectionTitle="隐函数的求导公式"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 隐函数定理 */}
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
            隐函数定理：F(x,y)=0 确定 y=f(x) 的条件
          </div>

          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="隐函数存在定理" opacity={1} width={960}>
              <div style={{ fontSize: 23, lineHeight: 2.1, color: COLORS.formula }}>
                <div>
                  若 <span style={{ color: COLORS.primaryCurve }}>F(x₀,y₀)=0</span>，
                  F 在邻域内有连续偏导数，
                  且 <span style={{ color: COLORS.highlight }}>F_y(x₀,y₀) ≠ 0</span>
                </div>
                <div>
                  则在 x₀ 附近唯一确定连续函数{" "}
                  <span style={{ color: COLORS.secondaryCurve }}>y = f(x)</span>，
                  使 F(x, f(x)) ≡ 0
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{
            opacity: s2Formula,
            padding: "14px 30px",
            border: `2px solid ${COLORS.vector}`,
            borderRadius: 10,
            backgroundColor: "rgba(255,215,0,0.08)",
          }}>
            <MathFormula
              latex="\frac{dy}{dx} = -\frac{F_x}{F_y} \quad (F_y \neq 0)"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 21 }}>
            关键：分子取对<span style={{ color: COLORS.primaryCurve }}> x </span>偏导（分子），
            分母取对<span style={{ color: COLORS.highlight }}> y </span>偏导（分母），加负号
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 推导过程 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 26,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>
            推导：对 F(x, y(x)) = 0 两边关于 x 求导
          </div>

          <div style={{ width: "100%", opacity: s3Step1 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 8 }}>
              【第1步】用链式法则对 x 求导：
            </div>
            <MathFormula
              latex="\frac{d}{dx}F(x,\,y(x)) = F_x \cdot 1 + F_y \cdot \frac{dy}{dx} = 0"
              fontSize={42}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s3Step2 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 8 }}>
              【第2步】整理，解出 dy/dx：
            </div>
            <MathFormula
              latex="F_y \cdot \frac{dy}{dx} = -F_x \;\Rightarrow\; \frac{dy}{dx} = -\frac{F_x}{F_y}"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{
            width: "100%",
            opacity: s3Step3,
            padding: "12px 24px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 8,
          }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 8 }}>
              【第3步】验证：以 x²+y²=4 为例，F = x²+y²−4
            </div>
            <MathFormula
              latex="F_x = 2x,\; F_y = 2y \;\Rightarrow\; \frac{dy}{dx} = -\frac{2x}{2y} = -\frac{x}{y}"
              fontSize={38}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 坐标系可视化（圆 + 切线） */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            几何直观：圆 x²+y²=4 上切点 (1,√3) 的切线斜率
          </div>

          <CoordinateSystem
            width={760}
            height={440}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            opacity={s4CoordOp}
          >
            <CircleWithTangent
              circleProgress={s4CircleProg}
              pointOpacity={s4PointOp}
              tangentOpacity={s4TangentOp}
              slopeOpacity={s4SlopeOp}
            />
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 40, opacity: s4TangentOp, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>— 圆 x²+y²=4</div>
            <div style={{ color: COLORS.highlight }}>● 切点 (1, √3)</div>
            <div style={{ color: COLORS.vector }}>— 切线（斜率 -1/√3）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 二元隐函数推广 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 28, opacity: s5Title }}>
            推广：F(x,y,z)=0 确定 z=f(x,y) 的偏导公式
          </div>

          <div style={{ opacity: s5Intro, color: COLORS.annotation, fontSize: 22 }}>
            对 F(x, y, z(x,y)) = 0 分别关于 x 和 y 求偏导数：
          </div>

          <div style={{ opacity: s5Formula1 }}>
            <MathFormula
              latex="F_x + F_z \cdot \frac{\partial z}{\partial x} = 0 \;\Rightarrow\; \frac{\partial z}{\partial x} = -\frac{F_x}{F_z}"
              fontSize={42}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ opacity: s5Formula2 }}>
            <MathFormula
              latex="F_y + F_z \cdot \frac{\partial z}{\partial y} = 0 \;\Rightarrow\; \frac{\partial z}{\partial y} = -\frac{F_y}{F_z}"
              fontSize={42}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{
            opacity: s5Note,
            padding: "14px 28px",
            border: `2px solid ${COLORS.tertiaryCurve}`,
            borderRadius: 10,
            backgroundColor: "rgba(80,250,123,0.08)",
          }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 8, textAlign: "center" }}>
              条件：F_z ≠ 0（与一元情形类比：F_y ≠ 0）
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}, \quad \frac{\partial z}{\partial y} = -\frac{F_y}{F_z} \quad (F_z \neq 0)"
              fontSize={40}
              color={COLORS.tertiaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec05Implicit;
