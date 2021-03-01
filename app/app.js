// server start: nodemon app.js
// load routes
// db config
const db = require("./config/database");
const config = require("./config/passport");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const express = require("express");

const app = express();
// passport config
config(passport);
// connect to mongoose
mongoose.connect(db.mongoURI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.log(err);
});

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');

// body parser middleware
// - parse application/x-www-form-urlencoded
// - parse application/json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true

}));

// add passport middleware
// it is very important to add this after the express session
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());


// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); // needed for flash to work
  res.locals.error_msg = req.flash('error_msg');     // needed for flash to work
  res.locals.error = req.flash('error');             // needed for flash to work
  res.locals.user = req.user || null;                // needed for passport login/logout to work
  next();
});

app.get('/', (req, res) => {
  const title = 'Welcome to ToDo!';
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});


// use routes
app.use('/users', users);
app.use('/todos', todos);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
