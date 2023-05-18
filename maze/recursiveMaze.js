import { sleep } from "../grid.js";
import { clearGrid, makeWall, speed } from "../board.js";




//  DOES
//  NOT
//  WORK
export async function recursiveMaze(grid, x, y, width, height, hx, hy) {

    if (width < 2 || height < 2) return;


    let horizontal = choose_orientation(width, height) === 'horizontal';
    console.log(horizontal);

    //Where will the wall be drawn from?
    let wx = x + (horizontal ? 0 : rand(width-2,hx));
    let wy = y + (horizontal ? rand(height-2,hy+y) : 0);

    //Where will the passage through the wall exist?
    let px = wx + (horizontal ? rand(width) : 0);
    let py = wy + (horizontal ? 0 : rand(height));

    //What direction will the wall be drawn?
    let dx = horizontal ? 1 : 0;
    let dy = horizontal ? 0 : 1;

    //How long will the wall be?
    let length = horizontal ? width : height;

    //what direction is perpendicular to the wall?
   let  dir = horizontal ? width : height;

    for (let i = 0; i < length; i++) {
        if (wx != px || wy != py) {
            await sleep (0.05);
            makeWall(wx, wy);
        }

        wx += dx;
        wy += dy;
    }

    let nx = x;
    let ny = y;

    let w = horizontal ? width : (wx-x);
    let h = horizontal ? (wy-y) : height;
    recursiveMaze(grid, nx, ny, w, h, px, py);


    nx = horizontal ? x : (wx+1);
    ny = horizontal ? (wy+1) : y;
    w = horizontal ? width : (x+width-wx-1);
    h = horizontal ? (y+height-wy-1) : height;
    recursiveMaze(grid, nx, ny, w, h, px, py);



}

function choose_orientation( width, height) {
    if (width < height) {
        return 'horizontal';
    } else if (width > height) {
        return 'vertical';
    } else {
        return (Math.random() > 0.5 ? 'horizontal' : 'vertical');
    }
}

function rand(int, hole) {

    let num = 1 + Math.floor(Math.random() * (int-1));

    if (num == hole && int > 2) {
        num = rand(int, hole);
    }

    return num;
}