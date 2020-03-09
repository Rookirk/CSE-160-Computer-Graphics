const antlerColor = [255,213,147];
const bellyColor = [239, 219, 131];
const eyeColor = [21, 63, 46];
const finColor = [19, 84, 22];
const scaleColor = [204, 140, 20];
const armColor = [188,129,18];
const armColor2 = [173,118,17];
const armColor3 = [153,104,15];

Armature.prototype.createDragon = function(){
    this.addBodyPart(
        {
            name: "Base",
            parent: -1,
            origin: [0,0,0]
        },
        function(armature, world) {
            world.createCube([0,0,0],[0,0,0],"pixel",[1.0,1.0],[255,255,255],["empty"]);
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformBody();
        }
    );

    const totalSpineSegs = 7;
    this.drawDragonTail(totalSpineSegs);
    this.drawDragonTailPlume(totalSpineSegs);

    this.drawDragonLegs("left");
    this.drawDragonLegs("right");
    
    const totalChestSegsPerS = 4;
    this.drawDragonBody(totalChestSegsPerS);

    this.drawDragonArms("left");
    this.drawDragonArms("right");

    const lastChest = (2*totalChestSegsPerS)+1;
    this.addBodyPart(
        {
            name: "Head",
            parent: "Chest" + lastChest,
            origin: [0,0,-.3]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.16, .15, .2], "pixel", [1.0,1.0], scaleColor,6); // Skull
            world.createSphere( [0, -.08, -.15], [.1, .1, .2], "pixel", [1.0,1.0], scaleColor,6); // Snout

            world.createSphere( [.06, .03, -.16], [.02, .02, .02], "pixel", [1.0,1.0], eyeColor,6); // Eyes
            world.createSphere( [-.06, .03, -.16], [.02, .02, .02], "pixel", [1.0,1.0], eyeColor,6); // Eyes

            world.createSphere( [.05, .05, -.16], [.02, .02, .02], "pixel", [1.0,1.0], scaleColor,6); // Eyebrows
            world.createSphere( [-.05, .05, -.16], [.02, .02, .02], "pixel", [1.0,1.0], scaleColor,6); // Eyes

            armature.createDragonAntlers("left");
            armature.createDragonAntlers("right");

            world.createCone([0, .2, .07], [0, .7], [.08, .06, .1], "pixel", [1.0,1.0], finColor, 6, function(matrix){
                matrix.rotate(35,1,0,0);
            });

            armature.createDragonMane("left");
            armature.createDragonMane("right");
        },
        function(initMatrix) {
            initMatrix.rotate(-25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(40,1.25*Math.PI);
        }
    );
    //this.drawDragonAntlers("left");
    //this.drawDragonAntlers("right");
}

