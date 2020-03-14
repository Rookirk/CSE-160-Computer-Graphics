function enableUI() {
    normalsButton();
    lightButton();
    shaderSliders();
    sunSpeedSlider();
    mouseSensitivitySlider();

    dungeonButtons();
}

function dungeonButtons() {
    const dungeonWidthInput = document.getElementById('dungeonWidthInput');
    const dungeonHeightInput = document.getElementById('dungeonHeightInput');
    const dungeonRoomsInput = document.getElementById('dungeonRoomsInput');
    const dungeonGenerateButton = document.getElementById('dungeonGenerateButton');

    dungeonWidthInput.value = initValues.dungeonWidth;
    dungeonHeightInput.value = initValues.dungeonHeight;
    dungeonRoomsInput.value = initValues.dungeonRooms;

    dungeonGenerateButton.addEventListener('click', function(){
        const params = {
            width: Number(dungeonWidthInput.value),
            height: Number(dungeonHeightInput.value),
            numberOfRooms: Number(dungeonRoomsInput.value)
        }
        world.buildDungeon(params);
    });
}

function lightButton() {
    const lightButton = document.getElementById('lightButton');

    lightButton.addEventListener('click', function(){
        (enableLight === 0.0) ? enableLight = 1.0 : enableLight = 0.0;
        gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
    });

    gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
}

function mouseSensitivitySlider() {
    const mouseSensitivitySlider = document.getElementById('mouseSensitivitySlider');

    camera.mouseSensitivity = initValues.mouseSensitivity;

    mouseSensitivitySlider.value = initValues.mouseSensitivity;

    mouseSensitivitySlider.oninput = (ev) => {
        camera.mouseSensitivity = Number(mouseSensitivitySlider.value);
        //redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
}

function normalsButton() {
    const normalsButton = document.getElementById('normalsButton');

    normalsButton.addEventListener('click', function(){
        (enableNormals === 0.0) ? enableNormals = 1.0 : enableNormals = 0.0;
        gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
    });

    gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
}

function shaderSliders() {
    const ambientSlider = document.getElementById('ambientSlider');
    const diffuseSlider = document.getElementById('diffuseSlider');
    const specularSlider = document.getElementById('specularSlider');

    gl.uniform1f(shaderVars.u_AmbientConst, initValues.ambient);
    gl.uniform1f(shaderVars.u_DiffuseConst, initValues.diffuse);
    gl.uniform1f(shaderVars.u_SpecularConst, initValues.specular);

    ambientSlider.value = initValues.ambient;
    diffuseSlider.value = initValues.diffuse;
    specularSlider.value = initValues.specular;

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

function sunSpeedSlider() {
    const sunSpeedSlider = document.getElementById('sunSpeedSlider');

    sun.setRate(initValues.sunSpeed);

    sunSpeedSlider.value = initValues.sunSpeed;

    sunSpeedSlider.oninput = (ev) => {
        sun.setRate(Number(sunSpeedSlider.value));
        //redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
}