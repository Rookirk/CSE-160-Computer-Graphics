// Component refers to x,y,z,r,g,b
// Vertex refers to a point in 3d space
// Triangle refers to 3 vertices
// Face refers to multiple triangles that share the same normal
// Shape refers to primitives
// Part refers to collection of parts to form a limb

let gl;

let world;
let camera;
let sun;
let rig;

let textures;

const enableInit = true;
const enableAnim = true;
let enableNormals = 0.0;
let enableLight = 1.0;

let texturesLoaded = false;
let mainFinished = false;

function main() {
    // Retrieve HTML elements
    const canvas = document.getElementById('webgl');

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
    sun = new Sun( [0.0,0.0,0.0], 10, 1, [255,255,255] );

    normalsButton();
    lightButton();
    shaderSliders();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mainFinished = true;
    rig.update();
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
    rig.update();

    drawGeometry();

    requestAnimationFrame(update);
}

function normalsButton() {
    const normalsButton = document.getElementById('normalsButton');

    normalsButton.addEventListener('click', function(){
        (enableNormals === 0.0) ? enableNormals = 1.0 : enableNormals = 0.0;
        gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
    });

    gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
}

function lightButton() {
    const lightButton = document.getElementById('lightButton');

    lightButton.addEventListener('click', function(){
        (enableLight === 0.0) ? enableLight = 1.0 : enableLight = 0.0;
        gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
    });

    gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
}

function shaderSliders() {
    const ambientSlider = document.getElementById('ambientSlider');
    const diffuseSlider = document.getElementById('diffuseSlider');
    const specularSlider = document.getElementById('specularSlider');

    gl.uniform1f(shaderVars.u_AmbientConst, Number(ambientSlider.value));
    gl.uniform1f(shaderVars.u_DiffuseConst, Number(diffuseSlider.value));
    gl.uniform1f(shaderVars.u_SpecularConst, Number(specularSlider.value));

    ambientSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_AmbientConst, Number(ambientSlider.value));
        //redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
    diffuseSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_DiffuseConst, Number(diffuseSlider.value));
        //redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
    specularSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_SpecularConst, Number(specularSlider.value));
        //redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
}