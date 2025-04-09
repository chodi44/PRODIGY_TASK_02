let startTime = null;
let elapsed = 0;
let stopwatchInterval = null;

function getSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector(".segment-display");
  const top = segmentDisplay.querySelector(".segment-display__top");
  const bottom = segmentDisplay.querySelector(".segment-display__bottom");
  const overlay = segmentDisplay.querySelector(".segment-overlay");
  const overlayTop = overlay.querySelector(".segment-overlay__top");
  const overlayBottom = overlay.querySelector(".segment-overlay__bottom");

  return { top, bottom, overlay, overlayTop, overlayBottom };
}

function updateSegment(segmentElement, value) {
  const seg = getSegmentElements(segmentElement);
  const current = parseInt(seg.top.textContent, 10);

  if (current === value) return;

  seg.overlayTop.textContent = value;
  seg.overlayBottom.textContent = value;
  seg.top.textContent = value;
  seg.bottom.textContent = value;

  seg.overlay.classList.remove("flip");
  void seg.overlay.offsetWidth;
  seg.overlay.classList.add("flip");

  const onAnimationEnd = () => {
    seg.top.textContent = value;
    seg.bottom.textContent = value;
    seg.overlay.classList.remove("flip");
    seg.overlay.removeEventListener("animationend", onAnimationEnd);
  };

  seg.overlay.addEventListener("animationend", onAnimationEnd);
}

function updateTimeSection(id, value, isMilliseconds = false) {
  if (isMilliseconds) {
    const hundreds = Math.floor(value / 100);
    const tens = Math.floor((value % 100) / 10);
    const ones = value % 10;
    const section = document.getElementById(id);
    const segments = section.querySelectorAll(".time-segment");

    updateSegment(segments[0], hundreds);
    updateSegment(segments[1], tens);
    updateSegment(segments[2], ones);
  } else {
    const first = Math.floor(value / 10);
    const second = value % 10;
    const section = document.getElementById(id);
    const segments = section.querySelectorAll(".time-segment");

    updateSegment(segments[0], first);
    updateSegment(segments[1], second);
  }
}

function updateDisplay() {
  const totalMilliseconds = elapsed;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = totalMilliseconds % 1000;

  updateTimeSection("hours", hours);
  updateTimeSection("minutes", minutes);
  updateTimeSection("seconds", seconds);
  updateTimeSection("milliseconds", milliseconds, true);
}

function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = Date.now() - elapsed;
    stopwatchInterval = setInterval(() => {
      elapsed = Date.now() - startTime;
      updateDisplay();
    }, 10);
  }
}

function pauseStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  pauseStopwatch();
  elapsed = 0;
  updateDisplay();
  document.getElementById("lapTimes").innerHTML = "";
}

function lapStopwatch() {
  const totalMilliseconds = elapsed;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const milliseconds = String(totalMilliseconds % 1000).padStart(3, "0");
  const lapTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  const lapEntry = document.createElement("div");
  lapEntry.textContent = lapTime;
  document.getElementById("lapTimes").prepend(lapEntry);
}