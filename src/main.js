import { CA } from './automata.mjs';
import './style.scss';

const rowNum = 100, colNum = 100;
const rule1 = {
  startState: 'on',
  threshold: 4,
  endState: 'on'
};
const rule2 = {
  startState: 'off',
  threshold: 5,
  endState: 'off'
};
let M = new CA(rowNum, colNum, ['on', 'off'], [rule1, rule2]);
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
    // iterate(threshold);
    M.iterate();
  });
}
