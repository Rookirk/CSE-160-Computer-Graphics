var modelMatrix;
var viewMatrix;
var projMatrix;

var startTime = performance.now();
var globalTime = 0;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(world.vertexArr), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, world.vertexArr.length/6);
}

function updateTime() {
    let now = performance.now();
    globalTime = now - startTime;
}