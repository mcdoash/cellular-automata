import './style.scss';
import { CA } from './automata.mjs';

// Globals
let M;
let cellSize, ctx;
// Rule display constants
const boxSize = 35;
const gap = 2;
const sep = 5 * gap;

setup();

/**
 * Setup DOM elements needed at start
 * @function setup
 */
function setup() {
  // Define canvas for drawing automaton
  ctx = $('#grid')[0].getContext('2d');

  // Set rule display resolution once
  const totalBoxes = 8 * 3;
  $('#rule-display').attr('width', (totalBoxes * boxSize) + (totalBoxes * gap) + (8 * sep));
  $('#rule-display').attr('height', boxSize * 2 + sep);

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
    const automataType = 'Rule ' + rule;
    rule = rule.toString(2).padStart(8, '0');
    rule = rule.split('').reverse().join('');

    M = new CA(colNum, rule);
    setupGrid();

    // Set info text
    $('#automata-name').text(automataType);
    $('#rule-string').text(M.rule);
    $('.info').show();
    $('#automata').show();
    drawRule();

    return false;
  });
}

/**
 *
 */
function drawRule() {
  const ruleCtx = $('#rule-display')[0].getContext('2d');

  let ruleNum = 1;
  let boxNum = 0;

  for (let r = 7; r >= 0; r--) {
    // Draw rule
    ruleCtx.fillStyle = parseInt(M.rule[r]) ? 'black' : 'white';
    const x = Math.floor(((ruleNum * (boxSize * 3)) + (ruleNum * (gap * 3)) + (ruleNum * sep)) - ((boxSize * 2) + gap));
    ruleCtx.fillRect(x, (boxSize + sep), boxSize, boxSize);

    // Draw state boxes
    const neighbourhood = r.toString(2).padStart(3, '0');
    for (let n = 0; n < 3; n++) {
      ruleCtx.fillStyle = parseInt(neighbourhood[n]) ? 'black' : 'white';
      const extraGap = (n == 0) ? sep : 0;
      const x = Math.floor((boxNum * boxSize) + (boxNum * gap) + ((ruleNum * sep) - extraGap) + extraGap);

      ruleCtx.fillRect(x, 0, boxSize, boxSize);
      boxNum++;
    }
    ruleNum++;
  }
}

/**
 * Setup the html grid elements
 * @function setupGrid
 * @todo dynamic grid height, better resolution
 */
function setupGrid() {
  const grid = $('#grid')[0];
  ctx.clearRect(0, 0, grid.width, grid.height);

  // Setup resolution
  const newWidth = Math.floor(150 / M.colNum) * M.colNum * 2;
  if (newWidth != grid.width) {
    grid.width = newWidth;
    cellSize = Math.floor(grid.width / M.colNum);
    grid.height = cellSize * 1000;
  }

  // Draw starting state
  drawRow();
}

/**
 *
 */
function drawRow() {
  // Draw all cells
  for (let c = 0; c < M.colNum; c++) {
    ctx.fillStyle = M.cells[c] ? 'black' : 'white';
    ctx.fillRect((cellSize * c), M.iteration * cellSize, cellSize, cellSize);
  }
}
