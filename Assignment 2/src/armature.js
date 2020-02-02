/*
    every member of partData contains:
        vertsPerShape[] // how many verts are in each shape, each elem is a shape
        parent // index of the parent part; -1 if none
        originX // unmodified origin points
        originY
        originZ

        initMatrix // the initial transform matrix; does not affect children
        animMatrix // the animated matrix; affects children
*/

var Armature = function() {
    this.vertexArr = [];
    this.partData = [];
    this.partName = [];
}

Armature.prototype.addBodyPart = function(part, shapeFunc, initMatrixFunc) {
    this.partData.push(part);
    this.partName.push(part.name);

    part.vertsPerShape = [];
    part.initMatrix = new Matrix4();
    part.animMatrix = new Matrix4();

    if(part.parent !== -1)
        part.parentIndex = this.partName.indexOf(part.parent);
    else{
        part.parentIndex = -1;
    }

    shapeFunc(this);

    if(initMatrixFunc && enableInit){
        part.initMatrix.setTranslate(part.originX,part.originY,part.originZ);
        initMatrixFunc(part.initMatrix);
        part.initMatrix.translate(-part.originX,-part.originY,-part.originZ);

        part.animMatrix.set(part.initMatrix);
    }
}

Armature.prototype.createCube = function(x, y, z, l, w, h, r, g, b){
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
        this.pushVert( x + cubeVertices[indexVal][0] * l,
                       y + cubeVertices[indexVal][1] * w,
                       z + cubeVertices[indexVal][2] * h ,
                       r,g,b);
    }

    // cubes have 36 verts
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(36);
}

Armature.prototype.createXCylinder = function(x, y, z, l, w, h, r, g, b, segments){
    let ycoords = [];
    let zcoords = [];
    let vertexCount = 0;

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        ycoords[i] = y + w*Math.cos(i*circleRotationTheta);
        zcoords[i] = z + h*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    ycoords.push(ycoords[0]);
    zcoords.push(zcoords[0]);

    // Iterate through the top
    for(let i = 0; i < ycoords.length - 1; i++){
        this.pushVert( x + l, ycoords[i], zcoords[i], r,g,b);
        this.pushVert( x + l, ycoords[i + 1], zcoords[i + 1], r,g,b);
        this.pushVert( x + l, y, z, r,g,b);

        vertexCount += 3;
    }

    // Iterate through the sides
    for(let i = 0; i < ycoords.length - 1; i++){
        //top left triangle
        this.pushVert( x + l, ycoords[i + 1], zcoords[i + 1], r,g,b);
        this.pushVert( x + l, ycoords[i], zcoords[i], r,g,b);
        this.pushVert( x - l, ycoords[i], zcoords[i], r,g,b);

        // bottom right triangle
        this.pushVert( x + l, ycoords[i + 1], zcoords[i + 1], r,g,b);
        this.pushVert( x - l, ycoords[i], zcoords[i], r,g,b);
        this.pushVert( x - l, ycoords[i + 1], zcoords[i + 1], r,g,b);

        vertexCount += 6;
    }

    // Iterate through the bottom
    for(let i = 0; i < ycoords.length - 1; i++){
        this.pushVert( x - l, ycoords[i + 1], zcoords[i + 1], r,g,b);
        this.pushVert( x - l, ycoords[i], zcoords[i], r,g,b);
        this.pushVert( x - l, y, z, r,g,b);

        vertexCount += 3;
    }

    // Add how many vertices were added
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(vertexCount);
}

Armature.prototype.createYCylinder = function(x, y, z, l, w, h, r, g, b, segments){
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
        this.pushVert( xcoords[i], y + w , zcoords[i], r,g,b);
        this.pushVert( xcoords[i + 1], y + w, zcoords[i + 1], r,g,b);
        this.pushVert( x, y + w, z, r,g,b);

        vertexCount += 3;
    }

    // Iterate through the sides
    for(let i = 0; i < xcoords.length - 1; i++){
        //top left triangle
        this.pushVert( xcoords[i + 1], y + w, zcoords[i + 1], r,g,b);
        this.pushVert( xcoords[i], y + w, zcoords[i], r,g,b);
        this.pushVert( xcoords[i], y - w, zcoords[i], r,g,b);

        // bottom right triangle
        this.pushVert( xcoords[i + 1], y + w, zcoords[i + 1], r,g,b);
        this.pushVert( xcoords[i], y - w, zcoords[i], r,g,b);
        this.pushVert( xcoords[i + 1], y - w, zcoords[i + 1], r,g,b);

        vertexCount += 6;
    }

    // Iterate through the bottom
    for(let i = 0; i < xcoords.length - 1; i++){
        this.pushVert( xcoords[i + 1], y - w, zcoords[i + 1], r,g,b);
        this.pushVert( xcoords[i], y - w, zcoords[i], r,g,b);
        this.pushVert( x, y - w, z, r,g,b);

        vertexCount += 3;
    }

    // Add how many vertices were added
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(vertexCount);
}

