import { interpolate } from 'remotion';

/**
 * fade(frame, start, duration=30): 从 start 帧开始，持续 duration 帧渐入
 * 在 [start, start+duration] 帧范围内，从 0 平滑插值到 1（双向钳制）
 */
export const fade = (frame: number, start: number, duration = 30): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * fadeToEnd(frame, start, end): 保留旧语义，从 start 到 end 渐入
 * 在 [start, end] 帧范围内，从 0 平滑插值到 1（双向钳制）
 */
export const fadeToEnd = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * 在 [start, end] 帧范围内，从 from 平滑插值到 to（双向钳制）
 */
export const lerp = (frame: number, start: number, end: number, from: number, to: number): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * 判断某帧是否已到达指定帧（用于条件显示）
 */
export const isVisible = (frame: number, fromFrame: number): boolean => frame >= fromFrame;

/**
 * 步进显示：currentStep >= targetStep 时返回1，否则0
 */
export const stepOpacity = (currentStep: number, targetStep: number): number =>
  currentStep >= targetStep ? 1 : 0;

/**
 * 弹性淡入：在 [start, end] 帧从 0 到 1，加入轻微过冲效果
 */
export const springFade = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  });
