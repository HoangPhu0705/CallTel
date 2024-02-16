


class AuthMiddleware {
  notFound(req,res){
    res.render('error404', {layout: false});
  }
  auth(req, res, next) {
    if (!req.isAuthenticated()) {
      next();
    } 
    else {
      res.redirect('/login');
    }
  }
  firstLogin(req,res,next){
    if (req.isAuthenticated() && req.user.role === "staff" ) {
      next();
    } else{
      res.redirect('/login');
    }
  }
  staff(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "staff") {
      if(req.user.status === "off" ||   req.user.password == ""){
        res.redirect('/login/first')
      }
      next();
    } 
    else {
      res.redirect('/login');
    }
  }
  admin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") {
      // console.log("admin");

      next();
    } else {
      // console.log("admin");
      res.redirect('/login');
    }
  }

}

module.exports = new AuthMiddleware();
