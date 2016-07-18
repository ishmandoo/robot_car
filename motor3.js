

var five = require("johnny-five");


if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyAMA0"});
} else {
   var board = new five.Board();
}


board.on("ready", function() {


pwm = new five.Pin({
  pin: 9
});

forward = new five.Pin({
  pin: 8
});

backward = new five.Pin({
  pin: 7
});

backward.low()


  pwm.high()
  forward.high()

  setTimeout( function(){pwm.low(); forward.low()} ,1000)


});