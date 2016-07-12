var five = require("johnny-five");
var board = new five.Board({
  port: "/dev/ttyUSB0"
});

board.on("ready", function() {

  var led = new five.Led(13);

  // "blink" the led in 500ms on-off phase periods
  led.blink(500);
});
