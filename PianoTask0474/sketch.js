let osc, fft;
let whiteKeys = 8;
let blackKeys = [1,2,4,5,6];
let whiteFreqs = [261.6256, 293.6648, 329.6276, 349.2282, 392.0000, 440.0000, 493.8833, 523.2519];
let blackFreqs = [277.1826, 311.1270, 369.9944, 415.3047, 466.1638];
let whiteNotes = ['C(도)', 'D(레)', 'E(미)', 'F(파)', 'G(솔)', 'A(라)', 'B(시)', 'C(도)'];
let blackNotes = ['C#(도#)', 'D#(레#)', 'F#(파#)', 'G#(솔#)', 'A#(라#)'];

let currentNote = '';
let currentFreq = 0;

function setup() {
  createCanvas(400, 200);
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  fft = new p5.FFT();
}

function draw() {
  background(220);

  // 건반 그리기
  for (let i = 0; i < whiteKeys; i++) {
    fill(255);
    stroke(0);
    rect(i * width / whiteKeys, 0, width / whiteKeys, 160);
  }
  for (let i = 0; i < blackKeys.length; i++) {
    let x = (blackKeys[i] - 0.5) * (width / whiteKeys);
    fill(0);
    noStroke();
    rect(x, 0, width / whiteKeys * 0.6, 100);
  }

  // 누른 건반의 음계 및 주파수를 하단에 텍스트로 표시
  textSize(22);
  textAlign(CENTER, CENTER);
  fill(0);
  if (currentNote !== '') {
    text( currentNote + ' : ' + nf(currentFreq, 0, 4) + ' Hz', width / 2, 180);
  } else {
    text(width / 2, height - 12);
  }


  let spectrum = fft.analyze();
  noStroke();
  //fill(0, 255, 255, 150);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
}

function mousePressed() {
  // 검은 건반
  for (let i = 0; i < blackKeys.length; i++) {
    let x = (blackKeys[i] - 0.5) * width / whiteKeys;
    let w = width / whiteKeys * 0.6;
    let h = 100;
    if (mouseX > x && mouseX < x + w && mouseY < h) {
      osc.freq(blackFreqs[i]);
      osc.start();
      osc.amp(0.5, 0.1);
      currentNote = blackNotes[i];
      currentFreq = blackFreqs[i];
      return;
    }
  }
  // 흰 건반
  for (let i = 0; i < whiteKeys; i++) {
    let x = i * width / whiteKeys;
    let w = width / whiteKeys;
    if (mouseX > x && mouseX < x + w && mouseY > 0 && mouseY < 160) {
      osc.freq(whiteFreqs[i]);
      osc.start();
      osc.amp(0.5, 0.1);
      currentNote = whiteNotes[i];
      currentFreq = whiteFreqs[i];
      return;
    }
  }
}

function mouseReleased() {
  osc.amp(0, 0.2);
}
