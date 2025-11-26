// list.js
const List = {
      methods:{
        handler_gamepadbuttondown(e){
            const { gamepad, button } = e.detail;
                //console.log(`${button}`);
                // peu importe le gamepad on entre
                if(button == "SELECT"){
                    window.router.push("/");
                }
            }
    },
    mounted() {
        window.addEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
    },
    unmounted(){//retirer les events quand on quitte pour eviter les call sans les fonctions
        window.removeEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
    },

  template: `
    <div>
      <h2>List des malus bonus</h2>
      <p>Pour connaître les bonus/malus par niveau présentement disponible.</p>
    </div>
  `
};