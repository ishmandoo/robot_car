var kalman  = require('./kalman.js');
var numeric = require('numeric')

times = numeric.linspace(0,10,100);

controls = times.map(function(time) {return {speed: 1, direction: 0}}); //creates null array of correct length and maps to replace every entry with a valid command

measurements = times.map(function(time) {return {gps: {x: time * 1 + Math.random() * 0.1, y:0}, magnetometer: {theta: 0}}});

var ys = [];

var state = {x: 0, y: 0, theta: 0};
var predicted_state = state;
var covariance = numeric.identity(3);
var predicted_covariance = covariance;

for(var i = 1; i<times.length; i++){
	var prediction = kalman.predict(state, controls[i], covariance, times[i] - times[i-1])
	predicted_state = prediction.state;
	predicted_covariance = prediction.covariance;




	var update = kalman.update(predicted_state, predicted_covariance, measurements[i]);
	state = update.state;
	covariance = update.covariance;

	ys.push(state.x);
}


var username = "philzook58"
var api_key = "kxdfekn4ah"

var plotly = require('plotly')(username, api_key);

var data = [
  {
    x: times,
		y: ys,
		type: 'scatter'
  },
	{
		x: times,
		y: measurements.map(function (measurement) { return measurement.gps.x}),
		type: 'scatter'
	},
];
var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
