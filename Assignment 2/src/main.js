// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_TransformMatrix;
    varying vec4 v_Color;
    void main() {
      gl_Position = u_TransformMatrix * a_Position;
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

var canvas;
var gl;
var a_Position;
var a_Color;
var u_TransformMatrix;

var g_Points;
var vertices;
var transformMatrix;

function main() {
    // Retrieve HTML elements
    canvas = document.getElementById('webgl');
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
    g_Points = [];
    vertices = new Float32Array(g_Points);

    transformMatrix = new Matrix4();

    initVertexBuffers();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    createCube(0,0,0,.1,255,255,255);

    vertices = new Float32Array(g_Points);

    update(gl);
}

function createCube(x, y, z, size, r, g, b){
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
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        g_Points.push( x + cubeVertices[indexVal][0] * size );
        g_Points.push( y + cubeVertices[indexVal][1] * size );
        g_Points.push( z + cubeVertices[indexVal][2] * size );
        g_Points.push( r );
        g_Points.push( g );
        g_Points.push( b );
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
    u_TransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix');
    if (!u_TransformMatrix) {
        console.log('Failed to get the storage location of u_TransformMatrix');
        return;
    }
}

// Code ised from MultiAttributeSize_Interleaved Ch. 5
function initVertexBuffers() {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // multiple times

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0); // multiple times // mess with params for mutliple points
    gl.enableVertexAttribArray(a_Position); // multiple times

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix.elements);
}
function update() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, g_Points.length/6);

    requestAnimationFrame(update);
}