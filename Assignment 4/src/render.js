let modelMatrix;
let viewMatrix;
let projMatrix;

const startTime = performance.now();
let globalTime = 0;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(shaderVars.u_ModelMatrix, false, modelMatrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(world.vertexArr), gl.STATIC_DRAW);

    let beginningIndex = 0;
    for(let i = 0; i < world.partData.length; i++){
        let part = world.partData[i];
        // Enable texture unit0
        gl.activeTexture(gl['TEXTURE' + part.texUnit]);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, textures.texObj[part.texUnit]);

        gl.uniform1i(shaderVars.u_Sampler, part.texUnit);

        gl.drawArrays(gl.TRIANGLES, beginningIndex, part.amountOfVerts);
        beginningIndex += part.amountOfVerts;
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

function transformModelMatrix() {
    modelMatrix.setIdentity();
    modelMatrix.rotate(-15,1,0,0);
    modelMatrix.scale(.6,.6,.6);
    //modelMatrix.translate(0,-.6,.4);
    modelMatrix.rotate(25,0,1,0);
    //modelMatrix.translate(0,0,-.4);
}

function updateTime() {
    let now = performance.now();
    globalTime = now - startTime;
}