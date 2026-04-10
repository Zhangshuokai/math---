import { interpolate } from 'remotion';

export interface ExampleTimelineConfig {
  frame: number;
  titleDuration?: number;    // 标题展示时长，默认 90 帧
  exampleDuration?: number;  // 例题展示时长，默认 120 帧
  animDuration?: number;     // 动画演示时长，默认 180 帧
  summaryDuration?: number;  // 总结时长，默认 90 帧
  maxSteps?: number;         // 最大步骤数（用于计算 stepIndex），默认 4
}

export interface ExampleTimelineResult {
  titleOpacity: number;
  exampleOpacity: number;
  animProgress: number;      // 动画演示阶段的进度 0→1
  summaryOpacity: number;
  currentPhase: 'title' | 'example' | 'animation' | 'summary';
  stepIndex: number;         // 当前应显示的步骤数（基于 animProgress）
}

/**
 * 标准化例题的帧时序 Hook。
 *
 * 时序阶段边界（帧）：
 *   - 标题阶段：[0, titleDuration)
 *   - 例题阶段：[titleDuration, titleDuration + exampleDuration)
 *   - 动画阶段：[titleDuration + exampleDuration, titleDuration + exampleDuration + animDuration)
 *   - 总结阶段：[titleDuration + exampleDuration + animDuration, ...]
 */
export function useExampleTimeline({
  frame,
  titleDuration = 90,
  exampleDuration = 120,
  animDuration = 180,
  summaryDuration = 90,
  maxSteps = 4,
}: ExampleTimelineConfig): ExampleTimelineResult {
  const t0 = 0;
  const t1 = titleDuration;
  const t2 = t1 + exampleDuration;
  const t3 = t2 + animDuration;
  const t4 = t3 + summaryDuration;

  // 各阶段淡入时长（帧）
  const FADE_IN = 20;

  // 标题透明度：在 [t0, t0+FADE_IN] 淡入，在 [t1, t1+FADE_IN] 淡出
  const titleFadeIn = interpolate(frame, [t0, t0 + FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleFadeOut = interpolate(frame, [t1, t1 + FADE_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = Math.min(titleFadeIn, titleFadeOut);

  // 例题透明度：在 [t1, t1+FADE_IN] 淡入，在 [t2, t2+FADE_IN] 淡出
  const exampleFadeIn = interpolate(frame, [t1, t1 + FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exampleFadeOut = interpolate(frame, [t2, t2 + FADE_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exampleOpacity = Math.min(exampleFadeIn, exampleFadeOut);

  // 动画演示阶段进度：在 [t2, t3] 从 0 到 1
  const animProgress = interpolate(frame, [t2, t3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 总结透明度：在 [t3, t3+FADE_IN] 淡入
  const summaryOpacity = interpolate(frame, [t3, t3 + FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 当前阶段判断
  let currentPhase: ExampleTimelineResult['currentPhase'];
  if (frame < t1) {
    currentPhase = 'title';
  } else if (frame < t2) {
    currentPhase = 'example';
  } else if (frame < t3) {
    currentPhase = 'animation';
  } else {
    currentPhase = 'summary';
  }

  // 基于 animProgress 计算当前显示的步骤数
  // animProgress 在 [0,1] 均匀分配给 maxSteps 个步骤
  const stepIndex = Math.min(
    maxSteps,
    Math.floor(animProgress * maxSteps) + (frame >= t3 ? maxSteps : 0)
  );

  // 总结阶段显示所有步骤
  const finalStepIndex = currentPhase === 'summary' ? maxSteps : stepIndex;

  return {
    titleOpacity,
    exampleOpacity,
    animProgress,
    summaryOpacity,
    currentPhase,
    stepIndex: finalStepIndex,
  };
}
