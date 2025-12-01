// 예제: 가로 일렬 교차 배치 음악 비주얼라이저
// p5.js + p5.sound 필요

let song;
let fft;
let playBtn, stopBtn;

let bgHue = 200;

function preload() {
  // 자신의 파일 경로/프로젝트 구조에 맞게 수정
  song = loadSound("assets/alarmmusic.mp3");
}

function setup() {
  createCanvas(900, 300);
  colorMode(HSB, 360, 100, 100);

  fft = new p5.FFT(0.8, 64); // 평활화, 빈 수 64 정도
  fft.setInput(song);

  playBtn = createButton("play");
  stopBtn = createButton("stop");

  // 화면 하단 중앙 배치
  let btnY = height - 40;
  playBtn.position(width / 2 - 80, btnY);
  stopBtn.position(width / 2 + 20, btnY);

  playBtn.mousePressed(() => {
    if (!song.isPlaying()) {
      song.play();
    }
  });

  stopBtn.mousePressed(() => {
    if (song.isPlaying()) {
      song.stop(); // 멈추고 처음 위치로
    }
  });
}

function draw() {
  // 노래가 재생 중일 때만 배경 색을 랜덤하게 조금씩 변화
  if (song.isPlaying()) {
    bgHue += random(-3, 3);
    bgHue = (bgHue + 360) % 360;
  }
  background(bgHue, 60, 20);

  // 노래가 안 나올 때는 도형들도 멈춘(기본 크기) 상태로 유지
  if (!song.isPlaying()) {
    drawStaticShapes();
    return;
  }

  // 재생 중일 때: FFT 분석으로 도형 크기 변동
  let spectrum = fft.analyze(); // 0~255 값 배열

  drawReactiveShapes(spectrum);
}

function drawStaticShapes() {
  let count = 10;        // 사각형 10, 원 10
  let baseSize = 16;     // 기본 도형 크기 (높이)
  let gap = baseSize * 0.5;
  let totalWidth = count * baseSize + (count - 1) * gap;
  let startX = (width - totalWidth) / 2;
  let y = height / 2;

  noStroke();
  fill(0, 0, 90); // 밝은 회색 계열

  for (let i = 0; i < count * 2; i++) {
    let x = startX + (baseSize + gap) * i;
    if (i % 2 === 0) {
      rectMode(CENTER);
      rect(x, y, baseSize, baseSize);
    } else {
      ellipse(x, y, baseSize, baseSize);
    }
  }
}

function drawReactiveShapes(spectrum) {
  let count = 10;
  let baseSize = 16;
  let gap = baseSize * 0.5;
  let totalWidth = (count * 2) * baseSize + ((count * 2) - 1) * gap;
  let startX = (width - totalWidth) / 2;
  let y = height / 2;

  noStroke();

  for (let i = 0; i < count * 2; i++) {
    // 낮은 주파수부터 높은 주파수까지 고르게 매핑
    let index = floor(map(i, 0, count * 2 - 1, 0, spectrum.length - 1));
    let amp = spectrum[index]; // 0~255
    let len = baseSize + map(amp, 0, 255, 0, 120); // 길이(높이) 증폭

    // 색상도 주파수/크기에 비례해서 변화
    let hue = map(amp, 0, 255, 180, 340);
    let sat = map(amp, 0, 255, 40, 100);
    let bri = map(amp, 0, 255, 50, 100);
    fill(hue, sat, bri);

    let x = startX + (baseSize + gap) * i;

    if (i % 2 === 0) {
      // 사각형: 세로 길이 len
      rectMode(CENTER);
      rect(x, y, baseSize, len);
    } else {
      // 원: 세로 지름 len
      ellipse(x, y, baseSize, len);
    }
  }
}
