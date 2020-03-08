class Vertex {
    constructor(coords, texCoords, normCoords) {
        this.coords = coords;
        this.texCoords = texCoords;
        this.normCoords = normCoords;
    }
}

function getCrossProduct(vert0, vert1, vert2) {
    const vec1 = [
        vert1.x - vert0.x,
        vert1.y - vert0.y,
        vert1.z - vert0.z,
    ];
    const vec2 = [
        vert2.x - vert0.x,
        vert2.y - vert0.y,
        vert2.z - vert0.z,
    ];

    let crossVec = new Vector3([
        vec1[1]*vec2[2] - vec1[2]*vec2[1],
        vec1[2]*vec2[0] - vec1[0]*vec2[2],
        vec1[0]*vec2[1] - vec1[1]*vec2[0]
    ]);

    crossVec.normalize();

    return [
        crossVec.elements[0],
        crossVec.elements[1],
        crossVec.elements[2]
    ]
}

function normalizeArray(vert) {
    let vector = new Vector3(vert);
    vector.normalize();
    return [
        vector.elements[0],
        vector.elements[1],
        vector.elements[2]
    ]
}

World.prototype.getCubeVertices = function(coords, size, uvSize) {
    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const tl = uvSize[0], tw = uvSize[1];

    let vertices = [];

    /*    v6----- v5
         /|      /|
        v1------v0|
        | |     | |
        | |v7---|-|v4
        |/      |/
        v2------v3
    */
    const cubeVertices = [
        // Vertex coordinates and color
        { x:  1.0, y:  1.0, z:  1.0 },  // v0
        { x: -1.0, y:  1.0, z:  1.0 },  // v1
        { x: -1.0, y: -1.0, z:  1.0 },  // v2
        { x:  1.0, y: -1.0, z:  1.0 },  // v3
        { x:  1.0, y: -1.0, z: -1.0 },  // v4
        { x:  1.0, y:  1.0, z: -1.0 },  // v5
        { x: -1.0, y:  1.0, z: -1.0 },  // v6
        { x: -1.0, y: -1.0, z: -1.0 }   // v7
    ];

    /*  v0------v2
        |       |
        |       |
        |       |
        v1------v3
    */
    const texCoords = [
        { u: 0.0, v: 1.0 },  // v0
        { u: 0.0, v: 0.0 },  // v1
        { u: 1.0, v: 1.0 },  // v2
        { u: 1.0, v: 0.0 }   // v3
    ];

    // Indices of the triangles, which contain the indices of the vertices
    const trianglesArr = [
        [0, 1, 2],   [0, 2, 3],    // front
        [0, 3, 4],   [0, 4, 5],    // right
        [0, 5, 6],   [0, 6, 1],    // up
        [1, 6, 7],   [1, 7, 2],    // left
        //[7, 4, 3],   [7, 3, 2],    // down
        [4, 7, 6],   [4, 6, 5]     // back
    ];

    const texTriangles = [
        [2, 0, 1],   [2, 1, 3],
        [0, 1, 3],   [0, 3, 2],
        [3, 2, 0],   [3, 0, 1],
        [2, 0, 1],   [2, 1, 3],
        //[2, 0, 1],   [2, 1, 3],
        [1, 3, 2],   [1, 2, 0]
    ];
    // Iterate through all triangles
    for(let i = 0; i < trianglesArr.length; i++){
        const triangle = trianglesArr[i];
        const texTri = texTriangles[i];
        const vert0 = triangle[0];
        const vert1 = triangle[1];
        const vert2 = triangle[2];

        const crossVec = getCrossProduct(
            cubeVertices[ vert0 ],
            cubeVertices[ vert1 ],
            cubeVertices[ vert2 ]
        );

        // Iterate through all vertices in the triangle
        for(let i = 0; i < triangle.length; i++){
            const vertex = triangle[i];
            const texVertex = texTri[i];

            let newVertex = new Vertex(
                [x + cubeVertices[vertex].x * l,
                 y + cubeVertices[vertex].y * w,
                 z + cubeVertices[vertex].z * h],
                [texCoords[texVertex].u * tl,
                 texCoords[texVertex].v * tw],
                crossVec
            );

            vertices.push(newVertex);
        }
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
            [0,1,0]
        );

        vertices.push(vertex);
    }

    return vertices;
}

