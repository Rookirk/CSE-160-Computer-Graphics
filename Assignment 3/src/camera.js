class Camera {
    constructor( eye = [0,0,-1], at = [0,0,0], up = [0,1,0] ) {
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

        this.at[0] += x;
        this.at[1] += y;
        this.at[2] += z;

        this.setNewCameraPosition();
    }

    moveInDirection(angle, magnitude){
        const x = angle[0],
              z = angle[2];

        const angleMag = Math.sqrt( Math.pow(x,2) + Math.pow(z,2));
        const xDist = x / angleMag * magnitude,
              zDist = z / angleMag * magnitude;

        this.moveCamera(xDist, 0, zDist);
    }

    rotateYaw(angle){
        const yaw = this.getYaw();
        const newAngle = rotateAngle(yaw, angle);

        this.at[0] = this.eye[0] + newAngle[0];
        this.at[2] = this.eye[2] + newAngle[2];

        this.setNewCameraPosition();
    }

    setNewCameraPosition(){
        viewMatrix.setLookAt(this.eye[0], this.eye[1], this.eye[2],
                          this.at[0], this.at[1], this.at[2],
                          this.up[0], this.up[1], this.up[2]);
    }
}

function getAngle(x,y){
    if(x === 0){
        return (y > 0 ? 90 : 270);
    }
    else if(x > 0 && y > 0){
        return (180/Math.PI) * Math.atan(y/x);
    }
    else if(x < 0 && y > 0){
        return 180 + ((180/Math.PI) * Math.atan(y/x));
    }
    else if(x < 0 && y < 0){
        return 180 + ((180/Math.PI) * Math.atan(y/x));
    }
    else{
        return 360 + ((180/Math.PI) * Math.atan(y/x));
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
        case 'Q':
        case 'q':
            return 81;
        case 'E':
        case 'e':
            return 69;
    }
}

function rotateAngle(angle, howMuchToRotate){
    const x = angle[0];
    const y = angle[1];
    const z = angle[2];
    const dist = Math.sqrt(Math.pow(x,2) + Math.pow(z,2));

    const degAngle = getAngle(x,z);

    const newDegAngle = degAngle + howMuchToRotate;

    const newAngle = [Math.cos((Math.PI/180)*newDegAngle) * dist,
                      0,
                      Math.sin((Math.PI/180)*newDegAngle) * dist];
    return newAngle;
    /*console.log(angle);
    let oldAngle = new Vector3([angle[0], angle[1], angle[2]]);
    let rotateMatrix = new Matrix4();
    rotateMatrix.setIdentity();
    rotateMatrix.rotate(rotateParams[0],rotateParams[1],rotateParams[2],rotateParams[3]);
    console.log(rotateMatrix);
    rotateMatrix.multiplyVector3(oldAngle);
    console.log(rotateMatrix);
    let elem = rotateMatrix.elements;
    console.log([elem[0], elem[1], elem[2]]);
    return [elem[0], elem[1], elem[2]];*/

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
    else if(event.keyCode === getEventKey('S')) {
        const angle = camera.getYaw();
        const newAngle = scaleAngle(angle, [-1,1,-1]);
        camera.moveInDirection(newAngle, .1);
    }
    else if(event.keyCode === getEventKey('A')) {
        const angle = camera.getYaw();
        const newAngle = rotateAngle(angle,-90);
        camera.moveInDirection(newAngle, .1);
    }
    else if(event.keyCode === getEventKey('D')) {
        const angle = camera.getYaw();
        const newAngle = rotateAngle(angle,90);
        camera.moveInDirection(newAngle, .1);
    }
    else if(event.keyCode === getEventKey('Q')) {
        camera.rotateYaw(-1);
    }
    else if(event.keyCode === getEventKey('E')) {
        camera.rotateYaw(1);
    }
});