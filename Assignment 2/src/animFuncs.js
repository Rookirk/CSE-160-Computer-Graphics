// Taken from: https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function linearMap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

Matrix4.prototype.transformRing1 = function() {
    return this.templateSpin(.1, 1, 0, 0);
}

Matrix4.prototype.transformRing2 = function() {
    return this.templateSpin(.2, 0, 1, 0);
}

// angle is in degrees
// offset is in time, but also in radians
Matrix4.prototype.transformSpine = function(angle, offset) {
    return this.templateOscillate(.002, offset, 1, 0, 0, -angle, angle);
}

Matrix4.prototype.templateOscillate = function(rate, offset, x, y, z, angle1, angle2) {
    let influence = Math.cos(rate*globalTime + offset);
    let angle = linearMap(influence, -1, 1, angle2, angle1);

    return this.rotate(angle,x,y,z);
}

Matrix4.prototype.templateSpin = function(rate, x, y, z){
    let angle = (rate*globalTime) % 360;
    return this.rotate(angle,x,y,z);
}

function testMatrices(value, value2){
    /*let part = partData[1];
    let mat = partData[1].initMatrix;
    mat.setTranslate(part.origin[0],part.origin[1],part.origin[2]);
    mat.rotate(value*360,1,0,0);
    mat.translate(-part.origin[0],-part.origin[1],-part.origin[2]);*/

    let part2 = partData[2];
    let mat2 = partData[2].animMatrix;
    /*mat2.set(part2.initMatrix);
    mat2.translate(part2.origin[0],part2.origin[1],part2.origin[2]);
    mat2.rotate(value*360,1,0,0);
    mat2.translate(-part2.origin[0],-part2.origin[1],-part2.origin[2]);*/

    let part3 = partData[3];
    let mat3 = partData[3].animMatrix;
    mat3.set(partData[part3.parentIndex].initMatrix);
    mat3.multiply(part2.animMatrix);
    mat3.translate(part3.origin[0],part3.origin[1],part3.origin[2]);
    mat3.rotate(value2*360,0,1,0);
    mat3.translate(-part3.origin[0],-part3.origin[1],-part3.origin[2]);
}