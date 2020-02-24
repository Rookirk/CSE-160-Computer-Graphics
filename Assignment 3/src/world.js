class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.vertexArr = [];
        this.partData = [];

        this.worldArray = [
        [0,0,0,0],
        [0,0,1,0],
        [0,'c',0,0],
        [0,0,0,0],

        /*
        [1,0,2,1],
        [1,0,0,0],
        [0,'c',0,1],
        [0,2,0,3],
        */
        ];

        const blockSize = .1;
        for(let i = 0; i < this.worldArray.length; i++){
            for(let j = 0; j < this.worldArray[i].length; j++){
                const elem = this.worldArray[i][j];
                if(elem === 'c'){
                    camera = new Camera([j*blockSize, .2, i*blockSize],
                                        [j*blockSize, 0, i*blockSize-1]);
                }
                else{
                    for(let k = 0; k < elem; k++){
                        this.createCube([j*blockSize, blockSize*k + blockSize/2, i*blockSize],
                                        [blockSize/2, blockSize/2, blockSize/2],
                                        'debug',
                                        [1,1],
                                        [255,255,255]);
                    }
                }
            }
        }

        this.createInvertedCube([0,0,0],[5,5,5], 'pixel', [1,1], [126,188,188]);

        this.createInvertedCube([0,.25,0],[.1,.1,.1], 'debug', [1,1], [255,255,255]);

        this.createPlane([blockSize*this.worldArray.length/2 - blockSize/2,
                          0,
                          blockSize*this.worldArray.length/2 - blockSize/2],
                         [blockSize*this.worldArray.length/2,
                          1,
                          blockSize*this.worldArray.length/2],
                          'ground',
                          [this.worldArray.length,this.worldArray.length],
                          [255,255,255]);
    }

    pushVert(x,y,z,tx,ty,r,g,b){
        this.vertexArr.push( x );
        this.vertexArr.push( y );
        this.vertexArr.push( z );
        this.vertexArr.push( tx );
        this.vertexArr.push( ty );
        this.vertexArr.push( r/255 );
        this.vertexArr.push( g/255 );
        this.vertexArr.push( b/255 );
    }

    getCubeVertices(coords, size, uvSize) {
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
            7, 4, 3,   7, 3, 2,    // down
            4, 7, 6,   4, 6, 5     // back
        ]);

        const texIndices = new Uint8Array([
            2, 0, 1,   2, 1, 3,
            0, 1, 3,   0, 3, 2,
            3, 2, 0,   3, 0, 1,
            2, 0, 1,   2, 1, 3,
            2, 0, 1,   2, 1, 3,
            1, 3, 2,   1, 2, 0
        ]);
        // Iterate through all vertices
        for(let i = 0; i < cubeIndices.length; i++){
            let indexVal = cubeIndices[i];
            // push the x, y, z, r, g, b with appropriate transforms
            vertices.push([x + cubeVertices[indexVal][0] * l,
                           y + cubeVertices[indexVal][1] * w,
                           z + cubeVertices[indexVal][2] * h,
                           texCoords[texIndices[i]][0] * tl,
                           texCoords[texIndices[i]][1] * tw
            ]);
        }

        return vertices;
    }

    getInvertedCubeVertices(coords, size, uvSize) {
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
            // push the x, y, z, r, g, b with appropriate transforms
            vertices.push([x + cubeVertices[indexVal][0] * l,
                           y + cubeVertices[indexVal][1] * w,
                           z + cubeVertices[indexVal][2] * h,
                           texCoords[texIndices[i]][0] * tl,
                           texCoords[texIndices[i]][1] * tw
            ]);
        }

        return vertices;
    }

    getPlaneVertices(coords, size, uvSize) {
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
            // push the x, y, z, texCoords with appropriate transforms
            vertices.push([x + squareVertices[indexVal][0] * l,
                           y + squareVertices[indexVal][1] * w,
                           z + squareVertices[indexVal][2] * h,
                           texCoords[texIndices[i]][0] * tl,
                           texCoords[texIndices[i]][1] * tw
            ]);
        }

        return vertices;
    }

    createShape(vertices, texName, color, transformFunc){
        this.partData.push({
            amountOfVerts: 0,
            texUnit: -1
        })
        const endIndex = this.partData.length - 1;
        const r = color[0], g = color[1], b = color[2];

        for(let i = 0; i < vertices.length; i++){
            const vertex = vertices[i];
            const xyzVertex = [vertex[0],vertex[1],vertex[2]];

            let newVertex;
            if(typeof transformFunc === "function"){
                let transformMatrix = new Matrix4();
                transformFunc(transformMatrix);
                newVertex = transformVert(xyzVertex, transformMatrix);
                let elem = newVertex.elements;
                this.pushVert(elem[0], elem[1], elem[2],
                              vertex[3],vertex[4],
                              r,g,b);
            }
            else{
                this.pushVert(vertex[0], vertex[1], vertex[2],
                              vertex[3],vertex[4],
                              r,g,b);
            }
        }

        this.partData[endIndex].amountOfVerts = vertices.length;
        this.partData[endIndex].texUnit = textures.indexNames[texName];
    }

    createCube(coords, size, texName, uvSize, color, transformFunc){
        const vertices = this.getCubeVertices(coords, size, uvSize);

        this.createShape(vertices, texName, color, transformFunc);
    }

    createInvertedCube(coords, size, texName, uvSize, color, transformFunc){
        const vertices = this.getInvertedCubeVertices(coords, size, uvSize);

        this.createShape(vertices, texName, color, transformFunc);
    }

    createPlane(coords, size, texName, uvSize, color, transformFunc){
        const vertices = this.getPlaneVertices(coords, size, uvSize);

        this.createShape(vertices, texName, color, transformFunc);
    }
}