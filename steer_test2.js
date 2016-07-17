


var five = require("johnny-five");


if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyAMA0"});
} else {
   var board = new five.Board();
}


board.on("ready", function() {


left = new five.Pin({
  pin: 6
});

  left.high()
  setTimeout( function(){left.low()} ,1000)


});



