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
            armature.createCube(  .2,  .2,  .2,   .1,   .1,   .1,255,255,  0); // yellow
            armature.createCube( -.2,  .2, -.2,   .1,   .1,   .1,  0,255,255); // cyan
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

            animFunc: -1
        },
        function(armature) {
            armature.createSphere(  .2, -.2, -.2,   .1,   .1,   .1,255,  0,255, 10); // magenta
            armature.createXCylinder( -.2, -.2,  .2,   .1,   .1,   .1,  0,255,  0, 10); // green
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring3",
            parent: "ring2",
            originX: .3,
            originY: -.2,
            originZ: -.3,

            animFunc: "transformSpine",
            animArgs: [35, 1.5*Math.PI]
        },
        function(armature) {
            armature.createCube(  .4, -.2, -.4,   .1,   .1,   .1,255,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring4",
            parent: "ring3",
            originX: .5,
            originY: -.2,
            originZ: -.5,

            animFunc: "transformSpine",
            animArgs: [35, Math.PI]
        },
        function(armature) {
            armature.createCube(  .6, -.2, -.6,   .1,   .1,   .1,210,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring5",
            parent: "ring4",
            originX: .7,
            originY: -.2,
            originZ: -.7,

            animFunc: "transformSpine",
            animArgs: [35, .5*Math.PI]
        },
        function(armature) {
            armature.createCube(  .8, -.2, -.8,   .1,   .1,   .1,170,  0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );

    rig.addBodyPart(
        {
            name: "ring6",
            parent: "ring5",
            originX: .9,
            originY: -.2,
            originZ: -.9,

            animFunc: "transformSpine",
            animArgs: [35, 0]
        },
        function(armature) {
            armature.createCube(  1, -.2, -1,   .1,   .1,   .1,130,0,  0); // red
        },
        function(initMatrix) {
            initMatrix.rotate(0,0,1,0);
        }
    );
}