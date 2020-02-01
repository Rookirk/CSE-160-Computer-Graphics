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

var Armature = function() {
    this.vertexArr = [];
    this.partData = [];
    this.partName = [];
}

Armature.prototype.addBodyPart = function(part, shapeFunc, initMatrixFunc) {
    this.partData.push(part);
    this.partName.push(part.name);

    part.vertsPerShape = [];
    part.initMatrix = new Matrix4();
    part.animMatrix = new Matrix4();

    if(part.parent !== -1)
        part.parentIndex = this.partName.indexOf(part.parent);
    else{
        part.parentIndex = -1;
    }

    shapeFunc();

    if(initMatrixFunc && enableInit){
        part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
        initMatrixFunc(part);
        part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

        part.animMatrix.set(part.initMatrix);
    }
}

Armature.prototype.createCube = function(x, y, z, l, w, h, r, g, b){
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
        this.vertexArr.push( x + cubeVertices[indexVal][0] * l );
        this.vertexArr.push( y + cubeVertices[indexVal][1] * w );
        this.vertexArr.push( z + cubeVertices[indexVal][2] * h );
        this.vertexArr.push( r );
        this.vertexArr.push( g );
        this.vertexArr.push( b );
    }

    // cubes have 36 verts
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(36);
}

Armature.prototype.createCylinder = function(x, y, z, l, w, h, r, g, b, segments){
    var circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments*3; i+=3){
        let j = i/3;
        coords.x[i] = centerX + size*Math.cos((j+1)*circleRotationTheta);
        coords.y[i] = centerY + size*Math.sin((j+1)*circleRotationTheta);

        coords.x[i+1] = centerX + size*Math.cos(j*circleRotationTheta);
        coords.y[i+1] = centerY + size*Math.sin(j*circleRotationTheta);

        coords.x[i+2] = centerX;
        coords.y[i+2] = centerY;

        for(let j = i; j < i+3; j++){
            coords.r[j] = colors.r;
            coords.g[j] = colors.g;
            coords.b[j] = colors.b;
        }
    }
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, r, g, b with appropriate transforms
        this.vertexArr.push( x + cubeVertices[indexVal][0] * l );
        this.vertexArr.push( y + cubeVertices[indexVal][1] * w );
        this.vertexArr.push( z + cubeVertices[indexVal][2] * h );
        this.vertexArr.push( r );
        this.vertexArr.push( g );
        this.vertexArr.push( b );
    }

    // cubes have 36 verts
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(36);
}