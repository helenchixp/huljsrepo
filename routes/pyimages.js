var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {
  fs.readdir('./uploads', function(err, files) {
  //fs.readdir('./public/images', function(err, files) {

  if(err) throw err;

  var fileList = [];
  files.forEach(function(file) {

     fileList.push( file);
  
  });
      
  res.render('pyimages', { title: 'Only Show the Image!', files: fileList });

  });
});


module.exports = router;

