#!/usr/bin/env python3
"""
Repair broken JSX files caused by Form-B bug in fix_3d_rotation.py.
Each fix uses exact string anchors verified against the current file contents.
"""

import os, re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def read(rel):
    with open(os.path.join(BASE_DIR, rel)) as f:
        return f.read()


def write(rel, content):
    with open(os.path.join(BASE_DIR, rel), 'w') as f:
        f.write(content)
    print(f'  [saved] {rel}')


def apply(content, old, new, label):
    if old in content:
        result = content.replace(old, new, 1)
        print(f'  [ok] {label}')
        return result
    else:
        print(f'  [MISS] {label}')
        return content


# ──────────────────────────────────────────────────────────────
# Sec06_IM_Mass.tsx  (Ch10)
# ──────────────────────────────────────────────────────────────
def fix_sec06():
    path = 'src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx'
    c = read(path)

    # 1. Insert CS3D opening in Stage 4 (inside TheoremBox's inner div)
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '14px 0' }}>\n"
        "                {/* 外圆柱面",
        "            <div style={{ textAlign: 'center', padding: '14px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[420, 330]}\n"
        "                 scale={50}\n"
        "                 xRange={[-5.5, 5.5]}\n"
        "                 yRange={[-5.5, 5.5]}\n"
        "                 zRange={[0, 4]}\n"
        "                 showGrid\n"
        "                 width={820}\n"
        "                 height={560}\n"
        "               >\n"
        "                {/* 外圆柱面",
        "Stage4 CS3D opening"
    )

    # 2. Insert Stage 5 before Stage 6
    c = apply(c,
        "      {/* ── Stage 6: 总结 ── */}",
        "      {/* ── Stage 5: 3D 旋转可视化 ── */}\n"
        "      {scene === 5 && (\n"
        "        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>\n"
        "          <div style={{ color: ORANGE, fontSize: 28, fontWeight: 'bold' }}>\n"
        "            🌐 圆环截面极惯性矩 3D 旋转展示\n"
        "          </div>\n"
        "          <CoordinateSystem3D\n"
        "            center={[420, 330]}\n"
        "            scale={50}\n"
        "            xRange={[-5.5, 5.5]}\n"
        "            yRange={[-5.5, 5.5]}\n"
        "            zRange={[0, 4]}\n"
        "            showGrid\n"
        "            width={820}\n"
        "            height={560}\n"
        "            rotationY={rotateY * Math.PI / 180}\n"
        "            rotationX={Math.PI / 6}\n"
        "          >\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => R2 * Math.cos(v)}\n"
        "              y={(u, v) => R2 * Math.sin(v)}\n"
        "              z={(_u, v) => R2 * R2 * Math.abs(Math.sin(v + Math.PI / 4)) * 0.8 + 0.2}\n"
        "              uMin={0} uMax={1} uSteps={1}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={RED} strokeWidth={1.5} opacity={0.7}\n"
        "            />\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(u, _v) => (u * u) / (R2 * R2) * 3}\n"
        "              uMin={R1} uMax={R2} uSteps={8}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={ORANGE} strokeWidth={0.9} opacity={0.55}\n"
        "            />\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(_u, _v) => 0}\n"
        "              uMin={R1} uMax={R2} uSteps={4}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={ACCENT} strokeWidth={0.7} opacity={0.3}\n"
        "            />\n"
        "          </CoordinateSystem3D>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 6: 总结 ── */}",
        "Stage5 block"
    )

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec07_IM_CNC.tsx  (Ch10)
# ──────────────────────────────────────────────────────────────
def fix_sec07():
    path = 'src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx'
    c = read(path)

    # 1. Insert CS3D opening inside the nested <div> in Stage 4
    c = apply(c,
        "                <div>\n"
        "                {/* 上方抛物面",
        "                <div>\n"
        "                <CoordinateSystem3D\n"
        "                  center={[380, 310]}\n"
        "                  scale={65}\n"
        "                  xRange={[-2.5, 2.5]}\n"
        "                  yRange={[-2.5, 2.5]}\n"
        "                  zRange={[0, 4.5]}\n"
        "                  showGrid\n"
        "                  width={760}\n"
        "                  height={540}\n"
        "                >\n"
        "                {/* 上方抛物面",
        "Stage4 CS3D opening"
    )

    # 2. Insert Stage 5 before Stage 6
    c = apply(c,
        "      {/* ── Stage 6: 总结 ── */}",
        "      {/* ── Stage 5: 3D 旋转可视化 ── */}\n"
        "      {scene === 5 && (\n"
        "        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>\n"
        "          <div style={{ color: CYAN, fontSize: 28, fontWeight: 'bold' }}>\n"
        "            🌐 铸件三维形状旋转展示\n"
        "          </div>\n"
        "          <CoordinateSystem3D\n"
        "            center={[380, 310]}\n"
        "            scale={65}\n"
        "            xRange={[-2.5, 2.5]}\n"
        "            yRange={[-2.5, 2.5]}\n"
        "            zRange={[0, 4.5]}\n"
        "            showGrid\n"
        "            width={760}\n"
        "            height={540}\n"
        "            rotationY={rotateY * Math.PI / 180}\n"
        "            rotationX={Math.PI / 6}\n"
        "          >\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(u, _v) => 4 - u * u}\n"
        "              uMin={0} uMax={SQRT2} uSteps={10}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={ACCENT} strokeWidth={0.9} opacity={topSurfOp}\n"
        "            />\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(u, _v) => u * u}\n"
        "              uMin={0} uMax={SQRT2} uSteps={10}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={ORANGE} strokeWidth={0.9} opacity={botSurfOp}\n"
        "            />\n"
        "          </CoordinateSystem3D>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 6: 总结 ── */}",
        "Stage5 block"
    )

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec10_IM_Field.tsx  (Ch11)
# ──────────────────────────────────────────────────────────────
def fix_sec10_field():
    path = 'src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx'
    c = read(path)

    # 1. Insert CS3D opening in Stage 4
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "              {/* 椭圆线圈",
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[420, 310]}\n"
        "                 scale={1200}\n"
        "                 xRange={[-0.18, 0.18]}\n"
        "                 yRange={[-0.18, 0.18]}\n"
        "                 zRange={[-0.15, 0.15]}\n"
        "                 showGrid={false}\n"
        "                 width={820}\n"
        "                 height={560}\n"
        "               >\n"
        "               {/* 椭圆线圈",
        "Stage4 CS3D opening"
    )

    # 2. Insert Stage 5 before Stage 6
    c = apply(c,
        "      {/* ── Stage 6: 工程总结 ── */}",
        "      {/* ── Stage 5: 3D 旋转可视化 ── */}\n"
        "      {scene === 5 && (\n"
        "        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>\n"
        "          <div style={{ color: MAGENTA, fontSize: 28, fontWeight: 'bold' }}>\n"
        "            🌐 椭圆线圈与变化磁场 3D 旋转展示\n"
        "          </div>\n"
        "          <CoordinateSystem3D\n"
        "            center={[420, 310]}\n"
        "            scale={1200}\n"
        "            xRange={[-0.18, 0.18]}\n"
        "            yRange={[-0.18, 0.18]}\n"
        "            zRange={[-0.15, 0.15]}\n"
        "            showGrid={false}\n"
        "            width={820}\n"
        "            height={560}\n"
        "            rotationY={rotateY * Math.PI / 180}\n"
        "            rotationX={Math.PI / 6}\n"
        "          >\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => a * u * Math.cos(v)}\n"
        "              y={(u, v) => b * u * Math.sin(v)}\n"
        "              z={(_u, _v) => 0}\n"
        "              uMin={0} uMax={1} uSteps={8}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={24}\n"
        "              color={MAGENTA} strokeWidth={1} opacity={0.5}\n"
        "            />\n"
        "            <AnimatedVector3D\n"
        "              from={[0, 0, -0.06]}\n"
        "              to={[0, 0, cosPhi > 0 ? 0.12 : -0.12]}\n"
        "              color={fieldColor}\n"
        "              strokeWidth={4}\n"
        "              opacity={Math.max(0.2, fieldOpacity)}\n"
        "              label='B'\n"
        "            />\n"
        "          </CoordinateSystem3D>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 6: 工程总结 ── */}",
        "Stage5 block"
    )

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec09_IM_Flow.tsx  (Ch11)
# Broken CS3D in Stage 2 ExampleBox; ExampleBox not closed;
# Stages 3-5 missing.
# ──────────────────────────────────────────────────────────────
def fix_sec09_flow():
    path = 'src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx'
    c = read(path)

    # 1. Insert CS3D opening inside the inner div of Stage 2's ExampleBox
    c = apply(c,
        "            <div style={{ padding: '8px 0', fontSize: 22, color: TEXT, lineHeight: 1.8 }}>\n"
        "              {/* 圆管截面圆盘",
        "            <div style={{ padding: '8px 0', fontSize: 22, color: TEXT, lineHeight: 1.8 }}>\n"
        "              <CoordinateSystem3D\n"
        "                center={[380, 300]}\n"
        "                scale={55}\n"
        "                xRange={[-1.5, 1.5]}\n"
        "                yRange={[-1.5, 1.5]}\n"
        "                zRange={[0, 2.5]}\n"
        "                showGrid={false}\n"
        "                width={760}\n"
        "                height={520}\n"
        "              >\n"
        "              {/* 圆管截面圆盘",
        "Stage2 CS3D opening"
    )

    # 2. Fix closing: </CoordinateSystem3D> + </div> + add </ExampleBox>
    # The </CoordinateSystem3D> at 12 spaces needs to be at 14, and </div> adjusted
    c = apply(c,
        "            </CoordinateSystem3D>\n"
        "          </div>\n"
        "          <div style={{ fontSize: 20, color: TEXT, textAlign: 'center' }}>",
        "              </CoordinateSystem3D>\n"
        "            </div>\n"
        "          </ExampleBox>\n"
        "          <div style={{ fontSize: 20, color: TEXT, textAlign: 'center' }}>",
        "ExampleBox closing + indent fix"
    )

    # 3. Add Stages 3-5 before Stage 6
    c = apply(c,
        "      {/* ── Stage 6: 工程总结 ── */}",
        "      {/* ── Stage 3: 分步计算 ── */}\n"
        "      {scene === 3 && (\n"
        "        <div style={{ opacity: fade(frame, 150, 20), width: 1100, display: 'flex', flexDirection: 'column', gap: 18 }}>\n"
        "          <div style={{ color: CYAN, fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>📐 哈根-泊肃叶流量推导</div>\n"
        "          <div style={{ fontSize: 24, color: TEXT, lineHeight: 1.9 }}>\n"
        "            速度分布：\n"
        "            <span dangerouslySetInnerHTML={{ __html: math('v(r) = v_0\\\\left(1-\\\\dfrac{r^2}{R^2}\\\\right)') }} />\n"
        "          </div>\n"
        "          <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.9, marginTop: 8 }}>\n"
        "            流量公式：\n"
        "            <span dangerouslySetInnerHTML={{ __html: math('Q = \\\\iint_S v\\\\,dS = \\\\int_0^R v(r)\\\\cdot 2\\\\pi r\\\\,dr = \\\\dfrac{\\\\pi v_0 R^2}{2}') }} />\n"
        "          </div>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 4: 关键结论 ── */}\n"
        "      {scene === 4 && (\n"
        "        <div style={{ opacity: fade(frame, 330, 25), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>\n"
        "          <TheoremBox title='哈根-泊肃叶流量公式' width={900} opacity={1}>\n"
        "            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 34, color: FORMULA }}>\n"
        "              <span dangerouslySetInnerHTML={{ __html: math('Q = \\\\dfrac{\\\\pi v_0 R^2}{2}', true) }} />\n"
        "            </div>\n"
        "            <div style={{ fontSize: 22, color: TEXT, textAlign: 'center', marginTop: 8 }}>\n"
        "              v₀ = 管轴最大流速，R = 管道半径\n"
        "            </div>\n"
        "          </TheoremBox>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 5: 3D 旋转可视化 ── */}\n"
        "      {scene === 5 && (\n"
        "        <div style={{ opacity: fade(frame, 390, 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>\n"
        "          <div style={{ color: CYAN, fontSize: 28, fontWeight: 'bold' }}>\n"
        "            🌐 管道流速剖面 3D 旋转展示\n"
        "          </div>\n"
        "          <CoordinateSystem3D\n"
        "            center={[380, 300]}\n"
        "            scale={55}\n"
        "            xRange={[-1.5, 1.5]}\n"
        "            yRange={[-1.5, 1.5]}\n"
        "            zRange={[0, 2.5]}\n"
        "            showGrid={false}\n"
        "            width={760}\n"
        "            height={520}\n"
        "            rotationY={rotateY * Math.PI / 180}\n"
        "            rotationX={Math.PI / 6}\n"
        "          >\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(u, _v) => Math.max(0, 2 * (1 - (u * u) / (R * R)))}\n"
        "              uMin={0} uMax={R} uSteps={10}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={20}\n"
        "              color={CYAN} strokeWidth={1} opacity={0.55}\n"
        "            />\n"
        "            <ParametricCurve3D\n"
        "              x={(t) => R * Math.cos(t)}\n"
        "              y={(t) => R * Math.sin(t)}\n"
        "              z={(_t) => 0}\n"
        "              tMin={0} tMax={2 * Math.PI} segments={40}\n"
        "              color={ORANGE} strokeWidth={3}\n"
        "            />\n"
        "          </CoordinateSystem3D>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 6: 工程总结 ── */}",
        "Stages3-5 blocks"
    )

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec05_Examples.tsx  (Ch10)
# ──────────────────────────────────────────────────────────────
def fix_sec05_examples():
    path = 'src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx'
    c = read(path)

    # === Example 1: Stage 4 CS3D + Stage 5 ===
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "                {/* 锥面 z = r = √(x²+y²)",
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[400, 300]}\n"
        "                 scale={70}\n"
        "                 xRange={[-3, 3]}\n"
        "                 yRange={[-3, 3]}\n"
        "                 zRange={[0, 4]}\n"
        "                 showGrid\n"
        "                 width={800}\n"
        "                 height={560}\n"
        "               >\n"
        "                {/* 锥面 z = r = √(x²+y²)",
        "Example1 Stage4 CS3D opening"
    )

    c = apply(c,
        "      {/* ── Stage 6: 总结 ── */}\n"
        "      {scene === 6 && (\n"
        "        <div style={{ opacity: s6Op, width: 960",
        "      {/* ── Stage 5: 3D 可视化 ── */}\n"
        "      {scene === 5 && (\n"
        "        <div style={{ opacity: s5Op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>\n"
        "          <div style={{ color: ACCENT, fontSize: 28, fontWeight: 'bold' }}>\n"
        "            🌐 3D 可视化：锥面 z=√(x²+y²) 旋转展示\n"
        "          </div>\n"
        "          <CoordinateSystem3D\n"
        "            center={[400, 300]}\n"
        "            scale={70}\n"
        "            xRange={[-3, 3]}\n"
        "            yRange={[-3, 3]}\n"
        "            zRange={[0, 4]}\n"
        "            showGrid\n"
        "            width={800}\n"
        "            height={560}\n"
        "            rotationY={rotateY * Math.PI / 180}\n"
        "            rotationX={Math.PI / 6}\n"
        "          >\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(u, _v) => u}\n"
        "              uMin={0} uMax={2} uSteps={10}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={20}\n"
        "              color={ACCENT} strokeWidth={0.8} opacity={0.55}\n"
        "            />\n"
        "            <SurfaceMesh3D\n"
        "              x={(u, v) => u * Math.cos(v)}\n"
        "              y={(u, v) => u * Math.sin(v)}\n"
        "              z={(_u, _v) => 0}\n"
        "              uMin={0} uMax={2} uSteps={6}\n"
        "              vMin={0} vMax={2 * Math.PI} vSteps={20}\n"
        "              color={PURPLE} strokeWidth={0.6} opacity={0.3}\n"
        "            />\n"
        "          </CoordinateSystem3D>\n"
        "        </div>\n"
        "      )}\n"
        "\n"
        "      {/* ── Stage 6: 总结 ── */}\n"
        "      {scene === 6 && (\n"
        "        <div style={{ opacity: s6Op, width: 960",
        "Example1 Stage5 block"
    )

    # === Example 2: Remove remaining rotateY wrapper ===
    # Find the remaining rotateY wrapper and remove it
    # Current: <div style={{ transform: `rotateY(${rotateY}deg)` }}>
    #          <CoordinateSystem3D ... rotationY=... rotationX=... > ... </CoordinateSystem3D>
    #          </div>
    # After: just CoordinateSystem3D without wrapper
    old_wrapper = "            <div style={{ transform: `rotateY(${rotateY}deg)` }}>\n"
    if old_wrapper in c:
        # Remove wrapper opening
        c = c.replace(old_wrapper, "", 1)
        # Find and remove the matching </div> after </CoordinateSystem3D>
        # The wrapper was at 12 spaces, so its closing is also at 12 spaces
        # But we need to find the right one (after CoordinateSystem3D)
        import re
        # Use a more targeted approach: find the specific pattern
        c = re.sub(
            r'(              </CoordinateSystem3D>\n)            </div>\n',
            r'\1',
            c, count=1
        )
        print('  [ok] Example2 rotateY wrapper removed')
    else:
        print('  [MISS] Example2 rotateY wrapper')

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec08_Examples.tsx  (Ch11)
# Example 1 & 3: Stage 4 CS3D broken
# Example 2: Stage 5 rotateY wrapper present
# ──────────────────────────────────────────────────────────────
def fix_sec08_ch11():
    path = 'src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx'
    c = read(path)

    # Example 1 Stage 4: Add CS3D opening before ParametricCurve3D
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "              {/* 抛物线路径",
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[400, 300]}\n"
        "                 scale={55}\n"
        "                 xRange={[-0.5, 1.5]}\n"
        "                 yRange={[-0.2, 1.2]}\n"
        "                 zRange={[0, 0.5]}\n"
        "                 showGrid={false}\n"
        "                 width={800}\n"
        "                 height={560}\n"
        "               >\n"
        "              {/* 抛物线路径",
        "Example1 Stage4 CS3D opening"
    )

    # Example 2: Remove rotateY wrapper from Stage 5
    old_wrapper2 = "          <div style={{ transform: `rotateY(${rotateY}deg)` }}>\n"
    if old_wrapper2 in c:
        c = c.replace(old_wrapper2, "", 1)
        import re
        # Remove the matching </div> after </CoordinateSystem3D>
        c = re.sub(
            r'(            </CoordinateSystem3D>\n)          </div>\n',
            r'\1',
            c, count=1
        )
        print('  [ok] Example2 rotateY wrapper removed')
    else:
        print('  [MISS] Example2 rotateY wrapper')

    # Example 3 Stage 4: Add CS3D opening before SurfaceMesh3D (ball)
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "              {/* 单位球面",
        "            <div style={{ textAlign: 'center', padding: '20px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[400, 300]}\n"
        "                 scale={80}\n"
        "                 xRange={[-2, 2]}\n"
        "                 yRange={[-2, 2]}\n"
        "                 zRange={[-2, 2]}\n"
        "                 showGrid={false}\n"
        "                 width={800}\n"
        "                 height={560}\n"
        "               >\n"
        "              {/* 单位球面",
        "Example3 Stage4 CS3D opening"
    )

    write(path, c)


