// todo: útfæra backtracking reiknirit til að búa til völundarhús

let xtiles = 8,
    ytiles = 8,
    tilesize;

let board, start, playing, interval;
let current;
let image;

let canvas, ctx;

const new_board = (xtiles, ytiles) => {
  let board = [],
      count = 0;
  for (var y = 0; y < ytiles; y++) {
    for (var x = 0; x < xtiles; x++) {
      board.push( {x:x, y:y, predecessor:null, visited:false, connections: []} );
      count++;
    }
  }
  return board;
}

// fisher-yates shuffle
const shuffle = (array) => {
  let i = 0,
      j = 0,
      temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const node_from_coords = (x, y) => {
  if (x < 0 || x >= xtiles ||
      y < 0 || y >= ytiles) { return null; }
  return board[(x + ( y * xtiles ))];
}

const render = () => {
  const visited_color = '#f0f3f4',
        unvisited_color = '#737373',
        start_color = '#c6e9c9',
        border_color = '#343434';
  // first pass: lita allar nóður
  board.forEach((node) => {
    const x = node.x * tilesize,
          y = node.y * tilesize;

    ctx.fillStyle = node.visited ? visited_color : unvisited_color;
    ctx.fillRect(x, y, tilesize, tilesize);
  });
  // second pass: teikna grid
  board.forEach((node) => {
    const x = node.x * tilesize,
          y = node.y * tilesize;
    ctx.strokeStyle = border_color
    ctx.strokeRect(x, y, tilesize, tilesize);
  });
  // third pass: lita yfir grid þar sem að tengingar eru
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
  ctx.fillStyle = start_color;
  ctx.fillRect(start.x * tilesize + 1, start.y * tilesize + 1, tilesize - 2, tilesize - 2);
  ctx.drawImage(image, current.x * tilesize + 2, current.y * tilesize + 2, tilesize-4, tilesize-4);
};

// backtracking reikniritið virkar þannig:
// 1. byrjunarpunktur er valinn. Ég geri það inni í initialize fallinu.
const next_state = (node) => {
  // 2. nágranni er valinn af handahófi, en við hunsum þá sem við höfum þegar farið í. Færum okkur í nágrannanóðuna og tengjum nóðurnar hvor við aðra.
  let directions = [{x:1,y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
  shuffle(directions);
  let found_next = false;
  directions.some((dir) => {
    const possible_node = node_from_coords(node.x + dir.x, node.y + dir.y);
    if (possible_node && !possible_node.visited) {
      possible_node.visited = true;
      possible_node.connections.push(current);
      current.connections.push(possible_node);
      possible_node.predecessor = current;
      current = possible_node;
      found_next = true;
      return true;
    }
  });
  if (found_next) {
    return true;
  }
  // 4. ef að við erum komin aftur á byrjunarrreit þá er völundarhúsið tilbúið.
  if (!current.predecessor) {
    return false;
  }
  // 3. ef að enginn nágranni er gildur, þá förum við aftur um einn reit
  current = current.predecessor;
  return true;
}

const initialize = () => {
  tilesize = 600/xtiles;
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = tilesize * xtiles;
  canvas.height = tilesize * ytiles;
  ctx.imageSmoothingEnabled = false;

  board = new_board(xtiles, ytiles);
  current = start = board[Math.floor(Math.random()*(board.length))];
  start.visited = true;
  playing = false;
  document.getElementById('play').textContent = 'play';
  image = new Image();
  image.src = Math.random() > 0.5 ? './images/soldier.png' : './images/citizen.png';
  image.onload = () => { render() };
}

window.onload = function() {
  initialize();
  document.getElementById('next-step').onclick = () => {
      next_state(current);
      render();
  };
  document.getElementById('reset').onclick = () => {
      initialize();
  };
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
        playing = next_state(current);
        render();
      }, 50);
    }
  };
  document.getElementById('maze_size').oninput = (event) => {
    xtiles = ytiles = event.target.value;
    initialize();
  }
};
