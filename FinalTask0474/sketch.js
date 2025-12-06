let song;               // 오디오 파일
let fft;                // 주파수 분석기
let playing = false;    // 재생 여부

let colorModeType = 0;  // 색상 모드
let playButtonX = 20, playButtonY = 20, btnW = 80, btnH = 40;

function preload() {
  song = loadSound('assets/alarmmusic.mp3');  // 음악 로드
}

function setup() {
  createCanvas(800, 600);
  fft = new p5.FFT();  // FFT 생성
}

function draw() {
  background(15);

  drawPlayStopButton(); // 재생/정지 버튼 UI

  if (playing) {
    let spectrum = fft.analyze(); // 전체 주파수 분석
    let bass = fft.getEnergy("bass");      // 저음 값
    let treble = fft.getEnergy("treble");  // 고음 값

    // 오디오 값 → 시각적 속성 매핑
    let bassSize = map(bass, 0, 255, 50, 350);
    let trebleSize = map(treble, 0, 255, 20, 250);
    let shake = map(bass, 0, 255, -80, 80);

    let c = chooseColor(bass, treble); // 색상 결정

    // ● 원 (저음 반응)
    fill(c.r, c.g, c.b, 190);
    noStroke();
    ellipse(width/2, height/2, bassSize);

    // ■ 회전 사각형 (고음 반응)
    push();
    translate(width/2, height/2);
    rotate(frameCount * 0.015);
    fill(c.r, c.g, c.b, 130);
    rectMode(CENTER);
    rect(0, 0, trebleSize * 1.3, trebleSize / 1.4);
    pop();

    // — 라인 (저음 흔들림)
    stroke(c.r, c.g, c.b, 220);
    strokeWeight(4);
    line(0, height/2 + shake, width, height/2 - shake);
  }
}

// 색상 모드 함수
function chooseColor(bass, treble) {
  let r, g, b;

  if (colorModeType === 0) {
    r = map(bass, 0, 255, 80, 255);
    g = map(treble, 0, 255, 50, 200);
    b = map(treble, 0, 255, 120, 255);

  } else if (colorModeType === 1) {
    let hue = frameCount % 360;
    colorMode(HSB);
    let col = color(hue, 255, 255);
    colorMode(RGB);
    r = red(col);
    g = green(col);
    b = blue(col);

  } else {
    let base = map(bass + treble, 0, 510, 255, 0);
    r = base;
    g = 255 - base;
    b = (bass + treble) % 255;
  }

  return { r, g, b };
}

// 버튼 UI
function drawPlayStopButton() {
  fill(playing ? "#ff5959" : "#59ff59");
  rect(playButtonX, playButtonY, btnW, btnH, 10);

  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(playing ? "STOP" : "PLAY", playButtonX + btnW/2, playButtonY + btnH/2);
}

// 클릭 → 재생/정지
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

// 키보드 C → 색상 모드 변경
function keyPressed() {
  if (key === 'c' || key === 'C') {
    colorModeType = (colorModeType + 1) % 3;
  }
}
