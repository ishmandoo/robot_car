var five = require("johnny-five");
var fs = require('fs');


if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyAMA0"});
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
console.log(this.latitude);
    gps_log.push({lat: this.latitude, lon: this.longitude})
  });


  gps.on("unknown", function() {
    console.log("unknown gps message");
  });

  gps.on("acknowledge", function() {
    console.log("ack gps message");
  });


/*

  var magnetometer = new five.Magnetometer();

  magnetometer.on("change",function(){
    magnetometer_log.push({angle: this.heading})
  });
*/

  setTimeout(function () {

    avg = magnetometer_log.reduce(function(sum, heading) {
	return sum + (heading.angle)
    },0) / magnetometer_log.length;

    variance = magnetometer_log.reduce(function(sum, heading) {
	return sum + ((heading.angle - avg) * (heading.angle - avg))
    },0) / magnetometer_log.length;
    
    loc_sum = gps_log.reduce(function(sum, loc) {
	console.log(loc);
	return {lat: sum.lat + loc.lat, lon: sum.lon + loc.lon};
    },0);

    avg_sum = {lat: loc_sum.lat / gps_log.length, lon: loc_sum.lon / gps_log.length}

    console.log(avg_sum);
    //fs.writeFile("covarance.json", {gps: gps_log, magnetometer: magnetometer_log}, function (err) {
    //  if (err) return console.log(err);
    //  console.log('Hello World > helloworld.txt');
    //});
  }, 5000);

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
