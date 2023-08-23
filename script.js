var road_1 = document.getElementById('road-1');
var road_2 = document.getElementById('road-2');
var ball = document.getElementById('ball');
var movement = 20;
/* this is movement */

const nameOfRoad1 = "Road 1";
const nameOfRoad2 = "Road 2";
const storedWinningRoadKey = "winningRoad";
const storedHighScoreKey = "highestScore";
const scoreUp = 100;


let winningRoad;
let score;
let highestScore;
let moveX = 4;
let moveY = 2;
let border = 12;
let moveBall;
let startGame = false;


/*store key in localStorage */
localStorage.key(storedWinningRoadKey);
localStorage.key(storedHighScoreKey);

/*localStorage.setItem(storedWinningRoadKey, 'null');
localStorage.setItem(storedHighScoreKey, 'null');
*/



/* init function */
(function() {

    /* stored data in local storage */
    winningRoad = localStorage.getItem(storedWinningRoadKey);
    highestScore = localStorage.getItem(storedHighScoreKey);



    if (winningRoad === null || highestScore === null) {
        alert('This is your first Game');
        highestScore = 0;
        winningRoad = nameOfRoad1;

    } else {
        alert(winningRoad + ' has maximum score of ' + highestScore);
    }

    playGame(winningRoad);

})();


/* function  PlayGame  start*/
function playGame(roadName) {

    /* set position of both  roads  and  wall in center horizontal*/
    road_1.style.left = ((window.innerWidth - road_1.offsetWidth) / 2) + 'px';
    road_2.style.left = ((window.innerWidth - road_2.offsetWidth) / 2) + 'px';
    ball.style.left = ((window.innerWidth - ball.offsetWidth) / 2) + 'px';


    /* set ball position for losing player, and set moveY (+/-) according losing player ball */
    if (roadName === nameOfRoad1) {
        ball.style.top = road_2.getBoundingClientRect().y - road_2.getBoundingClientRect().height + "px";
        moveY = -2;

    } else if (roadName === nameOfRoad2) {
        ball.style.top = road_1.getBoundingClientRect().height + "px";
        moveY = 2;
    }
    score = 0;
    startGame = false;
}

/* add addEventListener */
document.addEventListener('keydown', function(event) {

    /* move road horizontally to right ,using a and right arrow key  */
    if (event.keyCode === 65 || event.keyCode === 39) {

        if (parseInt(road_1.style.left) < (window.innerWidth - road_1.offsetWidth - border)) {
            road_1.style.left = parseInt(road_1.style.left) + movement + "px";
            road_2.style.left = road_1.style.left;
        }
    }

    /* move road horizontally to left ,using d and left arrow key  */
    if (event.keyCode === 68 || event.keyCode === 37) {

        if (parseInt(road_1.style.left) > border) {

            road_1.style.left = parseInt(road_1.style.left) - movement + "px";
            road_2.style.left = road_1.style.left;
        }
    }


    /* start game  when click 'Enter' key */
    if (event.keyCode === 13) {

        if (!startGame) {
            startGame = true;
            let ballRectObj = ball.getBoundingClientRect();
            let ballX = ballRectObj.x;
            let ballY = ballRectObj.y;
            let ballWidth = ballRectObj.width;


            let road1Height = road_1.offsetHeight;
            let road1Width = road_1.offsetWidth;
            let road2Height = road_2.offsetHeight;
            let road2Width = road_2.offsetWidth;


            /* moving ball function */
            moveBall = setInterval(function() {

                let road1X = road_1.getBoundingClientRect().x;
                let road2X = road_2.getBoundingClientRect().x;
                let ballCenterX = ballX + ballWidth / 2;

                /* set movement  wall in X and Y direction ( or left and top of wall)*/
                ballX += moveX;
                ballY += moveY;

                ball.style.left = ballX + "px";
                ball.style.top = ballY + "PX";


                /* if wall touch in right side or left side then chang  horizontally move respectively */
                if (parseInt(ballX) > parseInt(window.innerWidth - ballWidth) || ballX < 0) {
                    moveX = -moveX;
                }



                /* if wall  touch on  top side   then change direction  of ball */
                if (ballY <= road1Height) {
                    moveY = -moveY;
                    score += scoreUp;

                    /*  if Road 1 can not touch wall,then consider goal and call..storeData */
                    if ((ballCenterX < road1X) || (ballCenterX > (road1X + road1Width))) {
                        storeData(nameOfRoad2, score);
                    }
                }


                /* if wall  touch on bottom border then change direction of ball */
                if (ballY + ballWidth >= (window.innerHeight - road2Height)) {
                    moveY = -moveY;
                    score += scoreUp;

                    /*  if Road 2 can not touch wall,then consider goal and call..storeData */
                    if ((ballCenterX < road2X) || ballCenterX > (road2X + road1Width)) {
                        storeData(nameOfRoad1, score);
                    }
                }

            }, 20);

        }
    }

});


/* function for reset game */
function resetGame(winnerRoad) {
    playGame(winnerRoad);
}


/* function for store high score and winning road in local storage and show alert message */
function storeData(winnerRoad, currentScore) {

    if (currentScore > highestScore) {
        highestScore = currentScore;
        localStorage.setItem(storedWinningRoadKey, winnerRoad);
        localStorage.setItem(storedHighScoreKey, currentScore);
    }

    alert(winnerRoad + " wins with a score of " + currentScore + ". Max score is " + highestScore);
    clearInterval(moveBall);
    resetGame(winnerRoad);
}