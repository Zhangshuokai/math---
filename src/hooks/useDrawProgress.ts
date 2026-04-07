import { useCurrentFrame, interpolate, Easing } from "remotion";

interface DrawProgressOptions {
  startFrame: number;
  endFrame: number;
  easing?: (t: number) => number;
}

export const useDrawProgress = ({
  startFrame,
  endFrame,
  easing = Easing.inOut(Easing.ease),
}: DrawProgressOptions): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};
