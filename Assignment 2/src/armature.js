/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        origin // unmodified origin points

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

    part.vertsPerShape = [];
    part.initMatrix = new Matrix4();
    part.animMatrix = new Matrix4();

    if(part.parent !== -1){
        part.parentIndex = this.partName.indexOf(part.parent);

        let parent = this.partData[part.parentIndex];

        part.origin[0] += parent.origin[0];
        part.origin[1] += parent.origin[1];
        part.origin[2] += parent.origin[2];

        part.initMatrix.set(parent.animMatrix);
    }
    else{
        part.parentIndex = -1;
    }

    shapeFunc(this);

    if(typeof initMatrixFunc !== 'undefined' && enableInit){
        part.initMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);
        initMatrixFunc(part.initMatrix);
        part.initMatrix.translate(-part.origin[0],-part.origin[1],-part.origin[2]);
    }
    part.animMatrix.set(part.initMatrix);

    if(typeof animMatrixFunc !== 'undefined'){
        part.animMatrixFunc = animMatrixFunc;
    }
}
