class Sun {
	constructor(centerCoords, radius, rate, color){
		this.centerX = centerCoords[0];
		this.centerY = centerCoords[1];
		this.centerZ = centerCoords[2];

		this.color = color;

		this.radius = radius;
		this.setRate(rate);

		this.angle = 0;

		this.calcPosition();
		this.updateColor();
		this.updatePosition();
	}

	update(){
		this.rotate();
		this.calcPosition();
		this.updatePosition();
	}

	setRate(rate){
		this.rate = rate * (Math.PI/180);
	}

	rotate(){
		this.angle = (this.angle + this.rate) % (2*Math.PI);
	}

	calcPosition(){
		this.x = Math.sin(this.angle) * this.radius;
		this.y = Math.cos(this.angle) * this.radius;
		this.z = 0;
	}

	updateColor(){
		gl.uniform3f(shaderVars.u_SunColor, this.color[0]/255, this.color[1]/255, this.color[2]/255);
	}

	updatePosition(){
		gl.uniform3f(shaderVars.u_SunPosition, this.x, this.y, this.z);
	}
}