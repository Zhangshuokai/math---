import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * 全屏45度细密水印组件
 * 颜色浅、文字小而密，版权归属水印
 */
export const WatermarkOverlay: React.FC = () => {
  const text = "张硕凯 WX：zhangsk1109";
  const rowCount = 40;
  const colCount = 14;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {/* 将整个区域放大后旋转-45度，形成细密斜向水印 */}
      <div
        style={{
          position: "absolute",
          top: "-60%",
          left: "-60%",
          width: "220%",
          height: "220%",
          transform: "rotate(-45deg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 80,
              marginBottom: 52,
              whiteSpace: "nowrap",
              paddingLeft: rowIndex % 2 === 0 ? 0 : 160,
            }}
          >
            {Array.from({ length: colCount }).map((_, colIndex) => (
              <span
                key={colIndex}
                style={{
                  color: "rgba(255, 255, 255, 0.10)",
                  fontSize: 15,
                  fontWeight: 400,
                  fontFamily: "PingFang SC, Microsoft YaHei, sans-serif",
                  letterSpacing: 1.5,
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 高阶组件：为任意 Remotion 组件添加水印覆盖层
 * 使用方式：const Wrapped = withWatermark(MyComponent);
 */
export function withWatermark<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WrappedWithWatermark: React.FC<P> = (props) => (
    <AbsoluteFill>
      <Component {...props} />
      <WatermarkOverlay />
    </AbsoluteFill>
  );
  WrappedWithWatermark.displayName = `WithWatermark(${Component.displayName || Component.name || "Component"})`;
  return WrappedWithWatermark;
}