World.prototype.getSphereVertices = function(coords, size, uvSize, segments) {
    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const tl = uvSize[0], tw = uvSize[1];

    let xcoords = [];
    let zcoords = [];
    let vertices = [];

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        xcoords[i] = l*Math.cos(i*circleRotationTheta);
        zcoords[i] = h*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    xcoords.push(xcoords[0]);
    zcoords.push(zcoords[0]);

    let hemisphereTheta = Math.PI/segments;
    // Iterate through the top
    let yHeight = w*Math.cos(hemisphereTheta);
    let horizRadius = Math.sin(hemisphereTheta);
    for(let i = 0; i < xcoords.length - 1; i++){
        vertices.push(new Vertex(
            [ x + horizRadius*xcoords[i], y + yHeight , z + horizRadius*zcoords[i] ],
            [1.0,0.0],
            normalizeArray( [ horizRadius*xcoords[i], yHeight , horizRadius*zcoords[i] ] )
        ));
        vertices.push(new Vertex(
            [ x + horizRadius*xcoords[i + 1], y + yHeight, z + horizRadius*zcoords[i + 1] ],
            [0.0,0.0],
            normalizeArray( [ horizRadius*xcoords[i + 1], yHeight, horizRadius*zcoords[i + 1] ] )
        ));
        vertices.push(new Vertex(
            [ x, y + w, z ],
            [0.5,1.0],
            normalizeArray( 0, w, 0 )
        ));
    }

    // Iterate through horizontal rings
    for(let i = 1; i < segments - 1; i++){
        yHeight = w*Math.cos(i*hemisphereTheta);
        let yHeight2 = w*Math.cos((i+1)*hemisphereTheta);
        horizRadius = Math.sin(i*hemisphereTheta);
        let horizRadius2 = Math.sin((i+1)*hemisphereTheta);
        for(let j = 0; j < xcoords.length - 1; j++){
            //top right trjangle
            vertices.push(new Vertex(
                [ x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1] ],
                [0.0,1.0],
                normalizeArray( [ horizRadius*xcoords[j + 1], yHeight, horizRadius*zcoords[j + 1] ] )
            ));
            vertices.push(new Vertex(
                [ x + horizRadius*xcoords[j], y + yHeight, z + horizRadius*zcoords[j] ],
                [1.0,1.0],
                normalizeArray( [ horizRadius*xcoords[j], yHeight, horizRadius*zcoords[j] ] )
            ));
            vertices.push(new Vertex(
                [ x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j] ],
                [1.0,0.0],
                normalizeArray( [ horizRadius2*xcoords[j], yHeight2, horizRadius2*zcoords[j] ] )
            ));

            // bottom left trjangle
            vertices.push(new Vertex(
                [ x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1] ],
                [0.0,1.0],
                normalizeArray( [ horizRadius*xcoords[j + 1], yHeight, horizRadius*zcoords[j + 1] ] )
            ));
            vertices.push(new Vertex(
                [ x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j] ],
                [1.0,0.0],
                normalizeArray( [ horizRadius2*xcoords[j], yHeight2, horizRadius2*zcoords[j] ] )
            ));
            vertices.push(new Vertex(
                [ x + horizRadius2*xcoords[j + 1], y + yHeight2, z + horizRadius2*zcoords[j + 1] ],
                [0.0,0.0],
                normalizeArray( [ horizRadius2*xcoords[j + 1], yHeight2, horizRadius2*zcoords[j + 1] ] )
            ));
        }
    }

    // Iterate through the bottom
    yHeight = w*Math.cos(hemisphereTheta);
    horizRadius = Math.sin(hemisphereTheta);
    for(let i = 0; i < xcoords.length - 1; i++){
        vertices.push(new Vertex(
            [ x + horizRadius*xcoords[i + 1], y - yHeight, z + horizRadius*zcoords[i + 1] ],
            [0.0,1.0],
            normalizeArray( [ horizRadius*xcoords[i + 1], -yHeight, horizRadius*zcoords[i + 1] ] )
        ));
        vertices.push(new Vertex(
            [x + horizRadius*xcoords[i], y - yHeight, z + horizRadius*zcoords[i] ],
            [1.0,1.0],
            normalizeArray( [horizRadius*xcoords[i], -yHeight, horizRadius*zcoords[i] ] )
        ));
        vertices.push(new Vertex(
            [x, y - w, z],
            [0.5,0.0],
            normalizeArray( [0, -w, 0] )
        ));
    }

    return vertices;
}