import { CA } from './automata.mjs';

/**
 * Define a list of pre-set cellular automata for demonstration
 * @module Presets
 */
const Presets = {
  /**
   * Create a cellular automata that generates cave-like structures
   * @function caveAutomata
   * @returns {CA} CA that generates caves
   */
  caveGeneration: function () {
    const rowNum = 100, colNum = 100;
    const states = ['on', 'off'];

    const onRule = {
      startState: 'off',
      neighState: 'on',
      threshold: 5,
      endState: 'on'
    };
    const offRule = {
      startState: 'on',
      neighState: 'off',
      threshold: 6,
      endState: 'off'
    };

    const M = new CA(rowNum, colNum, states, [onRule, offRule]);
    M.randomizeStates(0.45);
    // Set all boundaries to "walls"
    Presets.setBoundaryWalls(M);

    return M;
  },

  /**
   * Turn every cell at a boundary off to similate walls on a map
   * @function setBoundaryWalls
   * @param {CA} M CA to add boundary walls to
   */
  setBoundaryWalls: function (M) {
    // Set all top/bottom rows off
    for (let c = 0; c < M.colNum; c++) {
      M.cells[0][c].setState('off');
      M.cells[M.rowNum - 1][c].setState('off');
    }
    // Set first/last columns off
    for (let r = 0; r < M.rowNum; r++) {
      M.cells[r][0].setState('off');
      M.cells[r][M.colNum - 1].setState('off');
    }
  },

  /**
   * Replicate Conway's Game of Life
   * @function gameOfLife
   * @returns {CA} M Game of Life CA
   */
  gameOfLife: function () {
    const rowNum = 100, colNum = 100;
    const states = ['on', 'off'];

    const rules = [{
      // Underpopulation
      startState: 'on',
      neighState: 'off',
      threshold: 7,
      endState: 'off'
    },
    { // Overpopulation
      startState: 'on',
      neighState: 'on',
      threshold: 4,
      endState: 'off'
    },
    { // Reproduction
      startState: 'off',
      neighState: 'on',
      threshold: 3,
      endState: 'on'
    },
    { // Reproduction
      startState: 'off',
      neighState: 'on',
      threshold: 4,
      endState: 'off'
    }];

    const M = new CA(rowNum, colNum, states, rules);
    M.randomizeStates(0.2);
    return M;
  },

  /**
   * An automata that creates interesting patterns.
   * Starts from a specific set of states.
   * @function designAutomata
   * @returns {CA} M design generator automata
   */
  designAutomata: function () {
    const rowNum = 100, colNum = 100;
    const states = ['on', 'off'];

    const rules = [{
      startState: 'on',
      neighState: 'off',
      threshold: 7,
      endState: 'off'
    },
    {
      startState: 'on',
      neighState: 'on',
      threshold: 4,
      endState: 'off'
    },
    {
      startState: 'off',
      neighState: 'on',
      threshold: 2,
      endState: 'on'
    },
    {
      startState: 'off',
      neighState: 'on',
      threshold: 4,
      endState: 'off'
    }];

    const M = new CA(rowNum, colNum, states, rules);

    // Create initial pattern
    M.cells.forEach((row) => {
      row.forEach(cell => cell.setState('off'));
    });
    M.cells[48][50].setState('on');
    M.cells[50][48].setState('on');
    M.cells[50][52].setState('on');
    M.cells[52][50].setState('on');

    return M;
  }
};

export { Presets };
