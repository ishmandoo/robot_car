var XboxController = require('xbox-controller');
var xbox = new XboxController;

var io = require('socket.io-client'),
socket = io.connect('192.168.0.55', {
    port: 3000
});


socket.on('connect', function () { console.log("socket connected"); });
socket.emit('private message', { user: 'me', msg: 'whazzzup?' });

xbox.on('a:press', function (key) {
	socket.emit('drive');
  	console.log(key + ' press');
});

xbox.on('b:release', function (key) {
  console.log(key+' release');
});

xbox.on('lefttrigger', function(position){
  console.log('lefttrigger', position);
});

xbox.on('righttrigger', function(position){

  console.log('righttrigger', position);
});

xbox.on('left:move', function(position){
  console.log('left:move', position);
});

xbox.on('right:move', function(position){
  console.log('right:move', position);
});

xbox.on('connected', function(){
  console.log('Xbox controller connected');
});

xbox.on('not-found', function(){
  console.log('Xbox controller could not be found');
});