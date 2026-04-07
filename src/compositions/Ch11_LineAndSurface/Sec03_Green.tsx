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

// 椭圆封闭曲线（逆时针）+ 内部填充
const GreenEllipse: React.FC<{ fillOpacity?: number; pathProgress?: number; arrowOpacity?: number }> = ({
  fillOpacity = 0,
  pathProgress = 1,
  arrowOpacity = 0,
}) => {
  const { toPixel } = useCoordContext();
  const N = 80;
  const totalPts = Math.round(pathProgress * N);
  const pts: string[] = [];
  for (let i = 0; i <= totalPts; i++) {
    const t = (i / N) * 2 * Math.PI;
    const { px, py } = toPixel(1.5 * Math.cos(t), Math.sin(t));
    pts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }
  if (pathProgress >= 1) pts.push("Z");

  // 中心标注
  const { px: cx, py: cy } = toPixel(0, 0);

  // 逆时针箭头（顶部）
  const arrowT = Math.PI / 2 + 0.2;
  const { px: ax, py: ay } = toPixel(1.5 * Math.cos(arrowT), Math.sin(arrowT));
  const { px: ax2, py: ay2 } = toPixel(1.5 * Math.cos(arrowT - 0.15), Math.sin(arrowT - 0.15));

  return (
    <g>
      {/* 内部填充 */}
      {pathProgress >= 1 && (
        <path d={pts.join(" ")} fill={COLORS.primaryCurve} fillOpacity={fillOpacity * 0.2} stroke="none" />
      )}
      {/* 边界曲线 */}
      <path d={pts.join(" ")} fill="none" stroke={COLORS.primaryCurve} strokeWidth={3} />
      {/* 区域标注 */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill={COLORS.primaryCurve} fontSize={22} fontStyle="italic" opacity={fillOpacity}>D</text>
      {/* 方向箭头 */}
      <polygon
        points={`${ax},${ay} ${ax - 10},${ay + 5} ${ax - 4},${ay - 10}`}
        fill={COLORS.highlight}
        opacity={arrowOpacity}
        transform={`rotate(${Math.atan2(ay2 - ay, ax2 - ax) * 180 / Math.PI + 90}, ${ax}, ${ay})`}
      />
      {/* 方向标注 */}
      {arrowOpacity > 0.5 && (
        <text x={ax + 12} y={ay - 12} fill={COLORS.highlight} fontSize={16} opacity={arrowOpacity}>逆时针（正方向）</text>
      )}
    </g>
  );
};

const Sec03Green: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 420 ? 4
    : frame < 480 ? 5
    : 6;

  const s1Op = fade(frame, 0);

  // Scene 2: 格林公式动画
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 75, 20);
  const pathProg = interpolate(frame, [88, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2FillOp = fade(frame, 140, 25);
  const s2ArrowOp = fade(frame, 155, 20);
  const s2Formula = fade(frame, 162, 20);

  // Scene 3: 路径无关
  const s3Title = fade(frame, 180, 20);
  const s3Cond = fade(frame, 200, 20);
  const s3Formula = fade(frame, 230, 20);
  const s3Note = fade(frame, 265, 20);
  const s3Potential = fade(frame, 280, 20);

  // Scene 4: 例题
  const s4Title = fade(frame, 300, 20);
  const s4Setup = fade(frame, 318, 20);
  const s4Calc = fade(frame, 348, 20);
  const s4Result = fade(frame, 390, 20);

  // Scene 5: 全微分方程
  const s5Title = fade(frame, 420, 20);
  const s5Formula = fade(frame, 438, 20);
  const s5Method = fade(frame, 460, 18);

  // Scene 6: 总结
  const s6Op = fade(frame, 480, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.3"
          sectionTitle="格林公式"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 格林公式动画 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            格林公式：边界积分 ↔ 内部二重积分
          </div>
          <CoordinateSystem
            width={640}
            height={340}
            xRange={[-2, 2]}
            yRange={[-1.5, 1.5]}
            opacity={s2CoordOp}
          >
            <GreenEllipse
              fillOpacity={s2FillOp}
              pathProgress={pathProg}
              arrowOpacity={s2ArrowOp}
            />
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\oint_L P\,\mathrm{d}x + Q\,\mathrm{d}y = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)\mathrm{d}A"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 路径无关条件 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>路径无关条件</div>
          <div style={{ opacity: s3Cond }}>
            <MathFormula
              latex="\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x} \;\;\Longleftrightarrow\;\; \text{积分与路径无关}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\Longleftrightarrow\;\; \exists\, u(x,y):\; \mathrm{d}u = P\,\mathrm{d}x + Q\,\mathrm{d}y"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Note, color: COLORS.annotation, fontSize: 20, textAlign: "center" }}>
            u(x,y) 称为势函数（原函数），此时 P dx+Q dy 是全微分
          </div>
          <div style={{ opacity: s3Potential }}>
            <MathFormula
              latex="\int_{(x_1,y_1)}^{(x_2,y_2)} P\,\mathrm{d}x + Q\,\mathrm{d}y = u(x_2,y_2) - u(x_1,y_1)"
              fontSize={30}
              color={COLORS.primaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 例题 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.highlight, fontSize: 24, opacity: s4Title }}>
            例题：用格林公式计算 ∮_L (x²+2xy)dx + (x²+4y)dy
          </div>
          <div style={{ opacity: s4Setup }}>
            <MathFormula
              latex="P = x^2+2xy,\;\; Q = x^2+4y"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Calc }}>
            <MathFormula
              latex="\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 2x - 2x = 0 \;\Rightarrow\; \text{与路径无关}"
              fontSize={28}
              color={COLORS.secondaryCurve}
            />
          </div>
          <div style={{ opacity: s4Result, color: COLORS.annotation, fontSize: 22 }}>
            若 L 为正方形边界（面积为 S）：∮ = ∬_D 0 dA = 0
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 全微分方程求积 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s5Title }}>全微分方程求势函数</div>
          <div style={{ opacity: s5Formula }}>
            <MathFormula
              latex="u(x,y) = \int_{x_0}^{x} P(x,y_0)\,\mathrm{d}x + \int_{y_0}^{y} Q(x,y)\,\mathrm{d}y"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Method, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            方法：先对 x 积分得 u，再对 y 求偏导验证 uᵧ = Q
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="格林公式总结" opacity={s6Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>格林公式</span>：∮_L P dx+Q dy = ∬_D (∂Q/∂x − ∂P/∂y) dA</div>
              <div>• <span style={{ color: COLORS.vector }}>路径无关条件</span>：∂P/∂y = ∂Q/∂x（在单连通区域）</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>势函数</span>：du = P dx + Q dy，∫ = u(终点) − u(起点)</div>
              <div>• <span style={{ color: COLORS.highlight }}>正方向</span>：行进时区域在左侧（逆时针为正）</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Green;
