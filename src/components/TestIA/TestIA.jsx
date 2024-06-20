// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./ia.css";

const TestIA = () => {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const ctxRef = useRef(null);

  useEffect(() => {
    ctxRef.current = canvasRef.current.getContext("2d");
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imgRef.current.src = reader.result;
      imgRef.current.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = imgRef.current.width;
        canvas.height = imgRef.current.height;
        ctxRef.current.drawImage(
          imgRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
        detectObjects();
      };
    };
    reader.readAsDataURL(file);
  };

  const detectObjects = async () => {
    const model = await cocoSsd.load();
    const predictions = await model.detect(canvasRef.current);
    console.log(predictions);

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctxRef.current.beginPath();
      ctxRef.current.rect(x, y, width, height);
      ctxRef.current.lineWidth = 3;
      ctxRef.current.strokeStyle = "blue";
      ctxRef.current.fillStyle = "yellow";
      ctxRef.current.stroke();
      ctxRef.current.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  return (
    <div className="container">
      <h1>Upload the Picture</h1>
      <div className="flex-container">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <canvas ref={canvasRef} id ="canvas1" />
      </div>
    </div>
  );
};

export default TestIA;
