var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
		destination: function (req, file, cb) {
                  console.log('  #### re: path' );
                  cb(null, './uploads');  
                } ,
                filename: function (req, file, cb) {
                  cb(null, file.originalname);
		}
	      });
var upload = multer({
                dest:'./uploads/',
                /*
                rename: function(fieldname, filename) {
                   return fieldname + '_' + filename;
                },
                onFileUploadStart: function (file) {
                    console.log(file.originalname + ' is starting ...')
                },*/
                storage: storage
                /*
                onFileUploadData : function(file, data,req, res) {
                  console.log('  ****  '+data.toString() + ' ' + file);
                },
                onFileUploadComplete: function (file, req, res) {
                  console.log(file.fieldname + ' uploaded to  ' + file.path)
                }
                */
             }).single('thumbnail');

var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Upload file!!!', message: 'message!!!!!' });
});


router.post('/', function(req, res) {
  upload(req, res, function(err) {
    if(err) {
       throw err;
    }
    console.log(' ---------   ' + req.file.originalname ); 
    console.log(' ---------   ' + req.file.path);
    res.render('upload', { title: 'POST filename!!!' + req.body.filename, message: 'message!!!!!' });
  });
});

/*
router.post('/', upload.single('thumbnail'), function(req, res, next) {

  //var target_path, temp_path;
  console.log(' ---------   ' + req.body.thumbnail );
  console.log(' ---------   ' + req.body.filename ); 
  console.log(' ---------   ' + req.files );
 
  res.render('upload', { title: 'POST filename!!!' + req.body.filename, message: 'message!!!!!' });
*/
/*
  temp_path = req.files.thumbnail.path;
  target_path = './uploads/' + '001.png'; //req.files.thumbnail.name;
  
  console.log(' Uploaded File from: ' + temp_path);
*/
/*
  res.render('upload', { title: 'Upload file!!!', message: 'message!!!!!' });

  fs.rename(temp_path, target_path, function(error) {
     if(error) {
        throw error;
     }
 
     fs.unlink(temp_path, function() {
        if(error) {
           throw error;
        }
        res.render('upload', { title: 'Uploaded file!!!', message: 'filename' });
        console.log('POST Upload File: ' + target_path);
     });
  }); 
*/
//  console.log(' Uploaded File from: ' + temp_path);
/*  
});
*/
module.exports = router;

