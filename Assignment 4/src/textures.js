function initAllTextures() {
    const path = "img/";
    textures = {
        totalTextures: 4,
        currTexAmount: 0,

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
    const texture = gl.createTexture();
    if(!texture){
        console.log('Failed to create the texture object');
        return;
    }

    const image = new Image();
    if(!image){
        console.log('Failed to create the image object');
        return;
    }

    const unit = textures.currUnit;
    textures.indexNames[indexName] = unit;
    textures.currUnit++;

    image.onload = function(){
        loadTexture(texture, image, unit, textureParams);
        textures.currTexAmount++;
        if(textures.currTexAmount == textures.totalTextures){
            texturesLoaded = true;
            checkToBeginUpdate();
        }
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