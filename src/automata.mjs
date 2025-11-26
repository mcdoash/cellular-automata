/**
 * Class representing a cellular automata
 * @property {number} colNum the number of columns
 * @property {Array} cells 2D array of cell states
 * @property {string} rule cell state transition rules
 */
const CA = class {
  /**
   * @param {number} cols the number of columns
   * @param {object[]} rule rule as a binary string
   */
  constructor(cols, rule) {
    this.colNum = cols;
    this.rule = rule;
    this.iteration = 0;

    // Create cells with all but middle off
    this.cells = [...new Array(this.colNum)].map(() => 0);
    this.cells[Math.floor(this.colNum / 2)] = 1;
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
      const l = this.cells[(i - 1 + this.colNum) % this.colNum];
      // const l = this.cells[i - 1] ?? 0;
      const s = this.cells[i];
      const r = this.cells[(i + 1) % this.colNum];
      // const r = this.cells[i + 1] ?? 0;

      let n = `${l}${s}${r}`;
      n = parseInt(n, 2);

      changedCells[i] = parseInt(this.rule[n]);
    }

    // Actually change states after iteration
    this.cells = changedCells;
    this.iteration++;

    return changedCells.length != 0;
  }
};

export { CA };
