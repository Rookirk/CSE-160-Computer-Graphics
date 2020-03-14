function enableUI() {
    dungeonButtons();

    lightButton();
    normalsButton();

    mouseSensitivitySlider();

    shaderSliders();
    sunSpeedSlider();
}

function dungeonButtons() {
    const dungeonWidthInput = document.getElementById('dungeonWidthInput');
    const dungeonHeightInput = document.getElementById('dungeonHeightInput');
    const dungeonRoomsInput = document.getElementById('dungeonRoomsInput');
    const dragonHeightInput = document.getElementById('dragonHeightInput');
    const dungeonGenerateButton = document.getElementById('dungeonGenerateButton');

    dungeonWidthInput.value = initValues.dungeonWidth;
    dungeonHeightInput.value = initValues.dungeonHeight;
    dungeonRoomsInput.value = initValues.dungeonRooms;
    dragonHeightInput.value = initValues.dragonHeight;

    dungeonGenerateButton.addEventListener('click', function(){
        const params = {
            width: Number(dungeonWidthInput.value),
            height: Number(dungeonHeightInput.value),
            numberOfRooms: Number(dungeonRoomsInput.value),
            dragonHeight: Number(dragonHeightInput.value)
        }
        world.buildDungeon(params);
    });
}

function lightButton() {
    const lightButton = document.getElementById('lightButton');

    if (enableLight === 1.0) {
        lightButton.value = "Light: On";
    }
    else{
        lightButton.value = "Light: Off";
    }

    lightButton.addEventListener('click', function(){
        if (enableLight === 0.0) {
            enableLight = 1.0
            lightButton.value = "Light: On";
        }
        else{
            enableLight = 0.0;
            lightButton.value = "Light: Off";
        }
        gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
    });

    gl.uniform1f(shaderVars.u_LightSwitch, enableLight);
}

function mouseSensitivitySlider() {
    const mouseSensitivitySlider = document.getElementById('mouseSensitivitySlider');
    const mouseSensitivityDisplay = document.getElementById('mouseSensitivityDisplay');

    camera.mouseSensitivity = initValues.mouseSensitivity;

    mouseSensitivitySlider.value = initValues.mouseSensitivity;
    mouseSensitivityDisplay.innerHTML = Number(mouseSensitivitySlider.value).toFixed(2);

    mouseSensitivitySlider.oninput = (ev) => {
        camera.mouseSensitivity = Number(mouseSensitivitySlider.value);
        mouseSensitivityDisplay.innerHTML = Number(mouseSensitivitySlider.value).toFixed(2);
    };
}

function normalsButton() {
    const normalsButton = document.getElementById('normalsButton');

    if (enableNormals === 1.0) {
        normalsButton.value = "Normals: On";
    }
    else{
        normalsButton.value = "Normals: Off";
    }

    normalsButton.addEventListener('click', function(){
        if (enableNormals === 0.0) {
            enableNormals = 1.0;
            normalsButton.value = "Normals: On";
        }
        else{
            enableNormals = 0.0;
            normalsButton.value = "Normals: Off";
        }
        gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
    });

    gl.uniform1f(shaderVars.u_NormalSwitch, enableNormals);
}

function shaderSliders() {
    const ambientSlider = document.getElementById('ambientSlider');
    const diffuseSlider = document.getElementById('diffuseSlider');
    const specularSlider = document.getElementById('specularSlider');

    const ambientDisplay = document.getElementById('ambientDisplay');
    const diffuseDisplay = document.getElementById('diffuseDisplay');
    const specularDisplay = document.getElementById('specularDisplay');

    gl.uniform1f(shaderVars.u_AmbientConst, initValues.ambient);
    gl.uniform1f(shaderVars.u_DiffuseConst, initValues.diffuse);
    gl.uniform1f(shaderVars.u_SpecularConst, initValues.specular);

    ambientSlider.value = initValues.ambient;
    diffuseSlider.value = initValues.diffuse;
    specularSlider.value = initValues.specular;

    ambientDisplay.innerHTML = Number(ambientSlider.value).toFixed(2);
    diffuseDisplay.innerHTML = Number(diffuseSlider.value).toFixed(2);
    specularDisplay.innerHTML = Number(specularSlider.value).toFixed(2);

    ambientSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_AmbientConst, Number(ambientSlider.value));
        ambientDisplay.innerHTML = Number(ambientSlider.value).toFixed(2);
    };
    diffuseSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_DiffuseConst, Number(diffuseSlider.value));
        diffuseDisplay.innerHTML = Number(diffuseSlider.value).toFixed(2);
    };
    specularSlider.oninput = (ev) => {
        gl.uniform1f(shaderVars.u_SpecularConst, Number(specularSlider.value));
        specularDisplay.innerHTML = Number(specularSlider.value).toFixed(2);
    };
}

function sunSpeedSlider() {
    const sunSpeedSlider = document.getElementById('sunSpeedSlider');
    const sunSpeedDisplay = document.getElementById('sunSpeedDisplay');

    sun.setRate(initValues.sunSpeed);

    sunSpeedSlider.value = initValues.sunSpeed;
    sunSpeedDisplay.innerHTML = Number(sunSpeedSlider.value).toFixed(2);

    sunSpeedSlider.oninput = (ev) => {
        sun.setRate(Number(sunSpeedSlider.value));
        sunSpeedDisplay.innerHTML = Number(sunSpeedSlider.value).toFixed(2);
    };
}