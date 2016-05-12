var Game = {
	requestAnimationFrame : window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame,
	launchTime : Date.now(),
	monstersCaught : 0,
	keysDown : [],

	//entities tables
	monsterTable : [],
	bulletTable : [],
	deadEnemyTable : [],

	bulletGeneration : true,
	hitRecoverTime : 0,
	fireRecoverTime : 0,
	//canvas variables
	canvasWidth : false,
	canvasHeight : false,

	//fonction d'initiation du jeu
	init : function() {
		GameInterface.gameConsoleLog('Game initializing');

		//lancement du son
		var main_theme = new Audio();
		main_theme.src = Constants.mainTheme;
		main_theme.play();


		var canvas = document.getElementById(Constants.mainCanvasId); 
		var context = canvas.getContext("2d");

		this.canvasHeight = canvas.height;
		this.canvasWidth = canvas.width;
		Player.init(canvas.width*0.035, canvas.height);

		/**********************************
		***  Initialisation des images  *** 
		***********************************/

		//assignation des sources au images
		GameInterface.backgroundImage.src = Constants.backgroundImage;
		GameInterface.heroImage.src = Constants.heroImage_bottom;
		GameInterface.monsterImage.src = Constants.monsterImage;
		GameInterface.bulletImage.src = Constants.bulletImage;
		GameInterface.deadMonsterImage.src = Constants.deadMonsterImage;

		//au chargement des images, change la variable associée pour preciser que l'image est prete
		GameInterface.backgroundImage.onload = function () { GameInterface.backgroundReady = true; };
		GameInterface.heroImage.onload = function () { GameInterface.heroReady = true; };
		GameInterface.monsterImage.onload = function () { GameInterface.monsterReady = true; };
		GameInterface.bulletImage.onload = function () { GameInterface.bulletReady = true; };
		GameInterface.deadMonsterImage.onload = function () { GameInterface.deadMonsterReady = true; };
		
		/**********************************
		***   Listeners touches users   *** 
		***********************************/

		addEventListener("keydown", function (e) {
			Game.keysDown[e.keyCode] = true;
		}, false);

		addEventListener("keyup", function (e) {
			delete Game.keysDown[e.keyCode];
		}, false);


		//TableOfMonsters
		//genere 20 monstres aleatoirement sur la carte
		for(var i = 0; i<20; i++)
		{
			this.addMonster();
		}

		this.main();
		
	},

	main : function() {
		var now = Date.now();
		var delta = now - this.then;

		this.update(delta / 1000);
		
		GameInterface.render();

		this.then = now;

		if (Player.hp < 1) {
			alert("YOU ARE DEAD !\nTry not to get eaten next time !");
		} else {
			this.requestAnimationFrame.call(window, function() {
				Game.main();
			});
		}
	},	

	update: function(modifier) {
		//Deplacement
		if (90 in this.keysDown) { // 	 Player holding up
			Player.y -= Player.speed * modifier;
			Player.direction = "top";	
		}
		if (83 in this.keysDown) { // Player holding down
			Player.y += Player.speed * modifier;
			Player.direction = "bottom";
		}
		if (81 in this.keysDown) { // Player holding left
			Player.x -= Player.speed * modifier;
			Player.direction = "left";
		}
		if (68 in this.keysDown) { // Player holding right
			Player.x += Player.speed * modifier;
			Player.direction = "right";
		}

		//restrictions : empeche le player de sortir du cadre
		if (Player.y < 0) {
			Player.y = 0;
		}	
		if (Player.y > this.canvasHeight - Constants.tileSize) { // 32px: taille personnage
			Player.y = this.canvasHeight - Constants.tileSize;
		}
		if (Player.x < 0) { // 32px: taille personnage
			Player.x = 0;
		}
		if (Player.x > this.canvasWidth - Constants.tileSize) { // 32px: taille personnage
			Player.x = this.canvasWidth - Constants.tileSize;
		}

		//Tir
		// @parameter boolean bulletGeneration : evite l'ecrasement des balles
		if(this.bulletGeneration == true && this.fireRecoverTime == 0)
		{
			var hasFired = false;
			this.bulletGeneration = false;
			if (38 in this.keysDown) { // Player holding up
				this.fireBullet("top");
				hasFired = true;
			} else if (40 in this.keysDown) { // Player holding down
				this.fireBullet("bottom");
				hasFired = true;
			} else if (37 in this.keysDown) { // Player holding left
				this.fireBullet("left");
				hasFired = true;
			} else if (39 in this.keysDown) { // Player holding right
				this.fireBullet("right");
				hasFired = true;
			}

			if (hasFired) {
				this.fireRecoverTime = Constants.fireRecoveryTime;
			}
			this.bulletGeneration = true;
		}
		else if(this.fireRecoverTime>0)
		{
			this.fireRecoverTime--;
		}

		var outOfBoundsBullets = [];

		//Deplacement bullet			
		if ( (this.bulletTable.length > 0) && (this.bulletGeneration == true) )
		{
			for (var i = 0; i < this.bulletTable.length; i++)
			{
				if ( this.bulletTable[i].direction == "top") {
					this.bulletTable[i].y -= this.bulletTable[i].speed * modifier;
				}

				if ( this.bulletTable[i].direction == "left") {
					this.bulletTable[i].x -= this.bulletTable[i].speed * modifier;
				}

				if(this.bulletTable[i].direction == "bottom") {
					this.bulletTable[i].y += this.bulletTable[i].speed * modifier;
				}

				if(this.bulletTable[i].direction == "right") {
					this.bulletTable[i].x += this.bulletTable[i].speed * modifier;
				}

				//selectionne les balles sorties de l'ecran
				if ( this.bulletTable[i].x < 0
					|| this.bulletTable[i].x > this.canvasWidth
					|| this.bulletTable[i].y < 0
					|| this.bulletTable[i].y > this.canvasHeight ) {
					outOfBoundsBullets.push(i);
				}
			}	
		}

		//supprime les balles sorties de l'ecran
		for (var i = 0; i < outOfBoundsBullets.length; i++) {
			this.bulletTable.splice(outOfBoundsBullets[i], 1);
		}

		var killedMonsters = [];

		//collision bullets et monstres
		for (var i = 0; i < this.monsterTable.length; i++)
		{
			for (var j = 0; j < this.bulletTable.length; j++)
			{
				if (
					this.bulletTable[j].x <= (this.monsterTable[i].x + Constants.hitBoxSize)
					&& this.monsterTable[i].x <= (this.bulletTable[j].x + Constants.hitBoxSize)
					&& this.bulletTable[j].y <= (this.monsterTable[i].y + Constants.hitBoxSize)
					&& this.monsterTable[i].y <= (this.bulletTable[j].y + Constants.hitBoxSize)
				) {
					killedMonsters.push(i);
					this.bulletTable.pop(j);
				}
			}
		}

		//removes killed monsters and adds new monsters
		for (var i = 0; i < killedMonsters.length ; i++) {
			Player.monstersKilled++;
			Player.score += killedMonsters[i].score;
			Player.addXp(this.monsterTable[i].xp);
			this.monsterTable.splice(killedMonsters[i], 1);
			this.addMonster();
		};

		//decrementation du nombre de frames d'invincibilité
		if (this.hitRecoverTime > 0) {
			this.hitRecoverTime--;
		}

		//collision hero et monstres
		for (var i = 0; i < this.monsterTable.length; i++)
		{
			if (
				Player.x <= this.monsterTable[i].x + Constants.hitBoxSize
				&& Player.x + Constants.hitBoxSize >= this.monsterTable[i].x
				&& Player.y <= this.monsterTable[i].y + Constants.hitBoxSize
				&& Player.y + Constants.hitBoxSize >= this.monsterTable[i].y
				&& this.hitRecoverTime == 0
			) {
				Player.hp -= this.monsterTable[i].strength;
				this.hitRecoverTime = Constants.hitRecoveryTime;
			}
		}

		//deplacement monstres
		for (var i = 0; i < this.monsterTable.length; i++)
		{
			if (this.monsterTable[i].x > Player.x) {
				this.monsterTable[i].x --;
			} else if (this.monsterTable[i].x < Player.x) {
				this.monsterTable[i].x ++;
			}
			if (this.monsterTable[i].y > Player.y) {
				this.monsterTable[i].y --;
			} else if (this.monsterTable[i].y < Player.y) {
				this.monsterTable[i].y ++;
			}
		}
	},

	fireBullet : function(direction) {
		if (GameInterface.bulletReady) {
			var gunshot_song = new Audio();
			gunshot_song.src = Constants.gunshot;
			gunshot_song.play(); 
			this.bulletTable.push(new Bullet(500, direction));
		}
	},

	addMonster : function() {
		var name = "Zombie";
		var health = 100;
		var speed = 100;
		var xp = 25;
		var strength = 10;
		var score = 5;
		var randX = this.generateNumberByMinMax(Constants.tileSize, (this.canvasWidth - Constants.tileSize));
		var randY = this.generateNumberByMinMax(Constants.tileSize, (this.canvasHeight - Constants.tileSize));

		this.monsterTable.push(new Monster(name, health, speed, xp, strength, randX, randY, score));
	},

	//genere un nombre aleatoire entre le min et le min+offset
	generateNumberByMinMax : function(min, max) {
		return Math.floor((Math.random() * (max - min)) + min);
	}
}