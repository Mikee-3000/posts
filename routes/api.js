var express = require('express');
var router = express.Router();

/* GET posts listing. */
router.get('/posts/', function(req, res, next) {
  res.send('posts');
});

/* DELETE a post */
router.delete('/posts/:id', function(req, res, next) {
  res.send('posts');
});

/* POST a new post */
router.post('/posts/new', function(req, res, next) { 
  res.send('posts');
});

module.exports = router;
