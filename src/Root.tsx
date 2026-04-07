import React from "react";
import { Composition, AbsoluteFill } from "remotion";
import { VIDEO_CONFIG } from "./constants/videoConfig";

// 第七章实装组件
import Sec01Intro from "./compositions/Ch07_DifferentialEq/Sec01_Intro";
import Sec02Separable from "./compositions/Ch07_DifferentialEq/Sec02_Separable";
import Sec03Homogeneous from "./compositions/Ch07_DifferentialEq/Sec03_Homogeneous";
import Sec04Linear from "./compositions/Ch07_DifferentialEq/Sec04_Linear";
import Sec05Exact from "./compositions/Ch07_DifferentialEq/Sec05_Exact";
import Sec06HighOrder from "./compositions/Ch07_DifferentialEq/Sec06_HighOrder";
import Sec07Linear2 from "./compositions/Ch07_DifferentialEq/Sec07_Linear2";
import Sec08ConstCoeff from "./compositions/Ch07_DifferentialEq/Sec08_ConstCoeff";
import Sec09NonHomog from "./compositions/Ch07_DifferentialEq/Sec09_NonHomog";

// 第八章实装组件
import Ch08Sec01Vectors from "./compositions/Ch08_VectorGeometry/Sec01_Vectors";
import Ch08Sec02Products from "./compositions/Ch08_VectorGeometry/Sec02_Products";
import Ch08Sec03Surfaces from "./compositions/Ch08_VectorGeometry/Sec03_Surfaces";
import Ch08Sec04Curves from "./compositions/Ch08_VectorGeometry/Sec04_Curves";
import Ch08Sec05Plane from "./compositions/Ch08_VectorGeometry/Sec05_Plane";
import Ch08Sec06Line from "./compositions/Ch08_VectorGeometry/Sec06_Line";

// 第九章实装组件
import Ch09Sec01Concept from "./compositions/Ch09_MultiVariable/Sec01_Concept";
import Ch09Sec02Partial from "./compositions/Ch09_MultiVariable/Sec02_Partial";
import Ch09Sec03Total from "./compositions/Ch09_MultiVariable/Sec03_Total";
import Ch09Sec04Chain from "./compositions/Ch09_MultiVariable/Sec04_Chain";
import Ch09Sec05Implicit from "./compositions/Ch09_MultiVariable/Sec05_Implicit";
import Ch09Sec06Geometry from "./compositions/Ch09_MultiVariable/Sec06_Geometry";
import Ch09Sec07Gradient from "./compositions/Ch09_MultiVariable/Sec07_Gradient";
import Ch09Sec08Extremum from "./compositions/Ch09_MultiVariable/Sec08_Extremum";

// 第十一章补充组件
import Ch11Sec04Surface1 from "./compositions/Ch11_LineAndSurface/Sec04_Surface1";
import Ch11Sec05Surface2 from "./compositions/Ch11_LineAndSurface/Sec05_Surface2";

// 第十二章补充组件
import Ch12Sec05Apps from "./compositions/Ch12_Series/Sec05_Apps";

// 第十章：重积分
import Ch10Sec01Concept from "./compositions/Ch10_MultipleIntegral/Sec01_Concept";
import Ch10Sec02Calc2D from "./compositions/Ch10_MultipleIntegral/Sec02_Calc2D";
import Ch10Sec03Triple from "./compositions/Ch10_MultipleIntegral/Sec03_Triple";
import Ch10Sec04Apps from "./compositions/Ch10_MultipleIntegral/Sec04_Apps";

// 第十一章：曲线积分与曲面积分
import Ch11Sec01Line1 from "./compositions/Ch11_LineAndSurface/Sec01_Line1";
import Ch11Sec02Line2 from "./compositions/Ch11_LineAndSurface/Sec02_Line2";
import Ch11Sec03Green from "./compositions/Ch11_LineAndSurface/Sec03_Green";
import Ch11Sec06Gauss from "./compositions/Ch11_LineAndSurface/Sec06_Gauss";
import Ch11Sec07Stokes from "./compositions/Ch11_LineAndSurface/Sec07_Stokes";

