import { printPath, sleep } from "../grid.js";
import { explore, clearGrid, displayNoPath, displayOpened, makeWall } from "../board.js";


//TODO
export async function randomMaze(grid) {
    for (let i = 0; i < grid.length; i++) {
        displayOpened(1,i);
    }
}

