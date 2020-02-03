var modelMatrix;
var rotationMatrix;
var scaleMatrix;
var translateMatrix;

var globalRotation;
var startTime = performance.now();
var globalTime = 0;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let beginningIndex = 0; // number of vertices
    // iterate per part
    for(let i = 0; i < rig.partData.length; i++){
        let part = rig.partData[i];

        // apply the matrix to the vertices for this part
        let indivMatrix = new Matrix4();
        indivMatrix.set(modelMatrix);
        indivMatrix.multiply(part.animMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, indivMatrix.elements);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rig.vertexArr), gl.STATIC_DRAW);

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

Armature.prototype.transformRigMatrices = function() {
    for(let i = 0; i < this.partData.length; i++){
        let part = this.partData[i];

        // set the parentMatrix
        if(part.parentIndex != -1)
            part.parentMatrix.set(this.partData[part.parentIndex].animMatrix);

        this.updateGlobalOrigin(part);

        part.animMatrix.set(part.initMatrix);
        part.animMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);

        let fn = part.animFunc;
        if(typeof part.animMatrixFunc !== 'undefined' && fn !== -1){
            part.animMatrixFunc(part.animMatrix);
        }

        part.animMatrix.multiply(part.parentMatrix);
    }
}

function transformModelMatrix() {
    resetMatrices();
    //translateMatrix.setTranslate(0,0,.3);
    //modelMatrix.multiply(translateMatrix);
    rotationMatrix.setRotate(-25,1,0,0);
    rotationMatrix.rotate(globalRotation,0,1,0);
    modelMatrix.multiply(rotationMatrix);
}

function updateTime() {
    let now = performance.now();
    //deltaTime = now - globalTime;
    globalTime = now - startTime;
}