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

var enableInit = true;
var enableAnim = true;

function main() {
    // Retrieve HTML elements
    var canvas = document.getElementById('webgl');
    var rotationSlider = document.getElementById('rotationSlider');
    rotationSlider.oninput = function(ev) {
        globalRotation = Number(rotationSlider.value);
    }
    globalRotation = Number(rotationSlider.value);

    var testSlider = document.getElementById('testSlider');
    testSlider.oninput = function(ev) {
        testMatrices(Number(testSlider.value), Number(testSlider2.value));
    }
    var testSlider2 = document.getElementById('testSlider2');
    testSlider2.oninput = function(ev) {
        testMatrices(Number(testSlider.value), Number(testSlider2.value));
    }

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

    initVertexBuffers();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initMatrices();

    rig = new Armature();
    createDragon();

    update();
}

function update() {
    updateTime();

    if(enableAnim) rig.transformRigMatrices();
    transformModelMatrix();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawGeometry();

    requestAnimationFrame(update);
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

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var FSIZE = Float32Array.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
}