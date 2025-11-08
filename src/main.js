import { CA } from './automata.mjs';
import './style.scss';

let M;
let automataType;
setupForm();
$('button#cave').on('click', () => caveAutomata());

/**
 *
 */
function setupForm() {
  let numRules = 0;
  $('button#add-rule').on('click', () => {
    const newRule = $('#rule').clone().addClass('rule');
    newRule.attr('id', 'rule-' + numRules);

    newRule.find('#start').first().attr('id', 'start-' + numRules);
    newRule.find('#thresh').first().attr('id', 'thresh-' + numRules);
    newRule.find('#end').first().attr('id', 'end-' + numRules);

    const deleteBtn = $('<button>').attr('id', 'delete-' + numRules).text('Delete Rule').on('click', () =>
      $('#' + newRule.attr('id')).remove()
    );
    $(newRule).append(deleteBtn);

    $('#rules-container').append(newRule);
    numRules++;
  });

  // Turn grid lines on/off via checkbox
  $('input#gap').on('change', function () {
    $('#grid').css('gap', this.checked ? 1 : 0 + 'px');
  });

  $('#create-ca').on('submit', function (e) {
    console.log('submit');
    let validCA = true;
    const rowNum = e.target.rows.value;
    const colNum = e.target.cols.value;

    // const states = e.target.states.value.split(',').map(i => i.trim());
    const states = ['on', 'off'];

    let rules = [];
    $('.rule').each(function () {
      const id = $(this).attr('id').split('-')[1];

      const start = $('#start-' + id).val();
      const thresh = $('#thresh-' + id).val();
      const end = $('#end-' + id).val();

      if (!start || !thresh || !end) {
        alert('Invalid rule');
        validCA = false;
        return false;
      }

      rules.push({
        startState: start,
        threshold: thresh,
        endState: end
      });
    });

    if (validCA) {
      M = new CA(rowNum, colNum, states, rules);
      setupGrid();
      M.randomizeStates();
    }

    return false;
  });
}

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupGrid() {
  // Setup the grid element
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
        if (M.cells[r][c].state == 'on') {
          M.cells[r][c].setState('off');
        }
        else {
          M.cells[r][c].setState('on');
        }
      });
    }
  }

  // Set randomize button
  $('button#randomize').on('click', () => {
    const probability = $('#prob').val();
    M.randomizeStates(probability);

    if (automataType == 'cave') {
      setBoundaryWalls();
    }
  });
  // Set iterate button
  $('button#iterate').on('click', () => {
    M.iterate();
  });
  // Set stabilize button
  $('button#stabilize').on('click', () => {
    M.stabilize();
  });

  $('#automata').show();
}

/**
 * Create a cellular automata that generates cave-like structures
 */
function caveAutomata() {
  automataType = 'cave';
  const rowNum = 100, colNum = 100;
  const states = ['on', 'off'];

  const onRule = {
    startState: 'on',
    threshold: 5,
    endState: 'on'
  };
  const offRule = {
    startState: 'off',
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
 *
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
