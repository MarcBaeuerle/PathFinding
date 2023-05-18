import { Grid } from "./grid.js";
import { aStar } from "./algorithms/aStar.js";
import { BFS } from "./algorithms/BFS.js";
import { DFS } from "./algorithms/DFS.js";
import { RS } from "./algorithms/RS.js";
import { randomMaze } from "./maze/randomMaze.js";
import { recursiveMaze } from "./maze/recursiveMaze.js";

const grid = document.querySelector(`#grid`);
const toggleWall = document.querySelector(`#toggleWall`);
const randMaze = document.getElementsByClassName('randMaze');
const recurMaze = document.getElementById(`recursiveMaze`);
const slider = document.getElementById('speed');
const stats = document.getElementById('console');
const clear = document.getElementById('clear');
const search = document.getElementsByClassName('search');
const clearBoard = document.getElementById(`clearBoard`);

const timer = ms => new Promise(res => setTimeout(res, ms))

var startNode = false;
var endNode = false;
var isToggling = false;
var pathExists = false;
var deleteWalls = false;
var row;
var rowCount;
var rowSize;
var initialWidth;
var count = 1;
var disableSearch = false;
export var speed = 0.1;

/**
 * Event Listener for each search algorithm to start search
 */
for (let i = 0; i < search.length; i++) {
    search[i].addEventListener('click', () => {
        computeArr(search[i].id);
    });
}

/**
 * Event Listener for each random maze generation
 */
for (let i = 0; i < randMaze.length; i++) {
    randMaze[i].addEventListener('click', () => {
        randomMaze(rowSize, rowCount, randMaze[i].id);
    });
}


/**
 * Creates and appends nodes to page.
 * Called when page loads and no where else.
 */
export function createBoard() {
    let deviceWidth = window.innerWidth;    
    let deviceHeight = window.innerHeight;


    let y = Math.round((deviceWidth - 20) / 20);    
    let x = Math.round(0.75 * (deviceHeight / 20));

    rowCount = x;  
    rowSize = y;

    initialWidth = deviceWidth;
    grid.style.minWidth = y;

    grid.onmousedown = enableToggle;    

    for (let i = 0; i < x; i++) {
        let row = document.createElement('div');
        row.className = `row`;
        row.id = `row${i + 1}`;

        for (let j = 0; j < y; j++) {
            let node = document.createElement('div');
            node.className = `node`;
            node.id = `node${(i * y) + (j + 1)}`;

            if (i === 3 && j === 3) {
                node.classList.add(`start`);
                startNode = true;
            }

            if (i === x - 4 && j === y - 4) {
                node.classList.add(`end`);
                endNode = true;
            }

            node.onmouseenter = toggle

            row.appendChild(node);
        }

        grid.appendChild(row);
    }
    document.onmouseup = disableToggle;
    row = document.querySelector(`#row1`);
}


/**
 * Handles changing visuals of the grid when user interacts with it. First click creates the start
 * node, second click creates the end nod, and the rest create walls. All states are toggled off 
 * when clicked again.
 * @param {string} elementID 
 * @returns nothing
 * TODO:    very iffy handling of logic, need to make it cleaner
 *          add mousedown functionality, so that walls dont have to be individually clicked.
 */
function clicked(elementID) {
    let node = document.querySelector(`#${elementID}`);
    let cList = node.classList;

    if (cList.contains('row')) return;

    //clicked on start node
    if (cList.contains(`start`)) {
        cList.remove(`start`);
        startNode = false;
        return;
    }

    //clicke on end node
    if (cList.contains(`end`)) {
        cList.remove(`end`);
        endNode = false;
        return;
    }

    if ((startNode && endNode)) { //start and end node already exist
        if (!cList.contains(`start` || `end`)) {
            if (deleteWalls) {
                cList.remove(`wall`);
            } else {
                cList.add(`wall`);
            }
        }
    } else if (!startNode) { //create start node
        make(elementID, `start`);
        startNode = true;
    } else if (!endNode) { //create end node
        make(elementID, `end`);
        endNode = true;
    }

    return;
}

/**
 * Make node a start/end node
 * @param {string} elementID Node to make start/end node
 * @param {string} state desired state of node
 */
function make(elementID, state) {
    let node = document.querySelector(`#${elementID}`);
    node.classList.remove(`wall`);
    node.classList.add(`${state}`);
}

/**
 * Deals with drag clicking
 * https://stackoverflow.com/a/48593751
 * @param {event} e 
 */
function enableToggle(e) {
    isToggling = true;

    // if (e.target !== grid) {
    //     toggle(e);
    // }
    toggle(e);
}

/**
 * Deals with drag clicking
 * https://stackoverflow.com/a/48593751
 */
function disableToggle() {
    isToggling = false;
}

/**
 * Deals with drag clicking
 * https://stackoverflow.com/a/48593751
 * @param {event} e 
 * @returns nothing
 */
function toggle(e) {
    if (isToggling === false) {
        return;
    }
    clicked(e.target.id);
}


/**
 * Converts the grid on the page into an array that can be used for the pathfinding
 * algorithms. 
 * 0 = empty
 * 1 = wall
 * 2 = start node
 * 3 = end node
 * 
 * @param {string} algorithm The algorithm to called on the array.  
 */
