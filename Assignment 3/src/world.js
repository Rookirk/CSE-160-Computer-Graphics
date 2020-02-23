class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.vertexArr = [];

        this.worldArray = [
        [1,1,2,1],
        [1,0,0,1],
        [1,'c',0,1],
        [1,2,1,3],
        ];

        for(let i = 0; i < this.worldArray.length; i++){
            for(let j = 0; j < this.worldArray[i].length; j++){
                const elem = this.worldArray[i][j];
                if(elem === 'c'){
                    camera = new Camera([j*.2,0,i*.2],[j*.2,0,i*.2-1]);
                }
                else{
                    const groundHeight = -.2;
                    for(let k = 0; k < elem; k++){
                        this.createCube([j*.2,groundHeight + .2*k,i*.2],[.1,.1,.1],[255,0,0]);
                    }
                }
            }
        }

        /*this.createCube([0,0,0],[.1,.1,.1],[255,0,0]);
        this.createCube([.2,0,-.2],[.1,.1,.1],[255,255,0]);
        this.createCube([.4,0,-.2],[.1,.1,.1],[255,255,0]);

        this.createCube([0,.2,0],[.1,.1,.1],[255,0,0]);
        this.createCube([0,.4,0],[.1,.1,.1],[255,0,0]);
        this.createCube([0,.6,0],[.1,.1,.1],[255,0,0]);

        this.createCube([.2,.2,0],[.1,.1,.1],[255,0,0]);
        this.createCube([.4,.3,.2],[.1,.1,.1],[255,0,0]);*/
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

    getCubeVertices(coords, size) {
        const x = coords[0], y = coords[1], z = coords[2];
        const l = size[0], w = size[1], h = size[2];

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
            2, 0, 1,   2, 1, 3,
            2, 0, 1,   2, 1, 3,
            2, 0, 1,   2, 1, 3,
            2, 0, 1,   2, 1, 3,
            2, 0, 1,   2, 1, 3
        ]);
        // Iterate through all vertices
        for(let i = 0; i < cubeIndices.length; i++){
            let indexVal = cubeIndices[i];
            // push the x, y, z, r, g, b with appropriate transforms
            vertices.push([x + cubeVertices[indexVal][0] * l,
                           y + cubeVertices[indexVal][1] * w,
                           z + cubeVertices[indexVal][2] * h,
                           texCoords[texIndices[i]][0],
                           texCoords[texIndices[i]][1]
            ]);
        }

        return vertices;
    }

    createShape(vertices, color, transformFunc){
        //const endIndex = this.partData.length - 1;
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

        //this.partData[endIndex].vertsPerShape.push(vertices.length);
    }

    createCube(coords, size, color, transformFunc){
        const x = coords[0], y = coords[1], z = coords[2];
        const l = size[0], w = size[1], h = size[2];

        const vertices = this.getCubeVertices(coords, size);

        this.createShape(vertices, color, transformFunc);
    }
}