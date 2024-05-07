const DEFAULT_GRID_SIZE = 16;
const MIN_GRID_SIZE = 16;
const MAX_GRID_SIZE = 64;
const DEFAULT_COLOR = "rgba(255, 0, 0, 1.0)";
const DEFAULT_STATUS = "Colour Mode";
const DEFAULT_COLOR_MODE_COLOR = "rgb(255, 255, 255)";
let customGridSize = DEFAULT_GRID_SIZE;
let gameStatus = DEFAULT_STATUS;
let squareColor = DEFAULT_COLOR;
let mouseDownStatus = false;

window.onload = () => initialiseGrid();

// Initialise event listeners
document
  .querySelector("#gameResetButton")
  .addEventListener("click", redrawGrid);
document
  .querySelector("#gridSizeSliderInput")
  .addEventListener("input", () => readSliderValue());
document.querySelector("#drawing-area-inner").onmousedown = () =>
  (mouseDownStatus = true);
document.querySelector("#drawing-area-inner").onmouseup = () =>
  (mouseDownStatus = false);
const modeSelectorButtons = document.querySelectorAll(".modeSelector");
modeSelectorButtons.forEach((elem) =>
  elem.addEventListener("click", chooseGameMode)
);
document
  .querySelector("#colorSelector")
  .addEventListener("input", setSquareColor);

function initialiseGrid() {
  // Select etch-a-sketch grid area
  const innerDrawingArea = getInnerDrawingArea();

  // Set grid size text
  const gridSizeSpan = document.querySelector("#grid-size");
  gridSizeSpan.textContent = `${customGridSize} x ${customGridSize}`;

  // Create divs
  createDivs(customGridSize);
  getInnerSize();

  // Initialise slider
  const sliderElement = document.querySelector("#gridSizeSliderInput");
  sliderElement.value = customGridSize;

  // Initialise status bar
  document.querySelector(".game-status").textContent = gameStatus;

  // Initialise color picker
  document.querySelector("#colorSelector").value = squareColor;
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
    let rowDiv = document.createElement("div");
    rowDiv.id = `row${row}-container`;
    innerDrawingArea.appendChild(rowDiv);
    rowDiv.style = "display: flex; width: 100%; background-color: white;";

    for (col = 0; col < gridSize; col++) {
      let colDiv = document.createElement("div");
      colDiv.id = `row${row}-col${col}-box`;
      rowDiv.appendChild(colDiv);
      colDiv.style = `height:${perSquareSize}px; width: ${perSquareSize}px; `;
      colDiv.classList = "drawing-square";
      colDiv.setAttribute("data-opacity", 1.0);
      colDiv.setAttribute("data-clicked", false);
      colDiv.addEventListener("mousemove", modifySquare);
      colDiv.addEventListener("mouseleave", () =>
        colDiv.setAttribute("data-clicked", false)
      );
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
}

function readSliderValue() {
  const sliderElement = document.querySelector("#gridSizeSliderInput");
  const gridSizeTextElement = document.querySelector("#grid-size");
  gridSizeTextElement.textContent = `${sliderElement.value} x ${sliderElement.value}`;
  customGridSize = sliderElement.value;
}

function modifySquare(event) {
  // Do not allow for overwriting the current colour of a cell
  if (!mouseDownStatus) return;

  if (gameStatus == "Colour Mode") {
    if (event.currentTarget.style.backgroundColor != "") return;
    // Get current square style
    let existingStyle = event.currentTarget.style;
    event.currentTarget.style.backgroundColor = squareColor;
    console.log(`modifying ${event.currentTarget.id}`);
  } else if (gameStatus == "RGB Mode") {
    if (event.currentTarget.style.backgroundColor != "") return;
    event.currentTarget.style.backgroundColor = getRandomColor();
  } else if (gameStatus == "Lighten Mode") {
    if (
      event.currentTarget.style.backgroundColor == "" ||
      event.currentTarget.getAttribute("data-clicked") == "true"
    )
      return;
    event.currentTarget.setAttribute("data-clicked", true);
    let currentBackgroundColor = event.currentTarget.style.backgroundColor;
    let rgba = currentBackgroundColor.match(/[\d.]+/g);

    // RGB value is the first 3 values
    let [r, g, b] = rgba.slice(0, 3);

    // Retrieve cell RGB value from data attribute
    let cellAlpha = event.currentTarget.getAttribute("data-opacity");
    cellAlpha = Math.max(parseFloat(cellAlpha) - 0.1, 0);
    event.currentTarget.setAttribute("data-opacity", cellAlpha);

    // Set the new opacity value of the cell
    event.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${cellAlpha})`;
    console.log(cellAlpha);
  } else if (gameStatus == "Darken Mode") {
    if (
      event.currentTarget.style.backgroundColor == "" ||
      event.currentTarget.getAttribute("data-clicked") == "true"
    )
      return;
    event.currentTarget.setAttribute("data-clicked", true);
    let currentBackgroundColor = event.currentTarget.style.backgroundColor;
    let rgba = currentBackgroundColor.match(/[\d.]+/g);

    // RGB value is the first 3 values
    let [r, g, b] = rgba.slice(0, 3);

    // Retrieve cell RGB value from data attribute
    let cellAlpha = event.currentTarget.getAttribute("data-opacity");
    cellAlpha = Math.min(parseFloat(cellAlpha) + 0.1, 1.0);
    event.currentTarget.setAttribute("data-opacity", cellAlpha);

    // Set the new opacity value of the cell
    event.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${cellAlpha})`;
    console.log(cellAlpha);
  }
}

function chooseGameMode(event) {
  gameStatus = event.currentTarget.value;
  document.querySelector(".game-status").textContent = gameStatus;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setSquareColor() {
  squareColor = document.querySelector("#colorSelector").value;
  console.log(squareColor);
}
