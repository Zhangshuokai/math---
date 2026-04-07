import React from "react";
import { Composition, AbsoluteFill } from "remotion";
import { VIDEO_CONFIG } from "./constants/videoConfig";

// 第七章实装组件
import Sec01Intro from "./compositions/Ch07_DifferentialEq/Sec01_Intro";
import Sec02Separable from "./compositions/Ch07_DifferentialEq/Sec02_Separable";
import Sec04Linear from "./compositions/Ch07_DifferentialEq/Sec04_Linear";
import Sec08ConstCoeff from "./compositions/Ch07_DifferentialEq/Sec08_ConstCoeff";
import Sec09NonHomog from "./compositions/Ch07_DifferentialEq/Sec09_NonHomog";

// 临时占位组件
const PlaceholderComp: React.FC<{ title: string }> = ({ title }) => (
  <AbsoluteFill style={{ backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
    <div style={{ color: "#ffffff", fontSize: 48 }}>{title}</div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 第七章：微分方程 */}
      <Composition id="Ch07_Sec01_Intro" component={Sec01Intro}
        durationInFrames={450} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec02_Separable" component={Sec02Separable}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec03_Homogeneous" component={() => <PlaceholderComp title="7.3 齐次方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec04_Linear" component={Sec04Linear}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec05_Exact" component={() => <PlaceholderComp title="7.5 全微分方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec06_HighOrder" component={() => <PlaceholderComp title="7.6 可降阶高阶方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec07_Linear2" component={() => <PlaceholderComp title="7.7 高阶线性方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec08_ConstCoeff" component={Sec08ConstCoeff}
        durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07_Sec09_NonHomog" component={Sec09NonHomog}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第八章：空间解析几何与向量代数 */}
      <Composition id="Ch08_Sec01_Vectors" component={() => <PlaceholderComp title="8.1 向量及其线性运算" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08_Sec02_Products" component={() => <PlaceholderComp title="8.2 数量积向量积混合积" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08_Sec03_Surfaces" component={() => <PlaceholderComp title="8.3 曲面及其方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08_Sec04_Curves" component={() => <PlaceholderComp title="8.4 空间曲线及其方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08_Sec05_Plane" component={() => <PlaceholderComp title="8.5 平面及其方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08_Sec06_Line" component={() => <PlaceholderComp title="8.6 空间直线及其方程" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第九章：多元函数微分法 */}
      <Composition id="Ch09_Sec01_Concept" component={() => <PlaceholderComp title="9.1 多元函数基本概念" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec02_Partial" component={() => <PlaceholderComp title="9.2 偏导数" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec03_Total" component={() => <PlaceholderComp title="9.3 全微分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec04_Chain" component={() => <PlaceholderComp title="9.4 复合函数求导" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec05_Implicit" component={() => <PlaceholderComp title="9.5 隐函数求导" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec06_Geometry" component={() => <PlaceholderComp title="9.6 几何应用" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec07_Gradient" component={() => <PlaceholderComp title="9.7 方向导数与梯度" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09_Sec08_Extremum" component={() => <PlaceholderComp title="9.8 多元函数极值" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十章：重积分 */}
      <Composition id="Ch10_Sec01_Concept" component={() => <PlaceholderComp title="10.1 二重积分概念与性质" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10_Sec02_Calc2D" component={() => <PlaceholderComp title="10.2 二重积分计算" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10_Sec03_Triple" component={() => <PlaceholderComp title="10.3 三重积分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10_Sec04_Apps" component={() => <PlaceholderComp title="10.4 重积分应用" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十一章：曲线积分与曲面积分 */}
      <Composition id="Ch11_Sec01_Line1" component={() => <PlaceholderComp title="11.1 对弧长的曲线积分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec02_Line2" component={() => <PlaceholderComp title="11.2 对坐标的曲线积分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec03_Green" component={() => <PlaceholderComp title="11.3 格林公式" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec04_Surface1" component={() => <PlaceholderComp title="11.4 对面积的曲面积分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec05_Surface2" component={() => <PlaceholderComp title="11.5 对坐标的曲面积分" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec06_Gauss" component={() => <PlaceholderComp title="11.6 高斯公式" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11_Sec07_Stokes" component={() => <PlaceholderComp title="11.7 斯托克斯公式" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十二章：无穷级数 */}
      <Composition id="Ch12_Sec01_Concept" component={() => <PlaceholderComp title="12.1 常数项级数概念与性质" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec02_Tests" component={() => <PlaceholderComp title="12.2 常数项级数审敛法" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec03_Power" component={() => <PlaceholderComp title="12.3 幂级数" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec04_Taylor" component={() => <PlaceholderComp title="12.4 函数展开成幂级数" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec05_Apps" component={() => <PlaceholderComp title="12.5 幂级数展开的应用" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec06_Fourier" component={() => <PlaceholderComp title="12.6 傅里叶级数" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12_Sec07_Fourier2" component={() => <PlaceholderComp title="12.7 一般周期傅里叶级数" />}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
    </>
  );
};
