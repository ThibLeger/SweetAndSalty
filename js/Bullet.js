(function(){
	'use strict';

	function Bullet(speed, direction)
	{
		this.speed = speed;
		this.direction = direction;
		this.x = Player.x + Constants.tileSize/2;
		this.y = Player.y + Constants.tileSize/2;
	}

	Bullet.prototype =
	{
			
	}

	window.Bullet = Bullet;
}()) ;