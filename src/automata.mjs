/**
 * Class representing a cellular automata
 * @property {number} width the lattice width (number of cells)
 * @property {Array} cells 2D array of cell states
 * @property {string} rule cell state transition rules
 * @property {number} time current time step
 */
const CA = class {
  /**
   * @param {number} width the latice width
   * @param {object[]} rule rule as a binary string
   * @param {string} startType starting state, either 'middle' or 'random'
   */
  constructor(width, rule, startType) {
    this.width = width;
    this.rule = rule;
    this.time = 0;

    // Ensure valid start type
    startType = (startType != 'middle' && startType != 'random') ? 'middle' : startType;

    if (startType == 'middle') {
      // Create cells with all but middle off
      this.cells = [...new Array(this.width)].map(() => 0);
      this.cells[Math.floor(this.width / 2)] = 1;
    }
    else {
      // Random states
      this.cells = [...new Array(this.width)].map(() => Math.round(Math.random()));
    }
  }

  /**
   * Update all cells via rule
   * @function CA#step
   */
  step() {
    let changedCells = [];

    // Calculate the new state of each cell
    for (let i = 0; i < this.width; i++) {
      const l = this.cells[(i - 1 + this.width) % this.width];
      // const l = this.cells[i - 1] ?? 0;
      const c = this.cells[i];
      const r = this.cells[(i + 1) % this.width];
      // const r = this.cells[i + 1] ?? 0;

      const n = parseInt(`${l}${c}${r}`, 2);
      changedCells[i] = parseInt(this.rule[n]);
    }

    // Actually change states
    this.cells = changedCells;
    this.time++;
  }
};

export { CA };
