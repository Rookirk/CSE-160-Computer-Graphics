/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        originX // unmodified origin points
        originY
        originZ

        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

var Armature = function() {
    this.vertexArr = [];
    this.partData = [];
    this.partName = [];
}

Armature.prototype.addBodyPart = function(part, shapeFunc, initMatrixFunc) {
    this.partData.push(part);
    this.partName.push(part.name);

    part.vertsPerShape = [];
    part.initMatrix = new Matrix4();
    part.animMatrix = new Matrix4();

    if(part.parent !== -1){
        part.parentIndex = this.partName.indexOf(part.parent);

        let parent = this.partData[part.parentIndex];

        part.originX += parent.originX;
        part.originY += parent.originY;
        part.originZ += parent.originZ;

        part.initMatrix.set(parent.animMatrix);
    }
    else{
        part.parentIndex = -1;
    }

    shapeFunc(this);

    if(initMatrixFunc && enableInit){
        part.initMatrix.translate(part.originX,part.originY,part.originZ);
        initMatrixFunc(part.initMatrix);
        part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);
    }
    part.animMatrix.set(part.initMatrix);
}
