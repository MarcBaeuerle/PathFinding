import { printPath, sleep } from "../grid.js";
import { explore, clearGrid, displayNoPath, displayOpened, speed, timeDiff,toggleButtons } from "../board.js";

var debugMsg = 0;


/**
 * Returns shortest route from Start node to End node in grid
 * using the Breadth First search algorithm
 * @param {Grid} grid Grid class
 * @param {bool} diag Allow diagonal traversals
 * @returns Path from Start to End.
 */
export async function BFS(grid) {
    clearGrid();
    if (debugMsg) console.log("----------Entering BSF function----------");

    let start = grid.start;
    let end = grid.end;
    let curr;
    let open = [];
    let startTime = new Date();
    let calls = 0;

    open.push(start);

    while (open.length > 0) {
        if (debugMsg) grid.toString();

        //take node from front of open
        curr = open.shift();
        curr.closed = true;

        await sleep(speed);
        explore(curr.x, curr.y);

        //path found 

        if (curr == end) {
            if (debugMsg) console.log("Path has been found");
            let time = timeDiff(startTime);
            printPath(curr, 'BFS', calls, time);
            return;
        }

        let neighbours = grid.getNeighbours(curr, 0);

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            if ((neighbour.isWall) || neighbour.closed || open.includes(neighbour)) {
                continue;
            }

            open.push(neighbour);
            calls++;
            neighbour.parent = curr;
            displayOpened(neighbour.x,neighbour.y);

        }
    }

    if (debugMsg) console.log("No path found");
    displayNoPath();

}

