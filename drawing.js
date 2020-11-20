const BACKGROUND_COLOUR = '#000000';
const LINE_COLOUR = '#FFFFFF';
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var context;
var canvas;

function prepareCanvas() {
  //console.log('Preparing canvas');
  canvas = document.getElementById('my-canvas');
  context = canvas.getContext('2d');

  context.fillStyle = BACKGROUND_COLOUR;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  context.strokeStyle = LINE_COLOUR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round';

  var isPainting = false;

  document.addEventListener('mousedown', function (event) {
      //console.log('Mouse Pressed');
      isPainting = true;
      currentX = event.pageX - canvas.offsetLeft;
      currentY = event.pageY- canvas.offsetTop;

});

  document.addEventListener('mouseup', function (event) {

      //console.log('Mouse released');
      isPainting = false;

  });
  document.addEventListener('mousemove', function (event) {
    if (isPainting) {
      previousX = currentX;
      currentX = event.pageX - canvas.offsetLeft;

      previousY = currentY;
      currentY = event.pageY- canvas.offsetTop;

      draw();
    }

  });

  canvas.addEventListener('mouseleave', function (event){
    isPainting = false;
  });

  // Touch events
  document.addEventListener('touchstart', function (event) {
      //console.log('Touchdown!');
      isPainting = true;
      currentX = event.touches[0].pageX - canvas.offsetLeft;
      currentY = event.touches[0].pageY- canvas.offsetTop;

});
canvas.addEventListener('touchend', function (event){
  isPainting = false;
});

canvas.addEventListener('touchmove', function (event) {
  if (isPainting) {
    previousX = currentX;
    currentX = event.touches[0].pageX - canvas.offsetLeft;

    previousY = currentY;
    currentY = event.touches[0].pageY- canvas.offsetTop;

    draw();
  }

});

}

function draw() {
  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}
function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}
