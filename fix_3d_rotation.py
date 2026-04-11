#!/usr/bin/env python3
"""
Fix CSS rotateY wrappers: replace with CoordinateSystem3D rotationY/rotationX props.

Handles two forms of rotateY wrapper div:
  Form A (single-line):
    <div style={{ transform: `rotateY(${rotateY}deg)`, ... }}>

  Form B (multi-line):
    <div
      style={{
        transform: `rotateY(${rotateY}deg)`,
        ...
      }}
    >

Also fixes Sec11_IM_Control.tsx custom toISO to use rotation matrices.
"""

import re
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Files with standard CoordinateSystem3D wrapping pattern
STANDARD_FILES = [
    'src/compositions/Ch07_DifferentialEq/Sec10_Examples.tsx',
    'src/compositions/Ch07_DifferentialEq/Sec12_IM_Dynamics.tsx',
    'src/compositions/Ch08_VectorGeometry/Sec07_Examples.tsx',
    'src/compositions/Ch08_VectorGeometry/Sec08_IM_RobotArm.tsx',
    'src/compositions/Ch08_VectorGeometry/Sec09_IM_CNC.tsx',
    'src/compositions/Ch09_MultiVariable/Sec09_Examples.tsx',
    'src/compositions/Ch09_MultiVariable/Sec10_IM_Optimization.tsx',
    'src/compositions/Ch09_MultiVariable/Sec11_IM_Sensor.tsx',
    'src/compositions/Ch10_MultipleIntegral/Sec05_Examples.tsx',
    'src/compositions/Ch10_MultipleIntegral/Sec06_IM_Mass.tsx',
    'src/compositions/Ch10_MultipleIntegral/Sec07_IM_CNC.tsx',
    'src/compositions/Ch11_LineAndSurface/Sec08_Examples.tsx',
    'src/compositions/Ch11_LineAndSurface/Sec09_IM_Flow.tsx',
    'src/compositions/Ch11_LineAndSurface/Sec10_IM_Field.tsx',
    'src/compositions/Ch12_Series/Sec08_Examples.tsx',
    'src/compositions/Ch12_Series/Sec09_IM_Signal.tsx',
    'src/compositions/Ch12_Series/Sec10_IM_Approx.tsx',
]

ROTATE_Y_RE = re.compile(r'transform:\s*`rotateY\(\$\{rotateY\}deg\)`')


def get_indent(line: str) -> str:
    """Return leading whitespace of a line."""
    return line[:len(line) - len(line.lstrip())]


def handle_cs3d_and_closing(lines, i, new_lines, rotateY_indent):
    """
    After removing the rotateY wrapper opening tag, this helper:
      1. Finds <CoordinateSystem3D and injects rotation props before the standalone '>'.
      2. Keeps all children until </CoordinateSystem3D>.
      3. Removes the one </div> at the same indentation as the original rotateY wrapper.
    Returns updated (i, new_lines).
    """
    # ── 1. Advance to <CoordinateSystem3D ──────────────────────────────────────
    while i < len(lines) and '<CoordinateSystem3D' not in lines[i]:
        new_lines.append(lines[i])
        i += 1

    if i >= len(lines):
        return i, new_lines

    # ── 2. Collect CoordinateSystem3D opening-tag lines until standalone '>' ───
    cs3d_tag_lines = []
    while i < len(lines):
        cs_line = lines[i]
        i += 1
        if cs_line.strip() == '>':
            close_indent = get_indent(cs_line)
            # Inject rotation props BEFORE the '>'
            cs3d_tag_lines.append(
                f'{close_indent}rotationY={{rotateY * Math.PI / 180}}\n'
            )
            cs3d_tag_lines.append(
                f'{close_indent}rotationX={{Math.PI / 6}}\n'
            )
            cs3d_tag_lines.append(cs_line)
            break
        else:
            cs3d_tag_lines.append(cs_line)

    new_lines.extend(cs3d_tag_lines)

    # ── 3. Keep lines until </CoordinateSystem3D> ──────────────────────────────
    while i < len(lines):
        new_lines.append(lines[i])
        if '</CoordinateSystem3D>' in lines[i]:
            i += 1
            break
        i += 1

    # ── 4. Skip the closing </div> of the rotateY wrapper ──────────────────────
    # The very next </div> at the same indent level as the rotateY wrapper is removed.
    while i < len(lines):
        nxt = lines[i]
        nxt_stripped = nxt.strip()
        if nxt_stripped == '</div>':
            if get_indent(nxt) == rotateY_indent:
                i += 1  # remove it
            else:
                new_lines.append(nxt)
                i += 1
            break
        elif nxt_stripped == '':
            new_lines.append(nxt)
            i += 1
        else:
            # Non-div content encountered; keep it and stop
            new_lines.append(nxt)
            i += 1
            break

    return i, new_lines


