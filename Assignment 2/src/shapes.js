Armature.prototype.pushShape = function(){
    
}

Armature.prototype.pushVert = function(x,y,z,r,g,b){
    this.vertexArr.push( x );
    this.vertexArr.push( y );
    this.vertexArr.push( z );
    this.vertexArr.push( r/255 );
    this.vertexArr.push( g/255 );
    this.vertexArr.push( b/255 );
}

transformVert = function(vertex, transformMatrix){
    let oldVertex = new Vector3([vertex[0], vertex[1], vertex[2]]);
    let newMatrix = new Matrix4();
    newMatrix.set(transformMatrix);
    return newMatrix.multiplyVector3(oldVertex);
}

Armature.prototype.createCube = function(coords, size, color, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCubeVertices(coords, size);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();

        if(typeof transformFunc === "function"){
            let newMatrix = transformFunc();
            console.log(newMatrix);
            transformMatrix.multiply(newMatrix);
        }

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    // cubes have 36 verts
    this.partData[endIndex].vertsPerShape.push(36);
}

Armature.prototype.createXCylinder = function(coords, size, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([z,y,x],[h,w,l],[h,w,l],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();
        transformMatrix.setRotate(90,0,1,0);

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createXTruncCylinder = function(coords, sizeB, sizeT, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const lb = sizeB[0], wb = sizeB[1], hb = sizeB[2];
    const lt = sizeT[0], wt = sizeT[1], ht = sizeT[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([z,y,x],[hb,wb,lb],[ht,wt,lt],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();
        transformMatrix.setRotate(90,0,1,0);

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createYCylinder = function(coords, size, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([x,z,y],[l,h,w],[l,h,w],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();
        transformMatrix.setRotate(90,1,0,0);

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createYTruncCylinder = function(coords, sizeB, sizeT, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const lb = sizeB[0], wb = sizeB[1], hb = sizeB[2];
    const lt = sizeT[0], wt = sizeT[1], ht = sizeT[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([x,z,y],[lb,hb,wb],[lt,ht,wt],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();
        transformMatrix.setRotate(90,1,0,0);

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createZCylinder = function(coords, size, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([x,y,z],[l,w,h],[l,w,h],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();

        if(typeof transformFunc === "function"){
            let newMatrix = transformFunc();
            console.log(newMatrix);
            transformMatrix.multiply(newMatrix);
        }

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createZTruncCylinder = function(coords, sizeB, sizeT, color, segments, tube, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const lb = sizeB[0], wb = sizeB[1], hb = sizeB[2];
    const lt = sizeT[0], wt = sizeT[1], ht = sizeT[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getCylinderVertices([x,y,z],[lb,wb,hb],[lt,wt,ht],segments, tube);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();

        if(typeof transformFunc === "function"){
            let newMatrix = transformFunc();
            console.log(newMatrix);
            transformMatrix.multiply(newMatrix);
        }

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }

    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createSphere = function(coords, size, color, segments, transformFunc){
    if(segments < 3){
        console.log("Cannot have less than 3 segments in sphere");
        return;
    }

    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    const vertices = this.getSphereVertices(coords,size,segments);

    for(let i = 0; i < vertices.length; i++){
        const vertex = vertices[i];

        let transformMatrix = new Matrix4();

        if(typeof transformFunc === "function"){
            let newMatrix = transformFunc();
            console.log(newMatrix);
            transformMatrix.multiply(newMatrix);
        }

        let newVertex = transformVert(vertex, transformMatrix);

        let elem = newVertex.elements;
        this.pushVert(elem[0], elem[1], elem[2],r,g,b);
    }    

    // Add how many vertices were added
    this.partData[endIndex].vertsPerShape.push(vertices.length);
}

Armature.prototype.createFin = function(coords, finCoords, size, color, segments, transformFunc){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const xfin = finCoords[0], zfin = finCoords[1];
    const l = size[0], w = size[1], h = size[2];
    const r = color[0], g = color[1], b = color[2];

    let xcoords = [];
    let zcoords = [];
    let vertexCount = 0;

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        xcoords[i] = x + l*Math.cos(i*circleRotationTheta);
        zcoords[i] = z + h*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    xcoords.push(xcoords[0]);
    zcoords.push(zcoords[0]);

    // Iterate through the top
    for(let i = 0; i < xcoords.length - 1; i++){
        this.pushVert( xcoords[i], y - w , zcoords[i], r,g,b);
        this.pushVert( xcoords[i + 1], y - w, zcoords[i + 1], r,g,b);
        this.pushVert( x + l*xfin, y + w, z + h*zfin, r,g,b);

        vertexCount += 3;
    }

    // Add how many vertices were added
    this.partData[endIndex].vertsPerShape.push(vertexCount);
}

Armature.prototype.getCubeVertices = function(coords, size) {
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];

    let vertices = [];
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var cubeVertices = [
        // Vertex coordinates and color
        [ 1.0,  1.0,  1.0 ],  // v0
        [-1.0,  1.0,  1.0 ],  // v1
        [-1.0, -1.0,  1.0 ],  // v2
        [ 1.0, -1.0,  1.0 ],  // v3
        [ 1.0, -1.0, -1.0 ],  // v4
        [ 1.0,  1.0, -1.0 ],  // v5
        [-1.0,  1.0, -1.0 ],  // v6
        [-1.0, -1.0, -1.0 ],  // v7
    ];

    // Indices of the vertices
    var cubeIndices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);
    // Iterate through all vertices
    for(let i = 0; i < cubeIndices.length; i++){
        let indexVal = cubeIndices[i];
        // push the x, y, z, r, g, b with appropriate transforms
        vertices.push([x + cubeVertices[indexVal][0] * l,
                       y + cubeVertices[indexVal][1] * w,
                       z + cubeVertices[indexVal][2] * h]);
    }

    return vertices;
}

Armature.prototype.getCylinderVertices = function(coords, sizeBase, sizeTop, segments, tube){
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const lb = sizeBase[0], wb = sizeBase[1], h = sizeBase[2];
    const lt = sizeTop[0], wt = sizeTop[1];

    let xcoordsB = [];
    let ycoordsB = [];
    let xcoordsT = [];
    let ycoordsT = [];
    let vertices = [];

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        xcoordsB[i] = x + lb*Math.cos(i*circleRotationTheta);
        ycoordsB[i] = y + wb*Math.sin(i*circleRotationTheta);

        xcoordsT[i] = x + lt*Math.cos(i*circleRotationTheta);
        ycoordsT[i] = y + wt*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    xcoordsB.push(xcoordsB[0]);
    ycoordsB.push(ycoordsB[0]);
    xcoordsT.push(xcoordsT[0]);
    ycoordsT.push(ycoordsT[0]);

    if(!tube){
        // Iterate through the top
        for(let i = 0; i < xcoordsT.length - 1; i++){
            vertices.push([xcoordsT[i], ycoordsT[i], z + h]);
            vertices.push([xcoordsT[i + 1], ycoordsT[i + 1], z + h]);
            vertices.push([x, y, z + h]);
        }
    }
    // Iterate through the sides
    for(let i = 0; i < xcoordsT.length - 1; i++){
        //top left triangle
        vertices.push([xcoordsT[i + 1], ycoordsT[i + 1], z + h]);
        vertices.push([xcoordsT[i], ycoordsT[i], z + h]);
        vertices.push([xcoordsB[i], ycoordsB[i], z - h]);

        // bottom right triangle
        vertices.push([xcoordsT[i + 1], ycoordsT[i + 1], z + h]);
        vertices.push([xcoordsB[i], ycoordsB[i], z - h]);
        vertices.push([xcoordsB[i + 1], ycoordsB[i + 1], z - h]);
    }

    if(!tube){
        // Iterate through the bottom
        for(let i = 0; i < xcoordsT.length - 1; i++){
            vertices.push([xcoordsB[i + 1], ycoordsB[i + 1], z - h]);
            vertices.push([xcoordsB[i], ycoordsB[i], z - h]);
            vertices.push([x, y, z - h]);
        }
    }

    return vertices;
}

Armature.prototype.getSphereVertices = function(coords, size, segments) {
    const endIndex = this.partData.length - 1;

    const x = coords[0], y = coords[1], z = coords[2];
    const l = size[0], w = size[1], h = size[2];

    let xcoords = [];
    let zcoords = [];
    let vertices = [];

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        xcoords[i] = l*Math.cos(i*circleRotationTheta);
        zcoords[i] = h*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    xcoords.push(xcoords[0]);
    zcoords.push(zcoords[0]);

    let hemisphereTheta = Math.PI/segments;
    // Iterate through the top
    let yHeight = w*Math.cos(hemisphereTheta);
    let horizRadius = Math.sin(hemisphereTheta);
    for(let i = 0; i < xcoords.length - 1; i++){
        vertices.push([x + horizRadius*xcoords[i], y + yHeight , z + horizRadius*zcoords[i]]);
        vertices.push([x + horizRadius*xcoords[i + 1], y + yHeight, z + horizRadius*zcoords[i + 1]]);
        vertices.push([x, y + w, z]);
    }

    // Iterate through horizontal rings
    for(let i = 1; i < segments - 1; i++){
        yHeight = w*Math.cos(i*hemisphereTheta);
        let yHeight2 = w*Math.cos((i+1)*hemisphereTheta);
        horizRadius = Math.sin(i*hemisphereTheta);
        let horizRadius2 = Math.sin((i+1)*hemisphereTheta);
        for(let j = 0; j < xcoords.length - 1; j++){
            //top left trjangle
            vertices.push([x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1]]);
            vertices.push([x + horizRadius*xcoords[j], y + yHeight, z + horizRadius*zcoords[j]]);
            vertices.push([x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j]]);

            // bottom rjght trjangle
            vertices.push([x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1]]);
            vertices.push([x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j]]);
            vertices.push([x + horizRadius2*xcoords[j + 1], y + yHeight2, z + horizRadius2*zcoords[j + 1]]);
        }
    }

    // Iterate through the bottom
    yHeight = w*Math.cos(hemisphereTheta);
    horizRadius = Math.sin(hemisphereTheta);
    for(let i = 0; i < xcoords.length - 1; i++){
        vertices.push([x + horizRadius*xcoords[i + 1], y - yHeight, z + horizRadius*zcoords[i + 1]]);
        vertices.push([x + horizRadius*xcoords[i], y - yHeight, z + horizRadius*zcoords[i]]);
        vertices.push([x, y - w, z]);
    }

    return vertices;
}