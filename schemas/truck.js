var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var truckSchema = Schema({
  truckName: String,
  twitterHandle: String,
  twitterURL: String,
  currentAddress: String,
  profPic: String,
  foodType: String,
  active: Boolean
});

module.exports  = mongoose.model('Truck', truckSchema);