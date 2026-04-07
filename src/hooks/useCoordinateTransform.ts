import { useMemo } from "react";
import { createCoordinateTransform } from "../utils/pathUtils";

interface CoordinateTransformOptions {
  svgWidth: number;
  svgHeight: number;
  xRange: [number, number];
  yRange: [number, number];
}

export const useCoordinateTransform = ({
  svgWidth,
  svgHeight,
  xRange,
  yRange,
}: CoordinateTransformOptions) => {
  return useMemo(
    () => createCoordinateTransform(svgWidth, svgHeight, xRange, yRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svgWidth, svgHeight, xRange[0], xRange[1], yRange[0], yRange[1]]
  );
};
