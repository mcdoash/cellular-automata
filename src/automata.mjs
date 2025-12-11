/**
 * Class representing an elementary cellular automata
 * @property {Array}  cells array of cell states
 * @property {string} rule local transition rulestring
 * @property {number} time current time step
 * @property {string} boundary boundary condition type
 */
const ECA = class {
  /**
   * @param {number} rule Wolfram rule number
   * @param {number} width the latice width
   * @param {string} startType starting state, either 'middle' or 'random'
   * @param {string} boundaryType boundary condition, either 'periodic', 'fixed', or 'reflexive'
   */
  constructor(rule, width, startType, boundaryType) {
    // Convert rule number to rule string
    this.rule = rule.toString(2).padStart(8, '0');
    this.time = 0;

    // Ensure valid boundary condition
    this.boundary = ['periodic', 'fixed', 'reflexive'].includes(boundaryType) ? boundaryType : 'periodic';

    // Ensure valid start type
    startType = ['middle', 'random'].includes(startType) ? startType : 'middle';

    // Create array of cells
    if (startType === 'middle') { // All but middle off
      this.cells = [...new Array(width)].map(() => 0);
      this.cells[Math.floor(width / 2)] = 1;
    }
    else if (startType === 'random') { // Random states
      this.cells = [...new Array(width)].map(() => Math.round(Math.random()));
    }
  }

  /**
   * Update all cells via rule
   * @function CA#step
   */
  step() {
    // Set left & right boundary
    let lBound;
    let rBound;
    if (this.boundary == 'periodic') {
      lBound = this.cells[this.cells.length - 1];
      rBound = this.cells[0];
    }
    else if (this.boundary == 'fixed') {
      lBound = rBound = 0;
    }
    else if (this.boundary == 'reflexive') {
      lBound = this.cells[0];
      rBound = this.cells[this.cells.length - 1];
    }

    // Calculate the new state of each cell
    let nextGen = [];
    for (let i = 0; i < this.cells.length; i++) {
      const l = this.cells[i - 1] ?? lBound;
      const c = this.cells[i];
      const r = this.cells[i + 1] ?? rBound;

      const n = 7 - parseInt(`${l}${c}${r}`, 2);
      nextGen[i] = parseInt(this.rule[n]);
    }
    this.cells = nextGen;
    this.time++;
  }
};

export { ECA };
