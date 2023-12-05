var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Posts' });
});

/* Login */ 
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Posts' });
});

/* Login */ 
// router.post('/login', (req, res) => {
router.post('/login', function(req, res, next) {
  res.redirect('/posts');
});

/* Posts */
router.get('/posts', function(req, res, next) {
  var posts = [
    {id: 1, username: 'John Doe', date: '12/05/2023', text: 'Hello, world!'},
    {id: 2, username: 'Jane Doe', date: '13/05/2023', text: 'Hello, universe!'},
    {id: 3, username: 'Jake Doe', date: '13/05/2023', text: 'Hello, universe!'},
    {id: 4, username: 'Jake Doe', date: '13/05/2023', text: 'Hello, universe!'},
    {id: 5, username: 'Jake Doe', date: '13/05/2023', text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."Hello, universe!'},
    {id: 6, username: 'Jake Doe', date: '13/05/2023', text: 'Hello, universe!'},
    {id: 7, username: 'Jake Doe', date: '13/05/2023', text: 'Hello, universe!'},
    {id: 8, username: 'Joan Doe', date: '13/05/2023', text: 'Hello, universe!'}
  ];
  res.render('posts', { title: 'Posts', posts: posts, userIsAdmin: false });
});

/* Logout */
router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Logout' });
});

module.exports = router;
