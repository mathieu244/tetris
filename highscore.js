// highscore.js
const Highscore = {
    methods:{
        handler_gamepadbuttondown(e){
            const { gamepad, button } = e.detail;
                //console.log(`${button}`);
                // peu importe le gamepad on entre
                if(button == "SELECT"){
                    window.router.push("/");
                }
            },
        render(){
            const tableBody = document.querySelector("#highscoreTable tbody");
            const form = document.getElementById("scoreForm");

            // Charger scores depuis localStorage
            let scores = JSON.parse(localStorage.getItem("highscores")) || [];

            function renderScores() {
            // Trier par score décroissant
            scores.sort((a,b) => b.score - a.score);

            tableBody.innerHTML = "";
            scores.forEach(s => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${s.name}</td><td>${s.score}</td><td>${s.gameAt == undefined ? "" : s.gameAt.toLocaleString()}</td>`;
                tableBody.appendChild(row);
            });
            }

/*            form.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("playerName").value.trim();
            const score = parseInt(document.getElementById("playerScore").value);

            if(name && !isNaN(score)) {
                scores.push({name, score});
                localStorage.setItem("highscores", JSON.stringify(scores));
                renderScores();
                form.reset();
            }
            });*/

            // Initial render
            renderScores();
            /*
            Exemple pour injecter dans le localstorage
            const scores = [
                {name: "Alice", score: 1200},
                {name: "Bob", score: 900}
            ];

            // Stocker
            localStorage.setItem("highscores", JSON.stringify(scores));
            */
        }
    },
      // Note: pour pouvoir retirer un event, on doit lui donner un nom de fonction
    mounted() {
        window.addEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
        this.render();
    },
    unmounted(){//retirer les events quand on quitte pour eviter les call sans les fonctions
        window.removeEventListener("gamepadbuttondown", this.handler_gamepadbuttondown);
    },
  template: `
<style>
    body {
      font-family: Arial, sans-serif;
      background: #222;
      color: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    h1 {
      color: #f90;
    }
    table {
      border-collapse: collapse;
      width: 300px;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #555;
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #333;
    }
    form {
      display: flex;
      gap: 10px;
    }
    input[type="text"], input[type="number"] {
      padding: 5px;
      width: 120px;
    }
    button {
      padding: 5px 10px;
      background-color: #f90;
      border: none;
      cursor: pointer;
      color: #222;
      font-weight: bold;
    }
    button:hover {
      background-color: #fa0;
    }
  </style>
</head>
<body>
  <h1>Highscore</h1>

  <table id="highscoreTable">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Points</th>
        <th>Enregistré le</th>
      </tr>
    </thead>
    <tbody>
      <!-- Scores seront ajoutés ici -->
    </tbody>
  </table>
  `
};