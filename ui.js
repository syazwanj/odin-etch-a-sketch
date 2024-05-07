const DEFAULT_GRID_SIZE = 16;
const MIN_GRID_SIZE = 16;
const MAX_GRID_SIZE = 64;
const DEFAULT_COLOR = "#ff0000";
const DEFAULT_STATUS = "Colour Mode";
const DEFAULT_COLOR_MODE_COLOR = "#FFFFFF";
let customGridSize = DEFAULT_GRID_SIZE;
let gameStatus = DEFAULT_STATUS;
let squareColor = DEFAULT_COLOR;
let mouseDown = false;

window.onload = () => initialiseGrid();

// Initialise event listeners
document
  .querySelector("#gameResetButton")
  .addEventListener("click", redrawGrid);
document
  .querySelector("#gridSizeSliderInput")
  .addEventListener("input", () => readSliderValue());
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function initialiseGrid() {
  // Select etch-a-sketch grid area
  const innerDrawingArea = getInnerDrawingArea();

  // Set grid size text
  const gridSizeSpan = document.querySelector("#grid-size");
  gridSizeSpan.textContent = `${customGridSize} x ${customGridSize}`;

  // Create divs
  createDivs(customGridSize);
  getInnerSize();

  // Initialise slider and pass event handler
  const sliderElement = document.querySelector("#gridSizeSliderInput");
  sliderElement.value = customGridSize;
}

function createDivs(gridSize) {
  const innerDrawingArea = getInnerDrawingArea();
  const totalSquareSize = getInnerSize();
  const perSquareSize = calculateSquareSize(totalSquareSize[0], gridSize);

  if (gridSize < MIN_GRID_SIZE || gridSize > MAX_GRID_SIZE) {
    console.log(`Grid size exceeds limits. Defaulting to ${MIN_GRID_SIZE}.`);
    gridSize = MIN_GRID_SIZE;
  }

  for (row = 0; row < gridSize; row++) {
    console.log("creating divs!");
    let rowDiv = document.createElement("div");
    rowDiv.id = `row${row}-container`;
    innerDrawingArea.appendChild(rowDiv);
    rowDiv.style = "display: flex; width: 100%; background-color: white;";

    for (col = 0; col < gridSize; col++) {
      let colDiv = document.createElement("div");
      colDiv.id = `row${row}-col${col}-box`;
      rowDiv.appendChild(colDiv);
      // colDiv.innerHTML = `${row}-${col}`;
      colDiv.style = `height:${perSquareSize}px; width: ${perSquareSize}px;`;
      colDiv.classList = "drawing-square";
      colDiv.addEventListener("mousemove", modifySquare);
    }
  }
}

function getInnerDrawingArea() {
  return document.querySelector("#drawing-area-inner");
}
function getInnerSize() {
  const innerDrawingArea = getInnerDrawingArea();
  const innerWidth = innerDrawingArea.offsetWidth;
  const innerHeight = innerDrawingArea.offsetHeight;

  return [innerWidth, innerHeight];
}

function calculateSquareSize(totalSquareSize, gridSize) {
  return totalSquareSize / gridSize;
}

// Event Listeners
function redrawGrid() {
  getInnerDrawingArea().innerHTML = "";
  initialiseGrid();
  console.log("redrawing grid!");
}

function readSliderValue() {
  const sliderElement = document.querySelector("#gridSizeSliderInput");
  const gridSizeTextElement = document.querySelector("#grid-size");
  gridSizeTextElement.textContent = `${sliderElement.value} x ${sliderElement.value}`;
  customGridSize = sliderElement.value;
}

function modifySquare(event) {
  if (gameStatus == "Colour Mode") {
    if (!mouseDown) return;
    // Get current square style
    let existingStyle = event.currentTarget.style;
    event.currentTarget.style.backgroundColor = squareColor;
    console.log(event);
    console.log(`modifying ${event.currentTarget.id}`);
  }
}
