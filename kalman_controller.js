var kalman  = require('./kalman.js');

var five = require("johnny-five");
if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyAMA0"});
} else {
   var board = new five.Board();

}

var starting_measurement = {};
var latest_measurement = {gps: {delta_longitude: 0, delta_latitude: 0, x: 0, y:0}, magnetometer: {theta:0}};
var earth_radius_meters = 6371000;

var state = {x: 0, y: 0, theta: 0};
var predicted_state = state;
var covariance = numeric.identity(3);
var predicted_covariance = covariance;

var xs = [0];
var ys = [0];

board.on("ready", function() {
  var starting_time = time();
  var prev_time = starting_time;

  motor = new five.Motor({
    pins: {
      pwm:9,
      dir:8,
      cdir: 7
    }
  });

  var gps = new five.GPS({
    pins: {
      rx: 2,
      tx: 13,
    }
  });

  var magnetometer = new five.Magnetometer();

  magnetometer.on("change",function(){
      if (!starting_measurement.theta) {
        starting_measurement.theta = this.heading;
      }
      latest_measurement.magnetometer.theta = this.heading;// - starting_measurement.theta;
  });

  gps.on("change", function() {
      if (!starting_measurement.gps) {
        starting_measurement.gps.longitude = this.longitude;
        starting_measurement.gps.latitude = this.latitude;
      }
      latest_measurement.gps.delta_longitude = this.longitude - starting_measurement.gps.delta_longitude;
      latest_measurement.gps.delta_latitude = this.latitude - starting_measurement.gps.delta_latitude;

      latest_measurement.gps.y = earth_radius_meters * (latest_measurement.gps.delta_latitude * Math.pi / 180);
      latest_measurement.gps.x = earth_radius_meters * (Math.Sin(this.latitude * Math.pi / 180)) * (latest_measurement.gps.delta_longitude * Math.pi / 180);

  });

  setInterval(function () {drive(getControl(dt(starting_time)))}, 100);

  setInterval(function () {
    var prediction = kalman.predict(state, getControl(dt(starting_time)), covariance, dt(prev_time))
    predicted_state = prediction.state;
    predicted_covariance = prediction.covariance;

    var update = kalman.update(predicted_state, predicted_covariance, latest_measurement);
    state = update.state;
    covariance = update.covariance;

    xs.push(predicted_state.x);
    ys.push(predicted_state.y);

    previous_time = time();

  }, 100);

  setTimeout(function () {
    var username = "philzook58"
    var api_key = "kxdfekn4ah"

    var plotly = require('plotly')(username, api_key);

    var data = [
      {
        x: xs,
        y: ys,
        type: 'scatter'
      },
    ];

    console.log(data);
    var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
    plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
    });
  },10000)
});

function drive(control) {
  console.log(control.speed);
  motor.forward(Math.floor(control.speed * 255));
}


function getControl(time) {
  console.log(time);
  if (time < 5) {
    return {speed: 1, direction: 0};
  } else {
    return {speed: 0, direction: 0}
  }
}

function time() {
  var date = new Date();
  return date.getTime();
}

function dt(t0){
  return  (time() - t0) / 1000;
}
