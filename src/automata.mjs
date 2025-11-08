/**
 * Class representing a cellular automata
 * @class
 * @property {Array} cells a 2D array of cells
 * @property {Array} states a finite set of states
 * @property {object} transitions cell state transition rules
 */
const CA = class {
  rowNum;
  colNum;
  cells = [];
  states = [];
  transitions = {};

  /**
   * @constructs CA
   * @param {number} rows number of rows
   * @param {number} cols number of columns
   * @param {Array} states set of CA states
   */
  constructor(rows, cols, states) {
    this.rowNum = rows;
    this.colNum = cols;
    this.states = states;

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
   */
  calcNeighbours() {
    for (let row = 0; row < this.rowNum; row++) {
      for (let col = 0; col < this.colNum; col++) {
        let neighbours = [this];

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
  randomizeStates(onProb = 0.4) {
    for (let r = 0; r < this.rowNum; r++) {
      for (let c = 0; c < this.colNum; c++) {
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

export { CA };
