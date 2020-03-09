/*
    Algorithm designed by me and Brenden Satake during CMPM 147
    Helper functions programmed by Seiji Emery
*/

function graph_dungeon (params) {
    const { width, height, numberOfRooms } = params;

    let rooms = [];

    let dungeon = new Array2d(width,height);

    dungeon.fill((x,y) => {
        return 1;
    });

    // Multiply each coord by some multiplier
    // Populate partitions rooms
    let partitions = [];
    partition_rooms(partitions,0,0,width - 1,height - 1,numberOfRooms);

    // If the partitions comes out to less than the desired number
    let numRooms = partitions.length;

    // Pick random locations for room
    for(let i = 0; i < numRooms; ++i){
        rooms[i] = {
            width: 1,
            height: 1,
            // This is in the top left, and could spawn in the bottom right
            x: 0,
            y: 0,
            edges: [],
            tunnels: [],
        };

        let r = rooms[i];
        let p = partitions[i];
        // temp solution to control whether we want max size or not
        if(false){
            r.width = Math.abs(p.x1-p.x2)-1;
            r.height = Math.abs(p.y1-p.y2)-1;
            r.x = p.x1 + 1;
            r.y = p.y1 + 1;
        }
        else{
            let minXSize = Math.min(3,Math.abs(p.x1-p.x2)-1);
            let minYSize = Math.min(3,Math.abs(p.y1-p.y2)-1);
            r.width = randIntRange(minXSize,Math.abs(p.x1-p.x2)-1);
            r.height = randIntRange(minYSize,Math.abs(p.y1-p.y2)-1);
            r.x = randIntRange(p.x1 + 1,p.x2 - r.width - 1);
            r.y = randIntRange(p.y1 + 1,p.y2 - r.height - 1);
        }
        
        //console.log("room " + i + ": " + r.width + " " + r.height + ", " + r.x + " " + r.y);
        //console.log("room " + i);
        //console.log(r);
    }

    // Create graph alg here
    for(let i = 0; i < numRooms; ++i){
        for(let j = i + 1; j < numRooms; ++j){
            let thisP = partitions[i];
            let thatP = partitions[j];
            if(partition_adj_check(thisP.x1,thatP.x2,thisP.y1,thisP.y2,thatP.y1,thatP.y2) ||
               partition_adj_check(thisP.y1,thatP.y2,thisP.x1,thisP.x2,thatP.x1,thatP.x2) ||
               partition_adj_check(thisP.x2,thatP.x1,thisP.y1,thisP.y2,thatP.y1,thatP.y2) ||
               partition_adj_check(thisP.y2,thatP.y1,thisP.x1,thisP.x2,thatP.x1,thatP.x2)
               ){
                rooms[i].edges.push(j);
                rooms[j].edges.push(i);
            }
        }
    }
    // expand room alg here
    for(let i = 0; i < numRooms; ++i){
        let r = rooms[i];
        create_room(dungeon,r.x,r.y,r.width,r.height);
    }

    // Pick connections
    for(let i = 0; i < numRooms; ++i){
        let r = rooms[i];

        let tempArr = r.edges.slice(0);

        // Only consider new tunnels
        // Trim current tunnels out of possible candidates
        for(let i = 0; i < r.tunnels.length; ++i){
            for(let j = 0; j < tempArr.length; ++j){
                if(r.tunnels[i] === tempArr[j]){
                    delete_arr_elem(tempArr,j);
                }
            }
        }

        let totalEdges = Math.max(1, tempArr.length - 1);
        let numTunnels = randIntRange(0,totalEdges);

        // Pick new tunnels
        for(let j = 0; j < numTunnels; ++j){
            let chosenIndex = randInt(tempArr.length-1);
            let chosenValue = tempArr[chosenIndex];

            r.tunnels.push(chosenValue);
            rooms[chosenValue].tunnels.push(i);

            delete_arr_elem(tempArr,chosenIndex);
        }
    }

    // Check for completion
    while(true){
        // Run dfs
        // each index of dfs_result corresponds to rooms
        let dfs_result = dfs(rooms);

        // Log which rooms were unvisited in dfs
        let incomplete = [];
        for(let i = 0; i < numRooms; ++i){
            if(dfs_result[i] === false){
                incomplete.push(i);
            }
        }

        // If all rooms are visited, then exit
        if(incomplete.length === 0){
            break;
        }
        // else, carve a new tunnel and try again
        carve_new_tunnel(incomplete, rooms, dfs_result);
    }

    // Dig tunnels
    for(let i = 0; i < numRooms; ++i){
        let t = rooms[i].tunnels;
        //if(i < 25 || i > 25) continue;
        for(let j = 0; j < t.length; ++j){
            // any index t[j] is less than i has already been dug
            if(i < t[j]){
                let xmidRoom1 = Math.floor(rooms[i].x + rooms[i].width/2);
                let ymidRoom1 = Math.floor(rooms[i].y + rooms[i].height/2);
                let xmidRoom2 = Math.floor(rooms[t[j]].x + rooms[t[j]].width/2);
                let ymidRoom2 = Math.floor(rooms[t[j]].y + rooms[t[j]].height/2);
                //create_bend(dungeon, xmidRoom1, ymidRoom1, xmidRoom2, ymidRoom2);
                create_smart_tunnel(dungeon, partitions, rooms, i, t[j]);
            }
        }
    }

    // Pick end and start rooms
    const start = {x: -1, y: -1};
    const end = {x: -1, y: -1};
    const sphere1 = {x: -1, y: -1};
    const sphere2 = {x: -1, y: -1};

    const startRoom = randInt(Math.floor(numRooms*.1));
    const endRoom = numRooms - randInt(Math.floor(numRooms*.1)) - 1;
    const s1Room = randIntRange(Math.floor(numRooms*.3),Math.floor(numRooms*.5));
    const s2Room = randIntRange(Math.floor(numRooms*.5),Math.floor(numRooms*.7));

    //console.log(startRoom + " " + endRoom + " " + keyRoom);

    start.x = rooms[startRoom].x + randInt(rooms[startRoom].width - 1);
    start.y = rooms[startRoom].y + randInt(rooms[startRoom].height - 1);

    end.x = rooms[endRoom].x + randInt(rooms[endRoom].width - 1);
    end.y = rooms[endRoom].y + randInt(rooms[endRoom].height - 1);

    sphere1.x = rooms[s1Room].x + randInt(rooms[s1Room].width - 1);
    sphere1.y = rooms[s1Room].y + randInt(rooms[s1Room].height - 1);

    sphere2.x = rooms[s2Room].x + randInt(rooms[s2Room].width - 1);
    sphere2.y = rooms[s2Room].y + randInt(rooms[s2Room].height - 1);

    dungeon.set(start.x, start.y, 'c');
    dungeon.set(end.x, end.y, 'a');
    dungeon.set(sphere1.x, sphere1.y, 's1');
    dungeon.set(sphere2.x, sphere2.y, 's2');

    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            if(dungeon.get(i,j) === 1){
                dungeon.set(i,j,randIntRange(1,3));
            }
        }
    }

    return dungeon.values;
}

