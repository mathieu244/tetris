// gameboard.js
const GAMESTATES={STOP:0,PLAY:1,NAME:2, ENDED:3};

const Gameboard = {
  data(){
      return { 
          dropInterval: 500, // ms
          lastDrop: 0,
          state: GAMESTATES.STOP
        }
  },
    methods:{
         gameLoop(timestamp) {
          if(this.state == GAMESTATES.STOP || this.state == GAMESTATES.ENDED) return;

            if (!this.lastDrop) this.lastDrop = timestamp;
          const delta = timestamp - this.lastDrop;

          if (delta > this.dropInterval) {
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
                      this.state = GAMESTATES.ENDED;
                      //Save player et points
                      let allScores = JSON.parse(localStorage.getItem("highscores")) || [];

                      PLAYERS.forEach((p, index) => {
                        if (p.name != "" && p.points > 0) allScores.push({name: p.name, score: p.points, gameAt: new Date()}); // on sauvegarde juste si un nom
                      });
                      // Stocker
                      localStorage.setItem("highscores", JSON.stringify(allScores));
                      console.log(player.gameOver);
          //            gameOver.play();
                  }
                  }
              }
              player.drawGrid();
              });

              this.lastDrop = timestamp;
          }
          //console.log(i++);
          this.animationId = requestAnimationFrame(this.gameLoop);
        },
        generate_name_picker(id_html){
            // combien de lettres ?
            const NB = 7;

            const container = document.getElementById(id_html);

            for (let i = 0; i < NB; i++) {
                const sel = document.createElement("select");
                sel.setAttribute("name", `letter_${i}`);
                if(i===0) sel.setAttribute("selected","");
                // option vide
                const empty = document.createElement("option");
                empty.value = "";
                empty.textContent = ""; 
                sel.appendChild(empty);
                for (let c = 65; c <= 90; c++) { // A–Z
                    const opt = document.createElement("option");
                    opt.textContent = String.fromCharCode(c);
                    sel.appendChild(opt);
                }

                container.appendChild(sel);
            }

/*            btn.onclick = () => {
                const letters = [...container.querySelectorAll("select")].map(s => s.value);
                //document.getElementById("result").textContent = "Mot : " + letters.join("");
            }*/
        },
        handler_gamepadbuttondown(e){
            const { gamepad, button } = e.detail;
            // Contexte du choix du nom
            if(this.state == GAMESTATES.NAME){
              if(button == "START"){
                let selectors=document.querySelectorAll(`#player_name_0 select`);
                let letter_array = [...selectors].map(s => s.value);
                PLAYERS[gamepad.index] = new Player(gamepad.index);
                current_player = PLAYERS[gamepad.index];
                current_player.initialize(gamepad.index);
                current_player.name = letter_array.join("");
                document.getElementById(`player_show_name_${gamepad.index}`).innerHTML+=current_player.name;
                console.log(current_player.name);
                document.getElementById(`modal_0`).checked = false;

                this.state = GAMESTATES.STOP;
              }
              if(button == "SELECT"){
                this.state = GAMESTATES.STOP;
                document.getElementById(`modal_0`).checked = false;
              }
                //Trap le START pour valider
              return
            }

            if(this.state == GAMESTATES.ENDED){
              // Start quand une partie est fini, on replay avec les memes nom de joueurs
              if(button == "START"){
                PLAYERS.forEach((p,i) => {p.reset()});
                this.state = GAMESTATES.PLAY;
                this.start_gameloop();
                return
              }
            }
            // On sassure que le player est initier
            if(button == "START"){
                if(PLAYERS[gamepad.index] == undefined || !PLAYERS[gamepad.index].initialized()){
                    if(PLAYERS[gamepad.index] == undefined) PLAYERS[gamepad.index] = new Player(gamepad.index);
                    current_player = PLAYERS[gamepad.index];
                    current_player.initialize(gamepad.index);

                    gameMusic.play();
                    document.getElementById(`modal_0`).checked = false;
                    // Record le nom
//                    current_player.name = "";
                }
                if(this.state == GAMESTATES.STOP){
                  this.state = GAMESTATES.PLAY;
                  this.start_gameloop();
                }

            }
            if(button == "SELECT"){
                // Un seul modal a la fois
                this.state = GAMESTATES.NAME;
                if (document.getElementById(`modal_0`).checked) return;
                if(PLAYERS[gamepad.index] == undefined){
                    document.getElementById(`modal_show_player_number`).innerHTML = gamepad.index+1;
                    let selectors=document.querySelectorAll(`#player_name_0 select`);
                    selectors.forEach(select => {
                      select.selectedIndex = 0; // remet la première option comme sélectionnée
                    });
                    let current_sel = document.querySelector("#player_name_0 select[selected]");
                    current_sel.removeAttribute("selected");
                    document.querySelectorAll("#player_name_0 select")[0].setAttribute("selected","");
                    document.getElementById(`modal_0`).checked = true;
                }
                //Mettre la game sur pause pour permettre a lautre decrire son nom
            }
            current_player = PLAYERS[gamepad.index];
            // On evalue les touches seulement si le player est demarrer
            if(current_player != undefined){
                if(button=="SELECT"){
                    window.router.push("/");
                }

                if(this.state == GAMESTATES.STOP) return;

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
        },
        handler_gamepadaxis(e){
            //  console.log(`event: ${e}`);
            const { gamepad, axis, value } = e.detail;
            //  console.log(`axis ${axis}: ${value}`);
            current_player = PLAYERS[gamepad.index];
            if(this.state == GAMESTATES.NAME){
              // fait tourner le selecteur
              let current_sel = document.querySelector("#player_name_0 select[selected]");
              if(axis == "Y"){
                let current = current_sel.selectedOptions[0];
                if(value == -1){
                  if(current.nextElementSibling == null){
                    current_sel.value = current_sel.options[0].value;
                  }else{
                    current_sel.value = current.nextElementSibling.value;
                  }
                }
                if(value == 1){
                  if(current.previousElementSibling == null){
                    current_sel.value = current_sel.options[current_sel.options.length-1].value;
                  }else{
                    current_sel.value = current.previousElementSibling.value;
                  }
                }
              }
                // Change de selecteur
                if(axis == "X"){
                  if(value == -1){
                    //Bouge a gauche
                    if(current_sel.previousElementSibling != null){
                      current_sel.removeAttribute("selected");
                      current_sel.previousElementSibling.setAttribute("selected", "");
                    }
                  }
                  if(value == 1){
                    //Bouge a droite
                    if(current_sel.nextElementSibling != null){
                      current_sel.removeAttribute("selected")
                      current_sel.nextElementSibling.setAttribute("selected", "")
                    }
                  }
                }

              return
            }

            if(current_player == undefined) return;
            if (axis=="X"){
                current_player.canMove(current_player.current_piece, current_player.pieceY, current_player.pieceX+value)
            }
            if (axis=="Y"){
                current_player.canMove(current_player.current_piece, current_player.pieceY+1, current_player.pieceX)
            }
            current_player.drawGrid();
        },
        start_gameloop(){
                  // game loop
        this.animationId = requestAnimationFrame(this.gameLoop);
      }
    },
    unmounted(){
        window.removeEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
        window.removeEventListener("gamepadaxis", this.handler_gamepadaxis);
        PLAYERS.length=0;

        // Arret de la gameloop
        this.state = GAMESTATES.STOP;
        cancelAnimationFrame(this.animationId);
    },
    mounted(){
        window.addEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
        window.addEventListener("gamepadaxis", this.handler_gamepadaxis);

        this.generate_name_picker("player_name_0");

    },
  template: `
  <div class="modal">
  <input id="modal_0" type="checkbox" />
  <label for="modal_0" class="overlay"></label>
  <article>
    <header>
      <h3>Enter your name player <span id="modal_show_player_number">1</span>!</h3>
      <label for="modal_0" class="close">&times;</label>
    </header>
    <section id="player_name_0" class="content">
    </section>
    <footer>
      <label for="modal_0" class="button dangerous">
        Press Start to confirm and start!
      </label>
    </footer>
  </article>
</div>
<div class="flex four grow">
    <div>
      Points: <span id="points0">0</span><br />
      Niveau: <span id="level0">1</span><br />
      <div class="bonus">
        Bonus(Y) <br /><span id="bonus0"></span> 
      </div>
      <div class="bonus">
        Malus(X) <br /><span id="malus0"></span>
      </div>
    </div>
    <div>
      Player 1: <span id="player_show_name_0"></span><br />
      <div id="player0" style="height:100vh;"><br /><br /><br /><br /><br />START pour commencer<br />SELECT pour votre nom</div>
    </div>
    <div>
        Player 2: <span id="player_show_name_1"></span><br />
        <div id="player1" style="height:100vh;"><br /><br /><br /><br /><br />START pour commencer<br />SELECT pour votre nom</div>
    </div>
    <div>
      Points: <span id="points1">0</span><br />
      Niveau: <span id="level1">1</span><br />
      <div class="bonus">
        Bonus(Y) <br /><span id="bonus1"></span> 
      </div>
      <div class="bonus">
        Malus(X) <br /><span id="malus1"></span>
      </div>
    </div>
  </div>
  `
};