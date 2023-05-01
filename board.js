import { Grid, aStar } from "./grid.js";

let compute = document.getElementById(`compute`);
let grid = document.querySelector(`#grid`);
let toggleWall = document.querySelector(`#toggleWall`);

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

compute.addEventListener(`click`, () => {
    computeArr();
})

/**
 * Creates and appends cells to page.
 * @param {int} x number of rows of grid
 * @param {int} y number of columns of grid.
 * @output cells to page
 * 
 * TODO: make the grid generation dynamic, but lets make sure a 10x10 works 
 * properly first.
 */
export function createBoard(xx, yy) {
    let x = 40;
    let y = 80; 

    grid.onmousedown = enableToggle;
    
    for (let i = 0; i < x; i++) {
        let row = document.createElement('div');
        row.className = `row`;
        row.id = `row${i + 1}`;

        for (let j = 0; j < y; j++) {
            let node = document.createElement('div');
            node.className = `node`;
            node.id = `node${(i * y) + (j + 1)}`;


            node.onmouseenter = toggle; //drag clicking works

            row.appendChild(node);
        }

        grid.appendChild(row);
    }

    grid.onmouseup = disableToggle;
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

    if (e.target !== grid) {
        toggle(e);
    }
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

    clicked(e.target.id)
}


/**
 * computes the array input for the designated path finding algorithm
 */
function computeArr() {


    let size = grid.childElementCount;
    let size2 = row.childElementCount;
    console.log(size2);
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
    aStar(test);
}

export function createPath(path) {


    let size = grid.childElementCount;
    let rSize = row.childElementCount;
    

    

    if (pathExists) {
        clearPath();
    }

    async function load() {
        for (let i = 1; i < path.length - 1; i++) {
            let x = path[i].x;
            let y = path[i].y;

            await timer(1500/path.length);
            document.getElementById(`node${(y * rSize) + (x + 1)}`).classList.add(`path`);
        }
    }
    load();
    pathExists = true;
}

function clearPath(){
    let rSize = row.childElementCount;
    for (let i = 0; i < grid.childElementCount; i++) {
        for (let j = 0; j < rSize; j++) {
            document.getElementById(`node${(i * rSize) + (j + 1)}`).classList.remove(`path`);
        }
    }
    pathExists = false;
}

toggleWall.addEventListener('click', () => {
    deleteWalls = !deleteWalls;
    if (deleteWalls) {
        toggleWall.innerText = 'Add walls';
    } else {
        toggleWall.innerText = `Delete Walls`;
    }
})