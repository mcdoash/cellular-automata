const Cell = class {
  row;
  col;
  id;
  state;
  neighbours;

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

  /**
   * Get the number of the cell's neighbours at a given state
   * @param {string} state the state to check
   * @returns {number} the number of neighbours at given state
   */
  numNeighAt(state) {
    return this.neighbours.reduce((a, c) => a + (c.state == state ? 1 : 0), 0);
  }
};

const CA = class {
  cells = [];
  states = [];
  transitions = {};

  constructor(states) {
    this.states = states;

    // Init cells
    for (let r = 0; r < rowNum; r++) {
      this.cells[r] = [];
      for (let c = 0; c < colNum; c++) {
        this.cells[r][c] = new Cell(r, c, this.states[1]);
      }
    }
    this.calcNeighbours();
  }

  /**
   * Basic neighbour identification
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
   */
  randomizeStates() {
    for (let r = 0; r < rowNum; r++) {
      for (let c = 0; c < colNum; c++) {
        let newState = Math.floor(Math.random() * (this.states.length + 1));
        if (newState >= this.states.length) newState = 1;
        this.cells[r][c].setState(this.states[newState]);
      }
    }
  }
};

const rowNum = 30, colNum = 30;
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
        M.cells[r][c].numNeighAt('on');
      });
      $(grid).append(cell);
    }
  }

  // Set randomize button
  $('button#randomize').on('click', () => {
    M.randomizeStates();
    // setTimeout(test, 5000);
  });
  $('button#iterate').on('click', () => {
    iterate();
  });
}

/**
 *
 */
function iterate() {
  for (let r = 0; r < rowNum; r++) {
    for (let c = 0; c < colNum; c++) {
      if (M.cells[r][c].numNeighAt('on') >= 4) {
        // change = true;
        M.cells[r][c].setState('on');
      }
      else if (M.cells[r][c].state == 'on') {
        // change = true;
        M.cells[r][c].setState('off');
      }
    }
  } // only change after iteration
}
