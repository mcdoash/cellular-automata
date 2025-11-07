/**
 * @todo cell set state fn
 */

const row_num = 10, col_num = 10;
let CA = {};
setupAutomata();
setupElements();
randomizeStates();

/**
 * Setup the cellular automata
 * @function setupAutomata
 */
function setupAutomata() {
  CA = {
    cells: [],
    states: ['on', 'off'],
    symbols: [],
    dimension: 2,
    accepting: [],
    quiescent: '',
    boundary: '',
    transitions: {},
    neighbours: {}
  };

  for (let r = 0; r < row_num; r++) {
    CA.cells[r] = [];
    for (let c = 0; c < col_num; c++) {
      CA.cells[r][c] = CA.states[1];
    }
  }
}

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupElements() {
  // Setup the grid object
  const grid = $('#grid');
  grid.css('grid-template-columns', (100 / col_num + '%').repeat(col_num));
  grid.css('grid-template-rows', (100 / row_num + '%').repeat(row_num));

  // Init all grid cells
  for (let r = 0; r < row_num; r++) {
    for (let c = 0; c < col_num; c++) {
      const cell = $('<div>').attr('id', getId(r, c));
      $(grid).append(cell);
    }
  }

  // On click, toggle a cell on/off
  $('#grid div').on('click', function () {
    const [r, c] = getRowCol(this);

    if (CA.cells[r][c] == CA.states[0]) {
      CA.cells[r][c] = CA.states[1];
    }
    else {
      CA.cells[r][c] = CA.states[0];
    }
    $(this).attr('class', CA.cells[r][c]);
  });
}

/**
 * Randomize the state of every cell in the CA and set
 * the corresponding class in the grid cell
 * @function randomizeStates
 */
function randomizeStates() {
  for (let r = 0; r < row_num; r++) {
    for (let c = 0; c < col_num; c++) {
      const state = Math.floor(Math.random() * CA.states.length);
      CA.cells[r][c] = CA.states[state];
      setCellClass(r, c, CA.states[state]);
    }
  }
}

/**
 * @param {number} row   cell's row number
 * @param {number} col   cell's column number
 * @param {number} state the state to change class to
 */
function setCellClass(row, col, state) {
  const id = getId(row, col);
  $('#' + id).attr('class', state);
}

/**
 * @param {number} row cell row number
 * @param {number} col cell col number
 * @returns {string} the new id of the element
 */
function getId(row, col) {
  return row + '-' + col;
}

/**
 * @param {HTMLElement} elem element to extract CA cell from
 * @returns {Array} the row and column numbers of the cell
 */
function getRowCol(elem) {
  const id = $(elem).attr('id');
  const nums = id.split('-');
  return [nums[0], nums[1]];
}
