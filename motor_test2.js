
var five = require("johnny-five");


if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyAMA0"});
} else {
   var board = new five.Board();
}


board.on("ready", function() {


  motor = new five.Motor({
    pins: {
      pwm:9,
      dir:8,
      cdir: 7  
    }
  });
console.log(motor);
  motor.forward(255);
  //setTimeout( function(){motor.stop()} ,1000)


});
