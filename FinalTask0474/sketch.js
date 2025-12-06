let song;
let fft;
let playing = false;

let colorModeType = 0; // 0: 기본색, 1: 무지개, 2: 반전
let playButtonX = 20, playButtonY = 20, btnW = 80, btnH = 40;

function preload() {
  
  song = loadSound('assets/alarmmusic.mp3');
}

function setup() {
  createCanvas(800, 600);
  fft = new p5.FFT();  // 주파수 분석기
}

function draw() {
  background(10);

  // 버튼 
  drawPlayStopButton();

  // 음악 실행 중일 때만 비주얼라이저 그리기
  if (playing) {
    let spectrum = fft.analyze();
    let amp = fft.getEnergy("bass");   // 저음
    let treble = fft.getEnergy("treble"); // 고음

    
    let bassSize = map(amp, 0, 255, 20, 300);
    let trebleSize = map(treble, 0, 255, 10, 200);

    let c = chooseColor(amp, treble);

    // ⬤ 원(ellipse) : 베이스 크기 변화
    fill(c.r, c.g, c.b, 180);
    noStroke();
    ellipse(width/2, height/2, bassSize, bassSize);

    // ◼ 사각형(rect) : 고음에 따라 회전/크기 변화
    push();
    translate(width/2, height/2);
    rotate(frameCount * 0.01);
    fill(c.r, c.g, c.b, 120);
    rectMode(CENTER);
    rect(0, 0, trebleSize * 1.2, trebleSize / 1.5);
    pop();

    // 〰 라인(line) : 주파수에 따라 흔들림
    stroke(c.r, c.g, c.b, 200);
    strokeWeight(3);
    let offset = map(amp, 0, 255, -50, 50);
    line(0, height/2 + offset, width, height/2 - offset);
  }
}


//색상 모드 
function chooseColor(amp, treble) {
  let r, g, b;

  if (colorModeType === 0) {
    // 기본: 저음 → 빨강, 고음 → 파랑
    r = map(amp, 0, 255, 50, 255);
    g = map(treble, 0, 255, 50, 200);
    b = map(treble, 0, 255, 100, 255);

  } else if (colorModeType === 1) {
    // 무지개 모드
    let hue = (frameCount % 360);
    colorMode(HSB);
    let col = color(hue, 255, 255);
    colorMode(RGB);
    r = red(col);
    g = green(col);
    b = blue(col);

  } else if (colorModeType === 2) {
    // 반전 모드
    let base = map(amp + treble, 0, 510, 255, 0);
    r = base;
    g = 255 - base;
    b = (amp + treble) % 255;
  }

  return { r, g, b };
}


//Play/Stop 버튼 UI
function drawPlayStopButton() {
  fill(playing ? "#ff4d4d" : "#4dff4d");
  rect(playButtonX, playButtonY, btnW, btnH, 10);

  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(playing ? "STOP" : "PLAY", playButtonX + btnW/2, playButtonY + btnH/2);
}

//마우스 클릭 → 음악 토글
function mousePressed() {
  // 버튼 영역 클릭 체크
  if (mouseX > playButtonX && mouseX < playButtonX + btnW &&
      mouseY > playButtonY && mouseY < playButtonY + btnH) {

    if (!playing) {
      song.play();
      playing = true;
    } else {
      song.stop();
      playing = false;
    }
  }
}

//c → 색상 모드 변경

function keyPressed() {
  if (key === 'c' || key === 'C') {
    colorModeType = (colorModeType + 1) % 3;
  }
}
