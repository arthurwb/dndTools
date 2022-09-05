const timer = document.getElementById('stopwatch');

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;
var fart = document.getElementById("myAudio");
var battlepass = document.getElementById("myAudio-battlepass");
var color = ["#8fdba3", "#8fdbd9", "#8fa2db", "#b08fdb", "#db8fd0", "#db8f96", "#dbaf8f", "#d6db8f"]

function playSound() {
    fart.pause();
    fart.play();
    $("#output").append("<h4>Bazinga</h4>");
    let randColor = Math.floor(Math.random() * 8);
    $("#background").css("background-color", color[randColor]);
}

function startTimer() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}

function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        sec = sec + 1;

        if (sec == 60) {
            min = min + 1;
            if (min % 5 == 0 && min % 20 != 0) {
                fart.play();
                $("#output").append("<h4>Bazinga</h4>");
                let randColor = Math.floor(Math.random() * 8);
                $("#background").css("background-color", color[randColor]);
            }
            if (min % 20 == 0) {
                battlepass.play();
                $("#output").append("<h4>Bazinga</h4>");
                let randColor = Math.floor(Math.random() * 8);
                $("#background").css("background-color", color[randColor]);
            }
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
        }
        if (hr < 10 || hr == 0) {
            hr = '0' + hr;
        }

        timer.innerHTML = hr + ':' + min + ':' + sec;

        setTimeout("timerCycle()", 1000);
    }
}

function resetTimer() {
    timer.innerHTML = '00:00:00';
    stoptime = true;
    hr = 0;
    sec = 0;
    min = 0;
    $("#output").html("");
    $("#background").css("background-color", "#cccccc");
}
