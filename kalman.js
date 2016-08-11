var numeric = require("numeric")

module.exports = {predict: predict, update: update};

/*
var state = {x: 0, y: 0, theta: 0}
var predicted_state = state;
var covariance = nuermic.identity();
var predicted_covariance = covariance;
*/
//var control = {speed: 0, direction: 0}
var constants = {
  turning_radius: 1,
  top_speed: 1,
  Q: [[1*1,0,0],[0,1*1,0],[0,0,3.14*3.14]], // set diagonals to best guesses in uncertainty squared in x, y, theta after one second
  R: [[10*10,0,0],[0,10*10,0],[0,0,0.157*0.157]]
}

var start_gps = {};

function predict(state, control, covariance, dt) {
  var predicted_state = predictState(state, control, dt);
  var predicted_covariance = predictCovariance(covariance, state, control, dt);
  return {state: predicted_state, covariance: predicted_covariance}
}

function update(predicted_state, predicted_covariance, measurement) {
  var state = findStateEstimate(predicted_state, predicted_covariance, measurement);
  var covariance = findCovarianceEstimate(predicted_covariance);
  return {state: state, covariance: covariance}
}


function predictState(state, control, dt) {
  var new_state = {};
  new_state.x = state.x + control.speed * Math.cos(state.theta) * dt;
  new_state.y = state.y + control.speed * Math.sin(state.theta) * dt;
  new_state.theta = state.theta + (control.speed * convertDir(control.direction) * dt) / constants.turning_radius;
  return new_state;
}

function predictCovariance(covariance, state, control, dt) {
  var F = [
    [1, 0, control.speed * (-1 * Math.sin(state.theta)) * dt],
    [0, 1, control.speed * ( 1 * Math.cos(state.theta)) * dt],
    [0, 0, 1]
  ]
  var F_transpose = numeric.transpose(F);
  var FP = numeric.dot(F, covariance);
  var FPF = numeric.dot(FP, F_transpose);

  var Qdt = constants.Q.map(function(row) {
    return row.map(function(entry) {
      return entry * dt;
    });
  });

  return numeric.add(FPF, Qdt);
}

function findMeasurementResidual(state, measurement) {
  var residual = {};
  residual.x = measurement.gps.x - state.x; //measurements are calibrated and normalized elsewhere
  residual.y = measurement.gps.y - state.y;
  residual.theta = measurement.magnetometer.theta - state.theta;
  return residual;
}

function findKalmanGain(covariance) {
  var H = getH();
  var H_transpose = numeric.transpose(H);
  var HP = numeric.dot(H, covariance);
  var HPH = numeric.dot(HP, H_transpose);

  var S = numeric.add(HPH, constants.R);
  var PH = numeric.dot(covariance, H_transpose);

  var K = numeric.dot(PH, numeric.inv(S));
  return K;
}

function findStateEstimate(state, covariance, measurement) {
  var new_state = {};
  var K = findKalmanGain(covariance);
  var y = vectorifyObservation(findMeasurementResidual(state, measurement));
  var Ky = statify(numeric.dot(K, y));

  new_state.x = state.x + Ky.x;
  new_state.y = state.y + Ky.y;
  new_state.theta = state.theta + Ky.theta;
  return new_state;
}

function findCovarianceEstimate(covariance) {
  var new_covariance = {};
  var K = findKalmanGain(covariance);
  var H = getH()

  var KH = numeric.dot(K, H)

  var P = numeric.dot(numeric.sub(numeric.identity(3), KH), covariance)

  return P;
}


function time() {
  var date = new Date();
  return date.getTime();
}

function getH() {
  return [
    [1,0,0],
    [0,1,0],
    [0,0,1]
  ]
}

function vectorify(state) {
  return [state.x, state.y, state.theta];
}

function vectorifyObservation(observation) {
  return [observation.x, observation.y, observation.theta];
}

function statify(vector) {
  return {x: vector[0], y: vector[1], theta: vector[2]};
}

function convertDir(direction_string) {
  switch(direction_string) {
    case "right":
      return -1;
      break;
    case "left":
      return 1;
      break;
    case "straight":
      return 0;
      break;
    default:
      return 0;
  }
}
