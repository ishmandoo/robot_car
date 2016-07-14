var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app.use('/', express.static('client'));



app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('listening on http://localhost:3000');
});


/////////////////////

var five = require("johnny-five");
if (process.env.node_env == "production") {
   var board = new five.Board({port: "/dev/ttyS0"});
} else {
   var board = new five.Board();
}


board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {
  	/*
    console.log("temperature");
    console.log("  celsius      : ", this.temperature.celsius);
    console.log("  fahrenheit   : ", this.temperature.fahrenheit);
    console.log("  kelvin       : ", this.temperature.kelvin);
    console.log("--------------------------------------");

    console.log("accelerometer");
    console.log("  x            : ", this.accelerometer.x);
    console.log("  y            : ", this.accelerometer.y);
    console.log("  z            : ", this.accelerometer.z);
    console.log("  pitch        : ", this.accelerometer.pitch);
    console.log("  roll         : ", this.accelerometer.roll);
    console.log("  acceleration : ", this.accelerometer.acceleration);
    console.log("  inclination  : ", this.accelerometer.inclination);
    console.log("  orientation  : ", this.accelerometer.orientation);
    console.log("--------------------------------------");

    console.log("gyro");
    console.log("  x            : ", this.gyro.x);
    console.log("  y            : ", this.gyro.y);
    console.log("  z            : ", this.gyro.z);
    console.log("  pitch        : ", this.gyro.pitch);
    console.log("  roll         : ", this.gyro.roll);
    console.log("  yaw          : ", this.gyro.yaw);
    console.log("  rate         : ", this.gyro.rate);
    console.log("  isCalibrated : ", this.gyro.isCalibrated);
    console.log("--------------------------------------");
    */
    if(io){
  		if(io.sockets){
  			io.sockets.emit('imu_update', this.accelerometer.x);
  		}
  	}


  });

  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);
  var motor3 = new five.Motor(configs.M3);
  var motor4 = new five.Motor(configs.M4);

  io.on('connection', function(socket){
  	console.log('a user connected');
  	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});

  	socket.on('drive', function(){
  		console.log('driving')
			motor1.start(100);
  		motor3.start(-100);
  		setTimeout( function () {
				motor1.start(100);
  			motor3.start(-100);
  		}, 1000 );
  	});

	});


  

});