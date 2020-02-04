/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // name of the parent part; -1 if none
        origin // how much to offset it in the parent local space
        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

var Armature = function() {
    this.vertexArr = [];
    this.partData = [];
    this.partName = [];
}

Armature.prototype.addBodyPart = function(part, shapeFunc, initMatrixFunc, animMatrixFunc) {
    this.partData.push(part);
    this.partName.push(part.name);
    console.log(part.name);

    if(typeof animMatrixFunc !== 'undefined'){
        part.animMatrixFunc = animMatrixFunc;
    }

    part.vertsPerShape = [];

    // shapes should be drawn at 0,0,0
    shapeFunc(this);

    // then the shapes are reoriented in local space
    // origin is the offset in the parent's local space
    part.initMatrix = new Matrix4();
    if(typeof initMatrixFunc !== 'undefined' && enableInit){
        initMatrixFunc(part.initMatrix);
    }

    // then shapes are reposiitioned in global space due to parents
    part.parentMatrix = new Matrix4();
    //part.globalOrigin = part.origin;
    if(part.parent !== -1){
        part.parentIndex = this.partName.indexOf(part.parent);

        let parent = this.partData[part.parentIndex];
        part.parentMatrix.set(parent.animMatrix);
    }
    else{
        part.parentIndex = -1;
    }

    //[parentMatrix][translate][initMatrix]
    part.animMatrix = new Matrix4();
    part.animMatrix.set(part.parentMatrix);
    part.animMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);
    part.animMatrix.multiply(part.initMatrix);
}

Armature.prototype.modifyVerticesWithInit = function(){
    let beginningIndex = 0; // number of vertices
    // Iterate through all of the parts
    for(let i = 0; i < this.partData.length; i++){
        let part = this.partData[i];

        let amountOfComponents = 0;
        // iterate through all shapes in that part
        for(let j = 0; j < part.vertsPerShape.length; j++){
            // obtain how many verts to draw
            amountOfComponents += part.vertsPerShape[j]*6;
        }

        for(let k = beginningIndex; k < beginningIndex + amountOfComponents; k += 6){
            console.log(k);
            let oldVertex = new Vector3([this.vertexArr[k], this.vertexArr[k+1], this.vertexArr[k+2]]);
            let indivMatrix = new Matrix4();
            indivMatrix.set(part.initMatrix);
            let newVertex = indivMatrix.multiplyVector3(oldVertex);

            let elem = newVertex.elements;

            this.vertexArr[k] = elem[0];
            this.vertexArr[k+1] = elem[1];
            this.vertexArr[k+2] = elem[2];
        }

        beginningIndex += amountOfComponents;
    }
}