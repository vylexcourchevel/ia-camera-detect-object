// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./ia.css";

const TestIAVideo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      // Load the COCO-SSD model
      modelRef.current = await cocoSsd.load();
    };
    init();
  }, []);

  useEffect(() => {
    ctxRef.current = canvasRef.current.getContext("2d");
    const interval = setInterval(() => {
      detectObjects();
    }, 500); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    videoRef.current.src = url;
    videoRef.current.play();
  };

  const detectObjects = async () => {
    if (!modelRef.current || !videoRef.current.readyState === 4) return;

    // Draw the video frame to the canvas
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctxRef.current.drawImage(
      videoRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Perform object detection
    const predictions = await modelRef.current.detect(canvas);
    console.log(predictions);

    // Draw the predictions
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

  // Styles directement dans le composant
  const inputStyle = {
    margin: "10px",
    padding: "5px",
    fontSize: "16px",
  };

  return (
    <div className="container">
      <h1>Upload the video</h1>
      <div className="flex-container">  
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={inputStyle}
        />
          <div className="video-container">
        <video ref={videoRef} controls />
        <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
      
  );
};

export default TestIAVideo;
