class Camera {
    constructor( eye = [0,0,0], at = [0,0,-1], up = [0,1,0] ) {
        this.eye = eye;
        this.at = at;
        this.up = up;
    }

    getYaw() {
        const xDist = this.at[0] - this.eye[0];
        const zDist = this.at[2] - this.eye[2];

        return [xDist, 0, zDist];
    }

    moveCamera(x,y,z) {
        this.eye[0] += x;
        this.eye[1] += y;
        this.eye[2] += z;

        this.at[0] + x;
        this.at[1] += y;
        this.at[2] += z;

        console.log("eye " + this.eye);
        console.log("at " + this.at);

        viewMatrix.lookAt(this.eye[0], this.eye[1], this.eye[2],
                          this.at[0], this.at[1], this.at[2],
                          this.up[0], this.up[1], this.up[2]);
    }

    moveInDirection(angle, magnitude){
        const x = angle[0],
              z = angle[2];

        const angleMag = Math.sqrt( Math.pow(x,2) + Math.pow(z,2));
        const xDist = x / angleMag * magnitude,
              zDist = z / angleMag * magnitude;

        this.moveCamera(xDist, 0, zDist);
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

function rotateAngle(angle, rotateParams){
    let oldAngle = new Vector3([angle[0], angle[1], angle[2]]);
    console.log("oldAngle " + [angle[0], angle[1], angle[2]]);
    let rotateMat = new Matrix4();
    rotateMat.setRotate(rotateParams[0], rotateParams[1], rotateParams[2], rotateParams[3]);
    rotateMat.multiplyVector3(oldAngle);

    const elem = rotateMat.elements;
    console.log("newAngle " + [elem[0], elem[1], elem[2]]);
    return [elem[0], elem[1], elem[2]];
}

function scaleAngle(angle, scaleParams){
    const newAngle = [angle[0] * scaleParams[0],
                      angle[1] * scaleParams[1],
                      angle[2] * scaleParams[2]];
    return newAngle;
}

document.addEventListener( 'keydown', function(event) {
    if(event.keyCode === getEventKey('W')) {
        const angle = camera.getYaw();
        camera.moveInDirection(angle, .1);
    }
    else if(event.keyCode === getEventKey('A')) {
        const angle = camera.getYaw();
        const newAngle = rotateAngle(angle, [0,0,1,0])
        camera.moveInDirection(newAngle, .1);
    }
    else if(event.keyCode === getEventKey('S')) {
        const angle = camera.getYaw();
        const newAngle = scaleAngle(angle, [-1,1,-1])
        camera.moveInDirection(newAngle, .1);
    }
    else if(event.keyCode === getEventKey('D')) {
        const angle = camera.getYaw();
        const newAngle = rotateAngle(angle, [0,0,1,0])
        camera.moveInDirection(newAngle, .1);
    }
});