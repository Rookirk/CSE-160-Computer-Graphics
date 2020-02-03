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
    rig.addBodyPart(
        {
            name: "Torso1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
            armature.createZCylinder( [0, -.03, .1], [.08, .08, .1], [239, 219, 131], 8); // Yellow underbelly
            armature.createFin([0, .16, .1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
            armature.createSphere([0, .01, 0], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
            armature.createSphere([0, -.03, 0], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(15,0);
        }
    );
    let totalSpineSegs = 7;
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
                armature.createZCylinder( [0, 0, .1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
                armature.createZCylinder( [0, -.03, .1], [.08, .08, .1], [239, 219, 131], 8); // Yellow underbelly
                armature.createFin([0, .16, .1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
                armature.createSphere([0, .01, 0], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
                armature.createSphere([0, -.03, 0], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
            },
            function(initMatrix) {
                //initMatrix.rotate(25,1,0,0);
                initMatrix.scale(.85,.85,1);
                //initMatrix.translate(0,-.2,0);
            },
            function(animMatrix) {
                animMatrix.transformSpine(15,spineOffset);
            }
        );
    }
    
    rig.addBodyPart(
        {
            name: "Chest1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, -.1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
            armature.createZCylinder( [0, -.03, -.1], [.08, .08, .12], [239, 219, 131], 8); // Yellow underbelly
            armature.createFin([0, .16, -.1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
            armature.createSphere([0, .01, -.2], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
            armature.createSphere([0, -.03, -.2], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
        },
        function(initMatrix) {
            initMatrix.rotate(25,1,0,0);
        },
        function(animMatrix) {
            //animMatrix.transformChest(5,0);
        }
    );

    let totalChestSegsPerS = 4;
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
                armature.createZCylinder( [0, 0, -.1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
                armature.createZCylinder( [0, -.03, -.1], [.08, .08, .12], [239, 219, 131], 8); // Yellow underbelly
                armature.createFin([0, .16, -.1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
                armature.createSphere([0, .01, -.2], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
                armature.createSphere([0, -.03, -.2], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
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
                armature.createZCylinder( [0, 0, -.1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
                armature.createZCylinder( [0, -.03, -.1], [.08, .08, .12], [239, 219, 131], 8); // Yellow underbelly
                armature.createFin([0, .16, -.1], [0, .7], [.03, .06, .14], [19, 84, 22], 8); // green fin
                armature.createSphere([0, .01, -.2], [.11, .11, .13], [204, 140, 20], 5); // Golden scales
                armature.createSphere([0, -.03, -.2], [.08, .08, .08], [239, 219, 131], 5); // yellow underbelly
            },
            function(initMatrix) {
                initMatrix.rotate(-40,1,0,0);
            },
            function(animMatrix) {
                animMatrix.transformChest(-10,Math.PI);
            }
        )
    }

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