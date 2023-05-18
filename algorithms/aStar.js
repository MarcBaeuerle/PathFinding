import { printPath, sleep } from "../grid.js";
import { displayFCost, explore, clearGrid, displayNoPath, displayOpened, speed, timeDiff, toggleButtons } from "../board.js";

var debugMsg = 0;
var allowDiag = 0;


/**
 * Returns shortest route from Start node to End node in grid 
 * using the A* algorithm
 * @param {Grid} grid Grid class
 * @param {bool} diag Allow diagonal traversals
 * @returns Path from Start to End.
 */
export async function aStar(grid, diag) {
    clearGrid();
    if (debugMsg) console.log("----------Entering aStar function----------");

    allowDiag = diag;
    let start = grid.start;
    let end = grid.end;
    let curr;
    let open = [];
    let startTime = new Date();
    let calls = 0;

    open.push(start);

    while (open.length > 0) {
        if (debugMsg) grid.toString();

        //get the lowest F-cost and remove from open
        curr = getLowestFCost(open);

        let index = open.indexOf(curr);
        if (index > -1) open.splice(index, 1);

        curr.closed = true;
        await sleep(speed);
        explore(curr.x, curr.y);


        //path found
        if (curr == end) {
            if (debugMsg) console.log("Path has been found");
            let time = timeDiff(startTime);
            printPath(curr, 'A*&nbsp', calls, time);
            return;
        }

        let neighbours = grid.getNeighbours(curr, 0);
        

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            if ((neighbour.isWall) || neighbour.closed) {
                continue;
            }

            //G score is the shortest distace from start to current node
            //we need to check if the path we have arrived at this neighbour is the shortest one 
            let gScore = curr.g + 1;
            let beenVisited = neighbour.visited;

            if (!beenVisited || gScore < neighbour.g) {

                //Found an optimal (so far) path to this node. Take score for node to see how good it is
                neighbour.visited = true;
                neighbour.parent = curr;
                neighbour.h = grid.getHCost(neighbour);

                neighbour.g = gScore;
                neighbour.f = neighbour.g + neighbour.h;

                if (!beenVisited) {
                    open.push(neighbour);
                    calls++;

                }

                if (neighbour != end) {
                    displayFCost(neighbour.x, neighbour.y, neighbour.f, neighbour.g, neighbour.h);
                    displayOpened(neighbour.x, neighbour.y);
                }
            }
        }


    }
    if (debugMsg) console.log("No path found");
    displayNoPath();
}

/**
 * Basic unsorted array used, so runtime is not optimal. 
 * @param {array} arr Array of nodes
 * @returns node with with the lowest F Cost
 */
function getLowestFCost(arr) {
    let node = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].f < node.f)
            || (arr[i].f === node.f) && (arr[i].h < node.h)) {
            node = arr[i];
        }
    }

    if (debugMsg) console.log(`Lowest F Cost: ${node.toString(1)}`);
    return node;
}

