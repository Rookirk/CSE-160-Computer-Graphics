class Sun {
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	rotate(){
		this.updateShader();
	}

	updateShader(){
		gl.uniform3f(shaderVars.u_SunPosition, this.x, this.y, this.z);
	}
}