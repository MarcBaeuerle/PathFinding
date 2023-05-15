import { sleep } from "../grid.js";
import { clearGrid, makeWall, speed } from "../board.js";

/**
 * Creates a random maze that uses a probability based condition to determine
 * whether or not each grid node becomes a wall. 
 * @param {*} x row size of grid
 * @param {*} y amount of rows of grid
 * @param {*} button "Dense", or "Sparse" button id
 */
export async function randomMaze(x, y, button) {
    let probability = 0.338;
    if (button === `sparseRandMaze`) {
        probability = 0.15;
    }
    clearGrid(1);
    for (let i = 0; i < x; i++) {
        await sleep(0.008);
        for (let j = 0; j < y; j++) {
            if (Math.random() < probability) {
                makeWall(i, j);
            }
        }
    }

}

