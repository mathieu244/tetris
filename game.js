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
    icon: "assets/remove-lines.png",
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