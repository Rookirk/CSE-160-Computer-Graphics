var antlerColor = [255,213,147];
var bellyColor = [239, 219, 131];
var eyeColor = [21, 63, 46];
var finColor = [19, 84, 22];
var scaleColor = [204, 140, 20];
var armColor = [188,129,18];

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
    //rig.drawDragonTailPlume(totalSpineSegs);
    
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
        },
        function(initMatrix) {
            initMatrix.rotate(-25,1,0,0);
        },
        function(animMatrix) {
            animMatrix.transformChest(40,Math.PI);
        }
    );
    rig.drawDragonAntlers("left");
    rig.drawDragonAntlers("right");
}

Armature.prototype.drawDragonAntlers = function(side){
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
            name: prefix + "Antler1",
            parent: "Head",
            origin: [.1*scaleOrientation,.1,.1]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, 0], [.03, .03, .05], antlerColor, 6);
        },
        // [initMatrix][scale][rotate]
        function(initMatrix) {
            initMatrix.scale(1*scaleOrientation,1,1);
            initMatrix.rotate(-25,1,0,0);
            initMatrix.rotate(15,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler2",
            parent: prefix + "Antler1",
            origin: [0,0,.05]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .04], [.025, .025, .04], antlerColor, 6);
        },
        function(initMatrix) {
            initMatrix.rotate(-15,1,0,0);
            initMatrix.rotate(15,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler3",
            parent: prefix + "Antler2",
            origin: [0,0,.08]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .03], [.02, .02, .03], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(15,1,0,0);
            initMatrix.rotate(-10,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler4",
            parent: prefix + "Antler3",
            origin: [0,0,.06]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .02], [.015, .015, .02], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(15,1,0,0);
            initMatrix.rotate(-5,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler5",
            parent: prefix + "Antler4",
            origin: [0,0,.04]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .02], [.01, .01, .02], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(-15,1,0,0);
            initMatrix.rotate(-5,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler6",
            parent: prefix + "Antler5",
            origin: [0,0,.04]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .015], [.008, .008, .015], antlerColor, 3);
        },
        function(initMatrix) {
            initMatrix.rotate(-15,1,0,0);
            initMatrix.rotate(-5,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler1_1",
            parent: prefix + "Antler1",
            origin: [0,0,.05]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .035], [.02, .02, .035], antlerColor, 6);
        },
        function(initMatrix) {
            initMatrix.rotate(45,1,0,0);
            initMatrix.rotate(15,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler1_2",
            parent: prefix + "Antler1_1",
            origin: [0,0,.06]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .015], [.015, .015, .02], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(5,1,0,0);
            initMatrix.rotate(5,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler1_3",
            parent: prefix + "Antler1_2",
            origin: [0,0,.03]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .015], [.01, .01, .02], antlerColor, 3);
        },
        function(initMatrix) {
            initMatrix.rotate(5,1,0,0);
            initMatrix.rotate(5,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler3_1",
            parent: prefix + "Antler3",
            origin: [0,0,.03]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .025], [.02, .02, .03], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(35,1,0,0);
            initMatrix.rotate(-45,0,1,0);
        }
    );
    rig.addBodyPart(
        {
            name: prefix + "Antler3_2",
            parent: prefix + "Antler3_1",
            origin: [0,0,.05]
        },
        function(armature) {
            armature.createZCylinder( [0, 0, .015], [.015, .015, .015], antlerColor, 4);
        },
        function(initMatrix) {
            initMatrix.rotate(-35,1,0,0);
            initMatrix.rotate(-45,0,1,0);
        }
    );
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
            origin: [.05*scaleOrientation,0,0]
        },
        function(armature) {
            armature.createYCylinder( [0, .1, 0], [.06, .1, .06], armColor, 6);
        },
        function(initMatrix) {
            initMatrix.scale(1*scaleOrientation,1,1);
            initMatrix.rotate(90,0,0,1);
            initMatrix.rotate(-40,0,1,0); // how up the arms are
            initMatrix.rotate(-55,1,0,0); //how inward the arms are
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

Armature.prototype.drawDragonSpineSeg = function(offset, underbellyLength){
    this.createZCylinder( [0, 0, .1 + offset], [.1, .1, .1], scaleColor, 8); // Golden scales
    this.createZCylinder( [0, -.03, .1 + offset], [.08, .08, underbellyLength], bellyColor, 8); // Yellow underbelly
    this.createFin([0, .16, .1 + offset], [0, .7], [.03, .06, .1], finColor, 6); // green fin
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
            armature.drawDragonSpineSeg(0,.1);
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
                armature.drawDragonSpineSeg(0,.1);
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
            origin: [0,0,0]
        },
        function(armature) {
            armature.drawDragonSpineSeg(0,.1);
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
                armature.drawDragonSpineSeg(0,.1);
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