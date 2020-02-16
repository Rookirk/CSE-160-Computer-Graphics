// Taken from: https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function linearMap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

Matrix4.prototype.transformBody = function(){
    return this.templateLevitate(.002, .35*Math.PI, [0, 1, 0], 0, .2);
}

Matrix4.prototype.transformChest = function(angle, offset) {
    return this.templateOscillate(.002, offset, [1, 0, 0], 0, angle);
}

Matrix4.prototype.transformRing1 = function() {
    return this.templateSpin(.1, [1, 0, 0]);
}

Matrix4.prototype.transformRing2 = function() {
    return this.templateSpin(.2, [0, 1, 0]);
}

Matrix4.prototype.transformShoulder = function() {
    return this.templateOscillate(.002, 0, [1, 0, 0], -45, 15);
}

Matrix4.prototype.transformElbow = function() {
    return this.templateOscillate(.002, Math.PI, [1, 1, 0], -15, 45);
}

Matrix4.prototype.transformWrist = function() {
    return this.templateOscillate(.002, 0, [1, 0, 0], -15, 15);
}

Matrix4.prototype.transformLegJoint = function() {
    return this.templateOscillate(.002, 0, [1, 0, 0], -45, 15);
}

Matrix4.prototype.transformKnee = function() {
    return this.templateOscillate(.002, Math.PI, [1, 1, 0], -50, 25);
}

Matrix4.prototype.transformInnerKnee = function() {
    return this.templateOscillate(.002, 0, [1, 0, 0], -15, 15);
}

Matrix4.prototype.transformAnkle = function() {
    return this.templateOscillate(.002, 0, [1, 0, 0], -15, 15);
}

// angle is in degrees
// offset is in time, but also in radians
Matrix4.prototype.transformSpine = function(angle, offset) {
    return this.templateOscillate(.002, offset, [1, 0, 0], -angle, angle);
}

Matrix4.prototype.templateLevitate = function(rate, offset, axis, height1, height2) {
    let x = axis[0], y = axis[1], z = axis[2];
    let influence = Math.cos(rate*globalTime + offset);
    let height = linearMap(influence, -1, 1, height2, height1);

    return this.translate(height*x,height*y,height*z);
}

Matrix4.prototype.templateOscillate = function(rate, offset, axis, angle1, angle2) {
    let x = axis[0], y = axis[1], z = axis[2];
    let influence = Math.cos(rate*globalTime + offset);
    let angle = linearMap(influence, -1, 1, angle2, angle1);

    return this.rotate(angle,x,y,z);
}

Matrix4.prototype.templateSpin = function(rate, axis){
    let x = axis[0], y = axis[1], z = axis[2];
    let angle = (rate*globalTime) % 360;
    return this.rotate(angle,x,y,z);
}

function testMatrices(value, value2){
    let part = rig.partData[0];
    part.initMatrix.setRotate(value*360,1,0,0);
    part.animMatrix.set(part.initMatrix);
}