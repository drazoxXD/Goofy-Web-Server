let count = 0;
let thisCount = 0;
let play = false;
document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('background-music');
    console.log(audio)
    setTimeout(function() {
        audio.volume = 0.1
        play = true;
    }, 1000)
});

var audio = document.getElementById('background-music');
console.log(audio)
setTimeout(function() {
    audio.volume = 0.1
    play = true;
}, 1000)
const handlers = {
    startInitFunctionOrder(data) {
        count = data.count;
    },

    loadProgress({ loadFraction }) {
        document.getElementById('loadingbar').style.left = '0%';
        document.getElementById('loadingbar').style.width = loadFraction * 100 + '%';
    },

    onLogLine({ message }) {
        if (message === 'Awaiting scripts') {
            message = 'Scriptek Indítása'
        }else if (message == 'Initializing session') {
            message = 'Játékosok Szinkronizálása'
        }
        document.getElementById('text').innerHTML = message
    },

    startDataFileEntries(data) {
        count = data.count;
    },

    startInitFunction(data) {
        if (data.type == 'INIT_SESSION') {
            data.type = 'Dimenzió Betöltése'
        }
        document.getElementById('text').innerHTML = data.type
    },

    startInitFunction2(data) {
        if (data.type == 'INIT_SESSION') {
            data.type = 'Dimenzió Betöltése'
        }
        document.getElementById('text').innerHTML = data.type
    },

    startInitFunction3(data) {
        if (data.type == 'INIT_SESSION') {
            data.type = 'Dimenzió Betöltése'
        }
        document.getElementById('text').innerHTML = data.type
    },

    initFunctionInvoking(data) {
        if (data.type == 'INIT_SESSION') {
            data.type = 'Dimenzió Betöltése'
        }
        document.getElementById('text').innerHTML = data.type
    },

    initFunctionInvoked(data) {
        if (data.type == 'INIT_SESSION') {
            data.type = 'Dimenzió Betöltése'
        }
        document.getElementById('text').innerHTML = data.type
    },

    endInitFunction(data) {
        if (data.type == 'INIT_BEFORE_MAP_LOADED') {
            data.type == 'Dimenzió Legenerálása'
        }
        document.getElementById('text').innerHTML = data.type
    },

    performMapLoadFunction(data) {
        ++thisCount;

        document.getElementById('loadingbar').style.left = '0%';
        document.getElementById('loadingbar').style.width =
            (thisCount / count) * 100 + '%';
    },
};

window.addEventListener('message', function (e) {
    (handlers[e.data.eventName] || function () {})(e.data);
});

function onKeyDown(event) {
    var audio = document.getElementById('background-music');
    switch (event.keyCode) {
        case 32:
            if (play) {
                play = false;
                audio.pause();
            } else {
                play = true;
                audio.play();
            }
            break;
    }
}
window.addEventListener("keydown", onKeyDown, false);