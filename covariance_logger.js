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
      rx: 11,
      tx: 10,
    }
  });

  // If latitude, longitude change log it
  gps.on("change", function() {
    gps_log.push({lat: this.latitude, lon: this.longitude})
  });
/*
  var magnetometer = new five.Magnetometer();

  magnetometer.on("change",function(){
    magnetometer_log.push({angle: this.heading})
  });
*/

  setTimeout(function () {
    var lat_list = gps_log.map(function (entry) { return entry.lat });
    var lon_list = gps_log.map(function (entry) { return entry.lon });
    var heading_list = gps_log.map(function (entry) { return entry.heading });
    console.log(variance(lat_list));
    console.log(variance(lon_list));
    console.log(variance(heading_list));
  }, 5000);


  function mean(list) {
    return list.reduce(function (sum, entry) {return sum + entry}, 0) / list.length;
  }

  function variance(list) {
    var list_mean = mean(list);
    var residual_squared_list = list.map(function (entry) {return (entry - list_mean) * (entry - list_mean)});
    var sum_residual_squared = residual_squared_list.reduce(function (entry, sum) {return entry + sum}, 0)
    return Math.sqrt(sum_residual_squared / list.length);
  }


});
