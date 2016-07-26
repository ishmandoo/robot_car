var kalman  = require('./kalman.js');
var numeric = require('numeric')

kalman.predictState()


times = numeric.linspace(0,10,100);

commands = 

observations = 


for(var i = 0; i<len(times); i++){

	kalman.



}


var username = "philzook58"
var api_key = "kxdfekn4ah"

require('plotly')(username, api_key);

var data = [
  {
    x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00"],
    y: [1, 3, 6],
    type: "scatter"
  }
];
var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