// Adds a new tunnel to a room's tunnels array
function carve_new_tunnel(incomplete, rooms, dfs_result) {
    let chosenIndex = randInt(incomplete.length - 1); // index of incomplete
    let chosenRoom = incomplete[chosenIndex]; // index of rooms

    let r = rooms[chosenRoom];
    let e = r.edges;
    // We iterate through the edges of an unvisited room
    for(let i = 0; i < e.length; ++i){
        // to find another room that has been visited
        let otherRoom = e[i];
        if(dfs_result[otherRoom] === true){
            // if it has, then we push in our tunnels that connection
            r.tunnels.push(e[i]);
            rooms[otherRoom].tunnels.push(chosenRoom);
            return;
        }
    }
}

function create_gradual_tunnel_base(array, direction,
                                    room1X, room1Y,
                                    firstCoordX, firstCoordY,
                                    secondCoordX, secondCoordY,
                                    room2X, room2Y){
    let seenWalls = {status: false,};
    let wallStatus;

    // So I can make use of break
    for(let i = 0; i < 1; ++i){
        if(direction === "x"){
            wallStatus = create_gradual_tunnel(array, secondCoordX,room2Y,secondCoordX,secondCoordY, seenWalls);
            //wallStatus = create_tunnel(array, firstCoordX,room1Y,firstCoordX,firstCoordY, seenWalls);
            if(wallStatus === 1){
                break;
            }
            wallStatus = create_gradual_tunnel(array, secondCoordX,secondCoordY,firstCoordX,firstCoordY, seenWalls);
            //wallStatus = create_tunnel(array, firstCoordX,firstCoordY,secondCoordX,secondCoordY, seenWalls);
            if(wallStatus === 1){
                break;
            }
            wallStatus = create_gradual_tunnel(array, firstCoordX,firstCoordY,firstCoordX,room1Y, seenWalls);
            //wallStatus = create_tunnel(array, secondCoordX,secondCoordY,secondCoordX,room2Y, seenWalls);
        }
        else{
            wallStatus = create_gradual_tunnel(array, room2X,secondCoordY,secondCoordX,secondCoordY, seenWalls);
            //wallStatus = create_tunnel(array, room1X,firstCoordY,firstCoordX,firstCoordY, seenWalls);
            if(wallStatus === 1){
                break;
            }
            wallStatus = create_gradual_tunnel(array, secondCoordX,secondCoordY,firstCoordX,firstCoordY, seenWalls);
            //wallStatus = create_tunnel(array, firstCoordX,firstCoordY,secondCoordX,secondCoordY, seenWalls);
            if(wallStatus === 1){
                break;
            }
            wallStatus = create_gradual_tunnel(array, firstCoordX,firstCoordY,room1X,firstCoordY, seenWalls);
            //wallStatus = create_tunnel(array, secondCoordX,secondCoordY,room2X,secondCoordY, seenWalls);
        }
    }
    
}