Armature.prototype.createZCylinder = function(x, y, z, l, w, h, r, g, b, segments){
    let xcoords = [];
    let ycoords = [];
    let vertexCount = 0;

    // Finds the coords of the circle
    let circleRotationTheta = 2*Math.PI/segments;
    for(let i = 0; i < segments; i++){
        xcoords[i] = x + l*Math.cos(i*circleRotationTheta);
        ycoords[i] = y + w*Math.sin(i*circleRotationTheta);
    }

    // Add one more at the end so that it is circular
    xcoords.push(xcoords[0]);
    ycoords.push(ycoords[0]);

    // Iterate through the top
    for(let i = 0; i < xcoords.length - 1; i++){
        this.pushVert( xcoords[i], ycoords[i], z + h, r,g,b);
        this.pushVert( xcoords[i + 1], ycoords[i + 1], z + h, r,g,b);
        this.pushVert( x, y, z + h, r,g,b);

        vertexCount += 3;
    }

    // Iterate through the sides
    for(let i = 0; i < xcoords.length - 1; i++){
        //top left triangle
        this.pushVert( xcoords[i + 1], ycoords[i + 1], z + h, r,g,b);
        this.pushVert( xcoords[i], ycoords[i], z + h, r,g,b);
        this.pushVert( xcoords[i], ycoords[i], z - h, r,g,b);

        // bottom right triangle
        this.pushVert( xcoords[i + 1], ycoords[i + 1], z + h, r,g,b);
        this.pushVert( xcoords[i], ycoords[i], z - h, r,g,b);
        this.pushVert( xcoords[i + 1], ycoords[i + 1], z - h, r,g,b);

        vertexCount += 6;
    }

    // Iterate through the bottom
    for(let i = 0; i < xcoords.length - 1; i++){
        this.pushVert( xcoords[i + 1], ycoords[i + 1], z - h, r,g,b);
        this.pushVert( xcoords[i], ycoords[i], z - h, r,g,b);
        this.pushVert( x, y, z - h, r,g,b);

        vertexCount += 3;
    }

    // Add how many vertices were added
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(vertexCount);
}

Armature.prototype.createSphere = function(x, y, z, l, w, h, r, g, b, segments){
    if(segments < 3){
        console.log("Cannot have less than 3 segments in sphere");
        return;
    }

    let xcoords = [];
    let zcoords = [];
    let vertexCount = 0;

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
        this.pushVert( x + horizRadius*xcoords[i], y + yHeight , z + horizRadius*zcoords[i], r,g,b);
        this.pushVert( x + horizRadius*xcoords[i + 1], y + yHeight, z + horizRadius*zcoords[i + 1], r,g,b);
        this.pushVert( x, y + w, z, r,g,b);

        vertexCount += 3;
    }

    // Iterate through horizontal rings
    for(let i = 1; i < segments - 1; i++){
        yHeight = w*Math.cos(i*hemisphereTheta);
        let yHeight2 = w*Math.cos((i+1)*hemisphereTheta);
        horizRadius = Math.sin(i*hemisphereTheta);
        let horizRadius2 = Math.sin((i+1)*hemisphereTheta);
        for(let j = 0; j < xcoords.length - 1; j++){
            //top left trjangle
            this.pushVert( x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1], r,g,b);
            this.pushVert( x + horizRadius*xcoords[j], y + yHeight, z + horizRadius*zcoords[j], r,g,b);
            this.pushVert( x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j], r,g,b);

            // bottom rjght trjangle
            this.pushVert( x + horizRadius*xcoords[j + 1], y + yHeight, z + horizRadius*zcoords[j + 1], r,g,b);
            this.pushVert( x + horizRadius2*xcoords[j], y + yHeight2, z + horizRadius2*zcoords[j], r,g,b);
            this.pushVert( x + horizRadius2*xcoords[j + 1], y + yHeight2, z + horizRadius2*zcoords[j + 1], r,g,b);

            vertexCount += 6;
        }
    }

    // Iterate through the bottom
    yHeight = w*Math.cos(hemisphereTheta);
    horizRadius = Math.sin(hemisphereTheta);
    for(let i = 0; i < xcoords.length - 1; i++){
        this.pushVert( x + horizRadius*xcoords[i + 1], y - yHeight, z + horizRadius*zcoords[i + 1], r,g,b);
        this.pushVert( x + horizRadius*xcoords[i], y - yHeight, z + horizRadius*zcoords[i], r,g,b);
        this.pushVert( x, y - w, z, r,g,b);

        vertexCount += 3;
    }

    // Add how many vertices were added
    let endIndex = this.partData.length - 1;
    this.partData[endIndex].vertsPerShape.push(vertexCount);
}

Armature.prototype.pushVert = function(x,y,z,r,g,b){
    this.vertexArr.push( x );
    this.vertexArr.push( y );
    this.vertexArr.push( z );
    this.vertexArr.push( r/255 );
    this.vertexArr.push( g/255 );
    this.vertexArr.push( b/255 );
}