// Camera needs to be created before world
class World {
    constructor(width, height, rooms) {
        this.width = width;
        this.height = height;
        this.rooms = rooms;

        this.vertexArr = [];
        this.partData = [];

        /*this.worldArray = [
        [0,0,0,0],
        [0,0,1,0],
        [0,'c',0,0],
        [0,0,0,0],

        [1,0,2,1],
        [1,0,0,0],
        [0,'c',0,1],
        [0,2,0,3],
        ];*/

        let params = {
            width: this.width,
            height: this.height,
            numberOfRooms: this.rooms
        }
        this.worldArray = new graph_dungeon(params);

        // Check if the column is adjacent to any other column
        const checkBack = (i,j,k) => i > 0 && !(this.worldArray[i-1][j] > k);
        const checkLeft = (i,j,k) => j > 0 && !(this.worldArray[i][j-1] > k);
        const checkFront = (i,j,k) => i < this.worldArray.length - 1 && !(this.worldArray[i+1][j] > k);
        const checkRight = (i,j,k) => j < this.worldArray.length - 1 && !(this.worldArray[i][j+1] > k);

        const blockSize = .1;
        for(let i = 0; i < this.worldArray.length; i++){
            for(let j = 0; j < this.worldArray[i].length; j++){
                const elem = this.worldArray[i][j];
                if(elem === 'c') {
                    camera.setNewEye([j*blockSize, 2.25*blockSize, i*blockSize]);
                }
                else if(elem === 'a') {
                    camera.setNewAt([j*blockSize, 2.25*blockSize, i*blockSize]);
                }
                else if(elem === 's1'){
                    this.createSphere([j*blockSize, .35, i*blockSize],
                                      [.1,.1,.1], 'pixel', [1,1], [200,0,0], 30);
                }
                else if(elem === 's2'){
                    this.createSphere([j*blockSize, .35, i*blockSize],
                                      [.1,.1,.1], 'pixel', [1,1], [0,0,200], 30);
                }
                else{
                    for(let k = 0; k < elem; k++){
                        let facesToRender = [];
                        if( checkBack(i,j,k) ) facesToRender.push(5);
                        if( checkLeft(i,j,k) ) facesToRender.push(3);
                        if( checkFront(i,j,k) ) facesToRender.push(0);
                        if( checkRight(i,j,k) ) facesToRender.push(1);
                        if( k === elem - 1 ) facesToRender.push(2);

                        if( facesToRender.length === 0 ) facesToRender.push("empty");

                        this.createCube([j*blockSize, blockSize*k + blockSize/2, i*blockSize],
                                        [blockSize/2, blockSize/2, blockSize/2],
                                        'wall1',
                                        [1,1],
                                        [255,255,255],
                                        facesToRender);
                    }
                }
            }
        }

        this.drawOuterWalls(blockSize, this.worldArray.length);

        this.createInvertedCube([0,0,0],[5,5,5], 'pixel', [1,1], [126,188,188]);

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

    pushVert(coords, texCoords, normCoords, color){
        this.vertexArr.push( coords[0] );
        this.vertexArr.push( coords[1] );
        this.vertexArr.push( coords[2] );
        this.vertexArr.push( texCoords[0] );
        this.vertexArr.push( texCoords[1] );
        this.vertexArr.push( normCoords[0] );
        this.vertexArr.push( normCoords[1] );
        this.vertexArr.push( normCoords[2] );
        this.vertexArr.push( color[0]/255 );
        this.vertexArr.push( color[1]/255 );
        this.vertexArr.push( color[2]/255 );
    }

    createShape(vertices, texName, color, transformFunc){
        this.partData.push({
            amountOfVerts: 0,
            texUnit: -1
        })
        const endIndex = this.partData.length - 1;

        for(let i = 0; i < vertices.length; i++){
            const vertex = vertices[i];
            const xyzVertex = [vertex[0],vertex[1],vertex[2]];

            let newVertex;
            if(typeof transformFunc === "function"){
                let transformMatrix = new Matrix4();
                transformFunc(transformMatrix);

                newVertex = transformVert(xyzVertex, transformMatrix);
                let elem = newVertex.elements;
                
                this.pushVert([elem[0], elem[1], elem[2]],
                              vertex.texCoords,
                              vertex.normCoords,
                              color);
            }
            else{
                this.pushVert(vertex.coords,
                              vertex.texCoords,
                              vertex.normCoords,
                              color);
            }
        }

        this.partData[endIndex].amountOfVerts = vertices.length;
        this.partData[endIndex].texUnit = textures.indexNames[texName];
    }

    createCube(coords, size, texName, uvSize, color, facesToRender, transformFunc){
        let facesArr;
        (facesToRender == null) ? facesArr = [0,1,2,3,4,5] : facesArr = facesToRender;
        if(facesArr[0] === "empty") return;

        const vertices = this.getCubeVertices(coords, size, uvSize, facesArr);

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

    createSphere(coords, size, texName, uvSize, color, segments, transformFunc){
        if(segments < 3){
            console.log("Cannot have less than 3 segments in sphere");
            return;
        }

        const vertices = this.getSphereVertices(coords, size, uvSize, segments);

        this.createShape(vertices, texName, color, transformFunc);
    }

    drawOuterWalls(blockSize, length){
        for(let i = 0; i < length + 1; i++){
            for(let k = 0; k < 4; k++){
                this.createCube([-1*blockSize, blockSize*k + blockSize/2, i*blockSize],
                                            [blockSize/2, blockSize/2, blockSize/2],
                                            'ground',
                                            [1,1],
                                            [255,255,255],
                                            [3,1]);
            }
            for(let k = 0; k < 4; k++){
                this.createCube([i*blockSize, blockSize*k + blockSize/2, -1*blockSize],
                                            [blockSize/2, blockSize/2, blockSize/2],
                                            'ground',
                                            [1,1],
                                            [255,255,255],
                                            [0,5]);
            }
            for(let k = 0; k < 4; k++){
                this.createCube([length*blockSize, blockSize*k + blockSize/2, i*blockSize],
                                            [blockSize/2, blockSize/2, blockSize/2],
                                            'ground',
                                            [1,1],
                                            [255,255,255],
                                            [3,1]);
            }
            for(let k = 0; k < 4; k++){
                this.createCube([i*blockSize, blockSize*k + blockSize/2, length*blockSize],
                                            [blockSize/2, blockSize/2, blockSize/2],
                                            'ground',
                                            [1,1],
                                            [255,255,255],
                                            [0,5]);
            }
        }
    }
}