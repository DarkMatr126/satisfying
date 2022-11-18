window.addEventListener('load',() => {
    load();
})

var tiles = []; //tiles[y][x]; data: [id,opacity,fill]

var tileW = 75;
var tileM = 3;

var opacitySpd = 0.5;
var fps = 30;
//in opacitySpd secods seconds, at 30 fps, go down x amount every frame
var num = 100/(opacitySpd*fps)
var spread = 50;

function load (width = window.screen.width,height = window.screen.height) {
    var columns = Math.floor(width/tileW);
    var rows = Math.floor(height/tileW)+1;

    tiles = [];
    document.getElementById('tiles').innerHTML = '';
    for (let i = 0; i < rows; i++) {
        var arr = []
        for (let o = 0; o < columns; o++) {
            var tile = document.createElement('div');
            tile.setAttribute('class','tile');
            var left = tileW*o + tileM*(o+1);
            var top = tileW*i + tileM*(i+1);
            if (left >= width) {
                continue;
            }
            if (top >= height) {
                continue;
            }
            tile.style.left = `${left}px`;
            tile.style.top = `${top}px`;
            tile.style.width = `${tileW}px`;
            tile.style.height = `${tileW}px`;
            tile.style.opacity = `${100}%`
            tile.setAttribute('onclick',`clicked(${o},${i},false)`);
            document.getElementById('tiles').append(tile);
            arr.push([tile,100,true]) //[2] true is increased/increasing. false is decreased/decreasing
        }
        document.getElementById('tiles').append(document.createElement('br'));
        tiles.push(arr);
    }
    //onOpen();
}

function onOpen () {
    var rows = tiles.length;
    var columns = tiles[0].length;
    var randX = Math.floor(Math.random() * columns);
    var randY = Math.floor(Math.random() * rows);
    clicked(randX,randY);
}

function clicked (x = undefined,y = undefined,) {
    var tile = tiles[y][x];
    var doc = tile[0];

    direction = !(tile[2])

    tiles[y][x][2] = direction;

    opacity(x,y,direction);
    
    //wave(x,y,direction);
    setTimeout(() => {
        wave(x+1,y,direction)
        wave(x,y+1,direction)
        wave(x-1,y,direction)
        wave(x,y-1,direction)
    }, spread)
}

function wave (x,y,direction) {
    if (typeof tiles[y][x] == 'undefined' || tiles[y][x][2] === direction) {
        return;
    }
    var tile = tiles[y][x];

    tiles[y][x][2] = direction;
    opacity(x,y,direction);

    setTimeout(() => {
        wave(x+1,y,direction)
        wave(x,y+1,direction)
        wave(x-1,y,direction)
        wave(x,y-1,direction)
    }, spread)
}

function opacity (x,y,increase) {
    var tile = tiles[y][x];
    var doc = tile[0];

    if (tile[2] === increase) {
        if (tile[1] > 0 || tile[1] < 100) {
            if (tile[2]) {
                tiles[y][x][1]+=num;
            } else {
                tiles[y][x][1]-=num;
            }
            doc.style.opacity = `${tiles[y][x][1]}%`;
            setTimeout(() => {
                if (tiles[y][x][2] === increase && !(tiles[y][x][1] < 0 || tiles[y][x][1] > 100)) {
                    opacity(x,y,increase)
                }
            },1000/fps)
        }
    }
}