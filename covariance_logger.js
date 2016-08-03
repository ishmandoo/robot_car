var five = require("johnny-five");
var fs = require('fs');


if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyS0"});
} else {
   var board = new five.Board();
}

board.on("ready", function() {

  var gps_log = [];
  var magnetometer_log = [];

  /*
   * This is the simplest initialization
   * We assume SW_SERIAL0 for the port
   */
  var gps = new five.GPS({
    pins: {
      rx: 2,
      tx: 13,
    }
  });

  // If latitude, longitude change log it
  gps.on("change", function() {
    gps_log.push({lat: this.latitude, lon: this.longitude})
  });

  var magnetometer = new five.Magnetometer();

  magnetometer.on("change",function(){
    magnetometer_log.push({angle: this.heading})
  });


  setTimeout(function () {
    fs.writeFile("covarance.json", {gps: gps_log, magnetometer: magnetometer_log}, function (err) {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
    });
  }, 60000);



});
