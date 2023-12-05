var express = require('express');
var router = express.Router();
const PostModel = require('../models/PostModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Posts' });
});

/* Login */ 
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Posts' });
});

/* Login */ 
router.post('/login', function(req, res, next) {
  res.redirect('/posts');
});

/* Posts */
router.get('/posts', function(req, res, next) {
  // change the date format to something more readable
  PostModel.getAllPosts().then((posts) => {
     posts.forEach(function(post) {
        var date = new Date(post.time_posted);
        post.time_posted = date.toLocaleString('en-IE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    });
    res.render('posts', { title: 'Posts', posts: posts, username: 'admin', userIsAdmin: true });
  });
});

/* Logout */
router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Logout' });
});

module.exports = router;
