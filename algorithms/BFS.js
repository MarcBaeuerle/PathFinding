import { printPath, sleep } from "../grid.js";
import { explore, clearGrid, displayNoPath, displayOpened } from "../board.js";

var debugMsg = 0;

export async function BFS(grid) {
    clearGrid();
    if (debugMsg) console.log("----------Entering BSF function----------");

    let start = grid.start;
    let end = grid.end;
    let curr;
    let open = [];

    open.push(start);

    while (open.length > 0) {
        if (debugMsg) grid.toString();

        //take node from front of open
        curr = open.shift();
        curr.closed = true;

        await sleep(0.01);
        explore(curr.x, curr.y);

        //path found 

        if (curr == end) {
            if (debugMsg) console.log("Path has been found");
            printPath(curr);
            return;
        }

        let neighbours = grid.getNeighbours(curr, 0);

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            if ((neighbour.isWall) || neighbour.closed || open.includes(neighbour)) {
                continue;
            }

            open.push(neighbour);
            neighbour.parent = curr;
            displayOpened(neighbour.x,neighbour.y);

        }
    }

    if (debugMsg) console.log("No path found");
    displayNoPath();


}

