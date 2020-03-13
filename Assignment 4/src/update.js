const startTime = Date.now();
let globalTime = 0;
let delta = 0;
let lastTime = 0;

let texturesLoaded = false;
let mainFinished = false;

function checkToBeginUpdate(){
    if(mainFinished && texturesLoaded) update();
}

function update() {
    updateTime();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    sun.update();
    rig.update();
    camera.update();

    drawGeometry();

    requestAnimationFrame(update);
}

function updateTime() {
    const now = Date.now();
    lastTime = globalTime;
    globalTime = now - startTime;
    delta = globalTime - lastTime;
}