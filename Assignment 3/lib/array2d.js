function forEach2 (width, height, fcn) {
    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            fcn(i, j);
        }
    }
}

class Array2d {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        console.log(width);
        console.log(height);
        this.values = [];
        for(let i = 0; i < height; i++){
            this.values.push([]);
        }
    }
    get (i, j) {
        return this.values[i][j];
    }
    set (i, j, value) {
        this.values[i][j] = value;
    }
    forEach (fcn) {
        forEach2(this.width, this.height, (i, j) => {
            fcn(this.values[i][j], i, j);
        });
    }
    fill (generator) {
        forEach2(this.width, this.height, (i, j) => {
            console.log(this.values);
            this.values[i][j] = generator(i, j);
        });
    }
    map (fcn) {
        let result = new Array2d(this.width, this.height);
        result.fill((i, j) => this.values[i][j]);
        return result;
    }
}
