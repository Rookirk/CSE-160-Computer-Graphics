// Component refers to x,y,z,r,g,b
// Vertex refers to a point in 3d space
// Triangle refers to 3 vertices
// Face refers to multiple triangles that share the same normal
// Shape refers to primitives
// Part refers to collection of parts to form a limb

// Vertex shader program
var VDEFAULT_SHADER = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Color;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    varying vec2 v_TexCoord;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_TexCoord = a_TexCoord;
        v_Color = a_Color;
    }`;

// Fragment shader program
var FDEFAULT_SHADER = `
    precision mediump float;

    uniform sampler2D u_Sampler;

    varying vec2 v_TexCoord;
    varying vec4 v_Color;

    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_Color;
    }`;

var VNORMAL_SHADER = `
    attribute vec4 a_Position;
    attribute vec4 a_NormalCoord;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    varying vec4 v_NormalCoord;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_NormalCoord = a_NormalCoord;
    }`;

// Fragment shader program
var FNORMAL_SHADER = `
    precision mediump float;

    varying vec4 v_NormalCoord;

    void main() {
        gl_FragColor = v_NormalCoord;
    }`;

var gl;
var programs = {
    default: -1,
    normal: -1
}
var currProgram = "default";

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
    initAllShaders();

    assignStorageLocations();

    initAllTextures();

    initVertexBuffers();

    initMVPMatrices(canvas);

    camera = new Camera(canvas);
    world = new World(40,40, 20);

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

    drawGeometry();

    requestAnimationFrame(update);
}

function initAllShaders() {
    /*if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }*/
    programs.default = createProgram(gl, VDEFAULT_SHADER, FDEFAULT_SHADER);
    if(!programs.default){
        console.log('Failed to intialize default shader.');
        return;
    }
    programs.normal = createProgram(gl, VNORMAL_SHADER, FNORMAL_SHADER);
    if(!programs.normal){
        console.log('Failed to intialize normal shader.');
        return;
    }

    gl.useProgram(programs[currProgram]);
}

function assignStorageLocations() {
    // Get the storage location of attributes
    assignAttribLocation('default', 'a_Position');
    assignAttribLocation('default', 'a_TexCoord');
    assignAttribLocation('default', 'a_Color');

    // Get the storage location of uniforms
    assignUniformLocation('default', 'u_ProjMatrix');
    assignUniformLocation('default', 'u_ViewMatrix');
    assignUniformLocation('default', 'u_ModelMatrix');
    assignUniformLocation('default', 'u_Sampler');

    // Get the storage location of attributes
    assignAttribLocation('normal', 'a_Position');
    assignAttribLocation('normal', 'a_NormalCoord');

    // Get the storage location of uniforms
    assignUniformLocation('normal', 'u_ProjMatrix');
    assignUniformLocation('normal', 'u_ViewMatrix');
    assignUniformLocation('normal', 'u_ModelMatrix');
}

function assignAttribLocation(program, attrib){
    programs[program][attrib] = gl.getAttribLocation(programs[program], attrib);
    if(programs[program][attrib] < 0){
        console.log('Failed to get the storage location of ' + program + '.' + attrib);
        return;
    }
}

function assignUniformLocation(program, uniform){
    programs[program][uniform] = gl.getUniformLocation(programs[program], uniform);
    if(!programs[program][uniform]){
        console.log('Failed to get the storage location of ' + program + '.' + uniform);
        return;
    }
}

function initMVPMatrices(canvas) {
    modelMatrix = new Matrix4();
    modelMatrix.setIdentity();

    viewMatrix = new Matrix4();

    projMatrix = new Matrix4();
    projMatrix.setPerspective(60,canvas.width/canvas.height,.02,10);
    gl.uniformMatrix4fv(programs.default.u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(programs.normal.u_ProjMatrix, false, projMatrix.elements);
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
    gl.uniform1i(programs.default.u_Sampler, unit);
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

    const defaultProg = programs.default;

    gl.vertexAttribPointer(defaultProg .a_Position, 3, gl.FLOAT, false, totalUnits, 0);
    gl.enableVertexAttribArray(defaultProg .a_Position);

    gl.vertexAttribPointer(defaultProg .a_TexCoord, 2, gl.FLOAT, false, totalUnits, FSIZE * 3);
    gl.enableVertexAttribArray(defaultProg .a_TexCoord);

    gl.vertexAttribPointer(defaultProg .a_Color, 3, gl.FLOAT, false, totalUnits, FSIZE * 8);
    gl.enableVertexAttribArray(defaultProg .a_Color);

    const normalProg  = programs.normal;

    gl.vertexAttribPointer(normalProg .a_Position, 3, gl.FLOAT, false, totalUnits, 0);
    gl.enableVertexAttribArray(normalProg .a_Position);

    gl.vertexAttribPointer(normalProg .a_NormalCoord, 2, gl.FLOAT, false, totalUnits, FSIZE * 5);
    gl.enableVertexAttribArray(normalProg .a_NormalCoord);
}

function normalsButton() {
    var normalsButton = document.getElementById('normalsButton');

    normalsButton.addEventListener('click', function(){
        if(currProgram === "default"){
            gl.useProgram(programs.normal);
            currProgram = "normal";
        }
        else if(currProgram === "normal"){
            gl.useProgram(programs.default);
            currProgram = "default";
        }
        else{
            console.log(currProgram + " is not a valid program");
        }
    });
}