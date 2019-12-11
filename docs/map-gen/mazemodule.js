let xtiles, ytiles;
let board, start, playing, interval;
let current;
let image;

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

const Maze = (width, height) => {
  xtiles = width;
  ytiles = height;
  board = new_board(width, height);
  current = start = board[Math.floor(Math.random()*(board.length))];
  start.visited = true;
  let not_finished = true;
  while (not_finished) {
    not_finished = next_state(current);
  }
  board.forEach((node)=>{
    node.visited = node.predecessor = undefined;
  });
  return board;
}

export default Maze;
