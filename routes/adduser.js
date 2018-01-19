var express = require('express');
var router = express.Router();
var model = require('./userModel');
var User = model.User;
var assert = require('assert');

/*
router.get('/', function(req, res) {
  res.send('Please wait....');
});
*/
router.post('/', function(req, res) {
  var username = req.body.username,
      password = req.body.password;
  console.log('   ....... add user....' + req.body.hideusername + ' password: ' + req.body.password);
  if(req.body.hideusername) {
    User.update( {username : username},
                 {$set: {password : password}},
                 {upsert:false, multi : true},
                 function(err, numAffected) {
      if(err) { throw err; }
      console.log('${numAffected}:' + typeof numAffected );
      res.redirect('/list');
    });
  }
  else {
    console.log(' NEW USER  ' + username);

    User.findOne({username : username})
        .exec(function(err, user) {
          if(err) throw err;
          if(!user) {
            user = new User({
                username : username,
                password : password
              });
            user.save().then(function(doc) {
                console.log( "ADDed NEW USER! " + doc.username);
                res.redirect('/list');
              });
              
          }
          else {
             var err = new Error(username + ' is existed!!!');
             err.status = 600;
             //throw err;
             res.locals.message = err.message;
             res.locals.error = err;
             res.status(err.status);
             res.render('error');
          }
        } );

    

    /*
    //use the Model to save it
    var user = new User({
      username : req.body.username,
      password : req.body.password
    });

    var promise = user.save();
    console.log(typeof promise);
    //assert.ok(promise instanceof Promise);
    promise.then(function(doc) {
       asser.equal(doc.username, req.body.username);
       res.redirect('/list');
    });
    */

    /*
    // mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
    user.save(function(err) {
      if(err) { throw err; }
      console.log('add the ' + user.username);
      return res.redirect('/list');
    });
    */

    /*
    var user = {
      username : req.body.username,
      password : req.body.password,
    };
    
    User.create(user, function( err, user) {
      if(err) { throw err; }
      else {
        return res.redirect('/list');   
      } 
    }); 
    */
  }
  /*
  else {
    User.update( {username : req.body.username}, 
                 {$set: {password : req.body.password}},
                 {upsert:false, multi : true},
                 function(err, numAffected) {
      if(err) { throw err; }
      console.log('${numAffected}:' + numAffected.password );
      res.redirect('/list');
    });
  }
  */
});

//var collection = require('./mongo');
/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('login', { title: '管理者ページ・ログイン' });
  // res.send('Login is Stopping!!');
});

*/
/*
router.post('/', function(req, res, next) {
  collection('user').find({
      username : req.body.username,
      password : req.body.password
  }, function(docs) {
    if(docs.length > 0) {
      res.redirect('/list');
    } else {
      res.render('login', { 
          //title: 'Login', 
          title: '管理者ページ・ログイン',
          message : 'ユーザ名・パスワードは不正です。'
      });
    }
  });
});
*/
module.exports = router;
