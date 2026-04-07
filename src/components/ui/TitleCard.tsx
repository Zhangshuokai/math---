import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../constants/colorTheme";

export interface TitleCardProps {
  chapterNum: string;
  chapterTitle: string;
  sectionNum?: string;
  sectionTitle?: string;
  opacity?: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  chapterNum,
  chapterTitle,
  sectionNum,
  sectionTitle,
  opacity = 1,
}) => {
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 24,
      opacity,
    }}>
      <div style={{ color: COLORS.primaryCurve, fontSize: 28, fontFamily: "monospace" }}>
        第{chapterNum}章
      </div>
      <div style={{ color: COLORS.formula, fontSize: 56, fontWeight: "bold", textAlign: "center" }}>
        {chapterTitle}
      </div>
      {sectionNum && (
        <div style={{
          color: COLORS.annotation,
          fontSize: 36,
          borderTop: `1px solid ${COLORS.axis}`,
          paddingTop: 16,
          marginTop: 8,
        }}>
          §{sectionNum} {sectionTitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
