class Vertex {
    constructor(coords, texCoords, normCoords) {
        this.coords = coords;
        this.texCoords = texCoords;
        this.normCoords = normCoords;
    }
}

World.prototype.createCube = function(coords, size, texName, uvSize, color, transformFunc){
    const vertices = this.getCubeVertices(coords, size, uvSize);

    this.createShape(vertices, texName, color, transformFunc);
}

World.prototype.createInvertedCube = function(coords, size, texName, uvSize, color, transformFunc){
    const vertices = this.getInvertedCubeVertices(coords, size, uvSize);

    this.createShape(vertices, texName, color, transformFunc);
}

World.prototype.createPlane = function(coords, size, texName, uvSize, color, transformFunc){
    const vertices = this.getPlaneVertices(coords, size, uvSize);

    this.createShape(vertices, texName, color, transformFunc);
}

World.prototype.getCubeVertices = function(coords, size, uvSize) {
    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const tl = uvSize[0], tw = uvSize[1];

    let vertices = [];
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const cubeVertices = [
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

    //  v0------v2
    //  |       |
    //  |       |
    //  |       |
    //  v1------v3
    const texCoords = [
        [0.0, 1.0],  // v0
        [0.0, 0.0],  // v1
        [1.0, 1.0],  // v2
        [1.0, 0.0],  // v3
    ];

    // Indices of the vertices
    const cubeIndices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        //7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);

    const texIndices = new Uint8Array([
        2, 0, 1,   2, 1, 3,
        0, 1, 3,   0, 3, 2,
        3, 2, 0,   3, 0, 1,
        2, 0, 1,   2, 1, 3,
        //2, 0, 1,   2, 1, 3,
        1, 3, 2,   1, 2, 0
    ]);
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, tx, ty with appropriate transforms
        let vertex = new Vertex(
            [x + cubeVertices[indexVal][0] * l,
             y + cubeVertices[indexVal][1] * w,
             z + cubeVertices[indexVal][2] * h],
            [texCoords[texIndices[i]][0] * tl,
             texCoords[texIndices[i]][1] * tw],
            [1,1,0]
        );

        vertices.push(vertex);
    }

    return vertices;
}

World.prototype.getInvertedCubeVertices = function(coords, size, uvSize) {
    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const tl = uvSize[0], tw = uvSize[1];

    let vertices = [];
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const cubeVertices = [
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

    //  v0------v2
    //  |       |
    //  |       |
    //  |       |
    //  v1------v3
    const texCoords = [
        [0.0, 1.0],  // v0
        [0.0, 0.0],  // v1
        [1.0, 1.0],  // v2
        [1.0, 0.0],  // v3
    ];

    // Indices of the vertices
    const cubeIndices = new Uint8Array([
        0, 2, 1,   0, 3, 2,    // front
        0, 4, 3,   0, 5, 4,    // right
        0, 6, 5,   0, 1, 6,    // up
        1, 7, 6,   1, 2, 7,    // left
        7, 3, 4,   7, 2, 3,    // down
        4, 6, 7,   4, 5, 6     // back
    ]);

    const texIndices = new Uint8Array([
        0, 3, 2,   0, 1, 3,
        2, 1, 3,   2, 0, 1,
        2, 1, 3,   2, 0, 1,
        0, 3, 2,   0, 1, 3,
        0, 3, 2,   0, 1, 3,
        3, 0, 1,   3, 2, 0
    ]);
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, tx, ty with appropriate transforms
        let vertex = new Vertex(
            [x + cubeVertices[indexVal][0] * l,
             y + cubeVertices[indexVal][1] * w,
             z + cubeVertices[indexVal][2] * h],
            [texCoords[texIndices[i]][0] * tl,
             texCoords[texIndices[i]][1] * tw],
            [1,1,0]
        );

        vertices.push(vertex);
    }

    return vertices;
}

World.prototype.getPlaneVertices = function(coords, size, uvSize) {
    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const tl = uvSize[0], tw = uvSize[1];

    let vertices = [];
    //  v0------v2
    //  |       |
    //  |       |
    //  |       |
    //  v1------v3
    const squareVertices = [
        // Vertex coordinates and color
        [-1.0,  0, -1.0 ],  // v0
        [-1.0,  0,  1.0 ],  // v1
        [ 1.0,  0,  1.0 ],  // v2
        [ 1.0,  0, -1.0 ],  // v3
    ];

    //  v0------v2
    //  |       |
    //  |       |
    //  |       |
    //  v1------v3
    const texCoords = [
        [0.0, 1.0],  // v0
        [0.0, 0.0],  // v1
        [1.0, 1.0],  // v2
        [1.0, 0.0],  // v3
    ];

    // Indices of the vertices
    const squareIndices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
    ]);

    const texIndices = new Uint8Array([
        2, 0, 1,   2, 1, 3,
    ]);
    // Iterate through all vertices
    for(let i = 0; i < squareIndices.length; i++){
        let indexVal = squareIndices[i];
        // push the x, y, z, tx, ty with appropriate transforms
        let vertex = new Vertex(
            [x + squareVertices[indexVal][0] * l,
             y + squareVertices[indexVal][1] * w,
             z + squareVertices[indexVal][2] * h],
            [texCoords[texIndices[i]][0] * tl,
             texCoords[texIndices[i]][1] * tw],
            [1,1,0]
        );

        vertices.push(vertex);
    }

    return vertices;
}