// Digs a new tunnel that stops if encountered a tunnel
function create_gradual_tunnel (array, xOrigin, yOrigin, xEnd, yEnd, seenWalls){
    //console.log("tunnel: (" + xOrigin + ", " + yOrigin + ") , (" + xroom + ", " + yroom + ")");

    if(xOrigin === xEnd && yOrigin === yEnd) return 0;

    let xtunnel = Math.min(xOrigin,xEnd);
    let ytunnel = Math.min(yOrigin,yEnd);

    let tunnelLength;
    let tunnelDir;
    // Dig in the X direction
    if(xOrigin != xEnd){
        tunnelLength = Math.abs(xOrigin - xEnd) + 1;
        tunnelDir = Math.sign(xEnd - xOrigin);
        for(let i = 1; i < tunnelLength; ++i){
            if(array.get(xOrigin + tunnelDir*i, yOrigin) === 0){
                // Check to see if it's in a room or in a tunnel
                if(seenWalls.status === true){
                    // encountered a tunnel while digging
                    return 1;
                }
                // else, I haven't started digging yet
            }
            else{
                // I have started digging!
                seenWalls.status = true;
                array.set(xOrigin + tunnelDir*i, yOrigin, 0);
            }
        }
    }
    // Dig in the Y direction
    else if(yOrigin != yEnd){
        tunnelLength = Math.abs(yOrigin - yEnd) + 1;
        tunnelDir = Math.sign(yEnd - yOrigin);
        for(let i = 1; i < tunnelLength; ++i){
            if(array.get(xOrigin, yOrigin + tunnelDir*i) === 0){
                // Check to see if it's in a room or in a tunnel
                if(seenWalls.status === true){
                    // encountered a tunnel while digging
                    return 1;
                }
                // else, I haven't started digging yet
            }
            else{
                // I have started digging!
                seenWalls.status = true;
                array.set(xOrigin, yOrigin + tunnelDir*i, 0);
            }
        }
    }
    else{
        console.log("error: some coords enterred wrong in create_gradual_tunnel()");
    }

    // Encountered no tunnels
    return 0;
}

