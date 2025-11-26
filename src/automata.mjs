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
   * @param {number} cols the number of columns
   * @param {object[]} rule rule as a binary string
   */
  constructor(cols, rule) {
    this.colNum = cols;
    this.rule = rule;
    this.cells = [];
    this.iteration = 0;

    // Init cells
    for (let c = 0; c < this.colNum; c++) {
      this.cells[c] = new Cell(c);
    }

    // Set middle cell to on
    this.cells[Math.floor(this.colNum / 2)].setState(1);
  }

  /**
   * Apply rules
   * @function CA#iterate
   * @returns {boolean} if the iteration created a change in state
   */
  iterate() {
    let changedCells = [];

    // Iterate over each rule per cells
    for (let i = 0; i < this.colNum; i++) {
      const l = this.cells[(i - 1 + this.colNum) % this.colNum].state;
      const s = this.cells[i].state;
      const r = this.cells[(i + 1) % this.colNum].state;

      let n = `${l}${s}${r}`;
      n = parseInt(n, 2);

      changedCells.push({
        cell: i,
        state: parseInt(this.rule[n])
      });
    }

    // Actually change states after iteration
    changedCells.forEach(change => this.cells[change.cell].setState(change.state));

    this.iteration++;

    return changedCells.length != 0;
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
   * @param {number} col the column position
   */
  constructor(col) {
    this.col = col;
    this.id = this.col;
    this.setState(0); // Start off
  }

  /**
   * Set the cell's state and update the matching grid cell
   * @function Cell#setState
   * @param {string} newState the state to change to
   */
  setState(newState) {
    this.state = newState;
    const newClass = this.state ? 'on' : 'off';
    $('#' + this.id).attr('class', newClass);
  }
};

export { CA };
