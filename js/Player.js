var Player = {
	name : "xXx_Dark_SlayerxXxDu13",

	//vitesse pixel par seconde
	speed : 100,
	direction : "right", //direction par défaut du personnage

	//position du personnage
	//initialisé dès le debut du programme
	x : false,
	y : false,

	//statistiques personnage
	hp : 100,
	maxHp : 100,
	xp : 0,
	gold : 0,
	lvl : 1,
	score: 0,

	statPointsEarn : 10,
	//statistiques arme
	equippedWeapon : false,

	monstersKilled : 0,

	init : function(x , y) {
		this.x = x;
		this.y = y;
	},

	xpRequiered : function() {
		return 5*(Math.pow(this.lvl, 2)) + (20*this.lvl);
	},

	addXp : function (amountOfXp) { 
		GameInterface.gameConsoleLog("You earn "+amountOfXp+"xp");
		var xpNeeded = this.xpRequiered();
		if (this.xp + amountOfXp >= xpNeeded){
			this.levelUp();
			this.xp = (this.xp + amountOfXp) - xpNeeded;
		}
		else{
			this.xp = (this.xp + amountOfXp);
		}
	},

	xpInPercent : function () {
		return Math.floor((this.xp * 100) / this.xpRequiered());
	},

	hpInPercent: function(){
		var healthPercent = parseInt((this.hp / this.maxHp) * 100)
		return healthPercent > 0 ? healthPercent : 0;
	},

	levelUp : function () {
		this.lvl++;
		var sSpeed = 0;
		var sMaxHp = 0;
		for(var i = 0; i < this.statPointsEarn; i++)
		{
			var statNumber = Game.generateNumberByMinMax(1,3);
			if (statNumber == 1) { this.speed ++; sSpeed++;}
			else if (statNumber == 2) {
				var previousHealth = this.maxHp;
				this.maxHp++; 
				sMaxHp++;
				var healthDifference = this.maxHp - previousHealth;
				this.hp += healthDifference;
			}
		}
		GameInterface.gameConsoleLog("Gratz ! You level up "+this.lvl+" ! You earn +"+sSpeed+" speed, +"+sMaxHp+" maxHp");
	},
}