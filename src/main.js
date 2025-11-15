import './style.scss'; // Stylesheet
import { CA } from './automata.mjs'; // Automata classes

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

  const resetAnimation = function () {
    // Reset animation button
    clearInterval(interval);
    animate = false;
    $('button#animate').text('Animate').prop('disabled', false);
  };

  // Set randomize button
  $('button#randomize').on('click', () => {
    const probability = $('#prob').val();
    M.randomizeStates(probability);
    resetAnimation();

    if (automataType == 'Caves') {
      setBoundaryWalls();
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

  // Automata presets
  $('button#cave').on('click', () => {
    resetAnimation();
    caveGeneration();
  });
  $('button#life').on('click', () => {
    resetAnimation();
    gameOfLife();
  });
  $('button#design').on('click', () => {
    resetAnimation();
    designAutomata();
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
      const cell = $('<div>').attr('id', id);
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

/** AUTOMATA PRESETS */
/**
 * Create a cellular automata that generates cave-like structures
 * @function caveAutomata
 */
function caveGeneration() {
  automataType = 'Caves';
  const rowNum = 100, colNum = 100;
  const states = ['on', 'off'];

  const onRule = {
    startState: 'off',
    neighState: 'on',
    threshold: 5,
    endState: 'on'
  };
  const offRule = {
    startState: 'on',
    neighState: 'off',
    threshold: 6,
    endState: 'off'
  };

  M = new CA(rowNum, colNum, states, [onRule, offRule]);
  setupGrid();
  M.randomizeStates(0.45);
  // Set all boundaries to "walls"
  setBoundaryWalls();
}

/**
 * Turn every cell at a boundary off to similate walls on a map
 * @function setBoundaryWalls
 */
function setBoundaryWalls() {
  M.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.row == 0 || cell.row == (M.rowNum - 1) || cell.col == 0 || cell.col == (M.colNum - 1)) {
        cell.setState('off');
      }
    });
  });
}

/**
 * Replicate Conway's Game of Life
 * @function gameOfLife
 */
function gameOfLife() {
  automataType = 'Game of Life';
  const rowNum = 100, colNum = 100;
  const states = ['on', 'off'];

  const rules = [{
    startState: 'on',
    neighState: 'off',
    threshold: 7,
    endState: 'off'
  },
  {
    startState: 'on',
    neighState: 'on',
    threshold: 4,
    endState: 'off'
  },
  {
    startState: 'off',
    neighState: 'on',
    threshold: 3,
    endState: 'on'
  },
  {
    startState: 'off',
    neighState: 'on',
    threshold: 4,
    endState: 'off'
  }];

  M = new CA(rowNum, colNum, states, rules);
  setupGrid();
  M.randomizeStates(0.2);
}

/**
 *
 */
function designAutomata() {
  automataType = 'Design Generator';
  const rowNum = 100, colNum = 100;
  const states = ['on', 'off'];

  const rules = [{
    startState: 'on',
    neighState: 'off',
    threshold: 7,
    endState: 'off'
  },
  {
    startState: 'on',
    neighState: 'on',
    threshold: 4,
    endState: 'off'
  },
  {
    startState: 'off',
    neighState: 'on',
    threshold: 2,
    endState: 'on'
  },
  {
    startState: 'off',
    neighState: 'on',
    threshold: 4,
    endState: 'off'
  }];

  M = new CA(rowNum, colNum, states, rules);
  setupGrid();

  // Create initial pattern
  M.cells.forEach((row) => {
    row.forEach(cell => cell.setState('off'));
  });
  M.cells[48][50].setState('on');
  M.cells[50][48].setState('on');
  M.cells[50][52].setState('on');
  M.cells[52][50].setState('on');
}