export function computeArr(algorithm) {
    let size = grid.childElementCount;
    let size2 = row.childElementCount;
    let matrix = new Array(size);
    let count = 1

    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size2);

        for (let j = 0; j < size2; j++) {
            let node = document.getElementById(`node${count}`);
            let cList = node.classList;
            let val = 0;
            if (cList.contains(`start`)) {
                val = 2;
            } else if (cList.contains(`end`)) {
                val = 3;
            } else if (cList.contains(`wall`)) {
                val = 1;
            } else {
                val = 0;
            }

            matrix[i][j] = val;
            count++;
        }
    }

    var test = new Grid(matrix, 1);

    if (algorithm === 'astar') {
        aStar(test, 0);
    } else if (algorithm === 'BFS') {
        BFS(test);
    } else if (algorithm === 'DFS') {
        DFS(test);
    } else if (algorithm == 'RS') {
        RS(test);
    }



}


/**
 * Creates a path from the end node to the start node
 * @param {array} path array from start node to end node.
 */
export function createPath(path) {

    let rSize = row.childElementCount;

    if (pathExists) {
        clearGrid();
    }

    async function load() {
        for (let i = path.length - 1; i > 0; i--) {
            let x = path[i].x;
            let y = path[i].y;
            let node = document.getElementById(`node${(y * rSize) + (x + 1)}`)


            await timer(1500 / path.length);
            node.classList.remove(`visited`);
            node.classList.add(`path`);
        }

    }
    load();
    pathExists = true;
    toggleButtons();
}


/**
 * Clears existing path on the grid
 */


/**
 * Removes path, visited, opened properties of every node on the grid.
 * If specified, also removes the walls.
 * @param {int} removeWall 1 = remove walls too
 */
export function clearGrid(removeWall) {
    let rSize = row.childElementCount;
    for (let i = 0; i < grid.childElementCount; i++) {
        for (let j = 0; j < rSize; j++) {
            let node = document.getElementById(`node${(i * rSize) + (j + 1)}`);
            node.classList.remove(`path`, `visited`, `opened`);
            node.innerHTML = ``;

            if (removeWall === 1) {
                node.classList.remove(`wall`);
            }
        }
    }
    pathExists = false;
}


/**
 * Button to add or delete walls from the grid.
 */
toggleWall.addEventListener('click', () => {
    deleteWalls = !deleteWalls;
    if (deleteWalls) {
        toggleWall.innerText = 'Add wall';
    } else {
        toggleWall.innerText = `Delete Wall`;
    }
})


/**
 * Displays a popup on screen when no path is found 
 */
export function displayNoPath() {
    let popup = document.getElementById('popup');
    popup.style.zIndex = '11';
    popup.style.opacity = '0.95';
    popup.style.transition = `opacity 0s`
    setTimeout(() => {
        popup.style.transition = 'opacity 1.7s';
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.zIndex = '0';
        }, 1700);
    }, 400);

}


/**
 * Makes the grid container flex when window is enlarged, and 
 * become inline-block when screen schrinks from original size
 */
window.addEventListener(`resize`, () => {
    let container = document.getElementById("container");
    if (window.innerWidth >= initialWidth) {
        container.style.display = "flex";
    } else {
        container.style.display = "inline-block";
    }
})

/**
 * Marks a node on the grid as 'visited' through color
 * @param {int} x x coordinate
 * @param {int} y y coordinate
 */
export function explore(x, y) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.classList.remove(`opened`, `path`);

    node.classList.add(`visited`);
}

/**
 * displays the costs of a node in the grid. 
 * Only called from A* algorithm.
 * @param {int} x x coordinate
 * @param {int} y y coordinate
 * @param {int} f f cost of node
 * @param {int} g g cost of node
 * @param {int} h h cost of node
 */
export function displayFCost(x, y, f, g, h) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.innerHTML = `<p>F:${f}</p><p>G:${g}</p><p>H:${h}</p>`;
}

/**
 * Sets a nodes color to green to represent it being opened in
 * a particular algorithm
 * @param {int} x 
 * @param {int} y 
 */
export function displayOpened(x, y) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.classList.add(`opened`);
}

/**
 * Sets a grid note to a wall
 * @param {int} x 
 * @param {int} y 
 */
export function makeWall(x, y) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.classList.add(`wall`);
}

/**
 * Changes the speed of grid animation when moving the slider
 */
slider.addEventListener('input', () => {
    speed = 1 - slider.value;
}, false);


/**
 * Adds data to the console with each SUCCESSFUL algorithm call
 * @param {string} algorithm algorithm name
 * @param {int} calls number of calls the algorithm made
 * @param {int} runtime runtime of the algorithm in seconds
 * @param {int} length length of the path between start and finish
 */
export function addConsole(algorithm, calls, runtime, length) {
    let string = `<p>[${count}] ${algorithm} visited ${calls} nodes in ${runtime}s. Path length: ${length}</p><br>`;
    stats.innerHTML += string;
    count++;
    stats.scrollTop = stats.scrollHeight;
}


/**
 * Calculates the time difference betwwen startTime and the moment this function is called
 * @param {int} startTime 
 * @returns time in seconds
 */
export function timeDiff(startTime) {
    let endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff * 1000) / 1000;
    return seconds;
}

/**
 * Disables algorithm buttons when search animation is in process to avoid buggy display
 */
export function toggleButtons() {
    disableSearch = !disableSearch;
    // for (let i = 0; i < search.length; i++) {
    //     if (disableSearch) {
    //         search[i].style.pointerEvents = `auto`;
    //     } else {
    //         search[i].style.pointerEvents = `none`;
    //     }
    // }
}


/**
 * Clears the grid (not including walls)
 */
clear.addEventListener('click', () => {
    clearGrid();
})

/**
 * Clears the grid including walls
 */
clearBoard.addEventListener('click', () => {
    clearGrid(1);
})