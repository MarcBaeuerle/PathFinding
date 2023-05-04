import { displayNoPath, createPath} from "./board.js";
import { aStar } from "./algorithms/aStar.js";

var debugMsg = 0;
var allowDiag = 0;


//TODO: all diagonal functionality.


/**
 * Grid Memory structure
 * @param {Array}   array Array that is converted into a grid
 * @param {bool}    debug Debug messages on or off
 * @param {bool}    diagonal Allow diagonal moves
 * 
 * Example 2x2 grid
 *  y[(0,0), (1,0)]
 *  y[(0,1), (1,1)]
 *      x      x
 * Where (x,y)
 */
export class Grid {
    //constructor
    constructor(array, debug) {

        this.grid = [];
        // debugMsg = debug;
    
        if (debugMsg) console.log(`debug messages enabled`);

        //creates a GridNode for each array element
        for (let y = 0; y < array.length; y++) {
            let row = [];
            for (let x = 0; x < array[y].length; x++) {
                let node = new GridNode(x, y, array[y][x]);
                row.push(node);

                //assigns the start and end nodes
                if (array[y][x] == 2) {
                    this.start = node;
                } else if (array[y][x] == 3) {
                    this.end = node;
                }
            }
            this.grid.push(row);
        }


        console.log(this.start.toString(1));
    }

    //Prints Grid
    toString() {
        for (let i = 0; i < this.grid.length; i++) {
            let output = ``;
            for (let j = 0; j < this.grid[i].length; j++) {
                output += this.grid[i][j].toString(0) + ``;
            }

        }


    }

    /**
     * List of Neighbours of node. Diagonal nodes are added if allowDiag is true.
     * @param {GridNode} node Node to get neighbours of
     * @param {bool} allowDiag Allow diagonal nodes
     * @returns list of neighbours of node. 
     */
    getNeighbours(node, allowDiag) {
        let neighbours = [];

        let x = node.x;
        let y = node.y;
        let grid = this.grid;

        //loops through immediate neighbours of the node
        //adds to list if neighbour exists.
        if (allowDiag) {
            for (let row = -1; row <= 1; row++) {
                for (let col = -1; col <= 1; col++) {
                    if (grid[y + row] && grid[y + row][x + col] && !(row == 0 && col == 0)) {
                        neighbours.push(grid[y + row][x + col]);
                    }
                }
            }
        } else {    //just get North South East West nodes
            //North node
            if (grid[y - 1] && grid[y - 1][x]) {
                neighbours.push(grid[y - 1][x]);
            }

            //South node
            if (grid[y + 1] && grid[y + 1][x]) {
                neighbours.push(grid[y + 1][x]);
            }

            //East node
            if (grid[y][x + 1]) {
                neighbours.push(grid[y][x + 1]);
            }
            //West node
            if (grid[y][x - 1]) {
                neighbours.push(grid[y][x - 1]);
            }
        }

        if (debugMsg) {
            let output = `Neighbours: `;
            for (let i = 0; i < neighbours.length; i++) {
                output += neighbours[i].toString(1);
            }
            console.log(output);
        }

        return neighbours;
    }


    getHCost(node) {
        let d1 = Math.abs(this.end.x - node.x);
        let d2 = Math.abs(this.end.y - node.y);
        return d1 + d2;
    }

}

/**
 * Singular Grid Nodes
 * @param {number}  x       x coordinate
 * @param {number}  y       y coordinate
 * @param {number}  isWall  0 = path, 1 = wall, 2 = start, 3 = end
 * 
 * g cost = distance from starting node
 * h cost = distance from end node
 * f cost  = g cost + h cost
 */
class GridNode {
    //constructor
    constructor(x, y, isWall) {
        this.x = x;
        this.y = y;

        //Walls are 1, others are walkable, including 2,3 which are start,end
        if (isWall == 1) {
            this.isWall = true;
            this.weight = 0;
        } else {
            this.isWall = false;
            this.weight = 1;
        }

        this.f = 0;
        this.h = 0;
        this.g = 0;
        this.visited = false;
        this.closed = false;
        this.parent = null;

        if (debugMsg) console.log(`New GridNode Created`);
    }

    /**
     * prints out singular Node as string 
     * @param {bool} coord  include coordinates
     * 
     * @returns {`[visited, isWall, isClosed, fCost, weight]`} if coord = 0
     * @returns {`[(x,y), visited, isWall, isClosed, fCost, weight]`} if coord = 1
     */
    toString(coord) {
        let output = ``;
        let params = [this.visited, this.isWall, this.closed];

        if (coord) {
            output = `(${this.x},${this.y}),`
        }

        for (let i = 0; i < params.length; i++) {
            if (params[i]) {
                output += `t,`
            } else {
                output += `f,`
            }
        }

        output += `${this.f.toFixed(1)},${this.weight.toFixed(1)}]`;

        return `[` + output;
    }
}



/**
 * Returns the path from end to start.
 * @param {GridNode} node
 * @returns Path of nodes from end to start
 */
export function printPath(node) {
    let curr = node;
    let path = [];
    path.push(curr);

    while (curr.parent != null) {
        path.push(curr.parent);
        curr = curr.parent;
    }

    createPath(path);
    return path;
}

/**
 * just adds a delay for set amount of time
 * @param {int} seconds in miliseconds
 * @returns 
 */
export async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}