class Camera {
	constructor( eye = [0,0,0], at = [0,0,-1], up = [0,1,0] ) {
		this.eye = eye;
		this.at = at;
		this.up = up;
	}

	getYaw() {
		const xDist = this.at[0] - this.eye[0];
		const zDist = this.at[2] - this.at[2];

		return (180/Math.PI) * Math.atan(zDist / xDist);
	}

	moveCamera(x,y,z) {
		this.eye[0] += x;
		this.at[0] + x;

		this.eye[1] += y;
		this.at[1] += y;

		this.eye[2] += z;
		this.at[2] += z;
	}

	moveCameraInDirection(angle){

	}
}

function getEventKey(key) {
	switch(key) {
		case 'W':
		case 'w':
			return 87;
		case 'A':
		case 'a':
			return 65;
		case 'S':
		case 's':
			return 83;
		case 'D':
		case 'd':
			return 68;
	}
}

document.addEventListener( 'keydown', function(event) ) {
	if(event.keyCode === getEventKey('W')) {
		const angle = camera.getYaw();
	}
}