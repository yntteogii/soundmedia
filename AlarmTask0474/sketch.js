let button, button2, button3;  
let stopButton;

let hours, minutes, seconds;
let hours2, minutes2, seconds2;
let hours3, minutes3, seconds3;

let targetTimes = [null, null, null];   
let alarmStarted = [false, false, false];

let alarmSound;          

function preload() {
  alarmSound = loadSound('assets/alarmmusic.mp3');
}

function setup() {
  createCanvas(400, 200);
  
  createInput();

  // 알람 1
  hours = createInput();
  hours.size(20);
  hours.position(20, 65); 

  minutes = createInput(); 
  minutes.size(20);
  minutes.position(50, 65); 

  seconds = createInput(); 
  seconds.size(20);
  seconds.position(80, 65);

  button = createButton('set1'); 
  button.position(130, 65); 
  button.mousePressed(function(){ setTime(0); });

  // 알람 2
  hours2 = createInput();
  hours2.size(20);
  hours2.position(20, 95); 

  minutes2 = createInput(); 
  minutes2.size(20);
  minutes2.position(50, 95); 

  seconds2 = createInput(); 
  seconds2.size(20);
  seconds2.position(80, 95);

  button2 = createButton('set2'); 
  button2.position(130, 95); 
  button2.mousePressed(function(){ setTime(1); });

  // 알람 3
  hours3 = createInput();
  hours3.size(20);
  hours3.position(20, 125); 

  minutes3 = createInput(); 
  minutes3.size(20);
  minutes3.position(50, 125); 

  seconds3 = createInput(); 
  seconds3.position(80, 125);
  seconds3.size(20);

  button3 = createButton('set3'); 
  button3.position(130, 125); 
  button3.mousePressed(function(){ setTime(2); });

  // 알람 멈추기
  stopButton = createButton('stop');
  stopButton.position(20, 160);
  stopButton.mousePressed(stopAlarm);

  textSize(14);
}

function draw() {
  background(220);

  fill(0);
  // 행제목
  text("시", 25, 55);
  text("분", 55, 55);
  text("초", 85, 55);
  text("남은시간", 200, 55);

  let now = new Date();

  // 남은시간
  drawRemainingTime(0, now, 200, 78);
  drawRemainingTime(1, now, 200, 108);
  drawRemainingTime(2, now, 200, 138);

  // 알람 시작하면 로그 찍기
  for (let i = 0; i < 3; i++) {
    if (targetTimes[i] && !alarmStarted[i]) {
      if (now >= targetTimes[i]) {
        if (!alarmSound.isPlaying()) {
          alarmSound.loop();
        }
        alarmStarted[i] = true;
        console.log("알람 " + (i+1) + " 시작");
      }
    }
  }
}

function setTime(index) {
  let h, m, s;

  if (index === 0) {
    h = int(hours.value());
    m = int(minutes.value());
    s = int(seconds.value());
  } else if (index === 1) {
    h = int(hours2.value());
    m = int(minutes2.value());
    s = int(seconds2.value());
  } else if (index === 2) {
    h = int(hours3.value());
    m = int(minutes3.value());
    s = int(seconds3.value());
  }

  let now = new Date();
  let t = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    h, m, s, 0
  );

  if (t <= now) {
    t.setDate(t.getDate() + 1);
  }

  targetTimes[index] = t;
  alarmStarted[index] = false;
}

function drawRemainingTime(index, now, x, y) {
  if (!targetTimes[index]) {
    text("-", x, y);
    return;
  }

  if (alarmStarted[index]) {
    text("알람 울림", x, y);
    return;
  }

  let diff = targetTimes[index] - now;
  if (diff < 0) diff = 0;

  let totalSec = int(diff / 1000);
  let rh = floor(totalSec / 3600);
  let rm = floor((totalSec % 3600) / 60);
  let rs = totalSec % 60;

  let txt = nf(rh, 2) + ":" + nf(rm, 2) + ":" + nf(rs, 2);
  text(txt, x, y);
}

function stopAlarm() {
  if (alarmSound.isPlaying()) {
    alarmSound.stop();
  }
}
