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

            transformFunc: -1
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

            transformFunc: -1
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

            transformFunc: "transformRing1"
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

            transformFunc: "transformRing2"
        },
        function(armature) {
            armature.createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );
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
    let angle = (globalTime/10) % 360;
    animMatrix.rotate(angle,1,0,0);
}

function transformRing2(animMatrix) {
    let angle = (globalTime/5) % 360;
    animMatrix.rotate(angle,0,1,0);
}

function updateTime() {
    let now = Date.now();
    deltaTime = now - globalTime;
    globalTime = now;
}