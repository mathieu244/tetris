const PLAYERS = [];
const ROWS = 20;   // hauteur
const COLS = 10;   // largeur
const CELL_SIZE = 30;
const colors = ["#000000", "#FF0", "#0F0", "#0FF", "#F00", "#00F", "#F0F", "#FFA500"];
const gameMusic = new Audio("Title.mp3");
const gameOver = new Audio("GameOver.mp3");
gameMusic.loop = true;

// matrice des pièces (numéros correspondant à colors)
const I = [
  [0, 0, 0, 0],
  [1, 1, 1, 1], // couleur #FF0
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

const J = [
  [2, 0, 0], // couleur #0F0
  [2, 2, 2],
  [0, 0, 0]
];

const L = [
  [0, 0, 3], // couleur #0FF
  [3, 3, 3],
  [0, 0, 0]
];

const O = [
  [4, 4], // couleur #F00
  [4, 4]
];

const S = [
  [0, 5, 5], // couleur #00F
  [5, 5, 0],
  [0, 0, 0]
];

const T = [
  [0, 6, 0], // couleur #F0F
  [6, 6, 6],
  [0, 0, 0]
];

const Z = [
  [7, 7, 0], // couleur #FFA500
  [0, 7, 7],
  [0, 0, 0]
];

const pieces = [I, J, L, O, S, T, Z];

const allBonus = [
  //Bonus de niveau 1
    // RETIRE LA DERNIERE LIGNE
    new Bonus({
      title: "1X",
      level: 1,
      icon: "assets/remove-lines.png",
      effect: function(player){
        //Enleve la derniere ligne
        player.board.splice(player.board.length-1, 1);
        //Ajoute une ligne en haut vide
        player.board.unshift(new Array(COLS).fill(0));
        // Toujours refresh la grid pour le lag
        player.drawGrid();
    }}),
    new Bonus({
      title: "2X",
      level: 2,
      effect: function(player){
        //Enleve 2 ligne du haut
        player.board.splice(player.board.length-1, 2);
        //Ajoute une ligne en haut vide
        player.board.unshift(new Array(COLS).fill(0));
        player.board.unshift(new Array(COLS).fill(0));
        // Toujours refresh la grid pour le lag
        player.drawGrid();
      }
    })
  ];

const allMalus = [//Malus de niveau 1
    // RETIRE LA DERNIERE LIGNE
    new Bonus({
      title: "1X",
      level: 1,
      icon: "assets/add-lines.png",
      effect: function(player){
        //Enleve la premiere ligne
        player.board.splice(1, 1);
        //Ajoute une ligne en haut vide
        player.board.push([1,1,1,0,1,1,1,1,1,1]);
        // Toujours refresh la grid pour le lag
        player.drawGrid();
      }
    }),
    new Bonus({
      title: "2X",
      level: 2,
      icon: "assets/add-lines.png",
      effect: function(player){
        //Enleve la premiere ligne
        player.board.splice(1, 2);
        //Ajoute une ligne en haut vide
        player.board.push([1,1,1,0,1,1,1,1,1,1]);
        player.board.push([1,1,1,0,1,1,1,1,1,1]);
        // Toujours refresh la grid pour le lag
        player.drawGrid();
      }
    })
  ];

window.addEventListener("gamepadbuttondown", e => {
  const { gamepad, button } = e.detail;
  if(!PLAYERS.includes(new Player(gamepad.index))){
    PLAYERS.push(new Player(gamepad.index))
  }
  current_player = PLAYERS[gamepad.index];

  if(!current_player.initialized()){
    current_player.playerId=gamepad.index;
    current_player.draw();
    current_player.canvas = document.getElementById("board"+gamepad.index);
    current_player.ctx = current_player.canvas.getContext("2d");
    current_player.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
/*    current_player.board[19]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[18]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[17]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[16]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[15]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[14]=[1,1,1,1,1,1,1,1,1,0];
    current_player.board[13]=[1,1,1,1,1,1,1,1,1,0];
*/
    current_player.drawGrid();

    //Effet qui enleve une ligne a la fin
    console.log(allBonus);
    current_player.bonus.push(allBonus[0]);
    current_player.malus.push(allMalus[2]);
    current_player.drawStack();
    gameMusic.play();
  }else{
    //TODO revoir cette condition
    if (PLAYERS.length > 1){
    if(current_player.playerId == 1)
      opponent_player = PLAYERS[0]
    else
      opponent_player = PLAYERS[1]
  }else{
    //si on est seul, le malus revient sur nous
    opponent_player = current_player;
  }
    console.log(`Player ${current_player.playerId} appuye sur ${button}`)
    if(button=="A"){
      current_player.canMove(current_player.rotateMatrix(current_player.current_piece,90), current_player.pieceY, current_player.pieceX)
    }
    if(button =="B"){
      current_player.canMove(current_player.rotateMatrix(current_player.current_piece,-90), current_player.pieceY, current_player.pieceX)
    }
    if(button=="L1"){
          while (current_player.canMove(current_player.current_piece, current_player.pieceY+1, current_player.pieceX)){
            
          }

    }
    if(button=="Y"){
      if(current_player.bonus.length > 0)
      {
        e=current_player.bonus.pop();
        e.apply_effect(current_player);
        current_player.drawStack();

      }
    }
    if(button=="X"){
      if(current_player.malus.length > 0)
      {
        e=current_player.malus.pop();
        e.apply_effect(opponent_player);
        current_player.drawStack();
      }
    }
  }
});

window.addEventListener("gamepadaxis", e => {
//  console.log(`event: ${e}`);
  const { gamepad, axis, value } = e.detail;
//  console.log(`axis ${axis}: ${value}`);
  current_player = PLAYERS[gamepad.index];
  if (axis=="X"){
    current_player.canMove(current_player.current_piece, current_player.pieceY, current_player.pieceX+value)
  }
  if (axis=="Y"){
    current_player.canMove(current_player.current_piece, current_player.pieceY+1, current_player.pieceX)
  }
    current_player.drawGrid();
});

// game loop
let dropInterval = 500; // ms
let lastDrop = 0;

function gameLoop(timestamp) {
  if (!lastDrop) lastDrop = timestamp;
  const delta = timestamp - lastDrop;

  if (delta > dropInterval) {
    PLAYERS.forEach((player, index) => {
      if(!player.gameOver){
        if (player.canMove(player.current_piece, player.pieceY+1, player.pieceX)) {
          //
        } else {
          player.placePiece();
          player.clearFullLines();
          player.generatePiece();
          if(!player.canMove(player.current_piece, player.pieceY+1, player.pieceX)){
            //GameOver
            player.current_piece = undefined;
            player.gameOver=true;
//            gameOver.play();
          }
        }
      }
      player.drawGrid();
    });

    lastDrop = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);