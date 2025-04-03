//Examples from Daniel Shiffman's Processing //Sketch:https://processing.org/examples/graphing2dequation.html
// I used ChatGPT to help me debug the fullscreen function.

let video;
let poseNet;//use posenet instead of mouse interaction
let pose;
let n = 0; //horizontal
let h = 0 // vertical
let button = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  
button.fullScreenBtn = createButton('Full Screen');
  button.fullScreenBtn.mousePressed(full_screen_action);
 button.fullScreenBtn.style('font-size:30px');
}

function modelLoaded() {
  console.log("PoseNet Loaded！");
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let nose = poses[0].pose.nose;
    let rightWrist = poses[0].pose.rightWrist;

    if (nose) {
      n = map(nose.x, 0, width, 0, 60);
     
    }
    if (nose) {
      h = map(nose.y, 0, height, 10, 60); 
    }
  }
}

function draw() {
  loadPixels();

  let w = 13.0;
  let dx = w / width;
  let dy = h / height;
  let x = -w / 2;

  for (let i = 0; i < width; i++) {
    let y = -h / 2;
    for (let j = 0; j < height; j++) {
      let r = sqrt(x * x + y * y);
      let theta = atan2(y, x);
      let val = sin(n * cos(r) + 15 * theta);

      let index = (i + j * width) * 4;
      let bright = (val + 1) * 255 / 2;


      let red = map(n, 0, h, 200, 255); 
      let green = map(h, 0, n, 20, 255); 
      let blue = map(val, -1, 1, h, 255);
      
      pixels[index] = green; 
      pixels[index + 1] = bright; 
      pixels[index + 2] = red; 
      pixels[index + 3] = 255;
      
      y += dy;
    }
    x += dx;
  }
  
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function full_screen_action() {
  button.fullScreenBtn.remove();
  fullscreen(true);
  
  setTimeout(() => {
    resizeCanvas(windowWidth, windowHeight);
  }, 500);
}