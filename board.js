const WALL_COLOR = `rgb(255, 255, 255)`;
const START_COLOR = `rgb(0, 128, 0)`;
const END_COLOR = `rgb(255, 0, 0)`;

var startNode = false;
var endNode = false;
var mouseDown = false;


document.addEventListener('mousedown', function() {
    mouseDown = true;
    console.log(`mousedown`);
})
document.addEventListener('mouseup', function() {
    mouseDown = false;

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
    let x = 10;
    let y = 10;
    let grid = document.querySelector('#grid');

    for (let i = 0; i < x; i++) {
        let row = document.createElement('div');
        row.className = `row`;
        row.id = `row ${i + 1}`;

        for (let j = 0; j < y; j++) {
            let node = document.createElement('div');
            node.className = `node`;
            node.id = `node${(i * 10) + (j + 1)}`;

            
            node.addEventListener('mouseenter', function() {    //TODO: fix interaction
                setTimeout(() => {
                    if (mouseDown) {
                        clicked(this.id);
                    }
                }, 0);
                
            })

            

            row.appendChild(node);
        }

        grid.appendChild(row);
    }


}

/**
 * Handles creating the grid of through user input, first click creates the start node, second
 * click creates the end node, and the rest create walls. All states are toggled off when clicked 
 * again
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
            cList.toggle(`wall`);
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