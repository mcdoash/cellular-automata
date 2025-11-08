/**
 * Class representing a cellular automata
 * @class
 * @property {Array} cells a 2D array of cells
 * @property {Array} states a finite set of states
 * @property {object} transitions cell state transition rules
 */
const CA = class {
  cells = [];
  states = [];
  transitions = {};

  /**
   * @constructs CA
   * @param {Array} states set of CA states
   */
  constructor(states) {
    this.states = states;

    // Init cells
    for (let r = 0; r < rowNum; r++) {
      this.cells[r] = [];
      for (let c = 0; c < colNum; c++) {
        this.cells[r][c] = new Cell(r, c, this.states[0]);
      }
    }
    this.calcNeighbours();
  }

  /**
   * Calculate and assign the neighbours of each cell
   * @function CA#calcNeighbours
   * @todo more efficient method
   */
  calcNeighbours() {
    for (let row = 0; row < rowNum; row++) {
      for (let col = 0; col < colNum; col++) {
        let neighbours = [this];

        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if ((i != row || j != col) && i >= 0 && i < rowNum && j >= 0 && j < colNum) {
              neighbours.push(this.cells[i][j]);
            }
          }
        }
        this.cells[row][col].neighbours = neighbours;
      }
    }
  }

  /**
   * Randomize the state of every cell in the CA
   * @function CA#randomizeStates
   * @param {number} onProb probability of a state being 'on'
   */
  randomizeStates(onProb = 0.4) {
    for (let r = 0; r < rowNum; r++) {
      for (let c = 0; c < colNum; c++) {
        const prob = Math.random(); // [0-1]
        if (prob <= onProb) {
          this.cells[r][c].setState('on');
        }
        else {
          this.cells[r][c].setState('off');
        }
      }
    }
  }
};

/**
 * Class representing a cell in a CA
 * @class
 * @property {number} row the row position of a cell
 * @property {number} col the column position of a cell
 * @property {string} id the matching grid cell's id
 * @property {string} state the cell's current state
 * @property {Array} neighbours list of the cell's neighbours
 */
const Cell = class {
  row;
  col;
  id;
  state;
  neighbours;

  /**
   * @constructs CA
   * @param {number} r the row position
   * @param {number} c the column position
   * @param {string} initState the initial state
   */
  constructor(r, c, initState) {
    this.row = r;
    this.col = c;
    this.id = this.row + '-' + this.col;
    this.setState(initState);
  }

  /**
   * Set the cell's state and update the matching grid cell
   * @function Cell#setState
   * @param {string} newState the state to change to
   */
  setState(newState) {
    this.state = newState;
    $('#' + this.id).attr('class', newState);
  }

  /**
   * Get the number of the cell's neighbours at a given state
   * @function Cell#numNeighAt
   * @param {string} state the state to check
   * @returns {number} the number of neighbours at given state
   */
  numNeighAt(state) {
    return this.neighbours.reduce((a, c) => a + (c.state == state ? 1 : 0), 0);
  }
};

const rowNum = 100, colNum = 100;
let M = new CA(['on', 'off']);
setupElements();
M.randomizeStates();

/**
 * Setup the html grid elements
 * @function setupElements
 */
function setupElements() {
  // Setup the grid object
  const grid = $('#grid');
  grid.css('grid-template-columns', (100 / colNum + '%').repeat(colNum));
  grid.css('grid-template-rows', (100 / rowNum + '%').repeat(rowNum));

  // Init all grid cells
  for (let r = 0; r < rowNum; r++) {
    for (let c = 0; c < colNum; c++) {
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
  });
  // Set iterate button
  $('button#iterate').on('click', () => {
    const threshold = $('#thresh').val();
    iterate(threshold);
  });
}

/**
 * Apply basic rule to each cell in CA
 * - If enough neighours are in the 'on' state, turn on
 * - Else, turn off
 * @function iterate
 * @param {number} threshold the number of neighbours that must be on for a cell to also turn on
 */
function iterate(threshold = 4) {
  let onCells = [];
  let offCells = [];

  M.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.numNeighAt('on') >= threshold) {
        onCells.push(cell);
      }
      else if (cell.state == 'on') {
        offCells.push(cell);
      }
    });
  });

  onCells.forEach(cell => cell.setState('on'));
  offCells.forEach(cell => cell.setState('off'));
}
