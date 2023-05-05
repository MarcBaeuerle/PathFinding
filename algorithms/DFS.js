import { printPath, sleep } from "../grid.js";
import { explore, clearGrid, displayNoPath, displayOpened, speed } from "../board.js";

var debugMsg = 0;


/**
 * Returns a route from Start node to End node in grid
 * using the Depth First search algorithm
 * @param {Grid} grid Grid class
 * @param {bool} diag Allow diagonal traversals
 * @returns Path from Start to End.
 */
export async function DFS(grid) {
    clearGrid();
    if (debugMsg) console.log("----------Entering DFS function----------");

    let open = [];
    let start = grid.start;
    let end = grid.end;
    let curr;

    open.push(start);

    while (open.length > 0) {
        if (debugMsg) grid.toString();

        curr = open.pop();
        curr.closed = true;

        await sleep(speed);
        explore(curr.x, curr.y);

        if (curr == end) {
            if (debugMsg) console.log("Path has been found");
            printPath(curr);
            return;
        }

        let neighbours = grid.getNeighbours(curr, 0);

        let count = neighbours.length;

        for (let i = 0; i < count; i++) {
            let rand = (Math.random() * neighbours.length) | 0;
            let neighbour = neighbours[rand];
            neighbours.splice(rand,1);
        


            if ((neighbour.isWall) || neighbour.closed || open.includes(neighbour)) {
                continue;
            }

            open.push(neighbour);
            neighbour.parent = curr;
            displayOpened(neighbour.x, neighbour.y);


        }
    }
    if (debugMsg) console.log("No path found");
    displayNoPath();

}






