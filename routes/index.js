var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Posts' });
});

/* Login */ 
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* Login */ 
// router.post('/login', (req, res) => {
router.post('/login', function(req, res, next) {
  res.redirect('/posts');
});

/* Posts */
router.get('/posts', function(req, res, next) {
  res.render('posts', { title: 'Posts' });
});

/* Logout */
router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Logout' });
});

module.exports = router;
