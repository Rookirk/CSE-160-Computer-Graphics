function createAnimal(){
    rig.addBodyPart(
        {
            name: "core",
            parent: -1,
            origin: [0,0,0]
        },
        function(armature) {
            armature.createZCylinder(   [0,   0,   0],   [.1,   .1,   .1],[255,255,255], 10); // white
        },
        function(initMatrix) {
            //initMatrix.rotate(45,1,0,0);
        },
        function(animMatrix) {
            //animMatrix.transformRing1();
        }
    );

    rig.addBodyPart(
        {
            name: "yellowCyan",
            parent: "core",
            origin: [0,0,0]
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
            name: "magentaGreen",
            parent: "core",
            origin: [-.2,-.2,.2]
        },
        function(armature) {
            armature.createYCylinder(  [.4, 0, -.4],   [.1,   .1,   .1],[255,  0,255], 10); // magenta
            armature.createXCylinder( [0, 0,  0],   [.1,   .1,   .1],  [0,255,  0], 10); // green
        },
        function(initMatrix){

        },
        function(animMatrix){
            //animMatrix.transformRing1();
        }
    );

    rig.addBodyPart(
        {
            name: "redTailBase",
            parent: "magentaGreen",
            origin: [.5,0,-.5]
        },
        function(armature) {
            armature.createZCylinder( [.1, 0, -.1], [.1,   .1,   .1],[255,  0,  0],10); // red
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(35, 1.5*Math.PI);
        }
    );

    rig.addBodyPart(
        {
            name: "ring4",
            parent: "redTailBase",
            origin: [.2,0,-.2]
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
            origin: [.2,0,-.2]
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
            origin: [.2,0,-.2]
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