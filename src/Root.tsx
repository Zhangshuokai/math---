import React from "react";
import { Composition, AbsoluteFill, Folder } from "remotion";
import { VIDEO_CONFIG } from "./constants/videoConfig";
import { withWatermark } from "./components/ui/Watermark";

// 章节索引组件
import Ch07Index from "./compositions/Ch07_DifferentialEq/index";
import Ch08Index from "./compositions/Ch08_VectorGeometry/index";
import Ch09Index from "./compositions/Ch09_MultiVariable/index";
import Ch10Index from "./compositions/Ch10_MultipleIntegral/index";
import Ch11Index from "./compositions/Ch11_LineAndSurface/index";
import Ch12Index from "./compositions/Ch12_Series/index";

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
import Sec10Examples from "./compositions/Ch07_DifferentialEq/Sec10_Examples";

// 第八章实装组件
import Ch08Sec01Vectors from "./compositions/Ch08_VectorGeometry/Sec01_Vectors";
import Ch08Sec02Products from "./compositions/Ch08_VectorGeometry/Sec02_Products";
import Ch08Sec03Surfaces from "./compositions/Ch08_VectorGeometry/Sec03_Surfaces";
import Ch08Sec04Curves from "./compositions/Ch08_VectorGeometry/Sec04_Curves";
import Ch08Sec05Plane from "./compositions/Ch08_VectorGeometry/Sec05_Plane";
import Ch08Sec06Line from "./compositions/Ch08_VectorGeometry/Sec06_Line";
import Ch08Sec07Examples from "./compositions/Ch08_VectorGeometry/Sec07_Examples";

// 第九章实装组件
import Ch09Sec01Concept from "./compositions/Ch09_MultiVariable/Sec01_Concept";
import Ch09Sec02Partial from "./compositions/Ch09_MultiVariable/Sec02_Partial";
import Ch09Sec03Total from "./compositions/Ch09_MultiVariable/Sec03_Total";
import Ch09Sec04Chain from "./compositions/Ch09_MultiVariable/Sec04_Chain";
import Ch09Sec05Implicit from "./compositions/Ch09_MultiVariable/Sec05_Implicit";
import Ch09Sec06Geometry from "./compositions/Ch09_MultiVariable/Sec06_Geometry";
import Ch09Sec07Gradient from "./compositions/Ch09_MultiVariable/Sec07_Gradient";
import Ch09Sec08Extremum from "./compositions/Ch09_MultiVariable/Sec08_Extremum";
import { Sec09Examples as Ch09Sec09Examples } from "./compositions/Ch09_MultiVariable/Sec09_Examples";

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

// 预创建带水印的组件（在模块顶层创建，保证引用稳定不重复渲染）
const WCh07Index = withWatermark(Ch07Index);
const WSec01Intro = withWatermark(Sec01Intro);
const WSec02Separable = withWatermark(Sec02Separable);
const WSec03Homogeneous = withWatermark(Sec03Homogeneous);
const WSec04Linear = withWatermark(Sec04Linear);
const WSec05Exact = withWatermark(Sec05Exact);
const WSec06HighOrder = withWatermark(Sec06HighOrder);
const WSec07Linear2 = withWatermark(Sec07Linear2);
const WSec08ConstCoeff = withWatermark(Sec08ConstCoeff);
const WSec09NonHomog = withWatermark(Sec09NonHomog);
const WSec10Examples = withWatermark(Sec10Examples);

const WCh08Index = withWatermark(Ch08Index);
const WCh08Sec01Vectors = withWatermark(Ch08Sec01Vectors);
const WCh08Sec02Products = withWatermark(Ch08Sec02Products);
const WCh08Sec03Surfaces = withWatermark(Ch08Sec03Surfaces);
const WCh08Sec04Curves = withWatermark(Ch08Sec04Curves);
const WCh08Sec05Plane = withWatermark(Ch08Sec05Plane);
const WCh08Sec06Line = withWatermark(Ch08Sec06Line);
const WCh08Sec07Examples = withWatermark(Ch08Sec07Examples);

const WCh09Index = withWatermark(Ch09Index);
const WCh09Sec01Concept = withWatermark(Ch09Sec01Concept);
const WCh09Sec02Partial = withWatermark(Ch09Sec02Partial);
const WCh09Sec03Total = withWatermark(Ch09Sec03Total);
const WCh09Sec04Chain = withWatermark(Ch09Sec04Chain);
const WCh09Sec05Implicit = withWatermark(Ch09Sec05Implicit);
const WCh09Sec06Geometry = withWatermark(Ch09Sec06Geometry);
const WCh09Sec07Gradient = withWatermark(Ch09Sec07Gradient);
const WCh09Sec08Extremum = withWatermark(Ch09Sec08Extremum);
const WCh09Sec09Examples = withWatermark(Ch09Sec09Examples);

const WCh10Index = withWatermark(Ch10Index);
const WCh10Sec01Concept = withWatermark(Ch10Sec01Concept);
const WCh10Sec02Calc2D = withWatermark(Ch10Sec02Calc2D);
const WCh10Sec03Triple = withWatermark(Ch10Sec03Triple);
const WCh10Sec04Apps = withWatermark(Ch10Sec04Apps);

