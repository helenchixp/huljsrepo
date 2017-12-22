var express = require('express');
var router = express.Router();
//var exec = require('child_proess').exec; 

router.post('/', function(req, res) {
   //res.send('UTLSEND');
   //console.log('UTLSEND .. .. ');
   var exec = require('child_process').exec;
   var script = exec('sh hulshell/snd.sh', function(err, stdout, stderr) {

                    //ログ出力
                    console.log('stdout : %s', stdout);
                    console.log('stderr : %s', stderr);
                    
		    if(err !== null) {
                      console.log('exec error : %s', err);
                      res.render('error');
                    }
                    else {
                       res.render('about', {title: '配信完了'});
                       console.log('send success!!!!');
                    }
                 });
    
});

module.exports = router;
