useFixedSeed = false;
seed = '8ae8865c461f77fd321851c830f8bbeb49df254d';

//function random() { return Math.seedrandom(useFixedSeed ? seed : null) };
function randInt(n) { return (Math.random() * n) | 0 };
function randIntRange(n, m) { return n + randInt(m - n) };
//function randomArrayPick(array) => array[randInt(array.length)];
//function randomArrayPickOf(array) => () => randomArrayPick(array);
//export const randomDir = randomArrayPickOf(DIRECTIONS);
//export const randomTile = (tileset) =>
//    randomArrayPick(tileset) + '_' + randomDir();
