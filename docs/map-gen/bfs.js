import { Queue } from './linked_list.js';

const xtiles = 6,
      ytiles = 6,
      tilesize = 64;

let grid, queue, start, count, step;
let show_distance = false;

const initialize_grid = (xtiles, ytiles) => {
  let grid = [],
      count = 0;
  for (var y = 0; y < ytiles; y++) {
    for (var x = 0; x < xtiles; x++) {
      grid.push( {x:x, y:y, predecessor:null, distance:null, count:null, wall:false} );
      count++;
    }
  }
  return grid;
}

const node_from_coords = (x, y) => {
  if (x < 0 || x >= xtiles ||
      y < 0 || y >= ytiles) { return null; }
  return grid[(x + ( y * xtiles ))];
}

const get_neighbors = (grid, node) => {
  const index = grid.findIndex(gridnode => gridnode.x === node.x && gridnode.y === node.y);
  if (index == -1) {
    return [];
  }
  let directions = [[1,0], [0,1], [-1,0], [0,-1]],
      neighbors = [];
  for(let d of directions) {
    let neighbor = node_from_coords(node.x + d[0], node.y+d[1]);
    if (!neighbor ||
        neighbor.wall ||
        Number.isInteger(neighbor.distance)
        ) { continue }
    neighbors.push(neighbor);
  }
  return neighbors;
}

const render = () => {
  window.grid = grid;
  window.queue = queue;
  const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width = tilesize * xtiles,
        height = canvas.height = tilesize * ytiles;
  ctx.font = tilesize*0.6+'px sans-serif';
  grid.forEach((node) => {
    ctx.strokeStyle ='#000000';
    ctx.strokeRect(node.x*tilesize, node.y*tilesize, tilesize, tilesize);
    if (Number.isInteger(node.distance)) {
      if (node.count == step) {
        ctx.fillStyle ='#19320b';
      } else if (node.count < step){
        ctx.fillStyle ='#101316';
      } else {
        ctx.fillStyle ='#1c3045';
      }
      ctx.fillRect(node.x*tilesize, node.y*tilesize, tilesize, tilesize);
      ctx.strokeStyle ='#ffffff';
      ctx.strokeRect(node.x*tilesize, node.y*tilesize, tilesize, tilesize);
      ctx.fillStyle ='#98adb1';
      ctx.fillText(show_distance ? node.distance : node.count, (node.x)*tilesize, (node.y+0.75)*tilesize, tilesize);
    } else if (node.wall) {
      ctx.fillStyle ='#d261d7';
      ctx.fillRect(node.x*tilesize, node.y*tilesize, tilesize, tilesize);
    }
  });
};

const advance = (q, g) => {
  step++;
  if (step == 1) {
    count++;
    let node = g[start];
    node.distance = 0;
    node.count = count;
    q.enqueue(node);
    render();
    return;
  }
  let node = q.dequeue();
  const neighbors = get_neighbors(g, node);
  neighbors.forEach((n)=>{
    count++;
    n.count = count;
    n.predecessor = node;
    n.distance = node.distance+1;
    q.enqueue(n);
  });
  render();
  return;
}

const initialize = () => {
  start = count = step = 0;
  grid = initialize_grid(xtiles, ytiles);
  let walls = [];
  while (walls.length < Math.floor(xtiles*ytiles*0.3)) {
    walls.push([
      Math.floor(Math.random()*(xtiles)),
      Math.floor(Math.random()*(ytiles))
    ]);
  }
  walls.forEach((coords)=>{
    node_from_coords(coords[0], coords[1]).wall = true;
  });
  do {
    start = Math.floor(Math.random()*(xtiles*ytiles));
  } while (grid[start].wall);
  queue = new Queue();
  render();
}

window.onload = function() {
  initialize();
  document.getElementById('next-step').onclick = () => {
      advance(queue, grid);
  };
  document.getElementById('reset').onclick = () => {
      initialize();
  };
  document.getElementById('toggle-modes').onclick = () => {
      show_distance = !show_distance;
      render();
  };
};
