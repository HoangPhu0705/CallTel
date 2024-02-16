const { log } = require('console');
const AuthService = require('../service/AuthService');

const LocalStrategy = require('passport-local').Strategy;



module.exports = function (passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await AuthService.findUserByUsername(username);  
            if (!user) {
                return done(null, false, { message: 'Tên người dùng không tồn tại' });
            }

            if (await AuthService.comparePassword(password, user.password)) {
                console.log("pass");

                return done(null, user);
            }
            else {
                console.log("not pass");
                return done(null, false, { message: 'Mật khẩu không đúng' });
            }
        }catch(err){
            console.log(err)
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        AuthService.findUserByID(id,  (err, user) => {
           done(err, user);
        });
    });
};
