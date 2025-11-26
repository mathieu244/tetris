// home.js
const Home = {
  methods:{
    handler_gamepadbuttondown(e){
        const { gamepad, button } = e.detail;
            //console.log(`${button}`);
            // peu importe le gamepad on entre
            if(button == "START"){
                 buttons = document.querySelectorAll("#menu-select span");
               let clicked_index=0;
                buttons.forEach((button, index) => {
                    if(button.classList.contains("clicked")) clicked_index=index;
                });

                window.router.push(buttons[clicked_index].getAttribute("path"));
            }
    },
    handler_gamepadaxis(e){
        //  console.log(`event: ${e}`);
        const { gamepad, axis, value } = e.detail;
        // Peu importe le player on bouge on exclu le retour a zero
        if(axis == "Y" && value !== 0){
            buttons = document.querySelectorAll("#menu-select span");
            let clicked_index=0;
            buttons.forEach((button, index) => {
                if(button.classList.contains("clicked")) clicked_index=index;
            });
            
            buttons[clicked_index].classList.remove("clicked");
            // en bas
            console.log(value);
                console.log(buttons);
            if(value > 0)
            {
                buttons[clicked_index-1 < 0 ? 0 : clicked_index-1].classList.add("clicked");
            }
            // en haut
            if(value < 0){
                buttons[clicked_index == buttons.length-1 ? buttons.length-1 : clicked_index+1].classList.add("clicked");
            }
        }
    }
  },
  // Note: pour pouvoir retirer un event, on doit lui donner un nom de fonction
    mounted() {
        window.addEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
        window.addEventListener("gamepadaxis", this.handler_gamepadaxis);
    },
    unmounted(){//retirer les events quand on quitte pour eviter les call sans les fonctions
        window.removeEventListener("gamepadaxis", this.handler_gamepadaxis);
        window.removeEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
    },
  template: `
    <div class="flex demo">
        <div>  </div>
        <div class="menu-top">BlockBattle!<br/><i style="font-size: small;">Press Start to enter/Select to exit</i></div>
    </div>
    <div class="flex demo">
        <div></div>
        <div id="menu-select" class="menu-buttons">
            <span class="button stack icon-picture clicked" path="/gb">Play!</span>
            <span class="button stack icon-puzzle" path="/hs">Highscore</span>
            <span class="button stack icon-file-code" path="/list">Bonus/Malus list!</span>
            <span class="button stack icon-help-circled" path="/help">Help</span>
        </div>
        <div></div>
    </div>
  `
};