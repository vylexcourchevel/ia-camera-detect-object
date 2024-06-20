import "./PageHome.css";
import { useRef, useEffect, useState } from "react";
import { addItem, getItems, clearItems, deleteItem } from "../db.js";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { FaTrash } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const HomePage = () => {
  
  const [items, setItems] = useState([]);
  const [isLaunched, setIsLaunched] = useState();
  const [modelAI, setModelAI] = useState(null);
  const [intervalID, setIntervalID] = useState(null);
  const [loading, setLoading] = useState(true);

  const video = useRef(null);
  const canvas = useRef(null);
  const predictions = useRef([]);

  let width = 320;
  let height = 0;

  let contextCanvas;

  useEffect(() => {
    const init = async () => {
      const resultModelAI = await cocoSsd.load();
      setModelAI(resultModelAI);
      setLoading(false)
    };
    init();

    const fetchItems = async () => {
      const allItems = await getItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (isLaunched === false) {
      video.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
      clearInterval(intervalID);
      contextCanvas = canvas.current.getContext("2d");
      contextCanvas.drawImage(
        video.current,
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
    } else if(isLaunched === true) {
      getCameraStream();
      const resultIntervalID = setInterval(() => {
        detectObjects();
      }, 100);
      setIntervalID(resultIntervalID);
    }
  }, [isLaunched])

  const getCameraStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.current.srcObject = stream;
        video.current.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
    contextCanvas = canvas.current.getContext("2d");
  };

  const detectObjects = async () => {
    if (!modelAI || !video.current.readyState === 4 || !canvas.current) return;

    canvas.current.width = video.current.videoWidth;
    canvas.current.height = video.current.videoHeight;
    contextCanvas.drawImage(
      video.current,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );

    const resultPredictions = await modelAI.detect(canvas.current);
    predictions.current = resultPredictions;
    console.log(predictions.current);

    resultPredictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      contextCanvas.beginPath();
      contextCanvas.rect(x, y, width, height);
      contextCanvas.lineWidth = 4;
      contextCanvas.strokeStyle = "rgba(50, 50, 204, 0.5)";
      contextCanvas.fillStyle = "rgba(153, 50, 204, 0.25)";
      contextCanvas.fillRect(x, y, width, height);
      contextCanvas.stroke();
      contextCanvas.fillStyle = "rgba(40, 40, 220, 1)";
      contextCanvas.font = "italic 40pt Calibri";
      contextCanvas.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  const captureAndStorePrediction = async () => {
    console.log(predictions.current);
    if (predictions.current.length === 0) {
      console.log("pas de canvas ou pas de predictions");
      return;
    }

    const canvasImageDataURL = canvas.current.toDataURL();
    const item = {
      image: canvasImageDataURL,
      predictions: predictions.current,
    };
    await addItem(item);
    const allItems = await getItems();
    setItems(allItems);
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  return (
    <>
      <div className="container">
        <h1>Camera AI Object Detection</h1>
        {!loading ? 
          <div className="videos">
            <div>
                <div className="camera">
                  <h2>Camera Video Stream</h2>
                  <video ref={video} id="video" width={320} height={320} />
                </div>
              
                    <button className="button_camera" onClick={() => setIsLaunched(!isLaunched)}>
                      {isLaunched ? "Stop" : "Launch" }
                    </button>
            </div>
            <div className="detection">
              <h2>AI Detection Canvas</h2>
              <canvas ref={canvas} id="canvas"></canvas>
              <button className="button_camera" onClick={captureAndStorePrediction}>
                Capture Predictions
              </button>
            </div>
          </div>
        : 
          <div className="divSpinner"><ImSpinner size={200} className="spin" /></div>
        }

        <div className="store">
          <h2>Captures screenshots storage</h2>
          <div>
            {items.toReversed().map((item, index) => (
              <div className="item" key={index}>
                <img src={item.image} alt="Prediction Capture" />
                <ul>
                  {item.predictions.map((prediction, index) => (
                    <li key={index}>
                      <strong>{prediction.class}</strong> with{" "}
                      {(prediction.score * 100).toFixed(0)}%
                    </li>
                  ))}
                </ul>
                <FaTrash
                  onClick={() => handleDeleteItem(item.id)}
                  size={40}
                  style={{ cursor: "pointer", color: "#BF2995", marginTop: "10px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
