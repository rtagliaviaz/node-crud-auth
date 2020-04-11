const express = require('express');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const userRoutes = require('./routes/UserRoutes');
const crudRoutes = require('./routes/CrudRoutes');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//initialize
const app = express()
require('./db');
require('./passport');

//settings
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs')
app.use(express.json());

//middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}))
app.use(methodOverride('_method'));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'secretKey'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  // res.locals.success_msg = req.flash('success_msg');
  // res.locals.error_msg = req.flash('error_msg');
  // res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//route
app.get('/', (req, res) => {
    res.render('index')
});
app.use(crudRoutes);
app.use(userRoutes);

//listen to server
app.listen(3000, () => {
  console.log('App listening on port 3000!');
});