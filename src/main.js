import './style.scss';
import { CA } from './automata.mjs';

// Globals
let M;
let cellSize;
let canvas;
let offscreenCanvas;

setup();

/**
 * Setup DOM elements needed at start
 * @function setup
 */
function setup() {
  // Define canvases for drawing automaton
  canvas = $('#grid')[0];
  canvas.ctx = canvas.getContext('2d');
  offscreenCanvas = $('<canvas>')[0];
  offscreenCanvas.ctx = offscreenCanvas.getContext('2d');

  // Set max lattice width
  const setMaxWidth = function () {
    const maxWidth = Math.floor($(window).width());
    $('#width').attr('max', maxWidth);
  };
  setMaxWidth();
  $(window).on('resize', setMaxWidth);

  // Create ECA on form submission
  $('#create-ca').on('submit', function (e) {
    e.preventDefault();
    resetAnimation();

    const width = parseInt(e.target.width.value);
    const startType = e.target.start.value;
    const boundaryType = e.target.boundary.value;
    const rule = parseInt(e.target.rule.value);

    M = new CA(rule, width, startType, boundaryType);

    // Set info text
    $('#automata-name').text('Rule ' + rule);
    $('#rule-string').text(rule.toString(2).padStart(8, '0'));
    $('.info').show();
    $('#automata').show();

    // Clear canvases and draw first row
    setupCavas();
    drawRule();

    return false;
  });

  // Animate/stop animation button
  let animate = false;
  let interval;
  $('button#animate').on('click', function () {
    const speed = $('#speed').val();

    if (!animate) {
      interval = setInterval(() => {
        M.step();
        drawRow();
        // Scroll down if autoscroll selected
        if ($('#scroll').is(':checked')) {
          $(window).scrollTop($('#grid').offset().top + $('#grid').height());
        }
        // Check if canvas limit reached
        if (canvas.height >= offscreenCanvas.height) {
          clearInterval(interval);
          $(this).text('End of Animation').attr('disabled', 'disabled');
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
  const resetAnimation = () => {
    clearInterval(interval);
    animate = false;
    $('button#animate').text('Animate');
  };

  // Set step button
  $('button#step').on('click', () => {
    resetAnimation();
    M.step();
    drawRow();
  });
}

/**
 * Draw a visual representation of the current rule
 * @function drawRule
 */
function drawRule() {
  const ruleCtx = $('#rule-display')[0].getContext('2d');
  const totalBoxes = 8 * 3;
  const maxWidth = $('#width').attr('max') * 2;
  const boxSize = Math.floor(maxWidth / totalBoxes);
  const gap = Math.floor(boxSize * 0.1); // Between boxes in a rule
  const sep = 5 * gap; // Between rules

  // Define resolution
  $('#rule-display').attr('width', ((totalBoxes * boxSize) + (totalBoxes * gap) + (8 * sep)));
  $('#rule-display').attr('height', ((boxSize * 2) + (sep / 2) + (gap / 2)));
  ruleCtx.lineWidth = Math.floor(gap / 2);

  // Draw boxes for each neighbourhood combination
  let ruleNum = 1;
  let boxNum = 0;
  for (let r = 7; r >= 0; r--) {
    // Draw rule box
    ruleCtx.beginPath();
    ruleCtx.fillStyle = parseInt(M.rule[r]) ? 'black' : 'white';
    const x = Math.floor(((ruleNum * (boxSize * 3)) + (ruleNum * (gap * 3)) + (ruleNum * sep)) - ((boxSize * 2) + (gap * 2)));
    ruleCtx.rect(x, (boxSize + (sep / 2) + (ruleCtx.lineWidth / 2)), boxSize, boxSize);
    ruleCtx.fill();
    ruleCtx.stroke();

    // Draw state boxes
    const neighbourhood = r.toString(2).padStart(3, '0');
    for (let n = 0; n < 3; n++) {
      ruleCtx.beginPath();
      ruleCtx.fillStyle = parseInt(neighbourhood[n]) ? 'black' : 'white';
      const extraGap = (n == 0) ? sep : 0;
      const x = Math.floor((boxNum * boxSize) + (boxNum * gap) + ((ruleNum * sep) - extraGap) + extraGap);
      ruleCtx.rect(x, (ruleCtx.lineWidth / 2), boxSize, boxSize);
      ruleCtx.fill();
      ruleCtx.stroke();
      boxNum++;
    }
    ruleNum++;
  }
}

/**
 * Setup the canvas where the automata will be drawn
 * @function setupCavas
 * @todo fix max width
 */
function setupCavas() {
  // Setup canvas resolution
  const maxWidth = $('#width').val();
  canvas.width = Math.floor(maxWidth / M.width) * M.width;
  cellSize = Math.max(Math.floor(canvas.width / M.width), 1);
  canvas.height = cellSize;

  // Setup offscreen canvas
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height * 5000;

  // Draw starting state
  drawRow();
}

/**
 * Draw the current state of the automaton as a new row in the canvas
 * @function drawRow
 */
function drawRow() {
  // Draw new row in offscreen canvas
  for (let c = 0; c < M.width; c++) {
    offscreenCanvas.ctx.fillStyle = M.cells[c] ? 'black' : 'white';
    offscreenCanvas.ctx.fillRect((cellSize * c), M.time * cellSize, cellSize, cellSize);
  }
  // Increase canvas height and draw image
  canvas.height += cellSize;
  canvas.ctx.drawImage(offscreenCanvas, 0, 0);
}
