/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // name of the parent part; -1 if none
        origin // how much to offset it in the parent local space
        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

class Armature{
    constructor(world){
        this.vertexArr = [];
        this.partData = [];
        this.partName = [];
        this.world = world;
    }

    initBuild(){
        this.world.buildingRig = true;
        this.beginIndex = this.world.partData.length;
    }

    endBuild(){
        this.world.buildingRig = false;
        this.endIndex = this.world.partData.length - 1;
        console.log(this);
    }
    
    addBodyPart(part, shapeFunc, initMatrixFunc, animMatrixFunc){
        this.partData.push(part);
        this.partName.push(part.name);

        if(typeof animMatrixFunc !== 'undefined'){
            part.animMatrixFunc = animMatrixFunc;
        }

        part.vertsPerShape = [];

        // shapes should be drawn at 0,0,0
        shapeFunc(this, this.world);

        let totalVerts = 0;
        for(let i = 0; i < part.vertsPerShape.length; i++){
            totalVerts += part.vertsPerShape[i];
        }
        part.totalVerts = totalVerts;
        part.totalShapes = part.vertsPerShape.length

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

            const parent = this.partData[part.parentIndex];
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

    update() {
        for(let i = 0; i < this.partData.length; i++){
            let part = this.partData[i];

            // set the parentMatrix
            if(part.parentIndex != -1)
                part.parentMatrix.set(this.partData[part.parentIndex].animMatrix);

            // read in reverse
            // bodyPart then undergoes parent transformations
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
}
