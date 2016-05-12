(function(){
	'use strict';

	function Monster(name, health, speed, xp, strength, x, y, score)
	{
		this.name = name;
		this.health = health;
		this.speed = speed;
		this.xp = xp;
		this.strength = strength;
		this.x = x;
		this.y = y;
		this.score = score;
	}

	Monster.prototype =
	{
			
	}

	window.Monster = Monster;
}()) ;