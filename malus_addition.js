allMalus.push( new Bonus({
      title: "3X",
      level: 5, 
      icon: "assets/add-lines.png",
      effect: function(player){
        //Enleve la premiere ligne
        player.board.splice(1, 3);
        //Ajoute une ligne en haut vide
        player.board.push([1,1,1,0,1,1,1,1,1,1]);
        player.board.push([1,1,1,1,1,0,1,0,1,1]);
        player.board.push([1,1,1,1,1,0,1,0,1,1]);
        // Toujours refresh la grid pour le lag
        player.drawGrid();
    }}));