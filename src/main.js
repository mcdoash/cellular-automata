import './style.scss';
import { CA } from './automata.mjs';
import { Presets } from './presets.mjs';

// Global automata variables
let M;
let automataType;
setup();

/**
 * Setup DOM elements needed at start
 * @function setup
 */
function setup() {
  // Animate/stop animation button
  let animate = false;
  let interval;
  $('button#animate').on('click', function () {
    const speed = $('#speed').val();

    if (!animate) {
      interval = setInterval(() => {
        const change = M.iterate();
        drawRow();
        if (!change) {
          clearInterval(interval);
          animate = false;
          $('button#animate').text('Animation Done').prop('disabled', true);
        }
      }, (speed * 1000));
      $(this).text('Stop Animation');
    }
    else {
      clearInterval(interval);
      $(this).text('Animate');
    }
    animate = !animate;
  });

  // Stop animation and reset button
  const resetAnimation = function () {
    clearInterval(interval);
    animate = false;
    $('button#animate').text('Animate').prop('disabled', false);
  };

  // Set iterate button
  $('button#iterate').on('click', () => {
    resetAnimation();
    M.iterate();
    drawRow();
  });

  // New automata form
  $('#create-ca').on('submit', function (e) {
    e.preventDefault();
    resetAnimation();
    const colNum = parseInt(e.target.cols.value);

    // Format rule
    let rule = parseInt(e.target.rule.value);
    automataType = 'Rule ' + rule;
    rule = rule.toString(2).padStart(8, '0');
    rule = rule.split('').reverse().join('');

    M = new CA(colNum, rule);
    setupGrid();

    return false;
  });
}

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupGrid() {
  // Set tall grid height for now
  const grid = $('#grid')[0];
  const cellSize = Math.floor(grid.width / M.colNum);
  $('#grid').attr('width', cellSize * M.colNum * 2);
  $('#grid').attr('height', cellSize * 1000);
  drawRow();

  $('#automata-name').text(automataType);
  $('#info').show();
  $('#automata').show();
}

function drawRow() {
  // Setup empty grid element
  const grid = $('#grid')[0];
  const ctx = grid.getContext('2d');
  const cellSize = Math.floor(grid.width / M.colNum);
  // Dynamically adjust height
  // $('#grid').attr('height', cellSize * (M.iteration + 1));

  // Init all grid cells
  for (let c = 0; c < M.colNum; c++) {
    ctx.fillStyle = M.cells[c] ? 'white' : 'black';
    ctx.fillRect((cellSize * c), M.iteration * cellSize, cellSize, cellSize);
  }
}
