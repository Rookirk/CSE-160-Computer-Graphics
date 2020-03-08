// Component refers to x,y,z,r,g,b
// Vertex refers to a point in 3d space
// Triangle refers to 3 vertices
// Face refers to multiple triangles that share the same normal
// Shape refers to primitives
// Part refers to collection of parts to form a limb

var gl;

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
var enableLight = 1.0;

var texturesLoaded = false;
var mainFinished = false;

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
    world = new World(20,20, 15);
    sun = new Sun( [0.0,0.0,0.0], 10, 5, [255,255,255] );

    normalsButton();
    lightButton();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mainFinished = true;
    checkToBeginUpdate();
}

function checkToBeginUpdate(){
    if(mainFinished && texturesLoaded) update();
}

function update() {
    updateTime();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    sun.update();

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
    assignUniformLocation('u_LightSwitch');

    assignUniformLocation('u_SunPosition');
    assignUniformLocation('u_SunColor');

    assignUniformLocation('u_CameraPosition');

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

function lightButton() {
    var lightButton = document.getElementById('lightButton');

    lightButton.addEventListener('click', function(){
        if(enableLight === 0.0){
            enableLight = 1.0;
        }
        else{
            enableLight = 0.0;
        }
        gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
    });

    gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
}