import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { MathFormula } from "../../components/math/MathFormula";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { StepByStep } from "../../components/ui/StepByStep";
import { COLORS } from "../../constants/colorTheme";

const fade = (frame: number, start: number, dur = 30) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec04Chain: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180（树状图逐步揭示）
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 130, 25);
  const t4 = fade(frame, 160, 25);

  // 树状图逐步显示动画变量
  const node1Op = fade(frame, 95, 15);   // z 节点
  const node2Op = fade(frame, 110, 15);  // u 节点
  const node3Op = fade(frame, 110, 15);  // v 节点
  const line1Op = fade(frame, 125, 15);  // z→u 连线
  const line2Op = fade(frame, 125, 15);  // z→v 连线
  const label1Op = fade(frame, 140, 15); // ∂z/∂u 标注
  const label2Op = fade(frame, 140, 15); // ∂z/∂v 标注
  const node4Op = fade(frame, 155, 15);  // x 节点
  const node5Op = fade(frame, 155, 15);  // y 节点
  const line3Op = fade(frame, 165, 10);  // u→x
  const line4Op = fade(frame, 165, 10);  // u→y
  const line5Op = fade(frame, 165, 10);  // v→x
  const line6Op = fade(frame, 165, 10);  // v→y

  // Scene 3: 180-270
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  // Scene 4: 270-390（具体例题动画化推导）
  const s4In = fade(frame, 270, 30);
  const step4_1 = fade(frame, 290, 20);
  const step4_2 = fade(frame, 315, 20);
  const step4_3 = fade(frame, 340, 20);
  const step4_4 = fade(frame, 365, 20);
  // 计算当前显示步骤数（0-indexed）
  const currentStep4 = step4_4 > 0.5 ? 3
    : step4_3 > 0.5 ? 2
    : step4_2 > 0.5 ? 1
    : 0;

  // Scene 5: 390-480（全微分形式不变性）
  const s5In = fade(frame, 390, 30);
  const form1Op = fade(frame, 410, 25);
  const form2Op = fade(frame, 440, 25);
  const thmOp = fade(frame, 460, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法及其应用"
          sectionNum="9.4"
          sectionTitle="多元复合函数的求导法则"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：链式法则 + 树状图（逐步揭示）60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 60,
            padding: "0 80px",
          }}
        >
          {/* 左侧：公式 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ opacity: t1 }}>
              <div style={{ color: COLORS.primaryCurve, fontSize: 24, marginBottom: 8 }}>
                复合关系：z=f(u,v), u=u(x,y), v=v(x,y)
              </div>
              <MathFormula
                latex="\frac{\partial z}{\partial x} = \frac{\partial z}{\partial u}\cdot\frac{\partial u}{\partial x} + \frac{\partial z}{\partial v}\cdot\frac{\partial v}{\partial x}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>

            <div style={{ opacity: t2 }}>
              <MathFormula
                latex="\frac{\partial z}{\partial y} = \frac{\partial z}{\partial u}\cdot\frac{\partial u}{\partial y} + \frac{\partial z}{\partial v}\cdot\frac{\partial v}{\partial y}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>

            <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14 }}>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 6 }}>
                特例：z=f(u), u=u(x,y)（一元复合）
              </div>
              <MathFormula
                latex="\frac{\partial z}{\partial x} = f'(u)\cdot\frac{\partial u}{\partial x}"
                fontSize={38}
                color={COLORS.secondaryCurve}
              />
            </div>

            <div style={{ opacity: t4, color: COLORS.annotation, fontSize: 20 }}>
              口诀：沿树状图每条路径相乘，所有路径结果相加
            </div>
          </div>

          {/* 右侧：树状图 SVG（逐步揭示） */}
          <div style={{ flexShrink: 0 }}>
            <svg width={220} height={280} viewBox="0 0 220 280">
              {/* z 节点 */}
              <g opacity={node1Op}>
                <circle cx="110" cy="30" r="20" fill={COLORS.theoremBg} stroke={COLORS.primaryCurve} strokeWidth="2" />
                <text x="110" y="36" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">z</text>
              </g>

              {/* u 节点 */}
              <g opacity={node2Op}>
                <circle cx="55" cy="120" r="20" fill={COLORS.theoremBg} stroke={COLORS.highlight} strokeWidth="2" />
                <text x="55" y="126" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">u</text>
              </g>

              {/* v 节点 */}
              <g opacity={node3Op}>
                <circle cx="165" cy="120" r="20" fill={COLORS.theoremBg} stroke={COLORS.highlight} strokeWidth="2" />
                <text x="165" y="126" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">v</text>
              </g>

              {/* z→u, z→v 连线 */}
              <line x1="95" y1="47" x2="65" y2="102" stroke={COLORS.primaryCurve} strokeWidth="1.5" opacity={line1Op} />
              <line x1="125" y1="47" x2="155" y2="102" stroke={COLORS.primaryCurve} strokeWidth="1.5" opacity={line2Op} />

              {/* 标注 ∂z/∂u, ∂z/∂v */}
              <text x="68" y="86" fill={COLORS.primaryCurve} fontSize="13" opacity={label1Op}>∂z/∂u</text>
              <text x="128" y="86" fill={COLORS.primaryCurve} fontSize="13" opacity={label2Op}>∂z/∂v</text>

              {/* x, y 节点（u下面）*/}
              <g opacity={node4Op}>
                <circle cx="25" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
                <text x="25" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">x</text>
              </g>
              <g opacity={node5Op}>
                <circle cx="85" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
                <text x="85" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">y</text>
              </g>

              {/* x, y 节点（v下面）*/}
              <g opacity={node4Op}>
                <circle cx="135" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
                <text x="135" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">x</text>
              </g>
              <g opacity={node5Op}>
                <circle cx="195" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
                <text x="195" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">y</text>
              </g>

              {/* u→x, u→y 连线 */}
              <line x1="42" y1="137" x2="30" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" opacity={line3Op} />
              <line x1="62" y1="138" x2="78" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" opacity={line4Op} />

              {/* v→x, v→y 连线 */}
              <line x1="152" y1="137" x2="140" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" opacity={line5Op} />
              <line x1="173" y1="138" x2="188" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" opacity={line6Op} />

              {/* 标注 ∂u/∂x, ∂u/∂y, ∂v/∂x, ∂v/∂y */}
              <text x="18" y="180" fill={COLORS.highlight} fontSize="12" opacity={line3Op}>∂u/∂x</text>
              <text x="65" y="185" fill={COLORS.highlight} fontSize="12" opacity={line4Op}>∂u/∂y</text>
              <text x="118" y="180" fill={COLORS.highlight} fontSize="12" opacity={line5Op}>∂v/∂x</text>
              <text x="174" y="185" fill={COLORS.highlight} fontSize="12" opacity={line6Op}>∂v/∂y</text>
            </svg>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：链式法则总结 180-270 */}
      <Sequence from={180} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 32,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="链式法则（多元复合求导）" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                沿每条路径将偏导数<span style={{ color: COLORS.primaryCurve }}>相乘</span>，
                再将所有路径结果<span style={{ color: COLORS.highlight }}>相加</span>
              </div>
              <div style={{ opacity: thm2 }}>
                中间变量 u, v 各贡献一条路径
              </div>
              <div style={{ opacity: thm3 }}>
                全微分形式不变性：dz = (∂z/∂u)du + (∂z/∂v)dv 恒成立
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              例：z = e^u sin v, u = xy, v = x+y，求 ∂z/∂x
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = e^u\sin v \cdot y + e^u\cos v \cdot 1"
              fontSize={42}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景4：具体例题动画化推导 270-390 */}
      <Sequence from={270} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 100px",
            opacity: s4In,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: step4_1 }}>
            例题：z = f(u, v)，其中 u = x² + y²，v = xy，求 ∂z/∂x
          </div>

          <div style={{ width: "100%", opacity: Math.max(step4_1, 0.01) }}>
            <StepByStep
              currentStep={currentStep4}
              stepHeight={70}
              steps={[
                "写出 ∂z/∂x 的链式法则结构：∂z/∂x = (∂z/∂u)(∂u/∂x) + (∂z/∂v)(∂v/∂x)",
                "用链式法则展开，代入中间变量的偏导数形式",
                "计算 ∂u/∂x = 2x，∂v/∂x = y，代入得结果",
                "最终结果：∂z/∂x = f'ᵤ · 2x + f'ᵥ · y",
              ]}
            />
          </div>

          <div style={{ opacity: step4_4, marginTop: 8 }}>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = \frac{\partial f}{\partial u}\cdot 2x + \frac{\partial f}{\partial v}\cdot y"
              fontSize={40}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景5：全微分形式不变性 390-480 */}
      <Sequence from={390} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 32,
            padding: "0 80px",
            opacity: s5In,
          }}
        >
          <div style={{ opacity: thmOp, width: "100%" }}>
            <TheoremBox title="全微分形式不变性" opacity={thmOp} width={960}>
              <div style={{ color: COLORS.annotation, fontSize: 21, lineHeight: 1.8 }}>
                无论 z 是自变量还是中间变量，全微分形式保持不变
              </div>
            </TheoremBox>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 60,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* 左：以 x, y 为自变量的形式 */}
            <div
              style={{
                opacity: form1Op,
                flex: 1,
                textAlign: "center",
                padding: "20px",
                border: `1.5px solid ${COLORS.primaryCurve}`,
                borderRadius: 12,
              }}
            >
              <div style={{ color: COLORS.primaryCurve, fontSize: 20, marginBottom: 12 }}>
                以 x, y 为自变量
              </div>
              <MathFormula
                latex="\mathrm{d}z = \frac{\partial z}{\partial x}\,\mathrm{d}x + \frac{\partial z}{\partial y}\,\mathrm{d}y"
                fontSize={32}
                color={COLORS.formula}
              />
            </div>

            {/* 等号 */}
            <div style={{ color: COLORS.annotation, fontSize: 36, opacity: Math.min(form1Op, form2Op) }}>
              ≡
            </div>

            {/* 右：以 u, v 为中间变量的形式 */}
            <div
              style={{
                opacity: form2Op,
                flex: 1,
                textAlign: "center",
                padding: "20px",
                border: `1.5px solid ${COLORS.secondaryCurve}`,
                borderRadius: 12,
              }}
            >
              <div style={{ color: COLORS.secondaryCurve, fontSize: 20, marginBottom: 12 }}>
                以 u, v 为中间变量
              </div>
              <MathFormula
                latex="\mathrm{d}z = \frac{\partial z}{\partial u}\,\mathrm{d}u + \frac{\partial z}{\partial v}\,\mathrm{d}v"
                fontSize={32}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: form2Op, textAlign: "center" }}>
            <MathFormula
              latex="\mathrm{d}u = \frac{\partial u}{\partial x}\,\mathrm{d}x + \frac{\partial u}{\partial y}\,\mathrm{d}y, \quad \mathrm{d}v = \frac{\partial v}{\partial x}\,\mathrm{d}x + \frac{\partial v}{\partial y}\,\mathrm{d}y"
              fontSize={26}
              color={COLORS.annotation}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec04Chain;
