allBonus.push( new Bonus({
      title: "3X",
      level: 5, 
      icon: "assets/remove-lines.png",
      effect: function(player){
        //Enleve la derniere ligne
        player.board.splice(player.board.length-1, 3);
        //Ajoute une ligne en haut vide
        player.board.unshift(new Array(COLS).fill(0));
        player.board.unshift(new Array(COLS).fill(0));
        player.board.unshift(new Array(COLS).fill(0));
        // Toujours refresh la grid pour le lag
        player.drawGrid();
    }}));