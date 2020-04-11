const {Router} = require('express');
const CrudModel = require('../models/CrudModel');
const {isAuthenticated} = require('../helpers/auth');

//initialize
const router = Router();


//routes
//read
router.get('/tasks', isAuthenticated ,async (req, res) => {
  const tasks = await CrudModel.find({user: req.user.id});
  try {
    // res.render('heroes/all', {heroes});
    res.render('tasks/all', {tasks})
  } catch (error) {
    res.status(500).send(error)
  }
});

//new task
router.get('/tasks/add', isAuthenticated, (req, res) => {
  // console.log('id', req.user.id)
  res.render('tasks/new-task');
});

router.post('/tasks/new-task', isAuthenticated, async (req, res) => {
  const task = new CrudModel(req.body);
  try {
    //guarda el id del user en la propiedad user del model
    task.user = req.user.id;
    await task.save();
    res.redirect('/tasks')
  } catch (error) {
    res.status(500).send(error);
  }
});

//edit task
router.get('/tasks/edit/:id', isAuthenticated, async(req, res) => {
  const task = await CrudModel.findById(req.params.id);
  if (task.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized!')
    return res.redirect('/tasks')
  }
  res.render('tasks/edit', {task});
});

router.put('/tasks/edit/:id', isAuthenticated, async(req, res) => {
  const task = req.body;
  try {
    await CrudModel.findByIdAndUpdate(req.params.id, task);
    res.redirect('/tasks')
  } catch (error) {
    res.status(500).send(error)
  }
});

//delete task
router.delete('/tasks/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await CrudModel.findByIdAndDelete(req.params.id)
    res.redirect('/tasks');    
  } catch (error) {
    res.status(500).send(error)    
  }
});




module.exports = router;