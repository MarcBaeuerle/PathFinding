import { Grid } from "./grid.js";
import { aStar } from "./algorithms/aStar.js";
import { BFS } from "./algorithms/BFS.js";
import { DFS } from "./algorithms/DFS.js";
import { RS } from "./algorithms/RS.js";
import { primMaze } from "./algorithms/mazeGeneration.js";

let grid = document.querySelector(`#grid`);
let toggleWall = document.querySelector(`#toggleWall`);
let maze = document.getElementById('createMaze');
let slider = document.getElementById('speed');
let stats = document.getElementById('console');
let clear = document.getElementById('clear');
let search = document.getElementsByClassName('search');

const WALL_COLOR = `rgb(255, 255, 255)`;
const START_COLOR = `rgb(0, 128, 0)`;
const END_COLOR = `rgb(255, 0, 0)`;
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
        toggleButtons();
    });
}





/**
 * Creates and appends cells to page.
 * @param {int} x number of rows of grid
 * @param {int} y number of columns of grid.
 * @output cells to page
 * 
 * TODO: make the grid generation dynamic, but lets make sure a 10x10 works 
 * properly first.
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

            // if (i === 2 && j === 2) {
            //     node.classList.add(`end`);
            //     endNode = true;
            // }


            node.onmouseenter = toggle; //drag clicking works

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
 * Converts the grid on the page into an array to be used for the 
 * designated path finding algorithm
 */
export function computeArr(string) {
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

    if (string === 'astar') {
        aStar(test, 0);
    } else if (string === 'BFS') {
        BFS(test);
    } else if (string === 'DFS') {
        DFS(test);
    } else if (string == 'RS') {
        RS(test);
    }



}


/**
 * Creates a path from the end node to the start node
 * @param {array} path array from end node to start node
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
export function clearGrid() {
    let rSize = row.childElementCount;
    for (let i = 0; i < grid.childElementCount; i++) {
        for (let j = 0; j < rSize; j++) {
            document.getElementById(`node${(i * rSize) + (j + 1)}`).classList.remove(`path`, `visited`, `opened`);
            document.getElementById(`node${(i * rSize) + (j + 1)}`).innerHTML = ``;
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
        toggleWall.innerText = 'Add walls';
    } else {
        toggleWall.innerText = `Delete Walls`;
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
 * makes the grid center when screen enlarged, and inline-block
 * when screen shrinks
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
    // if (node.classList.contains('path')) {
    //     return;
    // }

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
 * Generates a maze on button click.
 * NOT IMPLEMENTED
 */
maze.addEventListener('click', () => {

    let matrix = new Array(rowCount);
    let count = 1;

    for (let i = 0; i < rowCount; i++) {
        matrix[i] = new Array(rowSize);

        for (let j = 0; j < rowSize; j++) {
            let node = document.getElementById(`node${count}`);
            let cList = node.classList;
            let val = 1;
            if (cList.contains(`start`)) {
                val = 2;
            } else if (cList.contains(`end`)) {
                val = 3;
            }
            matrix[i][j] = val;
            count++;
        }
    }

    var grid = new Grid(matrix, 0);

    primMaze(grid);
})


/**
 * Changes the speed of grid animation when moving the slider
 */
slider.addEventListener('input', () => {
    speed = 0.934 - Math.pow((slider.value-0.5), 1/10);
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
    for (let i = 0; i < search.length; i++) {
        if (disableSearch) {
            search[i].disabled = true;
        } else {
            search[i].disabled = false;
        }
    }
}

clear.addEventListener('click', () => {
    clearGrid();
})