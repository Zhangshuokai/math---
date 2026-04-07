import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { MathFormula } from "../../components/math/MathFormula";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { COLORS } from "../../constants/colorTheme";

const fade = (frame: number, start: number, dur = 30) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec04Chain: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 130, 25);
  const t4 = fade(frame, 160, 25);
  const treeOpacity = fade(frame, 80, 30);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

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

      {/* 场景2：链式法则 + 树状图 60-180 */}
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

          {/* 右侧：树状图 SVG */}
          <div style={{ opacity: treeOpacity, flexShrink: 0 }}>
            <svg width={220} height={280} viewBox="0 0 220 280">
              {/* z 节点 */}
              <circle cx="110" cy="30" r="20" fill={COLORS.theoremBg} stroke={COLORS.primaryCurve} strokeWidth="2" />
              <text x="110" y="36" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">z</text>

              {/* u 节点 */}
              <circle cx="55" cy="120" r="20" fill={COLORS.theoremBg} stroke={COLORS.highlight} strokeWidth="2" />
              <text x="55" y="126" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">u</text>

              {/* v 节点 */}
              <circle cx="165" cy="120" r="20" fill={COLORS.theoremBg} stroke={COLORS.highlight} strokeWidth="2" />
              <text x="165" y="126" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">v</text>

              {/* x, y 节点（u下面）*/}
              <circle cx="25" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
              <text x="25" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">x</text>

              <circle cx="85" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
              <text x="85" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">y</text>

              {/* x, y 节点（v下面）*/}
              <circle cx="135" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
              <text x="135" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">x</text>

              <circle cx="195" cy="220" r="18" fill={COLORS.theoremBg} stroke={COLORS.secondaryCurve} strokeWidth="2" />
              <text x="195" y="226" textAnchor="middle" fill={COLORS.formula} fontSize="18" fontStyle="italic">y</text>

              {/* 连线 */}
              <line x1="95" y1="47" x2="65" y2="102" stroke={COLORS.primaryCurve} strokeWidth="1.5" />
              <line x1="125" y1="47" x2="155" y2="102" stroke={COLORS.primaryCurve} strokeWidth="1.5" />
              <line x1="42" y1="137" x2="30" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" />
              <line x1="62" y1="138" x2="78" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" />
              <line x1="152" y1="137" x2="140" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" />
              <line x1="173" y1="138" x2="188" y2="203" stroke={COLORS.highlight} strokeWidth="1.5" />

              {/* 标注 */}
              <text x="68" y="86" fill={COLORS.primaryCurve} fontSize="13">∂z/∂u</text>
              <text x="128" y="86" fill={COLORS.primaryCurve} fontSize="13">∂z/∂v</text>
              <text x="18" y="180" fill={COLORS.highlight} fontSize="12">∂u/∂x</text>
              <text x="65" y="185" fill={COLORS.highlight} fontSize="12">∂u/∂y</text>
              <text x="118" y="180" fill={COLORS.highlight} fontSize="12">∂v/∂x</text>
              <text x="174" y="185" fill={COLORS.highlight} fontSize="12">∂v/∂y</text>
            </svg>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：总结 180-300 */}
      <Sequence from={180} durationInFrames={120}>
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
    </AbsoluteFill>
  );
};

export default Sec04Chain;
