
var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function() {
  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);
  var motor3 = new five.Motor(configs.M3);
  var motor4 = new five.Motor(configs.M4);

  // Start the motor at maximum speed
  motor1.start(100);
  motor3.start(100);

});
