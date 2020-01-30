// Component refers to x,y,z,r,g,b
// Vertex refers to a point in 3d space
// Triangle refers to 3 vertices
// Face refers to multiple triangles that share the same normal
// Shape refers to primitives
// Part refers to collection of parts to form a limb

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelMatrix;
    varying vec4 v_Color;
    void main() {
      gl_Position = u_ModelMatrix * a_Position;
      v_Color = a_Color;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec4 v_Color;
    void main() {
      gl_FragColor = v_Color;
    }`;

var gl;
var a_Position;
var a_Color;
var u_ModelMatrix;

var vertexArr;
var vertsPerShapeArr;
var partDataArr;

var modelMatrix;
var rotationMatrix;
var scaleMatrix;
var translateMatrix;

function main() {
    // Retrieve HTML elements
    var canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas, false);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    getStorageLocations();

    // Initialize vertex arrays
    vertexArr = [];

    initVertexBuffers();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelMatrix = new Matrix4();
    //modelMatrix.setPerspective(30, 1, 1, 100);
    //modelMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    
    rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-45,1,0,0);
    modelMatrix.multiply(rotationMatrix);

    scaleMatrix = new Matrix4();

    translateMatrix = new Matrix4();

    vertsPerShapeArr = [];
    partDataArr = [];

    let currPartIndex = 0;

    partDataArr[currPartIndex] = {
        shapeNum: 2,
        originX: 0,
        originY: 0,
        originZ: 0
    }
    createCube(   0,   0,   0,   .1,   .1,   .1,255,255,255); // white
    createCube(  .1, .25,  .1,   .1,   .1,   .1,255,255,  0); // yellow
    currPartIndex++;

    partDataArr[currPartIndex] = {
        shapeNum: 3,
        originX: .2,
        originY: .2,
        originZ: .2
    }
    createCube( -.2,  .3, -.4,   .1,   .2,  .15,  0,255,255); // cyan
    createCube(  .1,-.25, -.1,   .1,   .1,   .1,255,  0,255); // magenta
    createCube( -.3, -.1,  .2,   .1,   .1,   .1,  0,255,  0); // green
    currPartIndex++;

    update();
}

function createCube(x, y, z, l, w, h, r, g, b){
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var cubeVertices = [
        // Vertex coordinates and color
        [ 1.0,  1.0,  1.0 ],  // v0
        [-1.0,  1.0,  1.0 ],  // v1
        [-1.0, -1.0,  1.0 ],  // v2
        [ 1.0, -1.0,  1.0 ],  // v3
        [ 1.0, -1.0, -1.0 ],  // v4
        [ 1.0,  1.0, -1.0 ],  // v5
        [-1.0,  1.0, -1.0 ],  // v6
        [-1.0, -1.0, -1.0 ],  // v7
    ];

    // Indices of the vertices
    var cubeIndices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, r, g, b with appropriate transforms
        vertexArr.push( x + cubeVertices[indexVal][0] * l );
        vertexArr.push( y + cubeVertices[indexVal][1] * w );
        vertexArr.push( z + cubeVertices[indexVal][2] * h );
        vertexArr.push( r );
        vertexArr.push( g );
        vertexArr.push( b );
    }

    // cubes have 36 verts
    vertsPerShapeArr.push(36);
}

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let beginningIndex = 0; // number of vertices
    // iterate per part
    for(let i = 0; i < partDataArr.length; i++){
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArr), gl.STATIC_DRAW);

        let amountOfVerts = 0;
        // iterate through all shapes in that part
        for(let j = 0; j < partDataArr[i].shapeNum; j++){
            // obtain how many verts to draw
            amountOfVerts += vertsPerShapeArr[j];
        }
        gl.drawArrays(gl.TRIANGLES, beginningIndex, amountOfVerts);
        beginningIndex += amountOfVerts;
    }
}

function getStorageLocations() {
    // // Get the storage location of attributes
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
}

// Code used from MultiAttributeSize_Interleaved Ch. 5
function initVertexBuffers() {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // multiple times

    var FSIZE = Float32Array.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0); // multiple times // mess with params for mutliple points
    gl.enableVertexAttribArray(a_Position); // multiple times

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
}

function update() {
    rotationMatrix.setRotate(1,0,1,0);
    modelMatrix.multiply(rotationMatrix);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawGeometry();

    requestAnimationFrame(update);
}