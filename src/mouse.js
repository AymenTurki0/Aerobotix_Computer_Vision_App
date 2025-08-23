function initMouseTracking() {
  const box = document.getElementById("mouse-box");
  const label = document.getElementById("mouse-label");
  const miniCam = document.getElementById("mini-cam");
  const dot = document.getElementById("cam-dot");

  if (!box || !label || !miniCam || !dot) {
    console.error("Mouse elements not found!");
    return;
  }

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Show yellow detection box
    box.classList.remove("hidden");
    box.style.left = (x - 24) + "px"; // half of 48
    box.style.top = (y - 24) + "px";

    // Update label
    label.textContent = "mouse 0.8";

    // Update mini camera dot position
    const scaleX = (x / window.innerWidth) * miniCam.clientWidth;
    const scaleY = (y / window.innerHeight) * miniCam.clientHeight;
    dot.style.left = scaleX + "px";
    dot.style.top = scaleY + "px";
  });
}
