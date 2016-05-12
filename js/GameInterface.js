var GameInterface = {
	backgroundReady : false,
	backgroundImage : new Image(),

	heroReady : false,
	heroImage : new Image(),

	monsterReady: false,
	monsterImage : new Image(),

	bulletReady: false,
	bulletImage: new Image(),

	deadMonsterReady: false,
	deadMonsterImage: new Image(),

	//affiche dans la console de jeu
	gameConsoleLog : function(txt) {
		var console = document.getElementById(Constants.gameConsoleId);
		var date = new Date();
		console.innerHTML += "\n[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + txt;
		console.scrollTop = console.scrollHeight;
	},

	//fonction d'affichage du canvas inferieur
	drawBottomCanvas : function() {
		var canvas = document.getElementById(Constants.bottomCanvasId);
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		//Dessine cercle hp
		var x = canvas.width*0.1;
		this.drawBottomCircle(context, x, canvas.height*0.5, 47, Player.hpInPercent(), "red");
		
		//Dessine cercle xp
		var x = canvas.width*0.9;
		this.drawBottomCircle(context, x, canvas.height*0.5, 47, Player.xpInPercent(), "green");
	},

	//dessine un cercle a la position définie
	drawBottomCircle : function(context, x, y, radius, percent, color) {
		var debRad = 0.5-(percent/100);
		var finRad = 0.5+(percent/100);
		
		context.strokeStyle = "black";

		//dessine le cercle exterieur
		context.beginPath();
		context.save();
		context.shadowBlur = 20; 
		context.shadowColor = "black";  
		context.arc(x, y, radius, 0, 2*Math.PI);
		context.stroke();
		context.closePath();
		
		//remplit le cercle 
		context.beginPath();
		context.fillStyle = color;
		context.arc(x, y, radius, debRad*Math.PI, finRad*Math.PI);
		context.fill();
		context.restore();
		context.closePath();
		
		//affiche le pourcentage
		context.beginPath();
		context.save();
		context.font = "25px Arial";
		context.fillStyle = "white";
		context.fillText(percent + "%", x - 18, y);
		context.restore();
		context.closePath();
	},

	//fonction d'affichage du canvas superieur
	drawTopCanvas : function() {
		var canvas = document.getElementById(Constants.topCanvasId);
		var context = canvas.getContext('2d');


		context.clearRect(0, 0, canvas.width, canvas.height);

		//affiche le nom
		context.beginPath();
		context.font = "12px Arial";
		context.fillStyle = "white";
		context.fillText(Player.name, canvas.width*0.01, canvas.height*0.6);
		context.closePath();

		//affiche le lvl
		context.beginPath();
		context.font = "12px Arial";
		context.fillStyle = "white";
		context.fillText("Lvl : "+Player.lvl, canvas.width*0.20, canvas.height*0.6);
		context.closePath();

		//affiche Stat
		context.beginPath();
		context.font = "12px Arial";
		context.fillStyle = "white";
		context.fillText("Hp Max : "+Player.maxHp+" Speed : "+Player.speed+" Score : "+Player.score, canvas.width*0.75, canvas.height*0.6);
		context.closePath();
	},

	render: function() {
		var canvas = document.getElementById(Constants.mainCanvasId);
		var context = canvas.getContext('2d');

		// background
		if (this.backgroundReady) {
			context.drawImage(this.backgroundImage, 0, 0);
		}

		// player
		if (this.heroReady) {
			if (Player.direction == "top") {
				this.heroImage.src = Constants.heroImage_top;
			} else if (Player.direction == "bottom") {
				this.heroImage.src = Constants.heroImage_bottom;
			} else if (Player.direction == "right") {
				this.heroImage.src = Constants.heroImage_right;
			} else if (Player.direction == "left") {
				this.heroImage.src = Constants.heroImage_left;
			}

			context.drawImage(this.heroImage, Player.x, Player.y);
		}

		// bullets
		if ( (this.bulletReady) && (Game.bulletGeneration) ) {
			if (Game.bulletTable.length > 0) {
				for (var i = 0; i < Game.bulletTable.length; i++) {	
					context.drawImage(this.bulletImage, Game.bulletTable[i].x, Game.bulletTable	[i].y);
				}	
			}
		}

		// monsters
		if (this.monsterReady) {
			for(var i = 0; i < Game.monsterTable.length; i++)
			{
				context.drawImage(this.monsterImage, Game.monsterTable[i].x, Game.monsterTable[i].y);
			}
		}

		this.drawBottomCanvas();
		this.drawTopCanvas();
	},
}