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