# ──────────────────────────────────────────────────────────────
# Sec08_Examples.tsx  (Ch12)
# Example 2: Stage 4 CS3D broken (ParametricCurve3D children)
# ──────────────────────────────────────────────────────────────
def fix_sec08_ch12():
    path = 'src/compositions/Ch12_Series/Sec08_Examples.tsx'
    c = read(path)

    # Example 2 Stage 4: Add CS3D before ParametricCurve3D (e^x curve)
    c = apply(c,
        "            <div style={{ textAlign: 'center', padding: '16px 0' }}>\n"
        "              {/* 精确 e^x 曲线",
        "            <div style={{ textAlign: 'center', padding: '16px 0' }}>\n"
        "               <CoordinateSystem3D\n"
        "                 center={[400, 300]}\n"
        "                 scale={60}\n"
        "                 xRange={[-1.5, 2]}\n"
        "                 yRange={[-1, 10]}\n"
        "                 zRange={[0, 1]}\n"
        "                 showGrid={false}\n"
        "                 width={800}\n"
        "                 height={560}\n"
        "               >\n"
        "              {/* 精确 e^x 曲线",
        "Example2 Stage4 CS3D opening"
    )

    write(path, c)


def main():
    print('=== Repairing broken files ===\n')

    print('[Sec06_IM_Mass.tsx (Ch10)]')
    fix_sec06()

    print('\n[Sec07_IM_CNC.tsx (Ch10)]')
    fix_sec07()

    print('\n[Sec10_IM_Field.tsx (Ch11)]')
    fix_sec10_field()

    print('\n[Sec09_IM_Flow.tsx (Ch11)]')
    fix_sec09_flow()

    print('\n[Sec05_Examples.tsx (Ch10)]')
    fix_sec05_examples()

    print('\n[Sec08_Examples.tsx (Ch11)]')
    fix_sec08_ch11()

    print('\n[Sec08_Examples.tsx (Ch12)]')
    fix_sec08_ch12()

    print('\n=== Repair complete ===')


if __name__ == '__main__':
    main()
