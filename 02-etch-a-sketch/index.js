let grids = [];
let gridArea = document.createElement('div');
let body = document.querySelector('body');
const gridAreaSize = 800; // in pixel

let gridCount;
while (isNotNumeric(gridCount)) {
  gridCount = prompt('How many grids do you want?', 16);
}
gridCount = Number(gridCount);
gridCount = Math.min(gridCount, 100);
let gridSize = gridAreaSize / gridCount;

function isNotNumeric(str) {
  return isNaN(str) || isNaN(parseFloat(str))
}

function randomNumber255() {
  return Math.floor(Math.random() * 255);
}

function randomRGB() {
  let rgb = [];
  for (let i = 0; i < 3; i++) {
    rgb.push(randomNumber255());
  }
  return `rgb(${rgb.join(',')})`;
}

function createBackgroundColor() {
  this.style.backgroundColor = randomRGB();
}

function removeBackgroundColor() {
  this.style.backgroundColor = 'transparent';
}

function createGrid() {
  let grid = document.createElement('div');
  grid.classList.add('grid');
  grid.style.width = `${gridSize}px`;
  grid.style.height = `${gridSize}px`;
  grid.addEventListener('mouseenter', createBackgroundColor);
  grid.addEventListener('mouseleave', removeBackgroundColor);
  return grid;
}

function createGridRow() {
  let gridRow = document.createElement('div');
  gridRow.classList.add('grid-row');
  return gridRow;
}

body.classList.add('flex-center');
body.setAttribute('id', 'body');

gridArea.setAttribute('id', 'grid-area');
gridArea.style.width = `${gridAreaSize}px`;
gridArea.style.height = `${gridAreaSize}px`;

for (let i = 0; i < gridCount; i++) {
  grids.push(createGridRow());
  for (let j = 0; j < gridCount; j++) {
    grids[i].appendChild(createGrid());
  }
}

grids.forEach((grid) => {
  gridArea.appendChild(grid);
});


body.appendChild(gridArea);