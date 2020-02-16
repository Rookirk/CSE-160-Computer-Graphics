var antlerColor = [255,213,147];
var bellyColor = [239, 219, 131];
var eyeColor = [21, 63, 46];
var finColor = [19, 84, 22];
var scaleColor = [204, 140, 20];
var armColor = [188,129,18];
var armColor2 = [173,118,17];
var armColor3 = [153,104,15];

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
    rig.drawDragonTailPlume(totalSpineSegs);

    rig.drawDragonLegs("left");
    rig.drawDragonLegs("right");
    
    let totalChestSegsPerS = 4;
    rig.drawDragonBody(totalChestSegsPerS);

    rig.drawDragonArms("left");
    rig.drawDragonArms("right");

    let lastChest = (2*totalChestSegsPerS)+1;
    rig.addBodyPart(
        {
            name: "Head",
            parent: "Chest" + lastChest,
            origin: [0,0,-.3]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.16, .15, .2], scaleColor,6); // Skull
            armature.createSphere( [0, -.08, -.15], [.1, .1, .2], scaleColor,6); // Snout

            armature.createSphere( [.06, .03, -.16], [.02, .02, .02], eyeColor,6); // Eyes
            armature.createSphere( [-.06, .03, -.16], [.02, .02, .02], eyeColor,6); // Eyes

            armature.createSphere( [.05, .05, -.16], [.02, .02, .02], scaleColor,6); // Eyebrows
            armature.createSphere( [-.05, .05, -.16], [.02, .02, .02], scaleColor,6); // Eyes

            armature.createDragonAntlers("left");
            armature.createDragonAntlers("right");
        },
        function(initMatrix) {
            initMatrix.rotate(-25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(40,Math.PI);
        }
    );
    //rig.drawDragonAntlers("left");
    //rig.drawDragonAntlers("right");
}

