/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        origin // unmodified origin points

        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
        globalOrigin // where the origin point is in global space
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
    // shapes assume 0,0,0 is their parent's origin point
    part.initMatrix = new Matrix4();
    if(typeof initMatrixFunc !== 'undefined' && enableInit){
        part.initMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);
        initMatrixFunc(part.initMatrix);
        part.initMatrix.translate(-part.origin[0],-part.origin[1],-part.origin[2]);
    }

    // then shapes are reposiitioned in global space due to parents
    part.parentMatrix = new Matrix4();
    part.globalOrigin = part.origin;
    if(part.parent !== -1){
        part.parentIndex = this.partName.indexOf(part.parent);

        let parent = this.partData[part.parentIndex];
        part.parentMatrix.set(parent.animMatrix);

        this.updateGlobalOrigin(part);
    }
    else{
        part.parentIndex = -1;
    }
    console.log(part.globalOrigin);

    part.animMatrix = new Matrix4();
    part.animMatrix.set(part.initMatrix);
    part.animMatrix.multiply(part.parentMatrix);
    /*part.parentMatrix = new Matrix4();
    if(part.parent !== -1){
        part.parentIndex = this.partName.indexOf(part.parent);

        let parent = this.partData[part.parentIndex];

        let newOrigin = getTransformedPartOrigin(parent.animMatrix, part.origin);

        let parentOrigin = new Matrix4();
        parentOrigin.translate(-parent.origin[0],-parent.origin[1],-parent.origin[2]);

        parentOrigin.translate(newOrigin.elements[0],newOrigin.elements[1],newOrigin.elements[2]);

        part.origin[0] = parentOrigin.elements[12];
        part.origin[1] = parentOrigin.elements[13];
        part.origin[2] = parentOrigin.elements[14];

        part.parentMatrix.set(parent.animMatrix);
    }
    else{
        part.parentIndex = -1;
    }

    shapeFunc(this);

    part.initMatrix = new Matrix4();
    if(typeof initMatrixFunc !== 'undefined' && enableInit){
        part.initMatrix.translate(part.origin[0],part.origin[1],part.origin[2]);
        initMatrixFunc(part.initMatrix);
        part.initMatrix.translate(-part.origin[0],-part.origin[1],-part.origin[2]);
    }

    part.animMatrix = new Matrix4();
    part.animMatrix.set(part.initMatrix);

    if(typeof animMatrixFunc !== 'undefined'){
        part.animMatrixFunc = animMatrixFunc;
    }*/
}

getTransformedPartOrigin = function(transformMatrix, origin){
    let oldOrigin = new Vector3([origin[0], origin[1], origin[2]]);
    let rotMatrix = new Matrix4();
    rotMatrix.set(transformMatrix);

    return rotMatrix.multiplyVector3(oldOrigin);
}

Armature.prototype.updateGlobalOrigin = function(part) {
    if(part.parentIndex === -1) return;
    let parent = this.partData[part.parentIndex];

    console.log(parent.animMatrix);
    console.log(part.origin);
    let newOrigin = getTransformedPartOrigin(parent.animMatrix, part.origin);

    let parentOrigin = new Matrix4();
    console.log(parent.globalOrigin);
    parentOrigin.translate(-parent.globalOrigin[0],-parent.globalOrigin[1],-parent.globalOrigin[2]);

    parentOrigin.translate(newOrigin.elements[0],newOrigin.elements[1],newOrigin.elements[2]);

    part.globalOrigin[0] = parentOrigin.elements[12];
    part.globalOrigin[1] = parentOrigin.elements[13];
    part.globalOrigin[2] = parentOrigin.elements[14];
}