def process_standard_file(filepath: str) -> int:
    """
    Remove CSS rotateY wrapper divs and add rotationY/rotationX to CoordinateSystem3D.
    Returns the number of wrappers removed.
    """
    full_path = os.path.join(BASE_DIR, filepath)
    with open(full_path, 'r') as f:
        lines = f.readlines()

    new_lines = []
    i = 0
    changes = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # ── Form A: single-line rotateY wrapper ────────────────────────────────
        # e.g. <div style={{ transform: `rotateY(${rotateY}deg)` }}>
        if (stripped.startswith('<div')
                and ROTATE_Y_RE.search(line)
                and stripped.endswith('>')):
            rotateY_indent = get_indent(line)
            i += 1
            changes += 1
            i, new_lines = handle_cs3d_and_closing(lines, i, new_lines, rotateY_indent)
            continue

        # ── Form B: multi-line rotateY wrapper ─────────────────────────────────
        # The <div is on its own line; look-ahead to check for transform: rotateY
        # before the standalone '>' that closes the opening tag.
        if stripped.startswith('<div') and not stripped.endswith('>'):
            # Look ahead to find the closing '>' of this tag
            rotateY_indent = get_indent(line)
            j = i + 1
            found_rotate = False
            tag_close_idx = i  # fallback
            while j < len(lines):
                if ROTATE_Y_RE.search(lines[j]):
                    found_rotate = True
                if lines[j].strip() == '>':
                    tag_close_idx = j
                    break
                j += 1

            if found_rotate:
                # Skip all lines from the <div to the closing >
                i = tag_close_idx + 1
                changes += 1
                i, new_lines = handle_cs3d_and_closing(
                    lines, i, new_lines, rotateY_indent
                )
                continue

        # ── Default: keep line as-is ────────────────────────────────────────────
        new_lines.append(line)
        i += 1

    with open(full_path, 'w') as f:
        f.writelines(new_lines)

    print(f'[OK] {filepath}: {changes} rotateY wrapper(s) removed')
    return changes


def process_sec11_control(
    filepath='src/compositions/Ch07_DifferentialEq/Sec11_IM_Control.tsx',
):
    """
    Special case: Sec11_IM_Control uses a custom toISO and CSS rotateY around an SVG.

    Changes:
      1. Replace the fixed isometric toISO with a rotation-matrix toISO.
      2. Remove the two CSS wrapper divs (perspective + rotateY) around the SVG.
    """
    full_path = os.path.join(BASE_DIR, filepath)
    with open(full_path, 'r') as f:
        content = f.read()

    # ── 1. Replace fixed toISO with rotation-matrix version ───────────────────
    old_toiso = (
        '  // 等轴测投影\n'
        '  const COS30 = Math.sqrt(3) / 2;\n'
        '  const SIN30 = 0.5;\n'
        '  const toISO = (x: number, y: number, z: number) => ({\n'
        '    svgX: cx + (x - y) * COS30 * scale,\n'
        '    svgY: cy + (x + y) * SIN30 * scale - z * scale,\n'
        '  });\n'
    )
    new_toiso = (
        '  // 旋转矩阵投影（绕Y轴方位角 + 绕X轴俯仰角，最后正交投影）\n'
        '  const rotY_rad = rotateY * Math.PI / 180;\n'
        '  const rotX_rad = Math.PI / 6; // 30° 俯角\n'
        '  const toISO = (x: number, y: number, z: number) => {\n'
        '    const x1 = x * Math.cos(rotY_rad) + z * Math.sin(rotY_rad);\n'
        '    const y1 = y;\n'
        '    const z1 = -x * Math.sin(rotY_rad) + z * Math.cos(rotY_rad);\n'
        '    const x2 = x1;\n'
        '    const y2 = y1 * Math.cos(rotX_rad) - z1 * Math.sin(rotX_rad);\n'
        '    return { svgX: cx + x2 * scale, svgY: cy - y2 * scale };\n'
        '  };\n'
    )

    if old_toiso in content:
        content = content.replace(old_toiso, new_toiso)
        print(f'[OK] {filepath}: replaced toISO with rotation-matrix version')
    else:
        print(f'  WARNING: Could not find expected toISO pattern in {filepath}')

    # ── 2. Remove the CSS wrapper divs around the SVG ─────────────────────────
    # Pattern to remove:
    #   <div style={{ perspective: "1000px", display: "flex", justifyContent: "center" }}>
    #     <div style={{ transform: `rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}>
    old_wrapper_open = (
        '    <div style={{ perspective: "1000px", display: "flex", justifyContent: "center" }}>\n'
        '      <div style={{ transform: `rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}>\n'
    )
    new_wrapper_open = ''

    # The two corresponding closing divs (exactly one occurrence)
    old_wrapper_close = (
        '      </div>\n'
        '    </div>\n'
    )
    new_wrapper_close = ''

    if old_wrapper_open in content:
        content = content.replace(old_wrapper_open, new_wrapper_open)
        content = content.replace(old_wrapper_close, new_wrapper_close, 1)
        print(f'[OK] {filepath}: removed perspective+rotateY CSS wrapper divs')
    else:
        print(f'  WARNING: Could not find expected CSS wrapper pattern in {filepath}')

    with open(full_path, 'w') as f:
        f.write(content)


def main():
    total_changes = 0

    print('=== Processing standard CoordinateSystem3D files ===')
    for f in STANDARD_FILES:
        total_changes += process_standard_file(f)

    print('\n=== Processing Sec11_IM_Control.tsx (special case) ===')
    process_sec11_control()

    print(
        f'\n=== Done: {total_changes} rotateY CSS wrappers removed '
        f'across {len(STANDARD_FILES)} files ==='
    )


if __name__ == '__main__':
    main()