Armature.prototype.createDragonAntlers = function(side){
    let scaleOrientation, prefix;
    if(side === "left") scaleOrientation = 1;
    else if(side === "right") scaleOrientation = -1;
    else{
        console.log("side can only be 'left' or 'right' in drawDragonAntlers");
        return;
    }

    let transformMatrix = new Matrix4();

    // Antler1
    transformMatrix.translate(.1*scaleOrientation,.1,.1);
    transformMatrix.scale(1*scaleOrientation,1,1);
    transformMatrix.rotate(-25,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.createZCylinder( [0, 0, 0], [.03, .03, .05], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    const antler1Matrix = new Matrix4();
    antler1Matrix.set(transformMatrix);

    // Antler2
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.createZCylinder( [0, 0, .04], [.025, .025, .04], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3
    transformMatrix.translate(0,0,.08);
    transformMatrix.rotate(15,1,0,0);
    transformMatrix.rotate(-10,0,1,0);
    this.createZCylinder( [0, 0, .03], [.02, .02, .03], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    const antler3Matrix = new Matrix4();
    antler3Matrix.set(transformMatrix);

    // Antler4
    transformMatrix.translate(0,0,.06);
    transformMatrix.rotate(15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.createZCylinder( [0, 0, .02], [.015, .015, .02], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler5
    transformMatrix.translate(0,0,.04);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.createZCylinder( [0, 0, .02], [.01, .01, .02], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler6
    transformMatrix.translate(0,0,.04);
    transformMatrix.rotate(-15,1,0,0);
    transformMatrix.rotate(-5,0,1,0);
    this.createZCylinder( [0, 0, .015], [.008, .008, .015], antlerColor, 3, false, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_1
    transformMatrix.set(antler1Matrix);
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(45,1,0,0);
    transformMatrix.rotate(15,0,1,0);
    this.createZCylinder( [0, 0, .035], [.02, .02, .035], antlerColor, 6, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_2
    transformMatrix.translate(0,0,.06);
    transformMatrix.rotate(5,1,0,0);
    transformMatrix.rotate(5,0,1,0);
    this.createZCylinder( [0, 0, .015], [.015, .015, .02], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler1_3
    transformMatrix.translate(0,0,.03);
    transformMatrix.rotate(5,1,0,0);
    transformMatrix.rotate(5,0,1,0);
    this.createZCylinder( [0, 0, .015], [.01, .01, .02], antlerColor, 3, false, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3_1
    transformMatrix.set(antler3Matrix);
    transformMatrix.translate(0,0,.03);
    transformMatrix.rotate(35,1,0,0);
    transformMatrix.rotate(-45,0,1,0);
    this.createZCylinder( [0, 0, .025], [.02, .02, .03], antlerColor, 4, true, function(matrix){
        matrix.multiply(transformMatrix);
    });

    // Antler3_2
    transformMatrix.translate(0,0,.05);
    transformMatrix.rotate(-35,1,0,0);
    transformMatrix.rotate(-45,0,1,0);
    this.createZCylinder( [0, 0, .015], [.015, .015, .015], antlerColor, 4, false, function(matrix){
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
    rig.addBodyPart(
        {
            name: prefix + "Arm1",
            parent: "Chest2",
            origin: [.06*scaleOrientation,0,-.1]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.08, .08, .08], armColor, 6);
            armature.createXTruncCylinder( [.1, 0, 0], [.1, .08, .08], [.1, .04, .04], armColor, 6, true);
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
    rig.addBodyPart(
        {
            name: prefix + "Arm2",
            parent: prefix + "Arm1",
            origin: [.2,0,0]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.04, .04, .04], armColor, 6);
            armature.createXTruncCylinder( [.1, 0, 0], [.1, .04, .04], [.1, .03, .03], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(90,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformElbow();
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Palm",
            parent: prefix + "Arm2",
            origin: [.2,0,0]
        },
        function(armature) {
            armature.createXTruncCylinder( [.08, 0, 0], [.08, .02, .03], [.08, .02, .06], armColor2, 6, true);
        },
        function(initMatrix) {
            //initMatrix.rotate(0,1,0,0); // wrist action like queen wave
            initMatrix.rotate(-45,0,0,1); // wrist action like pressing button
        },
        function(animMatrix) {
            animMatrix.transformWrist();
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Index1",
            parent: prefix + "Palm",
            origin: [.14,0,.04]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "Index2",
            parent: prefix + "Index1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "Middle1",
            parent: prefix + "Palm",
            origin: [.16,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "Middle2",
            parent: prefix + "Middle1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "Ring1",
            parent: prefix + "Palm",
            origin: [.14,0,-.04]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "Ring2",
            parent: prefix + "Ring1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
}

Armature.prototype.drawDragonBody = function(totalChestSegsPerS){
    rig.addBodyPart(
        {
            name: "Chest1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.drawDragonSpineSeg(-.2,.12);
        },
        function(initMatrix) {
            //initMatrix.rotate(15,0,1,0);
            initMatrix.rotate(25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(2,0);
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
                armature.drawDragonSpineSeg(-.2,.12);
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
                armature.drawDragonSpineSeg(-.2,.1);
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
    rig.addBodyPart(
        {
            name: prefix + "Leg1",
            parent: "Tail5",
            origin: [.06*scaleOrientation,0,-.1]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.1, .1, .1], armColor, 6);
            armature.createXTruncCylinder( [.12, 0, 0], [.12, .1, .1], [.1, .04, .04], armColor, 6, true);
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
    rig.addBodyPart(
        {
            name: prefix + "Leg2",
            parent: prefix + "Leg1",
            origin: [.24,0,0]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.04, .04, .04], armColor, 6);
            armature.createXTruncCylinder( [.06, 0, 0], [.06, .04, .04], [.1, .03, .03], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-90,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformKnee();
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Leg3",
            parent: prefix + "Leg2",
            origin: [.12,0,0]
        },
        function(armature) {
            armature.createSphere( [0, 0, 0], [.04, .04, .04], armColor, 6);
            armature.createXTruncCylinder( [.1, 0, 0], [.1, .04, .04], [.1, .03, .03], armColor, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
            initMatrix.rotate(45,0,1,0); // how up the arms are
        },
        function(animMatrix) {
            animMatrix.transformInnerKnee();
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Foot",
            parent: prefix + "Leg3",
            origin: [.2,0,0]
        },
        function(armature) {
            armature.createXTruncCylinder( [.08, 0, 0], [.08, .02, .03], [.08, .02, .06], armColor2, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-120,1,0,0); // wrist action like queen wave
            initMatrix.rotate(-45,0,0,1); // wrist action like pressing button
        },
        function(animMatrix) {
            animMatrix.transformAnkle();
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeIndex1",
            parent: prefix + "Foot",
            origin: [.14,0,.04]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeIndex2",
            parent: prefix + "ToeIndex1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeMiddle1",
            parent: prefix + "Foot",
            origin: [.16,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeMiddle2",
            parent: prefix + "ToeMiddle1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeRing1",
            parent: prefix + "Foot",
            origin: [.14,0,-.04]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .015, .015], armColor3, 6, true);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
    rig.addBodyPart(
        {
            name: prefix + "ToeRing2",
            parent: prefix + "ToeRing1",
            origin: [.04,0,0]
        },
        function(armature) {
            armature.createXCylinder( [.015, 0, 0], [.025, .010, .010], armColor3, 6, false);
        },
        function(initMatrix) {
            initMatrix.rotate(-45,0,0,1);
        },
        function(animMatrix) {}
    );
}

Armature.prototype.drawDragonSpineSeg = function(offset, underbellyLength){
    this.createZCylinder( [0, 0, .1 + offset], [.1, .1, .1], scaleColor, 8, true); // Golden scales
    this.createZCylinder( [0, -.03, .1 + offset], [.08, .08, underbellyLength], bellyColor, 8, true); // Yellow underbelly
    this.createFin([0, .16, .1 + offset], [0, .7], [.03, .06, .1], finColor, 6); // green fin
    this.createSphere([0, .01, 0 + offset], [.11, .11, .13], scaleColor, 5); // Golden scales
    this.createSphere([0, -.03, 0 + offset], [.08, .08, .08], bellyColor, 5); // yellow underbelly
}

Armature.prototype.drawDragonTruncSpineSeg = function(offset, underbellyLength, finHeight, smallerSize){
    this.createZTruncCylinder( [0, 0, .1 + offset], [.1, .1, .1], [.1*smallerSize, .1*smallerSize, .1*smallerSize], scaleColor, 8, true); // Golden scales
    this.createZTruncCylinder( [0, -.03, .1 + offset], [.08, .08, underbellyLength], [.08*smallerSize, .08*smallerSize, underbellyLength*smallerSize], bellyColor, 8, true); // Yellow underbelly
    this.createFin([0, finHeight, .1 + offset], [0, .7], [.03, .06, .1], finColor, 6); // green fin
    this.createSphere([0, .01, 0 + offset], [.11, .11, .13], scaleColor, 5); // Golden scales
    this.createSphere([0, -.03, 0 + offset], [.08, .08, .08], bellyColor, 5); // yellow underbelly
}

Armature.prototype.drawDragonTail = function(totalSpineSegs){
    rig.addBodyPart(
        {
            name: "Tail1",
            parent: "Base",
            origin: [0,0,0]
        },
        function(armature) {
            armature.drawDragonTruncSpineSeg(0,.1, .14,.85);
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
                name: "Tail" + currIndex,
                parent: "Tail" + parentIndex,
                origin: [0,0,.2]
            },
            function(armature) {
                armature.drawDragonTruncSpineSeg(0,.1, .14,.85);
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

Armature.prototype.drawDragonTailPlume = function(totalSpineSegs){
    let lastTailSeg = totalSpineSegs + 1;
    rig.addBodyPart(
        {
            name: "TailPlume1",
            parent: "Tail" + lastTailSeg,
            origin: [0,0,.2]
        },
        function(armature) {
            armature.drawDragonTruncSpineSeg(0,.1, .04,0);
        },
        function(initMatrix) {},
        function(animMatrix) {
            animMatrix.transformSpine(15,0);
        }
    );
}