// Creates tunnels that do not intersect with rooms
function create_smart_tunnel(array, partitions, rooms, firstRoom, secondRoom){
    let thisP = partitions[firstRoom];
    let thatP = partitions[secondRoom];

    let firstCoord = {x: -1, y: -1};
    let secondCoord = {x: -1, y: -1};

    let coordArr = [];
    // axisAdj is adjacent coords, axisOffset are offset coords
    let axisAdj, axisOffset, firstRoomLength, secondRoomLength;

    // If secondRoom is to the right of firstRoom
    if(partition_adj_check(thisP.x2,thatP.x1,thisP.y1,thisP.y2,thatP.y1,thatP.y2)){
        // Sort y coords in order and grab middle 2
        coordArr = [thisP.y1, thisP.y2, thatP.y1, thatP.y2];
        axisAdj = "x";
        axisOffset = "y";

        firstRoomLength = rooms[firstRoom].width;
        secondRoomLength = rooms[secondRoom].width;
    }
    // If secondRoom is below firstRoom
    else if(partition_adj_check(thisP.y2,thatP.y1,thisP.x1,thisP.x2,thatP.x1,thatP.x2)){
        // Sort x coords in order and grab middle 2
        coordArr = [thisP.x1,thisP.x2,thatP.x1,thatP.x2];
        axisAdj = "y";
        axisOffset = "x";

        firstRoomLength = rooms[firstRoom].height;
        secondRoomLength = rooms[secondRoom].height;
    }

    coordArr.sort();

    let chosenAxisOffset = randIntRange(coordArr[1], coordArr[2]);

    firstCoord[axisOffset] = chosenAxisOffset;
    secondCoord[axisOffset] = chosenAxisOffset;

    firstCoord[axisAdj] = rooms[firstRoom][axisAdj] + randInt(firstRoomLength);
    secondCoord[axisAdj] = rooms[secondRoom][axisAdj] + randInt(secondRoomLength);

    create_gradual_tunnel_base(array, axisAdj,
                                    rooms[firstRoom].x, rooms[firstRoom].y,
                                    firstCoord.x, firstCoord.y,
                                    secondCoord.x, secondCoord.y,
                                    rooms[secondRoom].x, rooms[secondRoom].y);
    /*if(axisAdj === "x"){
        create_tunnel(array, firstCoord.x,rooms[firstRoom].y,firstCoord.x,firstCoord.y);
        create_tunnel(array, firstCoord.x,firstCoord.y,secondCoord.x,secondCoord.y);
        create_tunnel(array, secondCoord.x,secondCoord.y,secondCoord.x,rooms[secondRoom].y);
    }
    else{
        create_tunnel(array, rooms[firstRoom].x,firstCoord.y,firstCoord.x,firstCoord.y);
        create_tunnel(array, firstCoord.x,firstCoord.y,secondCoord.x,secondCoord.y);
        create_tunnel(array, secondCoord.x,secondCoord.y,rooms[secondRoom].x,secondCoord.y);
    }*/
}

function create_bend (array, xroom1, yroom1, xroom2, yroom2){
    let xtunnel;
    let ytunnel;
    if(randInt(1) == 0){
        xtunnel = Math.floor(xroom1);
        ytunnel = Math.floor(yroom2);
    }
    else{
        xtunnel = Math.floor(xroom2);
        ytunnel = Math.floor(yroom1);
    }

    create_tunnel(array, xtunnel, ytunnel, xroom1, yroom1);
    create_tunnel(array, xtunnel, ytunnel, xroom2, yroom2);
}

