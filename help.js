// help.js
const Help = {
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
      <h2>Aide pour les touches</h2>
      <p>Configuration arcade</p>
      <p>Configuration clavier</p>
    </div>
  `
};