var express = require('express');
var router = express.Router();
const LogService = require("../helpers/LogService");
const PostModel = require('../models/PostModel');

/* GET posts listing. */
router.get('/posts/', function(req, res, next) {
  PostModel.getAllPosts().then((posts) => {
    res.send(posts);
  });
});

/* DELETE a post */
router.delete('/posts/:id', function(req, res, next) {
  LogService.log('info', `User ${req.session.user.username} deleted post ${req.params.id}`);
  PostModel.deletePostByID(req.params.id);
  res.sendStatus(200);
});

/* POST a new post */
router.post('/posts/new', function(req, res, next) { 
    if (req.body.csrfToken !== req.session.csrfToken) {
        LogService.log('error', `User ${req.body.uname} failed to send a post, invalid CSRF token.`);
        return res.status(403).send('Invalid CSRF token');
    }
    const post_text = req.body.post_text;
    const time_posted = req.body.time_posted;
    const posted_by = req.body.posted_by;
    PostModel.addPostToDB(post_text, time_posted, posted_by);
    res.sendStatus(200);
});

module.exports = router;