// 第十二章：无穷级数
import Ch12Sec01Concept from "./compositions/Ch12_Series/Sec01_Concept";
import Ch12Sec02Tests from "./compositions/Ch12_Series/Sec02_Tests";
import Ch12Sec03Power from "./compositions/Ch12_Series/Sec03_Power";
import Ch12Sec04Taylor from "./compositions/Ch12_Series/Sec04_Taylor";
import Ch12Sec06Fourier from "./compositions/Ch12_Series/Sec06_Fourier";
import Ch12Sec07Fourier2 from "./compositions/Ch12_Series/Sec07_Fourier2";

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
      <Composition id="Ch07-Sec01-Intro" component={Sec01Intro}
        durationInFrames={450} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec02-Separable" component={Sec02Separable}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec03-Homogeneous" component={Sec03Homogeneous}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec04-Linear" component={Sec04Linear}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec05-Exact" component={Sec05Exact}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec06-HighOrder" component={Sec06HighOrder}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec07-Linear2" component={Sec07Linear2}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec08-ConstCoeff" component={Sec08ConstCoeff}
        durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch07-Sec09-NonHomog" component={Sec09NonHomog}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第八章：空间解析几何与向量代数 */}
      <Composition id="Ch08-Sec01-Vectors" component={Ch08Sec01Vectors}
        durationInFrames={450} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08-Sec02-Products" component={Ch08Sec02Products}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08-Sec03-Surfaces" component={Ch08Sec03Surfaces}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08-Sec04-Curves" component={Ch08Sec04Curves}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08-Sec05-Plane" component={Ch08Sec05Plane}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch08-Sec06-Line" component={Ch08Sec06Line}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第九章：多元函数微分法 */}
      <Composition id="Ch09-Sec01-Concept" component={Ch09Sec01Concept}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec02-Partial" component={Ch09Sec02Partial}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec03-Total" component={Ch09Sec03Total}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec04-Chain" component={Ch09Sec04Chain}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec05-Implicit" component={Ch09Sec05Implicit}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec06-Geometry" component={Ch09Sec06Geometry}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec07-Gradient" component={Ch09Sec07Gradient}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch09-Sec08-Extremum" component={Ch09Sec08Extremum}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十章：重积分 */}
      <Composition id="Ch10-Sec01-Concept" component={Ch10Sec01Concept}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10-Sec02-Calc2D" component={Ch10Sec02Calc2D}
        durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10-Sec03-Triple" component={Ch10Sec03Triple}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch10-Sec04-Apps" component={Ch10Sec04Apps}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十一章：曲线积分与曲面积分 */}
      <Composition id="Ch11-Sec01-Line1" component={Ch11Sec01Line1}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec02-Line2" component={Ch11Sec02Line2}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec03-Green" component={Ch11Sec03Green}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec04-Surface1" component={Ch11Sec04Surface1}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec05-Surface2" component={Ch11Sec05Surface2}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec06-Gauss" component={Ch11Sec06Gauss}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch11-Sec07-Stokes" component={Ch11Sec07Stokes}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />

      {/* 第十二章：无穷级数 */}
      <Composition id="Ch12-Sec01-Concept" component={Ch12Sec01Concept}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec02-Tests" component={Ch12Sec02Tests}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec03-Power" component={Ch12Sec03Power}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec04-Taylor" component={Ch12Sec04Taylor}
        durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec05-Apps" component={Ch12Sec05Apps}
        durationInFrames={300} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec06-Fourier" component={Ch12Sec06Fourier}
        durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <Composition id="Ch12-Sec07-Fourier2" component={Ch12Sec07Fourier2}
        durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
    </>
  );
};
