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

  // Set randomize button
  $('button#randomize').on('click', () => {
    const probability = $('#prob').val();
    M.randomizeStates(probability);
    resetAnimation();

    if (automataType == 'Cave Generation') {
      Presets.helpers.setBoundaryWalls(M);
    }
  });
  // Set iterate & stabilize buttons
  $('button#iterate').on('click', () => {
    resetAnimation();
    M.iterate();
  });
  $('button#stabilize').on('click', () => {
    resetAnimation();
    M.stabilize();
  });

  // Turn grid lines on/off via checkbox
  $('input#gap').on('change', function () {
    $('#grid').css('gap', this.checked ? 1 : 0 + 'px');
  });

  // Create a button for each automata preset
  Presets.automata.forEach((preset) => {
    const presetBtn = $('<button>').text(preset.name);

    // Generate the preset and display it
    presetBtn.on('click', () => {
      resetAnimation();
      automataType = preset.name;
      M = preset.generate();
      setupGrid();
    });

    $('#presets').append(presetBtn);
  });

  // New automata form
  $('#create-ca').on('submit', function (e) {
    e.preventDefault();
    resetAnimation();
    const rowNum = e.target.rows.value;
    const colNum = e.target.cols.value;

    // const states = e.target.states.value.split(',').map(i => i.trim());
    const states = ['on', 'off'];

    // Create rules from input
    let rules = [];
    $('.rule').each(function () {
      const inputs = $(this).find(':input');

      rules.push({
        startState: $(inputs[0]).val(),
        neighState: $(inputs[1]).val(),
        threshold: $(inputs[2]).val(),
        endState: $(inputs[3]).val()
      });
    });

    automataType = 'Custom';
    M = new CA(rowNum, colNum, states, rules);
    setupGrid();
    M.randomizeStates();

    return false;
  });

  // Form: new rules creation
  $('button#add-rule').on('click', () => {
    const newRule = $('#rule').contents().clone();
    // Set delete button to delete this rule
    $(newRule).children('.delete-rule').on('click', () => $(newRule).remove());
    $('#rules-container').append(newRule);
  });
}

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupGrid() {
  $('#automata-name').text(automataType);

  // Setup empty grid element
  const grid = $('#grid').empty();
  grid.css('grid-template-columns', (100 / M.colNum + 'fr ').repeat(M.colNum));
  grid.css('grid-template-rows', (100 / M.rowNum + 'fr ').repeat(M.rowNum));

  // Init all grid cells
  for (let r = 0; r < M.rowNum; r++) {
    for (let c = 0; c < M.colNum; c++) {
      const id = M.cells[r][c].id;
      const cell = $('<div>').attr('id', id).attr('class', M.cells[r][c].state);
      $(grid).append(cell);

      // On click, toggle a cell on/off
      $(cell).on('click', () => {
        let newState = M.cells[r][c].state == 'on' ? 'off' : 'on';
        M.cells[r][c].setState(newState);
      });
    }
  }

  $('#automata').show();
}
