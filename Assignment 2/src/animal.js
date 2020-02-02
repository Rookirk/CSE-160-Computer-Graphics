var rig;

function createDragon(){
    rig.addBodyPart(
        {
            name: "Torso",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0,

            animFunc: -1
        },
        function(armature) {
            armature.createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
            armature.createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan
        },
        function(initMatrix) {
            initMatrix.rotate(45,1,0,0);
        }
    );
}

function createAnimal(){
    rig.addBodyPart(
        {
            name: "core",
            parent: -1,
            originX: 0,
            originY: 0,
            originZ: 0,

            animFunc: -1
        },
        function(armature) {
            armature.createSphere(   0,   0,   0,   .1,   .1,   .1,255,255,255, 10); // white
        }
    );

    rig.addBodyPart(
        {
            name: "ring1",
            parent: "core",
            originX: 0,
            originY: 0,
            originZ: 0,

            animFunc: -1
        },
        function(armature) {
            armature.createCube( .2, .2, .2, .1, .1, .1,255,255,  0); // yellow
            armature.createCube( -.2, .2, -.2,   .1,   .1, .1,  0,255,255); // cyan
        },
        function(initMatrix) {
            initMatrix.rotate(45,1,0,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring2",
            parent: "core",
            originX: -.2,
            originY: -.2,
            originZ: .2,

            animFunc: "transformRing1"
        },
        function(armature) {
            armature.createSphere(  .4, 0, -.4,   .1,   .1,   .1,255,  0,255, 10); // magenta
            armature.createXCylinder( 0, 0,  0,   .1,   .1,   .1,  0,255,  0, 10); // green
        }
    );

    rig.addBodyPart(
        {
            name: "ring3",
            parent: "ring2",
            originX: .5,
            originY: 0,
            originZ: -.5,

            animFunc: "transformSpine",
            animArgs: [35, 1.5*Math.PI]
        },
        function(armature) {
            armature.createCube( .1, 0, -.1,   .1,   .1,   .1,255,  0,  0); // red
        }
    );

    rig.addBodyPart(
        {
            name: "ring4",
            parent: "ring3",
            originX: .2,
            originY: 0,
            originZ: -.2,

            animFunc: "transformSpine",
            animArgs: [35, Math.PI]
        },
        function(armature) {
            armature.createCube( .1, 0, -.1,   .1,   .1,   .1,210,  0,  0); // red
        }
    );

    rig.addBodyPart(
        {
            name: "ring5",
            parent: "ring4",
            originX: .2,
            originY: 0,
            originZ: -.2,

            animFunc: "transformSpine",
            animArgs: [35, .5*Math.PI]
        },
        function(armature) {
            armature.createCube( .1, 0, -.1,   .1,   .1,   .1,170,  0,  0); // red
        }
    );

    rig.addBodyPart(
        {
            name: "ring6",
            parent: "ring5",
            originX: .2,
            originY: 0,
            originZ: -.2,

            animFunc: "transformSpine",
            animArgs: [35, 0]
        },
        function(armature) {
            armature.createCube( .1, 0, -.1,   .1,   .1,   .1,130,0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );
}