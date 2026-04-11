import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { AnimatedVector3D } from "../../components/math/AnimatedVector3D";

// ─────────────────────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────────────────────
const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const math = (latex: string, display = false) =>
  katex.renderToString(latex, { throwOnError: false, displayMode: display });

// ─────────────────────────────────────────────────────────────────────────────
// 颜色常量
// ─────────────────────────────────────────────────────────────────────────────
const BG = COLORS.background;
const ACCENT = COLORS.primaryCurve ?? "#61dafb";
const TEXT = COLORS.annotation ?? "#94a3b8";
const FORMULA = COLORS.formula ?? "#f8f8f2";
const GREEN = "#50fa7b";
const PINK = "#ff79c6";
const GOLD = "#ffd700";
const RED = "#ff5555";

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（510帧 = 17秒）
// ─────────────────────────────────────────────────────────────────────────────
const Sec01Vectors: React.FC = () => {
  const frame = useCurrentFrame();

  // 场景切换
  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : frame < 450 ? 5
    : 6;

  // ── Scene 1: 标题 ──
  const s1Op = fade(frame, 0, 30);

  // ── Scene 2: 空间向量（60-150帧）──
  const s2Op = fade(frame, 60, 20);
  const vecAProgress = interpolate(frame, [70, 130], [0, 1], clamp);
  const compXProgress = interpolate(frame, [80, 105], [0, 1], clamp);
  const compYProgress = interpolate(frame, [100, 120], [0, 1], clamp);
  const compZProgress = interpolate(frame, [115, 140], [0, 1], clamp);
  const s2LabelOp = fade(frame, 90, 20);

  // ── Scene 3: 向量加法（150-270帧）──
  const s3Op = fade(frame, 150, 20);
  const vecAAddProgress = interpolate(frame, [160, 195], [0, 1], clamp);
  const vecBAddProgress = interpolate(frame, [190, 222], [0, 1], clamp);
  const vecSumProgress = interpolate(frame, [222, 258], [0, 1], clamp);
  // 旋转展示平行四边形（Polanyi：不同角度观察3D平行四边形）
  const rotY3 = interpolate(frame, [150, 270], [Math.PI / 4, Math.PI / 4 + Math.PI / 3], clamp);

  // ── Scene 4: 叉积（270-390帧）──
  const s4Op = fade(frame, 270, 20);
  const vecA4Progress = interpolate(frame, [280, 310], [0, 1], clamp);
  const vecB4Progress = interpolate(frame, [305, 335], [0, 1], clamp);
  const crossProgress = interpolate(frame, [335, 378], [0, 1], clamp);
  const s4TextOp = fade(frame, 310, 20);
  // 后30帧旋转，Polanyi: 从不同角度验证叉积垂直性
  const rotY4 = interpolate(frame, [360, 390], [Math.PI / 4, Math.PI / 4 + Math.PI / 3], clamp);
  const rotY4Base = frame < 360 ? Math.PI / 4 : rotY4;

  // ── Scene 5: TheoremBox（390-450帧）──
  const s5Op = fade(frame, 390, 30);

  // ── Scene 6: 应用预告（450-510帧）──
  const s6Op = fade(frame, 450, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.1"
          sectionTitle="空间向量基础"
          opacity={s1Op}
        />
      )}

      {/* ── Scene 2: 什么是空间向量 ── */}
      {scene === 2 && (
        <div
          style={{
            opacity: s2Op,
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          {/* 左侧：3D 坐标系 + 向量 */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <CoordinateSystem3D
              width={820}
              height={640}
              center={[410, 430]}
              scale={80}
              xRange={[-0.5, 3.5]}
              yRange={[-0.5, 3.5]}
              zRange={[0, 3.5]}
              rotationX={Math.PI / 6}
              rotationY={Math.PI / 4}
            >
              {/* 主向量 a=(2,1,3)，金色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[2, 1, 3]}
                color={GOLD}
                strokeWidth={4}
                drawProgress={vecAProgress}
                label="a=(2,1,3)"
                opacity={1}
              />
              {/* 折线路径 Step 1：沿X轴到(2,0,0)，蓝色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[2, 0, 0]}
                color={ACCENT}
                strokeWidth={2}
                drawProgress={compXProgress}
                label="2"
                opacity={compXProgress > 0 ? 0.85 : 0}
              />
              {/* 折线路径 Step 2：沿Y轴到(2,1,0)，绿色 */}
              <AnimatedVector3D
                from={[2, 0, 0]}
                to={[2, 1, 0]}
                color={GREEN}
                strokeWidth={2}
                drawProgress={compYProgress}
                label="1"
                opacity={compYProgress > 0 ? 0.85 : 0}
              />
              {/* 折线路径 Step 3：沿Z轴到(2,1,3)，粉色 */}
              <AnimatedVector3D
                from={[2, 1, 0]}
                to={[2, 1, 3]}
                color={PINK}
                strokeWidth={2}
                drawProgress={compZProgress}
                label="3"
                opacity={compZProgress > 0 ? 0.85 : 0}
              />
            </CoordinateSystem3D>
          </div>

          {/* 右侧：说明文字 */}
          <div
            style={{
              width: 500,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 36, fontWeight: "bold" }}>
              空间向量
            </div>
            <div style={{ fontSize: 26, color: TEXT, lineHeight: 1.85 }}>
              空间向量是有{" "}
              <strong style={{ color: GOLD }}>大小</strong>和{" "}
              <strong style={{ color: PINK }}>方向</strong>的量，
              可用坐标{" "}
              <span dangerouslySetInnerHTML={{ __html: math("(x,y,z)") }} />{" "}
              完全描述。
            </div>

            <div
              style={{
                background: "rgba(97,218,251,0.08)",
                borderRadius: 10,
                padding: "18px 22px",
                fontSize: 23,
                color: TEXT,
                lineHeight: 2.1,
                opacity: s2LabelOp,
              }}
            >
              <div>
                <span style={{ color: ACCENT }}>●</span>{" "}
                <span style={{ color: ACCENT }}>蓝色</span> →{" "}
                x 分量 = 2（沿 X 轴）
              </div>
              <div>
                <span style={{ color: GREEN }}>●</span>{" "}
                <span style={{ color: GREEN }}>绿色</span> →{" "}
                y 分量 = 1（沿 Y 轴）
              </div>
              <div>
                <span style={{ color: PINK }}>●</span>{" "}
                <span style={{ color: PINK }}>粉色</span> →{" "}
                z 分量 = 3（沿 Z 轴）
              </div>
              <div style={{ marginTop: 12, color: GOLD, fontWeight: "bold" }}>
                <span dangerouslySetInnerHTML={{ __html: math("\\vec{a} = (2,1,3)") }} />
              </div>
            </div>
            <div style={{ fontSize: 21, color: TEXT, opacity: 0.75 }}>
              折线路径：原点 → (2,0,0) → (2,1,0) → (2,1,3)
              <br />
              模长：
              <span dangerouslySetInnerHTML={{ __html: math("|\\vec{a}|=\\sqrt{4+1+9}=\\sqrt{14}") }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 3: 向量加法平行四边形（3D版 + 旋转）── */}
      {scene === 3 && (
        <div
          style={{
            opacity: s3Op,
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <CoordinateSystem3D
              width={820}
              height={640}
              center={[410, 440]}
              scale={70}
              xRange={[-0.5, 4.5]}
              yRange={[-0.5, 4.5]}
              zRange={[0, 2.5]}
              rotationX={Math.PI / 6}
              rotationY={rotY3}
            >
              {/* a=(2,1,0) 蓝色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[2, 1, 0]}
                color={ACCENT}
                strokeWidth={4}
                drawProgress={vecAAddProgress}
                label="a=(2,1,0)"
                opacity={1}
              />
              {/* b=(1,2,1) 绿色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[1, 2, 1]}
                color={GREEN}
                strokeWidth={4}
                drawProgress={vecBAddProgress}
                label="b=(1,2,1)"
                opacity={1}
              />
              {/* a+b=(3,3,1) 金色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[3, 3, 1]}
                color={GOLD}
                strokeWidth={4}
                drawProgress={vecSumProgress}
                label="a+b=(3,3,1)"
                opacity={vecSumProgress > 0 ? 1 : 0}
              />
              {/* 平行四边形辅助线：从 a 终点到 a+b */}
              <AnimatedVector3D
                from={[2, 1, 0]}
                to={[3, 3, 1]}
                color={GREEN}
                strokeWidth={1.5}
                drawProgress={vecSumProgress}
                opacity={vecSumProgress > 0 ? 0.45 : 0}
              />
              {/* 从 b 终点到 a+b */}
              <AnimatedVector3D
                from={[1, 2, 1]}
                to={[3, 3, 1]}
                color={ACCENT}
                strokeWidth={1.5}
                drawProgress={vecSumProgress}
                opacity={vecSumProgress > 0 ? 0.45 : 0}
              />
            </CoordinateSystem3D>
          </div>

          {/* 右侧 */}
          <div
            style={{
              width: 480,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>
              向量加法
              <br />
              平行四边形法则（3D）
            </div>
            <div style={{ fontSize: 24, color: TEXT, lineHeight: 1.9 }}>
              <span dangerouslySetInnerHTML={{ __html: math("\\vec{a} = (2,1,0)") }} />（蓝）
              <br />
              <span dangerouslySetInnerHTML={{ __html: math("\\vec{b} = (1,2,1)") }} />（绿）
              <br />
              <span
                style={{ color: GOLD, fontWeight: "bold" }}
                dangerouslySetInnerHTML={{ __html: math("\\vec{a}+\\vec{b} = (3,3,1)") }}
              />
            </div>
            <div
              style={{
                background: "rgba(255,215,0,0.08)",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 22,
                color: TEXT,
                lineHeight: 1.8,
              }}
            >
              🔄 坐标系旋转展示：<br />
              从不同角度观察三维平行四边形，
              建立空间直觉
            </div>
            <div style={{ fontSize: 21, color: TEXT, opacity: 0.8 }}>
              分量逐项相加：
              <br />
              <span dangerouslySetInnerHTML={{ __html: math("(a_x+b_x,\\,a_y+b_y,\\,a_z+b_z)") }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 4: 叉积几何意义（Polanyi核心）── */}
      {scene === 4 && (
        <div
          style={{
            opacity: s4Op,
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <CoordinateSystem3D
              width={820}
              height={640}
              center={[410, 440]}
              scale={72}
              xRange={[-1, 4]}
              yRange={[-1, 4]}
              zRange={[-2.5, 3]}
              rotationX={Math.PI / 6}
              rotationY={rotY4Base}
            >
              {/* a=(1,2,0) 蓝色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[1, 2, 0]}
                color={ACCENT}
                strokeWidth={4}
                drawProgress={vecA4Progress}
                label="a=(1,2,0)"
                opacity={1}
              />
              {/* b=(2,0,1) 绿色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[2, 0, 1]}
                color={GREEN}
                strokeWidth={4}
                drawProgress={vecB4Progress}
                label="b=(2,0,1)"
                opacity={1}
              />
              {/* a×b = (2·1-0·0, 0·2-1·1, 1·0-2·2) = (2,-1,-4)，缩放1/2=(1,-0.5,-2) 红色 */}
              <AnimatedVector3D
                from={[0, 0, 0]}
                to={[1, -0.5, -2]}
                color={RED}
                strokeWidth={4}
                drawProgress={crossProgress}
                label="a×b"
                opacity={crossProgress > 0 ? 1 : 0}
              />
            </CoordinateSystem3D>
          </div>

          {/* 右侧 */}
          <div
            style={{
              width: 500,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 32, fontWeight: "bold" }}>
              叉积（向量积）
            </div>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.9 }}>
              <span dangerouslySetInnerHTML={{ __html: math("\\vec{a} = (1,2,0)") }} />（蓝）
              <br />
              <span dangerouslySetInnerHTML={{ __html: math("\\vec{b} = (2,0,1)") }} />（绿）
            </div>
            <div style={{ fontSize: 19, color: FORMULA }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: math(
                    "\\vec{a}\\times\\vec{b}=\\begin{vmatrix}\\vec{i}&\\vec{j}&\\vec{k}\\\\1&2&0\\\\2&0&1\\end{vmatrix}",
                    true
                  ),
                }}
              />
            </div>
            <div style={{ fontSize: 24, color: RED, fontWeight: "bold" }}>
              <span dangerouslySetInnerHTML={{ __html: math("=(2,\\,-1,\\,-4)") }} />
              （红色，缩比1/2显示）
            </div>
            <div
              style={{
                background: "rgba(255,85,85,0.08)",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 21,
                color: TEXT,
                lineHeight: 1.85,
                opacity: s4TextOp,
              }}
            >
              🔑 <strong style={{ color: RED }}>Polanyi直觉</strong>：<br />
              叉积 <span dangerouslySetInnerHTML={{ __html: math("\\vec{a}\\times\\vec{b}") }} />{" "}
              垂直于 <span dangerouslySetInnerHTML={{ __html: math("\\vec{a},\\vec{b}") }} /> 所在平面
              <br />
              旋转坐标系可从各角度验证
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 5: TheoremBox（基本运算公式）── */}
      {scene === 5 && (
        <div
          style={{
            opacity: s5Op,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 28,
          }}
        >
          <TheoremBox title="向量基本运算公式" width={1140} opacity={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                padding: "12px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontSize: 26,
                  color: TEXT,
                }}
              >
                <span style={{ color: ACCENT, minWidth: 80, fontWeight: "bold" }}>模长：</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: math("|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}"),
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontSize: 26,
                  color: TEXT,
                }}
              >
                <span style={{ color: GREEN, minWidth: 80, fontWeight: "bold" }}>点积：</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: math(
                      "\\vec{a}\\cdot\\vec{b} = a_x b_x + a_y b_y + a_z b_z = |\\vec{a}||\\vec{b}|\\cos\\theta"
                    ),
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontSize: 24,
                  color: TEXT,
                }}
              >
                <span style={{ color: RED, minWidth: 80, fontWeight: "bold" }}>叉积：</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: math(
                      "\\vec{a}\\times\\vec{b}=\\begin{vmatrix}\\vec{i}&\\vec{j}&\\vec{k}\\\\a_x&a_y&a_z\\\\b_x&b_y&b_z\\end{vmatrix}"
                    ),
                  }}
                />
                <span
                  style={{ fontSize: 22, color: TEXT, marginLeft: 16 }}
                  dangerouslySetInnerHTML={{
                    __html: math("|\\vec{a}\\times\\vec{b}|=|\\vec{a}||\\vec{b}|\\sin\\theta"),
                  }}
                />
              </div>
            </div>
          </TheoremBox>
        </div>
      )}

      {/* ── Scene 6: 应用预告 ── */}
      {scene === 6 && (
        <div
          style={{
            opacity: s6Op,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 36,
          }}
        >
          <div style={{ color: ACCENT, fontSize: 38, fontWeight: "bold" }}>
            向量的应用
          </div>
          <div
            style={{
              background: "rgba(97,218,251,0.08)",
              borderRadius: 12,
              padding: "32px 48px",
              width: 960,
              fontSize: 27,
              color: TEXT,
              lineHeight: 2.3,
            }}
          >
            向量是描述三维空间的语言，将用于：
            <br />
            <span style={{ color: GOLD }}>① 平面方程</span>：
            法向量{" "}
            <span dangerouslySetInnerHTML={{ __html: math("\\vec{n}") }} />{" "}
            确定平面（点法式）
            <br />
            <span style={{ color: GREEN }}>② 曲面方程</span>：
            曲面法向量与切线积分
            <br />
            <span style={{ color: PINK }}>③ 积分变换</span>：
            Jacobi 行列式与叉积的关系
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Root.tsx 中已有 withWatermark 包裹，此处直接导出原始组件
export default Sec01Vectors;
