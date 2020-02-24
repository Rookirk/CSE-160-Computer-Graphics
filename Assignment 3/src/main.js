// Component refers to x,y,z,r,g,b
// Vertex refers to a point in 3d space
// Triangle refers to 3 vertices
// Face refers to multiple triangles that share the same normal
// Shape refers to primitives
// Part refers to collection of parts to form a limb

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Color;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    varying vec4 v_Color;
    varying vec2 v_TexCoord;

    void main() {
      gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
      v_TexCoord = a_TexCoord;
      v_Color = a_Color;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform sampler2D u_Sampler;

    varying vec4 v_Color;
    varying vec2 v_TexCoord;

    void main() {
      gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_Color;
    }`;

var gl;
var a_Position;
var a_Color;
var a_TexCoord;

var u_ProjMatrix;
var u_ViewMatrix;
var u_ModelMatrix;
var u_Sampler;

var world;
var camera;

var projMatrix;
var viewMatrix;
var modelMatrix;

var textures;

var enableInit = true;
var enableAnim = true;

function main() {
    // Retrieve HTML elements
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas, false);
    if(!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    assignStorageLocations();

    initAllTextures();

    initVertexBuffers();

    world = new World(5,5);

    initMVPMatrices(canvas);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    update();
}

function update() {
    updateTime();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawGeometry();

    requestAnimationFrame(update);
}

function assignStorageLocations() {
    // Get the storage location of attributes
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if(a_TexCoord < 0){
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }

    // Get the storage location of uniforms
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if(!u_ProjMatrix) {
        console.log('Failed to get the storage location of u_ProjMatrix');
        return;
    }
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if(!u_Sampler){
        console.log('Failed to get the storage location of u_Sampler');
        return;
    }
}

function initMVPMatrices(canvas) {
    modelMatrix = new Matrix4();
    modelMatrix.setIdentity();

    viewMatrix = new Matrix4();
    camera.setNewCameraPosition();

    projMatrix = new Matrix4();
    projMatrix.setPerspective(60,canvas.width/canvas.height,.02,10);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
}

function initAllTextures() {
    const path = "img/";
    textures = {
        currUnit: 0,
        indexNames: new Object(),
        texObj: [],
        imgObj: []
    }
    initTexture(path, 'WhitePixel.png', 'pixel');
    initTexture(path, 'Ground.png', 'ground');
    initTexture(path, 'Debug.png', 'debug');
    console.log(textures);
}

function initTexture(path, file, indexName, textureParams) {
    let texture = gl.createTexture();
    if(!texture){
        console.log('Failed to create the texture object');
        return;
    }

    let image = new Image();
    if(!image){
        console.log('Failed to create the image object');
        return;
    }

    const unit = textures.currUnit;
    textures.indexNames[indexName] = unit;
    textures.currUnit++;

    image.onload = function(){
        loadTexture(texture, image, unit, textureParams);
    };
    image.src = path + file;

    textures.texObj[unit] = texture;
    textures.imgObj[unit] = image;
}

function loadTexture(texture, image, unit, textureParams){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

    // Enable texture unit0
    gl.activeTexture(gl['TEXTURE' + unit]);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    if(typeof textureParams === "function"){
        textureParams();
    }
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit to the sampler
    gl.uniform1i(u_Sampler, unit);
}

function initVertexBuffers() {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    const totalUnits = FSIZE * 8;

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, totalUnits, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, totalUnits, FSIZE * 3);
    gl.enableVertexAttribArray(a_TexCoord);

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, totalUnits, FSIZE * 5);
    gl.enableVertexAttribArray(a_Color);
}