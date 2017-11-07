var STARTING_FISH_COUNT = 0;

// globals
var $count, $pond, pondWidth, pondHeight;

// on document ready
$(function() {
  // setup
  $count = $('.count');
  $pond = $('.pond');
  determinePondSize();
  
  // events
  $(window).on('resize', determinePondSize);
  
  // fill the pond
  spawnStartingFish();
});

function determinePondSize() {
  pondWidth = $pond.width();
  pondHeight = $pond.height();
}  

function spawnStartingFish(qtd) {
  for (var i = 0; i < qtd; i++) {
    spawnFish(getRandom(pondWidth), getRandom(pondHeight),1);
  }
}

function spawnMany(qtd,tipo) {
  var cor = 2;
  if(tipo.toLowerCase() == 'filhote'){
    cor = 2;
  }else if(tipo.toLowerCase() == 'adulto'){
    cor = 1;
  }
  for (var i = 0; i < qtd; i++) {
    spawnFish(getRandom(pondWidth), getRandom(pondHeight),cor);
  }
}

//metodo que adiciona o peixe ao clicar na tela, removido o evento que chama este metodo
function stirPond(event) {
  spawnFish(event.clientX, event.clientY);
}

function spawnFish(x, y,cor) {
  // setup fish
  var $fish = $('<div class="fish"><div class="fish-bob"><div class="fish-direction"><div class="fish-body"></div></div></div></div>');

  $fish.addClass('fish-' + cor);
  if (getRandom(2) < 1) {
    $fish.addClass('fish-flip');
  }
  $fish.find('.fish-bob').css('animation-delay', '-' + getRandom(7) + 's');
  //$fish.find('.fish-body').on('click', pokeFish.bind(this, $fish));
  positionFish($fish, x, y);
  
  // let fish go
  $pond.append($fish);
  setTimeout(doFishyThings.bind(this, $fish), getRandom(10000))
  $count.text($('.fish').length);
}

function pokeFish($fish) {
  $fish.toggleClass('fish-spin');
  return false;
}

function doFishyThings($fish) {
  blowBubble($fish);
  moveFish($fish);
  
  var timeout = $fish.data('timeout');
  clearTimeout(timeout);
  timeout = setTimeout(doFishyThings.bind(this, $fish), 10000 + getRandom(6000));
  $fish.data('timeout', timeout);
}

function blowBubble($fish) {
  var $bubble = $('<div class="bubble">');
  if ($fish.hasClass('fish-flip')) {
    $bubble.addClass('bubble-flip');
  }

  var x = $fish.data('x');
  var y = $fish.data('y');
  $bubble.css({ top: y + 'px', left: x + 'px' });

  $pond.prepend($bubble);
  setTimeout(popBubble.bind(this, $bubble), 4000);
}

function moveFish($fish) {
  var x = getRandom(pondWidth);
  var y = getRandom(pondHeight);
  
  if (x < $fish.data('x')) {
    $fish.addClass('fish-flip');
  } else {
    $fish.removeClass('fish-flip');
  }
  positionFish($fish, x, y);
}

function positionFish($fish, x, y) {
  $fish
    .css('transform', 'translate(' + x + 'px, ' + y + 'px)')
    .data('x', x)
    .data('y', y); 
}

function popBubble($bubble) {
  $bubble.remove();
}

function getRandom(upper) {
  return Math.random() * upper;
}