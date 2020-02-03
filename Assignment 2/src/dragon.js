function createDragon(){
    rig.addBodyPart(
        {
            name: "Base",
            parent: -1,
            origin: [0,0,0]
        },
        function(armature) {
            armature.createCube([0,0,0],[0,0,0],[255,255,255]);
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformBody();
        }
        )

    let totalSpineSegs = 7;
    rig.drawDragonTail(totalSpineSegs);
    
    let totalChestSegsPerS = 4;
    rig.drawDragonBody(totalChestSegsPerS);

    let lastChest = (2*totalChestSegsPerS)+1;
    rig.addBodyPart(
        {
            name: "Head",
            parent: "Chest" + lastChest,
            origin: [0,0,-.3]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.16, .15, .2], [204, 140, 20],6); // Skull
            armature.createSphere( [0, -.08, -.15], [.1, .1, .2], [204, 140, 20],6); // Snout

            armature.createSphere( [.06, .03, -.16], [.02, .02, .02], [21, 63, 46],5); // Eyes
            armature.createSphere( [-.06, .03, -.16], [.02, .02, .02], [21, 63, 46],5); // Eyes

            armature.createSphere( [.05, .05, -.16], [.02, .02, .02], [204, 140, 20],6); // Eyebrows
            armature.createSphere( [-.05, .05, -.16], [.02, .02, .02], [204, 140, 20],6); // Eyes
        },
        function(initMatrix) {
            initMatrix.rotate(-25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(40,Math.PI);
        }
    );
}

Armature.prototype.drawDragonAntlers = function(){
    
}

Armature.prototype.drawDragonBody = function(totalChestSegsPerS){
    rig.addBodyPart(
        {
            name: "Chest1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.drawDraonSpineSeg(-.2);
        },
        function(initMatrix) {
            initMatrix.rotate(25,1,0,0);
        },
        function(animMatrix) {
            //animMatrix.transformChest(5,0);
        }
    );

    for(let i = 0; i < totalChestSegsPerS; i++){
        const currIndex = i + 2;
        const parentIndex = currIndex - 1;
        //const spineOffset = (totalChestSegsPerS-i)/totalChestSegsPerS*Math.PI;
        rig.addBodyPart(
            {
                name: "Chest" + currIndex,
                parent: "Chest" + parentIndex,
                origin: [0,0,-.2]
            },
            function(armature) {
                armature.drawDraonSpineSeg(-.2);
            },
            function(initMatrix) {
                initMatrix.rotate(35,1,0,0);
            },
            function(animMatrix) {
                animMatrix.transformChest(5,0);
            }
        );
    }

    for(let i = 0; i < totalChestSegsPerS; i++){
        const currIndex = i + 6;
        const parentIndex = currIndex - 1;
        //const spineOffset = (totalChestSegsPerS-i)/totalChestSegsPerS*Math.PI;
        rig.addBodyPart(
            {
                name: "Chest" + currIndex,
                parent: "Chest" + parentIndex,
                origin: [0,0,-.2]
            },
            function(armature) {
                armature.drawDraonSpineSeg(-.2);
            },
            function(initMatrix) {
                initMatrix.rotate(-40,1,0,0);
            },
            function(animMatrix) {
                animMatrix.transformChest(-10,Math.PI);
            }
        )
    }
}

Armature.prototype.drawDraonSpineSeg = function(offset){
    this.createZCylinder( [0, 0, .1 + offset], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
    this.createZCylinder( [0, -.03, .1 + offset], [.08, .08, .1], [239, 219, 131], 8); // Yellow underbelly
    this.createFin([0, .16, .1 + offset], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
    this.createSphere([0, .01, 0 + offset], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
    this.createSphere([0, -.03, 0 + offset], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
}

Armature.prototype.drawDragonTail = function(totalSpineSegs){
    rig.addBodyPart(
        {
            name: "Torso1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.drawDraonSpineSeg(0);
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(15,0);
        }
    );
    
    for(let i = 0; i < totalSpineSegs; i++){
        const currIndex = i + 2;
        const parentIndex = currIndex - 1;
        const spineOffset = (totalSpineSegs-i)/totalSpineSegs*Math.PI;
        rig.addBodyPart(
            {
                name: "Torso" + currIndex,
                parent: "Torso" + parentIndex,
                origin: [0,0,.2]
            },
            function(armature) {
                armature.drawDraonSpineSeg(0);
            },
            function(initMatrix) {
                initMatrix.scale(.85,.85,1);
            },
            function(animMatrix) {
                animMatrix.transformSpine(15,spineOffset);
            }
        );
    }
}