//attributions:
//Processing example - Patterns:https://processing.org/examples/pattern.html
//URL Parameters tutorials by John Thompson and helped by chatGPT
//URL Parameters can change colors of ball: ?r=255&g=0&b=255
//use chatGPT to help with the variableEllipse() part, controlling movements and circle size

let poseNet;
let pose;
let video;
let ballColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); 

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); 

  //PoseNet
  poseNet = ml5.poseNet(video, modelLoaded); 
  poseNet.on('pose', gotPoses); 
  // URL parameters
  let urlParams = new URLSearchParams(window.location.search);
  let r = urlParams.get('r') || 255; //red default
  let g = urlParams.get('g') || 0; 
  let b = urlParams.get('b') || 0;
  
  ballColor = color(r, g, b);
}

function modelLoaded() {
  console.log("PoseNet model loaded!");
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose; 
  }
}

function draw() {
  push();
  translate(width, 0);
  scale(-1, 1);

  if (pose && pose.rightWrist) {  
    let x = pose.rightWrist.x;
    let y = pose.rightWrist.y;
    let px = pmouseX;
    let py = pmouseY;
    variableEllipse(x, y, px, py);
  }

  pop();
}

// The variableEllipse() function calculates the speed of the wrist movement
// and draws a small ellipse if the movement is slow and a large ellipse if fast
function variableEllipse(x, y, px, py) {
  let speed = dist(x, y, px, py); // Calculate the speed (distance moved)
  let maxSize = 50;  // Maximum size for the circle
  let minSize = 10;   // Minimum size for the circle
  
  // Map the speed to the size of the ellipse, where faster speeds result in larger circles
  let ellipseSize = map(speed, 0, 200, minSize, maxSize);

  // Draw the ellipse with varying size based on speed and the color from URL parameters
  stroke(0);
  fill(ballColor);  // Use the color set by the URL parameters
  ellipse(x, y, ellipseSize, ellipseSize); // Draw ellipse with calculated size and color
}
