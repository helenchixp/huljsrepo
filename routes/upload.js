var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Upload file!!!', message: 'message!!!!!' });
});

router.post('/', function(req,res) {
  //print in console
  res.send('Upload.js POST!!!')
  console.log('POST Upload')

});

/*
router.get('/', function(req, res) {
  res.send('upload test');
});

var fs;

fs = require('fs');

router.post = function(req, res) {
  var target_path, tmp_path;
  tmp_path = req.files.thumbnail.path;
  target_path = './uploads/' + req.files.thumbnail.name;
  fs.rename(tmp_path, target_path, function(err) {
    if (err) {
      throw err;
    }
    fs.unlink(tmp_path, function() {
      if (err) {
        throw err;
      }
      res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
    });
  });
};
*/
module.exports = router;

