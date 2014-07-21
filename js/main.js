window.setInterval(step, 50);

var STEP_DISTANCE = 2;

var player = $('.player');
var content = $('#content');
var audioEl = $('#audio')[0];
var audioSourceEl = $('#audio-source')[0];
var currentPos = 50;

player.css('bottom', 0);
player.css('left', currentPos + 'vw');

setupKey();

window.setTimeout(function() {
  audioSourceEl.src = 'audio/slurp.wav';
}, 3000);

function step() {
  if (Math.random() * 10 < 1) {
    createDrink();
  }
};

function movePlayer(stepDist) {
  currentPos = Math.min(95, Math.max(0, currentPos + stepDist));
  player.css('left', currentPos + 'vw');
};

function setupKey() {
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        movePlayer(-STEP_DISTANCE);
        break;

        case 39: // right
        movePlayer(STEP_DISTANCE);
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
  var windowCenter = $(window).width() / 2;
  $('body').on('touchstart', function(evt) {
    if (evt.originalEvent.touches[0].pageX < player.position().left) {
        movePlayer(-STEP_DISTANCE);
    } else {
        movePlayer(STEP_DISTANCE);
    }
  });
}

function createDrink() {
  var newDrink = $('<div>').addClass('drink');
  if (Math.random() * 2 < 1) {
    newDrink.addClass('water');
  } else {
    newDrink.addClass('whiskey');
  }
  var drinkY = -3;
  var drinkX = Math.random() * 100;
  var speed = Math.random() * 2 + 1;
  newDrink.css('top', drinkY + 'vh').css('left', drinkX + 'vw');
  var intervalId = window.window.setInterval(
      function() {
        drinkY += speed;
        newDrink.css('top', drinkY + 'vh');
        if (drinkY > 100) {
          window.clearInterval(intervalId);
          newDrink.remove();
        }
        if (gotDrink(newDrink)) {
          playerDrink();
          newDrink.remove();
        }
      }, 50);
  content.append(newDrink);
}

function gotDrink(drink) {
  var BUFFER = 0;
  if (drink.position().top + drink.height() > player.position().top &&
      drink.position().left + drink.width() > player.position().left - BUFFER &&
      drink.position().left < player.position().left + player.width() + BUFFER
      ) {
    return true;
  }
  return false;
}

function playerDrink() {
  player.toggleClass('drinking', true);
  audioEl.play();
  var id = window.setInterval(function() {
    player.toggleClass('drinking', false);
    window.clearInterval(id);
  }, 600);
}