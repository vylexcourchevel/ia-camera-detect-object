import "./PageHome.css";
import { useRef, useEffect, useState } from "react";
import { addItem, getItems, clearItems } from "../db.js";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const HomePage = () => {
  const [predictions, setPredictions] = useState([]);
  const [items, setItems] = useState([]);
  const [isLaunched, setIsLaunched] = useState(false);
  const [modelAI, setModelAI] = useState(null);
  const [intervalID, setIntervalID] = useState(null);

  const video = useRef(null);
  const canvas = useRef(null);

  let contextCanvas;

  // == PAGE LOAD ==
  useEffect(() => {
    const init = async () => {
      const resultModelAI = await cocoSsd.load(); // On charge le COCO-SSD model
      setModelAI(resultModelAI); // On le sauvegarde dans un state
    };
    init();

    const fetchItems = async () => {
      // Mise à jour de la liste des captures
      const allItems = await getItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  // == START ==
  const launchCamera = () => {
    getCameraStream();
    const resultIntervalID = setInterval(() => {
      detectObjects(); // On lance la detection d'objet
    }, 100); // Tout les 100ms
    setIntervalID(resultIntervalID); // Lance la boucle d'intervalle
    setIsLaunched(true);
  };

  // == STOP ==
  const stopCamera = () => {
    video.current.srcObject.getTracks().forEach(function (track) {
      track.stop(); // On stop tout les streams de caméra
    });
    clearInterval(intervalID); // On stop la boucle d'intervalle
    contextCanvas = canvas.current.getContext("2d");
    contextCanvas.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height); // On dessine une copie fond noir de la vidéo dans le canvas
    setIsLaunched(false);
  };

  // == GET CAMERA STREAM ==
  const getCameraStream = () => {
    navigator.mediaDevices // permet de récupérer le flux vidéo et audio
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) { // On lie le stream dans la source de la balise HTML video et on lance
        video.current.srcObject = stream;
        video.current.play();
      })
      .catch(function (err) { // Ici on récupère les erreurs
        console.log("An error occurred: " + err);
      });
    contextCanvas = canvas.current.getContext("2d");
  };

  // == OBJETCS DETECTION ==
  const detectObjects = async () => {
    if (!modelAI || !video.current.readyState === 4 || !canvas.current) return;

    canvas.current.width = video.current.videoWidth;
    canvas.current.height = video.current.videoHeight;
    contextCanvas.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height); // On dessine une copie de la vidéo dans le canvas

    const resultPredictions = await modelAI.detect(canvas.current); // On réalise la détection
    setPredictions(resultPredictions);

    resultPredictions.forEach((prediction) => { // Dessine les prédictions sous forme de rectangle
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

  // == CAPTURE ET AJOUT STORAGE ==
  const captureAndStorePrediction = async () => {
    if (predictions.length == 0) { // Si pas de prédictions disponible
      console.log("pas de canvas ou pas de predictions");
      return;
    }

    const canvasImageDataURL = canvas.current.toDataURL(); // Convertit en image
    console.log(predictions);
    const item = {
      image: canvasImageDataURL,
      predictions: predictions,
    };
    await addItem(item); // Ajoute dans le storage
    const allItems = await getItems(); // Récupère la nouvelle liste à jour
    setItems(allItems); // Met à jour sur le state React
  };

  // == EFFACER TOUT LES ITEMS ==
  const handleClearItems = async () => {
    await clearItems();
    setItems([]);
  };

  return (
    <>
      <h1>Camera AI Object Detection</h1>
      {isLaunched ? (
        <button onClick={stopCamera}>Stop</button>
      ) : (
        <button onClick={launchCamera}>Launch</button>
      )}
      <div className="contentarea">
        <div className="videos">
          <div className="camera">
            <h2>Camera Video Stream</h2>
            <video ref={video} id="video" />
          </div>
          <div className="detection">
            <h2>AI Detection Canvas</h2>
            <canvas ref={canvas} id="canvas"></canvas>
            <button onClick={captureAndStorePrediction}>Capture Predictions</button>
          </div>
        </div>
        <div className="store">
          <h2>Captures screenshots storage</h2>
          <button onClick={handleClearItems}>Clear Items</button>
          <div>
            {items.toReversed().map((item, index) => (
              <div className="item" key={index}>
                <img src={item.image} />
                <ul>{item.predictions.map((prediction, index) => (
                  <li key={index}><strong>{prediction.class}</strong> with {prediction.score.toFixed(2)}%</li>
                ))}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
