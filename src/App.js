import React, { useState } from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import Webcam from 'react-webcam';
import model from "./pose_landmarker_full.task"
import faceModel from "./face_landmarker.task"
import handModel from "./hand_landmarker.task"
import {
  PoseLandmarker, FilesetResolver, FaceLandmarker, HandLandmarker
} from "@mediapipe/tasks-vision";


function App() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const [base64, setBase64] = useState("")
  const [data, setData] = useState(
    [
      {
        x: [],
        y: [],
        z: [],
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 3,
        }
      }
    ]
  )

  //Handles Pose Detection
  async function poseDetection() {
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const poseLandmarker = await PoseLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: model, //.taskファイルを指定する
          delegate: "GPU" //CPU or GPUで処理するかを指定する
        },
        runningMode: 'IMAGE'
      });
    const image = document.getElementById('poseImage');
    console.log(image)
    const poseLandmarkerResult = poseLandmarker.detect(image);
    return poseLandmarkerResult
  }

  async function faceLandmarkDetection() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: faceModel,
          delegate: "GPU"
        },
        runningMode: "IMAGE"
      }
    );
    const image = document.getElementById('poseImage');
    console.log(image)
    const faceLandmarkerResult = faceLandmarker.detect(image);
    return faceLandmarkerResult
  }

  async function handLandmarkDetection() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const handLandmarker = await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: handModel,
          delegate: "GPU"
        },
        runningMode: "IMAGE"
      }
    );
    const image = document.getElementById('poseImage');
    console.log(image)
    const handLandmarkerResult = handLandmarker.detect(image);
    return handLandmarkerResult
  }

  // Sorts the data and prepare for plotting
  function createDataPose(result) {
    var x = [];
    var y = [];
    var z = [];
    const worldLandmarks = result.worldLandmarks[0]
    worldLandmarks.forEach(landmark => {
      x.push(landmark.x);
      y.push(landmark.y);
      z.push(landmark.z);
    })
    setData([
      {
        x: x,
        y: y,
        z: z,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 3,
        }
      },
      {
        x: [x[8], x[6], x[5], x[4], x[0], x[1], x[2], x[3], x[7]],
        y: [y[8], y[6], y[5], y[4], y[0], y[1], y[2], y[3], y[7]],
        z: [z[8], z[6], z[5], z[4], z[0], z[1], z[2], z[3], z[7]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[10], x[9]],
        y: [y[10], y[9]],
        z: [z[10], z[9]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[12], x[11], x[23], x[24], x[12]],
        y: [y[12], y[11], y[23], y[24], y[12]],
        z: [z[12], z[11], z[23], z[24], z[12]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[12], x[14], x[16], x[18], x[20], x[16], x[22]],
        y: [y[12], y[14], y[16], y[18], y[20], y[16], y[22]],
        z: [z[12], z[14], z[16], z[18], z[20], z[16], z[22]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[11], x[13], x[15], x[17], x[19], x[15], x[21]],
        y: [y[11], y[13], y[15], y[17], y[19], y[15], y[21]],
        z: [z[11], z[13], z[15], z[17], z[19], z[15], z[21]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[24], x[26], x[28], x[30], x[32]],
        y: [y[24], y[26], y[28], y[30], y[32]],
        z: [z[24], z[26], z[28], z[30], z[32]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[23], x[25], x[27], x[29], x[31]],
        y: [y[23], y[25], y[27], y[29], y[31]],
        z: [z[23], z[25], z[27], z[29], z[31]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      }
    ])
  }

  function createDataFace(result) {
    const landmarks = result.faceLandmarks[0];
    var x = []
    var y = []
    var z = []

    landmarks.forEach((landmark) => {
      x.push(landmark.x)
      y.push(landmark.y)
      z.push(landmark.z)
    })

    setData([
      {
        x: x,
        y: y,
        z: z,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 3,
        }
      }
    ]);
  }

  function createDataHand(result) {
    const landmarks = result.worldLandmarks[0];
    var x = []
    var y = []
    var z = []

    landmarks.forEach((landmark) => {
      x.push(landmark.x)
      y.push(landmark.y)
      z.push(landmark.z)
    })

    setData([
      {
        x: x,
        y: y,
        z: z,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 3,
        }
      },
      {
        x: [x[0], x[1], x[2], x[3], x[4]],
        y: [y[0], y[1], y[2], y[3], y[4]],
        z: [z[0], z[1], z[2], z[3], z[4]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[0], x[5], x[6], x[7], x[8]],
        y: [y[0], y[5], y[6], y[7], y[8]],
        z: [z[0], z[5], z[6], z[7], z[8]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[0], x[9], x[10], x[11], x[12]],
        y: [y[0], y[9], y[10], y[11], y[12]],
        z: [z[0], z[9], z[10], z[11], z[12]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[0], x[13], x[14], x[15], x[16]],
        y: [y[0], y[13], y[14], y[15], y[16]],
        z: [z[0], z[13], z[14], z[15], z[16]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      },
      {
        x: [x[0], x[17], x[18], x[19], x[20]],
        y: [y[0], y[17], y[18], y[19], y[20]],
        z: [z[0], z[17], z[18], z[19], z[20]],
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: "red" },
      }
    ]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img hidden src={base64} id='poseImage' />
        <Webcam
          audio={false}
          height={720}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        >
          {({ getScreenshot }) => (
            <div>
              <button
                onClick={() => {
                  const imageSrc = getScreenshot()
                  setBase64(imageSrc)
                  poseDetection().then((result) => {
                    if (result.worldLandmarks) {
                      createDataPose(result)
                    }
                  })
                }}
              >
                Pose Detection
              </button>

              <button
                onClick={() => {
                  const imageSrc = getScreenshot()
                  setBase64(imageSrc)
                  faceLandmarkDetection().then((result) => {
                    createDataFace(result)
                  })
                }}
              >
                Face Landmark Detection
              </button>
              <button
                onClick={() => {
                  const imageSrc = getScreenshot()
                  setBase64(imageSrc)
                  handLandmarkDetection().then((result) => {
                    createDataHand(result)
                  })
                }}
              >
                Hand Landmark Detection
              </button>
            </div>
          )}
        </Webcam>
        <Plot
          data={data}
          layout={{ width: 1280, height: 720 }}
        />
      </header>
    </div>
  );
}

export default App;
