var vertexArr;
var partData = [];
var partName = [];
/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        originX // unmodified origin points
        originY
        originZ

        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

function addBodyPart(part, shapeFunc, initMatrixFunc) {
    part.vertsPerShape = [];

    part.initMatrix = new Matrix4();
    part.animMatrix = new Matrix4();

    partData.push(part);
    partName.push(part.name);

    shapeFunc();

    if(initMatrixFunc && enableInit){
        part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
        initMatrixFunc(part);
        part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

        part.animMatrix.set(part.initMatrix);
    }
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
    partData[partData.length - 1].vertsPerShape.push(36);
}