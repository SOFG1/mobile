const HOST =
  location.hostname !== "sofg1.github.io"
    ? "192.168.100.84:3000"
    : "https://socket-psli.onrender.com";

const socket = io(HOST);
window.socket = socket;

window.settings = {
  speed: "3000",
};

let soundInterval;
const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const input = document.querySelector(".number");
let circleElement = document.querySelector(".circle");

startBtn.addEventListener("click", (e) => {
  socket.emit("session", "start");
});

stopBtn.addEventListener("click", (e) => {
  socket.emit("session", "stop");
});

socket.on("session", (arg) => {
  if (arg === "start") start();
  if (arg === "stop") stop();
});

window.start = async function start() {
  startBtn.setAttribute("disabled", true);
  stopBtn?.removeAttribute("disabled");
  restartAnimation();
  const duration = window.settings.speed;
  circleElement.style.animationDuration = `${duration}ms`;
  clearInterval(soundInterval);
  soundInterval = setInterval(playAudio, duration / 2);
};

window.stop = function stop() {
  startBtn?.removeAttribute("disabled");
  stopBtn?.setAttribute("disabled", true);
  circleElement.classList.remove("started");
  clearInterval(soundInterval);
};

function playAudio() {
  if (!circleElement.classList.contains("started")) return;
  const audio = new Audio("1.wav");
  audio.play();
}

function restartAnimation() {
  circleElement.remove();
  circleElement = document.createElement("div");
  document.body.append(circleElement);
  circleElement.classList.add("circle");
  circleElement.classList.add("started");
}

/////////////Speed
//Settings
input?.addEventListener("change", (e) => {
  const regex = /^\d+$/;
  const val = e.target.value;
  if (!regex.test(val)) {
    e.target.value = settings.speed;
    return;
  }
  const num = Number(val);
  if (num < 3000 || num > 8000) {
    e.target.value = settings.speed;
    return;
  }
  settings.speed = e.target.value;
  socket.emit("settings", settings);
});
