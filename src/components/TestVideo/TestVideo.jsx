import './TestVideo.css';
import { useEffect } from 'react';

function TestVideo() {

  useEffect( () => {
    startup();
  }, []);

  let width = 320; // Largeur de la vidéo
  let height = 0; // On met 0 car la hauteur de la vidéo sera calculé au lancement de la vidéo, selon le format de la camera (4/3, 16/9 etc...)
  let isStreaming = false; // Boolean qui permet de savoir si la caméra est activée ou non, on commence par non
  
  // Valeurs initiales des éléments DOM HTML misent à null
  let video = null;
  let canvas = null;
  let photo = null;
  let startbutton = null;
  
  // La Fonction startup se lance quand le loading de la page est terminé
  const startup = () => {

    // On recupère tout les éléments HTMLs sous forme de noeud du DOM
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    // La fonction navigator.mediaDevices.getUserMedia permet de récupérer le flux vidéo et audio
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) // Elle renvoi un StreamVideo
    .then(function(stream) { // Avec le .then on attend que la promesse soit terminée
      video.srcObject = stream; // Puis on met le stream video dans le noeud de la balise video
      video.play(); // Aussi, on lance la vidéo avec la méthode HTML5 native play
    })
    .catch(function(err) { // Ici on récupère les erreurs
      console.log("An error occurred: " + err);
    });

    // Ajout écouteur d'évenement sur si la caméra peut lire une vidéo
    video.addEventListener('canplay', (event) => {
      if (!isStreaming) {
        height = video.videoHeight / (video.videoWidth/width); // Corrige un bug de Firefox qui a besoin qu'un height soit spécifié
          
        if (isNaN(height)) { // Si la hauteure n'est pas un nombre
          height = width / (4/3); // Allors on la définit comme étant à 3/4 de la largeur par défaut
        }
      
        // On spécifie les attribut de la vidéo et du canvas
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        isStreaming = true; // On change le boolean à true pour dire que la caméra tourne
      }
    }, false);

    // Ajout écouteur d'évenement sur le click du bouton pour prendre la photo
    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    // Purge de la photo
    clearphoto();
  }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    // Fonction pour prendre une capture
    const takepicture = () => {
      let context = canvas.getContext('2d'); // Création du context 2D de canvas
      if (width && height) { // Si la largeur et la hauteur existent, on règle celle du canvas
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height); // On dessigne dans le canvas en copiant la source de la video
      
        let data = canvas.toDataURL('image/png'); // On crée une URL sous forme d'un fichier .png
        photo.setAttribute('src', data); // On ajoute ce fichier dans l'attribut src de la balise image
      } else {
        clearphoto(); // Sinon on purge la photo
      }
    }

    // Fonction pour purger la photo
    const clearphoto = () => {
      let context = canvas.getContext('2d'); // Création du context 2D de canvas
      context.fillStyle = "#AAA"; // On spécifie la couleur à gris
      context.fillRect(0, 0, canvas.width, canvas.height); // On remplit le canevas par un rectangle
  
      let data = canvas.toDataURL('image/png'); // On crée une URL sous forme d'un fichier .png
      photo.setAttribute('src', data); // On ajoute ce fichier dans l'attribut src de la balise image
    }

  return (
    <div>

      <h1>Test Capture Video WebRTC</h1>

      <div class="contentarea">

        <p>This example demonstrates how to set up a media stream using your built-in webcam, fetch an image from that stream, and create a PNG using that image.</p>

        <div class="camera">
          <video id="video">Video stream not available.</video>
          <button id="startbutton">Take photo</button> 
        </div>

        <canvas id="canvas"></canvas>

        <div class="output">
          <img id="photo" alt="The screen capture will appear in this box." />
        </div>

      </div>

    </div>
  )
}

export default TestVideo