import Maze from './mazemodule.js';
import { Queue } from './linked_list.js';

let width = 9, height = 9, size;
let queue, start, count, step, maze, interval, playing;
let show_distance = false;


const render = (board) => {
  const tilesize = size;
  const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = tilesize * width -2,
        h = canvas.height = tilesize * height -2;
  ctx.font = tilesize*0.4+'px sans-serif';
  ctx.textAlign = 'center';

  const visited_color = '#f0f3f4',
        unvisited_color = '#525252',
        start_color = '#c6e9c9',
        border_color = '#343434';
  board.forEach((node) => {
    const x = node.x * tilesize,
          y = node.y * tilesize;
    ctx.strokeStyle = border_color;
    ctx.strokeRect(x, y, tilesize, tilesize);
  });
  board.forEach((node) => {
    node.connections.forEach(connected => {
      ctx.fillStyle = visited_color;
      if (connected.x < node.x) {
        ctx.fillRect(
          connected.x * tilesize + 1,
          node.y * tilesize + 1,
          tilesize * 2 - 2,
          tilesize - 2);
      }
      if (connected.y < node.y) {
        ctx.fillRect(
          node.x * tilesize + 1,
          connected.y * tilesize + 1,
          tilesize - 2,
          tilesize * 2 - 2);
      }
    });
  });
  board.forEach((node) => {
    if (Number.isInteger(node.distance)) {
      if (node.count == step) {
        ctx.fillStyle ='#5f993e';
      } else if (node.count < step){
        ctx.fillStyle ='#101316';
      } else {
        ctx.fillStyle ='#367bc7';
      }
      ctx.fillText(show_distance ? node.distance : node.count, (node.x+0.45)*tilesize, (node.y+0.65)*tilesize, tilesize);
    }
  });
};

const node_from_coords = (x, y) => {
  if (x < 0 || x >= width ||
      y < 0 || y >= height) { return null; }
  return grid[(x + ( y * width ))];
}

const get_neighbors = (grid, node) => {
  const index = grid.findIndex(gridnode => gridnode.x === node.x && gridnode.y === node.y);
  if (index == -1) {
    return [];
  }
  let neighbors = [];
  for(let n of node.connections) {
    if (Number.isInteger(n.distance)) {
      continue;
    }
    neighbors.push(n);
  }
  return neighbors;
}


const advance = (q, g) => {
  step++;
  if (step == 1) {
    count++;
    let node = g[start];
    node.distance = 0;
    node.count = count;
    q.enqueue(node);
    render(maze);
    return;
  } else if(q.is_empty()){
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
  render(maze);
  return;
}

const initialize = () => {
  size = 600/width;
  maze = Maze(width, height);
  maze.forEach((node)=>{
    node.predecessor = node.distance = node.count = null;
  });
  playing = false;
  document.getElementById('play').textContent = 'play';
  count = step = 0;
  start = Math.floor(Math.random()*(width*height));
  queue = new Queue();
  render(maze);
}

window.onload = function() {
  initialize();
  document.getElementById('next-step').onclick = () => {
      advance(queue, maze);
  };
  document.getElementById('reset').onclick = () => {
      initialize();
  };
  document.getElementById('toggle-modes').onclick = () => {
      show_distance = !show_distance;
      render(maze);
  };
  document.getElementById('maze_size').oninput = (event) => {
    width = height = event.target.value;
    initialize();
  }
  document.getElementById('play').onclick = (click) => {
    if (playing) {
      clearInterval(interval);
      playing = false;
      click.target.textContent = 'play';
    } else {
      playing = true;
      click.target.textContent = 'stop';
      interval = setInterval(()=> {
        if (!playing) {
          clearInterval(interval);
          return;
        }
        advance(queue, maze);
        render(maze);
      }, 25);
    }
  }
};
