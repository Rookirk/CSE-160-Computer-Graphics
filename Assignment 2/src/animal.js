var rig;

function createDragon(){
    rig.addBodyPart(
        {
            name: "Torso1",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
            armature.createZCylinder( [0, -.03, .07], [.08, .08, .15], [239, 219, 131], 8); // Yellow underbelly
            armature.createFin([0, .16, .1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
            armature.createSphere([0, 0, 0], [.11, .11, .13], [204, 140, 20], 8)
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(15,0);
        }
    );
    for(let i = 0; i < 5; i++){
        const currIndex = i + 2;
        const parentIndex = i + 1;
        const spineOffset = (5-i)/5*Math.PI;
        rig.addBodyPart(
            {
                name: "Torso" + currIndex,
                parent: "Torso" + parentIndex,
                originX: 0,
                originY: 0,
                originZ: .2
            },
            function(armature) {
                armature.createZCylinder( [0, 0, .1], [.1, .1, .1], [204, 140, 20], 8); // Golden scales
                armature.createZCylinder( [0, -.03, .07], [.08, .08, .15], [239, 219, 131], 8); // Yellow underbelly
                armature.createFin([0, .16, .1], [0, .7], [.03, .06, .1], [19, 84, 22], 8); // green fin
                armature.createSphere([0, 0, 0], [.11, .11, .13], [204, 140, 20], 8)
            },
            function(initMatrix) {
                //initMatrix.scale(.9,.9,1);
            },
            function(animMatrix) {
                animMatrix.transformSpine(15,spineOffset);
            }
        );
    }
    
}

function createAnimal(){
    rig.addBodyPart(
        {
            name: "core",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0
        },
        function(armature) {
            armature.createSphere(   [0,   0,   0],   [.1,   .1,   .1],[255,255,255], 10); // white
        },
        function(initMatrix) {
            //initMatrix.rotate(45,1,0,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring1",
            parent: "core",
            originX: 0,
            originY: 0,
            originZ: 0
        },
        function(armature) {
            armature.createFin( [.2, .2, .2], [1, 0], [.1, .1, .1],[255,255,  0], 10); // yellow
            armature.createCube( [-.2, .2, -.2],   [.1,   .1, .1],  [0,255,255]); // cyan
        },
        function(initMatrix) {
            //initMatrix.rotate(45,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformRing1();
        }
    );

    rig.addBodyPart(
        {
            name: "ring2",
            parent: "core",
            originX: -.2,
            originY: -.2,
            originZ: .2
        },
        function(armature) {
            armature.createYCylinder(  [.4, 0, -.4],   [.1,   .2,   .1],[255,  0,255], 10); // magenta
            armature.createXCylinder( [0, 0,  0],   [.2,   .1,   .1],  [0,255,  0], 10); // green
        }
    );

    rig.addBodyPart(
        {
            name: "ring3",
            parent: "ring2",
            originX: .5,
            originY: 0,
            originZ: -.5
        },
        function(armature) {
            armature.createZCylinder( [.1, 0, -.1], [.1,   .1,   .2],[255,  0,  0],10); // red
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(35, 1.5*Math.PI);
        }
    );

    rig.addBodyPart(
        {
            name: "ring4",
            parent: "ring3",
            originX: .2,
            originY: 0,
            originZ: -.2
        },
        function(armature) {
            armature.createCube( [.1, 0, -.1],   [.1,   .1,   .1],[210,  0,  0]); // red
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(35, Math.PI);
        }
    );

    rig.addBodyPart(
        {
            name: "ring5",
            parent: "ring4",
            originX: .2,
            originY: 0,
            originZ: -.2
        },
        function(armature) {
            armature.createCube( [.1, 0, -.1],   [.1,   .1,   .1],[170,  0,  0]); // red
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(35, .5*Math.PI);
        }
    );

    rig.addBodyPart(
        {
            name: "ring6",
            parent: "ring5",
            originX: .2,
            originY: 0,
            originZ: -.2
        },
        function(armature) {
            armature.createCube( [.1, 0, -.1], [.1,   .1,   .1],[130,0,  0]); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        },
        function(animMatrix) {
            animMatrix.transformSpine(35, 0);
        }
    );
}