function create_room (array, xOrigin, yOrigin,width,height) {
    //console.log("room: (" + xOrigin + ", " + yOrigin + ") , (" + width + ", " + height + ")");
    for(let i = xOrigin; i < xOrigin + width; ++i){
        for(let j = yOrigin; j < yOrigin + height; ++j){
            array.set(i,j,0);
        }
    }
}

// r = room
function create_tunnel (array, xOrigin, yOrigin, xEnd, yEnd){
    //console.log("tunnel: (" + xOrigin + ", " + yOrigin + ") , (" + xroom + ", " + yroom + ")");

    let xtunnel = Math.min(xOrigin,xEnd);
    let ytunnel = Math.min(yOrigin,yEnd);

    let xwidth;
    let yheight;
    if(xOrigin != xEnd){
        xwidth = Math.abs(xOrigin - xEnd) + 1;
        yheight = 1;
    }
    else{
        xwidth = 1;
        yheight = Math.abs(yOrigin - yEnd) + 1;
    }
    
    create_room(array,xtunnel,ytunnel,xwidth,yheight);
}

function delete_arr_elem(array,position){
    array[position] = array[array.length - 1];
    array.pop();
}

function dfs(rooms){
    let visited = [];
    for(let i = 0; i < rooms.length; ++i)
        visited[i] = false;
    dfs_recursive(rooms, visited, 0);

    return visited;
}

function dfs_recursive(rooms, visited, position){
    visited[position] = true;
    let t = rooms[position].tunnels;
    for(let i = 0; i < t.length; ++i){
        if(visited[t[i]] === false){
            dfs_recursive(rooms, visited, t[i]);
        }
    }
}

//https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
function partition_adj_check(thisx1,thatx2,thisy1,thisy2,thaty1,thaty2){
    if(thisx1 === thatx2){
        return (thisy1 < thaty2 && thisy2 > thaty1);
    }
    return false;
}

function partition_rooms(array, X0,Y0,X,Y,ROOMS){
    if(ROOMS == 0){
        // Probably not possible
        return;
    }
    if(ROOMS == 1){
        let cell = {
            x1: X0,
            y1: Y0,
            x2: X,
            y2: Y,
        }
        array.push(cell);
        return;
    }

    var part1, part2

    if(randInt(1) % 2 == 0){
        part1 = Math.floor(ROOMS/2);
    }
    else{
        part1 = Math.ceil(ROOMS/2);
    }
    part2 = ROOMS - part1;

    let pWidth = Math.abs(X0 - X);
    let pLength = Math.abs(Y0 - Y);

    // Splits into left/right rooms
    if(pWidth > pLength){
        var split = divide_partition(X0,X,part1,part2)
        if(split === -1){
            let cell = {
                x1: X0,
                y1: Y0,
                x2: X,
                y2: Y,
            }
            array.push(cell);
            return;
        }
        partition_rooms(array, X0,Y0,split,Y,part1);
        partition_rooms(array, split,Y0,X,Y,part2)
        return;
    }
    // Splits into up/down rooms
    else{
        var split = divide_partition(Y0,Y,part1,part2);
        if(split === -1){
            let cell = {
                x1: X0,
                y1: Y0,
                x2: X,
                y2: Y,
            }
            array.push(cell);
            return;
        }
        partition_rooms(array, X0,Y0,X,split,part1);
        partition_rooms(array, X0,split,X,Y,part2);
        return;
    }
}

function divide_partition (low,high,rooms1,rooms2){
    var lower_bound = low;
    var upper_bound = high;
    var diff = Math.abs(high-low);
    if(diff > 4){
        lower_bound += Math.floor(diff*.25);
        upper_bound -= Math.floor(diff*.25);
        //console.log(lower_bound + " " + upper_bound);
        return randIntRange(lower_bound,upper_bound);
    }
    return -1;
}