var modelMatrix;
var rotationMatrix;
var scaleMatrix;
var translateMatrix;

var globalRotation;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let beginningIndex = 0; // number of vertices
    // iterate per part
    for(let i = 0; i < partDataArr.length; i++){
        // apply the matrix to the vertices for this part
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArr), gl.STATIC_DRAW);

        let amountOfVerts = 0;
        // iterate through all shapes in that part
        for(let j = 0; j < partDataArr[i].shapeNum; j++){
            // obtain how many verts to draw
            amountOfVerts += vertsPerShapeArr[j];
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
    rotationMatrix.setRotate(-25,1,0,0);
    modelMatrix.multiply(rotationMatrix);

    scaleMatrix = new Matrix4();

    translateMatrix = new Matrix4();
}

function resetMatrices() {
    modelMatrix.setIdentity();
    rotationMatrix.setIdentity();
    scaleMatrix.setIdentity();
    translateMatrix.setIdentity();
}

function transformMatrices() {
    resetMatrices();
    rotationMatrix.setRotate(-25,1,0,0);
    rotationMatrix.rotate(globalRotation,0,1,0);
    modelMatrix.multiply(rotationMatrix);
}