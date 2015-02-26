var jwt = require("jsonwebtoken");
var Truck = require('../schemas/truck');
var User = require('../schemas/user');

module.exports = function () {

  var functions = {};

  functions.trucks = function (req, res) {
    // TruckSchema.find()
    Truck.find()
      .setOptions({sort: 'truckName'})
      .exec(function(err, trucks) {
      if (err) {
        res.status(500).json({status: 'failure'});
      } else {
        res.json(trucks);
      }
    });
  };

  functions.createTruck = function (req, res) {

        var record = new Truck({
          truckName: trukName,
          twitterHandle: twitHandle,
          twitterURL: twitURL,
          foodType: Type,
          profPic: img
        });

        record.save(function(err) {
          if (err) {
            res.status(500).json({status: err});
          }
        });
    };

  functions.users = function (req, res) {
    User.find()
      .setOptions({sort: 'name'})
      .exec(function(err, users) {
      if (err) {
        res.status(500).json({status: 'failure'});
      } else {
        res.json(users);
      }
    });
  };

  functions.authenticate = function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
  };

  functions.signin = function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, 'shhhhh');


                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                });
            }
        }
    });
  };

  functions.meTrucks = function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }

        if (user) {
          Truck.find({ _id: {$in: user.trucksFollowing }}, function(err, trucks){
            res.json(trucks);
          });
        }


    });
  };

  functions.me = function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
  };

  functions.ensureAuthorized = function(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // res.send(403);
        res.status(403).end();
    }
};

  functions.updateTruck = function (req, res) {

    for(var i =0; i < trucks.length; i++){
      var handle = trucks[i].handle;
      var address = trucks[i].address;

        Truck.update({ twitterHandle: handle },
          { $set: { currentAddress: address}},
            function (err) {
              if (err) {
                res.status(500).json({status: 'failure'});
              } else {
                res.json({status: 'success'});
              }
            }
      );
    }
  };

  functions.deleteTruck = function (req, res) {

    var id = req.param('id');

    Truck.remove({_id: id}, function (err) {
      if (err) {
      }
    });
  };

  functions.followTruck = function (req, res) {
    var truckId = req.param('truckId');

    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }

        if (user) {

          var userId = user._id;
          User.update({_id: userId}, { $push: {trucksFollowing: truckId}}, {}, function(err) {
            if (err)
              res.send(err);
          });
        }
    });
  };

  functions.showFollowedTrucks = function (req, res) {
    var userID = req.param('id');

    User.findOne({ _id: userID}, function( err, user){
      if (err){
        res.status(404).json({status: err});
      }
      if (user) {
        Truck.find({ _id: {$in: user.trucksFollowing }}, function(err, trucks){
          res.json(trucks);
        });
      }
    });
  };

  functions.list = function (req, res) {
    res.json(trucks);
  };

  return functions;
};
