import{sleep as r}from"../grid.js";import{clearGrid as o,makeWall as n,speed as e}from"../board.js";export async function recursiveMaze(o,e,t,a,i,l,c){if(a<2||i<2)return;let d="horizontal"===choose_orientation(a,i);console.log(d);let $=e+(d?0:rand(a-2,l)),u=t+(d?rand(i-2,c+t):0),f=$+(d?rand(a):0),s=u+(d?0:rand(i)),_=d?1:0,m=d?0:1,z=d?a:i;for(let h=0;h<z;h++)($!=f||u!=s)&&(await r(.05),n($,u)),$+=_,u+=m;let v=e,p=t,M=d?a:$-e,g=d?u-t:i;recursiveMaze(o,v,p,M,g,f,s),v=d?e:$+1,p=d?u+1:t,M=d?a:e+a-$-1,g=d?t+i-u-1:i,recursiveMaze(o,v,p,M,g,f,s)}function choose_orientation(r,o){return r<o?"horizontal":r>o?"vertical":Math.random()>.5?"horizontal":"vertical"}function rand(r,o){let n=1+Math.floor(Math.random()*(r-1));return n==o&&r>2&&(n=rand(r,o)),n}