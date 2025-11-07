const Cell = class {
  row;
  col;
  id;
  state;

  constructor(r, c, initState) {
    this.row = r;
    this.col = c;
    this.id = this.row + '-' + this.col;
    this.setState(initState);
  }

  setState(newState) {
    this.state = newState;
    $('#' + this.id).attr('class', newState);
  }
};

const CA = class {
  cells = [];
  states = [];
  transitions = {};
  neighbours = {};

  constructor(states) {
    this.states = states;

    // Init cells
    for (let r = 0; r < rowNum; r++) {
      this.cells[r] = [];
      for (let c = 0; c < colNum; c++) {
        this.cells[r][c] = new Cell(r, c, this.states[1]);
      }
    }
  }

  /**
   * Randomize the state of every cell in the CA
   */
  randomizeStates() {
    for (let r = 0; r < rowNum; r++) {
      for (let c = 0; c < colNum; c++) {
        const newState = Math.floor(Math.random() * this.states.length);
        this.cells[r][c].setState(this.states[newState]);
      }
    }
  }
};

const rowNum = 10, colNum = 10;
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

      // On click, toggle a cell on/off
      $(cell).on('click', () => {
        if (M.cells[r][c].state == M.states[0]) {
          M.cells[r][c].setState(M.states[1]);
        }
        else {
          M.cells[r][c].setState(M.states[0]);
        }
      });

      $(grid).append(cell);
    }
  }

  // Set randomize button
  $('button#randomize').on('click', () => M.randomizeStates());
}
