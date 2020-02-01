function createAnimal(){
    // 0
    addBodyPart(
        {
            name: "core",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0,

            transformFunc: -1
        },
        function() {
            createCube(   0,   0,   0,   .1,   .1,   .1,255,255,255); // white
        }
    );

    // 1
    addBodyPart(
        {
            name: "ring1",
            parent: 0,
            originX: 0,
            originY: 0,
            originZ: 0,

            transformFunc: -1
        },
        function() {
            createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
            createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan
        },
        function(part) {
            part.initMatrix.rotate(45,1,0,0);
        }
    );

    // 2
    addBodyPart(
        {
            name: "ring2",
            parent: 0,
            originX: -.2,
            originY: -.2,
            originZ: .2,

            transformFunc: "transformRing1"
        },
        function() {
            createCube(  .2, -.2, -.2,   .1,   .1,   .1,255,  0,255); // magenta
            createCube( -.2, -.2,  .2,   .1,   .1,   .1,  0,255,  0); // green
        },
        function(part) {
            part.initMatrix.rotate(0,0,1,0);
        }
    );

    // 3
    addBodyPart(
        {
            name: "ring3",
            parent: 2,
            originX: .3,
            originY: -.2,
            originZ: -.3,

            transformFunc: "transformRing2"
        },
        function() {
            createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red
        },
        function(part) {
            part.initMatrix.rotate(0,0,1,0);
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
    mat3.set(partData[part3.parent].initMatrix);
    mat3.multiply(part2.animMatrix);
    mat3.translate(part3.originX,part3.originY,part3.originZ);
    mat3.rotate(value2*360,0,1,0);
    mat3.translate(-part3.originX,-part3.originY,-part3.originZ);
}

function transformRing1(part) {
    let angle = (globalTime/10) % 360;
    part.animMatrix.rotate(angle,1,0,0);
}

function transformRing2(part) {
    let angle = (globalTime/5) % 360;
    part.animMatrix.rotate(angle,0,1,0);
}

function updateTime() {
    let now = Date.now();
    deltaTime = now - globalTime;
    globalTime = now;
}