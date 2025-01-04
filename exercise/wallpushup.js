// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let pose;
let skeleton;

let brain;

let state = 'waiting';
let targetLabel;
let inputs = [];
let poseLabel;
let count = 0;
let lastLabel = '';
let poseLabelConfidence = 100;

let isMuted = false;

let totalconfidence = 0;
let totalclassify = 0;
let score = 0;

function speakText(text, count, rate=1) {
  let i = 0;

  function speakOnce() {
    if (!isMuted && i < count) { // Check if not muted and the limit has not been reached
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = rate;
      speech.onend = speakOnce;
      window.speechSynthesis.speak(speech);
      i++;
    }
  }

  speakOnce();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('video-container');
  video = createCapture(VIDEO);
  video.hide();
  
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  // brain.loadData('ymca.json', dataReady);
  const modelInfo = {
    model: 'exercise/wallpushup/model.json',
    metadata:'exercise/wallpushup/model_meta.json',
    weights:'exercise/wallpushup/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    inputs = [];
    for (let i=0; i<pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  const rect1 = document.querySelector('.rectangle1');
  const rect2 = document.querySelector('.rectangle2');
  if (results[0].confidence > 0.75) {
    //poseLabel = results[0].label.toUpperCase();
    if (results[0].label == "u") {
      poseLabel = "DOWN";
      rect1.style.backgroundColor = "rgba(0, 128, 0, 0.25)";
      rect2.style.backgroundColor = "rgba(0, 128, 0, 0)";
    } else if (results[0].label == "d") {
      poseLabel = "UP";
      rect1.style.backgroundColor = "rgba(0, 128, 0, 0)";
      rect2.style.backgroundColor = "rgba(0, 128, 0, 0.25)";
    }
  }
  totalclassify += 1;
  totalconfidence += results[0].confidence;
  classifyPose();
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;

    let target = [targetLabel];
    brain.addData(inputs, target);
  }
}

function modelReady() {
  console.log("Model Loaded");
  //speakText("exercise begins in 10, 9, 8, 7, 6, 5, 4, 3, 2, 1", 1);
  setTimeout(() => speakText("exercise begins in 5", 1), 1000);
  setTimeout(() => speakText("4", 1), 3500);
  setTimeout(() => speakText("3", 1), 5000);
  setTimeout(() => speakText("2", 1), 6500);
  setTimeout(() => speakText("1", 1), 8000);
  setTimeout(() => speakText("do a push up against the wall", 1, 0.75), 10000);
}

function draw() {
  push();
  // Flip video
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);


  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  pop();

  fill(245, 231, 178);
  stroke(151, 49, 49);
  strokeWeight(10);
  textSize(100);
  textAlign(LEFT, CENTER);
  text(poseLabel,width/24,7*height/8);
  updateCount(poseLabel);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// call the start counting
function updateCount(poseLabel){
  //console.log(poseLabel);
  //console.log(count);
  //console.log('lastLabel');s
  fill(245, 231, 178);
  stroke(151, 49, 49);
  strokeWeight(10);
  textSize(100);
  textAlign(RIGHT, CENTER);
  text(count,23*width/24,height/8);
  if (lastLabel === 'UP' && poseLabel === 'DOWN'){
    count++;

    updateDisplay();
    console.log("count is:",count);
  }
  lastLabel=poseLabel;
}

function updateDisplay(){
  const exerciseCountElement = document.getElementById('exercise-count');

  // Check if elements exist before updating their content
  if (exerciseCountElement) {
    exerciseCountElement.innerText = count;  // Assuming count is defined
  }
  if (count == 10) {
    logExercise();
    
    score = (100 * totalconfidence / totalclassify);
    console.log("score: ",score);
    const scoreDisplay = document.getElementById('score-display');
    const scoreValue = document.getElementById('score-value');
    scoreValue.innerText = score.toFixed(0);
    scoreDisplay.style.display = 'block';

    var soundEffect = document.getElementById('sound-effect');
    soundEffect.play();
    setTimeout(() => speakText("Good job! You may now proceed to the next exercise", 1, 0.75), 3000);
    // Create a new image element
    var image = new Image();
    image.src = '../archie/stararchie.png'; // Correct path to the image
    image.className = 'popup-image'; // Add class for styling

    // Add the image to the container
    document.getElementById('image-container').appendChild(image);

    // Trigger the slide-in effect after a short delay to ensure the image is added to the DOM
    setTimeout(function() {
      image.classList.add('slide-in');
    }, 100);
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}