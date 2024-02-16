const passport = require('passport');
const AuthService = require('../service/AuthService');

class AuthController {
    
    default(req,res){
        res.redirect('/login');
    }

    index(req, res) {
        if (req.isAuthenticated()) {
            res.redirect(`/${req.user.role}/`);
        }
        // res.render('staff-tranaction', { layout: 'staff_layout.hbs'});
        res.render('login', { layout: false });
    }

    
    login(req, res, next) {
        passport.authenticate('local', (err, staff, info) => {
            if (err) throw err;
            if (!staff) {
                console.log("Staff not Found");
                req.flash('error_msg',"Login Fail ");
                res.redirect(`/login`);
            }
            else {
                req.logIn(staff, err => {
                    if (err) throw err;
                    req.flash('success_msg',"Login Success ");
                    res.redirect(`/${staff.role}/home`);
                });
            }
        })(req, res, next);
    }
    logout(req, res, next) {
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Error during logout");
            }
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/login');
            });
        });
    }
}
module.exports = new AuthController();
