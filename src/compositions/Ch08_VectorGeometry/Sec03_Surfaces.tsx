import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import katex from "katex";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem3D } from "../../components/math/CoordinateSystem3D";
import { SurfaceMesh3D } from "../../components/math/SurfaceMesh3D";
import { AnimatedVector3D } from "../../components/math/AnimatedVector3D";
import { ParametricCurve3D } from "../../components/math/ParametricCurve3D";

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
const PURPLE = "#bd93f9";

// ─────────────────────────────────────────────────────────────────────────────
// 主组件（540帧 = 18秒）
// ─────────────────────────────────────────────────────────────────────────────
const Sec03Surfaces: React.FC = () => {
  const frame = useCurrentFrame();

  // 场景切换
  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : frame < 480 ? 5
    : 6;

  // ── Scene 1: 标题 ──
  const s1Op = fade(frame, 0, 30);

  // ── Scene 2: 曲面概念（60-150帧）抛物面 + 旋转 ──
  const s2Op = fade(frame, 60, 20);
  // 旋转：从 π/4 缓缓转到 π/4 + π/2
  const rotY2 = interpolate(frame, [60, 150], [Math.PI / 4, Math.PI / 4 + Math.PI / 2], clamp);

  // ── Scene 3: 球面（150-270帧）+ Polanyi：纬线生成过程 ──
  const s3Op = fade(frame, 150, 20);
  // 球面"生长"：drawProgress 控制参数范围（纬度从赤道向两极扩展）
  const sphereGrow = interpolate(frame, [160, 240], [0, 1], clamp);
  // 旋转展示球面
  const rotY3 = interpolate(frame, [150, 270], [Math.PI / 6, Math.PI / 6 + Math.PI * 2 / 3], clamp);
  // 纬线数：sphereGrow 控制使用多少纬度范围（phi 从 π/2-epsilon 到 0 然后到 π）
  const sphereVSteps = Math.max(2, Math.floor(sphereGrow * 14));

  // ── Scene 4: 圆柱面（270-390帧）+ "母线"概念 ──
  const s4Op = fade(frame, 270, 20);
  const rotY4 = interpolate(frame, [270, 390], [Math.PI / 6, Math.PI / 6 + Math.PI * 2 / 3], clamp);
  // 母线绘制进度（一条平行于Z轴的直线沿圆周移动）
  const generatrixAngle = interpolate(frame, [290, 370], [0, Math.PI * 2], clamp);
  const generatrixX = Math.cos(generatrixAngle);
  const generatrixY = Math.sin(generatrixAngle);
  const cylinderProgress = interpolate(frame, [280, 310], [0, 1], clamp);

  // ── Scene 5: 旋转曲面（390-480帧）母线 y=√z 绕Z轴 ──
  const s5Op = fade(frame, 390, 20);
  const rotY5 = interpolate(frame, [390, 480], [Math.PI / 6, Math.PI / 6 + Math.PI * 4 / 3], clamp);
  // 母线显示进度
  const motherLineProgress = interpolate(frame, [400, 430], [0, 1], clamp);
  // 旋转面生成进度（theta 范围从0到2π）
  const rotSurfaceUMax = interpolate(frame, [430, 475], [0.01, Math.PI * 2], clamp);

  // ── Scene 6: 总结（480-540帧）──
  const s6Op = fade(frame, 480, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.3"
          sectionTitle="空间曲面与方程"
          opacity={s1Op}
        />
      )}

      {/* ── Scene 2: 曲面概念 + 抛物面 ── */}
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
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <CoordinateSystem3D
              width={820}
              height={640}
              center={[410, 450]}
              scale={62}
              xRange={[-3, 3]}
              yRange={[-3, 3]}
              zRange={[0, 4.5]}
              rotationX={Math.PI / 6}
              rotationY={rotY2}
            >
              {/* 抛物面 z = x²+y² */}
              <SurfaceMesh3D
                x={(u, _v) => u}
                y={(_u, v) => v}
                z={(u, v) => u * u + v * v}
                uMin={-2}
                uMax={2}
                uSteps={12}
                vMin={-2}
                vMax={2}
                vSteps={12}
                color={ACCENT}
                strokeWidth={0.9}
                opacity={0.65}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              width: 500,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 34, fontWeight: "bold" }}>
              空间曲面的概念
            </div>
            <div style={{ fontSize: 25, color: TEXT, lineHeight: 1.9 }}>
              空间曲面是满足方程
              <div
                style={{ textAlign: "center", margin: "12px 0", fontSize: 28 }}
                dangerouslySetInnerHTML={{ __html: math("F(x,\\,y,\\,z) = 0", true) }}
              />
              的点的集合。
            </div>
            <div
              style={{
                background: "rgba(97,218,251,0.08)",
                borderRadius: 10,
                padding: "16px 20px",
                fontSize: 23,
                color: TEXT,
                lineHeight: 1.85,
              }}
            >
              示例：抛物面{" "}
              <span
                style={{ color: ACCENT }}
                dangerouslySetInnerHTML={{ __html: math("z = x^2 + y^2") }}
              />
              <br />
              即 <span dangerouslySetInnerHTML={{ __html: math("x^2+y^2-z=0") }} />
              <br />
              <span style={{ color: GOLD }}>→ 旋转坐标系观察立体形状</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 3: 球面（Polanyi：纬线逐渐生成）── */}
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
              height={660}
              center={[410, 440]}
              scale={80}
              xRange={[-2, 2]}
              yRange={[-2, 2]}
              zRange={[-2, 2]}
              rotationX={Math.PI / 6}
              rotationY={rotY3}
            >
              {/* 球面 R=1.5，参数方程：x=R·sinφ·cosθ, y=R·sinφ·sinθ, z=R·cosφ
                  用 vSteps 控制"生长"过程（纬度行数随 sphereGrow 增加）*/}
              <SurfaceMesh3D
                x={(u, v) => 1.5 * Math.sin(v) * Math.cos(u)}
                y={(u, v) => 1.5 * Math.sin(v) * Math.sin(u)}
                z={(_u, v) => 1.5 * Math.cos(v)}
                uMin={0}
                uMax={Math.PI * 2}
                uSteps={18}
                vMin={0}
                vMax={Math.PI}
                vSteps={sphereVSteps}
                color={PINK}
                strokeWidth={1.0}
                opacity={0.7}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              width: 480,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ color: PINK, fontSize: 34, fontWeight: "bold" }}>
              球面方程
            </div>
            <div
              style={{ fontSize: 26, color: FORMULA, textAlign: "center", margin: "4px 0" }}
              dangerouslySetInnerHTML={{ __html: math("x^2 + y^2 + z^2 = R^2", true) }}
            />
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.85 }}>
              参数方程（{" "}
              <span dangerouslySetInnerHTML={{ __html: math("R=1.5") }} />）：
              <div
                style={{ fontSize: 21, margin: "10px 0" }}
                dangerouslySetInnerHTML={{
                  __html: math(
                    "x=R\\sin\\phi\\cos\\theta,\\;y=R\\sin\\phi\\sin\\theta,\\;z=R\\cos\\phi"
                  ),
                }}
              />
            </div>
            <div
              style={{
                background: "rgba(255,121,198,0.08)",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 22,
                color: TEXT,
                lineHeight: 1.85,
              }}
            >
              🔑 <strong style={{ color: PINK }}>Polanyi直觉</strong>：<br />
              观察球面从赤道向两极"生长"的过程，
              感受"纬线圆截面"的直觉
              <br />
              <span style={{ color: GOLD }}>
                水平截面 z=c 是圆{" "}
                <span dangerouslySetInnerHTML={{ __html: math("x^2+y^2=R^2-c^2") }} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 4: 圆柱面（Polanyi：母线运动生成）── */}
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
              height={660}
              center={[410, 440]}
              scale={72}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 3]}
              rotationX={Math.PI / 6}
              rotationY={rotY4}
            >
              {/* 圆柱面 x²+y²=1，参数：x=cosθ, y=sinθ, z=t */}
              <SurfaceMesh3D
                x={(u, _v) => Math.cos(u)}
                y={(u, _v) => Math.sin(u)}
                z={(_u, v) => v}
                uMin={0}
                uMax={Math.PI * 2}
                uSteps={20}
                vMin={0}
                vMax={2.5}
                vSteps={8}
                color={GREEN}
                strokeWidth={0.9}
                opacity={0.55}
              />
              {/* 母线：从 (cos(angle), sin(angle), 0) 到 (cos(angle), sin(angle), 2.5) */}
              <AnimatedVector3D
                from={[generatrixX, generatrixY, 0]}
                to={[generatrixX, generatrixY, 2.5]}
                color={GOLD}
                strokeWidth={3}
                drawProgress={cylinderProgress}
                label="母线"
                opacity={cylinderProgress > 0 ? 1 : 0}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              width: 480,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ color: GREEN, fontSize: 34, fontWeight: "bold" }}>
              圆柱面方程
            </div>
            <div
              style={{ fontSize: 26, color: FORMULA, textAlign: "center", margin: "4px 0" }}
              dangerouslySetInnerHTML={{ __html: math("x^2 + y^2 = R^2", true) }}
            />
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.85 }}>
              参数方程：
              <div
                style={{ fontSize: 22, margin: "8px 0" }}
                dangerouslySetInnerHTML={{
                  __html: math("x=\\cos\\theta,\\;y=\\sin\\theta,\\;z=t"),
                }}
              />
              <span style={{ fontSize: 21 }}>
                其中 <span dangerouslySetInnerHTML={{ __html: math("\\theta\\in[0,2\\pi]") }} />，
                z 任意
              </span>
            </div>
            <div
              style={{
                background: "rgba(80,250,123,0.08)",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 22,
                color: TEXT,
                lineHeight: 1.85,
              }}
            >
              🔑 <strong style={{ color: GREEN }}>母线概念</strong>：<br />
              圆柱面由一条平行于 Z 轴的直线（母线，金色）
              沿圆周运动而扫成
              <br />
              <span style={{ color: GREEN }}>
                — 不是凭空"存在"，而是由运动"生成"的
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 5: 旋转曲面（母线 y=√z 绕Z轴旋转）── */}
      {scene === 5 && (
        <div
          style={{
            opacity: s5Op,
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <CoordinateSystem3D
              width={820}
              height={660}
              center={[410, 450]}
              scale={70}
              xRange={[-2.5, 2.5]}
              yRange={[-2.5, 2.5]}
              zRange={[0, 3.5]}
              rotationX={Math.PI / 6}
              rotationY={rotY5}
            >
              {/* 母线 y=√z（在 xz 平面内，即 y=0），用 ParametricCurve3D */}
              <ParametricCurve3D
                x={(_t) => 0}
                y={(t) => Math.sqrt(t)}
                z={(t) => t}
                tMin={0}
                tMax={3}
                segments={50}
                color={GOLD}
                strokeWidth={3}
                drawProgress={motherLineProgress}
                opacity={motherLineProgress > 0 ? 1 : 0}
              />
              {/* 旋转曲面：x=√z·cosθ, y=√z·sinθ（即 x²+y²=z）*/}
              <SurfaceMesh3D
                x={(u, v) => Math.sqrt(v) * Math.cos(u)}
                y={(u, v) => Math.sqrt(v) * Math.sin(u)}
                z={(_u, v) => v}
                uMin={0}
                uMax={rotSurfaceUMax}
                uSteps={16}
                vMin={0.01}
                vMax={3}
                vSteps={10}
                color={PURPLE}
                strokeWidth={0.9}
                opacity={0.55}
              />
            </CoordinateSystem3D>
          </div>
          <div
            style={{
              width: 480,
              padding: "0 48px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ color: PURPLE, fontSize: 32, fontWeight: "bold" }}>
              旋转曲面
            </div>
            <div style={{ fontSize: 23, color: TEXT, lineHeight: 1.9 }}>
              母线（金色）：
              <span
                style={{ color: GOLD }}
                dangerouslySetInnerHTML={{ __html: math("y=\\sqrt{z}\\;(x=0)") }}
              />
              <br />
              绕 Z 轴旋转一圈：
            </div>
            <div
              style={{ fontSize: 24, color: FORMULA, textAlign: "center", margin: "6px 0" }}
              dangerouslySetInnerHTML={{ __html: math("x^2 + y^2 = z", true) }}
            />
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.8 }}>
              通式：若母线为{" "}
              <span dangerouslySetInnerHTML={{ __html: math("y=f(z)") }} />（在 yz 平面），
              绕 Z 轴旋转得：
              <div
                style={{ fontSize: 22, textAlign: "center", margin: "8px 0", color: PURPLE }}
                dangerouslySetInnerHTML={{ __html: math("x^2+y^2=[f(z)]^2") }}
              />
            </div>
            <div
              style={{
                background: "rgba(189,147,249,0.08)",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 21,
                color: TEXT,
                lineHeight: 1.8,
              }}
            >
              🔑 旋转曲面由母线旋转<strong style={{ color: PURPLE }}>扫成</strong>，
              动画展示从 0 到 2π 的生成过程
            </div>
          </div>
        </div>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <div
          style={{
            opacity: s6Op,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 28,
          }}
        >
          <TheoremBox title="空间曲面方程总结" width={1100} opacity={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontSize: 24,
                  color: TEXT,
                }}
              >
                <span style={{ color: ACCENT, minWidth: 90, fontWeight: "bold" }}>一般式：</span>
                <span dangerouslySetInnerHTML={{ __html: math("F(x,y,z)=0") }} />
                <span style={{ marginLeft: 12, fontSize: 21, opacity: 0.8 }}>满足方程的点的集合</span>
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
                <span style={{ color: PINK, minWidth: 90, fontWeight: "bold" }}>球面：</span>
                <span dangerouslySetInnerHTML={{ __html: math("x^2+y^2+z^2=R^2") }} />
                <span style={{ marginLeft: 12, fontSize: 21, opacity: 0.8 }}>球心原点，半径 R</span>
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
                <span style={{ color: GREEN, minWidth: 90, fontWeight: "bold" }}>柱面：</span>
                <span dangerouslySetInnerHTML={{ __html: math("x^2+y^2=R^2") }} />
                <span style={{ marginLeft: 12, fontSize: 21, opacity: 0.8 }}>无 z 项，母线平行 Z 轴</span>
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
                <span style={{ color: PURPLE, minWidth: 90, fontWeight: "bold" }}>旋转面：</span>
                <span dangerouslySetInnerHTML={{ __html: math("x^2+y^2=[f(z)]^2") }} />
                <span style={{ marginLeft: 12, fontSize: 21, opacity: 0.8 }}>母线 y=f(z) 绕 Z 轴旋转</span>
              </div>
            </div>
          </TheoremBox>
          <div
            style={{
              fontSize: 26,
              color: TEXT,
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.8,
            }}
          >
            曲面是三维空间中最基本的几何对象，
            <br />
            其方程{" "}
            <span dangerouslySetInnerHTML={{ __html: math("F(x,y,z)=0") }} />{" "}
            对应三维空间的一个约束
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Root.tsx 中已有 withWatermark 包裹，此处直接导出原始组件
export default Sec03Surfaces;
