
var five = require("johnny-five");

if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyS0"});
} else {
   var board = new five.Board();
}


board.on("ready", function() {


    var magnetometer = new five.Magnetometer();

  magnetometer.on("change",function(){

        console.log(this.raw);
        console.log(this.scaled);
        console.log(this.heading);
 

});