var animal;

function createAnimal(){
    animal = new Armature();

    animal.addBodyPart(
        {
            name: "core",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0,

            animFunc: -1
        },
        function(armature) {
            armature.createSphere(   0,   0,   0,   .1,   .1,   .1,255,255,255, 10); // white
        }
    );

    animal.addBodyPart(
        {
            name: "ring1",
            parent: "core",
            originX: 0,
            originY: 0,
            originZ: 0,

            animFunc: -1
        },
        function(armature) {
            armature.createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
            armature.createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan
        },
        function(initMatrix) {
            initMatrix.rotate(45,1,0,0);
        }
    );

    animal.addBodyPart(
        {
            name: "ring2",
            parent: "core",
            originX: -.2,
            originY: -.2,
            originZ: .2,

            animFunc: -1
        },
        function(armature) {
            armature.createSphere(  .2, -.2, -.2,   .1,   .1,   .1,255,  0,255, 10); // magenta
            armature.createXCylinder( -.2, -.2,  .2,   .1,   .1,   .1,  0,255,  0, 10); // green
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    animal.addBodyPart(
        {
            name: "ring3",
            parent: "ring2",
            originX: .3,
            originY: -.2,
            originZ: -.3,

            animFunc: "transformSpine",
            animArgs: [15, 270]
        },
        function(armature) {
            armature.createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    animal.addBodyPart(
        {
            name: "ring4",
            parent: "ring3",
            originX: .5,
            originY: -.2,
            originZ: -.5,

            animFunc: "transformSpine",
            animArgs: [35, 180]
        },
        function(armature) {
            armature.createCube(  .6, -.2, -.6,   .1,   .1,   .1,210,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    animal.addBodyPart(
        {
            name: "ring5",
            parent: "ring4",
            originX: .7,
            originY: -.2,
            originZ: -.7,

            animFunc: "transformSpine",
            animArgs: [50, 90]
        },
        function(armature) {
            armature.createCube(  .8, -.2, -.8,   .1,   .1,   .1,170,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    animal.addBodyPart(
        {
            name: "ring6",
            parent: "ring5",
            originX: .9,
            originY: -.2,
            originZ: -.9,

            animFunc: "transformSpine",
            animArgs: [60, 0]
        },
        function(armature) {
            armature.createCube(  1, -.2, -1,   .1,   .1,   .1,130,0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );
}

// Taken from: https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function linearMap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function testMatrices(value, value2){
    /*let part = partData[1];
    let mat = partData[1].initMatrix;
    mat.setTranslate(part.originX,part.originY,part.originZ);
    mat.rotate(value*360,1,0,0);
    mat.translate(-part.originX,-part.originY,-part.originZ);*/

    let part2 = partData[2];
    let mat2 = partData[2].animMatrix;
    /*mat2.set(part2.initMatrix);
    mat2.translate(part2.originX,part2.originY,part2.originZ);
    mat2.rotate(value*360,1,0,0);
    mat2.translate(-part2.originX,-part2.originY,-part2.originZ);*/

    let part3 = partData[3];
    let mat3 = partData[3].animMatrix;
    mat3.set(partData[part3.parentIndex].initMatrix);
    mat3.multiply(part2.animMatrix);
    mat3.translate(part3.originX,part3.originY,part3.originZ);
    mat3.rotate(value2*360,0,1,0);
    mat3.translate(-part3.originX,-part3.originY,-part3.originZ);
}

function transformRing1(animMatrix) {
    templateSpin(animMatrix, .1, 1, 0, 0);
}

function transformRing2(animMatrix) {
    templateSpin(animMatrix, .2, 0, 1, 0);
}

function transformSpine(animMatrix, angle, offset) {
    templateOscillate(animMatrix, .004, offset, 0, 1, 0, -angle, angle);
}

function templateOscillate(animMatrix, rate, offset, x, y, z, angle1, angle2) {
    let influence = Math.cos((rate*globalTime + offset) % 360);
    let angle = linearMap(influence, -1, 1, angle2, angle1);
    animMatrix.rotate(angle,x,y,z);
    console.log(angle);
}

function templateSpin(animMatrix, rate, x, y, z){
    let angle = (rate*globalTime) % 360;
    animMatrix.rotate(angle,x,y,z);
}