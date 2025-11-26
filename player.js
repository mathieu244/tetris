let lock = false;
const pointage = [0,40,100,300,1200];
const levelsMultiplier = 500;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
    constructor({
        playerId = -1,
        points = 0,
        board = [],
        bonus = [],
        malus = []
    } = {}) {
        this.playerId = playerId;
        this.effects = [];
        this.points = 0;
        this.level=1;
        this.bonus=bonus;
        this.malus=malus;
        this.gameOver=false;
        this.name="";
        //build board
    }

    initialized() {
        return this.playerId >= 0;
    }
    reset(){
//        document.getElementById(`bonus${this.playerId}`).innerHTML = "";
//        document.getElementById(`malus${this.playerId}`).innerHTML = "";
        this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        this.points = 0;
        this.gameOver=false;
            /*    this.board[19]=[1,1,1,1,1,1,1,1,1,0];
        this.board[18]=[1,1,1,1,1,1,1,1,1,0];
        this.board[17]=[1,1,1,1,1,1,1,1,1,0];
        this.board[16]=[1,1,1,1,1,1,1,1,1,0];
        this.board[15]=[1,1,1,1,1,1,1,1,1,0];
        this.board[14]=[1,1,1,1,1,1,1,1,1,0];
        this.board[13]=[1,1,1,1,1,1,1,1,1,0];
    */
        this.bonus.length=0;
        this.malus.length=0;
        this.bonus.push(allBonus[0]);
        this.malus.push(allMalus[2]);
        this.generatePiece();
        this.drawStack();
    }
    initialize(id) {
        this.playerId=id;
        this.draw();
        this.canvas = document.getElementById("board"+id);
        this.ctx = this.canvas.getContext("2d");
        this.reset();

//        this.drawStack();
    }
    draw(){
        document.getElementById("player"+this.playerId).innerHTML = `
        <canvas id="board${this.playerId}" width="400" height="600"></canvas>
        `;
    }
    generatePiece(){
      //this.current_piece = pieces[0];
      this.current_piece = pieces[Math.floor(Math.random() * 7)];
      this.pieceX = 3;
      this.pieceY = -2;
    }
    //Fonction critique, doit etre en "mutex"
    // si la piece se place et retourne true, on la place sinon on retourne false
    canMove(piece=this.current_piece,pieceY=this.pieceY,pieceX=this.pieceX) { //Valide si un bloc est dans lespace dune piece pour dire si on bouge ou pas
        if(this.board == undefined) return;
        if(piece == undefined) return;
        if (lock) return;
            lock = true;

        let onboard=this.getPieceCoordinates(piece,pieceY,pieceX);
        const rows = piece.length;
        const cols = piece[0].length;
        let return_value=true;

        for (let i = 0; i < onboard.length; i++) {
            let coordonee=onboard[i];
            // deborde du tableau en Y
            if (return_value == true && coordonee.piece != 0 && coordonee.y >= this.board.length) return_value=false;
            // deborde du tableau en X
            if (return_value == true && coordonee.piece != 0 && (coordonee.x >= this.board[0].length || coordonee.x < 0 )) return_value=false;
            //autre piece a la nouvelle position
            if(coordonee.y >= 0){
                if (return_value == true && coordonee.piece !==0 && this.board[coordonee.y][coordonee.x] !== 0) return_value=false;
            }
        }

        if(return_value){
            this.current_piece=piece;
            this.pieceX=pieceX;
            this.pieceY=pieceY;
            this.drawGrid(); // Draw ici pour eviter un lag dans l'affichage
        }
        lock = false;
        return return_value;
    }
    //Retourne toutes les cases (meme si elle sont vide pour valider les possibilités de rotation)
    getPieceCoordinates(piece,pieceY,pieceX) {
        const coords = [];
        const rows = piece.length;
        const cols = piece[0].length;

        for (let py = 0; py < rows; py++) {
            for (let px = 0; px < cols; px++) {

                // ne retourner que les blocs solides
                //if (piece[py][px] === 0) continue;

                const boardY = pieceY + py;
                const boardX = pieceX + px;

                coords.push({ x: boardX, y: boardY, piece: piece[py][px] });
            }
        }

        return coords;
    }
    clearFullLines() {
        let linesCleared = 0;
        if(this.board == undefined) return;

        for (let y = ROWS - 1; y >= 0; y--) {

            // Vérifier si la ligne est pleine (aucun zéro)
            const full = this.board[y].every(cell => cell !== 0);

            if (full) {
                linesCleared++;

                // retirer la ligne
                this.board.splice(y, 1);

                // ajouter une ligne vide en haut
                this.board.unshift(new Array(COLS).fill(0));

                // IMPORTANT : réévaluer la même ligne
                y++;
            }
        }

        // Calcul des points
        this.points += pointage[linesCleared];
        console.log(this.playerId);
        document.getElementById("points"+this.playerId).innerHTML = `
        ${this.points}
        `;

        // Calcul du changement de level
        if (this.points > this.level * levelsMultiplier) {
            //this.level++
            this.level = Math.floor(this.points/levelsMultiplier);
            document.getElementById("level"+this.playerId).innerHTML = `
                ${this.level}
            `;
        }

        // Ajout dun bonus quand on clear 4 lignes
        // on limite a 1 par items
        if(linesCleared === 4){
            if(randomInt(0,1) == 0){
                let levelbonus=allBonus.filter(b => b.level <= this.level );
                //console.log(levelbonus);
                if(this.bonus.length == 0) this.bonus.push(levelbonus[randomInt(0,levelbonus.length-1)]);
            }
            else{
                let levelmalus=allMalus.filter(b => b.level <= this.level );
                //console.log(levelmalus);
                if(this.malus.length == 0) this.malus.push(levelmalus[randomInt(0,levelmalus.length-1)]);
            }
            //Ajouter un random pour choisir entre un bonus et un malus
            // Ajouter une condition selon le random pour limiter la stack a 1 par colonne
            
            this.drawStack();
        }
        return linesCleared;
    }
    rotateMatrix(matrix, angleDeg) {
        // si le jeux est fini et quon appuye sur quelque chose
        if (matrix == undefined) return;
        const rows = matrix.length;
        const cols = matrix[0].length;

        const size = Math.max(rows, cols);         // 3x3 ou 4x4
        const half = (size - 1) / 2;               // centre pivot

        const rad = angleDeg * Math.PI / 180;
        const m = new DOMMatrix().rotateSelf(0, 0, angleDeg);

        // nouvelle matrice vide
        const out = Array.from({ length: rows }, () => Array(cols).fill(0));

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {

                if (!matrix[y][x]) continue; // ignorer 0

                // translation vers origine
                const tx = x - half;
                const ty = y - half;

                // application via DOMMatrix
                const p = new DOMPoint(tx, ty).matrixTransform(m);

                // retour dans la grille
                const rx = Math.round(p.x + half);
                const ry = Math.round(p.y + half);

                // écrire si dans les bornes
                if (ry >= 0 && ry < rows && rx >= 0 && rx < cols) {
                    out[ry][rx] = matrix[y][x];
                }
            }
        }

        return out;
    }

    rotatePiece(angle=90) {
        if(this.canMove(this.rotateMatrix(this.current_piece, angle))) this.current_piece = this.rotateMatrix(this.current_piece, angle);
    }
    drawStack() {
        //console.log(this.bonus.map(b => b.title ).join("<br />"));
        document.getElementById("bonus"+this.playerId).innerHTML =  this.bonus.length > 0 ? `${this.bonus.map(b => b.icon == undefined ? b.title : `${b.title}<img class="bonus_icon" src="${b.icon}"></img>` ).join("<br />")}` : "";
        document.getElementById("malus"+this.playerId).innerHTML =  this.malus.length > 0 ? `${this.malus.map(b => b.icon == undefined ? b.title : `${b.title}<img class="bonus_icon" src="${b.icon}"></img>` ).join("<br />")}` : "";
    }
    drawGrid() {
        if(this.ctx==undefined) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {

                let colorIndex = this.board[y][x]; // valeur par défaut : board

            // vérifier si la cellule (x,y) est recouverte par la pièce
            if (this.current_piece) {
                const pieceHeight = this.current_piece.length;
                const pieceWidth  = this.current_piece[0].length;

                const relX = x - this.pieceX;
                const relY = y - this.pieceY;

                // si on est dans la zone de la pièce
                if (relX >= 0 && relX < pieceWidth && relY >= 0 && relY < pieceHeight) {
                    const pieceVal = this.current_piece[relY][relX];
                    if (pieceVal !== 0) {
                        colorIndex = pieceVal;
                    }
                }
            }
            
            // dessiner la cellule
            this.ctx.fillStyle = colors[colorIndex];
            this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            this.ctx.strokeStyle = "#222";
            this.ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    drawPiece() {
        if (this.current_piece == undefined)
            return false;

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if(x >= this.pieceX && x <= this.pieceX+this.current_piece.length-1 && y >= this.pieceY && y <= this.pieceY+this.current_piece[0].length-1)
                {
                    console.log(this.current_piece);
                    this.ctx.fillStyle = colors[this.current_piece[y][x]];
                    this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }else{
                    this.ctx.fillStyle = colors[this.board[y][x]];
                    this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
                // bordure pour mieux visualiser
                this.ctx.strokeStyle = "#222";
                this.ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    placePiece() {
        if (this.current_piece == undefined)
            return false;

        for (let y = 0; y < this.current_piece.length; y++) {
            for (let x = 0; x < this.current_piece[y].length; x++) {
                const val = this.current_piece[y][x];
                if (val !== 0) {
                    const gridY = y + this.pieceY;
                    const gridX = x + this.pieceX;
                    // vérifier les limites
                    if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                        this.board[gridY][gridX] = val;
                    }
                }
            }
        }
    }
}