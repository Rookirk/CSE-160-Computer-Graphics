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

Armature.prototype.transformRigMatrices = function() {
    for(let i = 0; i < this.partData.length; i++){
        let part = this.partData[i];

        // set the parentMatrix
        if(part.parentIndex != -1)
            part.parentMatrix.set(this.partData[part.parentIndex].animMatrix);

        // read in reverse
        // bodyPark then undergoes parent transformations
        part.animMatrix.set(part.parentMatrix);
        // bodyPart then offsets itself to parent
        part.animMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);

        // bodyPart then undergoes animation
        if(typeof part.animMatrixFunc !== 'undefined'){
            if(enableAnim) part.animMatrixFunc(part.animMatrix);
        }

        // bodyPart first sets itself to initMatrix
        part.animMatrix.multiply(part.initMatrix);
    }
}

function transformModelMatrix() {
    modelMatrix.setIdentity();
    modelMatrix.scale(.6,.6,.6);
    modelMatrix.translate(0,-.6,.4);
    modelMatrix.rotate(globalRotation,0,1,0);
    modelMatrix.translate(0,0,-.4);
    //modelMatrix.rotate(-90,1,0,0);
}

function updateTime() {
    let now = performance.now();
    //deltaTime = now - globalTime;
    globalTime = now - startTime;
}