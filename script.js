const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const opacity = document.getElementById("opacity");
const brushType = document.getElementById("brushType");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const eraserButton = document.getElementById("eraser");
const canvasSizeModal = document.getElementById("canvasSizeModal");
const setCanvasSizeButton = document.getElementById("setCanvasSize");
const canvasContainer = document.getElementById("canvasContainer");
const controls = document.getElementById("controls");

let drawing = false;
let currentPath = [];
let paths = [];
let undonePaths = [];
let isEraser = false;

setCanvasSizeButton.addEventListener("click", () => {
  const width = document.getElementById("canvasWidth").value;
  const height = document.getElementById("canvasHeight").value;
  setCanvasSize(width, height);
  canvasSizeModal.style.display = "none";
  canvasContainer.style.display = "flex";
  controls.style.display = "flex";
});

const setCanvasSize = (width, height) => {
  canvas.width = width;
  canvas.height = height;
};

eraserButton.addEventListener("click", () => {
  isEraser = !isEraser;
  eraserButton.classList.toggle("active", isEraser);
});

const startDrawing = (e) => {
  drawing = true;
  currentPath = [];
  addPoint(e);
};

const addPoint = (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const offsetX = 5; // Add an offset to the cursor position
  const offsetY = 5; // Add an offset to the cursor position
  currentPath.push({
    x: e.clientX - rect.left - offsetX,
    y: e.clientY - rect.top - offsetY,
    color: isEraser ? "#FFFFFF" : colorPicker.value,
    size: brushSize.value,
    opacity: opacity.value,
    type: brushType.value,
  });
  draw();
};

const stopDrawing = () => {
  if (drawing) {
    drawing = false;
    paths.push([...currentPath]);
    currentPath = [];
    undonePaths = [];
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.forEach((path) => drawPath(path));
  drawPath(currentPath);
};

const drawPath = (path) => {
  ctx.beginPath();
  path.forEach((point, index) => {
    ctx.strokeStyle = point.color;
    ctx.lineWidth = point.size;
    ctx.globalAlpha = point.opacity;
    ctx.lineCap = point.type;
    ctx.lineJoin = "round";

    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", addPoint);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

undoButton.addEventListener("click", () => {
  if (paths.length > 0) {
    undonePaths.push(paths.pop());
    draw();
  }
});

redoButton.addEventListener("click", () => {
  if (undonePaths.length > 0) {
    paths.push(undonePaths.pop());
    draw();
  }
});

// Initial setup: show canvas size modal and hide canvas container and controls
canvasContainer.style.display = "none";
controls.style.display = "none";
canvasSizeModal.style.display = "block";

// Make canvas responsive
window.addEventListener("resize", () => {
  const aspectRatio = canvas.width / canvas.height;
  const newWidth = canvasContainer.clientWidth;
  const newHeight = newWidth / aspectRatio;
  setCanvasSize(newWidth, newHeight);
  draw();
});
