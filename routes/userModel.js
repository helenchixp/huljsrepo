var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/hulagent';

var db  = mongoose.createConnection(url, function(err, res){
    if(err){
        console.log('Error connected: ' + url + ' - ' + err);
    }else{
        console.log('Success connected: ' + url);
    }
});

//define the schecma for user
var UserSchema = new mongoose.Schema( {
  username: String,
  password: String
}, {
  collection: 'user'
});

exports.User = db.model('User', UserSchema);
