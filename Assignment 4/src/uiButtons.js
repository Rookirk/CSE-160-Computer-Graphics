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