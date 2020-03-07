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
    attribute vec4 a_NormalCoord;
    attribute vec4 a_Color;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    uniform float u_NormalSwitch;

    uniform vec3 u_SunPosition;

    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;
    varying float v_NormalSwitch;
    varying vec3 v_SunPosition;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

        v_TexCoord = a_TexCoord;
        v_NormalCoord = a_NormalCoord;
        v_Color = a_Color;
        v_NormalSwitch = u_NormalSwitch;
        v_SunPosition = u_SunPosition;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform sampler2D u_Sampler;

    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;
    varying float v_NormalSwitch;
    varying vec3 v_SunPosition;

    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_Color * (1.0 - v_NormalSwitch) + v_NormalCoord * v_NormalSwitch;
    }`;

var gl;
var shaderVars = {
    a_Position: -1,
    a_TexCoord: -1,
    a_NormalCoord: -1,
    a_Color: -1,

    u_ProjMatrix: -1,
    u_ViewMatrix: -1,
    u_ModelMatrix: -1,

    u_NormalSwitch: -1,
    u_SunPosition: -1,

    u_Sampler: -1
};

var world;
var camera;
var sun;

var projMatrix;
var viewMatrix;
var modelMatrix;

var textures;

var enableInit = true;
var enableAnim = true;
var enableNormals = 0.0;

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

    initMVPMatrices(canvas);

    camera = new Camera(canvas);
    world = new World(40,40, 20);
    sun = new Sun(1,1,1);

    normalsButton();

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

    sun.rotate();

    drawGeometry();

    requestAnimationFrame(update);
}

function assignStorageLocations() {
    // Get the storage location of attributes
    assignAttribLocation('a_Position');
    assignAttribLocation('a_TexCoord');
    assignAttribLocation('a_NormalCoord');
    assignAttribLocation('a_Color');

    // Get the storage location of uniforms
    assignUniformLocation('u_ProjMatrix');
    assignUniformLocation('u_ViewMatrix');
    assignUniformLocation('u_ModelMatrix');

    assignUniformLocation('u_NormalSwitch');
    assignUniformLocation('u_SunPosition');

    assignUniformLocation('u_Sampler');
}

function assignAttribLocation(attrib){
    shaderVars[attrib] = gl.getAttribLocation(gl.program, attrib);
    if(shaderVars[attrib] < 0){
        console.log('Failed to get the storage location of ' + attrib);
        return;
    }
}

function assignUniformLocation(uniform){
    shaderVars[uniform] = gl.getUniformLocation(gl.program, uniform);
    if(!shaderVars[uniform]){
        console.log('Failed to get the storage location of ' + uniform);
        return;
    }
}

function initMVPMatrices(canvas) {
    modelMatrix = new Matrix4();
    modelMatrix.setIdentity();

    viewMatrix = new Matrix4();

    projMatrix = new Matrix4();
    projMatrix.setPerspective(60,canvas.width/canvas.height,.02,10);
    gl.uniformMatrix4fv(shaderVars.u_ProjMatrix, false, projMatrix.elements);
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
    initTexture(path, 'Wall1.png', 'wall1');
    initTexture(path, 'Debug.png', 'debug');
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
    gl.uniform1i(shaderVars.u_Sampler, unit);
}

function initVertexBuffers() {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    const totalUnits = FSIZE * 11;

    gl.vertexAttribPointer(shaderVars.a_Position, 3, gl.FLOAT, false, totalUnits, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);

    gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, totalUnits, FSIZE * 3);
    gl.enableVertexAttribArray(shaderVars.a_TexCoord);

    gl.vertexAttribPointer(shaderVars.a_NormalCoord, 3, gl.FLOAT, false, totalUnits, FSIZE * 5);
    gl.enableVertexAttribArray(shaderVars.a_NormalCoord);

    gl.vertexAttribPointer(shaderVars.a_Color, 3, gl.FLOAT, false, totalUnits, FSIZE * 8);
    gl.enableVertexAttribArray(shaderVars.a_Color);
}

function normalsButton() {
    var normalsButton = document.getElementById('normalsButton');

    normalsButton.addEventListener('click', function(){
        if(enableNormals === 0.0){
            enableNormals = 1.0;
        }
        else{
            enableNormals = 0.0;
        }
        gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
    });

    gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
}