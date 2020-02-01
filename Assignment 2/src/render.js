var modelMatrix;
var rotationMatrix;
var scaleMatrix;
var translateMatrix;

var globalRotation;
var globalTime = Date.now();
var deltaTime;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let beginningIndex = 0; // number of vertices
    // iterate per part
    for(let i = 0; i < partData.length; i++){
        let part = partData[i];

        // apply the matrix to the vertices for this part
        let indivMatrix = new Matrix4();
        indivMatrix.set(modelMatrix);
        indivMatrix.multiply(part.animMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, indivMatrix.elements);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArr), gl.STATIC_DRAW);

        let amountOfVerts = 0;
        // iterate through all shapes in that part
        for(let j = 0; j < part.vertsPerShape.length; j++){
            // obtain how many verts to draw
            amountOfVerts += part.vertsPerShape[j];
        }
        gl.drawArrays(gl.TRIANGLES, beginningIndex, amountOfVerts);
        beginningIndex += amountOfVerts;        
    }
}

function initMatrices() {
    modelMatrix = new Matrix4();
    //modelMatrix.setPerspective(30, 1, 1, 100);
    //modelMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    
    rotationMatrix = new Matrix4();

    scaleMatrix = new Matrix4();

    translateMatrix = new Matrix4();

    transformModelMatrix();
}

function resetMatrices() {
    modelMatrix.setIdentity();
    rotationMatrix.setIdentity();
    scaleMatrix.setIdentity();
    translateMatrix.setIdentity();
}

function transformAnimalMatrices() {
    for(let i = 0; i < partData.length; i++){
        let part = partData[i];

        let fn = part.transformFunc;

        if(fn === -1) continue; // if no such function exists, move on
        // align the animMatrix with the correct initMatrix
        if(part.parent != -1)
            part.animMatrix.set(partData[part.parent].animMatrix);
        else
            part.animMatrix.set(part.initMatrix);
        part.animMatrix.translate(part.originX,part.originY,part.originZ);
        window[fn](part);
        part.animMatrix.translate(-part.originX,-part.originY,-part.originZ);
    }
}

function transformModelMatrix() {
    resetMatrices();
    rotationMatrix.setRotate(-25,1,0,0);
    rotationMatrix.rotate(globalRotation,0,1,0);
    modelMatrix.multiply(rotationMatrix);
}