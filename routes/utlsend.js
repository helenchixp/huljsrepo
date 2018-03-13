var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    /*

    // this code is execute by exec function. 
    var exec = require('child_process').exec;
    var script = exec('utlsend -f A', {
                env:
                {
                    HULPATH:'/home/guest01/hulft/hulft840js/etc',
                    HULEXEP:'/home/guest01/hulft/hulft840js/bin',
                    PATH:'/home/guest01/hulft/hulft840js/bin:'+process.env.PATH,
                }} , function(err, stdout, stderr) {

                    //ログ出力
                    console.log('HULPATH = %s', env.HULPATH);
                    console.log('PATH = %s', process.env.PATH);
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
    
     */
    var cmd = 'utlsend';
    var params = ['-f', 'A'];
    var vars = {
                    HULPATH:'/home/guest01/hulft/hulft840js/etc',
                    HULEXEP:'/home/guest01/hulft/hulft840js/bin',
                    PATH:'/home/guest01/hulft/hulft840js/bin:'+process.env.PATH,
                };
    var cb = function(err) {
        if(err !== null) {
            res.render('error');
        } else {
            res.render('about', {title: 'utlsend is successful executed!'});
        }
    };

    shellexe(cmd, params, vars, cb);    
});

var shellexe = function(cmd, params, variables,  callback) {
    var child_process = require('child_process');
    var proc = child_process.spawn(
                    cmd, params, 
                    {
                        env : variables,
                    }
                    );
    proc.on('exit', function(code) {
        console.log('cmd:' + cmd + ' ' + params);
        var err = null;
        if(code) {
            err = new Error( cmd + ' ' + params + ' is wrong! exited with status code:'+ code);
            err.code = code;
            err.cmd = cmd;
        }

        if(callback) callback(err);
    });
    proc.on('error', function(err) {
        console.error(err);
        process.exit(1);
    });
};


module.exports = router;
