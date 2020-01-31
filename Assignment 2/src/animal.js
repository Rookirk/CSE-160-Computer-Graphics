var vertexArr;
var partDataArr;
/*
    every member of partDataArr contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        originX // unmodified origin points
        originY
        originZ

        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

var currPartIndex;

function createAnimal(){
    partDataArr = [];
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
        animMatrix: new Matrix4()
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
        animMatrix: new Matrix4()
    }
    createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
    createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(45,1,0,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);
    part.animMatrix.set(part.initMatrix);
    currPartIndex++;

    // 2
    partDataArr[currPartIndex] = {
        vertsPerShape: [],
        parent: 0,
        originX: -.2,
        originY: -.2,
        originZ: .2,

        initMatrix: new Matrix4(),
        animMatrix: new Matrix4()
    }
    createCube(  .2, -.2, -.2,   .1,   .1,   .1,255,  0,255); // magenta
    createCube( -.2, -.2,  .2,   .1,   .1,   .1,  0,255,  0); // green

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(0,0,1,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);
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
        animMatrix: new Matrix4()
    }
    createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red

    part = partDataArr[currPartIndex];
    //mat = part.initMatrix;
    part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
    part.initMatrix.rotate(0,0,1,0);
    part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);
    part.animMatrix.set(part.initMatrix);
    currPartIndex++;
}

function createCube(x, y, z, l, w, h, r, g, b){
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var cubeVertices = [
        // Vertex coordinates and color
        [ 1.0,  1.0,  1.0 ],  // v0
        [-1.0,  1.0,  1.0 ],  // v1
        [-1.0, -1.0,  1.0 ],  // v2
        [ 1.0, -1.0,  1.0 ],  // v3
        [ 1.0, -1.0, -1.0 ],  // v4
        [ 1.0,  1.0, -1.0 ],  // v5
        [-1.0,  1.0, -1.0 ],  // v6
        [-1.0, -1.0, -1.0 ],  // v7
    ];

    // Indices of the vertices
    var cubeIndices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, r, g, b with appropriate transforms
        vertexArr.push( x + cubeVertices[indexVal][0] * l );
        vertexArr.push( y + cubeVertices[indexVal][1] * w );
        vertexArr.push( z + cubeVertices[indexVal][2] * h );
        vertexArr.push( r );
        vertexArr.push( g );
        vertexArr.push( b );
    }

    // cubes have 36 verts
    partDataArr[currPartIndex].vertsPerShape.push(36);
}

function testMatrices(value, value2){
    /*let part = partDataArr[1];
    let mat = partDataArr[1].initMatrix;
    mat.setTranslate(part.originX,part.originY,part.originZ);
    mat.rotate(value*360,1,0,0);
    mat.translate(-part.originX,-part.originY,-part.originZ);*/

    let part2 = partDataArr[2];
    let mat2 = partDataArr[2].animMatrix;
    mat2.set(part2.initMatrix);
    mat2.translate(part2.originX,part2.originY,part2.originZ);
    mat2.rotate(value*360,1,0,0);
    mat2.translate(-part2.originX,-part2.originY,-part2.originZ);

    let part3 = partDataArr[3];
    let mat3 = partDataArr[3].animMatrix;
    mat3.set(partDataArr[part3.parent].initMatrix);
    mat3.multiply(part2.animMatrix);
    mat3.translate(part3.originX,part3.originY,part3.originZ);
    mat3.rotate(value2*360,0,1,0);
    mat3.translate(-part3.originX,-part3.originY,-part3.originZ);
}