Armature.prototype.createDragonAntlers = function(side){
    let scaleOrientation, prefix;
    if(side === "left") scaleOrientation = 1;
    else if(side === "right") scaleOrientation = -1;
    else{
        console.log("side can only be 'left' or 'right' in drawDragonAntlers");
        return;
    }

    const transformMatrix = new Matrix4();

    // Antler1
    transformMatrix.translate(.1*scaleOrientation,.1,.1);
    transformMatrix.scale(1*scaleOrientation,1,1);
    transformMatrix.rotate(-25,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.world.createZCylinder( [0, 0, 0], [.03, .03, .05], "pixel", [1.0,1.0], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    const antler1Matrix = new Matrix4();
    antler1Matrix.set(transformMatrix);

    // Antler2
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.world.createZCylinder( [0, 0, .04], [.025, .025, .04], "pixel", [1.0,1.0], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3
    transformMatrix.translate(0,0,.08);
    transformMatrix.rotate(15,1,0,0);
    transformMatrix.rotate(-10,0,1,0);
    this.world.createZCylinder( [0, 0, .03], [.02, .02, .03], "pixel", [1.0,1.0], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    const antler3Matrix = new Matrix4();
    antler3Matrix.set(transformMatrix);

    // Antler4
    transformMatrix.translate(0,0,.06);
    transformMatrix.rotate(15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.world.createZCylinder( [0, 0, .02], [.015, .015, .02], "pixel", [1.0,1.0], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler5
    transformMatrix.translate(0,0,.04);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.world.createZCylinder( [0, 0, .02], [.01, .01, .02], "pixel", [1.0,1.0], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler6
    transformMatrix.translate(0,0,.04);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.world.createZCylinder( [0, 0, .015], [.008, .008, .015], "pixel", [1.0,1.0], antlerColor, 3, false, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_1
    transformMatrix.set(antler1Matrix);
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(45,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.world.createZCylinder( [0, 0, .035], [.02, .02, .035], "pixel", [1.0,1.0], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_2
    transformMatrix.translate(0,0,.06);
    transformMatrix.rotate(5,1,0,0);
    transformMatrix.rotate(5,0,1,0);
    this.world.createZCylinder( [0, 0, .015], [.015, .015, .02], "pixel", [1.0,1.0], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_3
    transformMatrix.translate(0,0,.03);
    transformMatrix.rotate(5,1,0,0);
    transformMatrix.rotate(5,0,1,0);
    this.world.createZCylinder( [0, 0, .015], [.01, .01, .02], "pixel", [1.0,1.0], antlerColor, 3, false, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3_1
    transformMatrix.set(antler3Matrix);
    transformMatrix.translate(0,0,.03);
    transformMatrix.rotate(35,1,0,0);
    transformMatrix.rotate(-45,0,1,0);
    this.world.createZCylinder( [0, 0, .025], [.02, .02, .03], "pixel", [1.0,1.0], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3_2
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(-35,1,0,0);
    transformMatrix.rotate(-45,0,1,0);
    this.world.createZCylinder( [0, 0, .015], [.015, .015, .015], "pixel", [1.0,1.0], antlerColor, 4, false, function(matrix){
        matrix.multiply(transformMatrix);
    });
}

Armature.prototype.drawDragonArms = function(side){
    let scaleOrientation, prefix;
    if(side === "left"){
        scaleOrientation = 1;
        prefix = "l";
    }
    else if(side === "right"){
        scaleOrientation = -1;
        prefix = "r";
    }
    else{
        console.log("side can only be 'left' or 'right' in drawDragonAntlers");
        return;
    }
    this.addBodyPart(
        {
            name: prefix + "Arm1",
            parent: "Chest2",
            origin: [.06*scaleOrientation,0,-.1]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.08, .08, .08], "pixel", [1.0,1.0], armColor, 6);
            world.createXTruncCylinder( [.1, 0, 0], [.1, .08, .08], [.1, .04, .04], "pixel", [1.0,1.0], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.scale(1*scaleOrientation,1,1);
            initMatrix.rotate(-90,1,0,0); // how up the arms are
            initMatrix.rotate(-45,0,0,1); //how inward the arms are
        },
        function(animMatrix) {
            animMatrix.transformShoulder();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Arm2",
            parent: prefix + "Arm1",
            origin: [.2,0,0]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.04, .04, .04], "pixel", [1.0,1.0], armColor, 6);
            world.createXTruncCylinder( [.1, 0, 0], [.1, .04, .04], [.1, .03, .03], "pixel", [1.0,1.0], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(90,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformElbow();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Palm",
            parent: prefix + "Arm2",
            origin: [.2,0,0]
        },
        function(armature, world) {
            world.createXTruncCylinder( [.08, 0, 0], [.08, .02, .03], [.08, .02, .06], "pixel", [1.0,1.0], armColor2, 6, true);
        },
        function(initMatrix) {
            //initMatrix.rotate(0,1,0,0); // wrist action like queen wave
            initMatrix.rotate(-45,0,0,1); // wrist action like pressing button
        },
        function(animMatrix) {
            animMatrix.transformWrist();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Index1",
            parent: prefix + "Palm",
            origin: [.14,0,.04]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "Index2",
            parent: prefix + "Index1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "Middle1",
            parent: prefix + "Palm",
            origin: [.16,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "Middle2",
            parent: prefix + "Middle1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "Ring1",
            parent: prefix + "Palm",
            origin: [.14,0,-.04]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "Ring2",
            parent: prefix + "Ring1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
}

Armature.prototype.drawDragonBody = function(totalChestSegsPerS){
    this.addBodyPart(
        {
            name: "Chest1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature, world) {
            armature.drawDragonSpineSeg(-.2,.12);
        },
        function(initMatrix) {
            //initMatrix.rotate(15,0,1,0);
            initMatrix.rotate(25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(3,.25*Math.PI);
        }
    );

    for(let i = 0; i < totalChestSegsPerS; i++){
        const currIndex = i + 2;
        const parentIndex = currIndex - 1;
        //const spineOffset = (totalChestSegsPerS-i)/totalChestSegsPerS*Math.PI;
        this.addBodyPart(
            {
                name: "Chest" + currIndex,
                parent: "Chest" + parentIndex,
                origin: [0,0,-.2]
            },
            function(armature, world) {
                armature.drawDragonSpineSeg(-.2,.12);
            },
            function(initMatrix) {
                initMatrix.rotate(35,1,0,0);
            },
            function(animMatrix) {
                animMatrix.transformChest(5,.25*Math.PI);
            }
        );
    }

    for(let i = 0; i < totalChestSegsPerS; i++){
        const currIndex = i + 6;
        const parentIndex = currIndex - 1;
        //const spineOffset = (totalChestSegsPerS-i)/totalChestSegsPerS*Math.PI;
        this.addBodyPart(
            {
                name: "Chest" + currIndex,
                parent: "Chest" + parentIndex,
                origin: [0,0,-.2]
            },
            function(armature, world) {
                armature.drawDragonSpineSeg(-.2,.1);
            },
            function(initMatrix) {
                initMatrix.rotate(-40,1,0,0);
            },
            function(animMatrix) {
                animMatrix.transformChest(-10,1.25*Math.PI);
            }
        )
    }
}

Armature.prototype.drawDragonLegs = function(side){
    let scaleOrientation, prefix;
    if(side === "left"){
        scaleOrientation = 1;
        prefix = "l";
    }
    else if(side === "right"){
        scaleOrientation = -1;
        prefix = "r";
    }
    else{
        console.log("side can only be 'left' or 'right' in drawDragonAntlers");
        return;
    }
    this.addBodyPart(
        {
            name: prefix + "Leg1",
            parent: "Tail5",
            origin: [.06*scaleOrientation,0,-.1]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.1, .1, .1], "pixel", [1.0,1.0], armColor, 6);
            world.createXTruncCylinder( [.12, 0, 0], [.12, .1, .1], [.1, .04, .04], "pixel", [1.0,1.0], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.scale(1*scaleOrientation,1,1);
            initMatrix.rotate(35,1,0,0); // how up the arms are
            initMatrix.rotate(-45,0,0,1); //how inward the arms are
        },
        function(animMatrix) {
            animMatrix.transformLegJoint();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Leg2",
            parent: prefix + "Leg1",
            origin: [.24,0,0]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.04, .04, .04], "pixel", [1.0,1.0], armColor, 6);
            world.createXTruncCylinder( [.06, 0, 0], [.06, .04, .04], [.1, .03, .03], "pixel", [1.0,1.0], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-90,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformKnee();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Leg3",
            parent: prefix + "Leg2",
            origin: [.12,0,0]
        },
        function(armature, world) {
            world.createSphere( [0, 0, 0], [.04, .04, .04], "pixel", [1.0,1.0], armColor, 6);
            world.createXTruncCylinder( [.1, 0, 0], [.1, .04, .04], [.1, .03, .03], "pixel", [1.0,1.0], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
            initMatrix.rotate(45,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformInnerKnee();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "Foot",
            parent: prefix + "Leg3",
            origin: [.2,0,0]
        },
        function(armature, world) {
            world.createXTruncCylinder( [.08, 0, 0], [.08, .02, .03], [.08, .02, .06], "pixel", [1.0,1.0], armColor2, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-120,1,0,0); // wrist action like queen wave
            initMatrix.rotate(-45,0,0,1); // wrist action like pressing button
        },
        function(animMatrix) {
            animMatrix.transformAnkle();
        }
    );
    this.addBodyPart(
        {
            name: prefix + "ToeIndex1",
            parent: prefix + "Foot",
            origin: [.14,0,.04]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "ToeIndex2",
            parent: prefix + "ToeIndex1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "ToeMiddle1",
            parent: prefix + "Foot",
            origin: [.16,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "ToeMiddle2",
            parent: prefix + "ToeMiddle1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "ToeRing1",
            parent: prefix + "Foot",
            origin: [.14,0,-.04]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .015, .015], "pixel", [1.0,1.0], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    this.addBodyPart(
        {
            name: prefix + "ToeRing2",
            parent: prefix + "ToeRing1",
            origin: [.04,0,0]
        },
        function(armature, world) {
            world.createXCylinder( [.015, 0, 0], [.025, .010, .010], "pixel", [1.0,1.0], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
}

Armature.prototype.createDragonMane = function(side){
    let scaleOrientation, prefix;
    if(side === "left") scaleOrientation = 1;
    else if(side === "right") scaleOrientation = -1;
    else{
        console.log("side can only be 'left' or 'right' in drawDragonAntlers");
        return;
    }

    this.world.createCone([0,0,0], [0, .08], [.06, .065, .1], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.055, .15, .1);
        matrix.rotate(10,1,0,0);
        matrix.rotate(-scaleOrientation*13,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1], [.06, .085, .1], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.07, .07, .18);
        matrix.rotate(35,1,0,0);
        matrix.rotate(-scaleOrientation*25,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1.3], [.05, .09, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.12, .03, .18);
        matrix.rotate(35,1,0,0);
        matrix.rotate(-scaleOrientation*55,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1.7], [.055, .085, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.13, -.05, .15);
        matrix.rotate(20,1,0,0);
        matrix.rotate(-scaleOrientation*90,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1.5], [.045, .07, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.12, -.09, .13);
        matrix.rotate(20,1,0,0);
        matrix.rotate(-scaleOrientation*110,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1.4], [.045, .065, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.1, -.12, .11);
        matrix.rotate(20,1,0,0);
        matrix.rotate(-scaleOrientation*130,0,0,1);
    });

    this.world.createCone([0,0,0], [0, 1.2], [.045, .045, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
        matrix.translate(scaleOrientation*.065, -.14, .06);
        matrix.rotate(20,1,0,0);
        matrix.rotate(-scaleOrientation*145,0,0,1);
    });
}

Armature.prototype.drawDragonSpineSeg = function(offset, underbellyLength){
    this.world.createZCylinder( [0, 0, .1 + offset], [.1, .1, .1], "pixel", [1.0,1.0], scaleColor, 8, true); // Golden scales
    this.world.createZCylinder( [0, -.03, .1 + offset], [.08, .08, underbellyLength], "pixel", [1.0,1.0], bellyColor, 8, true); // Yellow underbelly
    this.world.createCone([0, .16, .1 + offset], [0, .7], [.03, .06, .1], "pixel", [1.0,1.0], finColor, 6); // green fin
    this.world.createSphere([0, .01, 0 + offset], [.11, .11, .13], "pixel", [1.0,1.0], scaleColor, 5); // Golden scales
    this.world.createSphere([0, -.03, 0 + offset], [.08, .08, .08], "pixel", [1.0,1.0], bellyColor, 5); // yellow underbelly
}

Armature.prototype.drawDragonTruncSpineSeg = function(offset, underbellyLength, finHeight, smallerSize){
    this.world.createZTruncCylinder( [0, 0, .1 + offset], [.1, .1, .1], [.1*smallerSize, .1*smallerSize, .1*smallerSize], "pixel", [1.0,1.0], scaleColor, 8, true); // Golden scales
    this.world.createZTruncCylinder( [0, -.03, .1 + offset], [.08, .08, underbellyLength], [.08*smallerSize, .08*smallerSize, underbellyLength*smallerSize], "pixel", [1.0,1.0], bellyColor, 8, true); // Yellow underbelly
    this.world.createCone([0, finHeight, .1 + offset], [0, .7], [.03, .06, .1], "pixel", [1.0,1.0], finColor, 6); // green fin
    this.world.createSphere([0, .01, 0 + offset], [.11, .11, .13], "pixel", [1.0,1.0], scaleColor, 5); // Golden scales
    this.world.createSphere([0, -.03, 0 + offset], [.08, .08, .08], "pixel", [1.0,1.0], bellyColor, 5); // yellow underbelly
}

Armature.prototype.drawDragonTail = function(totalSpineSegs){
    const scaleFactor = .9;
    this.addBodyPart(
        {
            name: "Tail1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature, world) {
            armature.drawDragonTruncSpineSeg(0,.1, .14,scaleFactor);
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
        this.addBodyPart(
            {
                name: "Tail" + currIndex,
                parent: "Tail" + parentIndex,
                origin: [0,0,.2]
            },
            function(armature, world) {
                armature.drawDragonTruncSpineSeg(0,.1, .14,scaleFactor);
            },
            function(initMatrix) {
                initMatrix.scale(scaleFactor,scaleFactor,1);
            },
            function(animMatrix) {
                animMatrix.transformSpine(15,spineOffset);
            }
        );
    }
}

Armature.prototype.drawDragonTailPlume = function(totalSpineSegs){
    const lastTailSeg = totalSpineSegs + 1;
    this.addBodyPart(
        {
            name: "TailPlume1",
            parent: "Tail" + lastTailSeg,
            origin: [0,0,.2]
        },
        function(armature, world) {
            const underbellyLength = .1, smallerSize = 0;
            //armature.createZTruncCylinder( [0, 0, .1], [.1, .1, .1], [.1*smallerSize, .1*smallerSize, .1*smallerSize], scaleColor, 8, true); // Golden scales
            //armature.createZTruncCylinder( [0, -.03, .1], [.08, .08, underbellyLength], [.08*smallerSize, .08*smallerSize, underbellyLength*smallerSize], bellyColor, 8, true); // Yellow underbelly
            world.createSphere([0, .01, 0], [.11, .11, .13], "pixel", [1.0,1.0], scaleColor, 5); // Golden scales
            world.createSphere([0, -.03, 0], [.08, .08, .08], "pixel", [1.0,1.0], bellyColor, 5); // yellow underbelly

            const totalFins = 8;

            const transformMatrix = new Matrix4();
            for(let i = 0; i < totalFins; i++){
                transformMatrix.rotate(360/totalFins, 0,0,1);
                world.createCone([0, .13, .03], [0, 1], [.07, .13, .08], "pixel", [1.0,1.0], finColor, 6, function(matrix){
                    matrix.multiply(transformMatrix);
                });
            }

            transformMatrix.setIdentity();
            transformMatrix.rotate(180/totalFins,0,0,1);
            for(let i = 0; i < totalFins; i++){
                transformMatrix.rotate(360/totalFins, 0,0,1);
                world.createCone([0, .15, .05], [0, 1.7], [.07, .15, .1], "pixel", [1.0,1.0], finColor, 6, function(matrix){
                    matrix.multiply(transformMatrix);
                });
            }

            transformMatrix.setIdentity();
            for(let i = 0; i < totalFins; i++){
                transformMatrix.rotate(360/totalFins, 0,0,1);
                world.createCone([0, .1, .08], [0, 1.8], [.07, .1, .14], "pixel", [1.0,1.0], finColor, 6, function(matrix){
                    matrix.multiply(transformMatrix);
                });
            }

            transformMatrix.setIdentity();
            transformMatrix.translate(0,0,.25);
            transformMatrix.rotate(90,1,0,0);
            world.createCone([0, 0, 0], [0, 0], [.1, .25, .1], "pixel", [1.0,1.0], finColor, 6, function(matrix){
                matrix.multiply(transformMatrix);
            });
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(15,0);
        }
    );
}