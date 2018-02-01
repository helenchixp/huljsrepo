var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {
  fs.readdir('./public/images', function(err, files) {

  if(err) throw err;

  var fileList = [];
  files.forEach(function(file) {

     fileList.push( file);
    // return fs.statSync(file).isFile() && /.*\.*$/.test(file);  
     // filter : 
     // return fs.statSync(file).isFile() && /.*\.csv$/.test(file); 
  
  });

  res.render('pyimages', { title: 'Python Image!', files: fileList });

  });
});


module.exports = router;

