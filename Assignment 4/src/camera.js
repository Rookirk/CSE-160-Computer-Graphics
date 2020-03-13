// requires MVP matrices to be set up beforehand
class Camera {
    constructor( canvas, eye = [0,0,-1], at = [0,0,0], up = [0,1,0] ) {
        this.canvas = canvas;
        this.eye = eye;
        this.at = at;
        this.up = up;

        this.pitch = 0;

        this.rotateVel = 2;
        this.walkVel = .02;
        this.mouseSensitivity = .03;

        this.setNewLookAt();

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.onclick = () => {
            canvas.requestPointerLock();
        };

        // https://stackoverflow.com/questions/9047600/how-to-determine-the-direction-on-onmousemove-event
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
        canvas.onmousemove = (ev) => {
            if (!(document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas)) {
                return;
            }

            const mouseX = -ev.movementX;
            const mouseY = ev.movementY;

            this.rotateYaw(mouseX * this.mouseSensitivity);
            this.rotatePitch(mouseY * this.mouseSensitivity);
        }
    }

    getForwardVector(){
        const xDist = this.at[0] - this.eye[0],
              zDist = this.at[2] - this.eye[2];

        const forward = new Vector3( [ xDist, 0, zDist ] );
        forward.normalize();

        return forward;
    }

    getLookAtVector(){
        const xDist = this.at[0] - this.eye[0],
              yDist = this.at[1] - this.eye[1],
              zDist = this.at[2] - this.eye[2];

        const lookAt = new Vector3( [ xDist, yDist, zDist ] );
        lookAt.normalize();

        return lookAt;
    }

    rotatePitch(inputAngle){
        let angle = inputAngle;
        if(this.pitch + inputAngle >= 89.99) angle = 89.99 - this.pitch;
        else if(this.pitch + inputAngle <= -89.99) angle = -89.99 - this.pitch;
        this.pitch += angle;

        const eyeVec = this.getLookAtVector();
        const forwardVec = this.getForwardVector();

        const rotateVector = transformVector(forwardVec, (matrix) => {
            matrix.rotate(90,0,1,0);
        });
        const newVector = transformVector(eyeVec, (matrix) => {
            matrix.rotate(angle,rotateVector.elements[0],0,rotateVector.elements[2]);
        });

        this.at[0] = this.eye[0] + newVector.elements[0];
        this.at[1] = this.eye[1] + newVector.elements[1];
        this.at[2] = this.eye[2] + newVector.elements[2];

        this.setNewLookAt();
    }

    rotateYaw(angle){
        const eyeVec = this.getLookAtVector();

        const newVector = transformVector(eyeVec, (matrix) => {
            matrix.rotate(angle,0,1,0);
        });

        this.at[0] = this.eye[0] + newVector.elements[0];
        this.at[1] = this.eye[1] + newVector.elements[1];
        this.at[2] = this.eye[2] + newVector.elements[2];

        this.setNewLookAt();
    }

    moveInDirection(vector, magnitude) {
        const x = vector.elements[0],
              y = vector.elements[1],
              z = vector.elements[2];

        const angleMag = Math.sqrt( Math.pow(x,2) + Math.pow(y,2) +Math.pow(z,2));
        const xDist = x / angleMag * magnitude,
              yDist = y / angleMag * magnitude,
              zDist = z / angleMag * magnitude;

        const movementVector = new Vector3([ xDist, yDist, zDist ]);

        this.moveCamera(movementVector);
    }

    moveCamera(vector) {
        const x = vector.elements[0],
              y = vector.elements[1],
              z = vector.elements[2];

        this.eye[0] += x;
        this.eye[1] += y;
        this.eye[2] += z;

        this.at[0] += x;
        this.at[1] += y;
        this.at[2] += z;

        this.setNewLookAt();
    }

    setNewLookAt() {
        viewMatrix.setLookAt(this.eye[0], this.eye[1], this.eye[2],
                             this.at[0],  this.at[1],  this.at[2],
                             this.up[0],  this.up[1],  this.up[2]);
        gl.uniformMatrix4fv(shaderVars.u_ViewMatrix, false, viewMatrix.elements);
        gl.uniform3fv(shaderVars.u_CameraPosition, this.eye);
    }

    setNewCameraPosition(eye = [0,0,-1], at = [0,0,0], up = [0,1,0]) {
        this.eye = eye;
        this.at = at;
        this.up = up;

        this.setNewLookAt();
    }

    setNewEye(eye = [0,0,-1]) {
        this.eye = eye;

        this.setNewLookAt();
    }

    setNewAt(at = [0,0,0]){
        this.at = at;
        
        this.setNewLookAt();   
    }
}

function transformVector(vector, transformFunc){
    const transformMatrix = new Matrix4();
    transformFunc(transformMatrix);

    const result = transformMatrix.multiplyVector3(vector);
    const transformVec = new Vector3([ result.elements[0],
                                       result.elements[1],
                                       result.elements[2] ]);

    return transformVec;
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
        case 'Z':
        case 'z':
            return 90;
        case 'C':
        case 'c':
            return 67;
    }
}

document.addEventListener( 'keydown', function(event) {
    if(event.keyCode === getEventKey('W')) {
        const vector = camera.getForwardVector();
        camera.moveInDirection(vector, camera.walkVel);
    }
    else if(event.keyCode === getEventKey('S')) {
        const vector = camera.getForwardVector();
        const newVector = transformVector(vector, (matrix) => {
            matrix.rotate(180,0,1,0);
        });
        camera.moveInDirection(newVector, camera.walkVel);
    }
    else if(event.keyCode === getEventKey('A')) {
        const vector = camera.getForwardVector();
        const newVector = transformVector(vector, (matrix) => {
            matrix.rotate(90,0,1,0);
        });
        camera.moveInDirection(newVector, camera.walkVel);
    }
    else if(event.keyCode === getEventKey('D')) {
        const vector = camera.getForwardVector();
        const newVector = transformVector(vector, (matrix) => {
            matrix.rotate(-90,0,1,0);
        });
        camera.moveInDirection(newVector, camera.walkVel);
    }
    else if(event.keyCode === getEventKey('Q')) {
        camera.rotateYaw(camera.rotateVel);
    }
    else if(event.keyCode === getEventKey('E')) {
        camera.rotateYaw(-camera.rotateVel);
    }
    else if(event.keyCode === getEventKey('Z')) {
        camera.rotatePitch(camera.rotateVel);
    }
    else if(event.keyCode === getEventKey('C')) {
        camera.rotatePitch(-camera.rotateVel);
    }
});