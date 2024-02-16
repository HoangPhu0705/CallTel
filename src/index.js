const path = require("path");
require('dotenv').config();
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const {PORT,KEY_SESSION} = process.env;
const route = require("./routes");
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');

require('./app/auth/index')(passport);


db.connect();
const store = session.MemoryStore();
app.use(session({
  saveUninitialized: true,
  secret : KEY_SESSION,
  resave: false,
  cookie : {
    maxAge : 1000*2000
  },
  store 
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: false,
    helpers: {
      if_eq: function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
      }
    }
  }),

);


//SET VIEW ENGINE AND PATH TO TEMPLATE FOLDER
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
route(app);

app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);



