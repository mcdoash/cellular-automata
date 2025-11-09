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
  // Automata presets
  $('button#cave').on('click', () => caveGeneration());
  $('button#life').on('click', () => gameOfLife());

  // Set randomize button
  $('button#randomize').on('click', () => {
    const probability = $('#prob').val();
    M.randomizeStates(probability);

    if (automataType == 'cave') {
      setBoundaryWalls();
    }
  });
  // Set iterate & stabilize buttons
  $('button#iterate').on('click', () => M.iterate());
  $('button#stabilize').on('click', () => M.stabilize());

  // Turn grid lines on/off via checkbox
  $('input#gap').on('change', function () {
    $('#grid').css('gap', this.checked ? 1 : 0 + 'px');
  });

  // New automata form
  $('#create-ca').on('submit', function (e) {
    const rowNum = e.target.rows.value;
    const colNum = e.target.cols.value;

    // const states = e.target.states.value.split(',').map(i => i.trim());
    const states = ['on', 'off'];

    // Create rules from input
    let rules = [];
    $('.rule').each(function () {
      const id = $(this).attr('id').split('-')[1];

      const start = $('#start-' + id).val();
      const neigh = $('#neigh-' + id).val();
      const thresh = $('#thresh-' + id).val();
      const end = $('#end-' + id).val();

      rules.push({
        startState: start,
        neighState: neigh,
        threshold: thresh,
        endState: end
      });
    });
    console.log(rules);

    M = new CA(rowNum, colNum, states, rules);
    setupGrid();
    M.randomizeStates();

    return false;
  });

  // Form: new rules creation
  /** @todo better rules creation */
  let numRules = 0;
  // Set rule template and remove from DOM
  const ruleTemp = $('#rule').clone();
  $('#rule').remove();

  $('button#add-rule').on('click', () => {
    // Create new rules input elements
    const newRule = ruleTemp.clone().addClass('rule');
    newRule.attr('id', 'rule-' + numRules);

    // Set ids of elements to current rule number
    newRule.find('#start').first().attr('id', 'start-' + numRules);
    newRule.find('#neigh').first().attr('id', 'neigh-' + numRules);
    newRule.find('#thresh').first().attr('id', 'thresh-' + numRules);
    newRule.find('#end').first().attr('id', 'end-' + numRules);

    // Set delete button to delete this rule
    const deleteBtn = $('<button>').attr('id', 'delete-' + numRules).text('Delete Rule').on('click', () =>
      $('#' + newRule.attr('id')).remove()
    );
    $(newRule).append(deleteBtn);

    $('#rules-container').append(newRule);
    numRules++;
  });
}

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupGrid() {
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
  automataType = 'cave';
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
  automataType = 'life';
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
