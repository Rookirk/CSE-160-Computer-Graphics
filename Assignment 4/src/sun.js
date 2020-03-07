class Sun {
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	rotate(){
		updateShader();
	}

	updateShader(){
		gl.uniform3fv(shaderVars.u_SunPosition, this.x, this.y, this.z);
	}
}