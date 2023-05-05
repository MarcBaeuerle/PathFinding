import { printPath, sleep } from "../grid.js";
import { explore, clearGrid, displayNoPath, displayOpened, makeWall } from "../board.js";


//TODO
export async function primMaze(grid) {
    let curr = grid.start;
    let walls = [];

    let neighbours = grid.getNeighbours(curr, 0);
    for (let i in neighbours) {
        walls.push(neighbours[i]);
    }
    
    while (walls.length > 0) {
        let randomWall = walls.splice(Math.floor(Math.random() * walls.length),1);
        console.log(randomWall);
    }
   
}

