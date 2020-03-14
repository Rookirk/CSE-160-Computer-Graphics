let modelMatrix;
let viewMatrix;
let projMatrix;

function drawGeometry() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelMatrix.setIdentity();

    gl.uniformMatrix4fv(shaderVars.u_ModelMatrix, false, modelMatrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(world.vertexArr), gl.STATIC_DRAW);

    let beginningIndex = 0;
    let rigIndex = 0;
    let rigPartCounter = 0;
    for(let i = 0; i < world.partData.length; i++){
        if(i === rig.beginIndex){
            world.drawingRig = true;
        }

        const part = world.partData[i];
        // Enable texture unit0
        gl.activeTexture(gl['TEXTURE' + part.texUnit]);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, textures.texObj[part.texUnit]);

        gl.uniform1i(shaderVars.u_Sampler, part.texUnit);

        if(world.drawingRig === true){
            const rigPart = rig.partData[rigIndex];
            if(rigPartCounter === 0)
                gl.uniformMatrix4fv(shaderVars.u_ModelMatrix, false, rigPart.animMatrix.elements);

            rigPartCounter++;

            if(rigPartCounter >= rigPart.totalShapes){
                rigPartCounter = 0;
                rigIndex++;
            }
            if(i === rig.endIndex){
                world.drawingRig = false;
                modelMatrix.setIdentity();
                gl.uniformMatrix4fv(shaderVars.u_ModelMatrix, false, modelMatrix.elements);
            }
        }

        gl.drawArrays(gl.TRIANGLES, beginningIndex, part.amountOfVerts);
        beginningIndex += part.amountOfVerts;
    }
}

function initMVPMatrices(canvas) {
    modelMatrix = new Matrix4();
    modelMatrix.setIdentity();

    viewMatrix = new Matrix4();

    projMatrix = new Matrix4();
    projMatrix.setPerspective(60,canvas.width/canvas.height,.02,20);
    gl.uniformMatrix4fv(shaderVars.u_ProjMatrix, false, projMatrix.elements);
}