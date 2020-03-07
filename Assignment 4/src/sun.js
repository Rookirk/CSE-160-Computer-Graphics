class Sun {
	constructor(centerCoords, radius, rate){
		this.centerX = centerCoords[0];
		this.centerY = centerCoords[1];
		this.centerZ = centerCoords[2];

		this.radius = radius;
		this.rate = rate * (Math.PI/180);

		this.angle = 0;

		this.reposition();
		this.updateShader();
	}

	update(){
		this.rotate();
		this.reposition();
		this.updateShader();
	}

	rotate(){
		this.angle = (this.angle + this.rate) % (2*Math.PI);
	}

	reposition(){
		this.x = Math.sin(this.angle) * this.radius;
		this.y = Math.cos(this.angle) * this.radius;
		this.z = 0;
	}

	updateShader(){
		gl.uniform3f(shaderVars.u_SunPosition, this.x, this.y, this.z);
	}
}