exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
      global.env.loginUser = req.session.user;
      next(); 
    } else {
     global.env.loginUser = '';
     res.redirect('login');
    }
};

global.env = {
  mongoURL : 'mongodb://127.0.0.1:27017/hulagent',
  sqlite3path : '/home/guest01/hulft/hulft840',
  loginUser : ''
};

