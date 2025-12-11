import './style.scss';
import { ECA } from './automata.mjs';

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
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  offscreenCanvas = $('<canvas>')[0];
  offscreenCanvas.ctx = offscreenCanvas.getContext('2d', { alpha: false });

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

    M = new ECA(rule, width, startType, boundaryType);

    // Set info text
    $('#automata-name').text('Rule ' + rule);
    $('#rule-string').text(rule.toString(2).padStart(8, '0'));
    $('#app-info').hide();
    $('.info').show();
    $('#automata').show();

    // Init canvases and draw ruleset
    setupCavas();
    drawRule();

    return false;
  });

  // Animate/stop animation
  let animate = false;
  let interval;
  const toggleAnimation = function () {
    const speed = $('#speed').val();

    if (!animate && !!M) {
      interval = setInterval(() => {
        M.step();
        drawRow();
        // Scroll down if autoscroll selected
        if ($('#scroll').is(':checked')) {
          $(window).scrollTop($('#grid').offset().top + $('#grid').height());
        }
      }, (speed * 1000));
      $(this).text('Stop Animation');
    }
    else {
      clearInterval(interval);
      $(this).text('Animate');
    }
    animate = !animate;
  };

  // Start/stop animation on 'a' keypress
  $('button#animate').on('click', toggleAnimation);
  $(document).on('keypress', function (e) {
    if (e.which == 97 && !!M) {
      $('button#animate').trigger('click');
    }
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
  const ruleCanvas = $('#rule-display')[0];
  ruleCanvas.ctx = ruleCanvas.getContext('2d');
  const totalBoxes = 8 * 3;
  const maxWidth = $('#width').attr('max') * 2;
  const boxSize = Math.floor(maxWidth / totalBoxes);
  const gap = Math.floor(boxSize * 0.1); // Between boxes in a rule
  const sep = 5 * gap; // Between rules

  // Define resolution
  ruleCanvas.width = (
    (totalBoxes * boxSize)
    + (totalBoxes * gap)
    + (8 * sep)
  );
  ruleCanvas.height = (
    (boxSize * 2)
    + (sep / 2)
    + (gap / 2)
  );
  ruleCanvas.ctx.lineWidth = Math.floor(gap / 2);

  // Draw boxes for each neighbourhood combination
  let x = sep;
  const inputY = Math.floor(ruleCanvas.ctx.lineWidth / 2);
  const outputY = inputY + Math.floor(boxSize + (sep / 2));

  for (let r = 7; r >= 0; r--) {
    // Draw neighbourhood state boxes
    const neighbourhood = r.toString(2).padStart(3, '0');
    for (let n = 0; n < 3; n++) {
      ruleCanvas.ctx.beginPath();
      ruleCanvas.ctx.fillStyle = parseInt(neighbourhood[n]) ? 'black' : 'white';
      ruleCanvas.ctx.rect(x, inputY, boxSize, boxSize);
      ruleCanvas.ctx.fill();
      ruleCanvas.ctx.stroke();

      // Draw output box
      if (n == 1) {
        ruleCanvas.ctx.beginPath();
        ruleCanvas.ctx.fillStyle = parseInt(M.rule[7 - r]) ? 'black' : 'white';
        ruleCanvas.ctx.rect(x, outputY, boxSize, boxSize);
        ruleCanvas.ctx.fill();
        ruleCanvas.ctx.stroke();
      }
      x += boxSize + gap;
    }
    x += sep;
  }
}

/**
 * Setup the canvas where the automata will be drawn
 * @function setupCavas
 */
function setupCavas() {
  // Setup canvas resolution
  const maxWidth = $('#width').attr('max');
  canvas.width = Math.max(Math.floor(maxWidth / M.cells.length) * M.cells.length, 500);
  cellSize = Math.max(Math.floor(canvas.width / M.cells.length), 1);
  canvas.height = 0;

  // Setup offscreen canvas
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;

  // Draw starting state
  drawRow();
}

/**
 * Draw the current state of the automaton as a new row in the canvas
 * @function drawRow
 */
function drawRow() {
  // Adjust offscreen canvas height then redraw
  offscreenCanvas.height += cellSize;
  if (M.time != 0) {
    offscreenCanvas.ctx.drawImage(canvas, 0, 0);
  }

  // Draw new row in offscreen canvas
  for (let c = 0; c < M.cells.length; c++) {
    offscreenCanvas.ctx.fillStyle = M.cells[c] ? 'black' : 'white';
    offscreenCanvas.ctx.fillRect(cellSize * c, M.time * cellSize, cellSize, cellSize);
  }
  // Increase canvas height and draw image
  canvas.height += cellSize;
  canvas.ctx.drawImage(offscreenCanvas, 0, 0);
}
