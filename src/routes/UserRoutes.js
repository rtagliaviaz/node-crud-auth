const {Router} = require('express');
const { check, validationResult} = require("express-validator");
const User = require("../models/UserModel");
const passport = require("passport");

//initialize
const router = Router();

//signup

router.get('/signup', (req, res) => {
  res.render('users/signup')
})

router.post('/signup', [  //check express
  check('username', 'Please enter a valid username').not().isEmpty(),
  check('email', 'please enter a valid email').isEmail(),
  check('password', 'please enter a valid pass').isLength({
    min: 6
  })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: 'user already exists'
        });
      }
      user = new User({
        username,
        email,
        password
      });
      user.password = await user.encryptPassword(password);
      await user.save();
      res.redirect('/login')
    } catch (error) {
      console.log(err.message);
      res.status(500).send('error in saving')
    }
});

//login
router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', [
  check('email', 'please enter a valid email').isEmail(),
  check('password', 'please enter a valid password').isLength({
    min: 6
  })
  ], passport.authenticate('local', {
  successRedirect: "/tasks",
  failureRedirect: "/signup"
  }));

//user/me
router.get('/tasks',(req, res) => {
  res.render('tasks/all')
});


//logout
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('succes_msg', 'You are logged out');
  res.redirect('/')
})

module.exports = router;