const WCh11Index = withWatermark(Ch11Index);
const WCh11Sec01Line1 = withWatermark(Ch11Sec01Line1);
const WCh11Sec02Line2 = withWatermark(Ch11Sec02Line2);
const WCh11Sec03Green = withWatermark(Ch11Sec03Green);
const WCh11Sec04Surface1 = withWatermark(Ch11Sec04Surface1);
const WCh11Sec05Surface2 = withWatermark(Ch11Sec05Surface2);
const WCh11Sec06Gauss = withWatermark(Ch11Sec06Gauss);
const WCh11Sec07Stokes = withWatermark(Ch11Sec07Stokes);

const WCh12Index = withWatermark(Ch12Index);
const WCh12Sec01Concept = withWatermark(Ch12Sec01Concept);
const WCh12Sec02Tests = withWatermark(Ch12Sec02Tests);
const WCh12Sec03Power = withWatermark(Ch12Sec03Power);
const WCh12Sec04Taylor = withWatermark(Ch12Sec04Taylor);
const WCh12Sec05Apps = withWatermark(Ch12Sec05Apps);
const WCh12Sec06Fourier = withWatermark(Ch12Sec06Fourier);
const WCh12Sec07Fourier2 = withWatermark(Ch12Sec07Fourier2);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 第七章：微分方程 */}
      <Folder name="Ch07-DifferentialEq">
        <Composition id="Ch07-Index" component={WCh07Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec01-Intro" component={WSec01Intro}
          durationInFrames={450} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec02-Separable" component={WSec02Separable}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec03-Homogeneous" component={WSec03Homogeneous}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec04-Linear" component={WSec04Linear}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec05-Exact" component={WSec05Exact}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec06-HighOrder" component={WSec06HighOrder}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec07-Linear2" component={WSec07Linear2}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec08-ConstCoeff" component={WSec08ConstCoeff}
          durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec09-NonHomog" component={WSec09NonHomog}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch07-Sec10-Examples" component={WSec10Examples}
          durationInFrames={1440} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>

      {/* 第八章：空间解析几何与向量代数 */}
      <Folder name="Ch08-VectorGeometry">
        <Composition id="Ch08-Index" component={WCh08Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec01-Vectors" component={WCh08Sec01Vectors}
          durationInFrames={450} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec02-Products" component={WCh08Sec02Products}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec03-Surfaces" component={WCh08Sec03Surfaces}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec04-Curves" component={WCh08Sec04Curves}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec05-Plane" component={WCh08Sec05Plane}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec06-Line" component={WCh08Sec06Line}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch08-Sec07-Examples" component={WCh08Sec07Examples}
          durationInFrames={1440} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>

      {/* 第九章：多元函数微分法及其应用 */}
      <Folder name="Ch09-MultiVariable">
        <Composition id="Ch09-Index" component={WCh09Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec01-Concept" component={WCh09Sec01Concept}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec02-Partial" component={WCh09Sec02Partial}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec03-Total" component={WCh09Sec03Total}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec04-Chain" component={WCh09Sec04Chain}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec05-Implicit" component={WCh09Sec05Implicit}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec06-Geometry" component={WCh09Sec06Geometry}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec07-Gradient" component={WCh09Sec07Gradient}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec08-Extremum" component={WCh09Sec08Extremum}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch09-Sec09-Examples" component={WCh09Sec09Examples}
          durationInFrames={1440} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>

      {/* 第十章：重积分 */}
      <Folder name="Ch10-MultipleIntegral">
        <Composition id="Ch10-Index" component={WCh10Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch10-Sec01-Concept" component={WCh10Sec01Concept}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch10-Sec02-Calc2D" component={WCh10Sec02Calc2D}
          durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch10-Sec03-Triple" component={WCh10Sec03Triple}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch10-Sec04-Apps" component={WCh10Sec04Apps}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>

      {/* 第十一章：曲线积分与曲面积分 */}
      <Folder name="Ch11-LineAndSurface">
        <Composition id="Ch11-Index" component={WCh11Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec01-Line1" component={WCh11Sec01Line1}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec02-Line2" component={WCh11Sec02Line2}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec03-Green" component={WCh11Sec03Green}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec04-Surface1" component={WCh11Sec04Surface1}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec05-Surface2" component={WCh11Sec05Surface2}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec06-Gauss" component={WCh11Sec06Gauss}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch11-Sec07-Stokes" component={WCh11Sec07Stokes}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>

      {/* 第十二章：无穷级数 */}
      <Folder name="Ch12-Series">
        <Composition id="Ch12-Index" component={WCh12Index}
          durationInFrames={150} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec01-Concept" component={WCh12Sec01Concept}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec02-Tests" component={WCh12Sec02Tests}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec03-Power" component={WCh12Sec03Power}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec04-Taylor" component={WCh12Sec04Taylor}
          durationInFrames={540} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec05-Apps" component={WCh12Sec05Apps}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec06-Fourier" component={WCh12Sec06Fourier}
          durationInFrames={600} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
        <Composition id="Ch12-Sec07-Fourier2" component={WCh12Sec07Fourier2}
          durationInFrames={480} fps={VIDEO_CONFIG.fps} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      </Folder>
    </>
  );
};
