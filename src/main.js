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

  // New automata form
  $('#create-ca').on('submit', function (e) {
    e.preventDefault();
    resetAnimation();
    const width = parseInt(e.target.width.value);
    const startType = e.target.start.value;

    // Format rule
    let rule = parseInt(e.target.rule.value);
    const automataType = 'Rule ' + rule;
    rule = rule.toString(2).padStart(8, '0');
    rule = rule.split('').reverse().join('');

    M = new CA(width, rule, startType);
    setupCavas();

    // Set info text
    $('#automata-name').text(automataType);
    $('#rule-string').text(M.rule);
    $('.info').show();
    $('#automata').show();
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
          $(window).scrollTop($('#grid').offset().top);
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

  const boxSize = 35;
  const gap = 3;
  const sep = 5 * gap;

  // Define resolution once
  if (!$('#rule-display').attr('width')) {
    const totalBoxes = 8 * 3;
    $('#rule-display').attr('width', (totalBoxes * boxSize) + (totalBoxes * gap) + (8 * sep));
    $('#rule-display').attr('height', boxSize * 2 + sep + 2);
  }

  let ruleNum = 1;
  let boxNum = 0;

  // Draw boxes for each neighbourhood combination
  for (let r = 7; r >= 0; r--) {
    // Draw rule box
    ruleCtx.fillStyle = parseInt(M.rule[r]) ? 'black' : 'white';
    const x = Math.floor(((ruleNum * (boxSize * 3)) + (ruleNum * (gap * 3)) + (ruleNum * sep)) - ((boxSize * 2) + gap));
    ruleCtx.fillRect(x, (boxSize + sep), boxSize, boxSize);
    ruleCtx.fillStyle = 'black';
    /** @todo fix top stroke */
    ruleCtx.strokeRect(x, (boxSize + sep), boxSize, boxSize);

    // Draw state boxes
    const neighbourhood = r.toString(2).padStart(3, '0');
    for (let n = 0; n < 3; n++) {
      ruleCtx.fillStyle = parseInt(neighbourhood[n]) ? 'black' : 'white';
      const extraGap = (n == 0) ? sep : 0;
      const x = Math.floor((boxNum * boxSize) + (boxNum * gap) + ((ruleNum * sep) - extraGap) + extraGap);
      ruleCtx.fillRect(x, 0, boxSize, boxSize);
      ruleCtx.fillStyle = 'black';
      ruleCtx.strokeRect(x, 0, boxSize, boxSize);
      boxNum++;
    }
    ruleNum++;
  }
}

/**
 * Setup the canvas where the automata will be drawn
 * @function setupCavas
 * @todo better resolution
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
