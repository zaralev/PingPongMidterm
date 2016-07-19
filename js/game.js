// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;
})();

// DO NOT TOUCH CODE ABOVE

// Step 01 .. jwt .. Create game canvas and track mouse position
var gameCanvas = document.getElementById('canvas'); // Store HTML5 canvas tag into a JS variable

var ctx = gameCanvas.getContext('2d'); // Create context 2D

var W = window.innerWidth;
var H = window.innerHeight;
var mouseObj = {};

gameCanvas.width = W;
gameCanvas.height = H;

// Step 02 .. jwt .. Clear page canvas by covering it in black.

function paintCanvas() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
}

paintCanvas();

function trackPosition(evt) {
    mouseObj.x = evt.pageX;
    mouseObj.y = evt.pageY;
    // console.log("cursor x is : " + mouseObj.x + "cursor y is : " + mouseObj.y);
}

gameCanvas.addEventListener("mousemove", trackPosition, true);


// Step 03 .. jwt .. Place a ball on the canvas
var ball = {}; // Ball Object
ball = {
    x: 50,
    y: 50,
    r: 5,
    c: "#fff",
    vx: 8,
    vy: 4,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

ball.draw();


// Step 04 .. jwt .. Place a start button on canvas
var startBtn = {}; // Start button object
startBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 25,

    draw: function() {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("START", W / 2, H / 2);
    }
}

startBtn.draw();

// Step 05 .. jwt .. Place score and points on canvas
var points = 0; // game points
function paintScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("SCORE: " + points, W / 2 - 43, 20);

}

paintScore();

// Step 06 .. jwt .. Place paddles (top and bottom) on canvas
function paddlePosition(TB) {
    this.w = 5;
    this.h = 150;

    this.y = H / 2 - this.h / 2; // Takes width of browser window/2 and paddle /2 to position completely in the center of the screen
    if (TB == "top") {
        this.x = 0;
    } else {
        this.x = W - this.w;
    }
    // this.y = (TB == "top") ? 0 : H - this.h;   // Another way to write if/else statement
}

var paddlesArray = []; // Paddles Array
paddlesArray.push(new paddlePosition("top"));
paddlesArray.push(new paddlePosition("bottom"));
// console.log("top paddle y is: " + paddlesArray[0].y);
// console.log("bottom paddle y is: " + paddlesArray[1].y);

function paintPaddles() {
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        if (lp == 0) {
            ctx.fillStyle = "#f00";
        } else {
            ctx.fillStyle = "#00f";
        }

        // ATTEMPT AT REDUCING SIZE OF PADDLES
        // if (points > 0 && points % 4 === 0) {
        //     p.h -= 4;
        // }

        ctx.fillRect(p.x, p.y, p.w, p.h);

    }
}
paintPaddles();

// Step 07 .. jwt .. Detect when the user clicks on the screen

gameCanvas.addEventListener("mousedown", btnClick, true);

function btnClick(evt) {
    var mx = evt.pageX;
    var my = evt.pageY;

    // User clicked on start button
    if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
        if (my >= startBtn.y && my <= startBtn.y + startBtn.h) {
            // console.log("start button clicked");
            // Delete the start button
            startBtn = {};

            // Start Game animation loop
            animloop();
        }
    }
}

// Function for running the whole game animation
var init; // Variable to intialize animation
function animloop() {
    init = requestAnimFrame(animloop);
    refreshCanvasFun();
}

// Step 08 .. jwt .. Draw everything on canvas over and over again
function refreshCanvasFun() {
    paintCanvas();
    paintPaddles();
    ball.draw();
    paintScore();
    update();
}

function update() {
    // move the paddles, track the mouse
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        p.y = mouseObj.y - p.h / 2; // centered to where mouse position is
    }
    // move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    // Check for ball paddle collision
    check4collision();
}

function check4collision() {
    var pTop = paddlesArray[0];
    var pBot = paddlesArray[1];

    if (collides(ball, pTop)) {
        collideAction(ball, pTop);
    } else if (collides(ball, pBot)) {
        collideAction(ball, pBot);
    } else {
        // Ball went off the top or bottom of screen
        if (ball.x + ball.r > W) {
            // Game over
        } else if (ball.x < 0) {
            // Game over
        }
        // Ball hits the side of screen
        if (ball.y + ball.r > H) {
            ball.vy = -ball.vy;
            ball.y = H - ball.r;
        } else if (ball.y - ball.r < 0) {
            ball.vy = -ball.vy;
            ball.y = ball.r;
        }
    }
}

var paddleHit; // Which paddle was hit 0 = top, 1 = bottom
function collides(b, p) {
    if (b.y + b.r >= p.y && b.y - b.r <= p.y + p.h) {
        if (b.x >= (p.x - p.w) && p.x > 0) {
            paddleHit = 0;
            return true;
        } else if (b.x <= p.w && p.x === 0) {
            paddleHit = 1;
            return true;
        } else {
            return false;
        }
    }
}

var collisionSnd = document.getElementById("collide");

function collideAction(b, p) {
    // console.log("sound and then bounce");
    collisionSnd.play();
    // reverse ball y velocity
    ball.vx = -ball.vx;
    // increase the score by 1
    points++;
}
