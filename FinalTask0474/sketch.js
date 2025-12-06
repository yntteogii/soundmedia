let song;
let fft;
let playing = false;

let playButtonX = 20, playButtonY = 20, btnW = 80, btnH = 40;

function preload() {
  song = loadSound('assets/alarmmusic.mp3');
}

function setup() {
  createCanvas(800, 600);
  fft = new p5.FFT();
}

function draw() {
  background(20);

  fill(playing ? "#ff5959" : "#59ff59");
  rect(playButtonX, playButtonY, btnW, btnH, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  text(playing ? "STOP" : "PLAY", playButtonX + btnW/2, 
playButtonY + btnH/2);

  if (playing) {
    let bass = fft.getEnergy("bass");
    let treble = fft.getEnergy("treble");

    let bassSize = map(bass, 0, 255, 50, 200);
    let trebleSize = map(treble, 0, 255, 20, 120);
    let shake = map(bass, 0, 255, -30, 30);

    ellipse(width/2, height/2, bassSize);
    rectMode(CENTER);
    rect(width/2, height/2, trebleSize, trebleSize / 2);

    line(0, height/2 + shake, width, height/2 - shake);
  }
}

function mousePressed() {
  if (
    mouseX > playButtonX && mouseX < playButtonX + btnW &&
    mouseY > playButtonY && mouseY < playButtonY + btnH
  ) {
    if (!playing) {
      song.play();
      playing = true;
    } else {
      song.stop();
      playing = false;
    }
  }
}
