// Configuración predeterminada
const DEFAULT_COLOR = "#333333";
const DEFAULT_MODE = "color";
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;
let moveCount = 0;

const colorPicker = document.getElementById("colorPicker");
const colorBtn = document.getElementById("colorBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");
const moveCountDisplay = document.getElementById("moveCount");
const downloadBtn = document.getElementById("downloadBtn");
const grid = document.getElementById("grid");
const themeToggle = document.getElementById("themeToggle");

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

colorPicker.addEventListener("input", (e) => (currentColor = e.target.value));
colorBtn.addEventListener("click", () => setMode("color"));
rainbowBtn.addEventListener("click", () => setMode("rainbow"));
eraserBtn.addEventListener("click", () => setMode("eraser"));
clearBtn.addEventListener("click", resetGrid);
sizeSlider.addEventListener("input", (e) => updateSize(e.target.value));
downloadBtn.addEventListener("click", downloadGrid);
themeToggle.addEventListener("click", toggleTheme);

function setMode(mode) {
  currentMode = mode;
  updateActiveButton(mode);
}

function updateActiveButton(mode) {
  [colorBtn, rainbowBtn, eraserBtn].forEach((btn) =>
    btn.classList.remove("active")
  );
  if (mode === "color") colorBtn.classList.add("active");
  if (mode === "rainbow") rainbowBtn.classList.add("active");
  if (mode === "eraser") eraserBtn.classList.add("active");
}

function updateSize(value) {
  sizeValue.textContent = `${value} x ${value}`;
  currentSize = value;
  resetGrid();
}

function resetGrid() {
  grid.innerHTML = "";
  setupGrid(currentSize);
  moveCount = 0;
  updateMoveCount();
}

function setupGrid(size) {
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-element");
    cell.style.opacity = "0"; // Para el efecto de oscurecimiento progresivo
    cell.addEventListener("mouseover", changeColor);
    cell.addEventListener("mousedown", changeColor);
    grid.appendChild(cell);
  }
}

function changeColor(e) {
  if (e.type === "mouseover" && !mouseDown) return;
  moveCount++;
  updateMoveCount();
  const cell = e.target;

  if (currentMode === "rainbow") {
    // Genera un color RGB aleatorio
    const randomColor = `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;
    cell.style.backgroundColor = randomColor;
    increaseOpacity(cell); // Oscurecimiento progresivo
  } else if (currentMode === "color") {
    cell.style.backgroundColor = currentColor;
    increaseOpacity(cell); // Oscurecimiento progresivo
  } else if (currentMode === "eraser") {
    cell.style.backgroundColor = "transparent";
    cell.style.opacity = "0"; // Reinicia opacidad al borrar
  }
}

function increaseOpacity(cell) {
  // Incrementa opacidad en un 10% hasta llegar a 1 (completamente oscuro)
  const currentOpacity = parseFloat(cell.style.opacity) || 0;
  if (currentOpacity < 1) {
    cell.style.opacity = (currentOpacity + 0.1).toFixed(1);
  }
}

function updateMoveCount() {
  moveCountDisplay.textContent = `Movimientos: ${moveCount}`;
}

function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function downloadGrid() {
  html2canvas(grid).then((canvas) => {
    const link = document.createElement("a");
    link.download = "grid.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function toggleTheme() {
  const theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "Modo Claro" : "Modo Oscuro";
}

window.onload = () => {
  setupGrid(DEFAULT_SIZE);
  setMode(DEFAULT_MODE);
};
