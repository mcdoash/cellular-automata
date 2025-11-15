/**
 * Class representing a cellular automata
 * @property {number} rowNum the number of rows
 * @property {number} colNum the number of columns
 * @property {Array.<Cell[]>} cells 2D array of cells
 * @property {Array} states finite set of states
 * @property {object[]} rules cell state transition rules
 */
const CA = class {
  /**
   * @param {number} rows the number of rows
   * @param {number} cols the number of columns
   * @param {Array} states set of CA states
   * @param {object[]} rules set of rules
   */
  constructor(rows, cols, states, rules) {
    this.rowNum = rows;
    this.colNum = cols;
    this.states = states;
    this.rules = rules;
    this.cells = [];

    // Init cells
    for (let r = 0; r < this.rowNum; r++) {
      this.cells[r] = [];
      for (let c = 0; c < this.colNum; c++) {
        this.cells[r][c] = new Cell(r, c, this.states[0]);
      }
    }
    this.calcNeighbours();
  }

  /**
   * Calculate and assign the neighbours of each cell
   * @function CA#calcNeighbours
   * @todo more efficient method
   * @todo store cell indices rather than cell itself?
   */
  calcNeighbours() {
    for (let row = 0; row < this.rowNum; row++) {
      for (let col = 0; col < this.colNum; col++) {
        let neighbours = [];

        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if ((i != row || j != col) && i >= 0 && i < this.rowNum && j >= 0 && j < this.colNum) {
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
  randomizeStates(onProb = 0.45) {
    for (let r = 0; r < this.rowNum; r++) {
      for (let c = 0; c < this.colNum; c++) {
        const prob = Math.random(); // [0-1]
        this.cells[r][c].setState(prob <= onProb ? 'on' : 'off');
      }
    }
  }

  /**
   * Apply rules
   * @function CA#iterate
   * @returns {boolean} if the iteration created a change in state
   */
  iterate() {
    let changedCells = [];

    // Iterate over each rule per cells
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        this.rules.forEach((rule) => {
          // If enough neighbours are at the rule's start state, cell will have rule's end state
          if (cell.state == rule.startState && cell.numNeighAt(rule.neighState) >= rule.threshold) {
            changedCells.push({
              cell: cell,
              state: rule.endState
            });
          }
        });
      });
    });

    // Actually change states after iteration
    changedCells.forEach(change => change.cell.setState(change.state));

    return changedCells.length != 0;
  }

  /**
   * Iterate until stable -- when no states have changed
   * @function CA#stabilize
   * @todo only change cell class once?
   */
  stabilize() {
    let iterations = 0;
    let change = true;

    while (change && iterations < 100) {
      change = this.iterate();
      iterations++;
    }

    if (!change) {
      alert('Stabilized in ' + (iterations - 1) + ' iterations');
    }
    else {
      alert('Failed to stabilize after ' + iterations + ' iterations');
    }
  }
};

/**
 * Class representing a cell in a CA
 * @property {number} row the row position of a cell
 * @property {number} col the column position of a cell
 * @property {string} id the matching grid cell's id
 * @property {string} state the cell's current state
 * @property {Array.<Cell>} neighbours list of the cell's neighbours
 */
const Cell = class {
  /**
   * @param {number} row the row position
   * @param {number} col the column position
   * @param {string} initState the initial state
   */
  constructor(row, col, initState) {
    this.row = row;
    this.col = col;
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
    return this.neighbours.reduce((a, cell) => a + (cell.state == state ? 1 : 0), 0);
  }
};

export { CA };
