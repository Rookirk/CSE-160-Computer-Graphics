var armature;

function createAnimal(){
    armature = new Armature();
    let part, mat;

    currPartIndex = 0;
    // 0
    partDataArr[currPartIndex] = {
        vertsPerShape: [],
        parent: -1,
        originX: 0,
        originY: 0,
        originZ: 0,

        initMatrix: new Matrix4(),
        animMatrix: new Matrix4(),

        transformFunc: 0
    }
    createCube(   0,   0,   0,   .1,   .1,   .1,255,255,255); // white
    currPartIndex++;

    // 1
    partDataArr[currPartIndex] = {
        vertsPerShape: [],
        parent: 0,
        originX: 0,
        originY: 0,
        originZ: 0,

        initMatrix: new Matrix4(),
        animMatrix: new Matrix4(),

        transformFunc: 0
    }
    createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
    createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(45,1,0,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

    if(!enableInit) part.initMatrix.setIdentity();
    part.animMatrix.set(part.initMatrix);
    currPartIndex++;

    // 2
    partDataArr[currPartIndex] = {
        vertsPerShape: [],
        parent: 0,
        originX: -.2, //-.2
        originY: -.2, //-.2
        originZ: .2, //.2

        initMatrix: new Matrix4(),
        animMatrix: new Matrix4(),

        transformFunc: "transformRing1"
    }
    createCube(  .2, -.2, -.2,   .1,   .1,   .1,255,  0,255); // magenta
    createCube( -.2, -.2,  .2,   .1,   .1,   .1,  0,255,  0); // green

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(0,0,1,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

    if(!enableInit) part.initMatrix.setIdentity();
    part.animMatrix.set(part.initMatrix);
    currPartIndex++;

    // 3
    partDataArr[currPartIndex] = {
        vertsPerShape: [],
        parent: 2,
        originX: .3,
        originY: -.2,
        originZ: -.3,

        initMatrix: new Matrix4(),
        animMatrix: new Matrix4(),

        transformFunc: "transformRing2"
    }
    createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(0,0,1,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

    if(!enableInit) part.initMatrix.setIdentity();
    part.animMatrix.set(part.initMatrix);
    currPartIndex++;
}

function testMatrices(value, value2){
    /*let part = partDataArr[1];
    let mat = partDataArr[1].initMatrix;
    mat.setTranslate(part.originX,part.originY,part.originZ);
    mat.rotate(value*360,1,0,0);
    mat.translate(-part.originX,-part.originY,-part.originZ);*/

    let part2 = partDataArr[2];
    let mat2 = partDataArr[2].animMatrix;
    /*mat2.set(part2.initMatrix);
    mat2.translate(part2.originX,part2.originY,part2.originZ);
    mat2.rotate(value*360,1,0,0);
    mat2.translate(-part2.originX,-part2.originY,-part2.originZ);*/

    let part3 = partDataArr[3];
    let mat3 = partDataArr[3].animMatrix;
    mat3.set(partDataArr[part3.parent].initMatrix);
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