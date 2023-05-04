import { Grid } from "./grid.js";
import { aStar } from "./algorithms/aStar.js";

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
var rowCount;
var rowSize;
var initialWidth;


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
export function createBoard() {
    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;


    let y = Math.round((deviceWidth-20)/20);
    let x = Math.round(0.75*(deviceHeight/20));

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

            if (i === x-4 && j === y-4) {
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
 * Converts the grid on the page into an array to be used for the 
 * designated path finding algorithm
 */
function computeArr() {


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
    aStar(test, 0);
}


/**
 * Creates a path from the end node to the start node
 * @param {array} path array from end node to start node
 */
export function createPath(path) {


    let size = grid.childElementCount;
    let rSize = row.childElementCount;
    

    

    if (pathExists) {
        clearGrid();
    }

    async function load() {
        for (let i = path.length - 1; i > 0; i--) {
            let x = path[i].x;
            let y = path[i].y;

            await timer(1500/path.length);
            document.getElementById(`node${(y * rSize) + (x + 1)}`).classList.remove(`visited`);
            document.getElementById(`node${(y * rSize) + (x + 1)}`).classList.add(`path`);
        }
    }
    load();
    pathExists = true;
}


/**
 * Clears existing path on the grid
 */
export function clearGrid(){
    let rSize = row.childElementCount;
    for (let i = 0; i < grid.childElementCount; i++) {
        for (let j = 0; j < rSize; j++) {
            document.getElementById(`node${(i * rSize) + (j + 1)}`).classList.remove(`path`,`visited`,`test`);
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

export function displayNoPath() {
    let popup = document.getElementById('popup');
    popup.style.zIndex = '11';
    popup.style.opacity = '1';
    popup.style.transition = `opacity 0s`
    setTimeout(()=> {
        popup.style.transition = 'opacity 1.3s';
        popup.style.opacity = '0';
        setTimeout(()=>{
            popup.style.zIndex = '0';
        },1300);
    },400);
    
}


/**
 * makes 
 */
window.addEventListener(`resize`, ()=>{
    let container = document.getElementById("container");
    if (window.innerWidth >= initialWidth) {
        container.style.display = "flex";
    } else {
        container.style.display = "inline-block";
    }
})

export function explore(x, y) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.classList.remove(`test`);
    node.classList.add(`visited`);
}

export function displayFCost(x,y,f,g,h) {
    let node = document.getElementById(`node${(y * rowSize) + (x + 1)}`);
    node.innerHTML = `<p>F:${f} &nbsp&nbsp&nbsp g:${g} &nbsp&nbsp&nbsp h:${h} </p>`;
    node.classList.add(`test`);
}